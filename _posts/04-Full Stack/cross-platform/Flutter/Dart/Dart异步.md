---
date created: 2024-12-26 00:19
date updated: 2024-12-26 00:20
dg-publish: true
---

# Dart异步基础

## Dart单线程模型

Dart是单线程的。<br>**网络请求和IO读写不会阻塞单线程吗？**

- 网络请求本身使用了Socket通信，而Socket本身提供了select模型，可以进行非阻塞方式的工作；
- 文件读写的IO操作，我们可以使用操作系统提供的基于事件的回调机制；

**问题？**

- 在多核CPU中，单线程是不是就没有充分利用CPU呢？
- 单线程是如何来处理网络通信、IO操作它们返回的结果呢？答案就是事件循环（Event Loop）。

## Dart基于事件循环

### 什么是事件循环？

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1691428178324-699dfe83-479d-4fd5-83e7-d2409a51acd2.png#averageHue=%23f8f7f5&clientId=u8b2dcf40-8b10-4&from=paste&id=NLHBa&originHeight=506&originWidth=471&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=37552&status=done&style=stroke&taskId=u5a15953c-f93f-4855-b8d3-076e510050d&title=)<br>Dart 在单线程中是以消息循环机制来运行的，其中包含两个任务队列，一个是“微任务队列” **microtask queue**，另一个叫做“事件队列” **event queue**。从图中可以发现，微任务队列的执行优先级高于事件队列。<br>入口函数 main() 执行完后，消息循环机制便启动了。首先会按照先进先出的顺序逐个执行微任务队列中的任务，事件任务执行完毕后程序便会退出，但是，在事件任务执行的过程中也可以插入新的微任务和事件任务，在这种情况下，整个线程的执行过程便是一直在循环，不会退出，而 Flutter 中，主线程的执行过程正是如此，永不终止。<br>在 Dart 中，所有的外部事件任务都在事件队列中，如 IO、计时器、点击、以及绘制事件等，而微任务通常来源于 Dart 内部，并且微任务非常少，之所以如此，是因为微任务队列优先级高，如果微任务太多，执行时间总和就越久，事件队列任务的延迟也就越久，对于 GUI 应用来说最直观的表现就是比较卡，所以必须得保证微任务队列不会太长。值得注意的是，我们可以通过 `Future.microtask(…)` 方法向微任务队列插入一个任务。<br>在事件循环中，当某个任务发生异常并没有被捕获时，程序并不会退出，而直接导致的结果是**当前任务**的后续代码就不会被执行了，也就是说一个任务中的异常是不会影响其他任务执行的。

# Dart异步

Dart 代码库中有大量返回 [Future](https://api.dart.cn/stable/dart-async/Future-class.html) 或 [Stream](https://api.dart.cn/stable/dart-async/Stream-class.html) 对象的函数，这些函数都是 异步 的，它们会在耗时操作（比如I/O）执行完毕前直接返回而不会等待耗时操作执行完毕。<br>`async` 和 `await` 关键字用于实现异步编程，并且让你的代码看起来就像是同步的一样。

## Future

**Future API**

- `.then`通过.then(成功回调函数)的方式来监听Future内部执行完成时获取到的结果；
- `.catchError`通过.catchError(失败或异常回调函数)的方式来监听Future内部执行失败或者出现异常时的错误信息；

```dart
void main(List<String> args) {
  var future = getNetworkData();
  future
      .then((value) {
        print(value);
      })
      .then((value) => 1)
      .then((value) => "10")
      .then((value) => {print(value)})
      .catchError((error) {
        // 捕获出现异常时的情况
        print(error);
      });
}
Future<String> getNetworkData2() {
  return Future<String>(() {
    sleep(Duration(seconds: 3));
    // 不再返回结果，而是出现异常
    // return "network data";
    throw Exception("network error.");
  });
}
Future<String> getNetworkData() {
  return Future<String>(() {
    sleep(Duration(seconds: 3));
    return "network data";
  });
}
```

**Future的两种状态**

1. 未完成状态（uncompleted）：执行Future内部的操作时（在上面的案例中就是具体的网络请求过程，我们使用了延迟来模拟），我们称这个过程为未完成状态
2. 完成状态（completed）：当Future内部的操作执行完成，通常会返回一个值，或者抛出一个异常，都是完成状态

**其他API：**

1. `Future.value(value)` 直接获取一个完成的Future，该Future会直接调用then的回调函数

```dart
main(List<String> args) {
  print("main function start");

  Future.value("哈哈哈").then((value) {
    print(value);
  });

  print("main function end");
}
// 输出
// main function start
// main function end
// 哈哈哈
```

> 哈哈哈是在最后打印的呢，因为Future中的then会作为新的任务会加入到事件队列中（Event Queue），加入之后你肯定需要排队执行了

2. `Future.error(object)` 直接获取一个完成的Future，但是是一个发生异常的Future，该Future会直接调用catchError的回调函数

```dart
main(List<String> args) {
  print("main function start");

  Future.error(Exception("错误信息")).catchError((error) {
    print(error);
  });

  print("main function end");
}
// main function start
// main function end
// Exception: 错误信息
```

3. `Future.delayed(时间, 回调函数)`在延迟一定时间时执行回调函数，执行完回调函数后会执行then的回调

```dart
main(List<String> args) {
  print("main function start");
  Future.delayed(Duration(seconds: 3), () {
    return "3秒后的信息";
  }).then((value) {
    print(value);
  });
  print("main function end");
}

```

## async、await

### async、await介绍

- Future可以做到不阻塞我们的线程，让线程继续执行，并且在完成某个操作时改变自己的状态，并且回调then或者errorCatch回调
- 通常一个async的函数会返回一个Future
- await必须要在async代码块中

### 案例

#### 异步代码Future改造

```dart
Future<String> getNetworkData3() async {
  // The await expression can only be used in an async function.
  var result = await Future.delayed(Duration(seconds: 3), () {
    return "network data";
  });
  return "请求到的数据：" + result;
}

getNetworkData3().then((value) => print(value));
```

#### 案例2

```dart
static Future<List<Map<String, Object>>> list(int page, int size) async {
  return List<Map<String, Object>>.generate(size, (index) {
    return {
      'title': '标题${index + (page - 1) * size + 1}：这是一个列表标题，最多两行，多处部分将会被截取',
      'imageUrl':
          'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3331308357,177638268&fm=26&gp=0.jpg',
      'viewCount': 180,
    };
  });
}
// 调用
// _currentPage 为当前页码，PAGE_SIZE为分页大小
List<Map<String, Object>> _newItems = await DynamicMockData.list(_currentPage, PAGE_SIZE);
```

## 任务执行顺序

Dart基于事件循环（Event Loop），存在一个`事件队列`和一个`微任务队列`，优先执行微任务队列中的事件。

- 所有的外部事件任务都在事件队列中，如IO、计时器、点击和绘制事件等
- 微任务通常来源于Dart内部，任务非常少，太多容易阻塞事件队列

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686759687191-5df4bc46-b744-4552-95ed-bce59e7e8e45.png#averageHue=%23f9f9f7&clientId=udfe22149-db9f-4&from=paste&height=329&id=uc6f931f4&originHeight=789&originWidth=729&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=149811&status=done&style=none&taskId=ubb452a45-e5f1-4c93-b751-c1444920bda&title=&width=304)

## 隔离区 Isolate

### 什么是Isolate？

- Dart是单线程的，这个线程有自己可以访问的内存空间及需要运行的事件循环；这样的空间系统称之为一个Isolate
- Flutter中有一个Root Isolate，负责运行Flutter的代码，如UI渲染、用户交互等
- 每个Isolate都有自己的Event Loop和Queue
- Isolate之间不共享任何资源，只能依靠消息机制通信，因此就没有了资源抢占问题

### 创建Isolate

```dart
import "dart:isolate";

main(List<String> args) {
  Isolate.spawn(foo, "Hello Isolate");
}

void foo(info) {
  print("新的isolate：$info");
}
```

### Isolate通信机制

- Isolate 通过发送管道（`SendPort`）实现消息通信机制

**单向通信：**

```dart
main(List<String> args) async {
  // 1.创建管道
  ReceivePort receivePort = ReceivePort();

  // 2.创建新的Isolate
  Isolate isolate = await Isolate.spawn<SendPort>(foo, receivePort.sendPort);

  // 3.监听管道消息
  receivePort.listen((data) {
    print('Data：$data');
    // 不再使用时，我们会关闭管道
    receivePort.close();
    // 需要将isolate杀死
    isolate.kill(priority: Isolate.immediate);
  });
}

void foo(SendPort sendPort) {
  sendPort.send("Hello World");
}
```

**双向通信：compute**

```dart
main(List<String> args) async {
  int result = await compute(powerNum, 5);
  print(result);
}

int powerNum(int num) {
  return num * num;
}
```

# Stream

Stream 也是用于接收异步事件数据，和 Future 不同的是，它可以接收多个异步操作的结果（成功或失败）。 也就是说，在执行异步任务时，可以通过多次触发成功或失败事件来传递结果数据或错误异常。 Stream 常用于会多次读取数据的异步任务场景，如网络内容下载、文件读写等。

```dart
Stream.fromFutures([
  // 1秒后返回结果
  Future.delayed(Duration(seconds: 1), () {
    return "hello 1";
  }),
  // 抛出一个异常
  Future.delayed(Duration(seconds: 2),(){
    throw AssertionError("Error");
  }),
  // 3秒后返回结果
  Future.delayed(Duration(seconds: 3), () {
    return "hello 3";
  })
]).listen((data){
   print(data);
}, onError: (e){
   print(e.message);
},onDone: (){

});
```
