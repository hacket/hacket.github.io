---
date created: 2024-12-25 00:59
date updated: 2024-12-25 00:59
dg-publish: true
---

# JS调试

很多浏览器都内置了调试工具。<br>内置的调试工具可以开始或关闭，严重的错误信息会发送给用户。<br>有了调试工具，我们就可以设置断点 (代码停止执行的位置), 且可以在代码执行时检测变量。<br>浏览器启用调试工具一般是按下 F12 键，并在调试菜单中选择 "Console" 。
****
## console.log() 方法

如果浏览器支持调试，你可以使用 console.log() 方法在调试窗口上打印 JavaScript 值：

```javascript
a = 5;
b = 6;
c = a + b;
console.log(c);
```

## 设置断点

在调试窗口中，你可以设置 JavaScript 代码的断点。<br>在每个断点上，都会停止执行 JavaScript 代码，以便于我们检查 JavaScript 变量的值。<br>在检查完毕后，可以重新执行代码（如播放按钮）。

## debugger 关键字

debugger 关键字用于停止执行 JavaScript，并调用调试函数。<br>这个关键字与在调试工具中设置断点的效果是一样的。<br>如果没有调试可用，debugger 语句将无法工作。<br>开启 debugger ，代码在第三行前停止执行。

```javascript
var x = 15 * 5;
debugger;
document.getElementbyId("demo").innerHTML = x;
```

# console 对象与控制台

## console

console对象是 JavaScript 的原生对象，它有点像 Unix 系统的标准输出`stdout`和标准错误`stderr`，可以输出各种信息到控制台，并且还提供了很多有用的辅助方法。<br>console对象的浏览器实现，包含在浏览器自带的开发工具之中。

## console 对象的静态方法

### console.log()，console.info()，console.debug()

console.log方法用于在控制台输出信息。它可以接受一个或多个参数，将它们连接起来输出。console.log方法会自动在每次输出的结尾，添加换行符。

```javascript
console.log('Hello World')
// Hello World
console.log('a', 'b', 'c')
// a b c
```

如果第一个参数是格式字符串（使用了格式占位符），console.log方法将依次用后面的参数替换占位符，然后再进行输出。

```javascript
console.log(' %s + %s = %s', 1, 1, 2)
//  1 + 1 = 2
```

不同类型的数据必须使用对应的占位符：

- %s 字符串
- %d 整数
- %i 整数
- %f 浮点数
- %o 对象的链接
- %c CSS 格式字符串

```javascript
var number = 11 * 9;
var color = 'red';

console.log('%d %s balloons', number, color);
// 99 red balloons
```

使用`%c`占位符时，对应的参数必须是 CSS 代码，用来对输出内容进行 CSS 渲染。

```javascript
console.log(
  '%cThis text is styled!',
  'color: red; background: yellow; font-size: 24px;'
)
```

console.log方法的两种参数格式，可以结合在一起使用。

```javascript
console.log(' %s + %s ', 1, 1, '= 2')
// 1 + 1  = 2
```

如果参数是一个对象，console.log会显示该对象的值。

```javascript
console.log({foo: 'bar'})
// Object {foo: "bar"}
console.log(Date)
// function Date() { [native code] }
```

`console.info`是`console.log`方法的别名，用法完全一样。只不过console.info方法会在输出信息的前面，加上一个蓝色图标。<br>`console.debug`方法与console.log方法类似，会在控制台输出调试信息。但是，默认情况下，console.debug输出的信息不会显示，只有在打开显示级别在verbose的情况下，才会显示。<br>console对象的所有方法，都可以被覆盖。因此，可以按照自己的需要，定义console.log方法。

```javascript
['log', 'info', 'warn', 'error'].forEach(function(method) {
  console[method] = console[method].bind(
    console,
    new Date().toISOString()
  );
});

console.log("出错了！");
// 2014-05-18T09:00.000Z 出错了！

// 使用自定义的console.log方法，可以在显示结果添加当前时间
```

### console.warn()，console.error()

warn方法和error方法也是在控制台输出信息，它们与log方法的不同之处在于：

- warn方法输出信息时，在最前面加一个黄色三角，表示警告
- error方法输出信息时，在最前面加一个红色的叉，表示出错。同时，还会高亮显示输出文字和错误发生的堆栈。其他方面都一样

```javascript
console.error('Error: %s (%i)', 'Server is not responding', 500)
// Error: Server is not responding (500)
console.warn('Warning! Too few nodes (%d)', document.childNodes.length)
// Warning! Too few nodes (1)
```

log方法是写入标准输出（stdout），warn方法和error方法是写入标准错误（stderr）

### console.table()

对于某些复合类型的数据，console.table方法可以将其转为表格显示：

```javascript
var languages = [
  { name: "JavaScript", fileExtension: ".js" },
  { name: "TypeScript", fileExtension: ".ts" },
  { name: "CoffeeScript", fileExtension: ".coffee" }
];

console.table(languages);
```

上面代码的language变量，转为表格显示如下。

| (index) | name           | fileExtension |
| ------- | -------------- | ------------- |
| 0       | "JavaScript"   | ".js"         |
| 1       | "TypeScript"   | ".ts"         |
| 2       | "CoffeeScript" | ".coffee"     |

### console.count()

count方法用于计数，输出它被调用了多少次。

```javascript
function greet(user) {
  console.count();
  return 'hi ' + user;
}

greet('bob')
//  : 1
// "hi bob"

greet('alice')
//  : 2
// "hi alice"

greet('bob')
//  : 3
// "hi bob"
```

该方法可以接受一个字符串作为参数，作为标签，对执行次数进行分类。

```javascript
function greet(user) {
  console.count(user);
  return "hi " + user;
}

greet('bob')
// bob: 1
// "hi bob"

greet('alice')
// alice: 1
// "hi alice"

greet('bob')
// bob: 2
// "hi bob"
```

### console.dir()，console.dirxml()

- dir方法用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示。

```javascript
console.log({f1: 'foo', f2: 'bar'})
// Object {f1: "foo", f2: "bar"}

console.dir({f1: 'foo', f2: 'bar'})
// Object
//   f1: "foo"
//   f2: "bar"
//   __proto__: Object
```

该方法对于输出 DOM 对象非常有用，因为会显示 DOM 对象的所有属性。

```javascript
console.dir(document.body)
```

Node 环境之中，还可以指定以代码高亮的形式输出。

```javascript
console.dir(obj, {colors: true})
```

- dirxml方法主要用于以目录树的形式，显示 DOM 节点。

```javascript
console.dirxml(document.body)
```

如果参数不是 DOM 节点，而是普通的 JavaScript 对象，console.dirxml等同于console.dir。

```javascript
console.dirxml([1, 2, 3])
// 等同于
console.dir([1, 2, 3])
```

### console.assert()

console.assert方法主要用于程序运行过程中，进行条件判断，如果不满足条件，就显示一个错误，但不会中断程序执行。这样就相当于提示用户，内部状态不正确。<br>它接受两个参数，第一个参数是表达式，第二个参数是字符串。只有当第一个参数为false，才会提示有错误，在控制台输出第二个参数，否则不会有任何结果。

```javascript
console.assert(false, '判断条件不成立')
// Assertion failed: 判断条件不成立

// 相当于
try {
  if (!false) {
    throw new Error('判断条件不成立');
  }
} catch(e) {
  console.error(e);
}
```

### console.time()，console.timeEnd()

这两个方法用于计时，可以算出一个操作所花费的准确时间。<br>time方法表示计时开始，timeEnd方法表示计时结束。它们的参数是计时器的名称。调用timeEnd方法之后，控制台会显示“计时器名称: 所耗费的时间”。

```javascript
console.time('Array initialize');

var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
  array[i] = new Object();
};

console.timeEnd('Array initialize');
// Array initialize: 1914.481ms
```

### console.group()，console.groupEnd()，console.groupCollapsed()

console.group和console.groupEnd这两个方法用于将显示的信息分组。它只在输出大量信息时有用，分在一组的信息，可以用鼠标折叠/展开。

```javascript
console.group('一级分组');
console.log('一级分组的内容');

console.group('二级分组');
console.log('二级分组的内容');

console.groupEnd(); // 二级分组结束
console.groupEnd(); // 一级分组结束
```

> 上面代码会将“二级分组”显示在“一级分组”内部，并且“一级分组”和“二级分组”前面都有一个折叠符号，可以用来折叠本级的内容。

console.groupCollapsed方法与console.group方法很类似，唯一的区别是该组的内容，在第一次显示时是收起的（collapsed），而不是展开的。

```javascript
console.groupCollapsed('Fetching Data');

console.log('Request Sent');
console.error('Error: Server not responding (500)');

console.groupEnd();
```

> 上面代码只显示一行”Fetching Data“，点击后才会展开，显示其中包含的两行。

### console.trace()，console.clear()

- console.trace方法显示当前执行的代码在堆栈中的调用路径。

```javascript
console.trace()
// console.trace()
//   (anonymous function)
//   InjectedScript._evaluateOn
//   InjectedScript._evaluateAndWrap
//   InjectedScript.evaluate
```

- console.clear方法用于清除当前控制台的所有输出，将光标回置到第一行。如果用户选中了控制台的“Preserve log”选项，console.clear方法将不起作用。

## 控制台命令行 API

浏览器控制台中，除了使用console对象，还可以使用一些控制台自带的命令行方法。

### `$_`

$_属性返回上一个表达式的值。

```javascript
2 + 2
// 4
$_
// 4
```

### `$0 - $4`

控制台保存了最近5个在 Elements 面板选中的 DOM 元素，$0代表倒数第一个（最近一个），$1代表倒数第二个，以此类推直到$4。

### `$(selector)`

`$(selector)`返回第一个匹配的元素，等同于`document.querySelector()`。注意，如果页面脚本对$有定义，则会覆盖原始的定义。比如，页面里面有 jQuery，控制台执行$(selector)就会采用 jQuery 的实现，返回一个数组。

### $$(selector)

$$(selector)返回选中的 DOM 对象，等同于document.querySelectorAll。
### $x(path)
$x(path)方法返回一个数组，包含匹配特定 XPath 表达式的所有 DOM 元素。
```javascript
$x("//p[a]")
// 上面代码返回所有包含a元素的p元素。
```
### inspect(object)
inspect(object)方法打开相关面板，并选中相应的元素，显示它的细节。DOM 元素在Elements面板中显示，比如inspect(document)会在 Elements 面板显示document元素。JavaScript 对象在控制台面板Profiles面板中显示，比如inspect(window)。
### getEventListeners(object)
getEventListeners(object)方法返回一个对象，该对象的成员为object登记了回调函数的各种事件（比如click或keydown），每个事件对应一个数组，数组的成员为该事件的回调函数。
### keys(object)，values(object)
keys(object)方法返回一个数组，包含object的所有键名。<br>values(object)方法返回一个数组，包含object的所有键值。
```javascript
var o = {'p1': 'a', 'p2': 'b'};

keys(o)
// ["p1", "p2"]
values(o)
// ["a", "b"]
```
### monitorEvents(object[, events]) ，unmonitorEvents(object[, events])
monitorEvents(object[, events])方法监听特定对象上发生的特定事件。事件发生时，会返回一个Event对象，包含该事件的相关信息。unmonitorEvents方法用于停止监听。
```javascript
monitorEvents(window, "resize");
monitorEvents(window, ["resize", "scroll"])
```
monitorEvents允许监听同一大类的事件。所有事件可以分成四个大类。

- mouse："mousedown", "mouseup", "click", "dblclick", "mousemove", "mouseover", "mouseout", "mousewheel"
- key："keydown", "keyup", "keypress", "textInput"
- touch："touchstart", "touchmove", "touchend", "touchcancel"
- control："resize", "scroll", "zoom", "focus", "blur", "select", "change", "submit", "reset"
### 其他方法
命令行 API 还提供以下方法。

- clear()：清除控制台的历史。
- copy(object)：复制特定 DOM 元素到剪贴板。
- dir(object)：显示特定对象的所有属性，是console.dir方法的别名。
- dirxml(object)：显示特定对象的 XML 形式，是console.dirxml方法的别名。
## debugger 
debugger语句主要用于除错，作用是设置断点。如果有正在运行的除错工具，程序运行到debugger语句时会自动停下。如果没有除错工具，debugger语句不会产生任何结果，JavaScript 引擎自动跳过这一句。<br>Chrome 浏览器中，当代码运行到debugger语句时，就会暂停运行，自动打开脚本源码界面。
```javascript
for(var i = 0; i < 5; i++){
  console.log(i);
  if (i === 2) debugger;
}
```
# JS正则表达式
### 语法
```javascript
/正则表达式主体/修饰符(可选)
```
示例：
```javascript
var patt = /runoob/i
```
/runoob/i  是一个正则表达式。<br>runoob  是一个正则表达式主体 (用于检索)。<br>i  是一个修饰符 (搜索不区分大小写)。
### 使用字符串方法
在 JavaScript 中，正则表达式通常用于两个字符串方法 : `search()` 和 `replace()`。

- search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串，并返回子串的起始位置。
- replace() 方法用于在字符串中用一些字符串替换另一些字符串，或替换一个与正则表达式匹配的子串。
#### search()
search 方法可使用字符串作为参数。字符串参数会转换为正则表达式：
```javascript
// 检索字符串中 "Runoob" 的子串：
var str = "Visit Runoob!"; 
var n = str.search("Runoob");
```
#### replace()

- replace() 方法使用正则表达式

示例：使用正则表达式且不区分大小写将字符串中的 Microsoft 替换为 Runoob :
```javascript
var str = document.getElementById("demo").innerHTML; 
var txt = str.replace(/microsoft/i,"Runoob");
```

- replace() 方法将接收字符串作为参数：
```javascript
var str = document.getElementById("demo").innerHTML; 
var txt = str.replace("Microsoft","Runoob");
```
### 正则表达式修饰符
修饰符 可以在全局搜索中不区分大小写：

| **修饰符** | **描述** |
| --- | --- |
| i | 执行对大小写不敏感的匹配。 |
| g | 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。 |
| m | 执行多行匹配。 |

### 正则表达式模式
方括号用于查找某个范围内的字符：

| 表达式 | 描述 |
| --- | --- |
| [abc] | 查找方括号之间的任何字符。 |
| [0-9] | 查找任何从 0 至 9 的数字。 |
| (x&#124;y) | 查找任何以 &#124; 分隔的选项。 |

元字符是拥有特殊含义的字符：

| 元字符 | 描述 |
| --- | --- |
| \\d | 查找数字。 |
| \\s | 查找空白字符。 |
| \\b | 匹配单词边界。 |
| \\uxxxx | 查找以十六进制数 xxxx 规定的 Unicode 字符。 |

量词：

| n+ | 匹配任何包含至少一个 _n_ 的字符串。 |
| --- | --- |
| n* | 匹配任何包含零个或多个 _n_ 的字符串。 |
| n? | 匹配任何包含零个或一个 _n_ 的字符串。 |

### 使用 RegExp 对象
在 JavaScript 中，`RegExp` 对象是一个预定义了属性和方法的正则表达式对象。
#### test()
test() 方法用于检测一个字符串是否匹配某个模式，如果字符串中含有匹配的文本，则返回 true，否则返回 false。<br>示例：用于搜索字符串中的字符 "e"：
```javascript
var patt = /e/;
patt.test("The best things in life are free!");

// 你可以不用设置正则表达式的变量，以上两行代码可以合并为一行：
/e/.test("The best things in life are free!")

// 字符串中含有 "e"，所以该实例输出为：true
```
#### exec()
exec() 方法用于检索字符串中的正则表达式的匹配。<br>该函数返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。<br>示例：用于搜索字符串中的字符 "e"：
```javascript
/e/.exec("The best things in life are free!");
// 字符串中含有 "e"，所以该实例输出为: e
```
# 
$$
