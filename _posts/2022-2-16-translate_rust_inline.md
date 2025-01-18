---
title: "[译] Rust 中的内联"
date: 2022-2-16 9:58:35 +0800
categories: [翻译, "Rust"]
tags: [rust, 翻译]     # TAG names should always be lowercase
author: matklad
license: false
---

## 免责声明

本文是对原博文《[Inline In Rust](https://matklad.github.io/2021/07/09/inline-in-rust.html)》的无授权翻译转载，不享受任何著作权利，不用于任何商业目的，不以任何许可证进行授权，不对任何转载行为尤其是商业转载行为负责。一切权利均由原作者 [Aleksey Kladov](https://github.com/matklad) 保有。

本文中出现的所有第一人称均指代 Aleksey Kladov 而非译者本人。本文中对一些术语会额外附加英文原文注释，以帮助读者搜索相关概念。

## 前言

在 Rust 中有许多关于 [`#[inline]`](https://doc.rust-lang.org/reference/attributes/codegen.html#the-inline-attribute) 属性的部落知识（Tribal Knowledge）。我发现我经常教别人它是如何工作的，所以我最终决定将它写下来。

读者留心：这是我所知道的，并不一定是对的。此外，`#[inline]` 的确切语义并非一成不变，也许在未来的 Rust 版本中会发生变化。

## 为什么内联很重要？

内联是一种优化转换，它使用函数体替换函数调用。

举一个简单的例子，在编译期间，编译器可以将这段代码：

```rust
fn f(w: u32) -> u32 {
    inline_me(w, 2)
}

fn inline_me(x: u32, y: u32) -> u32 {
    x * y
}
```

转换为这样：

```rust
fn f(w: u32) -> u32 {
    w * 2
}
```

用 [Frances Allen](https://en.wikipedia.org/wiki/Frances_Allen) 和 [John Cocke](https://en.wikipedia.org/wiki/John_Cocke) 的《[A Catalogue of Optimizing Transformations](https://www.clear.rice.edu/comp512/Lectures/Papers/1971-allen-catalog.pdf)》来解释：

> 内联有很多明显的优势，其中两个：
>
> 1. 没有任何函数调用开销
> 2. 调用者和被调用者一起被优化。可以利用特定的参数值和关系：常量参数可以折叠到代码中，被调用者中的不变指令可以移动到调用者的不经常执行的区域，等等。

换而言之，提前编译好的语言内联乃是其余所有优化之母。它为编译器提供了必要的上下文以应用进一步的转换。

## 内联和分离式编译

内联与编译器中的另一个重要思想——分离式编译（Separate Compilation）相冲突。编译大型项目时，最好将它们拆分为可以独立编译的模块，以：

* 并行处理所有内容
* 对单个改变的模块进行范围增量重编译（Scope Incremental Recompilation）

为了实现分离式编译，编译器暴露函数签名，但是保持函数体对其他模块不可见，阻止内联。这种基本矛盾使得 Rust 中 `#[inline]`，而不单单是编译器内联函数的提示变得更加棘手。

## Rust 中的内联

Rust 中，一个独立的（分离式）编译单元是 crate。如果在 crate `A` 中定义了函数 `f`，则 `A` 中所有对 `f` 的调用都可以被内联，因为编译器可以完整访问 `f`。但是，如果从某个下游 crate `B` 调用 `f`，则此调用不能被内联。`B` 只能访问 `f` 的签名而不是它的函数体。

这就是 `#[inline]` 主要用法的来源——它支持跨 crate 内联。没有 `#[inline]`，即使是最微不足道的函数也不能跨过 crate 的边界被内联。好处并非没有成本——编译器通过为每一个调用 `#[inline]` 函数的 crate 都编译一份它的拷贝来实现上述功能，显著增加了编译时间。

除了 `#[inline]`，还有两个例外。泛型函数是隐式可内联的。实际上，编译器只有在知道实例化的特定类型参数时才能编译泛型函数。正如大家所知道的那样，在被调用的 crate 中，泛型函数的函数体必须始终可用。

另一个例外是链接时优化（LTO, Link-Time Optimization）。LTO 选择不参与分离式编译——它使所有函数的函数体都可用，但代价是编译速度慢得多。

## 实践中的内联

既然解释了底层语义，就可以推断出一些使用 `#[inline]` 的准则。

*首先*，不管三七二十一地使用 `#[inline]` 绝非良策，因为这会使得编译时间更加糟糕。如果您不关心编译时间，一个更好的办法是在 [Cargo 配置文件](https://doc.rust-lang.org/cargo/reference/profiles.html#lto)中设置 `lto = true`。

*其次*，通常不需要为私有函数应用 `#[inline]`——在一个 crate 内部，编译器通常会做出更好的内联策略。有一个[笑话](https://twitter.com/ManishEarth/status/936084757212946432)说的是 LLVM 对于何时应该内联函数的捷思法（Heuristic）是“是”。

*第三*，在构建应用时，当分析显示某个特定的小函数是瓶颈时才被动地使用 `#[inline]`。考虑在发布时使用 lto。主动 `#[inline]` 不重要的公有函数可能是有意义的。

*第四*，在构建库时，主动给小型的非泛型函数添加 `#[inline]`。特别注意实现 `Deref` 和 `AsRef` 类似的东西经常受益于内联。库无法预知所有的使用，不要过早地对未来的使用者抱有悲观态度才是正确的。请注意 `#[inline]` 不具有传递性：如果一个不重要的公有函数调用了一个不重要的私有函数，你应该同时 `#[inline]` 二者。参阅[此基准](https://github.com/matklad/benchmarks/tree/91171269f0a6e260a27111d07661021a89d20085/rust-inline)（Benchmark）以了解更多。

*第五*，考虑通用函数。说泛型函数是隐式内联的并没有错。因此，它们通常是导致代码膨胀的原因。应当编写通用函数，尤其是在库中，以尽量减少不需要的内联。举一个 [wat](https://github.com/bytecodealliance/wasm-tools/blob/0486fb4de505b8116a0034bdde4918cd783325b9/crates/wat/src/lib.rs#L214-L222) 的例子：

```rust
// 公有泛型函数
// 处理不当会导致代码膨胀！
pub fn parse_str(wat: impl AsRef<str>) -> Result<Vec<u8>> {
  // 立即委托给非泛型函数。
  _parse_str(wat.as_ref())
}

// 分离式编译的友好的私有实现。
fn _parse_str(wat: &str) -> Result<Vec<u8>> {
    ...
}
```

## 参考列表

1. [Language Reference](https://doc.rust-lang.org/reference/attributes/codegen.html#the-inline-attribute)。
2. [Rust performance book](https://nnethercote.github.io/perf-book/inlining.html)。
3. @alexcrichton [解释 inline](https://github.com/rust-lang/hashbrown/pull/119#issuecomment-537539046)。请注意，实际上编译时间成本比我描述的要糟糕——内联函数是基于单个 codegen-unit 而不是单个 crate 编译的。
4. [更多 @alexcrichton](https://users.rust-lang.org/t/enable-cross-crate-inlining-without-suggesting-inlining/55004/9?u=matklad)。
5. [仍是 @alexcrichton](https://internals.rust-lang.org/t/inlining-policy-for-functions-in-std/14189/10?u=matklad)。

在 [r/rust](https://old.reddit.com/r/rust/comments/oh4s2j/blog_post_inline_in_rust/) 中讨论。

现在有一个后续的帖子：[并不总是 iCache]({{ site.baseurl }}{% link _posts/2022-2-17-translate_not_always_icache.md %})

> 这个帖子是 [One Hundred Thousand Lines of Rust](https://matklad.github.io/2021/09/05/Rust100k.html) 系列的一部分。
{: .prompt-info }
