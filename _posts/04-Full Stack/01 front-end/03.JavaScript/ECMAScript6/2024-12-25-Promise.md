---
date created: 2024-12-25 00:57
date updated: 2024-12-25 00:57
dg-publish: true
---

Promise 是一个 ECMAScript 6 提供的类，目的是更加优雅地书写复杂的异步任务。

## 什么是Promise？

Promise 对象是 JavaScript 的异步操作解决方案，为异步操作提供统一接口。它起到代理作用（proxy），充当异步操作与回调函数之间的中介，使得异步操作具备同步操作的接口。Promise 可以让异步操作写起来，就像在写同步操作的流程，而不必一层层地嵌套回调函数。

## Promise 对象的状态

Promise 对象通过自身的状态，来控制异步操作。Promise 实例具有三种状态。

- 异步操作未完成（pending）
- 异步操作成功（fulfilled）
- 异步操作失败（rejected）

上面三种状态里面，fulfilled和rejected合在一起称为resolved（已定型）。<br />这三种的状态的变化途径只有两种。

- 从“未完成”到“成功”
- 从“未完成”到“失败”

一旦状态发生变化，就凝固了，不会再有新的状态变化。这也是 Promise 这个名字的由来，它的英语意思是“承诺”，一旦承诺成效，就不得再改变了。这也意味着，Promise 实例的状态变化只可能发生一次。<br />因此，Promise 的最终结果只有两种。

- 异步操作成功，Promise 实例传回一个值（value），状态变为fulfilled。
- 异步操作失败，Promise 实例抛出一个错误（error），状态变为rejected。

## Promise 的构造函数

Promise 构造函数是 JavaScript 中用于创建 Promise 对象的内置构造函数。

### resolve、reject

Promise 构造函数接受一个函数作为参数，该函数是同步的并且会被立即执行，所以我们称之为起始函数。起始函数包含两个参数 `resolve` 和 `reject`，分别表示 Promise 成功和失败的状态。

```javascript
var promise = new Promise(function (resolve, reject) {
  // ...
  if (/* 异步操作成功 */){
    resolve(value);
  } else { /* 异步操作失败 */
    reject(new Error());
  }
});
```

- resolve函数的作用是，将Promise实例的状态从“未完成”变为“成功”（即从pending变为fulfilled），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。
- reject函数的作用是，将Promise实例的状态从“未完成”变为“失败”（即从pending变为rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

### then、catch、finally

Promise 构造函数返回一个 Promise 对象，该对象具有以下几个方法：

- then：用于处理 Promise 成功状态的回调函数，then方法可以接受两个回调函数
  - 第一个是异步操作成功时（变为fulfilled状态）的回调函数，
  - 第二个是异步操作失败（变为rejected）时的回调函数（该参数可以省略）。一旦状态改变，就调用相应的回调函数。
- catch：用于处理 Promise 失败状态的回调函数。
- finally：无论 Promise 是成功还是失败，都会执行的回调函数。

示例：

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    if (Math.random() < 0.5) {
      resolve('success');
    } else {
      reject('error');
    }
  }, 1000);
});
 
promise.then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});
```

使用 Promise 构造函数创建了一个 Promise 对象，并使用 setTimeout 模拟了一个异步操作。如果异步操作成功，则调用 resolve 函数并传递成功的结果；如果异步操作失败，则调用 reject 函数并传递失败的原因。然后我们使用 then 方法处理 Promise 成功状态的回调函数，使用 catch 方法处理 Promise 失败状态的回调函数。<br />resolve 和 reject 都是函数，其中调用 resolve 代表一切正常，reject 是出现异常时所调用的：

```javascript
new Promise(function (resolve, reject) {
    var a = 0;
    var b = 1;
    if (b == 0) reject("Divide zero");
    else resolve(a / b);
}).then(function (value) {
    console.log("a / b = " + value);
}).catch(function (err) {
    console.log(err);
}).finally(function () {
    console.log("End");
});
```

结果：

> a / b = 0
> End

resolve() 中可以放置一个参数用于向下一个 then 传递一个值，then 中的函数也可以返回一个值传递给 then。但是，如果 then 中返回的是一个 Promise 对象，那么下一个 then 将相当于对这个返回的 Promise 进行操作，<br />reject() 参数中一般会传递一个异常给之后的 catch 函数用于处理异常。<br />但是请注意以下两点：

- resolve 和 reject 的作用域只有起始函数，不包括 then 以及其他序列；
- resolve 和 reject 并不能够使起始函数停止运行，别忘了 return。

## Promise 函数

```javascript
function print(delay, message) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(message);
            resolve();
        }, delay);
    });
}
```

使用：

```javascript
print(1000, "First").then(function () {
    return print(4000, "Second");
}).then(function () {
    print(3000, "Third");
});
```

这种返回值为一个 Promise 对象的函数称作 `Promise 函数`，它常常用于开发基于异步操作的库。
