---
date created: 2024-12-25 01:01
date updated: 2024-12-25 01:01
dg-publish: true
---

# [tsconfig.json基础](https://wangdoc.com/typescript/tsconfig.json)

## 简介

`tsconfig.json`是 TypeScript 项目的配置文件，放在项目的根目录。反过来说，如果一个目录里面有tsconfig.json，TypeScript 就认为这是项目的根目录。<br>如果项目源码是 JavaScript，但是想用 TypeScript 处理，那么配置文件的名字是`jsconfig.json`，它跟tsconfig的写法是一样的。<br>tsconfig.json文件主要供tsc编译器使用，它的命令行参数--project或-p可以指定tsconfig.json的位置（目录或文件皆可）。

> tsc -p ./dir

如果不指定配置文件的位置，tsc就会在当前目录下搜索tsconfig.json文件，如果不存在，就到上一级目录搜索，直到找到为止。<br>tsconfig.json文件的格式，是一个 JSON 对象，最简单的情况可以只放置一个空对象`{}`

```json
{
  "compilerOptions": {
    "outDir": "./built",
    "allowJs": true,
    "target": "es5"
  },
  "include": ["./src/**/*"]
}
```

- include：指定哪些文件需要编译。
- allowJs：指定源目录的 JavaScript 文件是否原样拷贝到编译后的目录。
- outDir：指定编译产物存放的目录。
- target：指定编译产物的 JS 版本。

tsconfig.json文件可以不必手写，使用 tsc 命令的`--init`参数自动生成。

> tsc --init
> 命令生成的tsconfig.json文件，里面会有一些默认配置

也可以使用别人预先写好的 tsconfig.json 文件，npm 的@tsconfig名称空间下面有很多模块，都是写好的tsconfig.json样本，比如 `@tsconfig/recommended`和`@tsconfig/node16`。<br>这些模块需要安装，以@tsconfig/deno为例：

```shell
$ npm install --save-dev @tsconfig/deno
# 或者
$ yarn add --dev @tsconfig/deno
```

安装以后，就可以在tsconfig.json里面引用这个模块，相当于继承它的设置，然后进行扩展。

```json
{
  "extends": "@tsconfig/deno/tsconfig.json"
}
```

## exclude

exclude属性是一个数组，必须与include属性一起使用，用来从编译列表中去除指定的文件。它也支持使用与include属性相同的通配符。

```json
{
  "include": ["**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

## include

include属性指定所要编译的文件列表，既支持逐一列出文件，也支持通配符。文件位置相对于当前配置文件而定。

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

include属性支持三种通配符：

- `?`：指代单个字符
- `*`：指代任意字符，不含路径分隔符
- `**`：指定任意目录层级。

如果不指定文件后缀名，默认包括`.ts`、`.tsx`和`.d.ts`文件。如果打开了`allowJs`，那么还包括`.js`和`.jsx`。

## extends

tsconfig.json可以继承另一个tsconfig.json文件的配置。如果一个项目有多个配置，可以把共同的配置写成`tsconfig.base.json`，其他的配置文件继承该文件，这样便于维护和修改。<br>extends属性用来指定所要继承的配置文件。它可以是本地文件。

```json
{
  "extends": "../tsconfig.base.json"
}
```

如果extends属性指定的路径不是以./或../开头，那么编译器将在node_modules目录下查找指定的配置文件。<br>extends属性也可以继承已发布的 npm 模块里面的 tsconfig 文件。

```json
{
  "extends": "@tsconfig/node12/tsconfig.json"
}
```

extends指定的tsconfig.json会先加载，然后加载当前的tsconfig.json。如果两者有重名的属性，后者会覆盖前者。

## files

files属性指定编译的文件列表，如果其中有一个文件不存在，就会报错。<br>它是一个数组，排在前面的文件先编译。

```json
{
  "files": ["a.ts", "b.ts"]
}
```

该属性必须逐一列出文件，不支持文件匹配。如果文件较多，建议使用include和exclude属性。

## references

references属性是一个数组，数组成员为对象，适合一个大项目由许多小项目构成的情况，用来设置需要引用的底层项目。

```json
{
  "references": [
    { "path": "../pkg1" },
    { "path": "../pkg2/tsconfig.json" }
  ]
}
```

references数组成员对象的path属性，既可以是含有文件tsconfig.json的目录，也可以直接是该文件。<br>与此同时，引用的底层项目的tsconfig.json必须启用composite属性。

```json
{
  "compilerOptions": {
    "composite": true
  }
}
```

## compilerOptions

compilerOptions属性用来定制编译行为。这个属性可以省略，这时编译器将使用默认设置。<br><https://wangdoc.com/typescript/tsconfig.json#compileroptions>
