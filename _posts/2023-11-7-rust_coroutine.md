---
title: "Rust: Generator 已死，Coroutine 当立，Generator 又活了"
date: 2023-11-7 15:21:10 +0800
categories: [杂记, Rust]
tags: [rust, 编程语言]     # TAG names should always be lowercase
---

参考文献：

[Generators are dead, long live coroutines, generators are back](https://blog.rust-lang.org/inside-rust/2023/10/23/coroutines.html)

[Generalized coroutines](https://lang-team.rust-lang.org/design_notes/general_coroutines.html)

在曾经，Rust 通过**不稳定特性 `generators` 和 `generator_trait`** 提供 Generator 功能，大体使用方法如下:

```rust
#![feature(generators, generator_trait)]

use std::ops::{Generator, GeneratorState};
use std::pin::Pin;

fn main() {
    // add_one 是一个 generator
    let mut add_one = |mut x: usize| loop {
        // `yield x + 1` 的值是下文中 resume 的参数，
        // 而 `x + 1` 则作为 resume 的返回值。
        // 如果不接收 yield 的值，
        // 那么只有第一次调用 resume 的参数是有效的。
        x = yield x + 1;
    };

    match Pin::new(&mut add_one).resume(0) {
        // 初次调用 add_one，0 作为参数 x 的值传入，
        // `yield x + 1` 被调用，resume 返回 1，
        // 此时 add_one 在 yield 处暂停，yield 未求值。
        GeneratorState::Yielded(x) => println!("yielded {x}"),
        // 事实上 generator 还可以 return value，
        // 并在此处通过 GeneratorState::Complete(v) 接收。
        _ => (),
    }
    match Pin::new(&mut add_one).resume(5) {
        // 第二次调用 add_one，5 作为上一次 `yield x + 1` 的值传入，
        // 使 x 变为 5，再一次执行 `yield x + 1`，
        // resume 返回 6。
        GeneratorState::Yielded(x) => println!("yielded {x}"),
        _ => (),
    }
}
```

Generator 类似闭包语法，因此也可以捕捉外部变量，也可以使用 `move` 关键字：

```rust
let v = [0, 1, 2, 3, 4];
let genrator = move || {
    for i in v {
        yield i;
    }
};
```

现在，这两个不稳定特性已经被移除了，原因是 Rust 团队认为该 Generator 实质已经完成了 Coroutine 的工作，因此，**Rust 团队将过去所有 Generator 术语修改为 Coroutine**，并引入了 **`coroutines` 和 `coroutine_trait`** 这两个新的不稳定特性。

从语法上来说，新的 Coroutine 和以前的 Generator 并没有什么很大的不同:

```rust
#![feature(coroutines, coroutine_trait)]

use std::ops::{Coroutine, CoroutineState};
use std::pin::Pin;

fn main() {
    let mut add_one = |mut x: usize| loop {
        x = yield x + 1;
    };

    match Pin::new(&mut add_one).resume(0) {
        CoroutineState::Yielded(x) => println!("yielded {x}"),
        _ => (),
    }
    match Pin::new(&mut add_one).resume(5) {
        CoroutineState::Yielded(x) => println!("yielded {x}"),
        _ => (),
    }
}
```

但是，Rust 团队对 Generator 有了新的定义。现在，**Generator 只是一个生成 Iterator 的快捷方式**，这意味着 **Generator 是一种没有参数、没有返回值的 Coroutine**。

为了更方便构造 Generator，在 Rust edition 2024 中引入了 **`gen_blocks` 特性**，一个简单的斐波那契数列为例：

```rust
#![feature(gen_blocks)]

fn fib() -> impl Iterator<Item = usize> {
    // gen block 返回一个 impl Iterator 的匿名类型。
    gen {
        let mut n1 = 1;
        let mut n2 = 1;
        let mut n3 = 2;
        yield n1;
        yield n2;
        loop {
            yield n3;
            n1 = n2;
            n2 = n3;
            n3 = n1 + n2;
        }
    }
}

fn main() {
    // 通过 take 截断前 10 个值。
    println!("{:?}", fib().take(10).collect::<Vec<usize>>());
}
```

若要运行上述代码，请使用 nightly 版本，在 `cargo.toml` 最上方添加 `cargo-features = ["edition2024"]`，并使用 `RUSTFLAGS="-Zunstable-options --edition 2024" cargo run` 运行。或者，你也可以[通过 godbolt 进行体验](https://godbolt.org/#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:12,fontUsePx:'0',j:1,lang:rust,selection:(endColumn:2,endLineNumber:21,positionColumn:2,positionLineNumber:21,selectionStartColumn:2,selectionStartLineNumber:21,startColumn:2,startLineNumber:21),source:'%23!!%5Bfeature(gen_blocks)%5D%0A%0Afn+fib()+-%3E+impl+Iterator%3CItem%3Dusize%3E+%7B%0A++++gen+%7B%0A++++++++let+mut+n1+%3D+1%3B%0A++++++++let+mut+n2+%3D+1%3B%0A++++++++let+mut+n3+%3D+2%3B%0A++++++++yield+n1%3B%0A++++++++yield+n2%3B%0A++++++++loop+%7B%0A++++++++++++yield+n3%3B%0A++++++++++++n1+%3D+n2%3B%0A++++++++++++n2+%3D+n3%3B%0A++++++++++++n3+%3D+n1+%2B+n2%3B%0A++++++++%7D%0A++++%7D%0A%7D%0A%0Apub+fn+main()+%7B%0A++++println!!(%22%7B:%3F%7D%22,+fib().take(10).collect::%3CVec%3Cusize%3E%3E())%3B%0A%7D'),l:'5',n:'0',o:'Rust+source+%231',t:'0')),k:48.5781990521327,l:'4',n:'0',o:'',s:0,t:'0'),(g:!((g:!((h:compiler,i:(compiler:nightly,deviceViewOpen:'1',filters:(b:'0',binary:'1',binaryObject:'1',commentOnly:'0',debugCalls:'1',demangle:'0',directives:'0',execute:'0',intel:'0',libraryCode:'1',trim:'1'),flagsViewOpen:'1',fontScale:14,fontUsePx:'0',j:1,lang:rust,libs:!(),options:'-Zunstable-options+--edition+2024',overrides:!(),selection:(endColumn:1,endLineNumber:1,positionColumn:1,positionLineNumber:1,selectionStartColumn:1,selectionStartLineNumber:1,startColumn:1,startLineNumber:1),source:1),l:'5',n:'0',o:'+rustc+nightly+(Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:output,i:(editorid:1,fontScale:14,fontUsePx:'0',j:1,wrap:'1'),l:'5',n:'0',o:'Output+of+rustc+nightly+(Compiler+%231)',t:'0')),k:50,l:'4',m:50,n:'0',o:'',s:0,t:'0')),k:51.421800947867304,l:'3',n:'0',o:'',t:'0')),l:'2',n:'0',o:'',t:'0')),version:4)。

另外，正如前文所说，Generator 是 Coroutine 的一种，因此按照 Rust 团队的设想，gen block 理应是 Coroutine 的语法糖，上述代码应当解糖为（暂时不能编译）：

```rust
fn fib() -> impl Iterator<Item = usize> {
    std::iter::from_fn(|| {
        let mut n1 = 1;
        let mut n2 = 1;
        let mut n3 = 2;
        yield Some(n1);
        yield Some(n2);
        loop {
            yield Some(n3);
            n1 = n2;
            n2 = n3;
            n3 = n1 + n2;
        }
    })
}
```

同样，由于 gen block 被定性为 Coroutine 的语法糖，因此在引用外部变量时的行为也类似闭包，需要使用 move 移入（[在 godbolt 上体验](https://godbolt.org/#g:!((g:!((g:!((h:codeEditor,i:(filename:'1',fontScale:12,fontUsePx:'0',j:1,lang:rust,selection:(endColumn:73,endLineNumber:3,positionColumn:73,positionLineNumber:3,selectionStartColumn:73,selectionStartLineNumber:3,startColumn:73,startLineNumber:3),source:'%23!!%5Bfeature(gen_blocks)%5D%0A%0Afn+gen_multiple(input:+%26%5Busize%5D,+multiple:+usize)+-%3E+impl+Iterator%3CItem+%3D+usize%3E+%2B+!'_+%7B%0A++++gen+move+%7B%0A++++++++for+i+in+input+%7B%0A++++++++++++yield+i+*+multiple%3B%0A++++++++%7D%0A++++%7D%0A%7D%0A%0Apub+fn+main()+%7B%0A++++let+input+%3D+(0..10).collect::%3CVec%3Cusize%3E%3E()%3B%0A++++println!!(%22%7B:%3F%7D%22,+gen_multiple(%26input,+2).collect::%3CVec%3Cusize%3E%3E())%3B%0A%7D'),l:'5',n:'0',o:'Rust+source+%231',t:'0')),k:48.5781990521327,l:'4',n:'0',o:'',s:0,t:'0'),(g:!((g:!((h:compiler,i:(compiler:nightly,deviceViewOpen:'1',filters:(b:'0',binary:'1',binaryObject:'1',commentOnly:'0',debugCalls:'1',demangle:'0',directives:'0',execute:'0',intel:'0',libraryCode:'1',trim:'1'),flagsViewOpen:'1',fontScale:14,fontUsePx:'0',j:1,lang:rust,libs:!(),options:'-Zunstable-options+--edition+2024',overrides:!(),selection:(endColumn:1,endLineNumber:1,positionColumn:1,positionLineNumber:1,selectionStartColumn:1,selectionStartLineNumber:1,startColumn:1,startLineNumber:1),source:1),l:'5',n:'0',o:'+rustc+nightly+(Editor+%231)',t:'0')),header:(),l:'4',m:50,n:'0',o:'',s:0,t:'0'),(g:!((h:output,i:(editorid:1,fontScale:14,fontUsePx:'0',j:1,wrap:'1'),l:'5',n:'0',o:'Output+of+rustc+nightly+(Compiler+%231)',t:'0')),k:50,l:'4',m:50,n:'0',o:'',s:0,t:'0')),k:51.421800947867304,l:'3',n:'0',o:'',t:'0')),l:'2',n:'0',o:'',t:'0')),version:4)）:

```rust
#![feature(gen_blocks)]

// gen block 引用 `input`，因此返回值类型添加生命周期 `'_` 进行约束
fn gen_multiple(input: &[usize], multiple: usize) -> impl Iterator<Item = usize> + '_ {
    // 将 `multiple` move 进 gen block，否则以 `&usize` 的形式访问 `multiple`
    gen move {
        for i in input {
            yield i * multiple;
        }
    }
}

fn main() {
    let input = (0..10).collect::<Vec<usize>>();
    println!("{:?}", gen_multiple(&input, 2).collect::<Vec<usize>>());
}
```

另一方面，按照设想，**gen block 也可以和 async block 组合，成为 Async Generator**。由于 rustc 暂时还无法支持该特性，我们直接看官方例子简单了解一下：

```rust
async gen {
  while let Some(item) = inner.next().await {
    yield func(item).await;
  }
}

// 按照设想，应该解糖为:

std::stream::from_fn(|ctx| {
  while let Some(item) = await_with!(inner.next(), ctx) {
    yield Ready(Some(await_with!(func(item), ctx)));
  }
  Ready(None)
})
```
