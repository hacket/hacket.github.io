---
title: "C++ Coroutine VS Rust Async"
date: 2023-5-11 12:49:21 +0800
categories: [杂记, Rust]
tags: [c++, 编程语言, c++20, rust]     # TAG names should always be lowercase
---

在 C++20 中，我们有 **Coroutine**，在 Rust 中，我们有 **Async**。严格来说，二者之间没有完全等效的概念，但是我们可以找到一些相似之处，进而了解 C++ Coroutine 与 Rust Async 设计上的异同点。

由于我的[上一篇文章]({{ site.baseurl }}{% link _posts/2023-4-24-coroutine.md %})介绍了 C++ 的 Coroutine，因此我们本文主要**以 C++ Coroutine 的视角来看 Rust 的 Async**。

为了更好地体现出二者的异同，我们从[上一篇文章]({{ site.baseurl }}{% link _posts/2023-4-24-coroutine.md %})中的**斐波那契数列生成器**入手，尝试用 Rust 一比一复刻该例子：

```cpp
#include <coroutine>
#include <iostream>

class task {
 public:
  class promise_type {
   public:
    task get_return_object() {
      return {std::coroutine_handle<promise_type>::from_promise(*this)};
    }
    // 由于是惰性生成器，我们在协程初始化时就暂停，所以返回 std::suspend_always
    std::suspend_always initial_suspend() { return {}; }
    std::suspend_always final_suspend() noexcept { return {}; }
    void unhandled_exception() {}
    void return_void() {}
    // 每次生成值后都暂停，所以我们返回 std::suspend_always
    std::suspend_always yield_value(size_t value) {
      // 类似 co_return，我们把每次 yield 的值都保存起来
      _value = value;
      return {};
    }
    size_t _value;
  };

  task(std::coroutine_handle<promise_type> handle) : _handle(handle) {}

  // 我们重载一个 operator()，当然重载一个其他函数名也是一样的
  size_t operator()() {
    // 恢复协程的执行
    _handle.resume();
    // 将本次 yield 的值返回给调用者
    return _handle.promise()._value;
  }

 private:
  std::coroutine_handle<promise_type> _handle;
};

task fibonacci() {
  // yield 斐波那契数列的第一项给调用者
  co_yield 1;
  // yield 斐波那契数列的第二项给调用者
  co_yield 1;

  size_t n1 = 1, n2 = 1;
  while (true) {
    // 计算斐波那契数列
    size_t value = n1 + n2;
    // yield 给调用者
    co_yield value;
    // 为下一次计算做准备
    n1 = n2;
    n2 = value;
  }
}

int main(int argc, char* argv[]) {
  task fib = fibonacci();
  for (int i = 0; i < 10; ++i)
    // 调用一次 task::operator()，恢复协程的运行并获得一个 yield 出来的值
    std::cout << "fibonacci[" << i << "] is " << fib() << std::endl;
  return 0;
}
```
{: run="cpp" }

首先我们看到 C++ Coroutine 中最核心的概念：`co_await`，`awaitable` 类型，以及包含 `promise` 类型的 `task` 类型。很容易的，我们会想到 Rust 的 `.await` 与 `Future` 类型，它们有许多的相似点，但是我们先来看看它们设计上的不同点。

C++ 划分了四个类型：**`awaitable` 类型**是可以被 `co_await` 的类型；**`promise` 类型**由协程操作，协程通过 `promise` 对象提交执行结果或异常；**协程句柄**可以被主动调用来控制协程的恢复或释放；**`task` 类型**通常包装了协程句柄的操作，以及包装了从 `promise` 对象中获取数据的接口，由携程函数的调用者操作，从外部控制协程，`task` 类型也可以实现 `awaitable`，但不是强制性的。

而 Rust 并没有做那么复杂：**`Future` 类型**本身既是可以被 `.await` 的类型，又包含了类似协程句柄和 `promise` 类型的功能——`Future::poll()`{:.language-rust} 方法，调用该方法类似于调用了 `handle.resume()`{:.language-cpp}，并且该方法的返回值 `Poll<Self::Output>`{:.language-rust} 可以包含协程函数的最终返回值。唯一没有被 `Future` 类型覆盖的是 C++ 中 `task` 类型提供的对外暴露控制接口的行为。

并且，C++ 的 `awaitable` 类型需要自己定义，而 Rust 的 `Future` 类型大部分情况下直接使用 `async` 语法来创建。

再深入到细节来看看，C++ 中 `handle.resume()`{:.language-cpp} 与 Rust 中 `Future::poll()`{:.language-rust} 并非完全等效的概念，因为 `Future::poll()`{:.language-rust} 包含一个 `Context` 参数，它在内部包含一个 **`Waker` 类型**：从名字中很容易看出，它用来唤醒协程，通常注册在回调函数之中，类似于我们在 C++ 中构建一个调用了 `handle.resume()`{:.language-cpp} 的回调函数（参见[上一篇文章]({{ site.baseurl }}{% link _posts/2023-4-24-coroutine.md %})中 `AddOneAwaitable` 的实现）。

另一方面，C++ 中协程会根据 `promise.initial_suspend()`{:.language-cpp} 来决定协程是否在协程函数入口点暂停，但是 **Rust 的协程天生是惰性的**，必须通过 `Future::poll()`{:.language-rust} 来推动它执行。

说了那么多不一样的，我们来看一点类似的东西。对于 C++ 中 `co_await xxx`{:.language-cpp} 与 Rust 中 `xxx.await`{:.language-rust} 两个相似的结构，在 C++ 中，如果 `xxx.await_ready()`{:.language-cpp} 返回 `false`，那么该协程在此处暂停，反之如果返回 `true` 则不暂停。而在 Rust 中，`xxx.await`{:.language-rust} 会导致一次 `Future::poll()`{:.language-rust}，若返回 `Poll::Pending`{:.language-rust}，则协程在此处暂停，反之如果返回 `Poll::Ready`{:.language-rust} 则不暂停。因此，我们可以在 Rust 中实现类似  `suspend_never` 和 `suspend_always` 的结构：

```rust
use std::{
    future::Future,
    pin::Pin,
    task::{Context, Poll},
};

#[derive(Default)]
struct SuspendNever;

impl Future for SuspendNever {
    type Output = ();
    fn poll(self: Pin<&mut Self>, _: &mut Context<'_>) -> Poll<()> {
        Poll::Ready(())
    }
}

// 需要注意的是，C++ 中的 awaitable 被 resume 后就会完成执行，
// 但是 Rust 的 Future 一定要 poll 到 Ready 为止，
// 因此我们需要额外添加一个字段控制只在第一次 poll 的时候暂停，
// 否则该 Future 永远不会执行结束。
#[derive(Default)]
struct SuspendAlways {
    suspended: bool,
}

impl Future for SuspendAlways {
    type Output = ();
    fn poll(mut self: Pin<&mut Self>, _: &mut Context<'_>) -> Poll<()> {
        if self.suspended {
            return Poll::Ready(());
        }
        self.suspended = true;
        Poll::Pending
    }
}
```

`SuspendAlways` 在 tokio 中有一个类似的实现 [`tokio::task::yield_now()`{:.language-rust}](https://docs.rs/tokio/latest/tokio/task/fn.yield_now.html)，至于它为什么要叫 `yield_now`，我们很快就会明白的。聪明的读者可以先自行思考一下。

我们现在开始来实现 Rust 版本的斐波那契数列生成器，但是我们会遇到一点阻力。截止至文章完成之日，**Rust 的 `yield` 尚未稳定**，我们没有一个合适的语法可以从协程函数内部得到一个 yield 出来的值。因此，我们只能委屈一下，通过传递参数的形式来实现值传递：

```rust
use std::sync::{Arc, Mutex};

async fn fibonacci_async(value: Arc<Mutex<u32>>) {
    /* yield */*value.lock().unwrap() = 1;
    /* yield */*value.lock().unwrap() = 1;
    let mut n1 = 1;
    let mut n2 = 1;
    loop {
        let n3 = n1 + n2;
        /* yield */*value.lock().unwrap() = n3;
        n1 = n2;
        n2 = n3;
    }
}
```

但是，光靠改变值是不够的，我们还需要将它 yield 到协程函数外部。

思考一下，在 C++ 的斐波那契数列生成器的例子中，`co_yield 1;`{:.language-cpp} 的本质是什么？

答案是 `co_await promise.yield_value(1);`{:.language-cpp}。

更进一步的说，由于 `promise.yield_value()`{:.language-cpp} 返回一个 `suspend_always`，因此 `co_yield 1;`{:.language-cpp} 等效于：

```cpp
promise.yield_value(1);
co_await suspend_always{};
```

是不是瞬间就感觉眼熟多了？我们将其转写为 Rust：

```rust
*value.lock().unwrap() = 1;
SuspendAlways::default().await;
```

这下就醍醐灌顶了，难怪 tokio 要把它叫做 `yield_now`！

完整的斐波那契数列协程函数如下：

```rust
use std::{
    future::Future,
    pin::Pin,
    sync::{Arc, Mutex},
    task::{Context, Poll},
};

#[derive(Default)]
struct SuspendAlways {
    suspended: bool,
}

impl Future for SuspendAlways {
    type Output = ();
    fn poll(mut self: Pin<&mut Self>, _: &mut Context<'_>) -> Poll<()> {
        if self.suspended {
            return Poll::Ready(());
        }
        self.suspended = true;
        Poll::Pending
    }
}

async fn fibonacci_async(value: Arc<Mutex<u32>>) {
    *value.lock().unwrap() = 1;
    SuspendAlways::default().await;
    *value.lock().unwrap() = 1;
    SuspendAlways::default().await;
    let mut n1 = 1;
    let mut n2 = 1;
    loop {
        let n3 = n1 + n2;
        *value.lock().unwrap() = n3;
        SuspendAlways::default().await;
        n1 = n2;
        n2 = n3;
    }
}
```

下一步，我们需要实现一个类似 `task` 类型的包装，将各种实现细节隐藏起来，不让外部感知。该类型最核心的要素就是包含 `Future` 对象，以及一个 `Arc<Mutex<u32>>`{:.language-rust} 用来从协程函数中得到 yield 出来的值。不过，由于调用 `Future::poll()`{:.language-rust} 强制要求一个 `Context`，但是我们在这个例子中并没有实现回调函数唤醒协程的必要性，因此我们简单做一个空的 `Waker` 类型：

```rust
use std::{
    sync::Arc,
    task::Wake,
};

struct EmptyWaker;

impl Wake for EmptyWaker {
    fn wake(self: Arc<Self>) {}
}
```

> 有一个[不稳定的特性 `noop_waker`](https://doc.rust-lang.org/std/task/struct.Waker.html#method.noop) 提供此功能。
{: .prompt-tip }

然后我们来实现 `Task` 类型，其内容并不复杂，无非就是提供一个函数，类似 C++ 中我们给 `task` 重载了 `operator()` 那样，供外部调用以恢复协程并返回 yield 出来的值：

```rust
struct Task<Fut>
where
    Fut: Future<Output = ()>,
{
    fut: Pin<Box<Fut>>,
    value: Arc<Mutex<u32>>,
    waker: Waker,
}

impl<Fut> Task<Fut>
where
    Fut: Future<Output = ()>,
{
    fn new<F>(f: F) -> Self
    where
        F: Fn(Arc<Mutex<u32>>) -> Fut,
    {
        let value = Arc::new(Mutex::new(0));
        let fut = Box::pin(f(Arc::clone(&value)));
        let waker = Waker::from(Arc::new(EmptyWaker));
        Self { fut, value, waker }
    }

    fn get(&mut self) -> u32 {
        // poll 一下 Future，让它继续执行直到遇到下一个 SuspendAlways::default().await
        _ = Fut::poll(self.fut.as_mut(), &mut Context::from_waker(&self.waker));
        // 把新 yield 出来的值返回出去
        *self.value.lock().unwrap()
    }
}
```

为了能让外部调用更加的无感，我们再把所有内容都封装到同一个方法中：

```rust
use std::{
    future::Future,
    pin::Pin,
    sync::{Arc, Mutex},
    task::{Context, Poll, Wake, Waker},
};

fn fibonacci() -> impl FnMut() -> u32 {
    struct EmptyWaker;

    impl Wake for EmptyWaker {
        fn wake(self: Arc<Self>) {}
    }

    #[derive(Default)]
    struct SuspendAlways {
        suspended: bool,
    }

    impl Future for SuspendAlways {
        type Output = ();
        fn poll(mut self: Pin<&mut Self>, _: &mut Context<'_>) -> Poll<()> {
            if self.suspended {
                return Poll::Ready(());
            }
            self.suspended = true;
            Poll::Pending
        }
    }

    async fn fibonacci_async(value: Arc<Mutex<u32>>) {
        *value.lock().unwrap() = 1;
        SuspendAlways::default().await;
        *value.lock().unwrap() = 1;
        SuspendAlways::default().await;
        let mut n1 = 1;
        let mut n2 = 1;
        loop {
            let n3 = n1 + n2;
            *value.lock().unwrap() = n3;
            SuspendAlways::default().await;
            n1 = n2;
            n2 = n3;
        }
    }

    struct Task<Fut>
    where
        Fut: Future<Output = ()>,
    {
        fut: Pin<Box<Fut>>,
        value: Arc<Mutex<u32>>,
        waker: Waker,
    }

    impl<Fut> Task<Fut>
    where
        Fut: Future<Output = ()>,
    {
        fn new<F>(f: F) -> Self
        where
            F: Fn(Arc<Mutex<u32>>) -> Fut,
        {
            let value = Arc::new(Mutex::new(0));
            let fut = Box::pin(f(Arc::clone(&value)));
            let waker = Waker::from(Arc::new(EmptyWaker));
            Self { fut, value, waker }
        }

        fn get(&mut self) -> u32 {
            _ = Fut::poll(self.fut.as_mut(), &mut Context::from_waker(&self.waker));
            *self.value.lock().unwrap()
        }
    }

    let mut task = Task::new(fibonacci_async);
    move || task.get()
}

fn main() {
    let mut fib = fibonacci();
    for i in 0..10 {
        println!("Fibnacci[{i}] is {}", fib());
    }
}
```
{: run="rust" }

最后，在实际进行 Rust 异步编程时，我们基本不会对 `Future::poll()`{:.language-rust} 和 `Waker` 有所感知。这是因为 Rust 有许多优秀的异步运行时，如 [tokio](https://docs.rs/tokio/latest/tokio/)，这些异步运行时会负责 `Future` 的调度，而不需要我们自己去考虑。这也是 C++ Coroutine 所欠缺的，目前 C++ 的异步运行时大都还只是简单的玩具，没有形成像 Rust tokio 那样功能强大的生态，对普及 Coroutine 有着不小的负面影响。
