---
title: 从实例看 Rust 的 HRTBs
date: 2022-1-5 10:14:38 +0800
categories: [杂记, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

## 问题

这一天，我像往常一样快乐地水群，一位群友抛出了一张编译报错求解。原版的代码内容太多，这里我先把最简化后的版本放出：

```rust
trait MyTrait<T> {
    fn do_sth(&self, r: T);
}

struct MyStruct;

impl<T> MyTrait<T> for MyStruct {
    fn do_sth(&self, r: T) {
        todo!();
    }
}

fn main() {
    let my_obj: Box<dyn MyTrait<&i32>> = Box::new(MyStruct);
    let num = 1;
    my_obj.do_sth(&num);
}
```

尝试编译，得到报错：

```text
error[E0597]: `num` does not live long enough
  --> src/main.rs:16:19
   |
16 |     my_obj.do_sth(&num);
   |                   ^^^^ borrowed value does not live long enough
17 | }
   | -
   | |
   | `num` dropped here while still borrowed
   | borrow might be used here, when `my_obj` is dropped and runs the destructor for type `Box<dyn MyTrait<&i32>>`
   |
   = note: values in a scope are dropped in the opposite order they are defined
```

## 分析

对于 `Box<dyn MyTrait<&i32>>`{:.language-rust}，实际上它隐含了一个生命周期参数 `Box<dyn MyTrait<&'a i32>>`{:.language-rust}，这个生命周期参数由 Rust 自动推导。在本例中，Rust 实际推断其与 `my_obj` 相同，而不是与 `num` 相同，因此对生命周期小于 `my_obj` 的 `num` 重拳出击。

当然，这种情况也有一个很简单的解决方案，只需要稍微挪一下位置，让 `num` 的生命周期大于 `my_obj` 就可以通过编译了：

```rust
let num = 1;
let my_obj: Box<dyn MyTrait<&i32>> = Box::new(MyStruct);
my_obj.do_sth(&num);
```

然而，这固然是个简单的方法，但他真的是一个好办法吗？想象一个简单的应用场景：

```rust
fn do_i32(my_obj: Box<dyn MyTrait<&i32>>) {
    let num = value_from_other_function();
    // 我们要如何把 `&num` 传递给 my_obj.do_sth()?
    // my_obj.do_sth(&num);
}
```

有些人这时候可能就要说了，为什么非得用 `&i32`{:.language-rust} 不可呢，我用 `i32`{:.language-rust} 不就好好的吗？

然而事实往往并不是这么简单。我之前说过，这是我简化后的代码，实际在群友给出的原始代码中，传递的参数并非是 `&i32`{:.language-rust}，而是从 `<&str>.as_byte()`{:.language-rust} 中得到的 `&[u8]`{:.language-rust}，并且 `MyTrait<T>`{:.language-rust} 限定了 `T` 要实现 `std::io::Read`{:.language-rust}，再者，`[u8]`{:.language-rust} 字节流本身也是 DST，无法实例化。

那么，在限定使用引用的前提下，还有什么办法能够让它通过编译呢？有，HRTBs。

## 高阶 Trait 约束

**高阶 Trait 约束**（**HRTBs**, **Higher-Rank Trait Bounds**），社区也有人称**高阶生命周期约束**，大部分人接触它看到的例子应该都是 `Fn` 作为泛型参数的例子。从未接触过 HRTBs 的看客也无需慌张，如果你能理解这个例子，对于 `Fn` 的例子也可以简单的举一反三。

在上面的例子中，我们的需求和 Rust 编译器的理解是有出入的。实际上，我们想要的是，`Box<dyn MyTrait<&i32>>`{:.language-rust} 在调用 `do_sth(&num)`{:.language-rust} 时能够主动适配 `&num`{:.language-rust} 的生命周期，而不是让 `&num`{:.language-rust} 来满足自己的生命周期。

而高阶 Trait 边界，就是我们传达我们真实意图的工具。我们可以通过它的语法，告诉 Rust 编译器应该主动适配入参的生命周期。它的语法是将类型的定义修改为：

```rust
Box<dyn for<'a> MyTrait<&'a i32>>
```

`for<'a> S<&'a T>`{:.language-rust} 这个结构，我们可以从字面上理解，将 `for`{:.language-rust} 翻译为“对于”，将该语法解释为“对于所有所选择的生命周期，动态地产生对应的引用”。

该语法可以解决上述例子中的所有问题：

```rust
fn main() {
    let my_obj: Box<dyn for<'a> MyTrait<&'a i32>> = Box::new(MyStruct);
    let num = 1;
    my_obj.do_sth(&num);
}
```

以及

```rust
fn do_i32(my_obj: Box<dyn for<'a> MyTrait<&'a i32>>) {
    let num = value_from_other_function();
    my_obj.do_sth(&num);
}
```

## `Fn` 泛型中的 HRTBs

照顾到没有学习过 HRTBs 的看客，我们再来看看传统的 `Fn` 泛型作为例子的 HRTBs。

众所周知，在 Rust 中，如果入参是两个及以上引用，返回值也是一个引用，那么：

```rust
fn do_it(a: &i32, b:&i32) -> &i32 {
    todo!();
}
```

不标注任何生命周期是无法通过编译的，Rust 不能确定返回值的生命周期要依赖于哪个入参。因此我们可以修改为：

```rust
fn do_it<'a>(a: &'a i32, b:&'a i32) -> &'a i32 {
    todo!();
}
```

但是，如果我们把这一套引入到 Fn 泛型之中：

```rust
fn do_fn<'a, F>(f: F)
where
    F: Fn(&'a i32, &'a i32) -> &'a i32,
{
    let a = 1;
    let b = 1;
    let c = f(&a, &b);
}
```

就不行了，Rust 编译器会告诉我们 `a` 和 `b` 的生命周期没有 `'a`{:.language-rust} 那么长。其原因和我们最初的例子是相似的，Rust 定义 `'a`{:.language-rust} 是整个 `do_fn` 的生命周期，在其中的 `a` 和 `b` 自然不可能满足它的生命周期要求。同样的，我们也可以用 HRBTs 来告诉 Rust 编译器，我们想要它根据 `f` 的入参 `a` 和 `b` 动态地适应生命周期：

```rust
fn do_fn<F>(f: F)
where
    F: for<'a> Fn(&'a i32, &'a i32) -> &'a i32,
{
    let a = 1;
    let b = 1;
    let c = f(&a, &b);
}
```

## `Fn` 类型的隐式绑定

事实上，我们常写的 `Fn(Args) -> R`{:.language-rust} 类型实质是 `Fn<(Args,), Output=R>`{:.language-rust} 类型的语法糖（注意后者需要 `#![feature(unboxed_closures)]`{:.language-rust} 才能使用）。在 Rust 中规定，当使用括号语法（即前者）时默认引入 HRTBs，这也就意味着 `Fn(&i32) -> &i32`{:.language-rust} 等效于 `for<'a> Fn(&'a i32) -> &'a i32`{:.language-rust} 等效于 `for<'a> Fn<(&'a i32,), Output=&'a i32>`{:.language-rust}。而使用尖括号语法（后者）不引入 HRTBs。对于 `fn` 类型也是同理。

## 参考

[Higher-Rank Trait Bounds (HRTBs) - The Rustonomicon](https://doc.rust-lang.org/nomicon/hrtb.html)

[谈一谈rust里的一个黑魔法语法HRTBs](https://dengjianping.github.io/2019/07/09/%E8%B0%88%E4%B8%80%E8%B0%88rust%E9%87%8C%E7%9A%84%E4%B8%80%E4%B8%AA%E9%BB%91%E9%AD%94%E6%B3%95%E8%AF%AD%E6%B3%95HRTBs.html)

[0387-higher-ranked-trait-bounds - The Rust RFC Book](https://rust-lang.github.io/rfcs/0387-higher-ranked-trait-bounds.html)
