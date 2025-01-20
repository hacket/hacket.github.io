---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 20th 2025, 11:30:20 pm
title: 帧动画frame-by-frame animation
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
date created: 星期二, 十二月 24日 2024, 12:29:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:37 晚上
image-auto-upload: true
feed: show
format: list
aliases: [逐帧动画 frame-by-frame animation]
linter-yaml-title-alias: 逐帧动画 frame-by-frame animation
---

# 逐帧动画 frame-by-frame animation

## 逐帧动画介绍

Frame-by-frame Animation 主要作用于 view，可以利用 xml 或者代码生成动画，如果使用 xml 方式生成动画需要在 `res/drawable` 目录下创建动画 xml 文件（`animation-list`）。

> 逐帧动画的原理是一张一张的播放图片资源（drawable 资源），然后出现动画效果。

逐帧动画对应的类是 AnimationDrawable，在 android.graphics.drawable.Drawable 包名下。

> 逐帧动画使用方式：把逐帧动画作为 view 的背景，然后获取动画，开启动画。

构造函数：

```java
AnimationDrawable()
```

属性说明：

```
oneshot:是否只播放一次，取值true，false，默认为false，用于animation-list
duration：每个item（每一帧动画）播放时长
drawable: 每一帧的drawable资源
visible:drawable资源是否可见，默认不可见
```

AnimationDrawable 的主要函数：

```java
addFrame(Drawable frame, int duration)添加drawable
    1. frame:每一帧的图片资源
    2. duration：每一帧的持续动画
start()：开始动画
stop(): 结束动画
isRunning()：是否正在执行
setOneShot(boolean oneShot)：设置是否只播放一次
getNumberOfFrames()	：获取帧的动画数
```

注意：

> 内部使用图片作为资源，所以如果图片资源过大可能造成 OOM，虽然简单，但是慎用。

## xml 使用

首先定义 animation-list 类型的 drawable frameanimation.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android" android:oneshot="true" > 
    // drawable= 图片资源；duration = 一帧持续时间(ms)
    <item android:drawable="@drawable/d1" android:duration="1000"/> 
    <item android:drawable="@drawable/d2" android:duration="1000"/>  
</animation-list>
```

设置动画资源的三种使用方式：

第一种：

```java
// 设置动画
imageView.setImageResource(R.drawable.frameanimation);
// 获取动画对象
animationDrawable = (AnimationDrawable)imageView.getDrawable();
animationDrawable.start();
```

第二种：

```java
// 设置背景：
imageView.setBackgroundResource(R.drawable.frameanimation);
animationDrawable = (AnimationDrawable) imageView.getBackground();
animationDrawable.start();
```

第三种：

```java
// 直接获取然后设置：
animationDrawable = (AnimationDrawable) getResources().getDrawable(R.drawable.frameanimation);
imageView.setBackground(animationDrawable);
animationDrawable.start();
```

## 代码使用

```java
@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
public void startAnimationDrawable() {
    //创建帧动画
    AnimationDrawable animationDrawable = new AnimationDrawable();
    //添加帧
    animationDrawable.addFrame(getResources().getDrawable(R.mipmap.record_04), 300);
    animationDrawable.addFrame(getResources().getDrawable(R.mipmap.record_05), 300);
    animationDrawable.addFrame(getResources().getDrawable(R.mipmap.record_07), 300);
    animationDrawable.addFrame(getResources().getDrawable(R.mipmap.record_09), 300);
    animationDrawable.addFrame(getResources().getDrawable(R.mipmap.record_11), 300);
    //设置动画是否只播放一次， 默认是false
    animationDrawable.setOneShot(false);
    //根据索引获取到那一帧的时长
    int duration = animationDrawable.getDuration(2);
    //根据索引获取到那一帧的图片
    Drawable drawable = animationDrawable.getFrame(0);
    //判断是否是在播放动画
    boolean isRunning = animationDrawable.isRunning();
    //获取这个动画是否只播放一次
    boolean isOneShot = animationDrawable.isOneShot();
    //获取到这个动画一共播放多少帧
    int framesCount = animationDrawable.getNumberOfFrames();
    //把这个动画设置为background，兼容更多版本写下面那句
    mIvImg.setBackground(animationDrawable);
    mIvImg.setBackgroundDrawable(animationDrawable);
    //开始播放动画
    animationDrawable.start();
    //停止播放动画
    animationDrawable.stop();
}

// 注意：我这里的动画时直接写在点击事件里面，如果你想让一看到界面就开始动画，不能叫start( )的方法写在onCreate里面
@Override
public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    animationDrawable.start();
}
```

# 帧动画原理

## 帧动画使用

```java
AnimationDrawable animationDrawable = (AnimationDrawable) image.getDrawable();
animationDrawable.start();
```

## AnimationDrawable 执行过程

从 AnimationDrawable.start 开始

```java
// AnimationDrawable Android29
public void start() {
    mAnimating = true;

    if (!isRunning()) {
        // Start from 0th frame.
        setFrame(0, false, mAnimationState.getChildCount() > 1 || !mAnimationState.mOneShot);
    }
}
//  设置当前展示第几帧
private void setFrame(int frame, boolean unschedule, boolean animate) {
    if (frame >= mAnimationState.getChildCount()) {
        return;
    }
    mAnimating = animate;
    mCurFrame = frame;
    selectDrawable(frame); // 展示当前frame帧图，设置当前展示frame drawable
    
    //  如果取消下一帧任务，或者这已经是当前最后一帧，则取消当帧动画任务
    if (unschedule || animate) {
        unscheduleSelf(this);
    }
    if (animate) {
        // Unscheduling may have clobbered these values; restore them
        mCurFrame = frame;
        mRunning = true;
        // 通过Choreographer监听下一帧的到来
        scheduleSelf(this, SystemClock.uptimeMillis() + mAnimationState.mDurations[frame]);
    }
}
```

现在看 `selectDrawable`

```java
public boolean selectDrawable(int index) {
    if (index == mCurIndex) {
        return false;
    }
    if (mEnterAnimationEnd != 0 || mExitAnimationEnd != 0) {
        if (mAnimationRunnable == null) {
            mAnimationRunnable = new Runnable() {
                @Override public void run() {
                    animate(true);
                    invalidateSelf();
                }
            };
        } else {
            unscheduleSelf(mAnimationRunnable);
        }
        // Compute first frame and schedule next animation.
        animate(true);
    }

    invalidateSelf(); // 绘制自己

    return true;
    
}
void animate(boolean schedule) {
    // ...
    if (schedule && animating) {
        scheduleSelf(mAnimationRunnable, now + 1000 / 60);
    }
}
public void scheduleSelf(@NonNull Runnable what, long when) {
    final Callback callback = getCallback();
    if (callback != null) {
        callback.scheduleDrawable(this, what, when);
    }
}

// 绘制drawable
public void invalidateSelf() {
    final Callback callback = getCallback();
    if (callback != null) {
        callback.invalidateDrawable(this);
    }
}
public void invalidateDrawable(@NonNull Drawable drawable) {
    if (verifyDrawable(drawable)) {
        final Rect dirty = drawable.getDirtyBounds();
        final int scrollX = mScrollX;
        final int scrollY = mScrollY;

        invalidate(dirty.left + scrollX, dirty.top + scrollY,
                dirty.right + scrollX, dirty.bottom + scrollY);
        rebuildOutline();
    }
}
```

现在回到 setFrame，调用了 scheduleSelf

```java
// AnimationDrawable
public void scheduleSelf(@NonNull Runnable what, long when) {
    final Callback callback = getCallback();
    if (callback != null) {
        callback.scheduleDrawable(this, what, when);
    }
}
// View
public void scheduleDrawable(@NonNull Drawable who, @NonNull Runnable what, long when) {
    if (verifyDrawable(who) && what != null) {
        final long delay = when - SystemClock.uptimeMillis();
        if (mAttachInfo != null) {
            mAttachInfo.mViewRootImpl.mChoreographer.postCallbackDelayed(
                    Choreographer.CALLBACK_ANIMATION, what, who,
                    Choreographer.subtractFrameDelay(delay));
        } else {
            // Postpone the runnable until we know
            // on which thread it needs to run.
            getRunQueue().postDelayed(what, delay);
        }
    }
}
```

通过 Choreographer，监听 vsync 刷新屏幕信号，最后调用到 AnimationDrawable 的 run 方法，设置下一帧的动画

```java
public void run() {
    nextFrame(false);
}
 private void nextFrame(boolean unschedule) {
    int nextFrame = mCurFrame + 1;
    final int numFrames = mAnimationState.getChildCount();
    final boolean isLastFrame = mAnimationState.mOneShot && nextFrame >= (numFrames - 1);

    // Loop if necessary. One-shot animations should never hit this case.
    if (!mAnimationState.mOneShot && nextFrame >= numFrames) {
        nextFrame = 0;
    }
    // 新一轮的循环又开始
    setFrame(nextFrame, unschedule, !isLastFrame);
}
```

### Drawable.Callback

Drawable.Callback 实现该接口实现动画 drawable

```java
// Drawable Android29
public interface Callback {
    // Drawable需要重绘的时候调用，这个时候View需要调用invalidate
    void invalidateDrawable(@NonNull Drawable who);
    // Drawable调用该方法安排下一帧的动画
    void scheduleDrawable(@NonNull Drawable who, @NonNull Runnable what, long when);
    // 不需要安排下一帧动画了
    void unscheduleDrawable(@NonNull Drawable who, @NonNull Runnable what);
}
```

CallBack 的绑定

```java
// View Android29
public void setBackgroundDrawable(Drawable background) {
    if (mBackground != null) {
        if (isAttachedToWindow()) {
            mBackground.setVisible(false, false);
        }
        mBackground.setCallback(null);
        unscheduleDrawable(mBackground);
    }
    if (isAttachedToWindow()) {
        background.setVisible(getWindowVisibility() == VISIBLE && isShown(), false);
    }

    applyBackgroundTint();

    // Set callback last, since the view may still be initializing.
    background.setCallback(this);
    invalidate(true);
    invalidateOutline();
}

public void setForeground(Drawable foreground) {
    if (foreground != null) {
        foreground.setLayoutDirection(getLayoutDirection());
        if (foreground.isStateful()) {
            foreground.setState(getDrawableState());
        }
        applyForegroundTint();
        if (isAttachedToWindow()) {
            foreground.setVisible(getWindowVisibility() == VISIBLE && isShown(), false);
        }
        // Set callback last, since the view may still be initializing.
        foreground.setCallback(this);
    }   
    requestLayout();
    invalidate();
}
```

## 总结

1. AnimationDrawable.start，设置第一帧，安排下一帧的监听
2. Drawable#scheduleSelf，通过 Drawable.Callback#scheduleDrawable，安排下一帧动画，最终调用到 View 中， 通过监听 vsync 信号的到来，来执行下一帧动画
3. Drawable#invalidateSelf，通过 Drawable.Callback#invalidateDrawable，安排 drawable 的绘制
4. Drawable.Callback 的实现是 View，在 setBackground 和 setForeground 会调用 Drawable#setCallback 设置回调

# 案例

## 帧动画实现新手引导

- xml 定义

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:oneshot="false"
        android:variablePadding="true">
    <item
            android:drawable="@drawable/guide_voice_record_00020"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00021"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00022"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00023"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00024"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00025"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00026"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00027"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00028"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00029"
            android:duration="100"
            android:gravity="center"/>
    <item
            android:drawable="@drawable/guide_voice_record_00030"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00031"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00032"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00033"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00034"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00035"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00036"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00037"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00038"
            android:duration="100"
            android:gravity="center"/>

    <item
            android:drawable="@drawable/guide_voice_record_00039"
            android:duration="100"
            android:gravity="center"/>

</animation-list>
```

- 代码引用

```java
public final class VoiceRecordGuideView extends ConstraintLayout implements View.OnTouchListener {

    private ImageView mAnimateView;

    public VoiceRecordGuideView(Context context) {
        this(context, null);
    }

    public VoiceRecordGuideView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public VoiceRecordGuideView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    private void init(Context context) {
        LayoutInflater.from(context).inflate(R.layout.layout_guide_voice_record, this, true);
        mAnimateView = findViewById(R.id.image);
        Drawable anim = null;
        try {
            @SuppressLint("ResourceType")
            Drawable fromXml = Drawable.createFromXml(getResources(), getResources().getXml(R.drawable.anim_guide_voice_record));
            if (fromXml instanceof AnimationDrawable) {
                anim = new CustomDurationDrawable((AnimationDrawable) fromXml, 50);
            } else {
                anim = fromXml;
            }
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {

        }
        mAnimateView.setImageDrawable(anim);
        setOnTouchListener(this);
        setBackgroundColor(CompatUtil.getColor(R.color.mask_color));
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (mAnimateView != null) {
            Drawable drawable = mAnimateView.getDrawable();
            if (drawable instanceof Animatable) {
                ((Animatable) drawable).start();
            }
        }
    }

    public void show(Activity activity) {
        FrameLayout fl = activity.findViewById(android.R.id.content);
        if (fl != null) {
            fl.addView(this);
        }
//        ((ViewGroup) activity.getWindow().getDecorView()).addView(this);
    }

    public void dismiss() {
        removeFromWindow();
    }

    private void removeFromWindow() {
        ViewGroup parent = (ViewGroup) getParent();
        if (parent != null) {
            parent.removeView(this);
        }
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                removeFromWindow();
                break;
            default:
                break;
        }
        return true;
    }

}
```

xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<merge xmlns:android="http://schemas.android.com/apk/res/android"
       xmlns:app="http://schemas.android.com/apk/res-auto"
       xmlns:tools="http://schemas.android.com/tools"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       android:orientation="vertical"
       tools:parentTag="androidx.constraintlayout.widget.ConstraintLayout"
       android:gravity="center"
       >

    <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textSize="@dimen/sp_16"
            android:gravity="center"
            android:text="有心事，说出来，我们帮你守护"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            android:textColor="@color/white"/>

    <ImageView
            android:id="@+id/image"
            android:layout_width="200dp"
            android:layout_height="200dp"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            android:layout_marginTop="@dimen/qb_px_45"
            android:src="@drawable/anim_guide_voice_record"/>
</merge>
```
