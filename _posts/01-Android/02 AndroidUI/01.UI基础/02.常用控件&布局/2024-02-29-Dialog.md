---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:05 晚上
title: Dialog
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Dialog 基础]
linter-yaml-title-alias: Dialog 基础
---

# Dialog 基础

## Dialog 监听 Back 返回键点击事件

```kotlin
mProgressDialog.setOnKeyListener((dialog, keyCode, event) -> {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_UP
                && event.getRepeatCount() == 0) {
            return listener.onBackPressed();
        }
        return false;
    });
```

1. 判断 keyCode == KeyEvent.KEYCODE_BACK
2. 判断 event 为 KeyEvent.ACTION_UP，因为还有 ACTION_DOWN，否则执行多次
3. 判断 vent.getRepeatCount()==0；返回键在系统分发时，发送 Message 去调用 KeyEvent.changeTimeRepeat。长按时会发多次 KeyEvent.ACTION_DOWN。第一次 event.getRepeatCount() 为返回 0，之后递增。避免长按多次调用 onKeyDown 添加 repeatCount == 0 判断

# App 首页弹窗多个 Dialog 优先级问题

## mashi DialogController

- 思路：<br />DialogController 提供一个 PriorityBlockingQueue 优先级队列来存储

## DialogChain

- 思路：<br />采用责任链，每个弹窗都是一条链的一个点，链前面的弹窗优先展示，当前弹出展示完毕后，展示链上的下一个弹窗
- 缺点：<br />初始化时，需要把所有的弹窗都用一条链起来，不能动态的添加弹窗
- [x] 用更优雅的技术方案实现应用多弹窗效果<br /><https://mp.weixin.qq.com/s/5DmOCHoslId1IUAWoqwUbw>

## DialogQueue

<https://github.com/aitsuki/DialogQueue>
