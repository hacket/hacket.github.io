---
title: Rust 不透明类型上的生命周期
date: 2024-2-18 18:24:47 +0800
categories: [杂记, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

> 此文撰写于 Rust stable 1.76.0（即 nightly 1.78.0）版本，由于 nightly 特性不受到 Rust 开发团队的保证，请谨慎甄别本文内容是否仍然适用。
{: .prompt-warning }

## 抛出问题

在最前面，我们首先抛出一个问题，为什么下面的代码无法编译？

```rust
use std::fmt::Debug;

fn do_sth<F, Ret>(f: F)
where
    F: Fn(&i32) -> Ret,
    Ret: Debug,
{
    let a = 1;
    f(&a);
}

fn foo(t: &i32) -> impl Debug + '_ {
    t
}

fn do_foo() {
    do_sth(foo);
}
```

尝试编译得到报错：

```plaintext
error[E0308]: mismatched types
  --> src/main.rs:17:5
   |
12 | fn foo(t: &i32) -> impl Debug + '_ {
   |                    ---------------
   |                    |
   |                    the expected opaque type
   |                    the found opaque type
...
17 |     do_sth(foo);
   |     ^^^^^^^^^^^ one type is more general than the other
   |
   = note: expected opaque type `impl for<'a> Debug + '_`
              found opaque type `impl Debug + '_`
   = note: distinct uses of `impl Trait` result in different opaque types
note: the lifetime requirement is introduced here
  --> src/main.rs:5:20
   |
5  |     F: Fn(&i32) -> Ret,
   |                    ^^^

For more information about this error, try `rustc --explain E0308`.
error: could not compile `fuck_rust` (bin "fuck_rust") due to 1 previous error
```

## HRTBs

阅读本文之前，你需要了解什么是 **HRTBs（Higher-Rank Trait Bounds）**，由于我之前已经写过两篇文章讲解 HRTBs，因此不再重新介绍一次：

[从实例看 Rust 的 HRTBs]({{ site.baseurl }}{% link _posts/2022-1-5-rust_hrtbs.md %})

[从另一个视角看 Rust HRTBs]({{ site.baseurl }}{% link _posts/2024-2-2-rust_hrtbs_essence.md %})

## 不透明类型与隐含的生命周期

什么是**不透明类型（Opaque Types）**？不透明类型是 Rust 底层的一种概念，它表示这里存在某个特定的类型，我们不知道或者说不关心它具体是啥，但是我们知道它的一些性质。不透明类型的最典型应用就是 **RPIT（Return Position `impl Trait`{:.language-rust}）**，它允许使用者在函数签名中不写明返回值的真正类型，而是使用 `impl Trait`{:.language-rust} 代替它，这样，我们可以返回一些无法写出具体类型的值，例如闭包和 async block：

```rust
fn test_rpit(a: i32) -> impl Fn(i32) -> i32 {
    move |x| x + a
}
```

但是不透明类型有一个问题：**如果原始类型携带生命周期，那么它可能会隐含一个生命周期参数**，就像我们上面的 `foo` 函数那样：

```rust
fn foo(t: &i32) -> impl Debug + '_ {
    t
}
```

该 `impl Trait + '_`{:.language-rust} 是一种语法糖，脱糖后为：

```rust
fn foo<'a>(t: &'a i32) -> impl Debug + 'a {
    t
}
```

那么在泛型中呢？泛型类型也是事实上的不透明类型，Rust 并不知道它实际对应的是什么类型，包不包含生命周期，因此，**Rust 对所有泛型类型 `T` 都假设为 `for<'a> T: 'a`{:.language-rust}**。若是将 Rust 隐含实现的 HRTBs 展开，那么上面的 `do_sth` 函数长这样：

```rust
fn do_sth<F, Ret>(f: F)
where
    for<'a, 'b> F: (Fn(&'b i32) -> Ret) + 'a,
    for<'a> Ret: Debug + 'a,
{
    let a = 1;
    f(&a);
}
```
{: highlight-lines="3,4" }

这很好，事实上对于大部分类型来说都没有什么问题。如果类型实际不包含生命周期，那么 `for<'a>`{:.language-rust} 的引入不会有任何影响；而对于自带生命周期类型的类型，由于 HRTBs 的存在，它的生命周期也会自动匹配上 `'a`{:.language-rust}。

如果不透明类型的生命周期不依赖其他类型的生命周期，那么它就能够满足 `for<'a> T: 'a`{:.language-rust} 的约束，因此，将 `foo` 函数改成下面这样是可以通过编译的，因为此时不透明类型的生命周期与 `&i32`{:.language-rust} 无关：

```rust
fn foo(_t: &i32) -> impl Debug + 'static {
    &1
}
```

那么原本的 `foo` 有啥问题呢？问题就出在**一个不透明类型它不仅包含一个生命周期，而且它的生命周期还依赖另一个类型的生命周期**。事实上，我们回看展开了 HRTBs 的 `do_sth` 函数，我们就会发现一些端倪。具体来说，**对于 `F` 和 `Ret`，它们由 HRTBs 引入的生命周期是互相独立的**，两个类型之间没有产生生命周期上的联系。但实际上，**我们希望 `Ret` 的生命周期 `'a`{:.language-rust} 与 `F` 的生命周期 `'b`{:.language-rust} 是同一个生命周期**。（即使你把 `'a`{:.language-rust} 和 `'b`{:.language-rust} 换个位置，变成 `for<'a, 'b> F: (Fn(&'a i32) -> Ret) + 'b`{:.language-rust}，也无法和 `for<'a> Ret`{:.language-rust} 的生命周期关联在一起，这两个 `'a`{:.language-rust} 是互相独立的。）

那么要如何解决这个问题呢？当然，一个最简单的办法就是让 Rust 支持下面这种写法：

```rust
fn do_sth<F>(f: F)
where
    for<'a> F: Fn(&'a i32) -> (impl Debug + 'a),
{
    let a = 1;
    f(&a);
}
```
{: highlight-lines="3" }

遗憾的是，即使是使用 nightly 版本，也无法编译这种代码，关于该语法的讨论，见 [rust-lang/rust#93082](https://github.com/rust-lang/rust/pull/93082)。但是这给我们提供了一种思路：如果我们有办法去掉 `Ret` 泛型，将两个约束压缩为一个约束，那么我们或许就有办法将二者的生命周期联系在一起。

## TAIT

第一种方法是 **TAIT（Type Alias `impl Trait`{:.language-rust}）**，它允许我们**为不透明类型定义别名**：

```rust
#![feature(type_alias_impl_trait)]
type S = impl Trait;
```

**此 `S` 类型并不是泛型**，它会根据第一次使用它的地方自动推导为某个特定类型。因此，当我们使用 TAIT 替换掉 `Ret` 泛型时，需要将 `foo` 函数的返回值类型改成该 TAIT 类型名，这样才能让 Rust 推导其类型：

```rust
#![feature(type_alias_impl_trait)]

use std::fmt::Debug;

type DebugOpaque<'a> = impl Debug + 'a;

fn do_sth<F>(f: F)
where
    for<'a> F: Fn(&'a i32) -> DebugOpaque<'a>,
{
    let a = 1;
    f(&a);
}

fn foo(t: &i32) -> DebugOpaque<'_> {
    t
}

fn do_foo() {
    do_sth(foo);
}
```
{: highlight-lines="5,9,15" }

然而，正如前面所说，类型 `DebugOpaque` 并不是泛型，而是由 `foo` 函数的实际返回值类型推导而来，这也导致了 `DebugOpaque` 被固定推导为了 `&i32`{:.language-rust}，从而令 `do_sth` 函数无法接收返回其他类型的函数作为参数。

因此，更推荐使用下面的方法。

## Unboxed Closure

这种方法依赖 **Unboxed Closures** 特性，具体来说，有了这个特性，我们可以**手动脱糖 `Fn` Traits**：

```rust
Fn(A, B, C) -> D
// 可手动脱糖为：
#![feature(unboxed_closures)]
Fn<(A, B, C), Output = D>
```

脱糖后，我们可以将返回值类型的语法 `-> D`{:.language-rust} 换成关联类型的语法 `Output = D`{:.language-rust}。

使用该特性的好处是，Rust 允许我们为关联类型指定约束而不需要写一个新的泛型类型，这样我们就可以将二者的生命周期关联起来：

```rust
#![feature(unboxed_closures)]

use std::fmt::Debug;

fn do_sth<F>(f: F)
where
    for<'a> F: Fn<(&'a i32,)>,
    // 需要注意，`Output` 是 `FnOnce` 的关联类型而不是 `Fn` 的
    for<'a> <F as FnOnce<(&'a i32,)>>::Output: Debug + 'a,
{
    let a = 1;
    f(&a);
}

fn foo(t: &i32) -> impl Debug + '_ {
    t
}

// 这种情况下，`do_sth` 能够接受返回值类型不同的函数作为参数
fn foo2(t: &i32) -> impl Debug + '_ {
    unsafe { std::mem::transmute::<&i32, &[u8; 4]>(t) }
}

fn do_foo() {
    do_sth(foo);
    do_sth(foo2);
}
```
{: highlight-lines="7-9" }

## ATB

最后一种方法是 **ATB（Associated Type Bounds）**，它允许我们**约束关联类型（Associated Types）**。

> `associated_type_bounds` 特性即将在 Rust 1.79.0 稳定。
{: .prompt-tip }

这种方法是第二种方法的改进版，让我们可以直接在同一行中约束 `Output`，不需要把它单独拆出来约束：

```rust
#![feature(associated_type_bounds)]
#![feature(unboxed_closures)]

use std::fmt::Debug;

fn do_sth<F>(f: F)
where
    for<'a> F: Fn<(&'a i32,), Output: Debug>,
{
    let a = 1;
    f(&a);
}

fn foo(t: &i32) -> impl Debug + '_ {
    t
}

// 这种情况下，`do_sth` 能够接受返回值类型不同的函数作为参数
fn foo2(t: &i32) -> impl Debug + '_ {
    unsafe { std::mem::transmute::<&i32, &[u8; 4]>(t) }
}

fn do_foo() {
    do_sth(foo);
    do_sth(foo2);
}
```
{: highlight-lines="8" }

这里 rust 自动为关联类型 `Output` 添加了 `'a`{:.language-rust} 约束，因此可以不写 `Output: Debug + 'a`{:.language-rust}，当然写了也行，没有区别。

## 后注

需要注意的是，Rust 当前还支持另一种比较相似的语法，即在关联类型处使用**等于号**而不是**冒号**：

```rust
#![feature(unboxed_closures)]

fn do_sth(f: impl for<'a> Fn<(&'a i32,), Output = impl Debug>)
{
    let a = 1;
    f(&a);
}
```

这种写法看起来很美好，但是与使用冒号作为约束不同的是，使用等号令 `Output` 等于一个不透明类型，该不透明类型隐式实现了 HRTBs，大致相当于：

```rust
#![feature(anonymous_lifetime_in_impl_trait)]
#![feature(unboxed_closures)]

fn do_sth(f: impl for<'a> Fn<(&'a i32,), Output = impl for<'b> Debug + '_>)
{
    let a = 1;
    f(&a);
}
```

这种写法令 `Output` 类型实际并没有与 `'a`{:.language-rust} 产生联系。而若你想要手动添加生命周期标注时：

```rust
#![feature(unboxed_closures)]

fn do_sth(f: impl for<'a> Fn<(&'a i32,), Output = impl Debug + 'a>)
{
    let a = 1;
    f(&a);
}
```

Rust 会说：

```plaintext
error: `impl Trait` can only mention lifetimes from an fn or impl
 --> src/lib.rs:5:64
  |
5 | fn do_sth(f: impl for<'a> Fn<(&'a i32,), Output = impl Debug + 'a>)
  |                       -- lifetime declared here              
```

这意味着当前版本的 Rust 并不支持不透明类型从 HRTBs 中捕获生命周期参数。关于此语法的讨论以及为什么不被支持，参见 [rust-lang/rust#96194](https://github.com/rust-lang/rust/issues/96194)。关于此语法未来可能的发展，参见 [rust-lang/rust#104288](https://github.com/rust-lang/rust/issues/104288)。需要注意的一点是，从讨论中可以看出，该语法期望解糖为 TAIT，因此，即使该语法最终得到稳定，也很有可能像 TAIT 那样不能视为泛型返回值类型。
