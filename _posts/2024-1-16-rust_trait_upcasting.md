---
title: "于 Rust 1.76 稳定的 trait upcasting coercion"
date: 2024-1-16 10:30:46 +0800
categories: [教程, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

> 由于在 Rust 1.76 发布前夕，trait upcasting coercion 突然发现了[健全性问题](https://github.com/rust-lang/rust/issues/120222)，因此该特性已被取消稳定，目前还没有下一步的稳定计划。
{: .prompt-warning }

先提出一个问题，在 Rust 中如何把一个 `&dyn MyTrait`{:.language-rust} 转换为 `&MyStruct`{:.language-rust}？

```rust
trait MyTrait {}

struct Foo;
struct Bar;

impl MyTrait for Foo {}
impl MyTrait for Bar {}

fn rtti(obj: &dyn MyTrait) {
    // How to convert `obj` to `&Foo` or `&Bar`
}
```

很自然地，我们可以想到借助 [`Any`](https://doc.rust-lang.org/std/any/trait.Any.html)，rust 在 `dyn Any`{:.language-rust} 类型上实现了 `is()`{:.language-rust} 和 `downcast_ref()`{:.language-rust} 可以很好地帮助我们在运行时获取类型信息。

然而，在 Rust 1.75.0 及之前，想要从 `&dyn MyTrait`{:.language-rust} 中获取 `&dyn Any`{:.language-rust} 并不是一件简单的事情，你需要在 `MyTrait` 中专门添加一个方法 `as_any()`{:.language-rust} 将自身转换为 `&dyn Any`{:.language-rust}，并且不厌其烦地在每一个 `impl MyTrait for S`{:.language-rust} 中复制粘贴一份其实现：

```rust
use std::any::Any;

trait MyTrait {
    fn as_any(&self) -> &dyn Any;
}

struct Foo;
struct Bar;

impl MyTrait for Foo {
    fn as_any(&self) -> &dyn Any {
        self
    }
}
impl MyTrait for Bar {
    fn as_any(&self) -> &dyn Any {
        self
    }
}

fn rtti(obj: &dyn MyTrait) {
    let any = obj.as_any();
    if any.is::<Foo>() {
        let _ref: &Foo = any.downcast_ref().unwrap();
    } else if any.is::<Bar>() {
        let _ref: &Bar = any.downcast_ref().unwrap();
    }
}
```

而在 Rust 1.76.0 中，**trait upcasting coercion** 迎来了稳定。什么是 trait upcasting coercion 呢？简单的说，**对于 `trait A: B`{:.language-rust}，可以直接将 `&dyn A`{:.language-rust} 强制为 `&dyn B`{:.language-rust}**，这意味着，我们只需要让 `trait MyTrait: Any`{:.language-rust}，即可实现从 `&dyn MyTrait`{:.language-rust} 到 `&dyn Any`{:.language-rust} 的转换了：

```rust
use std::any::Any;

trait MyTrait: Any {}

struct Foo;
struct Bar;

impl MyTrait for Foo {}
impl MyTrait for Bar {}

fn rtti(obj: &dyn MyTrait) {
    let any = obj as &dyn Any;
    if any.is::<Foo>() {
        let _ref: &Foo = any.downcast_ref().unwrap();
    } else if any.is::<Bar>() {
        let _ref: &Bar = any.downcast_ref().unwrap();
    }
}
```
{: highlight-lines="3,12" }
