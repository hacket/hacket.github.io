---
title: "为使用 Rouge 的 Jekyll 主题添加高亮指定行的功能"
date: 2022-9-27 13:30:09 +0800
categories: [教程, 网站]
tags: [jekyll, 教程, 网站, javascript]     # TAG names should always be lowercase
---

## 前言

实际上，这个功能在 Jekyll 的 Issue [#8621](https://github.com/jekyll/jekyll/issues/8621) 上早有讨论，但是时至今日这个功能迟迟没有进展。

相关的讨论者提出了一些简易的 Ruby 脚本，但是这些脚本功能并不完整，例如不支持行号。但是奈何本人又不会 Ruby，只能考虑另辟蹊径，通过 JS 来实现行高亮。

二月时写了一个效果较差的版本，近日重新写了一个更好一点的版本，因此重写本帖。

Ruby 脚本在生成站点时静态地添加高亮块，没有运行时时间成本。JS 脚本在浏览者打开网页时才动态计算并添加高亮块，有一定的运行时时间成本。如果有比较合适的 Ruby 脚本，还是使用 Ruby 的好。

## 实现思路

1. 通过 Kramdown 的语法为代码框增加属性：

   ````markdown
   ```c
   int main(int argc, char* argv[]) {
      return 0;
   }
   ```
   {: highlight-lines="2" }
   ````

   `highlight-lines` 支持复数行的选择，例如 `highlight-lines="2-4, 7, 9-16, 21"`。

2. 在 JS 中，通过正则匹配，将 `highlight-lines` 的值拆为具体的行数，例如将 `"2-4, 7, 9-16, 21"` 拆成 `[2, 3, 4, 7, 9, 10, 11, 12, 13, 14, 15, 16, 21]`。
3. 遍历所有 `$(".highlighter-rouge")`{:.language-javascript}，找到每个代码块内的最后一个 `<pre>`{:.language-html} 子元素（因为行号也是一个 `<pre>`{:.language-html}，要排除行号的影响）。
4. 遍历所有子元素（使用 `nextSibling` 而不是 `nextElementSibling`，因为我们要匹配纯字符元素）。匹配 `\n`，并且从 `\n` 处将当前元素截断，把它拆成两个或更多个同类型的元素。之后，如果当前的行数在高亮行的列表中，则新增一个 `class="hll"` 的 `<span>`{:.language-html} 元素，将一行内所有元素都加入其中。
5. 在需要的页面中调用该脚本，所有高亮行会被 `<span class="hll">`{:.language-html} 元素包裹。
6. 在 CSS 中为 `.hll`{:.language-css} 配置背景色。

具体实现可参考（比较烂，感觉优化空间挺大）：

```javascript
$(function () {
    let highlightLines = function (codeBlock, highlight_lines) {
        let current_line = null;
        let current_lineno = 1;
        for (let cur = codeBlock.firstChild; cur != null; cur = cur.nextSibling) {
            if (current_line == null)
                current_line = cur;
            let contents = cur.textContent.split(/\n/g);
            if ((contents || []).length > 1) {
                let newline_count = contents.length - 1;
                let subNodes = [];
                for (let i = 0; i < newline_count + 1; i++) {
                    let subNode = cur.cloneNode(false);
                    subNode.textContent = contents[i];
                    if (i != newline_count)
                        subNode.textContent += '\n';
                    codeBlock.insertBefore(subNode, cur);
                    subNodes.push(subNode);
                }
                codeBlock.removeChild(cur);
                cur = subNodes[newline_count];
                for (let i = 0; i < newline_count; i++) {
                    if (highlight_lines.includes(current_lineno)) {
                        let hll_node = document.createElement("span");
                        hll_node.setAttribute("class", "hll");
                        codeBlock.insertBefore(hll_node, current_line);
                        for (let next = hll_node.nextSibling; next != subNodes[i]; next = hll_node.nextSibling)
                            hll_node.appendChild(next);
                        hll_node.appendChild(subNodes[i]);
                    }
                    current_line = subNodes[i + 1];
                    current_lineno++;
                }
            }
        }
    };

    $(".highlighter-rouge").each(function () {
        const attr_highlight_lines = $(this).attr("highlight-lines");
        if (attr_highlight_lines && attr_highlight_lines.length > 0) {
            let lines = [];
            let scopes = ("," + attr_highlight_lines).match(/(?<=\s|,)\d+(-\d+)?/g)
            scopes.forEach(function (val) {
                let pos = val.split('-');
                let start = parseInt(pos[0]);
                if (pos.length > 1) {
                    let end = parseInt(pos[1]);
                    if (end >= start) {
                        for (let i = start; i <= end; i++) {
                            lines.push(i);
                        }
                    }
                } else if (pos.length == 1) {
                    lines.push(start);
                }
            })
            let pre = $("pre", $(this));
            pre = pre[pre.length - 1];
            highlightLines(pre, lines);
        }
    })
})
```

CSS 配置：

```css
.highlighter-rouge .hll { background-color: #ffff83; }
```

## 例子

````markdown
```rust
fn r<A, R>(g: impl Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R {
    fn r_inner<'a, A, R>(g: &'a dyn Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R + 'a {
        move |x| g(&r_inner(g), x)
    }
    move |x| r_inner(&g)(x)
}

fn main() {
    let g = |f: &dyn Fn(usize) -> usize, x| match x {
        0 => 1,
        _ => x * f(x - 1),
    };

    let fact = r(g);
    println!("{}", fact(5)); // 将会输出 120
}
```
{: highlight-lines="3, 9-12" }
````

效果：

```rust
fn r<A, R>(g: impl Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R {
    fn r_inner<'a, A, R>(g: &'a dyn Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R + 'a {
        move |x| g(&r_inner(g), x)
    }
    move |x| r_inner(&g)(x)
}

fn main() {
    let g = |f: &dyn Fn(usize) -> usize, x| match x {
        0 => 1,
        _ => x * f(x - 1),
    };

    let fact = r(g);
    println!("{}", fact(5)); // 将会输出 120
}
```
{: run="rust" }
{: highlight-lines="3, 9-12" }

即使面对整个代码块只有一个元素的纯文本代码块，也能正常工作：

````markdown
```plaintext
由于 Rouge 的特性，不会对纯文本代码段进行分割，
因此虽然该代码段有很多行，但是 Rouge 会使用一整个 #text 来包装他们。
这也是为什么我们需要先将元素以 `\n` 分割为多个元素，
否则像这样的纯文本，很难对其进行行高亮。
```
{: highlight-lines="2" }
````

效果：

```plaintext
由于 Rouge 的特性，不会对纯文本代码段进行分割，
因此虽然该代码段有很多行，但是 Rouge 会使用一整个 #text 来包装他们。
这也是为什么我们需要先将元素以 `\n` 分割为多个元素，
否则像这样的纯文本，很难对其进行行高亮。
```
{: highlight-lines="2" }

即使有多个连续的空行，也能正常处理：

````markdown
```python
# -*- coding: UTF-8 -*-



def just_print( a ):
    print(a)




if __name__ == "__main__":
    just_print("Hello World")
```
{: highlight-lines="5, 12" }
````

效果：

```python
# -*- coding: UTF-8 -*-



def just_print( a ):
    print(a)




if __name__ == "__main__":
    just_print("Hello World")
```
{: highlight-lines="5, 12" }