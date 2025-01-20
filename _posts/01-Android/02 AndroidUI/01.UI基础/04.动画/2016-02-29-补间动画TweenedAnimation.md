---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:29:54 pm
title: 补间动画TweenedAnimation
author: hacket
categories:
  - AndroidUI
category: 动画
tags: [动画]
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
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
aliases: [Animation 动画概述和执行原理]
linter-yaml-title-alias: Animation 动画概述和执行原理
---

# Animation 动画概述和执行原理

## Animation 动画简介

官方文档：<https://developer.android.google.cn/reference/android/view/animation/package-summary>

Android 提供了多种动画类型，提供的动画类型包括：**补间动画**，**帧动画**，**属性动画**，补间动画和帧动画被称为 `视图动画`。

### 视图动画

视图动画只能作用于 View，且动画类型是固定的。

#### 补间动画

tweened animation（补间动画）,Tweened animation 可以实现 view 一系列简单的转换（位置，尺寸，旋转，透明度）。确定了 view 的开始的视图样式和结束的视图样式，动画过程中系统会补全变化中的状态，最终就实现了动画效果。

补间动画的种类：

1. translate (平移动画)
2. scale (缩放动画)
3. rotate （旋转动画）
4. alpha （透明度动画）

补间动画可以利用 xml 文件和动画类进行实现，对应的具体动画类：

1. translate(平移动画) 对应 TranslateAnimation
2. scale (缩放动画) 对应 ScaleAnimation
3. rotate （旋转动画） 对应 RotateAnimation 类
4. alpha （ 透明度动画） 对应 AlphaAnimation 类

补间动画一般利用 xml 文件实现，如果利用 xml 文件实现动画，需要在 `res/anim` 文件夹下创建动画文件。

#### 帧动画

frame-by-frame（帧动画） 通过加载一系列 drawable 资源，实现动画。

## Animation 基类

### Animation 公共属性

Animation 作为补间动画的基类，具有许多动画公共的属性和方法，下面会列举 Animation 中公共属性在 xml 文件中的表示和代码类中的设置方式及效果，每一项包括 Animation 中公共属性在 xml 文件中的表示和代码类中的设置方式及效果：

```java
android:detachWallpaper 对应setDetachWallpaper(boolean)：是否在壁纸上运行，取值true，flase；
android:duration 对应setDuration(long)：动画持续时间，参数单位为毫秒；
android:fillAfter 对应setFillAfter(boolean):动画结束时view是否保持动画最后的状态，默认值为false；
android:fillBefore 对应setFillBefore(boolean):动画结束时view是否还原到开始动画前的状态，和fillAfter行为是冲突的，所以只有当fillBefore为true或者fillEnabled不为true才生效。默认是true
android:fillEnabled 对应setFillEnabled(boolean)：如果 fillEnabled 取值为true，animation将使用fillBefore的值，否则fillBefore将被忽略。都是在动画结束时还原到原来的状态。
android:interpolator 对应setInterpolator(Interpolator)：设定插值器；
android:repeatCount对应setRepeatCount(int)：动画重复次数，可以是具体次数，也可以是INFINITE（-1）一直循环。
android:repeatMode 对应setRepeatMode(int)：重复类型有两个值，reverse表示倒序回放，restart表示从头播放，需要和repeateCount配合使用。
android:startOffset对应setStartOffset(long)：调用start函数之后等待开始运行的时间，单位为毫秒；
android:zAdjustment 对应setZAdjustment(int)表示被设置动画的内容运行时在Z轴上的位置（top/bottom/normal），默认为normal，一般不需要设置。
```

- Animation 构造函数：一般情况用不到

```
Animation()：duration默认0ms，default interpolator,fillBefore默认true，fillAfter默认false
Animation(Context context, AttributeSet attrs)：利用attributeset和context初始化
```

### 补间动画 Animation 执行原理

Animation 动画的扩展性很高，系统只是简单的为我们封装了几个基本的动画：平移、旋转、透明度、缩放等等，它们都是继承自 Animation 类，然后实现了 `applyTransformation()` 方法，在这个方法里通过 Transformation 和 Matrix 实现各种各样炫酷的动画。

入口 `View#startAnimation(Animation animation)`

```java
// View Android29
public void startAnimation(Animation animation) {
    animation.setStartTime(Animation.START_ON_FIRST_FRAME); // 传入的值是-1，代表准备动画了
    setAnimation(animation);
    invalidateParentCaches(); // 给 parent 的 mPrivateFlag 加了一个 PFLAG_INVALIDATED
    invalidate(true); // 其目的就是将其和子 view 的 drawing 缓存都标记为无效,然后可以 redrawn
}
public void setAnimation(Animation animation) {
    mCurrentAnimation = animation;
    if (animation != null) {
        if (mAttachInfo != null && mAttachInfo.mDisplayState == Display.STATE_OFF
                && animation.getStartTime() == Animation.START_ON_FIRST_FRAME) {
            animation.setStartTime(AnimationUtils.currentAnimationTimeMillis());
        }
        animation.reset();
    }
}
protected void invalidateParentCaches() {
    if (mParent instanceof View) {
        ((View) mParent).mPrivateFlags |= PFLAG_INVALIDATED;
    }
}
```

- setStartTime 只是对一些变量进行赋值，并没有运行动画的逻辑
- setAnimation View 里面有一个 Animation 类型的成员变量，所以这个方法其实是将我们 new 的 Animation 动画跟 View 绑定起来而已，也没有运行动画的逻辑
- invalidateParentCaches() 这方法更简单，给 `mPrivateFlags` 添加了一个标志位

重点看 `View#invalidate(true)`

```java
// View Android29
public void invalidate(boolean invalidateCache) {
    invalidateInternal(0, 0, mRight - mLeft, mBottom - mTop, invalidateCache, true);
}
void invalidateInternal(int l, int t, int r, int b, boolean invalidateCache,
        boolean fullInvalidate) {
    // ...
    // 是否跳过invalidate()
    if (skipInvalidate()) {
        return;
    }

    if ((mPrivateFlags & (PFLAG_DRAWN | PFLAG_HAS_BOUNDS)) == (PFLAG_DRAWN | PFLAG_HAS_BOUNDS)
            || (invalidateCache && (mPrivateFlags & PFLAG_DRAWING_CACHE_VALID) == PFLAG_DRAWING_CACHE_VALID)
            || (mPrivateFlags & PFLAG_INVALIDATED) != PFLAG_INVALIDATED
            || (fullInvalidate && isOpaque() != mLastIsOpaque)) {
        if (fullInvalidate) {
            mLastIsOpaque = isOpaque();
            mPrivateFlags &= ~PFLAG_DRAWN;
        }

        mPrivateFlags |= PFLAG_DIRTY;

        if (invalidateCache) {
            mPrivateFlags |= PFLAG_INVALIDATED;
            mPrivateFlags &= ~PFLAG_DRAWING_CACHE_VALID;
        }

        // Propagate the damage rectangle to the parent view.
        final AttachInfo ai = mAttachInfo;
        final ViewParent p = mParent;
        if (p != null && ai != null && l < r && t < b) {
            final Rect damage = ai.mTmpInvalRect;
            damage.set(l, t, r, b);
            p.invalidateChild(this, damage); // 如果p不为null，调用invalidateChilde
        }

        // Damage the entire projection receiver, if necessary.
        if (mBackground != null && mBackground.isProjected()) {
            final View receiver = getProjectionReceiver();
            if (receiver != null) {
                receiver.damageInParent();
            }
        }
 
    }
}
// view不可见 && 当前没有animation && view不是viewgroup || 
private boolean skipInvalidate() {
    return (mViewFlags & VISIBILITY_MASK) != VISIBLE && mCurrentAnimation == null &&
        (!(mParent instanceof ViewGroup) ||
            !((ViewGroup) mParent).isViewTransitioning(this));
}
```

所以 invalidate() 内部其实是调用了 `ViewGroup#invalidateChild()`，再跟进看看：

```java
public final void invalidateChild(View child, final Rect dirty) {   
    // ...
    do {
        View view = null;
        if (parent instanceof View) {
            view = (View) parent;
        }

        if (drawAnimation) {
            if (view != null) {
                view.mPrivateFlags |= PFLAG_DRAW_ANIMATION;
            } else if (parent instanceof ViewRootImpl) {
                ((ViewRootImpl) parent).mIsAnimating = true;
            }
        }

        // If the parent is dirty opaque or not dirty, mark it dirty with the opaque
        // flag coming from the child that initiated the invalidate
        if (view != null) {
            if ((view.mPrivateFlags & PFLAG_DIRTY_MASK) != PFLAG_DIRTY) {
                view.mPrivateFlags = (view.mPrivateFlags & ~PFLAG_DIRTY_MASK) | PFLAG_DIRTY;
            }
        }

        parent = parent.invalidateChildInParent(location, dirty);
        if (view != null) {
            // Account for transform on current parent
            Matrix m = view.getMatrix();
            if (!m.isIdentity()) {
                RectF boundingRect = attachInfo.mTmpTransformRect;
                boundingRect.set(dirty);
                m.mapRect(boundingRect);
                dirty.set((int) Math.floor(boundingRect.left),
                        (int) Math.floor(boundingRect.top),
                        (int) Math.ceil(boundingRect.right),
                        (int) Math.ceil(boundingRect.bottom));
            }
        }
    } while (parent != null);
}
```

这里有一个 do{}while() 的循环操作，第一次循环的时候 parent 是 this，即 ViewGroup 本身，所以接下去就是不停的调用 ViewGroup 本身的 invalidateChildInParent() 方法，直到 patent == null。

```java
// ViewGroup Android29
public ViewParent invalidateChildInParent(final int[] location, final Rect dirty) {
    if ((mPrivateFlags & (PFLAG_DRAWN | PFLAG_DRAWING_CACHE_VALID)) != 0) {
        // either DRAWN, or DRAWING_CACHE_VALID
       // ...return mParent;
    }

    return null;
}
```

`PFLAG_DRAWN` 和 `PFLAG_DRAWING_CACHE_VALID` 在动画的时候有这 2 个标记，所以一直不为 null。

一个具体的 View 的 mParent 是 ViewGroup，ViewGroup 的 mParent 也是 ViewGoup，所以在 do{}while() 循环里会一直不断的寻找 mParent，而一颗 View 树最顶端的 mParent 是 ViewRootImpl，所以最终是会走到了 `ViewRootImpl#invalidateChildInParent()` 里去了。

```java
// ViewRootImpl Android29
public ViewParent invalidateChildInParent(int[] location, Rect dirty) {
    checkThread();
    // ...
    if (dirty == null) {
        invalidate();
        return null;
    } else if (dirty.isEmpty() && !mIsAnimating) {
        return null;
    }
    // ...
    invalidateRectOnScreen(dirty);
    return null;
}
private void invalidateRectOnScreen(Rect dirty) {
    // ...
    if (!mWillDrawSoon && (intersected || mIsAnimating)) {
        scheduleTraversals();
    }
}
void scheduleTraversals() {
    if (!mTraversalScheduled) {
        mTraversalScheduled = true;
        mTraversalBarrier = mHandler.getLooper().getQueue().postSyncBarrier();
        mChoreographer.postCallback(
                Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
        // ...
    }
}
```

可以看到 ViewRootImpl 的 invalidateChildInParent 的返回值都是 null，所以前面的 `ViewGroup#invalidateChildInParent` 循环到 ViewRootImpl 为止。

scheduleTraversals() 作用是将 performTraversals() 封装到一个 `mTraversalRunnable` 里面，然后扔到 Choreographer 的待执行队列里，这些待执行的 Runnable 将会在最近的一个 16.6ms 屏幕刷新信号到来的时候被执行。而 performTraversals() 是 View 的三大操作：测量、布局、绘制的发起者。

**所以：** 当调用了 View.startAniamtion() 之后，动画并没有马上就被执行，这个方法只是做了一些变量初始化操作，接着将 View 和 Animation 绑定起来，然后调用重绘请求操作，内部层层寻找 mParent，最终走到 ViewRootImpl 的 scheduleTraversals 里发起一个遍历 View 树的请求，这个请求会在最近的一个屏幕刷新信号到来的时候被执行，调用 performTraversals 从根布局 DecorView 开始遍历 View 树。

动画的实际执行代码在 `draw(Canvas, ViewGroup, long)` 里：

```java
boolean draw(Canvas canvas, ViewGroup parent, long drawingTime) {
    final boolean hardwareAcceleratedCanvas = canvas.isHardwareAccelerated();
    boolean drawingWithRenderNode = mAttachInfo != null
            && mAttachInfo.mHardwareAccelerated
            && hardwareAcceleratedCanvas; // 硬件加速
            
    Transformation transformToApply = null;
    boolean concatMatrix = false;
    final boolean scalingRequired = mAttachInfo != null && mAttachInfo.mScalingRequired;
    final Animation a = getAnimation();
    if (a != null) {
        more = applyLegacyAnimation(parent, drawingTime, a, scalingRequired);
        concatMatrix = a.willChangeTransformationMatrix();
        if (concatMatrix) {
            mPrivateFlags3 |= PFLAG3_VIEW_IS_ANIMATING_TRANSFORM;
        }
        transformToApply = parent.getChildTransformation(); // 在上面的applyLegacyAnimation会调用parent.getChildTransformation()创建一个Transition，并获取Matrx，由不同的动画做各种Canvas#Matrix转换
    } else {
        // ...
    }
    int restoreTo = -1;
    if (!drawingWithRenderNode || transformToApply != null) {
        restoreTo = canvas.save();
    }
    // ...
    if (transformToApply != null) {
        if (concatMatrix) {
            if (drawingWithRenderNode) { // 硬件加速
                renderNode.setAnimationMatrix(transformToApply.getMatrix());
            } else {
                // Undo the scroll translation, apply the transformation matrix,
                // then redo the scroll translate to get the correct result.
                canvas.translate(-transX, -transY);
                canvas.concat(transformToApply.getMatrix()); // Canvas concat Matrix
                canvas.translate(transX, transY);
            }
            parent.mGroupFlags |= ViewGroup.FLAG_CLEAR_TRANSFORMATION;
        }
        // ... 
    }
    // ...
    if (restoreTo >= 0) {
        canvas.restoreToCount(restoreTo);
    }
    // ...
}
```

现在看 applyLegacyAnimation

```java
// View Android
private boolean applyLegacyAnimation(ViewGroup parent, long drawingTime,
    Animation a, boolean scalingRequired) {
    Transformation invalidationTransform;
    final int flags = parent.mGroupFlags;
    final boolean initialized = a.isInitialized();
    if (!initialized) {
        a.initialize(mRight - mLeft, mBottom - mTop, parent.getWidth(), parent.getHeight());
        a.initializeInvalidateRegion(0, 0, mRight - mLeft, mBottom - mTop);
        if (mAttachInfo != null) a.setListenerHandler(mAttachInfo.mHandler);
        onAnimationStart(); // 动画开始
    }

    final Transformation t = parent.getChildTransformation(); // 获取或创建一个Transformation
    boolean more = a.getTransformation(drawingTime, t, 1f); // 将t:Transformation 传递到getTransformation
    if (scalingRequired && mAttachInfo.mApplicationScale != 1f) {
        if (parent.mInvalidationTransformation == null) {
            parent.mInvalidationTransformation = new Transformation();
        }
        invalidationTransform = parent.mInvalidationTransformation;
        a.getTransformation(drawingTime, invalidationTransform, 1f);
    }
    // ...
    if (more) { // more: true表示动画未结束
        if (!a.willChangeBounds()) { // 动画是否会改变大小，除了alpha动画返回false，其他默认返回true
            if ((flags & (ViewGroup.FLAG_OPTIMIZE_INVALIDATE | ViewGroup.FLAG_ANIMATION_DONE)) ==
                    ViewGroup.FLAG_OPTIMIZE_INVALIDATE) {
                parent.mGroupFlags |= ViewGroup.FLAG_INVALIDATE_REQUIRED;
            } else if ((flags & ViewGroup.FLAG_INVALIDATE_REQUIRED) == 0) {
                // The child need to draw an animation, potentially offscreen, so
                // make sure we do not cancel invalidate requests
                parent.mPrivateFlags |= PFLAG_DRAW_ANIMATION;
                parent.invalidate(mLeft, mTop, mRight, mBottom);
            }
        } else {
            /...
            parent.mPrivateFlags |= PFLAG_DRAW_ANIMATION;
            final int left = mLeft + (int) region.left;
            final int top = mTop + (int) region.top;
            parent.invalidate(left, top, left + (int) (region.width() + .5f),
                    top + (int) (region.height() + .5f)); // 重新invalidate
        }
    }
}
```

调用了 `Animation#getTransformation()`

```java
// Animation Android29
public boolean getTransformation(long currentTime, Transformation outTransformation,
        float scale) { // outTransformation就是从parent的getChildTransformation获取的
    mScaleFactor = scale;
    return getTransformation(currentTime, outTransformation);
}
public boolean getTransformation(long currentTime, Transformation outTransformation) {
    if (mStartTime == -1) {
        mStartTime = currentTime; // 记录第一帧
    }
    final long startOffset = getStartOffset(); // 默认为0
    final long duration = mDuration;
    f (duration != 0) {
        normalizedTime = ((float) (currentTime - (mStartTime + startOffset))) /
                (float) duration; // 计算动画的进度= 当前时间-动画第一帧时间/动画持续时间
    }
    
    // 保证动画进度在0.0~1.0之间
    if (!mFillEnabled) normalizedTime = Math.max(Math.min(normalizedTime, 1.0f), 0.0f);
    
    // ...
    if ((normalizedTime >= 0.0f || mFillBefore) && (normalizedTime <= 1.0f || mFillAfter)) {
        // ...
        if (mFillEnabled) normalizedTime = Math.max(Math.min(normalizedTime, 1.0f), 0.0f);

        if (mCycleFlip) {
            normalizedTime = 1.0f - normalizedTime;
        }

        final float interpolatedTime = mInterpolator.getInterpolation(normalizedTime); // 插值器计算动画进度
        applyTransformation(interpolatedTime, outTransformation); // 应用动画；Animation空实现
    }
    // ...
}
```

getTransformation 这个方法里做了几件事：

1. 记录动画第一帧的时间
2. 根据当前时间到动画第一帧的时间这之间的时长和动画应持续的时长来计算动画的进度
3. 把动画进度控制在 0-1 之间，超过 1 的表示动画已经结束，重新赋值为 1 即可
4. 根据插值器来计算动画的实际进度
5. 调用 applyTransformation() 应用动画效果

getTransformation 返回值：当动画如果还没执行完，就会再调用 invalidate() 方法，层层通知到 ViewRootImpl 再次发起一次遍历请求，当下一帧屏幕刷新信号来的时候，再通过 performTraversals() 遍历 View 树绘制时，该 View 的 draw 收到通知被调用时，会再次去调用 applyLegacyAnimation() 方法去执行动画相关操作，包括调用 getTransformation() 计算动画进度，调用 applyTransformation() 应用动画。

也就是说，动画很流畅的情况下，其实是每隔 16.6ms 即每一帧到来的时候，执行一次 applyTransformation()，直到动画完成。所以这个 applyTransformation() 被回调多次是这么来的，而且这个回调次数并没有办法人为进行设定。这就是为什么当动画持续时长越长时，这个方法打出的日志越多次的原因。

---

一个 View 动画执行过程：

```java
View.startAnimation
-->View.invalidateParentCaches/invalidate
-->ViewRootImple#scheduleTraversals
-->View.draw
-->View.applyLegacyAnimation
-->Animation.getTransformation
-->Animation.applyTransformation
```

### 原理总结

1. 首先，当调用了 View.startAnimation() 时动画并没有马上就执行，而是通过 invalidate() 层层通知到 ViewRootImpl 发起一次遍历 View 树的请求，而这次请求会等到接收到最近一帧到了的信号时才去发起遍历 View 树绘制操作。
2. 从 DecorView 开始遍历，绘制流程在遍历时会调用到 View 的 draw() 方法，当该方法被调用时，如果 View 有绑定动画，那么会去调用 applyLegacyAnimation()，这个方法是专门用来处理动画相关逻辑的。
3. 在 applyLegacyAnimation() 这个方法里，如果动画还没有执行过初始化，先调用动画的初始化方法 initialized()，同时调用 onAnimationStart() 通知动画开始了，然后调用 getTransformation() 来根据当前时间计算动画进度，紧接着调用 applyTransformation() 并传入动画进度来应用动画。
4. getTransformation() 这个方法有返回值，如果动画还没结束会返回 true，动画已经结束或者被取消了返回 false。所以 applyLegacyAnimation() 会根据 getTransformation() 的返回值来决定是否通知 ViewRootImpl 再发起一次遍历请求，返回值是 true 表示动画没结束，那么就去通知 ViewRootImpl 再次发起一次遍历请求。然后当下一帧到来时，再从 DecorView 开始遍历 View 树绘制，重复上面的步骤，这样直到动画结束。
5. 动画是在每一帧的绘制流程里被执行，所以动画并不是单独执行的，也就是说，如果这一帧里有一些 View 需要重绘，那么这些工作同样是在这一帧里的这次遍历 View 树的过程中完成的。每一帧只会发起一次 perfromTraversals() 操作。

> 补间动画的绘制实际上是父布局不停地改变自己的 Canvas 坐标，而子 view 虽然位置没有变化，但是画布所在 Canvas 的坐标发生了变化视觉效果也就发生了变化，其实并没有修改任何属性，所以只能在原位置才能处理触摸事件。

> Animation 动画内部其实是通过 ViewRootImpl 来监听下一个屏幕刷新信号，并且当接收到信号时，从 DecorView 开始遍历 View 树的绘制过程中顺带将 View 绑定的动画执行。

### 问题

1. 当调用了 View.startAnimation() 之后，动画是马上就执行了么？

> 不是，最近一帧 view.draw 再执行

1. 动画真正实现的地方在哪里？

> Animation#applyTransformation()

2. view 动画怎么绘制的呢？

> canvas 变化来实现

## 视图动画总结

### 补间动画 xml 属性总结

#### translate

```xml
android:duration：动画持续时长
android:fillAfter：动画结束之后是否保持动画的最终状态；true，表示保持动画的最终状态
android:fillBefore：动画结束之后是否保持动画开始前的状态；true，表示恢复到动画开始前的状态
android:fromXDelta：动画开始时，在X轴方向上的位置；取值类型有三种：数字；百分比；百分比+”p”; 
数字：例如50.0，这里的单位是px像素
百分比：例如50%，这里是相对于自己控件宽度的百分比，实际的值是mIvImg.getWidth()*50%；
百分比+”p”：例如50%p，这里是表示相对于自己控件的父控件的百分比，
android:fromYDelta：动画开始时，在Y轴方向上的位置；取值类型同上
android:interpolator：动画插值器。是实现动画不规则运动的一种方式，后面讲到
android:repeatCount：动画重复的次数。指定动画重复播放的次数，如果你需要无限循环播放，请填写一个小于0的数值，我一般写-1
android:repeatMode：动画重复的Mode，有reverse和restart两种，效果看后面
android:startOffset：动画播放延迟时长，就是调用start之后延迟多少时间播放动画
android:toXDelta：动画移动在X轴的目标位置；取值类型和fromXDelta一样
android:toYDelta：动画移动在Y轴的目标位置；取值类型同上
```

#### scale

以 scale 为例：

```
android:duration：动画持续时长
android:fillAfter：动画结束之后是否保持动画的最终状态；true，表示保持动画的最终状态
android:fillBefore：动画结束之后是否保持动画开始前的状态；true，表示恢复到动画开始前的状态
android:interpolator：动画插值器。是实现动画不规则运动的一种方式，后面讲到
android:pivotX：缩放中心坐标的X值，取值类型有三种：数字；百分比；百分比+”p”;
数字：例如50.0，这里的单位是px像素
百分比：例如50%，这里是相对于自己控件宽度的百分比，实际的值是mIvImg.getWidth()*50%；
百分比+”p”：例如50%p，这里是表示相对于自己控件的父控件的百分比，
android:pivotY：同上
android:repeatCount：动画重复的次数。指定动画重复播放的次数，如果你需要无限循环播放，请填写一个小于0的数值，一般写-1
android:repeatMode：动画重复的Mode，有reverse和restart两种，效果看后面
android:startOffset：动画播放延迟时长，就是调用start之后延迟多少时间播放动画
android:fromXScale：动画开始时X轴方向控件大小，取值和android：pivot一样；三种取值类型：数字；百分比；百分比+”p”;
android:fromYScale：动画开始时Y轴方向控件大小，取值类型同上
android:toXScale：动画在X轴方向上控件的目标大小，取值类型同上
android:toYScale：动画在Y轴方向上控件的目标大小，取值类型同上
```

#### alpha

```xml
android:duration：动画持续的时长，单位是毫秒
android:fillAfter：动画结束之后是否保持动画的最终状态；true，表示保持动画的最终状态
android:fillBefore：动画结束之后是否保持动画开始前的状态；true，表示恢复到动画开始前的状态
android:fromAlpha：动画开始的透明度，取值0.0~1.0，0.0表示完全透明，1.0表示保持原有状态不变
android:interpolator：动画插值器。是实现动画不规则运动的一种方式，后面讲到
android:repeatCount：动画重复的次数。指定动画重复播放的次数，如果你需要无限循环播放，请填写一个小于0的数值，我一般写-1
android:repeatMode：动画重复的Mode，有reverse和restart两种，效果看后面
android:startOffset：动画播放延迟时长，就是调用start之后延迟多少时间播放动画
android:toAlpha：动画最终的透明度，取值和android:fromAlpha一样
```

#### rotate

```xml
android:duration：动画持续时长
android:fillAfter：动画结束之后是否保持动画的最终状态；true，表示保持动画的最终状态
android:fillBefore：动画结束之后是否保持动画开始前的状态；true，表示恢复到动画开始前的状态
android:fromDegrees：动画开始的角度
android:interpolator：动画插值器。是实现动画不规则运动的一种方式，后面讲到
android:pivotX：缩放中心坐标的X值，取值类型有三种：数字；百分比；百分比+”p”; 
数字：例如50.0，这里的单位是px像素
百分比：例如50%，这里是相对于自己控件宽度的百分比，实际的值是mIvImg.getWidth()*50%；
百分比+”p”：例如50%p，这里是表示相对于自己控件的父控件的百分比，
android:pivotY：同上
android:repeatCount：动画重复的次数。指定动画重复播放的次数；如果你需要无限循环播放，请填写一个小于0的数值，一般写-1
android:repeatMode：动画重复的Mode，有reverse和restart两种，效果看后面
android:startOffset：动画播放延迟时长，就是调用start之后延迟多少时间播放动画
android:toDegrees：动画旋转的目标角度
```

### 视图动画的局限性

1. 只能作用于 view,但有时需求不是对于整个 view 的，而只是对 view 的某个属性的，例如颜色的变化，也无法对非 View 的对象进行动画处理。
2. 没有改变 view 的属性，只改变了 view 的视觉效果而已，只是修改了视图绘制的地方，而没有改变视图的本身。
3. 动画效果固定，动画类型只有四种，缩放，平移，旋转，透明度的基本动画，无法对其他属性进行操作。
4. 动画虽然可以添加监听，但是动画开始后无法对动画的执行过程进行控制。

## Ref

- Animation 动画概述和执行原理<br /><https://blog.csdn.net/u010126792/article/details/85290951>
- [ ] <https://www.cnblogs.com/dasusu/p/8287822.html>

# TranslateAnimation 平移动画

## TranslateAnimation 详解

构造函数：

```java
//从资源文件加载
TranslateAnimation(Context context, AttributeSet attrs) // 1
TranslateAnimation(float fromXDelta, float toXDelta, float fromYDelta, float toYDelta) // 2
TranslateAnimation(int fromXType, float fromXValue, int toXType, float toXValue, int fromYType, float fromYValue, int toYType, float toYValue) // 3
```

> 第 2 个构造函数和第 3 个构造函数的结构不同，第 2 个构造函数没有坐标类型，但是它的数值可以分成三类可以是具体数值、百分数、百分数 +p 三种样式这三类就分别对应了 ABSOLUTE，RELATIVE_TO_SELF，RELATIVE_TO_PARENT。

参数说明：

```
// 第2个构造函数参数：
fromXDelta：移动的起始点X轴坐标，可以是具体数值、百分数、百分数+p 三种样式，比如 10、10%、10%p
fromYDelta：移动的 起始点Y轴从标，可以是数值、百分数、百分数p 三种样式；
toXDelta ： 移动的结束点X轴坐标
toYDelta ： 移动的结束点Y轴坐标
fromXType :  fromXValue的坐标类型

// 第3个构造函数参数：
fromXValue: X轴方向移动的初始坐标
toXType: toXValue的坐标类型
toXValue X轴方向结束的坐标
fromYType: fromYValue的坐标类型
fromYValue: Y轴方向移动的起始点坐标
toYType: toYValue的坐标类型
toYValue： Y轴方向结束的坐标

坐标类型Type的种类：
ABSOLUTE，RELATIVE_TO_SELF，RELATIVE_TO_PARENT第一个代表具体值，第二个相对于view自己，第三个相对于父布局。
```

**注意**：**fromXDelta，代表的是相对于参考点的差值 dx，如相对于自身左上角，那么 fromXDelta，就是相对于自身左上角 +dx，而不是具体的坐标，这个要注意。**

> 所有坐标类似 (fromXdelta，toXDelta,fromYDelta,ToYDelta) 的值都是相对于 View 的左上角，所以动画坐标的原点都是 View 自己的左上角。view 的左上角为动画进行的坐标原点（0,0）

利用 `AnimationUtils.loadAnimation()` 加载 xml 文件，可以解析生成对应动画。

## XML 实现移动动画

### 案例 1：具体值（坐标系以自身为 (0,0)）

一个大小为 400,200 的 view 移动 400,200 的距离，之后保存动画后的状态，为了标识 view 移动了会在 view 的底部绘制一个大小位置一样的粉色 view 作为参照。

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXDelta="0"
    android:toXDelta="400"
    android:fromYDelta="0"
    android:toYDelta="200"
    android:duration="3000"
    android:fillAfter="true">
</translate>
```

具体值：<br />一个大小为 400,200 的 view 移动 400,200 的距离，之后保存动画后的状态，为了标识 view 移动了会在 view 的底部绘制一个大小位置一样的粉色 view 作为参照。

> 两个 400*200 的 TextView 相互覆盖，然后移动顶部的 TextView 移动（400,200）的距离。fillAfter 为 true 表示动画结束时保持动画最终的效果。

![](http://note.youdao.com/yws/public/resource/b1e2a9a07df3125c55e2867d6a061906/5A7B7FD09D5E4E1480560348E416B266?ynotemdtimestamp=1688200843587#height=427&id=NJoM9&originHeight=564&originWidth=355&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=269)

### 案例 2：百分数 (坐标以自身为参考)

百分数是相对于自身大小，所以直接使用 100% 即可；100% 相当于 view 的宽和高的 100%。

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXDelta="0"
    android:toXDelta="100%"
    android:fromYDelta="0"
    android:toYDelta="100%"
    android:duration="3000"
    android:fillAfter="true">
</translate>
```

![](http://note.youdao.com/yws/public/resource/b1e2a9a07df3125c55e2867d6a061906/B423AD2978584D2B83134704B3859D0E?ynotemdtimestamp=1688200843587#height=427&id=VHsTj&originHeight=564&originWidth=355&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=269)

### 案例 3：百分数 +p(坐标以父容器 (0,0) 为参考)

利用百分数 +p 实现从顶部移动 parent 宽高的一半距离。

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXDelta="0"
    android:toXDelta="50%p"
    android:fromYDelta="0"
    android:toYDelta="50%p"
    android:duration="3000"
    android:fillAfter="true">
</translate>
```

结果图，红色框是截图是画上的，为了标识移动了整个父 view 的宽高的一半。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688200972226-6916bdb0-c2f4-4410-b664-994fe6b3855b.png#averageHue=%23d8d4d4&clientId=u72fbe636-9943-4&from=paste&height=354&id=u805b7074&originHeight=707&originWidth=476&originalType=binary&ratio=2&rotation=0&showTitle=false&size=66966&status=done&style=none&taskId=ue99f8a54-4f54-4f83-a19b-9864d6ff327&title=&width=238)

### 案例 4：设置 fromXDelta 和 fromYDelta 为负呢？

由于动画坐标原点都是 view 的左上角，所以如果为负，动画开始时会出现在 view 的左上方。

```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXDelta="-100%"
    android:toXDelta="50%p"
    android:fromYDelta="-100%"
    android:toYDelta="50%p"
    android:duration="3000"
    android:fillAfter="true">
</translate>
```

![](https://img-blog.csdnimg.cn/20181227194619911.gif#height=345&id=KArFe&originHeight=564&originWidth=355&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=217)

## Java 代码实现

```java
TranslateAnimation translateAnimation = new TranslateAnimation(0, 400, 0, 200);
translateAnimation.setDuration(3000);
translateAnimation.setFillAfter(true);
mTVDemo.startAnimation(translateAnimation);
```

## Ref

- Android 动画 - TranslateAnimation 位移动画<br /><https://blog.csdn.net/shibin1990_/article/details/51602564>

> 讲解很详细

# RotateAnimation 旋转动画

## RotateAnimation 旋转动画详解

构造函数：

```java
RotateAnimation(Context context, AttributeSet attrs)
RotateAnimation(float fromDegrees, float toDegrees)
RotateAnimation(float fromDegrees, float toDegrees, float pivotX, float pivotY)
RotateAnimation(float fromDegrees, float toDegrees, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

参数说明：

```
fromDegrees 开始旋转的角度，正值顺时针，负值逆时针
toDegrees 结束时旋转到的角度，正值顺时针，负值逆时针
pivotX 旋转起点X轴坐标，可以是数值、百分数、百分数p 和上面的类似规则一样，左上角为坐标原点。
pivotY 旋转起点Y轴坐标，可以是数值、百分数、百分数p
pivotXType,pivotYType 类似和其他动画类含义类似。
```

## XML 实现

### 案例 1：坐标原点 (0,0)

实现 view 从 0 度顺时针旋转 270 度，坐标原点为 view 左上角（0,0）

```xml
<?xml version="1.0" encoding="utf-8"?>
<rotate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromDegrees="0"
    android:toDegrees="270"
    android:pivotX="0"
    android:pivotY="0"
    android:duration="3000"
    android:fillAfter="true">
</rotate>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201060679-6e583648-2809-4a36-92a8-661489c1d8d2.png#averageHue=%23ededed&clientId=u72fbe636-9943-4&from=paste&height=282&id=u3a246124&originHeight=563&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=16864&status=done&style=none&taskId=ucb60fdd1-d4b4-42ae-b713-98b67332836&title=&width=177.5)<br />![](http://note.youdao.com/yws/res/27477/5748D44013124B97BBA1B58432FEAA51#id=ZD6FC&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 案例 2：利用百分数，修改坐标原点为 view 的中心点

```xml
<?xml version="1.0" encoding="utf-8"?>
<rotate xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromDegrees="0"
    android:toDegrees="270"
    android:pivotX="50%"
    android:pivotY="50%"
    android:duration="3000"
    android:fillAfter="true">
</rotate>
```

绕中心旋转

![](http://note.youdao.com/yws/res/27483/2E5596DE4D294D879812560BF192AE2D#id=hiaKN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201067143-c7d56a58-5089-44d5-9173-0cc881373083.png#averageHue=%23ededed&clientId=u72fbe636-9943-4&from=paste&height=247&id=u2829d01e&originHeight=494&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15445&status=done&style=none&taskId=ued2c5c9f-3e56-4d52-9e6f-fb04272d08b&title=&width=177.5)

## Java 实现

```java
RotateAnimation rotateAnimation = new RotateAnimation(0.0f, 270f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
rotateAnimation.setDuration(3000);
rotateAnimation.setFillAfter(true);
mTVDemo.startAnimation(rotateAnimation);
```

## Ref

- Android 动画 - RoateAnimation 旋转动画<br /><https://blog.csdn.net/shibin1990_/article/details/51603516>

> 讲解很详细

# AlphaAnimation 透明度动画

## AlphaAnimation 透明度动画详解

构造函数：

```
AlphaAnimation(Context context, AttributeSet attrs)：读取xml文件生成
AlphaAnimation(float fromAlpha, float toAlpha)：
```

参数说明：<br />fromAlpha: 开始的透明度，toAlpha：结束时的透明度<br />取值： 1.0f 代表不透明 ， 0.0f 表示全透明

## 案例

### xml 实现

实现 view 从透明度 0.1，变化到 1.0

```xml
<?xml version="1.0" encoding="utf-8"?>
<alpha xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromAlpha="0.1"
    android:toAlpha="1.0"
    android:duration="3000"
    android:fillBefore="true">
</alpha>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201104635-773a4650-7a9b-4151-8348-48c48e627108.png#averageHue=%23f1f1f1&clientId=u72fbe636-9943-4&from=paste&height=458&id=NhJsy&originHeight=1132&originWidth=712&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44803&status=done&style=none&taskId=ud335727f-35f3-46d6-9b9c-820dbf91c64&title=&width=288)![](http://note.youdao.com/yws/res/27427/EB5127C5136B4B45B0C8D08858050739#id=REEmr&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 代码实现

```java
AlphaAnimation alphaAnimation = new AlphaAnimation(0.1f, 1.0f);
alphaAnimation.setDuration(3000);
alphaAnimation.setFillBefore(true);
mTVDemo.startAnimation(alphaAnimation);
```

## Ref

- Android 动画 - AlphaAnimation 渐变动画<br /><https://blog.csdn.net/shibin1990_/article/details/51602498>

> 讲解很详细

# ScaleAnimation 缩放动画

## ScaleAnimation 缩放动画详解

构造函数：

```java
ScaleAnimation(Context context, AttributeSet attrs)：利用xml文件生成对象
ScaleAnimation(float fromX, float toX, float fromY, float toY)

ScaleAnimation(float fromX, float toX, float fromY, float toY, float pivotX, float pivotY)

ScaleAnimation(float fromX, float toX, float fromY, float toY, int pivotXType, float pivotXValue, int pivotYType, float pivotYValue)
```

参数说明：

```
fromXScale X轴方向上动画开始时相对自身的缩放比例，取值float，1.0表示没有缩放，大于1.0表示放大，小于1.0表示缩小

toXScale X轴方向上动画结束时相对自身的缩放比例；

fromYScale Y轴方向上动画开始时相对自身的缩放比例，

toYScale X轴方向上动画结束时相对自身的缩放比例；

pivotX X轴方向上相对于原点（view左上角）的移动坐标，移动后作为新的缩放原点，可以是数值、百分数、百分数p 三种样式。

pivotY Y轴方向上相对于原点的移动坐标，意义和android:pivotX一样。

pivotXType 坐标类型，类似TranslateAnimation的坐标类型，主要用于代码生成animation时，指定坐标类型

pivotYType 坐标类型，类似TranslateAnimation的坐标类型，主要用于代码生成animation时，指定坐标类型
变换的坐标原点依然是view的左上角
```

- 坐标概念<br />![](http://note.youdao.com/yws/res/29548/92C16C110FBF41ECB3CEE8823E2F7180#id=eQcau&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201211125-30c14265-a7a5-40c3-8b73-8294d9bb037f.png#averageHue=%23e1e1e1&clientId=u72fbe636-9943-4&from=paste&height=480&id=ua5097e8e&originHeight=960&originWidth=540&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48048&status=done&style=none&taskId=u4153326a-d4dc-4048-8d9b-3cb48892bb6&title=&width=270)

## xml 实现

### 案例 1：（0,0）缩放

从坐标原点（view 左上角），view 由 0，放大两倍。

```xml
<?xml version="1.0" encoding="utf-8"?>
<scale xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXScale="0.0"
    android:toXScale="2.0"
    android:fromYScale="0.0"
    android:toYScale="2.0"
    android:pivotX="0"
    android:pivotY="0"
    android:duration="3000"
    android:fillAfter="true"/>
```

在以 view 左上角为坐标原点从 0 经历 3 秒放大两倍 view。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201216988-1c0d404e-4b2a-4cab-b993-cbaf08da65a8.png#averageHue=%23f1f1f1&clientId=u72fbe636-9943-4&from=paste&height=282&id=uf8ec6964&originHeight=564&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13364&status=done&style=none&taskId=u1ee90e2d-1eae-4cec-8a32-a26d4b2ca33&title=&width=177.5)<br />![](http://note.youdao.com/yws/res/27446/4BCE0946ACDC4DBCAB81FE50D7F3AD5D#id=nMdHs&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 案例 2：坐标原点为自身中心

修改坐标原点为 view 的中心点

```xml
<?xml version="1.0" encoding="utf-8"?>
<scale xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="3000"
    android:fillAfter="true"
    android:fromXScale="0.0"
    android:fromYScale="0.0"
    android:pivotX="50%"
    android:pivotY="50%"
    android:interpolator="@android:anim/linear_interpolator"
    android:repeatMode="restart"
    android:repeatCount="infinite"
    android:toXScale="2.0"
    android:toYScale="2.0" />
```

利用百分比，移动到 view 的中心进行缩放，无限循环<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201225674-608b161a-40ec-4987-9ca0-550621d93afd.png#averageHue=%23f0f0f0&clientId=u72fbe636-9943-4&from=paste&height=282&id=u8d2b4ba7&originHeight=564&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13925&status=done&style=none&taskId=uc0885944-b055-4e30-a193-6e2b36c6ede&title=&width=177.5)<br />![](http://note.youdao.com/yws/res/27453/D1155B894DB3494996D49AFA5D435A9D#id=yWvQH&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 案例 3：利用百分数 +p，设置缩放原点

```xml
<?xml version="1.0" encoding="utf-8"?>
<scale xmlns:android="http://schemas.android.com/apk/res/android"
    android:fromXScale="0.0"
    android:toXScale="2.0"
    android:fromYScale="0.0"
    android:toYScale="2.0"
    android:pivotX="50%p"
    android:pivotY="50%p"
    android:duration="3000"
    android:fillAfter="true"/>
```

利用百分数 +p 移动缩放点左右都移动父 view 的一半，然后进行缩放。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201236991-a6c5b8bb-bd7f-482c-9986-a9b6cd2a169e.png#averageHue=%23ededed&clientId=u72fbe636-9943-4&from=paste&height=282&id=ubbc0335a&originHeight=563&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=13419&status=done&style=none&taskId=u704fbb0e-5a0d-4753-856a-f733daa9799&title=&width=177.5)

类似投影方式，缩放原点和最终图片的关系：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201243020-83bb928b-3b51-49b0-adaa-83b3ba8767c0.png#averageHue=%23d0c8c8&clientId=u72fbe636-9943-4&from=paste&height=295&id=u539acac6&originHeight=589&originWidth=369&originalType=binary&ratio=2&rotation=0&showTitle=false&size=42802&status=done&style=none&taskId=u362bc948-cfd4-44b7-b45a-143df7857e5&title=&width=184.5)

## Java 代码

```java
public void startScaleAnimation() {
    /**
     * ScaleAnimation第一种构造
     *
     * @param fromX X方向开始时的宽度，1f表示控件原有大小
     * @param toX X方向结束时的宽度，
     * @param fromY Y方向上开的宽度，
     * @param toY Y方向结束的宽度
     * 这里还有一个问题：缩放的中心在哪里？ 使用这种构造方法，默认是左上角的位置，以左上角为中心开始缩放
     */
    ScaleAnimation scaleAnimation = new ScaleAnimation(1f, 2f, 1f, 2f);
    /**
     * ScaleAnimation第二种构造解决了第一种构造的缺陷， 无法指定缩放的位置
     *
     * @param fromX 同上
     * @param toX 同上
     * @param fromY 同上
     * @param toY 同上
     * @param pivotX 缩放的轴心X的位置，取值类型是float，单位是px像素，比如：X方向控件中心位置是mIvScale.getWidth() / 2f
     * @param pivotY 缩放的轴心Y的位置，取值类型是float，单位是px像素，比如：X方向控件中心位置是mIvScale.getHeight() / 2f
     */
    ScaleAnimation scaleAnimation1 = new ScaleAnimation(1f, 2f, 1f, 2f, mIvImg.getWidth() / 2f, mIvImg.getHeight() / 2f);

    /**
     * ScaleAnimation第三种构造在第二种构造的基础上，可以通过多种方式指定轴心的位置，通过Type来约束
     *
     * @param fromX 同上
     * @param toX 同上
     * @param fromY 同上T
     * @param toY 同上
     * @param pivotXType 用来约束pivotXValue的取值。取值有三种：Animation.ABSOLUTE，Animation.RELATIVE_TO_SELF，Animation.RELATIVE_TO_PARENT
     * Type：Animation.ABSOLUTE：绝对，如果设置这种类型，后面pivotXValue取值就必须是像素点；比如：控件X方向上的中心点，pivotXValue的取值mIvScale.getWidth() / 2f
     *            Animation.RELATIVE_TO_SELF：相对于控件自己，设置这种类型，后面pivotXValue取值就会去拿这个取值是乘上控件本身的宽度；比如：控件X方向上的中心点，pivotXValue的取值0.5f
     *            Animation.RELATIVE_TO_PARENT：相对于它父容器（这个父容器是指包括这个这个做动画控件的外一层控件）， 原理同上，
     * @param pivotXValue  配合pivotXType使用，原理在上面
     * @param pivotYType 原理同上
     * @param pivotYValue 原理同上
     */
    ScaleAnimation scaleAnimation2 = new ScaleAnimation(1f, 2f, 1f, 2f, ScaleAnimation.ABSOLUTE, mIvImg.getWidth() / 2f, ScaleAnimation.ABSOLUTE, mIvImg.getHeight() / 2f);
    //设置动画持续时长
    scaleAnimation2.setDuration(3000);
    //设置动画结束之后的状态是否是动画的最终状态，true，表示是保持动画结束时的最终状态
    scaleAnimation2.setFillAfter(true);
    //设置动画结束之后的状态是否是动画开始时的状态，true，表示是保持动画开始时的状态
    scaleAnimation2.setFillBefore(true);
    //设置动画的重复模式：反转REVERSE和重新开始RESTART
    scaleAnimation2.setRepeatMode(ScaleAnimation.REVERSE);
    //设置动画播放次数
    scaleAnimation2.setRepeatCount(ScaleAnimation.INFINITE);
    //开始动画
    mIvImg.startAnimation(scaleAnimation2);
    //清除动画
    mIvImg.clearAnimation();
    //同样cancel（）也能取消掉动画
    scaleAnimation2.cancel();
}
```

### 自身 (0,0)

```java
ScaleAnimation scaleAnimation = new ScaleAnimation(0.0f, 2.0f, 0.0f, 2.0f);
scaleAnimation.setDuration(3000);
scaleAnimation.setFillAfter(true);
mTVDemo.startAnimation(scaleAnimation);
```

### 自身中心，无限循环

```kotlin
val scaleAnimation2 = ScaleAnimation(1f, 2f, 1f, 2f,
        ScaleAnimation.ABSOLUTE, anim_view.getWidth() / 2f, ScaleAnimation.ABSOLUTE, anim_view.getHeight() / 2f);
//设置动画持续时长
scaleAnimation2.setDuration(3000);
//设置动画结束之后的状态是否是动画的最终状态，true，表示是保持动画结束时的最终状态
scaleAnimation2.setFillAfter(true);
//设置动画结束之后的状态是否是动画开始时的状态，true，表示是保持动画开始时的状态
scaleAnimation2.setFillBefore(true);
//设置动画的重复模式：反转REVERSE和重新开始RESTART
scaleAnimation2.setRepeatMode(ScaleAnimation.REVERSE);
//设置动画播放次数
scaleAnimation2.setRepeatCount(ScaleAnimation.INFINITE);
//开始动画
anim_view.startAnimation(scaleAnimation2);
//清除动画
//            anim_view.clearAnimation();
```

## Ref

- Android 动画 - ScaleAnimation 缩放动画使用（附图）<br /><https://blog.csdn.net/shibin1990_/article/details/51603910>

> 讲解很到位，细致

# AnimationSet 联合动画

## AnimationSet 详解

animationSet 继承自 Animation 没有自己的属性完全继承父类，但是有些属性对它无效，属性说明：

```
duration, repeatMode, fillBefore, fillAfter: 这些属性设置给了AnimationSet会作用于它内部的Animation对象.
repeatCount, fillEnabled: 这些属性对AnimationSet无效，将被忽略.
startOffset, shareInterpolator: 这些属性只作用于AnimationSet.
```

构造函数

```java
AnimationSet(Context context, AttributeSet attrs)
AnimationSet(boolean shareInterpolator) // shareInterpolator取值为true时，指在AnimationSet中定义一个插值器（interpolater），它下面的所有动画共同使用，为false，则各自定义插值器。
```

常用方法：

```java
//添加动画：
public void addAnimation (Animation a)
```

## XML 实现

### 案例 1：普通

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="3000"
    android:fillAfter="true">
    <translate
        android:fromXDelta="0"
        android:fromYDelta="0"
        android:toXDelta="100"
        android:toYDelta="100" />
    <alpha
        android:fromAlpha="0.5"
        android:toAlpha="1.0" />

    <scale
        android:fromXScale="0.0"
        android:fromYScale="0.0"
        android:pivotX="50%"
        android:pivotY="50%"
        android:toXScale="2.0"
        android:toYScale="2.0" />
    <rotate
        android:fromDegrees="0"
        android:pivotX="50%"
        android:pivotY="50%"
        android:toDegrees="-270" />
</set>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688201338118-01daa6d6-4f5e-417e-bcee-84b9901f6515.png#averageHue=%23ededed&clientId=u72fbe636-9943-4&from=paste&height=267&id=u240daa49&originHeight=534&originWidth=355&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15487&status=done&style=none&taskId=u4a21cce8-37b5-4f17-87b0-b80382a62e0&title=&width=177.5)<br />![](http://note.youdao.com/yws/res/27501/B77B0B03E5E647189DA9CB5BC1D4721B#id=CrCtY&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 案例 2：监听动画执行过程

- xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <scale
            android:duration="1000"
            android:fillAfter="true"
            android:fromXScale="1.0"
            android:fromYScale="1.0"
            android:pivotX="50%"
            android:pivotY="50%"
            android:toXScale="0.0"
            android:toYScale="0.0">
    </scale>

    <alpha android:fromAlpha="1"
           android:toAlpha="0.0"
           android:fillAfter="true"
           android:duration="1000"/>
</set>
```

- 代码

```java
// 做一个缩放渐变动画消失
Animation animation = AnimationUtils.loadAnimation(context, R.anim.chatroom_anim_choosing_heartbeat);
animation.setAnimationListener(new BaseAnimationListener() {
    @Override
    public void onAnimationStart(Animation animation) {
        LogUtils.d(TAG, "[updateViewLayout]平移动画结束了，做一个缩放渐变动画，当前坐标（"
                + ChoosingAnimManager.this.params.x + "," + ChoosingAnimManager.this.params.y + "）");
    }

    @Override
    public void onAnimationEnd(Animation animation) {
        LogUtils.d(TAG, "[updateViewLayout]整体动画结束了（包括缩放渐变动画），当前坐标（"
                + ChoosingAnimManager.this.params.x + "," + ChoosingAnimManager.this.params.y + "）");
        stop();
    }
});
ivChoosing.startAnimation(animation)
```

## Java 实现

```java
AnimationSet animationSet = new AnimationSet(true);
animationSet.addAnimation(alphaAnimation);
animationSet.addAnimation(scaleAnimation);
animationSet.addAnimation(rotateAnimation);
mTVDemo.startAnimation(animationSet);
```

## AnimationSet 不能循环动画博播放

官网就是不允许 set 动画设置重复，对于需要动画集重复的，只能另外想办法了。

```java
/**
 * 重复启动动画
 */
private class ReStartAnimationListener implements Animation.AnimationListener {

    public void onAnimationEnd(Animation animation) {
        // TODO Auto-generated method stub
        animation.reset();
        animation.setAnimationListener(new ReStartAnimationListener());
        animation.start();
    }

    public void onAnimationRepeat(Animation animation) {
        // TODO Auto-generated method stub

    }

    public void onAnimationStart(Animation animation) {
        // TODO Auto-generated method stub

    }

}
```
