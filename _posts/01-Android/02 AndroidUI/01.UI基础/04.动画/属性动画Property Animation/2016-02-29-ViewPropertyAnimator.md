---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:29:34 pm
title: ViewPropertyAnimator
author: hacket
categories:
  - AndroidUI
category: 动画
tags: [动画, 属性动画]
toc: true
description: 
dg-publish: true
dg-enable-search: true
dg-show-local-graph: true
dg-show-toc: true
dg-show-file-tree: true
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:31 晚上
image-auto-upload: true
feed: show
format: list
aliases: [ViewPropertyAnimator 使用]
linter-yaml-title-alias: ViewPropertyAnimator 使用
---

# ViewPropertyAnimator 使用

- 原始 ViewPropertyAnimator

需要手动 cancel 动画

```kotlin
mContentContainer.animate()
    .setDuration(5000L)
    .translationX(mContentContainer.width.toFloat())
    .setListener(object : AnimatorListenerAdapter() {
        override fun onAnimationStart(animation: Animator) {
            super.onAnimationStart(animation)
            Logger.i(TAG, "onAnimationStart:$animation")
        }
    
        override fun onAnimationEnd(animation: Animator) {
            super.onAnimationEnd(animation)
            Logger.d(
                TAG,
                "collapse onAnimationEnd, mContentContainer gone, mHandleContainer visible mContentContainer.isAttachedToWindow=${mContentContainer.isAttachedToWindow}, mContentContainer.width=${mContentContainer.width}."
            )
            mContentContainer.gone()
            mHandleContainer.visible()
        }
    })
    .start()
```

- Compat 库

ViewPropertyAnimatorCompat 是用一个 WeakHashMap 将 View 存起来的，可以不用 cancel 动画

```kotlin
ViewCompat.animate(mContentContainer)
    .setDuration(5_000L)
    .translationX(mContentContainer.width.toFloat())
    .setListener(object : ViewPropertyAnimatorListener {
        override fun onAnimationStart(view: View) {
        }

        override fun onAnimationEnd(view: View) {
            Logger.d(
                TAG,
                "collapse onAnimationEnd, mContentContainer gone, mHandleContainer visible mContentContainer.isAttachedToWindow=${mContentContainer.isAttachedToWindow}, mContentContainer.width=${mContentContainer.width}."
            )
            mContentContainer.gone()
            mHandleContainer.visible()
        }

        override fun onAnimationCancel(view: View) {
            Logger.w(
                TAG,
                "collapse onAnimationCancel"
            )
        }
    })
    .start()
```
