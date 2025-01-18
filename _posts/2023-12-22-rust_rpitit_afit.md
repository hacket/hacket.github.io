---
title: "于 Rust 1.75 稳定的 RPITIT 与 AFIT"
date: 2023-12-22 17:51:11 +0800
categories: [教程, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

## RPIT

在说 RPITIT 和 AFIT 之前，我们需要首先了解 RPIT，即：**Return Position `impl Trait`{:.language-rust}**。该特性又被称为 **Abstract Return Types**，简单来说，就是允许在函数的返回值类型中使用 `impl Trait`{:.language-rust} 的形式替代具体类型，例如：

```rust
fn test_rpit() -> impl Iterator<Item = i32> {
    [1, 2, 3, 4].into_iter()
}
```

更常见的使用方法是返回一个闭包，因为我们无法写出闭包的具体类型，因此我们可以通过 RPIT 间接表示其类型：

```rust
fn test_rpit(a: i32) -> impl Fn(i32) -> i32 {
    move |x| x + a
}
```

需要注意的是：**RPIT 并不是泛型**，它只是某个特定类型的装箱类型，这意味着下面的代码实际上是无法通过编译的：

```rust
use std::fmt::Display;
// impl Display 实际是 i32 类型的装箱，无法接受 &str 的返回值
fn test_rpit(cond: bool) -> impl Display {
    if cond {
        return 114514;
    }
    "hello world"
}
```

## GAT

GAT 即**泛型关联类型（Generic Associated Types）**，GAT 的稳定是 RPITIT 可以稳定的先决条件。GAT 于 Rust 1.65 稳定，简单来说，GAT 允许您在关联类型处使用泛型（类型、生命周期、常量），例如，我们写一个 trait 表示可以将内部类型进行转换的容器类型：

```rust
trait ConvertTo: Sized {
    type Inner;
    type Output<Item>
    where
        Item: From<Self::Inner>;

    fn convert_to<U>(self) -> Self::Output<U>
    where
        U: From<Self::Inner>;
}
```

这样，`convert_to` 的泛型类型参数 `U` 和关联类型 `Output` 的泛型类型参数绑定在了一起：

```rust
impl<T> ConvertTo for Option<T> {
    type Inner = T;
    type Output<Item> = Option<Item> where Item: From<Self::Inner>;

    fn convert_to<U>(self) -> Self::Output<U>
    where
        U: From<T>,
    {
        self.map(|t| U::from(t))
    }
}

fn main() {
    let a: Option<i8> = Some(12i8);
    let b: Option<i32> = a.convert_to();
    let c: Option<f64> = a.convert_to();
    dbg!(a, b, c);
}
```

## RPITIT

前置知识已经了解，是时候来说说 RPITIT 了。它的全名叫做 **Return Position `impl Trait`{:.language-rust} In Traits**，从名字不难看出，它本质是 RPIT 的延伸：允许在 trait 中使用 RPIT。例如：

```rust
trait GetClosure: Sized {
    type Input;
    type Output;

    fn get_closure(&self, input: Self::Input) -> impl Fn(Self::Input) -> Self::Output;
}
```

从使用上看，RPITIT 和 RPIT 唯一的区别就是它在一个 trait 的定义中，那么为什么 RPITIT 这么晚才稳定呢？

最大的原因在于，RPIT 实际是对某个特定类型的装箱，但是在 trait 中，我们无法决定 RPITIT 具体是对哪个类型的装箱，并且，我们也不能依赖某个具体类型 `impl Trait`{:.language-rust} 反向推导它是什么类型。因此，Rust 对 RPITIT 的规定是，对于某个特定类型的 `impl Trait`{:.language-rust}，该 RPITIT 的类型是对某一特定类型的装箱；但是对于不同类型之间，RPITIT 的具体类型可以不同。用例子来说的话就是：

```rust
trait GetClosure: Sized {
    type Input;
    type Output;

    fn get_closure(&self, input: Self::Input) -> impl Fn(Self::Input) -> Self::Output;
}

struct S1;
struct S2;

impl GetClosure for S1 {
    type Input = i32;
    type Output = i32;

    fn get_closure(&self, input: Self::Input) -> impl Fn(Self::Input) -> Self::Output {
        move |x| x + input
        // 由于 RPITIT 对于 S1 而言是一个特定类型的装箱，
        // 因此下面的代码是无法通过编译的，
        // 因为它实质返回了两个不同类型的闭包：
        // if true {
        //     move |x| x + input
        // } else {
        //     move |x| x + input + 1
        // }
    }
}

impl GetClosure for S2 {
    type Input = String;
    type Output = String;

    fn get_closure(&self, input: Self::Input) -> impl Fn(Self::Input) -> Self::Output {
        // 但是，对于 S1 和 S2 这两个不同类型的实现而言，
        // RPITIT 的装箱类型可以不同，所以这里并不会报错。
        // 因此，它的行为类似于关联类型或 GAT。
        move |mut x| {
            x.push_str(&input);
            x
        }
    }
}
```

我们很容易就发现，RPITIT 看起来跟关联类型几乎就是同一回事，而 RPITIT 也支持泛型，因此泛型的 RPITIT 实质跟 GAT 看起来是同一回事。事实上，[根据 RFC 的讲解](https://rust-lang.github.io/rfcs/3425-return-position-impl-trait-in-traits.html)，**RPITIT 确实解糖为关联类型或 GAT**。

## AFIT

在了解 AFIT 之前，我们需要知道 Rust 的 `async fn`{:.language-rust} 实际上解糖到 RPIT，具体来说：

```rust
async fn get_one() -> i32 {
    1
}

// 近似于解糖到：
fn get_one() -> impl Future<Output = i32> {
    async { 1 }
}
```

而 AFIT，即 **`async fn`{:.language-rust} In Traits**，顾名思义，就是定义在 trait 中的 `async fn`{:.language-rust}：

```rust
trait AsyncTrait {
    async fn get_one() -> i32;
}
```

由于 `async fn`{:.language-rust} 解糖到 RPIT，因此，我们很容易就能想到，AFIT 就是解糖到 RPITIT。那么，我们就很容能够理解为什么 AFIT 和 RPITIT 在同一个版本稳定。
