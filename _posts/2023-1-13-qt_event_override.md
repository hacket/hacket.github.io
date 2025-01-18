---
title: "记录在 Qt 重写事件时犯的蠢"
date: 2023-1-13 18:11:05 +0800
categories: [杂记, Qt]
tags: [qt, c++, 编程语言]     # TAG names should always be lowercase
media_subpath: /assets/img/qt/
---

前段时间，我想要通过提供选项框的形式来允许用户自定义界面 UI 的字体和大小，就像这样：

![Font Select](font_select.png)

然后生成形如 `* { ... }` 的 QSS 字符串，通过 `qApp->setStyleSheet(qss)`{:.language-cpp} 应用给所有窗口组件。

然而奇怪的事情出现了，我在主界面有两个 `QTextBrowser` 组件，一个是通过 `new QTextBrowser`{:.language-cpp} 出来然后 `addWidget` 到布局上的，另一个是自己创建的一个控件，继承了 `QTextBrowser`。前者能够正常正确地反应字体的修改，但是**后者无论如何都不做出任何反应**。

最开始，我怀疑是否是我 QSS 写的不对，所以我尝试了各种奇奇怪怪的姿势，包括通过 `setObjectName` 给我自己的控件设置对象名，然后使用 `#name { ... }` 的语法进行针对性设置，或者直接调用控件自己的 `setStyleSheet`，最后均以失败告终。

之后，我想起我为了控制我控件内文本的颜色，在 `insertHtml` 的时候使用了 `<font color=red>`{:.language-html} 这样的 HTML 标签，因此我马上尝试将所有 `<font>`{:.language-html} 标签改成了形如 `<span style="color=red">`{:.language-html} 的形式，但还是不行。

再然后，我查 API 看到 `QTextBrowser` 有一个叫 `setCurrentFont` 的成员函数（实际是继承自 `QTextEdit` 的），但是尝试使用该函数设置字体仍然无果。

中间经历了太多的苦难，我已经不想再多谈。那么实际的原因是什么呢？这要怪罪于我自身的学习经历。

我在 2018 年开始学习和使用 Qt，但是我并不是通过看书这种形式来学习的，因为我当时暑假需要设计一个 C++ 的课设，大部分同学选择用 MFC，而我选择装装逼用 Qt，基本上就是零基础起步一个月做好一个课设，这种前提下，自然就变成了以开发为核心、用到什么才去查什么的模式。久而久之，Qt 写习惯了，也没觉得这种模式有啥不好，也觉得都这种熟练度了再回头去看书，多少是一种浪费时间的行为。

当我第一次接触到重写事件时，我需要在打开某个窗口时初始化一个库，关闭它时释放这个库，我参考了别人的代码，写出了这样的实现：

```cpp
void MyWindow::showEvent(QShowEvent *ev) {
    xxx_init();
    ev->accept();
}

void MyWindow::closeEvent(QCloseEvent *ev) {
    xxx_deinit();
    ev->accept();
}
```

这种写法运行时表现得很正常，事实上我在以后的 Qt 生涯中一直以这种方式重写事件，并没有遇到过任何 bug，我也没有怀疑过这种写法的正确性，也没有去搜索过任何关于重写事件的文档。

直到前段日子，遇到这个问题之前，我在给这个项目实现**多语言支持**。众所周知，如果你自定义控件的右键菜单，那么像 `QAction` 这种控件，它是不会跟随 `App->installTranslator(_translator)`{:.language-cpp} 更新自己的翻译的，所以我们需要在 `LanguageChange` 发生时，手动为 `QAction` 控件重新 `setText` 一次。于是，我写下了下面这份灾难性的代码：

```cpp
void MyWindow::changeEvent(QEvent *event)
{
    switch (event->type())
    {
        case QEvent::LanguageChange:
            myMenuAction->setText(tr("xxx"));
            event->accept();
        break;
        default:
        break;
    }
}
```

现在回过头来看这份代码，就觉得这根本不像是一个写 C++ 已有 6 年之久的人会犯的错误，如此愚不可及。这份代码错的是如此离谱，子类重写 `changeEvent` 会覆盖父类的 `changeEvent`，这就意味着，在我重写的 `changeEvent` 中，只有 `LanguageChange` 会被处理，而其他所有的事件，都随着 `default: break;`{:.language-cpp} 被华丽地无视了。而恰巧，**`setStyleSheet` 是依赖 `changeEvent` 的默认实现起作用的**，自然而然就被无视了。事实上，这个问题在 Qt 官方文档的 [The Event System](https://doc.qt.io/qt-6/eventsandfilters.html) 章节中有明确的说明：

> If you want to replace the base class's function, you must implement everything yourself. However, if you only want to extend the base class's functionality, then you implement what you want and call the base class to obtain the default behavior for any cases you do not want to handle.

因此，正确的写法是：

```cpp
void MyWindow::changeEvent(QEvent *event)
{
    switch (event->type())
    {
        case QEvent::LanguageChange:
            myMenuAction->setText(tr("xxx"));
        break;
        default:
        break;
    }
    QTextBrowser::changeEvent(event);
}
```
{: highlight-lines="11" }
