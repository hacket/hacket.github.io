---
title: "[译] 改变 Rust 的规则"
date: 2024-1-12 11:42:34 +0800
categories: [翻译, "Rust"]
tags: [rust, 翻译]     # TAG names should always be lowercase
author: withoutboats
license: false
---

## 免责声明

本文是对原博文《[Changing the rules of Rust](https://without.boats/blog/changing-the-rules-of-rust/)》的无授权翻译转载，不享受任何著作权利，不用于任何商业目的，不以任何许可证进行授权，不对任何转载行为尤其是商业转载行为负责。一切权利均由原作者 "[Without boats, dreams dry up](https://github.com/withoutboats)" 保有。

本文中出现的所有第一人称均指代原作者 "Without boats, dreams dry up" 而非译者本人。本文中对一些术语会额外附加英文原文注释，以帮助读者搜索相关概念。

## 前言

在 Rust 中，某些关于什么是健全的（Sound）、什么是不健全的 API 决策会影响所有 Rust 代码。也就是说，若已经决策允许或不允许具有某些安全要求的类型，那么现在所有用户都要遵守该决策。他们甚至无法仅是使用一个具有不同规则的 API：所有 API 都必须符合这些规则。

这些规则是通过某些标记（Marker）trait 来确定的。如果一个安全 API 可以对某类型的值执行某些操作，且对于某些类型而言不支持该操作，则该 API 必须受到该标记 trait 的约束（Bound），以便用户无法将不支持该行为的类型的值传递给该 API。相反，如果 Rust 允许 API 在任何类型上执行该行为而无需任何标记 trait 约束，那么就不能存在不支持该行为的类型。

我将给出 Rust 在不同的点上考虑的三个例子来说明我的意思，尽管在 Rust 中实际上只存在第一个。

## Rust 的规则

### `Send`

假设您希望 Rust 支持无法跨线程发送的类型。有几个例子可以说明您为什么需要这样做：

* 该类型提供共享所有权，无需将内部的可变写入同步到引用计数（例如，`Rc`）
* 该类型可能封装了不保证线程安全的操作系统 API（例如Args，MutexGuard）

为了支持这一点，您将包含一个名为 `Send` 的标记 trait，它是可以跨线程发送的类型集合。任何可能向另一个线程发送值的 API 都需要包含一个 `Send` 约束，例如：

* `thread::spawn`{:.language-rust}，它产生一个线程
* `rayon::join`{:.language-rust}，它在线程池上运行两个任务
* `tokio::spawn`{:.language-rust}，这可能会将此任务移动到执行器的另一个线程

当然，Rust 选择支持无法跨线程发送的类型，因此它有一个 `Send` 约束。但是作为替代方案，Rust 也可以简单地选择所有类型都必须支持跨线程发送，并且所有内部可变性都需要同步。事实上，这个 `Send` trait 是标准库完全强制执行的决策：其他人可以发布一个 "alternative libcore"，它可以在不改变 rustc 的情况下强加这一要求，尽管它与存在于这个世界上的任何 Rust 代码都不兼容。

### `Move`

假设您希望 Rust 支持一旦地址被看见就无法在不运行其析构函数的情况下失效的类型。这是“不可移动类型”（Immoveable Type）的一种古怪而具体的定义，但它恰好完全适配无栈协程（Stackless Coroutine）和侵入式数据结构（Intrusive Data Structure）的要求。

为了支持这一点，您将包含一个名为 `Move` 的标记 trait，它是可以自由移动的类型集合。不同于 `Send`，`Move` 需要一些语言级支持：我认为实现它的最简单方法是，如果类型不实现 `Move`，则获取其地址的操作将拿走该类型的所有权（因此 `let x = &mut y;`{:.language-rust} 会拿走 `y` 的所有权，有效地阻止您再次移动它）。而 `Box` 让您可以从中移出的神奇行为（译者注：这里应该指的是 `Box::into_inner`{:.language-rust}）也同样需要受到 `Move` 约束。

此外，某些 API 需要受 `Move` 约束，这样您就可以通过引用进行移动，例如：

* `mem::swap`{:.language-rust} 允许您交换两个可变引用后面的值
* `mem::replace`{:.language-rust} 允许您将可变引用后面的值替换为另一个值

你会注意到 Rust 没有 `Move` trait；相反，它使用指针类型的包装器 `Pin` 提供相同的保证。尽管该 `Move` trait 可能是一个更容易使用的 API，但事实证明很难以向后兼容的方式添加它（我稍后会解释原因），相反，在需要这些语义的新接口中只有 `Pin` API 被添加和使用。

### `Leak`

假设您希望 Rust 支持在不运行其析构函数的情况下不能离开作用域的类型。这是“线性类型”（Linear Type）的两种不同定义之一，比另一种定义（也会阻止析构函数运行，要求类型被解构作为其最终结局）的表达能力更差，但它是二者中更容易被添加到语言中（因为它和泛型配合得更好）的那个，并且它支持线性类型所有最引人注目的用例。

为了支持这一点，您将包含一个名为 `Leak` 的标记 trait，它是在不运行其析构函数的情况下可以超出作用域的类型集合。类似 `Send` 但与 `Move` 不同，这根本不需要任何语言级支持：您不可能泄漏 Rust 中的值，必须使用标准库 API 来做到这一点。

某些 API 必须受 `Leak` 约束：

* 总是泄漏值的 API（`mem::forget`{:.language-rust}）
* 让您负责运行析构函数的 API（`ManuallyDrop::new`{:.language-rust}）
* 允许循环共享所有权并可能意外泄漏值的 API（`Rc::new`{:.language-rust}, `Arc::new`{:.language-rust}）

当然，Rust 不具备这个 `Leak` trait，但它差点就具备了。这个讨论在 2015 年初达到了高潮，当时 Rust 使用的作用域线程 API 被发现不健全，因为它的安全性依赖于它的保护类型永不泄漏。我们决定（有些匆忙，因为 1.0 版本计划在争议发生后的几个月内发布）Rust 不支持不能泄漏的类型，因此不会添加该 `Leak` trait。

## 改变规则

人们对 Rust 支持线性类型重新产生了兴趣，特别是因为我所说的[作用域任务三难困境](https://without.boats/blog/the-scoped-task-trilemma/)只是因为析构函数无法保证运行这一事实而成立。与不可移动类型不同，没有独立的 API 能够支持保证析构函数将会运行，就像 `Pin`（如果您从不放弃对象的所有权并使用一种闭包传递样式，则可以保证析构函数将运行，但这对于“作用域任务”（Scoped Task）用例来说是不够的）。所以一些用户希望看到 Rust 添加 `Leak` trait。

有两种可能的方式将标记 trait `Leak` 添加到 Rust 中：

* **自动 trait**：您可以添加新的自动 trait，就像 `Send` 和 `Sync`
* `?Trait`：您可以添加一个新的 `?Trait`，就像 `Sized`

其中每一种都带来了向后兼容性方面的一些挑战。

### 自动 trait

乍一看，添加自动 trait 似乎是向后兼容的更改。您添加了一个新 trait `Leak`，它表示类型可能会泄漏。未实现此 trait 的类型在不运行其析构函数的情况下不能超出作用域。因为今天 Rust 中的所有类型都必然可以被泄漏（这是决定不具有 `Leak` trait 的后果），所以所有类型都可以实现 `Leak`。这是自动 trait 的语义，所以听起来它应该工作得很好。

当您向可用于泄漏值的 API 添加约束时，问题就出现了，例如 `mem::forget`{:.language-rust}。如果你想让没有实现 `Leak` 的类型不会被泄漏，你需要添加一个约束到 `mem::forget`{:.language-rust}。但有两种方式不向后兼容。

首先，它不适用于泛型。这段代码现在是合法的，但如果您添加一个 `Leak` 绑定就会破坏 `mem::forget`{:.language-rust}：

```rust
pub fn forget_generic<T>(value: T) {
    mem::forget(value);
}
```

这是因为该函数的类型参数没有 `Leak` 约束。将这样的约束添加到 API `mem::forget`{:.language-rust}（或任何其他可以“忘记”值的 API）将是一个破坏性修改（Breaking Change）。它不向后兼容的另一种方式是 trait 对象类型将不会实现 `Leak`，除非它们添加 `+ Leak`。trait 对象类型不会通过自动 trait 的方式继承实现，因为您实际上并不知道 trait 对象是什么类型。因此像 `dyn Future`{:.language-rust} 这样的 trait 对象不会实现 `Leak`。例如：

```rust
pub fn forget_trait_object(object: Box<dyn Display>) {
    mem::forget(object);
}
```

### `?Trait`

因此，如果添加自动 trait 不向后兼容，我们就只能寻求 `?Trait` 解决方案。但这里也存在问题。

从最严格的意义上来说，添加新的 trait `?Leak` 是向后兼容的。您可以放宽其他 API 的约束，而不是像 `mem::forget`{:.language-rust} 那样向 API 添加新的约束。所以上面的所有代码都可以，因为要创建一个采用线性类型的泛型函数，您必须编写一个 `?Leak` 约束。

对于像 `Leak` 这样的东西来说，第一个问题是 Rust 中的绝大多数通用 API 不可能忘记它们的值；毕竟，尽管内存泄漏不是未定义的行为，但它们仍然是不可取的并且大多数情况下是可以避免的。这与 `Sized` 的情况完全不同：因为按值传递某些内容需要 `Sized`，而 Rust 中的大多数通用 API 都需要 `Sized`，因此 `?Sized` 约束相对较少。相比之下，添加 `?Leak` 会在整个生态系统中造成永久性的伤痕，因为绝大多数泛型都会受到 `T: ?Leak` 约束。

不过，第二个问题更大：`?Traits` 和关联类型之间的交互意味着向关联类型添加 `?Trait` 约束是一项破坏性修改。这意味着标准库中的任何稳定的关联类型都无法获得 `?Leak` 约束。

考虑这个例子：

```rust
pub fn forget_iterator(iter: impl Iterator) {
    iter.for_each(mem::forget);
}
```

这将忘记迭代器的每个元素，即使从未提及其关联类型 `Iterator::Item`{:.language-rust}。因此，`Iterator::Item`{:.language-rust} 必须实现 `Leak`。编译器被允许假设每个迭代器的元素都实现了 `Leak`，并且使该假设无效化将是一个破坏性修改。

其影响是深远的。如果 `Leak` 作为 `?Trait` 添加，所有这些事情对于线性类型来说都是不可能的：

* `Iterator`：您无法构造线性类型的迭代器。
* `Future`：您无法构造一个评估为线性类型的 `Future`（因此您无法从异步函数返回线性类型）。
* `Deref`：您无法解引用包含线性类型的 Box，也无法解引用线性类型向量到线性类型切片或任何其他智能指针类型。
* `Index`：您无法对线性类型的集合进行索引，因此无法对线性类型的切片或具有线性值的映射进行索引。
* `Add`/`Sub`/`Mul`/`Div`：不能将线性类型作为任何重载算术运算符的输出值。

一组特殊的关联类型是 `Fn` traits 的返回值。Rust 项目特意让引用这些 trait 的关联类型 `Output` 变得困难，以便将来可以灵活地改变这一点。尽管如此，过去在尝试 `Move` trait 时还是遇到了某些问题。我不清楚其他 trait（例如 `Leak`）是否会遇到这些问题，或者这些问题是否特定于 `Move` 的内置语义。

基本上，选择添加一个新的 `?Trait` 需要一个非常陡峭的权衡——特别是那些与很多约束无关的语法，就像 `Leak`——因为您将向各种各样的通用接口添加令人困惑的新语法，以获取一个非常有限的新特性。我会考虑对诸如 `?Leak` 采用糟糕的成本效益分析（Cost-Benefit Analysis），即使我们确实承认当前的 Rust 规则是“错误的”并且我们希望 Rust 具有线性类型。

### Edition

最后需要考虑的是 edition 机制。是否有可能使用 edition 机制来引入这些 trait 之一？也许。

每个 edition 实际上都形成了 Rust 的一种“方言”，所有这些 edition 都由同一个编译器支持。因此，乍一看，在 Rust 的一种方言中，所有类型都可以被忘记，而在另一种方言中，存在 `Leak` trait，这听起来似乎是合理的。问题在于，对 edition 的硬性要求是一个 edition 的 crate 可以依赖于另一个 edition 的 crate，因此从一个 edition 到下一个 edition 的升级是无缝且自主的。

考虑一下 Rust 项目决定在 2024 edition 中添加该 `Leak` trait。2021 edition 中的所有代码都仍然需要有效——包括我上面展示的示例中的代码。诚然，您可以使用像 Cargo Fix 这样的工具在任何地方添加 `Leak` 约束以期望用户在转到 2024 edition 时一身轻松，但 2021 edition 的代码需要在不修改的情况下工作。

可能做到这一点的一种方法是使 trait 一致性取决于 edition，以便在 2024 edition 之前，每种类型都满足 `Leak` trait，甚至是绝对不应该满足的类型，例如无约束泛型和不涉及 `Leak` 的 trait 对象类型。如果在 2024 edition 之前，所有类型都实现 `Leak`，那么添加的约束将永远不会失败。

然而——这是本节的一个重大警告——这将依赖于编译器有效地实现某种牢不可破的防火墙，以防止未实现 `Leak` 的类型与 2024 edition 之前的代码一起使用。这意味着：

* 任何时候 2024 edition 之后的代码从 2024 edition 之前的代码实例化泛型时，都需要检查它实例化的类型是否实现了 `Leak`，即使 2024 edition 之前的代码没有这样的限制。
* 任何时候 2024 edition 之前的代码调用 2024 edition 之后的代码时，都需要检查从该 API 获取的类型是否实现了 `Leak`（根据 2024 edition 规则）。请注意，标准库将被视为 2024 edition 后的代码，因此对标准库 API 的每次调用都将涉及检查 2024 edition 前版本中类型的 `Leak`。

我不知道这是否可以实现，可能至少会对 2024 edition 之前的代码的编译时间产生非常糟糕的影响，并且最开始可能会导致转换十分困难。但从长远来看，至少它会保持 `Leak` 在“正确”状态（作为自动 trait，可以正确地与旧的关联类型一起使用，而不是作为 `?Trait`）。

## 应该做什么

如果我能回到 2015 年，我想我可能会将 `Move` 和 `Leak` 都添加到 Rust 中。团队在决定不添加它们时强调了一些缺点：任何需要满足这些约束的 trait 对象类型都需要添加 `+ Move` 或 `+ Leak` 到其定义中。拥有两个具有如此全局意义的自动 trait（`Send` 和 `Sync`）已经被认为是一种负担。

但老实说，在我的印象中（我当时不在场）排除 `Leak` 的决定至少部分是出于权宜之计：我的理解是，Mozilla 的 Rust 团队承受着来自管理层的巨大压力，要求在他们设定的最后期限发布 1.0，这可能会影响他们决定不在最后时刻对规则进行任何可能影响到最后期限的更改。

在具有 `Leak` 的语言中，作用域任务三难困境将不存在，更简单的作用域线程 API 将是安全的，GC 集成可能会更容易，而且我得到的印象是许多系统 API 可以更容易地安全包装（尽管我不知道这个细节）。

在具有 `Move` 的语言中，`Pin` 类型不需要存在，因此用户在处理它时不会有如此烦恼，并且所谓的 “pin projections”（译者注：请参考 [pin 文档](https://doc.rust-lang.org/std/pin/#projections-and-structural-pinning)）不会成为需要宏来解决的问题，并且制作自引用生成器（Generator）不会给 `Iterator` trait 带来任何并发症。

然而，现在做出这些改变是一个更加棘手的问题。我认为基于 edition 的技术是添加新的、全局相关的标记 trait 的唯一可行的解​​决方案（除了某些独特的例外，例如 `DynSized`，此处未讨论）。我认为有各种各样的理由认为这行不通——实施起来太困难了，实施起来会有太多健全性漏洞，过渡太具有破坏性，实际上完全不可能，因为我错过了一些重要的事情。

这就是为什么我很高兴我们找到了不可移动类型的 `Pin` 解决方案，并且能够在合理的时间范围内在它们之上提供自引用 future 和 async/await 语法，而不会对所有现有用户造成重大干扰。当谈到 `Leak` 和线性类型时，我只是感到绝望。
