---
title: "[译] 并不总是 iCache"
date: 2022-2-17 15:13:27 +0800
categories: [翻译, "Rust"]
tags: [rust, 翻译]     # TAG names should always be lowercase
author: matklad
license: false
---

## 免责声明

本文是对原博文《[It’s Not Always ICache](https://matklad.github.io/2021/07/10/its-not-always-icache.html)》的无授权翻译转载，不享受任何著作权利，不用于任何商业目的，不以任何许可证进行授权，不对任何转载行为尤其是商业转载行为负责。一切权利均由原作者 [Aleksey Kladov](https://github.com/matklad) 保有。

本文中出现的所有第一人称均指代 Aleksey Kladov 而非译者本人。本文中对一些术语会额外附加英文原文注释，以帮助读者搜索相关概念。

## 正文

这是[上一篇关于 Rust 中 `#[inline]` 的文章](https://nihil.cc/posts/translate_rust_inline/)的后续。这个帖子有一点笼统，而且有一点啰嗦。读者请小心！

在讨论内联优化时，几乎总是会提到以下内容：“内联也会使代码变慢，*因为*内联会增加代码大小，增大指令缓存（ICache，Instruction Cache）大小并导致缓存未命中（Miss）”。

我自己已经多次看到这种说法以各种形式复述。我还看到在很多基准（Benchmark）中明智地移除了内联标记确实提高了性能。但是，我从未看到过针对 ICache 的性能改进。至少对我来说，这种解释似乎没有根据——人们知道指责 ICache 是因为别人都这么说，而不是因为每个人都能指出一个基准。这并不意味着 ICache 的解释是错误的——只是我个人而言没有证据表明它比任何其他解释都更好。

不管如何，我决定先看一个我所知道的 `#[inline]` 会显著降低速度的具体案例，并理解它为什么会发生。请注意，这里的目的不是为了解释 `#[inline]` 的实际影响，基准是人为定义的。我们的首要目标是更多地了解用于解释结果的工具。次要目标是，要么在实践中观察 ICacha 的效果，或者给为什么移除内联可以加速提供备选的假设。

基准测试基于我的 [once_cell](https://github.com/matklad/once_cell) Rust 库，该库提供了一个原语（Primitive），类似于[双重检查锁定](https://zh.wikipedia.org/wiki/%E5%8F%8C%E9%87%8D%E6%A3%80%E6%9F%A5%E9%94%81%E5%AE%9A%E6%A8%A1%E5%BC%8F)（Double-Checked Locking）。有这么一个函数：

```rust
fn get_or_try_init<F, E>(&self, f: F) -> Result<&T, E>
where
 F: FnOnce() -> Result<T, E>,
{
  if let Some(value) = self.get() {
    // 快速分支
    return Ok(value);
  }

  // 慢速分支
  self.0.initialize(f)?;
  Ok(unsafe { self.get_unchecked() })
}
```

我知道当 `initialize` 函数没有内联时性能会显着提高。在这个例子中比较明显（这就是为什么基准是人造的——现实世界的例子尽是我们不知道是否需要 `inline` 的情况）。但不知为何，*确切的说*，内联 `initialize` 会使代码变慢。

作为实验，我编写了一个简单的高级基准测试循环调用 `get_or_try_init`：

```rust
const N_LOOPS: usize = 8;
static CELL: OnceCell<usize> = OnceCell::new();

fn main() {
  for i in 0..N_LOOPS {
    go(i)
  }
}

fn go(i: usize) {
  for _ in 0..100_000_000 {
    let &value = CELL.get_or_init(|| i);
    assert!(value < N_LOOPS);
  }
}
```

我还添加了编译开关来强制或禁止内联：

```rust
#[cfg_attr(feature = "inline_always", inline(always))]
#[cfg_attr(feature = "inline_never", inline(never))]
fn initialize() { ... }
```

您可以在此提交中找到完整的基准测试：[matklad/once_cell@a741d5f](https://github.com/matklad/once_cell/commit/a741d5f2ca7cd89125ef1c70ee2e5fe660271050)。

运行这两个版本表明 `#[inline(never)]` 确实更快：

```console
$ cargo run -q --example bench  --release --features inline_always
330ms

$ cargo run -q --example bench  --release --features inline_never
259ms
```

> 请注意，在这里我们不使用花哨的统计数据。`/usr/bin/time` 已经足够用肉眼看出差距，即使我们所寻找的效果非常低级。因此，一个普适性提示：如果您要对相对差异（而不是绝对性能）进行基准测试，请不要费心测量纳秒级精度的时间。取而代之的是，循环该基准足够多次以使其变为人类可感知。
{: .prompt-info }

我们如何解释差异？第一步是从测试语句中移除 cargo 并制作两个二进制文件进行比较：

```console
$ cargo build --example bench --release --features inline_never
$ cp ./target/release/examples/bench never
$ cargo build --example bench --release --features inline_always
$ cp ./target/release/examples/bench always
```

在 Linux 上，能够快速访问任何程序性能的最佳工具是 `perf stat`。它运行程序并显示大量 CPU 级别的性能计数器，这可以解释发生了什么。由于我们怀疑 ICache 可能是罪魁祸首，让我们包含缓存的计数器：

```console
$ perf stat -e instructions,cycles,\
> L1-dcache-loads,L1-dcache-load-misses,L1-dcache-prefetches,\
> L1-icache-loads,L1-icache-load-misses,cache-misses \
> ./always
348ms

 6,396,754,995      instructions:u
 1,601,314,994      cycles:u
 1,600,621,170      L1-dcache-loads:u
         4,806      L1-dcache-load-misses:u
         4,402      L1-dcache-prefetches:u
        69,594      L1-icache-loads:u
           461      L1-icache-load-misses:u
         1,928      cache-misses:u

$ perf stat -e instructions,cycles,\
> L1-dcache-loads,L1-dcache-load-misses,L1-dcache-prefetches,\
> L1-icache-loads,L1-icache-load-misses,cache-misses \
> ./never
261ms

 Performance counter stats for './never':

 5,597,215,493      instructions:u
 1,199,960,402      cycles:u
 1,599,404,303      L1-dcache-loads:u
         4,612      L1-dcache-load-misses:u
         4,290      L1-dcache-prefetches:u
        62,268      L1-icache-loads:u
           603      L1-icache-load-misses:u
         1,675      cache-misses:u
```

`L1-icache-load-misses` 存在一些差异，但 `instructions` 也存在令人惊讶的差异。再者，`L1-icache-load-misses` 上的差异难以估量，因为不清楚 `L1-icache-loads` 是什么。作为一个健全的检测，`dcache` 的统计数据是相同的，正如我们所期望的那样。

在 `perf` 从 CPU 获取真实数据的同时，另一种备选方案是在模拟环境中运行程序。这就是 `cachegrind` 工具的作用。有趣的事实：`cachegrind` 的主要作者是 [@nnethercote](https://github.com/nnethercote)，我们在上一篇文章中看到了他的 [Rust performance book](https://nnethercote.github.io/perf-book/)。让我们看看 `cachegrind` 对基准的看法。

```console
$ valgrind --tool=cachegrind ./always
10s
 I   refs:      6,400,577,147
 I1  misses:            1,560
 LLi misses:            1,524
 I1  miss rate:          0.00%
 LLi miss rate:          0.00%

 D   refs:      1,600,196,336
 D1  misses:            5,549
 LLd misses:            4,024
 D1  miss rate:           0.0%
 LLd miss rate:           0.0%

 LL refs:               7,109
 LL misses:             5,548
 LL miss rate:            0.0%

$ valgrind --tool=cachegrind ./never
9s
 I   refs:      5,600,577,226
 I1  misses:            1,572
 LLi misses:            1,529
 I1  miss rate:          0.00%
 LLi miss rate:          0.00%

 D   refs:      1,600,196,330
 D1  misses:            5,553
 LLd misses:            4,024
 D1  miss rate:           0.0%
 LLd miss rate:           0.0%

 LL refs:               7,125
 LL misses:             5,553
 LL miss rate:            0.0%
```

请注意，因为 `cachegrind` 模拟运行程序，所以运行速度要慢得多。此处我们并没有看到在缓存未命中（I1——一级指令缓存，LLi——最后一级指令缓存）上的巨大差异。请注意，CPU 引用 ICache 的次数应与其执行的指令数量相对应。用 `perf` 交叉检查数量，我们可以看到 `perf` 和 `cachegrind` 二者皆同意执行指令的数量。仍然很难说明 `perf` 的 `sL1-icache-loads` 是什么。从名称来看，它应该对应 `cachegrind` 的 `I refs`，但事实并非如此。

无论如何，似乎有一件事需要进一步调查——为什么内联会改变执行的指令数量？内联实际上不会改变 CPU 运行的代码，因此指令的数量应该保持不变。那我们来看看汇编吧！此处正确工具是 `cargo-asm`。

同样，我们将目光锁定在这个函数：

```rust
fn go(tid: usize) {
  for _ in 0..100_000_000 {
    let &value = CELL.get_or_init(|| tid);
    assert!(value < N_THREADS);
  }
}
```

调用 `get_or_init` 将被内联，嵌套调用 `initialize` 将根据标志内联。

我们先来看一下 `inline_never` 版本：

```nasm
  push    r14 ;
  push    rbx ; prologue
  push    rax ;
  mov     qword, ptr, [rsp], rdi
  mov     ebx, 100000001 ; loop counter
  mov     r14, rsp
  jmp     .LBB14_1
 .loop:
  cmp     qword, ptr, [rip, +, CELL+16], 8
  jae     .assert_failure
 .LBB14_1:
  add     rbx, -1
  je      .normal_exit
  mov     rax, qword, ptr, [rip, +, CELL]
  cmp     rax, 2
  je      .loop
  mov     rdi, r14
  call    once_cell::imp::OnceCell<T>::initialize
  jmp     .loop
 .normal_exit:
  add     rsp, 8 ;
  pop     rbx    ; epilogue
  pop     r14a   ;
  ret            ;
 .assert_failure:
  lea     rdi, [rip, +, .L__unnamed_12]
  lea     rdx, [rip, +, .L__unnamed_13]
  mov     esi, 35
  call    qword, ptr, [rip, +, core::panicking::panic@GOTPCREL]
  ud2
```
{: highlight-lines="9-16"}

然后在 `inline_always` 版本中：

```nasm
  push    rbp  ;
  push    r15  ;
  push    r14  ;
  push    r13  ; prologue
  push    r12  ;
  push    rbx  ;
  sub     rsp, 24
  mov     r12, rdi
  xor     ebx, ebx
  mov     r13d, 1
  lea     r14, [rip, +, CELL]
  mov     rbp, qword, ptr, [rip, +, WaiterQueue::drop@GOTPCREL]
  mov     r15, qword, ptr, [rip, +, once_cell::imp::wait@GOTPCREL]
  jmp     .LBB10_1
 .LBB10_10:
  mov     qword, ptr, [rsp, +, 8], r14
  mov     qword, ptr, [rip, +, CELL+8], 1
  mov     qword, ptr, [rip, +, CELL+16], r12
  mov     qword, ptr, [rsp, +, 16], 2
  lea     rdi, [rsp, +, 8]
  call    rbp
 .loop:
  add     rbx, 1
  cmp     qword, ptr, [rip, +, CELL+16], 8
  jae     .assert_failure
 .LBB10_1:
  cmp     rbx, 100000000
  je      .normal_exit
  mov     rax, qword, ptr, [rip, +, CELL]
  cmp     rax, 2
  je      .loop
 .LBB10_3:
  mov     rax, qword, ptr, [rip, +, CELL]
 .LBB10_4:
  test    rax, rax
  jne     .LBB10_5
  xor     eax, eax
  lock    cmpxchg, qword, ptr, [rip, +, CELL], r13
  jne     .LBB10_4
  jmp     .LBB10_10
 .LBB10_5:
  cmp     rax, 2
  je      .loop
  mov     ecx, eax
  and     ecx, 3
  cmp     ecx, 1
  jne     .LBB10_8
  mov     rdi, r14
  mov     rsi, rax
  call    r15
  jmp     .LBB10_3
 .normal_exit:
  add     rsp, 24 ;
  pop     rbx     ;
  pop     r12     ;
  pop     r13     ; epilogue
  pop     r14     ;
  pop     r15     ;
  pop     rbp     ;
  ret
 .assert_failure:
  lea     rdi, [rip, +, .L__unnamed_9]
  lea     rdx, [rip, +, .L__unnamed_10]
  mov     esi, 35
  call    qword, ptr, [rip, +, core::panicking::panic@GOTPCREL]
  ud2
 .LBB10_8:
  lea     rdi, [rip, +, .L__unnamed_11]
  lea     rdx, [rip, +, .L__unnamed_12]
  mov     esi, 57
  call    qword, ptr, [rip, +, core::panicking::panic@GOTPCREL]
  ud2
```
{: highlight-lines="23-31" }

我稍微编辑了一下代码，并且突出显示构成基准测试主体的热循环。

查看汇编，我们可以看到以下内容：

* 代码要大得多——内联发生了！
* 函数序言（Prologue）更大，编译器将更多被调用者保存的寄存器转移到堆栈
* 函数收尾（Epilogue）较大，编译器需要恢复更多寄存器
* 堆栈帧（Stack Frame）更大
* 编译器将一些 `initialize` 代码提到循环之前
* 在这两种情况下，核心循环都非常紧凑，只有少量指令
* 核心循环向上而不是向下计数，增加了一条额外的 `cmp` 指令

请注意，ICache 不太可能影响正在运行的代码，因为它是内存中彼此相邻的一小部分指令。另一方面，带有大立即数的额外 `cmp` 指令正好说明了我们观察到的额外指令的数量（循环运行了 800_000_000 次）。

## 结论

很难提出一个基准来证明两种选择之间的差异。解释差异甚至更难——可能有很多[现成的](https://en.wikipedia.org/wiki/Availability_heuristic)解释，但它们不一定是对的。尽管如此，现今我们拥有大量有用的工具。两个值得注意的例子是 `perf` 和 `valgrind`。工具并不总是正确的——最好对不同的工具彼此之间，以及对问题的常识性理解进行健全性检查。

尤其是对于内联，我们发现内联 `S` 到 `C` 可能会导致速度变慢的原因如下：

1. 内联可能会导致 `C` 使用更多寄存器。这意味着序言（Prologue）和收尾（Epilogue）增加了额外的 `push`/`pop` 指令，这些指令也使用堆栈内存。在没有内联的情况下，这些指令被隐藏在 `S` 中并且仅在 `C` 实际调用 `S` 时才耗费，而不是每次调用 `C` 本身时。
2. 从第一点概括，如果 `S` 在循环中或在 `if` 中被调用，编译器可能会将一些 `S` 的指令提到分支之前，将它们从冷路径移动到热路径。
3. 由于堆栈帧中有更多的局部变量和控制流需要处理，编译器可能会意外地对热循环持悲观态度。

如果您对 ICache 在哪些情况下会成为问题感到好奇，请参阅[这篇关于此类案例的优秀文章](https://www.scylladb.com/2017/07/06/scyllas-approach-improve-performance-cpu-bound-workloads/)。
