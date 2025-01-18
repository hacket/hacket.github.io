---
title: "[Rust] 幽灵索引类型与匿名结构体"
date: 2024-4-26 17:16:35 +0800
categories: [杂记, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

## 幽灵索引类型

假设我们有一个这样的类型：

```rust
#[derive(Debug, Clone, Copy)]
struct Pair<T, U>(T, U);
```

并且，该类型保证 **`T` 与 `U` 始终不会是相同的类型**。那么，我们要如何设计一个统一的 `get()`  方法，使得下面的代码可以实现：

```rust
let pair = Pair(1, "hello");
let first: i32 = pair.get();            // 得到 1
let second: &'static str = pair.get();  // 得到 "hello"
```

不妨先停下来尝试一下再往下看。

有一种技术可以达成这个需求，它在 ["frunk"](https://crates.io/crates/frunk) 中被大量应用，被 "frunk" 称为**幽灵索引类型（Phantom Index Type）**。

具体来说，它大概长这样：

```rust
struct Pos0;
struct Pos1;

#[derive(Debug, Clone, Copy)]
struct Pair<T, U>(T, U);

trait Get<T, I> {
    fn get(self) -> T;
}

// `Pos0` 是幽灵索引类型
impl<T, U> Get<T, Pos0> for Pair<T, U> {
    fn get(self) -> T {
        self.0
    }
}

// `Pos1` 是幽灵索引类型
impl<T, U> Get<U, Pos1> for Pair<T, U> {
    fn get(self) -> U {
        self.1
    }
}

fn main() {
    let pair = Pair(1, "hello");
    let first: i32 = pair.get();
    let second: &'static str = pair.get();
}
```

我们定义了两个类型 `Pos0` 和 `Pos1`，但是并没有使用这两个类型的值，它们的作用仅仅是让我们可以多次 `impl Get for Pair`{:.language-rust}，就像是一个幽灵类型。而在 `main` 函数中，rust 可以仅通过元素的类型推导出这两个幽灵类型是什么，而不需要我们手动标注：

```rust
let first: i32 = pair.get();
// 解糖为：
let first = Get::<i32, _>::get(pair);
```

在 `Pair` 上只实现了 `Get<i32, Pos0>`{:.language-rust} 与 `Get<&'static str, Pos1>`{:.language-rust}，因此，此处 `Get<i32, _>`{:.language-rust} 可以由编译器推导出来 `_`{:.language-rust} 是 `Pos0` 而不会产生歧义。这也是为什么我们要求 `T` 与 `U` 必须是不同的类型，如果是 `Pair<i32, i32>`{:.language-rust}，那么它实现了 `Get<i32, Pos0>`{:.language-rust} 和 `Get<i32, Pos1>`{:.language-rust}，就不能仅通过 `i32`{:.language-rust} 来决定使用哪个实现了。

当然，你也可以将幽灵索引类型实现为泛型类型：

```rust
struct Pos<const N: usize>;

impl<T, U> Get<T, Pos<0>> for Pair<T, U> {
    fn get(self) -> T {
        self.0
    }
}

impl<T, U> Get<U, Pos<1>> for Pair<T, U> {
    fn get(self) -> U {
        self.1
    }
}
```

以此类推，我们可以为包含任何元素数量的结构体实现对其所有元素的 `get()`，只要它们的元素类型均不相同。

同样，我们还可以增加引用的获取：

```rust
trait Get<T, I> {
    fn get(self) -> T;
    fn get_ref(&self) -> &T;
    fn get_mut(&mut self) -> &mut T;
}
```

## 递归形式的异构列表

**异构列表（Heterogeneous List）**在 Rust 中的体现方式就是元组。然而，由于 Rust 尚未支持泛型可变参数，因此想要在元组上添加方法，必须不厌其烦地在每个长度的元组上分别实现。

为了解决这一问题，许多第三方库（包括 "frunk"） 提出了另一种递归形式的元组，具体来说，它长得像是：

```rust
struct Tuple<First, Other>(First, Other);
```

其中，`First` 是一个元素，而 `Other` 则是另一个元组，表现形式为：

```rust
(T0, T1, T2, T3)
// 转换为：
Tuple<T0, Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>>
// 也可以理解为是这样：
(T0, (T1, (T2, (T3, ()))))
```

这种递归形式通常不会增大内存占用，但是对实现泛型方法非常友好。

对于在这种结构之上的各种方法实现，可以参考 ["frunk" 的 `HCons`](https://docs.rs/frunk/latest/frunk/hlist/struct.HCons.html) 或我写的 ["tuplez"](https://docs.rs/tuplez/latest/tuplez/)。

现在，思考如何使用幽灵索引类型在异构列表上实现通用的 `get()` 方法。

"frunk" 使用的方法是泛型嵌套。具体来说，"frunk" 定义了下面两个类型：

```rust
struct Here;
struct There<T>(T);
```

首先，**对于异构列表 `Tuple<First, Other>`{:.language-rust}，为其实现 `Get<First, Here>`{:.language-rust}**。

举例来说，对于 `Tuple<T0, Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>>`{:.language-rust}，该类型实现了 `Get<T0, Here>`{:.language-rust}。

注意到，这个列表的第二个成员也是一个列表 `Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>`{:.language-rust}，因此显然这个成员实现了 `Get<T1, Here>`{:.language-rust}，依次类推，`Tuple<T2, Tuple<T3, Unit>>`{:.language-rust} 实现了 `Get<T2, Here>`{:.language-rust}，`Tuple<T3, Unit>`{:.language-rust} 实现了 `Get<T3, Here>`{:.language-rust}。

然后，**对于异构列表 `Tuple<First, Other>`{:.language-rust}，如果 `Other` 实现了 `Get<T, I>`{:.language-rust}，那么为其实现 `Get<T, There<I>>`{:.language-rust}**。

还是上面那个例子，由于 `Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>`{:.language-rust} 实现了 `Get<T1, Here>`{:.language-rust}，因此 `Tuple<T0, Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>>`{:.language-rust} 会实现 `Get<T1, There<Here>>`{:.language-rust}。

然而，这还没完，由于 `Tuple<T2, Tuple<T3, Unit>>`{:.language-rust} 实现了 `Get<T2, Here>`{:.language-rust}，因此 `Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>`{:.language-rust} 实现了 `Get<T2, There<Here>>`{:.language-rust}，这进一步导致 `Tuple<T0, Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>>`{:.language-rust} 实现 `Get<T2, There<There<Here>>>`{:.language-rust}。

以此类推，最终，在 `Tuple<T0, Tuple<T1, Tuple<T2, Tuple<T3, Unit>>>>`{:.language-rust} 上，实现了 `Get<T0, Here>`{:.language-rust}, `Get<T1, There<Here>>`{:.language-rust}, `Get<T2, There<There<Here>>>`{:.language-rust} 以及 `Get<T3, There<There<There<Here>>>>`{:.language-rust}。

注意到，对于每个元素而言，幽灵索引类型都各不相同，因此，只要该异构列表中没有类型相同的元素，那么 Rust 就可以仅通过元素类型来推断出该采用哪个实现：

```rust
struct Here;
struct There<T>(T);

#[derive(Debug, Clone, Copy)]
struct Unit;
#[derive(Debug, Clone, Copy)]
struct Tuple<First, Other>(First, Other);

trait Get<T, I> {
    fn get(self) -> T;
}

impl<First, Other> Get<First, Here> for Tuple<First, Other> {
    fn get(self) -> First {
        self.0
    }
}

impl<First, Other, T, I> Get<T, There<I>> for Tuple<First, Other>
where
    Other: Get<T, I>,
{
    fn get(self) -> T {
        self.1.get()
    }
}

fn main() {
    let tup = Tuple(114, Tuple("hello", Tuple(3.14, Unit)));
    let first: i32 = tup.get();
    let second: &'static str = tup.get();
    let third: f64 = tup.get();
    println!("{first}, {second}, {third}");
}
```
{: run="rust" }

我很少用优雅来形容什么，但我觉得这份实现确实配得上优雅一词。

## 匿名结构体

匿名结构体，或者也可以叫做具名元组。具体来说，本文中讨论的匿名结构体是一种类似元组的复合类型，它可以像元组一样承载任意数量的元素，并且像结构体一样为每个元素命名。并且，对于字段定义完全相同的两个匿名结构体，它们应当是相同的类型。

这并不是 Rust 的原生语法，第三方实现往往需要通过宏来完成。然而，即使是使用宏，也是一个巨大的挑战。

无论如何，我们不可能在每次调用宏时去定义一个结构体，因为在 Rust 中，定义两个具有完全相同的字段的结构体，也属于两个不同的类型。一些库使用了特别的办法，就是利用 "build.rs" 扫描源码，收集所有匿名结构体的调用，然后为每种匿名结构体在源码中生成全局唯一的类型，例如 ["structx"](https://crates.io/crates/structx/0.1.11)，但是这种方式十分复杂，已经脱离了 rust 语法的范畴。

那么，我们就需要预定义一个类型，让匿名结构体的字段成为该类型的泛型参数，这样，具有相同字段的匿名结构体就是同一个类型了。

我们很容易就能想到前面所说的异构列表，**我们可以将匿名结构体的每个字段都当成一个元素，将所有字段组成一个元组**，这样就满足了前面所有的要求。

为了方便起见，后文中我们**使用 `Tuple<T0, T1, ... Tn>`** 代替 `Tuple<T0, Tuple<T1, Tuple<...Tuple<Tn, Unit>>>>`，以避免过长的类型签名影响阅读体验。

既然我们将匿名结构体组织为异构列表，那么我们是不是也可以利用幽灵索引类型来实现字段访问呢？然而，在结构体中，不同的字段拥有相同的类型是非常常见的一件事，我们不能因此禁止匿名结构体中出现相同类型的字段。

但是，**对于每一个字段而言，确实有一个东西是独一无二的，不可能与其他字段相同，那就是它的名字**。如果我们能将每个字段的名字转换为一个独一无二的类型——我们称其为字段名类型，我们就可以借助字段名类型来让 Rust 正确推导幽灵索引类型。

实现这一点并不难，只需要使用过程宏，将字符串拆成 `char`{:.language-rust} 数组，然后将每个 `char`{:.language-rust} 用作一个泛型类型的常量泛型参数即可。具体来说，我们定义这样一个类型：

```rust
struct Character<const C: char>;
```

然后写一个过程宏 [`ident!`](https://docs.rs/stringz/latest/stringz/macro.ident.html)，它将 `ident!(hello)`{:.language-rust} 转换为：

```rust
(Character<'h'>, Character<'e'>, Character<'l'>, Character<'l'>, Character<'o'>)
```

那么对于不同的字段名，生成的对应类型必然是独一无二的。

然后，我们将每个字段的字段名类型和数据类型组合在一起当做一个异构列表元素，例如，`hello: T0` 字段被转换为 `(ident!(hello), T0)`{:.language-rust} 类型。这样一来，匿名结构体 `{ hello: T0, world: T1, man: T2 }`{:.language-rust} 将被转换为 `Tuple<(ident!(hello), T0), (ident!(world), T1), (ident!(man), T2)>`{:.language-rust}。

而当访问字段时，我们无需提供数据的实际类型，仅靠字段名就可以让 Rust 推导出我们想要取什么：

```rust
let (_, value): (ident!(hello), _) = object.get();
```

更具体的实现，可以参考 ["structz"](https://docs.rs/structz/latest/structz/) 的源码。
