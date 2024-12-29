---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# ViewPropertyAnimator使用

- 原始ViewPropertyAnimator

需要手动cancel动画

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

- Compat库

ViewPropertyAnimatorCompat是用一个WeakHashMap将View存起来的，可以不用cancel动画

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
