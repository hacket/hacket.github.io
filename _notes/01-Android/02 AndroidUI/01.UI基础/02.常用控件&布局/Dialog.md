---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# Dialog基础

## Dialog监听Back返回键点击事件

```kotlin
mProgressDialog.setOnKeyListener((dialog, keyCode, event) -> {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_UP
                && event.getRepeatCount() == 0) {
            return listener.onBackPressed();
        }
        return false;
    });
```

1. 判断keyCode == KeyEvent.KEYCODE_BACK
2. 判断event为KeyEvent.ACTION_UP，因为还有ACTION_DOWN，否则执行多次
3. 判断vent.getRepeatCount()==0；返回键在系统分发时，发送Message去调用KeyEvent.changeTimeRepeat。长按时会发多次KeyEvent.ACTION_DOWN。第一次event.getRepeatCount()为返回0，之后递增。避免长按多次调用onKeyDown添加repeatCount == 0判断

# App首页弹窗多个Dialog优先级问题

## mashi DialogController

- 思路：<br />DialogController提供一个PriorityBlockingQueue优先级队列来存储

## DialogChain

- 思路：<br />采用责任链，每个弹窗都是一条链的一个点，链前面的弹窗优先展示，当前弹出展示完毕后，展示链上的下一个弹窗
- 缺点：<br />初始化时，需要把所有的弹窗都用一条链起来，不能动态的添加弹窗
-  [x] 用更优雅的技术方案实现应用多弹窗效果<br /><https://mp.weixin.qq.com/s/5DmOCHoslId1IUAWoqwUbw>

## DialogQueue

<https://github.com/aitsuki/DialogQueue>
