---
date created: 2024-12-25 01:01
date updated: 2024-12-25 01:01
dg-publish: true
---

namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”。

它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了。

namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用：

```typescript
namespace Utils {
  function isString(value:any) {
    return typeof value === 'string';
  }

  // 正确
  isString('yes');
}

Utils.isString('no'); // 报错
```

> 命名空间Utils里面定义了一个函数isString()，它只能在Utils里面使用，如果用于外部就会报错。

如果要在命名空间以外使用内部成员，就必须为该成员加上export前缀，表示对外输出该成员。

```typescript
namespace Utility {
  export function log(msg:string) {
    console.log(msg);
  }
  export function error(msg:string) {
    console.error(msg);
  }
}

Utility.log('Call me');
Utility.error('maybe!');
```

编译出来的 JavaScript 代码如下：

```typescript
var Utility;

(function (Utility) {
  function log(msg) {
    console.log(msg);
  }
  Utility.log = log;
  function error(msg) {
    console.error(msg);
  }
  Utility.error = error;
})(Utility || (Utility = {}));
```

> 命名空间Utility变成了 JavaScript 的一个对象，凡是export的内部成员，都成了该对象的属性。
> 这就是说，namespace 会变成一个值，保留在编译后的代码中。这一点要小心，它不是纯的类型代码。
