---
banner: 
date_created: Wednesday, May 29th 2022, 12:37:40 am
date_updated: Sunday, February 9th 2025, 12:23:49 am
title: Obsidian插件之dataview
author: hacket
categories:
  - Tools
category: Obsidian
tags: [obsidian]
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
aliases: [dataview]
linter-yaml-title-alias: dataview
---

```dataviewjs
const startHeadinglevel = 2;
const file = app.workspace.getActiveFile();
const { headings } = app.metadataCache.getFileCache(file);

// 全列表的形式
const raws = headings.map( p => {
    let repeatCount = Math.max((p.level - startHeadinglevel) * 4, 0);
    let spacesPrefix = ' '.repeat( repeatCount + 4 );
    let listSign = repeatCount > 0 ? '- ' : '';
    let linkText = `[[#${p.heading}]]`;
    let headingList = (p.level < startHeadinglevel) ? `- ${linkText}` : `${spacesPrefix}- ${linkText}`;
    return headingList;
  }
)

let result = raws.join('\n');
// 添加行距
dv.container.style.lineHeight = "1.5em";
dv.paragraph(result)
```

# dataview

## 什么是 dataview？

Obsidian 的 Dataview 插件是一个高度强大的数据管理工具，允许用户在 Obsidian 中以各种方式查询和组织数据。通过 Dataview，你可以更高效地管理和提取笔记中的信息。

**功能概览：**
- `数据查询`：Dataview 允许你使用类似于 SQL 的查询语言来搜索你的笔记，并返回满足特定条件的笔记。
- `动态列表和表格`：根据你的查询，Dataview 可以生成动态的列表或表格，当相关笔记内容变化时，这些列表和表格会自动更新。
- `元数据支持`：Dataview 特别适用于有元数据的笔记。你可以在笔记的前导部分定义元数据，例如日期、作者、标签等，然后使用 Dataview 查询和组织这些数据。
- `灵活的显示选项`：除了常规的列表和表格，你还可以使用 Dataview 创建任务列表、日历视图等。

## dataview 基础

### DataView 查询语法

```
<QUERY-TYPE> <WITHOUT ID> <字段>
FROM <来源>
<WHERE> <条件表达式>
<SORT> <排序依据 排序方式>
<GROUP BY> <分组依据>
<LIMIT> <限定显示记录数>
<FLATTEN> <拆分表达式>
```

> 注：dataview 语法都是要包裹在 `dataview` 代码块中间的

### QUERY-TYPE 展示方式

#### TABLE 表格

以表格的形式显示符合查询条件的文件清单和相关属性。

```
TABLE WITHOUT ID
  file.link as "文件名称",
  aliases as "别名",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
SORT file.cday DESC
```

#### LIST 列表

以无序列表的形式显示符合查询条件的文件清单。

```
LIST
FROM "200-学习箱/210-知识库搭建"
```

#### TASK 任务

仅以任务列表的形式显示符合查询条件的任务列表。

```
TASK
FROM "200-学习箱/210-知识库搭建"
```

#### CALENDAR 日历

以日历视图的形式显示查询结果，日历现在还有个 Bug，经常会显示两个重复月份的日历。

```
CALENDAR file.cday
WHERE contains(file.name, "PicGo")
```

//必须加日期型的字段作为日历中的定位

- CALENDAR file.cday
- WHERE contains(file.name, "PicGo")

### 字段

#### 隐含字段 **implicit**（文件自带的属性）

 dataview 自带大量的元数据对页面进行注释，如文件的创建日期、任何相关的日期、文件中的链接、标签等。

| 文件属性             | 字段类型      | 属性说明                     |
| ---------------- | --------- | ------------------------ |
| file.name        | Text      | 文件名                      |
| file.folder      | Text      | 所在文件夹                    |
| file.path        | Text      | 完整路径 + 完整文件名             |
| file.ext         | Text      | 扩展名                      |
| file.link        | Link      | 链接至本文件                   |
| file.size        | Number    | 文件大小 (bytes)             |
| file.ctime       | Date Time | 创建时间                     |
| file.cday        | Date      | 创建日期                     |
| file.mtime       | Date Time | 最后修改时间                   |
| file.mday        | Date      | 最后修改日期                   |
| file.tags        | List      | 文中的 `#标签` 和 YAML 中的 tags |
| file.etags       | List      | 文中的 `#标签` 和 YAML 中的 tags |
| file.inlinks     | List      | 反向链接（指向此文件的所有传入链接的数组）    |
| file.outlinks    | List      | 正向链接（出站链接）               |
| file.tasks       | List      | 文中的任务列表                  |
| file.lists       | List      | 文中的列表 (包含任务列表)           |
| file.frontmatter | List      | 文件中的 YAML 块内容            |
| file.starred     | Boolean   | 加星                       |
| file.aliases     | List      | 注释的所有别名数组                |

如果文件的标题内有一个日期（格式为 yyyy-mm-dd 或 yyyymmdd），或者有一个 Date 字段/inline 字段，它也有以下属性:

- `file.day`: 一个该文件的隐含日期。

#### YAML 定义属性

`:` 之前的为属性名，直接使用，不需要 `file.属性`

#### 字段类型

dataview 支持数种不同的字段类型：

| 字段类型    | 表达方式                                                                                               | 举例             |
| ------- | -------------------------------------------------------------------------------------------------- | -------------- |
| Text    | 用 "" 括起来的字符                                                                                        | " 这就是 Text 类型 "  |
| Number  | 由符号 + - 数字 0 ~ 9 和小数点 . 组成                                                                         | -0.98          |
| Boolean | 只有 true 和 false 两个值，表示是与否                                                                          | true           |
| Date    | 由日期和时间组成，遵循 ISO 8601 标准  <br>格式为 `YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]` 月份后面的内容都是可选的。                      | 2021-04-18     |
| Link    | 普通的 Obsidian 链接如 `[[Page]]` 或者 `[[Page\|Page Display]]`                                            | "`[[内部文件链接]]`" |
| List    | 有序/无序/任务列表                                                                                         | - 无序列表         |
| Object  | 名称 (name) 到 dataview 字段的映射。这仅能在 YAML 扉页中利用通用的 YANML 对象语法进行定义。 对象语法: `field: value1: 1 value2: 2 …` |                |

不同的字段类型非常重要。这能确保 dataview 理解怎样合理的对值进行比较和排序，并提供不同的操作。

查询实例：

```
TABLE WITHOUT ID
  file.link as "文件名称",
  aliases as "别名",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
SORT file.cday DESC
```

### 创建查询

一旦你给相关的页面添加了有用的数据，你就可以在某一个地方展示它或者操作它。dataview 通过 `dataview` 代码块建立内联查询，写下查询代码，将会动态运行并在笔记的预览窗口展示。写这样的查询，有三种方式：

1. dataview 的查询语言是一个用于快速创建视图，简化的，类 SQL 的语言。它支持基本的算术和比较操作，对基础应用很友好。
2. 查询语言也提供内联查询，允许你直接在一个页面内嵌入单个值——通过 `= date(tody)` 创建今天的日期，或者通过 `= [[Page]].value` 来嵌入另一个页面的字段。
3. dataview JavaScript API 为你提供了 JavaScript 的全部功能，并为拉取 Dataview 数据和执行查询提供了 DSL ，允许你创建任意复杂的查询和视图。

### 关键字

#### FROM 数据来源

`FROM` 语句决定了哪些页面在初始被收集并传递给其他命令进行进一步的筛选。你可以从任何来源中选择，来源可选择 `文件夹`，`标签`，`内链` 和 `外链`。

- **标签 (Tags)**: 从标签 (包含子标签) 中选择，使用 `FROM #tag`。
- **文件夹 (Folders)**: 从文件夹 (包含子文件夹) 中选择，使用 `FROM "folder"`。
- **链接 (Links)**: 你可以选择一个链接到该文件的链接，也可以选择该文件链接到其它页面的链接：
- 获得链接到 `[[note]]` 的所有页面，使用 `FROM [[note]]`。
- 获得从 `[[note]]` 链接的所有页面 (如，文件中的所有链接)，使用 `FROM outgoing([[note]])`。

你可以对过滤器进行组合，以便使用 "and " 和 "or " 获得更高级的来源。

举个例子

- `#tag and "folder"` 将返回在 `folder` 中和包含 `#tag` 的所有页面。
- `[[Food]] or [[Exercise]]` 将给出任何链接到 `[[Food]]` 或 `[[Exercise]]` 的页面。

##### Tags 标签

```sql
LIST
FROM #DataView 
```

##### Folders 文件夹

```sql
TABLE WITHOUT ID
  file.link as "文件名称",
  aliases as "别名",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
SORT file.cday DESC
```

##### Specific Files 指定文件

```sql
TABLE WITHOUT ID
  file.link as "文件名",
  file.tasks.text as "任务名",
  choice(file.tasks.completed, "是", "否") as "已完成"
FROM "200-学习箱/210-知识库搭建/Markdown for macOS"
```

##### Links 链接

```
LIST
FROM outgoing([[Markdown for macOS]]) 
```

//查询 `[[内部文件链接]]` 被哪些文件链接，即入链

##### Combing Sources 多重来源

即将 1、2、4 来源联合起来使用

```
TABLE WITHOUT ID
  file.link as "文件名称",
  aliases as "别名",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建" and outgoing([[Markdown for macOS]])
SORT file.cday DESC
```

#### WHERE 过滤条件

笔记进行过滤，聚合条件。

##### Text 类条件

**1、包含指定文本**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE icontains(file.name,"obsidian")
```

**2、不包含指定文本**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE !icontains(file.name,"obsidian")
```

**3、以特定文本开头**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE startswith(file.name,"Obsidian")
```

**4、以特定文本结尾**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE endswith(file.name,"COS")
```

**5、英文大小写转换**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE endswith(lower(file.name),"cos")


TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE startswith(upper(file.name),"OBSIDIAN")
```

##### Number 类条件

```sql
# 等于与不等于
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE number1 = 9

TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE !(number1 = 9)

# 大于或大于等于
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE number1 >= 8

# 小于或小于等于
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE number1 <= 9 
## 当文件 YAML 没有定义该属性时，该属性值默认为 0

# 数字的四则运算
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE number1 - number1 <= 0
```

##### Date 类条件

**1、日期的格式化**

```sql
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  dateformat(file.ctime,"HH:mm: ss") as "创建时间",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday <= date("2023-02-20")
## 日期格式化通常只作为输出显示格式定义，不作为条件
```

**2、日期比较**

```sql
# 等于指定日期
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday = date("2023-02-19")

# 大于等于指定日期
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday >= date("2023-02-19")

# 小于等于指定日期
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday <= date("2023-02-20")
```

**3、常用的日期属性**

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday.month = date(today).month
```

// year

// month

// day

// date (today)

// date (now)

// date (tomorrow)

// date (yesterday)

// date (sow)

// date (eow)

```
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.cday >= date(sow) and file.cday <= date(eow)
```

##### Boolean 类条件

```sql
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE file.starred

TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE !file.starred

TASK
WHERE !fullyCompleted ##  如果本级任务未完成，下级任务已完成，会将下级已完成的一起显示

TASK
WHERE fullyCompleted
```

Boolean 类字段的格式化，就是将 true、false 转换为更偏于用户阅读的是 / 否，或者是 yes / no

##### List 类条件

```sql
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE contains(tags, "DataView")

TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE !contains(tags,"DataView") # 如果 YAML 中没有定议 tags，则默认为空
```

##### Link 类条件

```sql
TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE contains(file.outlinks, [[内部文件链接]])

TABLE WITHOUT ID
  file.link as "文件名称",
  dateformat(file.cday,"yyyy-MM-dd") as "创建日期",
  choice(file.starred, "是", "否") as "加星"
FROM "200-学习箱/210-知识库搭建"
WHERE contains(file.inlinks, [[Markdown for macOS]])
```

##### and 条件连接符

```
<条件1> and <条件2>

1. 只满足<条件1>，不会被显示到查询结果中
2. 只满足<条件2>，不会被显示到查询结果中
3. 同时满足<条件1>和<条件2>，会显示到查询结果中
```

##### or 条件连接符

```
<条件1> or <条件2>

1. 只满足<条件1>，会被显示到查询结果中
2. 只满足<条件2>，会被显示到查询结果中
3. 同时满足<条件1>和<条件2>，会显示到查询结果中
```

##### () 定义条件优先级

仅发生在需要同时运用 and 和 or 两个边接符时，才需要使用括号定义优先级

```
（<条件1> or <条件2>) and <条件3>

1. 只满足<条件1>，不会被显示到查询结果中
2. 只满足<条件2>，不会被显示到查询结果中
3. 只满足<条件3>，不会被显示到查询结果中
4. 同时满足<条件1>和<条件2>，不会显示到查询结果中
5. 同时满足<条件1>和<条件3>，会显示到查询结果中
6. 同时满足<条件2>和<条件3>，会显示到查询结果中
7. 同时满足<条件1>、<条件2>和<条件3>，会显示到查询结果中
仅发生在需要同时运用 and 和 or 两个边接符时，才需要使用括号定义优先级


（<条件1> and <条件2>) or <条件3>

8. 只满足<条件1>，不会被显示到查询结果中
9. 只满足<条件2>，不会被显示到查询结果中
10. 只满足<条件3>，会被显示到查询结果中
11. 同时满足<条件1>和<条件2>，会显示到查询结果中
12. 同时满足<条件1>和<条件3>，会显示到查询结果中
13. 同时满足<条件2>和<条件3>，会显示到查询结果中
14. 同时满足<条件1>、<条件2>和<条件3>，会显示到查询结果中
```

#### SORT

根据什么条件进行排序。

你可以给出多个字段来进行排序。排序将在第一个字段的基础上进行。接着，如果出现相等，第二个字段将被用来对相等的字段进行排序。如果仍然有相等，将用第三个字段进行排序，以此类推。

```sql
SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]
```

#### GROUP BY

对一个字段的所有结果进行分组。每个唯一的字段值产生一行，它有两个属性：

- 一个对应于被分组的字段
- 一个是 `rows` 数组字段，包含所有匹配的页面。

#### LIMIT

限制输出多少条结果

#### FLATTEN

根据字段或计算将一个结果拆分为多个结果。

```sql
FLATTEN field
FLATTEN (computed_field) AS name
```

### 表达式

#### 表达式概述

Dataview 查询语言 `表达式` 可以是任何能产生一个值的量，所有字段都是表达式，字面值如 `6`，已计算的值如 `field - 9` 都是一个表达式，做一个更具体的总结：

#### 表达式类型

1、常规

- `field` (directly refer to a field)
- `simple-field` (refer to fields with spaces/punctuation in them like "Simple Field!")
- `a.b` (if a is an object, retrieve field named 'b')
- `a[expr]` (if a is an object or array, retrieve field with name specified by expression 'expr')
- `f(a, b, …)` (call a function called `f` on arguments a, b, …)

2、算术运算

- `a + b ` (addition)
- `a - b` (subtraction)
- `a * b` (multiplication)
- `a / b` (division)

3、比较运算

- `a > b` (check if a is greater than b)
- `a < b` (check if a is less than b)
- `a = b` (check if a equals b)
- `a != b` (check if a does not equal b)
- `a <= b` (check if a is less than or equal to b)
- `a >= b` (check if a is greater than or equal to b)

4、特殊操作

- `[[Link]].value` (fetch `value` from page `Link`)

#### 特定类型的交互

大多数 dataview 类型与运算符有特殊的相互作用，或者有额外的字段可以使用索引操作符索引。

1、日期：

你可以通过索引来检索一个日期的不同组成部分：`date.year`，`date.month`，`date.day`，`date.hour`。 `date.minute`, `date.second`, `date.week`。你也可以将时间段添加到日期中以获得新的日期。

2、时间段：

时间段可以相互添加，也可以添加到日期。你可以通过索引来检索一个时间段的各种组成部分。`duration.years`, `duration.months`, `duration.days`, `duration.hours`, `duration.minutes`, `duration.seconds`.

3、链接：

你可以 " 通过索引 " 一个链接来获得相应页面上的值。例如，`[[Link]].value` 将获得来自 `Link` 页面上的 `value` 值。

### 函数

#### 构造器

构造器创建值

`object(key1, value1, …)` 用给定的键和值创建一个新的对象。在调用中，键和值应该交替出现，键应该总是字符串/文本。

```
object() => empty object
object("a", 6) => object which maps "a" to 6
object("a", 4, "c", "yes") => object which maps a to 4, and c to "yes"
```

`list(value1, value2, …)` 用给定的值创建一个新的列表。

```
list() => empty list
list(1, 2, 3) => list with 1, 2, and 3
list("a", "b", "c") => list with "a", "b", and "c"
```

`date(any)` 从提供的字符串、日期或链接对象中解析一个日期，解析不出返回 null。

```
date("2020-04-18") = <date object representing April 18th, 2020>
date([[2021-04-16]]) = <date object for the given page, refering to file.day>
```

`number(string)` 从给定的字符串中抽出第一个数字，并返回该数字。如果字符串中没有数字，则返回 null。

```
number("18 years") = 18
number(34) = 34
number("hmm") = null
```

`link(path, [display])` 从给定的文件路径或名称构建一个链接对象。如果有两个参数，第二个参数是链接的显示名称。

```
link("Hello") => link to page named 'Hello'
link("Hello", "Goodbye") => link to page named 'Hello', displays as 'Goodbye'
```

`elink(url, [display])` 构建一个指向外部网址的链接（如 `www.google.com`）。如果有两个参数，第二个参数是该链接的显示名称。

```
elink("www.google.com") => link element to google.com
elink("www.google.com", "Google") => link element to google.com, displays as "Google"
```

#### 常用函数

**数值操作**：

`round(number, [digits])`

将一个数字四舍五入到指定的位数。如果没有指定第二个参数，则舍入到最接近的整数。 否则，四舍五入到给定的位数。

```text
round(16.555555) = 17round(16.555555, 2) = 16.56
```

**对象，数组和字符串操作**：

对容器对象内部的值进行操作的操作。

`contains(object|list|string, value)`

检查给定的容器类型中是否有给定的值。这个函数的行为稍有不同，它基于第一个参数是一个对象，一个列表，还是一个字符串。

- 对于对象，检查该对象是否有一个给定名称的键。如： `contains(file, "ctime") = true contains(file, "day") = true (if file has a date in its title, false otherwise)`
- 对于列表，检查数组中是否有元素等于给定的值。如： `contains(list(1, 2, 3), 3) = true contains(list(), 1) = false`
- 对于字符串，检查给定的值是否是字符串的子串。 `contains("hello", "lo") = true contains("yes", "no") = false`

`extract(object, key1, key2, …)` 从一个对象中抽出多个字段，创建一个抽出字段的新对象。

```text
extract(file, "ctime", "mtime") = object("ctime", file.ctime, "mtime", file.mtime)extract(object("test", 1)) = object()
```

`sort(list)` 排序列表，返回一个排序好的新列表。

```text
sort(list(3, 2, 1)) = list(1, 2, 3)
sort(list("a", "b", "aa")) = list("a", "aa", "b")
```

`reverse(list)` 反转列表，返回一个反转好的新列表。

```text
reverse(list(1, 2, 3)) = list(3, 2, 1)
reverse(list("a", "b", "c")) = list("c", "b", "a")
```

`length(object|array)` 返回一个对象中的字段数量，或一个数组中的元素数量。

```text
length(list()) = 0length(list(1, 2, 3)) = 3
length(object("hello", 1, "goodbye", 2)) = 2
```

`sum(array)` 数组中数值元素求和。

```text
sum(list(1, 2, 3)) = 6
```

`all(array)` 只有当数组中的所有值都为真，才会返回 "true"。你也可以给这个函数传递多个参数，只有当所有的参数都为真时，它才会返回 `true'。

```text
all(list(1, 2, 3)) = true
all(list(true, false)) = false
all(true, false) = false
all(true, true, true) = true
```

`any(array)` 只要数组中有值为真，便返回 `true`。也可以给这个函数传递多个参数，只要有参数为真，便返回 `true`。

```text
any(list(1, 2, 3)) = true
any(list(true, false)) = true
any(list(false, false, false)) = false
all(true, false) = true
all(false, false) = false
```

`none(array)` 如果数组中没有元素，返回 `none`。

`join(array)` 将一个数组中的元素连接成一个字符串（即在同一行呈现所有的元素）。如果有第二个参数，那么每个元素将被给定的分隔符分开。

```text
join(list(1, 2, 3)) = "1, 2, 3"
join(list(1, 2, 3), " ") = "1 2 3"
join(6) = "6"
join(list()) = ""
```

**字符串操作**：

`regexmatch(pattern, string)` 检查给定的字符串是否与给定的模式相匹配（使用 JavaScript regex 引擎）。

```text
regexmatch("\w+", "hello") = true
regexmatch(".", "a") = true
regexmatch("yes|no", "maybe") = false
```

`regexreplace(string, pattern, replacement)` 用 "replacement " 替换所有在 "string " 中匹配 _regex_ `pattern` 的实例。这使用了 JavaScript 的替换方法，所以你可以使用特殊字符如 `$1` 来指代第一个捕获组，以此类推。

```text
regexreplace("yes", "[ys]", "a") = "aea"
regexreplace("Suite 1000", "\d+", "-") = "Suite -"
```

`replace(string, pattern, replacement)` 用 `replacement` 替换 `string` 中的所有 `pattern` 实例。

```text
replace("what", "wh", "h") = "hat"
replace("The big dog chased the big cat.", "big", "small") = "The small dog chased the small cat."
replace("test", "test", "no") = "no"
```

`lower(string)` 将一个字符串所有字符转换为小写字符。

```text
lower("Test") = "test"
lower("TEST") = "test"
```

`upper(string)` 将一个字符串所有字符转换为大写字符。

```text
upper("Test") = "TEST"
upper("test") = "TEST"
```

#### 工具函数

`default(field, value)`

如果 `field` 为空，返回 `value`；否则返回 `field`。对于用默认值替换空值很有用。例如，要显示尚未完成的项目，使用 `"incomplete"` 作为其默认值。

```text
default(dateCompleted, "incomplete")
```

默认值在两个参数中都是矢量；如果你需要在一个列表参数中明确使用默认值，请使用 `ldefault`，它与默认值相同，但没有被矢量化。

```text
default(list(1, 2, null), 3) = list(1, 2, 3)
ldefault(list(1, 2, null), 3) = list(1, 2, null)
```

`choice(bool, left, right)`

一个原始的 if 语句 -- 如果第一个参数为真，则返回第二个参数的内容；否则，返回第三个参数的内容。

```text
choice(true, "yes", "no") = "yes"
choice(false, "yes", "no") = "no"
choice(x > 4, y, z) = y if x > 4, else z
```

`striptime(date)`

剥离日期中的时间部分，只留下年、月、日。如果你在比较日期的时候不在乎时间，这种方式挺好。

```text
striptime(file.ctime) = file.cday
striptime(file.mtime) = file.mday
```

## dataview 使用？

### 基本查询

在你的笔记中，你可以使用以下代码块形式来进行查询：

```
table
from "你的笔记文件夹"
where your-condition
```

这会从指定的文件夹中查询满足条件的笔记，并以表格形式显示。

### 高级查询

你可以使用更复杂的查询，例如：

```
table title, date(created) as "创建日期"
from "你的笔记文件夹"
where contains(title, "关键词")
sort date(created)
```

这将列出包含 " 关键词 " 的标题以及笔记的创建日期，并按创建日期排序。

如，查询 obsidian 目录下：

```dataview
table title, date(date_created) as "创建日期"
from "obsidain"
where contains(title, "obsidain")
sort date(date_created)
```

### 其他视图

除了 `table` 视图，你还可以使用 `list` 和 `task` 视图来展示查询结果。

## dataview 应用场景？

### 1、项目管理

你可以为每个项目创建一个笔记，并在其中添加相关的元数据，如项目开始日期、结束日期、负责人等。然后使用 Dataview 查询和组织这些项目笔记。

### 2、书籍或文章索引（生成目录）

如果你有一个书籍或文章的笔记集合，你可以使用 Dataview 为这些笔记添加作者、出版日期等元数据，并创建一个动态的书籍或文章索引。

- 从文件名字
- 从作者
- 从标签

### 3、日常任务跟踪

你可以在笔记中定义任务，并为其添加截止日期、优先级等元数据。然后使用 Dataview 创建一个动态的任务列表。

# Ref

- [Obsidian 达人成长之路 #3：使用终极工具 Dataview 释放笔记库的潜力 · 案例讲解本文为 Obsidi - 掘金](https://juejin.cn/post/7374988830494228491)
