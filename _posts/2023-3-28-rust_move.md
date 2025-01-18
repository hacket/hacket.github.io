---
title: "[Rust] 当实例被移动时，究竟发生了什么？"
date: 2023-3-28 14:49:31 +0800
categories: [杂记, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

## 前言

本文并不是移动语义的教程，并且本文假设你已经看过 [the Book](https://doc.rust-lang.org/book/index.html)，已经了解了 Rust 中所有权的概念。

本文包含汇编和 MIR，但是并非需要了解汇编和 MIR 才能看懂。只要跟随本文的思路，即使以前不懂汇编和 MIR，也可以理解本文所表达的意图。

## 从汇编看移动

先简简单单 wrapper 一个 i32：

```rust
use std::fmt::Debug;

#[derive(Debug, Clone, Copy)]
struct WrapperCopy(i32);

#[derive(Debug)]
struct WrapperMove(i32);

fn take<T: Debug>(t: T) {
    println!("{:?}", t);
}

fn main() {
    let mut a = WrapperCopy(12);
    a.0 -= 1;
    take(a); // 我们仍然可以在 take 之后继续使用 a，因为我们的 WrapperCopy 有 derive Copy

    let mut b = WrapperMove(12);
    b.0 -= 1;
    take(b); // 我们不能在 take 之后继续使用 a，因为我们的 WrapperMove 没有 derive Copy
}
```
{: run="rust" }

上述代码很简单，`take(a)`{:.language-rust} 是拷贝语义，而 `take(b)`{:.language-rust} 是移动语义，我相信应该没有异议吧？那么，在不开启任何优化的情况下，他们生成的汇编是什么样的呢？

以下是 [playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021) 的输出：

```nasm
playground::main:
    pushq   %rax
    movl    $12, (%rsp)
    movl    $11, (%rsp)
    movl    $11, %edi
    callq   playground::take
    movl    $12, 4(%rsp)
    movl    $11, 4(%rsp)
    movl    $11, %edi
    callq   playground::take
    popq    %rax
    retq
```

你会发现一个很有趣的事实，**二者生成的汇编是完全一样的**。

再深入看，你会发现它一共就这四行：

* `movl $12, (%rsp)`{:.language-nasm} 往堆栈指针处写入立即数 12；
* `movl $11, (%rsp)`{:.language-nasm} 往堆栈指针处写入立即数 11；
* `movl $11, %edi`{:.language-nasm} 往目标索引寄存器写入立即数 11（传参）；
* `callq playground::take`{:.language-nasm} 调用 `take` 方法。

等等，我们的 `WrapperCopy` 和 `WrapperMove` 哪去了？

当然是丢掉了。注意这不是优化掉了而是丢掉了！必须要清楚一点：汇编没有结构体，结构体是 Rust 抽象出来的纯上层概念。最终在编译成汇编时，所有这种上层概念都将被丢弃，包括但不限于：结构体，生命周期，Trait，所有权语义，移动与拷贝语义等。

因此，当我们在讨论移动语义和拷贝语义时，必须要明白我们说的都是 **Rust 抽象出来的上层概念**，所谓移动是对**所有权**这一抽象语义的操作，是 Rust 编译器为了保证内存安全性而做出的一种约束：它约束你不能在一个变量被移动后继续使用他，如果你违反了这个约束，它将**拒绝编译**你的代码；这种约束力建立在 Rust 的语义上，而不是建立在汇编层。

可能很多人觉得我在讲废话，说了一大堆显而易见的事情。但是就像很多 C 语言老手都不明白为什么新人觉得指针难一样，大部分 Rust 老手也无法理解新人为什么在纠结移动语义。我之所以花费大量口舌来说明移动语义与汇编无关，是因为这类事情无时无刻不在 Rust 社区中发生。甚至于有一位大可爱，问出了「Rust 为什么不在汇编级搞所有权，说不定性能暴打 C」这一震撼我老母一百年的问题。

## 移动语义与 Drop 语义

回到原本的话题。既然移动语义和拷贝语义在汇编层是没有区别的，那么为什么还需要移动语义呢？这就不得不提到另一个与移动紧密相关的语义——**Drop 语义**。

我们来看一下下面这个例子：

```rust
struct WrapperMove(i32);

fn take(_x: WrapperMove) {
    println!("Enter take method");
}

impl Drop for WrapperMove {
    fn drop(&mut self) {
        println!("Drop WrapperMove instance");
    }
}

fn main() {
    let b = WrapperMove(12);
    take(b);
    println!("After take method");
}
```
{: run="rust" }

我们来瞅一眼它的 MIR 长啥样：

```rust
fn take(_1: WrapperMove) -> () {
    debug _x => _1;                      // in scope 0 at src/main.rs:3:9: 3:11
    let mut _0: ();                      // return place in scope 0 at src/main.rs:3:26: 3:26
    let _2: ();                          // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
    let mut _3: std::fmt::Arguments<'_>; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let mut _4: &[&str];                 // in scope 0 at src/main.rs:4:14: 4:33
    let mut _5: &[&str; 1];              // in scope 0 at src/main.rs:4:14: 4:33

    bb0: {
        _5 = const _;                    // scope 0 at src/main.rs:4:14: 4:33
                                         // mir::Constant
                                         // + span: src/main.rs:4:14: 4:33
                                         // + literal: Const { ty: &[&str; 1], val: Unevaluated(take, [], Some(promoted[0])) }
        _4 = _5 as &[&str] (Pointer(Unsize)); // scope 0 at src/main.rs:4:14: 4:33
        _3 = Arguments::<'_>::new_const(move _4) -> [return: bb1, unwind: bb4]; // scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // + user_ty: UserType(0)
                                         // + literal: Const { ty: fn(&[&'static str]) -> Arguments<'_> {Arguments::<'_>::new_const}, val: Value(<ZST>) }
    }

    bb1: {
        _2 = _print(move _3) -> [return: bb2, unwind: bb4]; // scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:27
                                         // + literal: Const { ty: for<'a> fn(Arguments<'a>) {_print}, val: Value(<ZST>) }
    }

    bb2: {
        drop(_1) -> bb3;                 // scope 0 at src/main.rs:5:1: 5:2
    }

    bb3: {
        return;                          // scope 0 at src/main.rs:5:2: 5:2
    }

    bb4 (cleanup): {
        drop(_1) -> bb5;                 // scope 0 at src/main.rs:5:1: 5:2
    }

    bb5 (cleanup): {
        resume;                          // scope 0 at src/main.rs:3:1: 5:2
    }
}

fn <impl at src/main.rs:7:1: 7:26>::drop(_1: &mut WrapperMove) -> () {
    debug self => _1;                    // in scope 0 at src/main.rs:8:13: 8:22
    let mut _0: ();                      // return place in scope 0 at src/main.rs:8:24: 8:24
    let _2: ();                          // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
    let mut _3: std::fmt::Arguments<'_>; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let mut _4: &[&str];                 // in scope 0 at src/main.rs:9:18: 9:45
    let mut _5: &[&str; 1];              // in scope 0 at src/main.rs:9:18: 9:45

    bb0: {
        _5 = const _;                    // scope 0 at src/main.rs:9:18: 9:45
                                         // mir::Constant
                                         // + span: src/main.rs:9:18: 9:45
                                         // + literal: Const { ty: &[&str; 1], val: Unevaluated(<WrapperMove as Drop>::drop, [], Some(promoted[0])) }
        _4 = _5 as &[&str] (Pointer(Unsize)); // scope 0 at src/main.rs:9:18: 9:45
        _3 = Arguments::<'_>::new_const(move _4) -> bb1; // scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // + user_ty: UserType(0)
                                         // + literal: Const { ty: fn(&[&'static str]) -> Arguments<'_> {Arguments::<'_>::new_const}, val: Value(<ZST>) }
    }

    bb1: {
        _2 = _print(move _3) -> bb2;     // scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:27
                                         // + literal: Const { ty: for<'a> fn(Arguments<'a>) {_print}, val: Value(<ZST>) }
    }

    bb2: {
        return;                          // scope 0 at src/main.rs:10:6: 10:6
    }
}

fn main() -> () {
    let mut _0: ();                      // return place in scope 0 at src/main.rs:13:11: 13:11
    let _1: WrapperMove;                 // in scope 0 at src/main.rs:14:9: 14:10
    let _2: ();                          // in scope 0 at src/main.rs:15:5: 15:12
    let _3: ();                          // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
    let mut _4: std::fmt::Arguments<'_>; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let mut _5: &[&str];                 // in scope 0 at src/main.rs:16:14: 16:33
    scope 1 {
        debug b => _1;                   // in scope 1 at src/main.rs:14:9: 14:10
        let mut _6: &[&str; 1];          // in scope 1 at src/main.rs:16:14: 16:33
    }

    bb0: {
        _1 = const WrapperMove(12_i32);  // scope 0 at src/main.rs:14:13: 14:28
                                         // mir::Constant
                                         // + span: no-location
                                         // + literal: Const { ty: WrapperMove, val: Value(Scalar(0x0000000c)) }
        _2 = take(move _1) -> bb1;       // scope 1 at src/main.rs:15:5: 15:12
                                         // mir::Constant
                                         // + span: src/main.rs:15:5: 15:9
                                         // + literal: Const { ty: fn(WrapperMove) {take}, val: Value(<ZST>) }
    }

    bb1: {
        _6 = const _;                    // scope 1 at src/main.rs:16:14: 16:33
                                         // mir::Constant
                                         // + span: src/main.rs:16:14: 16:33
                                         // + literal: Const { ty: &[&str; 1], val: Unevaluated(main, [], Some(promoted[0])) }
        _5 = _6 as &[&str] (Pointer(Unsize)); // scope 1 at src/main.rs:16:14: 16:33
        _4 = Arguments::<'_>::new_const(move _5) -> bb2; // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // + user_ty: UserType(0)
                                         // + literal: Const { ty: fn(&[&'static str]) -> Arguments<'_> {Arguments::<'_>::new_const}, val: Value(<ZST>) }
    }

    bb2: {
        _3 = _print(move _4) -> bb3;     // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:27
                                         // + literal: Const { ty: for<'a> fn(Arguments<'a>) {_print}, val: Value(<ZST>) }
    }

    bb3: {
        return;                          // scope 0 at src/main.rs:17:2: 17:2
    }
}
```
{: highlight-lines="30, 38, 46" }

从上述 MIR 中不难看出，`take` 方法拿到的 `WrapperMove` 会在方法结束时触发 Drop 语义，而 Drop 语义的实质就是**将 `drop` 方法插入到了 `take` 方法的末尾**。

而在 `main` 方法中，虽然我们创建了一个 `WrapperMove` 的实例，但是由于它具有移动语义，并且该实例被移动到了 `take` 方法中，因此，Rust 编译器并不会在 `main` 方法的末尾调用它的 `drop` 方法。

换而言之，移动语义可以被认为是 Rust 编译器做出了下面这一保证：**在实例的生命周期结束时，调用且仅调用一次该实例的 `drop` 方法。**

我们知道，Rust 的智能指针都是移动语义。让我们来假设一下，如果 `Box` 是拷贝语义，会发生什么？首先，依赖 `Box` 的 `drop` 方法释放堆内存肯定是不行了（当然，编译器也不允许给拷贝语义的对象实现 Drop，但是我们暂且先不管），因为首先 `Box::new` 内部会创建最原始的 `Box` 实例，然后返回它的拷贝，而这个最原始的 `Box` 实例会在 `Box::new` 方法结束后被释放，如果我们还选择在 `drop` 中释放堆内存，那么堆内存会在 `Box::new` 结束后也被释放。不仅是 `Box::new`，每一次 `Box` 作为参数传递，都意味着一次堆内存的释放。既然不能自动释放了，那么能不能学习 C 语言，自己搞个 `free` 呢？嗯。。。也不是不行吧，但是这有违背 Rust 内存安全的理念。C 语言的 `malloc` - `free` 引出了无数的内存泄露、野指针、双重释放的问题，这是 Rust 想要解决的，自然不能再走 C 语言的老路。

那么移动语义是怎么保证 `Box` 的内存安全的呢？

* 首先，正如上文提到，Rust 编译器保证在 `Box` 的生命周期结束时，调用且仅调用一次 `drop` 方法来释放堆内存，这可以避免内存泄露，也可以避免双重释放；
* 第二，`Box` 内的指针是非公开字段，这意味着你无法在 Safe Rust 中通过直接修改指针值的方法让 `Box` 变成野指针；
* 第三，Rust 编译器会约束你不能在 `Box` 被移动后继续使用这个 `Box`，这避免了 `Box` 在被释放之后仍被使用的可能性，如果你违反这一约束，编译器将拒绝编译（注：虽然你可以拿到裸指针的值，但是由于解引用裸指针必须通过 unsafe 的方法，因此我们不在 Safe Rust 的框架下谈论这种情况）。

值得一提的是，内存泄露并不视为内存安全性的一环，因此 Rust 不保证没有内存泄露。但是得益于其优秀的移动语义，大部分由低级错误导致的内存泄露都会得到改善；通常，在 Safe Rust 中主要因为 `Rc` 嵌套甚至是主动 `Box::leak` 才导致内存泄露。

## 非指针情况下的移动语义

那有人就要问了，既然智能指针采用移动语义来保证堆内存安全，那么在不包含指针的情况下，移动语义还有什么用呢？

有一种惯用法叫做 **RAII（Resource Acquisition Is Initialization）**，这意味着资源的有效期与持有资源的对象的生命周期严格绑定，即构造对象时完成资源的分配，析构对象时完成资源的释放，这可以保证资源不会泄露。在 Rust 中，“析构对象”自然联想到 Drop 语义，而“资源”这一概念最容易联想到的就是堆内存。然而，资源远不止是堆内存。

我们都知道，Linux 中使用文件描述符（File Descriptor）来描述一个被打开的文件，而对于 Rust 而言，文件描述符就是一个 `i32`{:.language-rust} 的资源。然而，由于 `i32`{:.language-rust} 具有拷贝语义，这意味着我们将面临和裸指针相同的问题：它可以被拷贝得到处都是，我们很难找到一个绝对安全的办法来释放它（即调用 `close(fd)`{:.language-rust}）。这种情况下，我们就可以写一个具有移动语义的结构体将其包装起来：

```rust
mod file {
    pub struct FileDescriptor {
        fd: i32,
    }

    impl FileDescriptor {
        pub fn new(file_path: &str) -> Self {
            // 调用 FFI open 函数获得文件描述符
        }
    }

    impl Drop for FileDescriptor {
        fn drop(&mut self) {
            // 调用 FFI close 函数关闭文件
        }
    }
}

fn do_something(file: file::FileDescriptor) {
    // FileDescriptor 在方法结束时释放，Rust 编译器会在此处插入 `drop` 方法以关闭文件
}

fn main() {
    let f = file::FileDescriptor::new("/path/to/file");
    // let fd = f.fd;   <-- 由于 fd 是 FileDescriptor 的非公开成员，无法访问
    // 我们把 f 移动给 do_something 方法
    do_something(f);
    // 编译器约束我们不能再使用 f，因为如果 f 在 do_something 中被释放，后续的访问都是非法的
    // 同样，由于 f 被移走，编译器不会在 main 方法结尾插入 `drop` 方法
}
```

最后还要强调一下，如果你去翻看汇编的话，`FileDescriptor` 这层包装是不存在的，汇编层就是一个整数在传来传去。但是通过移动语义的约束，Rust 编译器可以保证调用 `close` 的地方一定是在最后一次使用该文件描述符之后。

除了文件描述符，另一个比较有名的 RAII 例子就是**互斥量（Mutex）**：

```rust
use std::{
    sync::{Arc, Mutex, MutexGuard},
    thread,
};

fn add_one(mut mutex_guard: MutexGuard<i32>) {
    *mutex_guard += 1;
    println!("value in main: {}", *mutex_guard);
    // 无需手动释放锁，Rust 编译器会在此处插入 MutexGuard 的 `drop` 方法以释放互斥锁
}

fn main() {
    let value = Arc::new(Mutex::new(12));
    let value_in_thread = Arc::clone(&value);
    let join_handle = thread::spawn(move || {
        // 对互斥量加锁
        let mut mutex_guard: MutexGuard<i32> = value_in_thread.lock().unwrap();
        *mutex_guard += 1;
        println!("value in thread: {}", *mutex_guard);
        // 无需手动释放锁，Rust 编译器会在此处插入 MutexGuard 的 `drop` 方法以释放互斥锁
    });

    let mutex_guard: MutexGuard<i32> = value.lock().unwrap();
    // 将 mutex_guard 移入 add_one 方法中
    add_one(mutex_guard);
    // 由于 add_one 方法会释放 mutex_guard，因此互斥锁也会被释放，后续可以继续请求加锁
    let mutex_guard: MutexGuard<i32> = value.lock().unwrap();
    add_one(mutex_guard);
    join_handle.join().unwrap();
}
```
{: run="rust"}

使用 RAII 还有一个尤为突出的优点：**即使函数或线程异常退出，资源对象的 `drop` 方法也会被调用，以确保资源正确被释放。**

我们来看看在上面的例子中的闭包体是如何保证这一点的：

```rust
fn main::{closure#0}(_1: [closure@src/main.rs:15:37: 15:44]) -> () {
    debug value_in_thread => (_1.0: std::sync::Arc<std::sync::Mutex<i32>>); // in scope 0 at src/main.rs:14:9: 14:24
    let mut _0: ();                      // return place in scope 0 at src/main.rs:15:45: 15:45
    let mut _2: std::sync::MutexGuard<'_, i32>; // in scope 0 at src/main.rs:17:13: 17:28
    let mut _3: std::result::Result<std::sync::MutexGuard<'_, i32>, std::sync::PoisonError<std::sync::MutexGuard<'_, i32>>>; // in scope 0 at src/main.rs:17:48: 17:70
    let mut _4: &std::sync::Mutex<i32>;  // in scope 0 at src/main.rs:17:48: 17:70
    let _5: &std::sync::Mutex<i32>;      // in scope 0 at src/main.rs:17:48: 17:70
    let mut _6: &std::sync::Arc<std::sync::Mutex<i32>>; // in scope 0 at src/main.rs:17:48: 17:70
    let mut _7: &mut i32;                // in scope 0 at src/main.rs:18:9: 18:21
    let mut _8: &mut std::sync::MutexGuard<'_, i32>; // in scope 0 at src/main.rs:18:10: 18:21
    let mut _9: (i32, bool);             // in scope 0 at src/main.rs:18:9: 18:26
    let _10: ();                         // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
    let mut _11: std::fmt::Arguments<'_>; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let mut _12: &[&str];                // in scope 0 at src/main.rs:19:18: 19:39
    let mut _13: &[core::fmt::ArgumentV1<'_>]; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let _14: &[core::fmt::ArgumentV1<'_>; 1]; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let _15: [core::fmt::ArgumentV1<'_>; 1]; // in scope 0 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
    let mut _16: core::fmt::ArgumentV1<'_>; // in scope 0 at src/main.rs:19:41: 19:53
    let _17: &i32;                       // in scope 0 at src/main.rs:19:41: 19:53
    let _18: &i32;                       // in scope 0 at src/main.rs:19:41: 19:53
    let mut _19: &std::sync::MutexGuard<'_, i32>; // in scope 0 at src/main.rs:19:42: 19:53
    scope 1 {
        debug mutex_guard => _2;         // in scope 1 at src/main.rs:17:13: 17:28
        let mut _20: &[&str; 2];         // in scope 1 at src/main.rs:19:18: 19:39
    }

    bb0: {
        _6 = &(_1.0: std::sync::Arc<std::sync::Mutex<i32>>); // scope 0 at src/main.rs:17:48: 17:70
        _5 = <Arc<Mutex<i32>> as Deref>::deref(move _6) -> [return: bb1, unwind: bb13]; // scope 0 at src/main.rs:17:48: 17:70
                                         // mir::Constant
                                         // + span: src/main.rs:17:48: 17:70
                                         // + literal: Const { ty: for<'a> fn(&'a Arc<Mutex<i32>>) -> &'a <Arc<Mutex<i32>> as Deref>::Target {<Arc<Mutex<i32>> as Deref>::deref}, val: Value(<ZST>) }
    }

    bb1: {
        _4 = _5;                         // scope 0 at src/main.rs:17:48: 17:70
        _3 = Mutex::<i32>::lock(move _4) -> [return: bb2, unwind: bb13]; // scope 0 at src/main.rs:17:48: 17:70
                                         // mir::Constant
                                         // + span: src/main.rs:17:64: 17:68
                                         // + literal: Const { ty: for<'a> fn(&'a Mutex<i32>) -> Result<MutexGuard<'a, i32>, PoisonError<MutexGuard<'a, i32>>> {Mutex::<i32>::lock}, val: Value(<ZST>) }
    }

    bb2: {
        _2 = Result::<MutexGuard<'_, i32>, PoisonError<MutexGuard<'_, i32>>>::unwrap(move _3) -> [return: bb3, unwind: bb13]; // scope 0 at src/main.rs:17:48: 17:79
                                         // mir::Constant
                                         // + span: src/main.rs:17:71: 17:77
                                         // + literal: Const { ty: fn(Result<MutexGuard<'_, i32>, PoisonError<MutexGuard<'_, i32>>>) -> MutexGuard<'_, i32> {Result::<MutexGuard<'_, i32>, PoisonError<MutexGuard<'_, i32>>>::unwrap}, val: Value(<ZST>) }
    }

    bb3: {
        _8 = &mut _2;                    // scope 1 at src/main.rs:18:10: 18:21
        _7 = <MutexGuard<'_, i32> as DerefMut>::deref_mut(move _8) -> [return: bb4, unwind: bb12]; // scope 1 at src/main.rs:18:9: 18:21
                                         // mir::Constant
                                         // + span: src/main.rs:18:9: 18:21
                                         // + literal: Const { ty: for<'a> fn(&'a mut MutexGuard<'_, i32>) -> &'a mut <MutexGuard<'_, i32> as Deref>::Target {<MutexGuard<'_, i32> as DerefMut>::deref_mut}, val: Value(<ZST>) }
    }

    bb4: {
        _9 = CheckedAdd((*_7), const 1_i32); // scope 1 at src/main.rs:18:9: 18:26
        assert(!move (_9.1: bool), "attempt to compute `{} + {}`, which would overflow", (*_7), const 1_i32) -> [success: bb5, unwind: bb12]; // scope 1 at src/main.rs:18:9: 18:26
    }

    bb5: {
        (*_7) = move (_9.0: i32);        // scope 1 at src/main.rs:18:9: 18:26
        _20 = const _;                   // scope 1 at src/main.rs:19:18: 19:39
                                         // mir::Constant
                                         // + span: src/main.rs:19:18: 19:39
                                         // + literal: Const { ty: &[&str; 2], val: Unevaluated(main::{closure#0}, [<closure_kind>, <closure_signature>, <upvars>], Some(promoted[0])) }
        _12 = _20 as &[&str] (Pointer(Unsize)); // scope 1 at src/main.rs:19:18: 19:39
        _19 = &_2;                       // scope 1 at src/main.rs:19:42: 19:53
        _18 = <MutexGuard<'_, i32> as Deref>::deref(move _19) -> [return: bb6, unwind: bb12]; // scope 1 at src/main.rs:19:41: 19:53
                                         // mir::Constant
                                         // + span: src/main.rs:19:41: 19:53
                                         // + literal: Const { ty: for<'a> fn(&'a MutexGuard<'_, i32>) -> &'a <MutexGuard<'_, i32> as Deref>::Target {<MutexGuard<'_, i32> as Deref>::deref}, val: Value(<ZST>) }
    }

    bb6: {
        _17 = _18;                       // scope 1 at src/main.rs:19:41: 19:53
        _16 = core::fmt::ArgumentV1::<'_>::new_display::<i32>(_17) -> [return: bb7, unwind: bb12]; // scope 1 at src/main.rs:19:41: 19:53
                                         // mir::Constant
                                         // + span: src/main.rs:19:41: 19:53
                                         // + user_ty: UserType(3)
                                         // + literal: Const { ty: for<'b> fn(&'b i32) -> core::fmt::ArgumentV1<'b> {core::fmt::ArgumentV1::<'_>::new_display::<i32>}, val: Value(<ZST>) }
    }

    bb7: {
        _15 = [move _16];                // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
        _14 = &_15;                      // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
        _13 = _14 as &[core::fmt::ArgumentV1<'_>] (Pointer(Unsize)); // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
        _11 = Arguments::<'_>::new_v1(move _12, move _13) -> [return: bb8, unwind: bb12]; // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:28: 137:61
                                         // + user_ty: UserType(2)
                                         // + literal: Const { ty: fn(&[&'static str], &[core::fmt::ArgumentV1<'_>]) -> Arguments<'_> {Arguments::<'_>::new_v1}, val: Value(<ZST>) }
    }

    bb8: {
        _10 = _print(move _11) -> [return: bb9, unwind: bb12]; // scope 1 at /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:62
                                         // mir::Constant
                                         // + span: /rustc/db0cbc48d4aaa300713a95d9b317a365a474490c/library/std/src/macros.rs:137:9: 137:27
                                         // + literal: Const { ty: for<'a> fn(Arguments<'a>) {_print}, val: Value(<ZST>) }
    }

    bb9: {
        drop(_2) -> [return: bb10, unwind: bb13]; // scope 0 at src/main.rs:21:5: 21:6
    }

    bb10: {
        drop(_1) -> bb11;                // scope 0 at src/main.rs:21:5: 21:6
    }

    bb11: {
        return;                          // scope 0 at src/main.rs:21:6: 21:6
    }

    bb12 (cleanup): {
        drop(_2) -> bb13;                // scope 0 at src/main.rs:21:5: 21:6
    }

    bb13 (cleanup): {
        drop(_1) -> bb14;                // scope 0 at src/main.rs:21:5: 21:6
    }

    bb14 (cleanup): {
        resume;                          // scope 0 at src/main.rs:15:37: 21:6
    }
}
```

注意到，在上述 MIR 中，`_1` 变量是闭包自身的匿名结构体，`_2` 变量是 `MutexGuard`，因此，116-118 行的：

```rust
bb12 (cleanup): {
    drop(_2) -> bb13;                // scope 0 at src/main.rs:21:5: 21:6
}
```

就是在清理 `MutexGuard`，而 `-> bb13`{:.language-rust} 就意味着执行 `bb12` 结束后，跳转到 `bb13` 执行，而 `bb13` 容易看出是在释放闭包自身。

然后再看到闭包体本身，你会发现有很多行代码，都有着 `-> [return: bbx, unwind: bb12]`{:.language-rust} 的结构（例如，52 行，71 行），这意味着，如果这行代码执行出现了异常，那么就会转跳到 `bb12` 释放 `MutexGuard`，如果没有发生异常，则跳转到 `bbx` 处继续执行代码。

另一方面，`bb9` 则是没有发生异常时，方法正常返回前释放 `MutexGuard` 的流程。
