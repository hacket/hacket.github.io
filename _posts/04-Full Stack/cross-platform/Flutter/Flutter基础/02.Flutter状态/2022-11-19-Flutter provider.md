---
date_created: Tuesday, November 19th 2022, 11:27:19 pm
date_updated: Wednesday, January 22nd 2025, 11:05:04 pm
title: Flutter provider
author: hacket
categories:
  - 跨平台
category: Flutter
tags: [Flutter]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
image-auto-upload: true
feed: show
format: list
date created: 2024-12-26 00:24
date updated: 2024-12-26 00:24
aliases: [Provider]
linter-yaml-title-alias: Provider
---

Provider 是社区构建的状态管理工具，也是 Flutter Favorite 一员。基于 InheritedWidget 组件进行封装，使其更简单易用。它拥有着一套完整的解决方案，能够解决开发者们遇到的绝大多数情况，它能够让你开发出简单、高性能、层次清晰的应用。

- 简化的资源分配与处置
- 懒加载
- 创建新类时减少大量的模板代码
- 支持 DevTools
- 更通用的调用 InheritedWidget 的方式（参考 Provider.of/Consumer/Selector）
- 提升类的可扩展性，整体的监听架构时间复杂度以指数级增长（如 ChangeNotifier， 其复杂度为 O(N)）

Provider 中提供了几种不同类型的 provider（暂且称为提供者）和几种使用模式。

# Provider

最基础的 provider 组成，接收一个任意值并暴露它，但是并不会更新 UI。

- **Provider.create(create, child)**

新创建的对象模型

```dart
return Provider<Person>(
  create: (ctx)=> Person(),
  child: const MaterialApp(
    home: ProviderDemo(),
  ),
);

class ProviderDemo extends StatelessWidget {
  const ProviderDemo({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Consumer<Person>( /// 在程序任何地方都可以拿到person对象，读取数据
            builder: (_,person,child){
              return Text(person.name);
            }
        ),
      ),
    );
  }
}
class Person {
  String name = "新create的Provider";
}
```

- **Provider.value(value, child)**

使用 `.value` 是将已经存在的对象实例暴露出来，如果是新的模型对象，务必使用 create

```dart
Provider.value(
  value: value, /// value是已经存在的模型对象
  child: ...
)
```

在使用 provider 的 create 和 update 回调时，回调函数默认是延迟调用的。也就是说，变量被读取时，create 和 update 函数才会被调用。开发者也可以使用 lazy 参数来禁用这一行为：

```dart
Provider(
  create: (_) => Something(),
  lazy: false,
)
```

还有个 dispose 的回调 ：

```dart
typedef Dispose<T> = void Function(BuildContext context, T value);
```

当 Provider 所在节点被移除的时候，它就会启动 `Disposer<T>`，然后我们便可以在这里释放对应的资源。

# ChangeNotifierProvider

`ChangeNotifierProvider` 配合 `ChangeNotifier` 一起使用来实现状态的管理与 Widget 的更新。其中 ChangeNotifier 是系统提供的，用来负责数据的变化通知。ChangeNotifierProvider 本质上其实就是 Widget，它作为父节点 Widget，可将数据共享给其所有子节点 Widget 使用或更新。<br>监听模型对象的变化，而且当数据改变时，它也会重建 Consumer，更新 UI。

- 类需要继承、混入 ChangeNotifier
- 调用了 notifyListeners()

它不会重复实例化模型，除非在个别场景下。如果该实例已经不会再被调用，ChangeNotifierProvider 也会自动调用模型的 dispose() 方法。<br>使用步骤：

1. 创建混合或继承 ChangeNotifier 的 Model，用来实现数据更新的通知并监听数据的变化
2. 创建 ChangeNotifierProvider，用来声明 Provider，实现跨组建的数据共享
3. 接收共享数据

## ChangeNotifier

它类似于一个 Observable，继承自 Listenable，内部维护了一个 ObserverList _listeners，提供添加和删除 listener 的方法，有一个 notify 方法，用来通知所有的观察者（在 Provider 或者称为消费者 Consumer）。

> ChangeNotifier 只有在需要动态更新时候，也就是 watch 的时候才需要使用

## Provider 和 ChangeNotifierProvider

同步更新不代表同步更新 UI，也可能只是值更新了。是否同步更新 UI 取决了使用了哪一种依赖的 provider

- 使用最基础的 Provider 值已经改变了（通过热更新或 debug 可知），但是不会更新 UI
- 使用 ChangeNotifierProvider 更新值的同时会同步更新 UI

## 案例

### 案例 1

- 创建 Model

```dart
class ProviderViewModel with ChangeNotifier {
  int _number = 0;

  get number => _number;

  void addNumber() {
    _number++;
    notifyListeners();
  }
}
```

- 创建 ChangeNotifierProvider

```dart
class ChangeNotifierProviderDemoPage extends StatelessWidget {
  final _providerViewModel = ProviderViewModel();

  ChangeNotifierProviderDemoPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("ChangeNotifierProviderDemoPage Test "),
      ),
      body: ChangeNotifierProvider.value(
        value: _providerViewModel,
        builder: (context, child) {
          print("parent build");
          return Column(
            children: [
              const Text("我是父节点"),
              Text(
                  "Parent number is: ${Provider.of<ProviderViewModel>(context, listen: true).number}"),
              const ChildA(),
              // const ChildB(),
              // const ChildC()
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          _providerViewModel.addNumber();
        }, //使用context.read不会调用rebuild
      ),
    );
  }
}
```

ChangeNotifierProvider 将父布局包裹，在父或子节点 ChildA 通过 `Provider.of<T>(BuildContext context, {bool listen = true})` 进行数据操作，可同步更新父与子的数据与 UI，listen 为 false 的时候，数据变更 UI 不会变

- ChildA 接收数据

```dart
class ChildA extends StatelessWidget {
  const ChildA({super.key});

  @override
  Widget build(BuildContext context) {
    print("childA build");
    return Container(
      width: double.infinity,
      color: Colors.amberAccent,
      child: Column(
        children: [
          Text(
              "Child A number: ${Provider.of<ProviderViewModel>(context).number}"),
          MaterialButton(
              color: Colors.white,
              onPressed: () {
                Provider.of<ProviderViewModel>(context, listen: false)
                    .addNumber();
              },
              child: const Text("Add Number"))
        ],
      ),
    );
  }
}
```

效果：<br>![target-1698560378.gif](https://cdn.nlark.com/yuque/0/2023/gif/694278/1698560470620-ea1bffd8-72a2-476d-adf8-f4fd7ef2f7d5.gif#averageHue=%23fafafe&clientId=ue307192f-d6d4-4&from=paste&height=516&id=uc133292d&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=417118&status=done&style=none&taskId=u4d60b8fa-7a20-43d8-92d9-17f7aeecfbb&title=&width=232)<br>上面操作与读取时使用的是 `Provider.of<T>(BuildContext context, {bool listen = true})` 的方式，为了可以更明确对于 Provider 的操作，我们可将它替换为 `context.watch<>()` 和 `context.read<>()` 方式；context.watch<>() 和 context.read<>() 方法其实都是调用 Provider.of<T>(BuildContext context, {bool listen = true}) 来实现的：

```dart
T watch<T>() {
	return Provider.of<T>(this);
}
T read<T>() {
	return Provider.of<T>(this, listen: false);
}
```

- ChildB

```dart
class ChildB extends StatelessWidget {
  const ChildB({super.key});

  @override
  Widget build(BuildContext context) {
    print("childB build");
    return Container(
      width: double.infinity,
      color: Colors.red,
      child: Column(
        children: [
          const Text("我是子节点"),
          Text("Child B number: ${context.watch<ProviderViewModel>().number}"),
          MaterialButton(
              color: Colors.white,
              onPressed: () {
                context.read<ProviderViewModel>().addNumber();
              },
              child: const Text("Add Number"))
        ],
      ),
    );
  }
}
```

![target-1698561124.gif](https://cdn.nlark.com/yuque/0/2023/gif/694278/1698561180939-2e95289e-fba1-42ef-a09a-469f3538e71f.gif#averageHue=%23f9f9fe&clientId=ue307192f-d6d4-4&from=paste&height=693&id=u1d68a3f1&originHeight=2400&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=589896&status=done&style=none&taskId=u63a4d0a0-ebec-4199-8a3b-88c364e6fa9&title=&width=312)<br>每点击一次父 Widget 右下角的加号或子 Widget 的 Add Number 按钮，我们看一下 Log 打印的结果：

> childA build
> childB build

我们会发现每一次的操作，都会导致 ChildA 与 ChildB 整体重新 build。但实际上从代码中我们可知，在 ChildA 和 ChildB 中，只有以下的 Text() 会监听 ProviderViewModel 的数据更新：

```dart
//ChildA：
Text("Child A number: ${Provider.of<ProviderViewModel>(context).number}")
 
//ChildB：
Text("Child B number: ${context.watch<ProviderViewModel>().number}")
```

怎么实现实现局部的更新，Flutter 提供了 `Consumer<>()` 来进行支持。下面我们来看一下 Consumer<>() 的用法：

- ChildC

由于我们只希望 Text() 来监听 ProviderViewModel 的数据更新，我们用 Consumer<>() 包裹住 Text()

```dart
class ChildC extends StatelessWidget {
  const ChildC({super.key});

  @override
  Widget build(BuildContext context) {
    print("not const childC build");
    return Container(
      width: double.infinity,
      color: Colors.blue,
      child: Column(
        children: [
          const Text("我是子节点"),
          Consumer<ProviderViewModel>(builder: (context, value, child) {
            print("ChildC Consumer builder");
            return Text("Child C number: ${value.number}");
          }),
          MaterialButton(
              color: Colors.white,
              onPressed: () {
                context.read<ProviderViewModel>().addNumber();
              },
              child: const Text("Add Number"))
        ],
      ),
    );
  }
}
```

再看 log 输出：

> childA build
> childB build
> ChildC Consumer builder

> 引用时要加个 const，const ChildC()，不然 ChildC 还是会 build

从 Log 中我们可以得知，ChildC 并没有被 rebuild，而是由 Consumer 调用内部的 builder 来实现局部更新的

# ProxyProvider

我们日常开发中会遇到一种模型嵌套另一种模型、或一种模型的参数用到另一种模型的值、或是需要几种模型的值组合成一个新的模型的情况，在这种情况下，就可以使用 ProxyProvider 。它能够将多个 provider 的值聚合为一个新对象，将结果传递给 Provider（注意是 Provider 而不是 ChangeNotifierProvider），这个新对象会在其依赖的任意一个 provider 更新后同步更新值。

```dart
ProxyProvider<T, R> /// R依赖T或用到T的值，T发生改变会通知R
```

- Model

```dart
class Person extends ChangeNotifier {
  String name = "小虎牙";

  void changName() {
    name = "更新的小虎牙";
    notifyListeners();
  }
}
// EatModel 需要用到 Person 的 name 值，才知道到底是谁在吃饭
class EatModel {
  EatModel({required this.name});

  final String name;

  String get whoEat => "$name正在吃饭";
}

```

- ProxyProvider

```dart
class ProxyProviderDemo extends StatelessWidget {
  const ProxyProviderDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: Scaffold(
          appBar: AppBar(
            title: const Text("ProxyProvider Demo"),
          ),
          body: MultiProvider(
            providers: [
              ChangeNotifierProvider<Person>(
                create: (ctx) => Person(),
              ),
              ProxyProvider<Person, EatModel>(
                update: (ctx, person, eatModel) => EatModel(name: person.name),
              )
            ],
            child: const MaterialApp(
              home: ProxyProviderStateless(),
            ),
          )),
    );
  }
}

class ProxyProviderStateless extends StatelessWidget {
  const ProxyProviderStateless({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Consumer<EatModel>(builder: (context, eatModel, child) {
          return Text(eatModel.whoEat ?? "");
        }),
        Consumer<Person>(
          // 拿到person对象，调用方法
          builder: (context, person, child) {
            return ElevatedButton(
              /// 点击按钮更新Person的name，eatModel.whoEat会同步更新
              onPressed: () => person.changName(),
              child: const Text("点击修改"),
            );
          },
        ),
      ],
    );
  }
}
```

**结果： **页面显示 小虎牙正在吃饭；点击按钮后：内容更新为更新的小虎牙正在吃饭。<br>ProxyProvider 还有其他不同的形式：`ProxyProvider`、`ProxyProvider2`、`ProxyProvider3…ProxyProvider6`。类名后的数字是 ProxyProvider 依赖的 provider 的数量。一般很难用到 6 个或以上的模型糅合一个新的模型。

## ChangeNotifierProxyProvider

# MultiProvder

在实际开发中，程序肯定存在多种 Provider，如果我们还是用嵌套的方式来解决，但是这样无疑是混乱的，可读性级差。

```dart
return ProvderA(
  child: ProvderB(
    child: ProvderC(
      child: ProvderD(
        ...
        child: MaterialApp()
      ) 
    ) 
  )
)
```

为了解决这样的嵌套地狱，MultiProvder 应运而生。它实际上是多种 Provider 的集合，且仅仅是改变了代码的书写方式。

```dart
class MultiProviderPage extends StatelessWidget {
  const MultiProviderPage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          useMaterial3: true,
        ),
        home: Scaffold(
            appBar: AppBar(
              title: const Text("MultiProviderPage Demo"),
            ),
            body: MultiProvider(
              providers: [
                ChangeNotifierProvider<Person1>(
                  create: (ctx) => Person1(),
                ),
                ChangeNotifierProvider<Person2>(
                  create: (ctx) => Person2(),
                )
              ],
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Consumer<Person1>(
                      builder: (ctx, person1, child) => Text(person1.name)),
                  Consumer<Person2>(
                      builder: (_, person2, child) => Text(person2.name)),
                  Consumer<Person1>(
                    /// 拿到person1对象，调用方法，也可以修改person2
                    builder: (ctx, person1, child) {
                      return ElevatedButton(
                        onPressed: () {
                          person1.changName();
                        },
                        child: const Text("点击修改"),
                      );
                    },
                  ),
                ],
              ),
            )));
  }
}

class Person1 with ChangeNotifier {
  String name = "MultiProvider ---  1";

  void changName() {
    name = "更新MultiProvider ---  1";
    notifyListeners();
  }
}

class Person2 with ChangeNotifier {
  String name = "MultiProvider ---  2";

  void changName(String desc) {
    name = "更新MultiProvider ---  2 $desc";
    notifyListeners();
  }
}
```
