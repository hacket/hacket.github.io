---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 27th 2025, 10:26:58 pm
title: ObjectAnimator
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
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:30 晚上
image-auto-upload: true
feed: show
format: list
aliases: [ObjectAnimator]
linter-yaml-title-alias: ObjectAnimator
---

# ObjectAnimator

## ObjectAnimator 概述

`ValueAnimator` 只能对数值进行计算，要实现动画需要监听动画，然后获取数值，自己操作对象。一是这个动画有点复杂，另一个感觉是虽然叫做属性对象，但是完全没有感受到哪里跟属性有关。<br />`ObjectAnimator` 对象，这个对象继承自 ValueAnimator，可以通过改变对象的属性，实现动画，是不是感觉 ObjectAnimator 叫做属性对象更合适。

1. ObjectAnimator 继承自 ValueAnimator,也是从 API11 才开始提供。
2. ValueAnimator 类提供了把动画中的属性设置给目标对象的能力，只不过需要我们设置监听自己进行设置。ObjectAnimator 可以设置动画目标对象（构造函数可以直接传入），构造函数中提供了将要作用于目标对象的属性名，ObjectAnimator 运行过程中会把提供的属性利用目标对象提供的 set 函数设置给目标对象，有时也会调用目标对象的 get 函数获取属性值。简单说就是 ObjectAnimator 通过不断控制值的变化，再不断自动赋给对象的属性 (调用目标对象的 setXXX 函数)，从而实现动画效果。

### ObjectAnimator 属性动画原理及注意

#### ObjectAnimator 原理

属性动画并不是真正通过改变对象的属性来实现动画，而是通过调用目标对象指定的 setXxx 方法，其中 xxx 就是指定的属性名，对象不一定有 xxx 这个属性，只要有 setXxx 这个方法就可以。ObjectAnimator 动画过程中会调用 SetXxx 函数设置 xxx 的值，然后其内部会主动调用 invalidate（）函数进行不停地重绘，这样就实现了动画效果。<br />![m4ehc](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/m4ehc.png)

#### ObjectAnimator 注意事项

1. duration 动画运行时长，如果不设置默认 300ms
2. interpolation：设置动画运行过程中对应的动画完成状态（设置动画运行速率，类似动画设置了 1000ms，可以让动画在运行到 100ms 时就展示动画完成时的状态）
3. 动画刷新频率，默认是每 10ms 刷新一次，但也跟系统忙碌程度有关，如果系统资源占用严重可能时间会延长。
4. 属性动画 getXxx(),setXxx() 函数和属性 xxx 的规则说明

- 如果 ObjectAnimator 想操作对象的 foo 属性实现动画操作，对象必须有相应的 setFoo 函数，因为 ObjectAnimator 会自动根据 foo 属性对应的 setFoo 函数去更新属性值。所以可以推测出 ObjectAnimator 会自动把属性转化成对应的 set 函数，会强制大写第一个字母，然后反射得到 set 函数，进行调用，所以 ObjectAnimator 初始化时属性首字母大小写无所谓，关键是除了首字母其他一定要和 set 函数对应。
- 上面我们知道了对象 setter 函数的作用，那么 getter 函数有什么用处呢，ObjectAnimator 指定 values 时，可以指定多个 value，如果我们初始化时只指定了一个值，ObjectAnimator 会把这个值作为动画结束状态的值，此时会调用 getter 函数作为动画初始状态的值。
- 动画目标对象 getter 和 setter 函数的参数类型和 ObjectAnimator 设置动画开始和结束值的类型必须相同。
- ObjectAnimator 内部会主动调用目标对象的 setter 方法，但是这并不会导致 view 的重绘，需要你在 setter 方法中主动调用 invalidate 方法或者设置动画监听函数，在 onAnimationUpdate 的回调中调用 invalidate 方法。如果你要自己定义对象的 setter 方法，就要主动调用 invalidate 方法。

#### ObjectAnimator 源码分析

见 `属性动画原理` 章节<br />首先看一个 ObjectAnimator 的示例：

```kotlin
val animator = ObjectAnimator.ofFloat(anim_view_tweened, View.SCALE_X, 0.1f, 1.0f, 2.0f, 1.0f)
animator.duration = 3000
animator.interpolator = LinearInterpolator()
animator.start()
```

我们跟进去 ofFloat 方法，和 ValueAnimator 类似，也是通过 PropertyValuesHolder 来保存

```java
// ObjectAnimator Android29
public static <T> ObjectAnimator ofFloat(T target, Property<T, Float> property,
        float... values) {
    ObjectAnimator anim = new ObjectAnimator(target, property);
    anim.setFloatValues(values);
    return anim;
}
```

现在我们看看 start()

```java
// ObjjectAnimator Android29
public void start() {
    AnimationHandler.getInstance().autoCancelBasedOn(this);
    super.start();
}
boolean shouldAutoCancel(AnimationHandler.AnimationFrameCallback anim) {
    if (anim == null) {
        return false;
    }

    if (anim instanceof ObjectAnimator) {
        ObjectAnimator objAnim = (ObjectAnimator) anim;
        if (objAnim.mAutoCancel && hasSameTargetAndProperties(objAnim)) {
            return true;
        }
    }
    return false;
}
private boolean hasSameTargetAndProperties(@Nullable Animator anim) {
    if (anim instanceof ObjectAnimator) {
        PropertyValuesHolder[] theirValues = ((ObjectAnimator) anim).getValues();
        if (((ObjectAnimator) anim).getTarget() == getTarget() &&
                mValues.length == theirValues.length) {
            for (int i = 0; i < mValues.length; ++i) {
                PropertyValuesHolder pvhMine = mValues[i];
                PropertyValuesHolder pvhTheirs = theirValues[i];
                if (pvhMine.getPropertyName() == null ||
                        !pvhMine.getPropertyName().equals(pvhTheirs.getPropertyName())) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
```

ObjectAnimator.start() 和 ValueAnimator 就多了一个 `autoCancelBasedOn`，当有一个 ObectAnimator 的 target 和 property 一样时，就会取消之前的 ObjectAnimator；其他逻辑调用的是 ValueAnimator.start()

AnimationHandler 及注册 Choreographer 逻辑都一样。

不同的是 ObjectAnimator 重写了 `initAnimation()` 和 `animateValue()`

```java
// ObjectAnimator Android29
void initAnimation() {
    if (!mInitialized) {
        // mValueType may change due to setter/getter setup; do this before calling super.init(),
        // which uses mValueType to set up the default type evaluator.
        final Object target = getTarget();
        if (target != null) {
            final int numValues = mValues.length;
            for (int i = 0; i < numValues; ++i) {
                mValues[i].setupSetterAndGetter(target);
            }
        }
        super.initAnimation();
    }
}
```

initAnimation 和 ValueAnimator 的区别是调用了 PropertyValuesHolder 的 setupSetterAndGetter，反射获取 target 上的 setter 和 getter 方法

```java
// ObjectAnimator Android29
void animateValue(float fraction) {
    final Object target = getTarget();
    if (mTarget != null && target == null) {
        // We lost the target reference, cancel and clean up. Note: we allow null target if the
        /// target has never been set.
        cancel();
        return;
    }

    super.animateValue(fraction);
    int numValues = mValues.length;
    for (int i = 0; i < numValues; ++i) {
        mValues[i].setAnimatedValue(target);
    }
}
```

animateValue 和 ValueAnimator 相比多调用了 PropertyValuesHolder 的 setAnimatedValue 方法，更新值时调用了 target 的 setter 方法。

```java
// PropertyValuesHolder Android29
void setAnimatedValue(Object target) {
    if (mProperty != null) {
        mProperty.set(target, getAnimatedValue());
    }
    if (mSetter != null) { // setter不为null，
        try {
            mTmpValueArray[0] = getAnimatedValue();
            mSetter.invoke(target, mTmpValueArray); // 反射调用target的setter，赋值
        } catch (InvocationTargetException e) {
            Log.e("PropertyValuesHolder", e.toString());
        } catch (IllegalAccessException e) {
            Log.e("PropertyValuesHolder", e.toString());
        }
    }
}
```

#### ObjectAnimator 和 ValueAnimator 区别

1. ValueAnimator 类是先改变值，然后 **手动赋值** 给对象的属性从而实现动画；是 **间接** 对对象属性进行操作
2. ObjectAnimator 类是先改变值，然后 **自动赋值** 给对象的属性 (反射调用对象的 setter 方法，还是需要手动 invalidate() 等操作的) 从而实现动画；是 **直接** 对对象属性进行操作；

### ObjectAnimator 实现属性动画方式

#### 1. propertyName 方式

```java
ofXXX(Object target, String propertyName, XXX... values) // XXX为类型，如Int
```

1. 单个属性更新
2. propertyName 为属性名，执行属性动画过程中会通过反射修改该值；
3. 需要提供 setter/getter(单个值需要用)，不需要该属性存在，只需要 setter/getter 存在即可
4. 最终也是通过 PropertyValuesHolder 存储 target/propertyName/Property 的，只是保存单个 PropertyValuesHolder

如 ofInt：

```java
// ObjectAnimator Android29
public static ObjectAnimator ofInt(Object target, String propertyName, int... values) {
    ObjectAnimator anim = new ObjectAnimator(target, propertyName);
    anim.setIntValues(values);
    return anim;
}
private ObjectAnimator(Object target, String propertyName) {
    setTarget(target);
    setPropertyName(propertyName);
}

// IntPropertyValuesHolder Android29
void setAnimatedValue(Object target) {
    if (mIntProperty != null) {
        mIntProperty.setValue(target, mIntAnimatedValue);
        return;
    }
    if (mProperty != null) {
        mProperty.set(target, mIntAnimatedValue);
        return;
    }
    if (mJniSetter != 0) {
        nCallIntMethod(target, mJniSetter, mIntAnimatedValue);
        return;
    }
    if (mSetter != null) {
        try {
            mTmpValueArray[0] = mIntAnimatedValue;
            mSetter.invoke(target, mTmpValueArray);
        } catch (InvocationTargetException e) {
            Log.e("PropertyValuesHolder", e.toString());
        } catch (IllegalAccessException e) {
            Log.e("PropertyValuesHolder", e.toString());
        }
    }
}
```

#### 2. Property 方式，优先于 propertyName 的（包括自定义 Property）

```java
<T> ObjectAnimator ofXXX(T target, Property<T, Integer> property, XXX... values) // XXX为类型，如Int
```

1. 单个属性更新
2. Property 没有用反射，直接调用的是 set 或 get 方法
3. 优先于 propertyName 的
4. 可以用来包装第三方库的 view 但未提供 setter/getter；提供的 setter 未 invalidate 等不规范不符合 ObjectAnimator 自动调用更新的规则 来实现动画更新
5. 最终也是通过 PropertyValuesHolder 存储 target/propertyName/Property 的，只是保存单个 PropertyValuesHolder

如 ofInt：

```java
// ObjectAnimator Android29
public static <T> ObjectAnimator ofInt(T target, Property<T, Integer> property, int... values) {
    ObjectAnimator anim = new ObjectAnimator(target, property);
    anim.setIntValues(values);
    return anim;
}
private <T> ObjectAnimator(T target, Property<T, ?> property) {
    setTarget(target);
    setProperty(property);
}

// IntPropertyValuesHolder Android29
void setAnimatedValue(Object target) {
    if (mIntProperty != null) {
        mIntProperty.setValue(target, mIntAnimatedValue);
        return;
    }
    if (mProperty != null) {
        mProperty.set(target, mIntAnimatedValue);
        return;
    }
    if (mJniSetter != 0) {
        nCallIntMethod(target, mJniSetter, mIntAnimatedValue);
        return;
    }
    if (mSetter != null) {
        try {
            mTmpValueArray[0] = mIntAnimatedValue;
            mSetter.invoke(target, mTmpValueArray);
        } catch (InvocationTargetException e) {
            Log.e("PropertyValuesHolder", e.toString());
        } catch (IllegalAccessException e) {
            Log.e("PropertyValuesHolder", e.toString());
        }
    }
}
```

#### 3. PropertyValuesHolder 方式（可分为 propertyName 和 Property 方式） 1 或多个属性更新

```java
ofPropertyValuesHolder(Object target, PropertyValuesHolder... values)
```

1. 同时多个属性更新
2. PropertyValuesHolder 里面有很多 ofXXX 方法，区分 propertyName 和 Property 方式
3. 保存多个 PropertyValuesHolder（`PropertyValuesHolder[]`）

如何实现多个属性更新？

```java
// ObjectAnimator Android29
void animateValue(float fraction) {
    final Object target = getTarget();
    if (mTarget != null && target == null) {
        // We lost the target reference, cancel and clean up. Note: we allow null target if the
        /// target has never been set.
        cancel();
        return;
    }

    super.animateValue(fraction);
    int numValues = mValues.length; // PropertyValuesHolder[] mValues
    for (int i = 0; i < numValues; ++i) {
        mValues[i].setAnimatedValue(target); // 遍历赋值
    }
}
```

可以看到拿到 mValues 来遍历更新值 (反射调用 setter 或者 Property.set)

### ObjectAnimator 实现动画的 of 方法

```java
> ofArgb(Object target, String propertyName, int... values)
> ofArgb(T target, Property<T, Integer> property, int... values)
>
> ofFloat(Object target, String xPropertyName, String yPropertyName, Path path)
> ofFloat(T target, Property<T, Float> property, float... values)
> ofFloat(T target, Property<T, Float> xProperty, Property<T, Float> yProperty, Path path)
> ofFloat(Object target, String propertyName, float... values)
>
> ofInt(T target, Property<T, Integer> property, int... values)
> ofInt(Object target, String propertyName, int... values)
> ofInt(Object target, String xPropertyName, String yPropertyName, Path path)
> ofInt(T target, Property<T, Integer> xProperty, Property<T, Integer> yProperty, Path path)
>
> ofObject(T target, Property<T, V> property, TypeEvaluator<V> evaluator, V... values)
> ofObject(Object target, String propertyName, TypeConverter<PointF, ?> converter, Path path)
> ofObject(T target, Property<T, V> property, TypeConverter<PointF, V> converter, Path path)
> ofObject(T target, Property<T, P> property, TypeConverter<V, P> converter, TypeEvaluator<V> evaluator, V... values)
> ofObject(Object target, String propertyName, TypeEvaluator evaluator, Object... values)
>
> ofPropertyValuesHolder(Object target, PropertyValuesHolder... values)
>
> // 不常用
> ofMultiFloat(Object target, String propertyName, float[][] values)
> ofMultiFloat(Object target, String propertyName, Path path)
> ofMultiFloat(Object target, String propertyName, TypeConverter<T, float[]> converter, TypeEvaluator<T> evaluator, T... values)
> ofMultiInt(Object target, String propertyName, int[][] values)
> ofMultiInt(Object target, String propertyName, Path path)
> ofMultiInt(Object target, String propertyName, TypeConverter<T, int[]> converter, TypeEvaluator<T> evaluator, T... values)
```

## 利用 ObjectAnimator 实现补间动画效果 (Java 代码方式)

![75ddc](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/75ddc.png)

### translationX/translationY 平移 （原点控件左上角）

View 有 `setTranslationX`，`setTranslationY` 实现坐标的改变

1. setTranslationX(float translationX) : 表示在 X 轴上的平移距离，以当前控件为原点，向右为正方向，参数 translationX 表示移动的距离。
2. setTranslationY(float translationY) : 表示在 Y 轴上的平移距离，以当前控件为原点，向下为正方向，参数 translationY 表示移动的距离

- 注意
  1. 坐标系是以当前控件左上角为原点 (0,0)
  2. 如果当前控件不可见，那么做动画可能会失效（礼物面板默认不可见，显示时从下往上动画出来，如果默认不可见，那么显示时，就直接显示了，没有动画，解决设置为 INVISIBLE 而不是 GONE）

#### propertyName 方式

案例 1：ObjectAnimator 实现平移：

```java
objectAnimator = ObjectAnimator.ofFloat(textView, "translationX", 100, 200, 300,400,500);
objectAnimator.setDuration(3000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![1hiht](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/1hiht.gif)

案例 2：

```java
ObjectAnimator animator = ObjectAnimator.ofFloat(tv, "translationY", 0, 200, -100, 0);  
animator.setDuration(2000);  
animator.start();
```

移动位置的坐标也都是以当前控件所在位置为中心点的。所以对应的移动位置从原点移动向下移动 200 像素，然后再移动到向下到距原点 200 像素的位置，最后再回到 (0,0) 从效果图中很明显可以看出来。 从上面可以看出：每次移动距离的计算都是以原点为中心的；比如初始动画为 `ObjectAnimator.ofFloat(tv, “translationY”, 0, 200, -100,0)` 表示首先从 0 移动到正方向 200 的位置，然后再移动到负方向 100 的位置，最后移动到原点。

#### Property 方式

```kotlin
val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.TRANSLATION_X, 0F, 200F, -100F)
animator.duration = 3000
animator.interpolator = LinearInterpolator()
animator.start()
```

#### PropertyValuesHolder 方式（分为 propertyName 和 Property 方式）

```kotlin
val holder = PropertyValuesHolder.ofFloat(View.TRANSLATION_X, 0F, 200F, -100F, 300F)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()
```

### alpha 透明度

View 有 `setAlpha` 函数控制透明度

#### propertyName 方式

ObjectAnimator 实现透明度变化：

```java
objectAnimator = ObjectAnimator.ofFloat(textView, "alpha", 0.1f,1.0f);
objectAnimator.setDuration(3000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![59ula](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/59ula.gif)

#### Property 方式

```kotlin
val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.ALPHA, 0.1f, 1.0f)
animator.duration = 3000
animator.interpolator = LinearInterpolator()
animator.start()
```

#### PropertyValuesHolder 方式（分为 propertyName 和 Property 方式）

```kotlin
val holder = PropertyValuesHolder.ofFloat(View.ALPHA, 0.1f, 1.0f)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()
```

### scaleX/scaleY 缩放 默认缩放点 view 中心

View 有 `setScaleX(float scaleX)` 和 `setScaleY(float scaleY)` 函数对 View 进行缩放。

#### propertyName 方式

ObjectAnimator 实现缩放

```java
objectAnimator = ObjectAnimator.ofFloat(textView, "scaleX", 0.1f,1.0f,2.0f,1.0f);
objectAnimator.setDuration(3000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![cpok9](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/cpok9.gif)

#### Property 方式

```kotlin
anim_view_tweened_property.pivotX = 0F
anim_view_tweened_property.pivotY = 0F
val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.SCALE_X, 0.1f, 1.0f, 2.0f, 1.0f)
animator.duration = 3000
animator.interpolator = LinearInterpolator()
animator.start()
```

#### PropertyValuesHolder 方式（分为 propertyName 和 Property 方式）

```kotlin
val holder = PropertyValuesHolder.ofFloat(View.SCALE_X, 0.1f, 1.0f, 2.0f, 1.0f)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()
```

### rotation 旋转 默认旋转点 view 中心

View 有 `setRotationX(float rotationX)` 和 `setRotationY(float rotationY)`，`setRotation(rotation)` 函数设置旋转，

1. setRotationX：绕 X 轴旋转，默认中心为 view 中心，通过 setPivotX/Y 设置
2. setRotationY：绕 Y 轴旋转，默认中心为 view 中心，通过 setPivotX/Y 设置
3. setRotation: 绕中心旋转，默认中心为 view 中心，通过 setPivotX/Y 设置

ObjectAnimator 实现旋转

#### propertyName 方式

```java
objectAnimator = ObjectAnimator.ofFloat(textView, "rotation", 0,270);
objectAnimator.setDuration(3000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![pln4r](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/pln4r.gif)

#### Property 方式

```kotlin
val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.ROTATION, 0f, 270f)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()

val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.ROTATION_X, 0f, 270f, 180F)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()

val animator = ObjectAnimator.ofFloat(anim_view_tweened_property, View.ROTATION_Y, 0f, 270f, 180F)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()
```

#### PropertyValuesHolder 方式（分为 propertyName 和 Property 方式）

```kotlin
val holder = PropertyValuesHolder.ofFloat(View.ROTATION, 0f, 270f)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()

val holder = PropertyValuesHolder.ofFloat(View.ROTATION_X, 0f, 270f, 180F)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()

val holder = PropertyValuesHolder.ofFloat(View.ROTATION_Y, 0f, 270f, 180F)
val animator = ObjectAnimator.ofPropertyValuesHolder(anim_view_tweened_property_holder, holder)
animator.duration = 1500
animator.interpolator = LinearInterpolator()
animator.start()
```

#### setRotation 华为手机不支持

Android 标准 API 中 View 的 setRotationX 和 setRotationY ,在华为某些手机的系统上不支持？？？<br />需要加上 `setCameraDistance(scale);` 才可以

```java
// View#setCameraDistance
Sets the distance along the Z axis (orthogonal to the X/Y plane on which views are drawn) from the camera to this view
设置摄像机与旋转目标在Z轴上距离
```

- <https://stackoverflow.com/questions/46845261/animator-animatorset-issue-on-some-devices><br /><https://stackoverflow.com/questions/46845261/animator-animatorset-issue-on-some-devices>

### 属性动画设置锚点（中心点，默认控件的中心）

View 动画是直接提供了相应的方法直接设置动画的轴点；对于属性动画，并没有直接提供设置轴点的动画，我们需要在执行某个 View 的属性动画前设置 View 的轴点。

```java
View.setPivotX(float pivotX);
View.setPivotY(float pivotY);
```

**其中 pivotX 和 pivotY 是相对于该 View 左上角的坐标值而非相对于整个屏幕左上角的坐标值。** 如若需要让 View 绕着底部的中点进行旋转，可设置轴点为：

```java
View.setPivotX(View.getWidth() / 2);
View.setPivotY(View..getHeight());
```

注意：

1. 需要注意的是，在 onCreate、onStart、onResume 中均无法正确得到某个 View 的宽/高信息，这是因为 View 的 measure 过程和 Activity 的生命周期方法不是同步执行的，因此无法保证 Activity 执行了 onCreate、onStart、onResume 时某个 View 已经测量完毕了，如果 View 还没有测量完毕，那么获得的宽/高就是 0。
2. View 设置为 gone 时也会获取不到 width/height

案例：属性动画设置中心点（设置旋转的点，或者叫锚 (anchor)）：

```java
public static void rotateIn(RelativeLayout layout, long delay) {
    ObjectAnimator rotate = ObjectAnimator.ofFloat(layout, "rotation", -180f, 0f);
    layout.setPivotX(layout.getWidth()/2);
    layout.setPivotY(layout.getHeight());
    rotate.setDuration(500);
    rotate.setStartDelay(delay);
    rotate.addListener(new MyAnimationListener2());
    rotate.start();
}
```

## Xml 方式实现 ObjectAnimator

```xml
<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="1000"
    android:valueTo="200"
    android:valueType="floatType"
    android:propertyName="y"
    android:repeatCount="1"
    android:repeatMode="reverse"/>
```

代码加载：

```java
ObjectAnimator objAnimator = (ObjectAnimator ) AnimatorInflater.loadAnimator(this,
R.animator.animator);
```

## 自定义 View 实现属性动画

### propertyName 方式

自定义 ObjectAnimator 属性的操作步骤：

1. 提供 setXXX 和 getXXX 方法
2. 在 setXXX 方法中调用 invalidate 方法重绘
3. setXXX 和 getXXX 方法的类型需要和 ObjectAnimator.ofXXX 方法的类型一致（比如 ofInt，那么 setter/getter 需要是 Int）

### Property 方式

```
class MyRippleProperty : Property<CircleRippleView, Int>(Int::class.java, "my_ripple") {
    override fun get(obj: CircleRippleView): Int {
        return obj.radius2
    }
    override fun set(obj: CircleRippleView, value: Int) {
        obj.radius2 = value
        obj.invalidate()
    }
}
```

### 自定义 View

```java
public class CircleRippleView extends View {

    private int color = Color.GREEN;
    private int radius = 10;

    private Paint mPaint;

    public int getColor() {
        return color;
    }

    public void setColor(int color) {
        this.color = color;
        mPaint.setColor(color);
        invalidate();
    }

    private int getRadius() {
        return radius * 10;
    }

    private void setRadius(int radius) {
        this.radius = radius;
        invalidate();
    }

    public int getRadius2() {
        return radius * 10;
    }

    public void setRadius2(int radius) {
        this.radius = radius;
    }

    public CircleRippleView(Context context) {
        this(context, null, 0);
    }

    public CircleRippleView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CircleRippleView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setColor(color);
        mPaint.setStrokeWidth(5);
        mPaint.setStyle(Paint.Style.STROKE);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawCircle(getMeasuredHeight() / 2, getMeasuredHeight() / 2, radius, mPaint);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int width = MeasureSpec.getSize(widthMeasureSpec);
        int height = MeasureSpec.getSize(heightMeasureSpec);
        if (width < 200) {
            width = 200;
        }

        if (height < 200) {
            height = 200;
        }

        if (width < height) {
            setMeasuredDimension(height, height);
        } else {
            setMeasuredDimension(width, width);
        }
    }
}
```

布局文件

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

<CircleRippleView
    android:id="@+id/viewdemo"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintLeft_toLeftOf="parent"
    app:layout_constraintRight_toRightOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toBottomOf="parent"/>

</android.support.constraint.ConstraintLayout>
```

改变 radius 做动画

```java
setContentView(R.layout.activity_main);
viewDemo22 = findViewById(R.id.viewdemo);

ObjectAnimator objectAnimator = ObjectAnimator.ofInt(viewDemo22, "radius", 50, 300);
objectAnimator.setDuration(1000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.setRepeatCount(-1);
objectAnimator.start();
```

![ab97b](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ab97b.gif)

改变颜色,没有设置插值器，只是简单数据改变：

```java
ObjectAnimator objectAnimator = ObjectAnimator.ofInt(viewDemo22, "color", Color.RED, Color.GREEN);
objectAnimator.setDuration(1000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.setRepeatCount(-1);
objectAnimator.start();
```

![ggd3i](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/ggd3i.gif)

## 案例

### 属性动画实际应用（猜拳 PK 动画）

![zjt33](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/zjt33.png)<br />动画过程（具体动画效果见 `猜拳游戏_动画效果.mp4`）：<br />[猜拳游戏_动画效果.mp4](https://www.yuque.com/attachments/yuque/0/2024/mp4/694278/1706188825471-93c64a48-9e45-4769-9a93-d6519754a96a.mp4?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2024%2Fmp4%2F694278%2F1706188825471-93c64a48-9e45-4769-9a93-d6519754a96a.mp4%22%2C%22name%22%3A%22%E7%8C%9C%E6%8B%B3%E6%B8%B8%E6%88%8F_%E5%8A%A8%E7%94%BB%E6%95%88%E6%9E%9C.mp4%22%2C%22size%22%3A1943099%2C%22ext%22%3A%22mp4%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22ud656689b-c53a-4d42-b892-bba125771f1%22%2C%22taskType%22%3A%22transfer%22%2C%22type%22%3A%22video%2Fmp4%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u8738610b%22%2C%22card%22%3A%22file%22%7D)

[![tzytl](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/tzytl.png)]()

1. 左右背景分别从左/右进入
2. 闪电缩放一下
3. 左右拳头 30° 上下旋转 2 次

- layout

```xml
<?xml version="1.0" encoding="utf-8"?>
<merge xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:clipChildren="false"
        android:layoutDirection="ltr"
        tools:background="@color/black_50_percent_transparent"
        tools:parentTag="androidx.constraintlayout.widget.ConstraintLayout">

    <androidx.constraintlayout.widget.ConstraintLayout
            android:id="@+id/cl_roshambo_pk_content"
            android:layout_width="0dp"
            android:layout_height="0dp"
            android:clipChildren="false"
            android:layoutDirection="ltr"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent">
        <!--左guideline-->
        <androidx.constraintlayout.widget.Guideline
                android:id="@+id/guideline_left"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                app:layout_constraintGuide_percent="0.445187166" />

        <!--左背景-->
        <ImageView
                android:id="@+id/iv_roshambo_pk_left"
                android:layout_width="0dp"
                android:layout_height="@dimen/qb_px_150"
                android:scaleType="centerCrop"
                android:src="@drawable/ic_mini_game_roshambo_left_blue"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintDimensionRatio="187:146"
                app:layout_constraintEnd_toEndOf="@+id/guideline_right"
                app:layout_constraintHorizontal_bias="1"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintTop_toTopOf="parent"
                tools:ignore="ContentDescription" />

        <!--右guideline-->
        <androidx.constraintlayout.widget.Guideline
                android:id="@+id/guideline_right"
                android:layout_width="0dp"
                android:layout_height="0dp"
                android:orientation="vertical"
                app:layout_constraintGuide_percent="0.554812834" />

        <!--右背景-->
        <ImageView
                android:id="@+id/iv_roshambo_pk_right"
                android:layout_width="0dp"
                android:layout_height="@dimen/qb_px_150"
                android:scaleType="centerCrop"
                android:src="@drawable/ic_mini_game_roshambo_right_red"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintDimensionRatio="187:146"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintHorizontal_bias="0"
                app:layout_constraintStart_toStartOf="@id/guideline_left"
                app:layout_constraintTop_toTopOf="parent"
                tools:ignore="ContentDescription" />

        <!--闪电-->
        <ImageView
                android:id="@+id/iv_roshambo_pk_flight"
                android:layout_width="0dp"
                android:layout_height="@dimen/qb_px_87"
                android:background="@drawable/ic_mini_game_roshambo_flight"
                android:scaleType="centerCrop"
                android:visibility="invisible"
                app:layout_constraintBottom_toBottomOf="parent"
                app:layout_constraintDimensionRatio="62:87"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintTop_toTopOf="parent" />

        <!--左拳头-->
        <ImageView
                android:id="@+id/iv_roshambo_pk_rock_left"
                android:layout_width="@dimen/qb_px_56"
                android:layout_height="@dimen/qb_px_56"
                android:layout_marginStart="@dimen/qb_px_45"
                android:layout_marginBottom="@dimen/qb_px_30"
                android:background="@drawable/ic_mini_game_roshambo_rock_start"
                android:scaleType="centerCrop"
                android:visibility="invisible"
                app:layout_constraintBottom_toBottomOf="@id/iv_roshambo_pk_left"
                app:layout_constraintStart_toStartOf="@id/iv_roshambo_pk_left"
                tools:visibility="visible" />

        <!--右拳头-->
        <ImageView
                android:id="@+id/iv_roshambo_pk_rock_right"
                android:layout_width="@dimen/qb_px_56"
                android:layout_height="@dimen/qb_px_56"
                android:layout_marginEnd="@dimen/qb_px_45"
                android:layout_marginBottom="@dimen/qb_px_30"
                android:background="@drawable/ic_mini_game_roshambo_rock_end"
                android:scaleType="centerCrop"
                android:visibility="invisible"
                app:layout_constraintBottom_toBottomOf="@id/iv_roshambo_pk_right"
                app:layout_constraintEnd_toEndOf="@id/iv_roshambo_pk_right"
                tools:visibility="visible" />

        <!--左头像框-->
        <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginStart="@dimen/qb_px_20"
                android:layout_marginTop="@dimen/qb_px_9"
                android:clipChildren="false"
                android:gravity="center"
                app:layout_constrainedWidth="true"
                app:layout_constraintEnd_toEndOf="@+id/guideline_left"
                app:layout_constraintHorizontal_bias="0"
                app:layout_constraintStart_toStartOf="@id/iv_roshambo_pk_left"
                app:layout_constraintTop_toTopOf="@id/iv_roshambo_pk_left">

            <club.jinmei.mgvoice.core.widget.AvatarBoxView
                    android:id="@+id/iv_roshambo_left_avatar"
                    android:layout_width="@dimen/qb_px_25"
                    android:layout_height="@dimen/qb_px_25"
                    android:clipChildren="false" />

            <club.jinmei.mgvoice.core.widget.BaseCoreTextView
                    android:id="@+id/iv_roshambo_left_name"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginStart="@dimen/qb_px_8"
                    android:ellipsize="end"
                    android:gravity="start|center_vertical"
                    android:maxLines="1"
                    android:textColor="@color/white"
                    tools:text="1mohammed mohammed mohammed mohammed2" />
        </LinearLayout>

        <!--右头像框-->
        <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="@dimen/qb_px_9"
                android:layout_marginEnd="@dimen/qb_px_20"
                android:clipChildren="false"
                android:gravity="center"
                app:layout_constrainedWidth="true"
                app:layout_constraintEnd_toEndOf="@id/iv_roshambo_pk_right"
                app:layout_constraintHorizontal_bias="1"
                app:layout_constraintStart_toStartOf="@id/guideline_right"
                app:layout_constraintTop_toTopOf="@id/iv_roshambo_pk_left">

            <club.jinmei.mgvoice.core.widget.BaseCoreTextView
                    android:id="@+id/iv_roshambo_right_name"
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:ellipsize="end"
                    android:gravity="start|center_vertical"
                    android:maxLines="1"
                    android:textColor="@color/white"
                    tools:text="3mohammed " />

            <club.jinmei.mgvoice.core.widget.AvatarBoxView
                    android:id="@+id/iv_roshambo_right_avatar"
                    android:layout_width="@dimen/qb_px_25"
                    android:layout_height="@dimen/qb_px_25"
                    android:layout_marginStart="@dimen/qb_px_8"
                    android:clipChildren="false" />
        </LinearLayout>
    </androidx.constraintlayout.widget.ConstraintLayout>

    <club.jinmei.mgvoice.m_room.minigame.roshambo.RoshamboPKResultView
            android:id="@+id/pk_roshambo_result_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:visibility="gone"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            tools:visibility="gone" />

</merge>
```

- view

```kotlin
class RoshamboPKAnimView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : BaseTouchConstraintLayout(context, attrs, defStyleAttr), CoroutineScope by MainScope() {

    val alphaArray by lazy(LazyThreadSafetyMode.NONE) { floatArrayOf(0f, 1f) }
    val scaleArray by lazy(LazyThreadSafetyMode.NONE) { floatArrayOf(0.8f, 1.5f, 0.8f) }
    val leftRotationArray by lazy(LazyThreadSafetyMode.NONE) { floatArrayOf(0f, -30f, 0F, 30F, 0F, -30f, 0F, 30F, 0F) }
    val rightRotationArray by lazy(LazyThreadSafetyMode.NONE) { floatArrayOf(0f, 30f, 0F, -30F, 0F, 30f, 0F, -30F, 0F) }
    val interpolator by lazy(LazyThreadSafetyMode.NONE) { LinearInterpolator() }

    var animatorSet = AnimatorSet()

    companion object {
        const val TAG = RoshamboHelper.TAG
        const val ANIM_ENTER_DURATION = 300L
        const val ANIM_FLIGHT_DURATION = 300L
        const val ANIM_SHAKE_DURATION = 1000L
    }

    override fun getViewId(): Int = R.layout.room_view_roshambo_pk_anim_view
    override fun isCanTouchContentOutSideDismiss(): Boolean = false

    override fun initViews() {
        super.initViews()
        pk_roshambo_result_view.setOnRoshamboPKResultViewListener(object : RoshamboPKResultView.OnRoshamboPKResultViewListener {
            override fun onDismiss(v: RoshamboPKResultView?) {
                invisible()
            }
        })
    }

    private fun setUserInfo(initiatorUser: User?, acceptorUser: User?) {
        iv_roshambo_left_avatar.showAvatarAndBox(initiatorUser, R.color.transparent_50_percent_white, ResUtils.getDimen(R.dimen.qb_px_1))
        iv_roshambo_right_avatar.showAvatarAndBox(acceptorUser, R.color.transparent_50_percent_white, ResUtils.getDimen(R.dimen.qb_px_1))

        iv_roshambo_left_name.text = initiatorUser?.name
        iv_roshambo_right_name.text = acceptorUser?.name
    }

    fun show(data: RoomRoshamboGame) {
        visible()
        cl_roshambo_pk_content.visible()
        reset()
        setUserInfo(data.initiatorUser, data.acceptUser)
        animatorSet = AnimatorSet()

        /*左进场*/
        val leftMargin = iv_roshambo_pk_left.left
        val leftWidth = leftMargin + iv_roshambo_pk_left.width.toFloat()
        val translationYArray = floatArrayOf(-leftWidth, 0F)
        val alpha = PropertyValuesHolder.ofFloat("alpha", *alphaArray)
        val translationY = PropertyValuesHolder.ofFloat("translationX", *translationYArray)
        val leftObjectAnimator = ObjectAnimator.ofPropertyValuesHolder(iv_roshambo_pk_left, alpha, translationY)
        leftObjectAnimator.duration = ANIM_ENTER_DURATION
        leftObjectAnimator.interpolator = interpolator

        /*右进场*/
        val rightMargin = width - iv_roshambo_pk_right.left
        val rightWidth = rightMargin + iv_roshambo_pk_right.width.toFloat()
        val translationYArray2 = floatArrayOf(rightWidth, 0F)
        val alpha2 = PropertyValuesHolder.ofFloat("alpha", *alphaArray)
        val translationY2 = PropertyValuesHolder.ofFloat("translationX", *translationYArray2)
        val rightObjectAnimator = ObjectAnimator.ofPropertyValuesHolder(iv_roshambo_pk_right, alpha2, translationY2)
        rightObjectAnimator.duration = ANIM_ENTER_DURATION
        rightObjectAnimator.interpolator = interpolator

        /*闪电*/
        val alphaArray3 = floatArrayOf(0.5f, 1f)
        val flightAlpha = PropertyValuesHolder.ofFloat("alpha", *alphaArray3)
        val scaleX3 = PropertyValuesHolder.ofFloat("scaleX", *scaleArray)
        val scaleY3 = PropertyValuesHolder.ofFloat("scaleY", *scaleArray)
        val flightAnimator = ObjectAnimator.ofPropertyValuesHolder(iv_roshambo_pk_flight, flightAlpha, scaleX3, scaleY3)
        flightAnimator.duration = ANIM_FLIGHT_DURATION
        flightAnimator.interpolator = interpolator
        flightAnimator.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator?) {
                super.onAnimationStart(animation)
                LogUtils.d(TAG, "flightAnimator onAnimationStart")
                iv_roshambo_pk_flight.visible()
            }

            override fun onAnimationEnd(animation: Animator?) {
                super.onAnimationEnd(animation)
                LogUtils.d(TAG, "flightAnimator onAnimationEnd")
            }
        })

        /*左拳头*/
        val leftShakeByPropertyAnim = shakeLeftAnimator(iv_roshambo_pk_rock_left, ANIM_SHAKE_DURATION)
        /*右拳头*/
        val rightShakeByPropertyAnim = shakeRightAnimator(iv_roshambo_pk_rock_right, ANIM_SHAKE_DURATION)

        /*animatorSet*/
        animatorSet.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationEnd(animation: Animator?) {
                super.onAnimationEnd(animation)
                handleAnimResult(data)
            }
        })

        animatorSet.play(leftObjectAnimator)
                .with(rightObjectAnimator)
                .before(flightAnimator)
        animatorSet.play(flightAnimator)
                .before(leftShakeByPropertyAnim)
        animatorSet.play(leftShakeByPropertyAnim)
                .with(rightShakeByPropertyAnim)
        animatorSet.start()
    }

    private fun handleAnimResult(data: RoomRoshamboGame) {
        // 挑战者在左边
        data.acceptPkData?.optionId?.apply {
            iv_roshambo_pk_rock_left.setBackgroundResource(RoshamboHelper.getGestureIcon(this, true))
        }
        // 开启者在右边
        data.initiatorPKData?.optionId?.apply {
            iv_roshambo_pk_rock_right.setBackgroundResource(RoshamboHelper.getGestureIcon(this, false))
        }
        if (listener?.onShowResult(this, data) == false) {
            cl_roshambo_pk_content.gone()
        }
        launch {
            delay(2000) // 多看2秒
            when (data.pkResult) {
                RoshamboPKResult.win -> { // 发起者胜利
                    pk_roshambo_result_view.winner(data.initiatorUser)
                    cl_roshambo_pk_content.gone()
                }
                RoshamboPKResult.loss -> { // 发起者负
                    pk_roshambo_result_view.winner(data.acceptUser)
                    cl_roshambo_pk_content.gone()
                }
                RoshamboPKResult.tied -> {
                    pk_roshambo_result_view.tie(data.initiatorUser, data.acceptUser)
                    cl_roshambo_pk_content.gone()
                }
                else -> cl_roshambo_pk_content.gone()
            }
        }
    }

    private fun shakeLeftAnimator(view: View, duration: Long): ObjectAnimator {
        view.pivotX = -(view.width / 4F)
        view.pivotY = view.height + view.height / 4F
        val valuesHolder = PropertyValuesHolder.ofFloat("rotation", *leftRotationArray)
        val animator = ObjectAnimator.ofPropertyValuesHolder(view, valuesHolder)
        animator.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator?) {
                super.onAnimationStart(animation)
                // LogUtils.d(TAG, "shakeLeft onAnimationStart $view")
                view.visible()
            }
        })
        animator.duration = duration
        animator.interpolator = interpolator
        return animator
    }

    private fun shakeRightAnimator(view: View, duration: Long): ObjectAnimator {
        view.pivotX = view.width + (view.width / 4F)
        view.pivotY = view.height + view.height / 4F

        val valuesHolder = PropertyValuesHolder.ofFloat("rotation", *rightRotationArray)
        val animator = ObjectAnimator.ofPropertyValuesHolder(view, valuesHolder)
        animator.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator?) {
                super.onAnimationStart(animation)
                // LogUtils.d(TAG, "shakeLeft onAnimationStart $view")
                view.visible()
            }
        })
        animator.duration = duration
        animator.interpolator = interpolator
        return animator
    }

    override fun onDetachedFromWindow() {
        reset()
        if (animatorSet.isStarted) {
            animatorSet.cancel()
        }
        animatorSet.removeAllListeners()
        cancel()
        super.onDetachedFromWindow()
    }

    private fun reset() {
        pk_roshambo_result_view.gone()
        if (animatorSet.isStarted) {
            animatorSet.cancel()
        }
        animatorSet.removeAllListeners()
        iv_roshambo_pk_flight.invisible()
        iv_roshambo_pk_rock_left.invisible()
        iv_roshambo_pk_rock_right.invisible()
        iv_roshambo_pk_rock_left.setBackgroundResource(R.drawable.ic_mini_game_roshambo_rock_start)
        iv_roshambo_pk_rock_right.setBackgroundResource(R.drawable.ic_mini_game_roshambo_rock_end)
    }
}
```

# ObjectAnimator ofXXX 详解

## ofFloat, ofInt

这两个函数除了类型不一样，重载函数很相似。ObjectAnimator 的 ofFloat 和 ofInt 函数用法相似

```java
ofFloat(Object target, String propertyName, float... values)
ofFloat(Object target, String xPropertyName, String yPropertyName, Path path)
ofFloat(T target, Property<T, Float> property, float... values)
ofFloat(T target, Property<T, Float> xProperty, Property<T, Float> yProperty, Path path)

ofInt(Object target, String propertyName, int... values)
ofInt(Object target, String xPropertyName, String yPropertyName,Path path)
ofInt(T target, Property<T, Integer> property, int... values)
ofInt(T target, Property<T, Integer> xProperty,Property<T, Integer> yProperty, Path path)
```

### ofFloat(Object target, String propertyName, float… values)

1. 第一个参数传入目标对象
2. 第二个参数传入要改变的属性（配合 setXX 函数，关于如何定义 propertyName 前面的文章中已经说明）
3. 第三个参数是个渐变属性，可以传多个值。

```java
ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(mTextView, "rotation", 0, 270);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

实现 TextView 的旋转：

![h4zss](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/h4zss.gif)

### ofFloat(Object target, String xPropertyName, String yPropertyName, Path path) (API21)

可以同时操纵两个参数变化，实现动画。**需要 API21**

**参数说明：**

1. target：动画目标对象,这个目标对象有些特别，沿着一条路径 Path 能够使用两个属性，路径 Path 动画在二维空间中移动，由动画坐标（x,y）决定效果，（重要）所以对象必须有两个函数一个是 setNameX(),另外一个是 setNameY(),类似 view 的 setTranslationX，SetTranslationY，当然也可以自己定义属性，同时对应的 xPropertyName 和 yPropertyName 分别为 translationX 和 translationY；
2. xPropertyName：Path 对应的 X 轴方向的属性值，对应 Path 的 x；
3. yPropertyName：Path 对应的 Y 轴方向的属性值，对应 Path 的 y；
4. path: 动画路径。

```java
Path path = new Path();
path.moveTo(0,0);
path.lineTo(50,50);
path.lineTo(100,20);
path.lineTo(900,400);
path.lineTo(500,1000);
ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(mTextView, "translationX","translationY",path );
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

> translationX 变化（0→50→100→900→500），translationY 变化（0→50→20→400→1000）

TextView 在 X 轴和 Y 轴方向上移动：

![5003x](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/5003x.gif)

上面的示例代码利用了 translationX 和 translationX 属性，这两个属性是 View 的自带的属性，同时也可以是两个互不相干的属性，可以实现类似组合动画的效果。

```java
Path path = new Path();
path.moveTo(0,0);
path.lineTo(50,1);
path.lineTo(100,2);
path.lineTo(900,0.5f);
path.lineTo(500,1);
ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(mTextView, "translationX","scaleX",path );
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![mdyel](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/mdyel.gif)

### ofFloat 自定义 Property

ofFloat (T target, Property<T, Float> property, float… values)

**参数说明：**

1. target: 动画目标对象
2. property：动画作用的属性，有了这个属性对象，就可以不用写属性对应的字段值，类似不用写 "scale"
3. values：动画取值，如果是一个值则将 target 开始的状态作为开始值，将 values 的一个值，作为结束值，如果是两个值则第一个为动画开始值，第二个为动画结束值。

> 这个函数用到了 `Property` 属性，是 API14 添加的方法，不知道大家注意到没有，每次使用属性动画，我们都需要记得目标对象的 setXXX 函数后面的相应字符串，虽然不复杂但有时确实会记不清，需要再次确认，而这个带有 Property 的函数就大大简化了这个过程。

Android 为我们提供了简单的常量对象来实现旋转动画：<br />`ObjectAnimator.ofFloat(mTextView, View.ROTATION, 0,30)`;<br />这里的 `View.ROTATION` 就是个 Property 对象，可以简单地实现旋转的属性动画。<br />View.ROTATION 源码：

```java
public static final Property<View, Float> ROTATION = new FloatProperty<View>("rotation") {
    @Override
    public void setValue(View object, float value) {
        object.setRotation(value);
    }

    @Override
    public Float get(View object) {
        return object.getRotation();
    }
};
```

还有其他 View 中具有和 View.ROTATION 作用的常量还有如下：

```java
View.ROTATION;
View.ROTATION_X;
View.ROTATION_Y;
View.TRANSLATION_X;
View.TRANSLATION_Y;
View.SCALE_X;
View.SCALE_Y;
View.ALPHA;
```

旋转示例：

```java
ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(mTextView, View.ROTATION, 0,270);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![i9k6t](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/i9k6t.gif)

### ofFloat Property

Float (T target, Property<T, Float> xProperty, Property<T, Float> yProperty, Path path)

和前面的 path 一样，xProperty 的变化由 path 的 x 控制；yProperty 的变化由 path 的 y 控制。

### ofInt 的同 ofFloat

## ofArgb 颜色属性动画

### ofArgb(Object target, String propertyName, int… values) (API21)

对颜色属性进行动画。

**参数说明：**

1. target: 动画作用对象
2. propertyName: 动画作用的属性
3. values：动画使用的可变参数

```java
ObjectAnimator objectAnimator = ObjectAnimator.ofArgb(mTextView,"backgroundColor", Color.RED, Color.GREEN);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![lfuak](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/lfuak.gif)

### ofArgb (API21) 自定义 Property

ofArgb (T target, Property<T, Integer> property, int… values)

用到了 Property 属性，但是 View 中没有类似 `ROTATION` 属性的对颜色属性的简写，可以**自定义 Property**，下面的例子只是数值的渐变，如果真的需要颜色渐变，需要设置颜色估值器：

```java
public static class MyProperty extends Property<TextView,Integer>{
    public MyProperty(String name) {
        super(Integer.class, name);
    }

    @Override
    public Integer get(TextView object) {
        Drawable drawable =  object.getBackground();
        if (drawable instanceof ColorDrawable){
            return ((ColorDrawable) drawable).getColor();
        }
        return Color.YELLOW;
    }

    @Override
    public void set(TextView object, Integer value) {
        object.setBackgroundColor(value);
    }
}
```

使用：

```java
MyProperty property = new MyProperty("background");
ObjectAnimator objectAnimator = ObjectAnimator.ofArgb(mTextView,property, Color.RED, Color.GREEN);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![x35up](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/x35up.gif)

## ofMultiFloat, ofMultiInt 不常用

被称为多参数布局，用的不太多，下面简单介绍：

```java
ofMultiFloat(Object target, String propertyName,float[][] values)
ofMultiFloat(Object target, String propertyName, Path path)
ofMultiFloat(Object target, String propertyName,
TypeConverter<T, float[]> converter, TypeEvaluator evaluator, T… values)
ofMultiInt(Object target, String propertyName, int[][] values)
ofMultiInt(Object target, String propertyName, Path path)
ofMultiInt(Object target, String propertyName,
TypeConverter<T, int[]> converter, TypeEvaluator evaluator, T… values)
```

### ofMultiInt (API21)

`OfMultiInt (Object target, String propertyName, int[][] values)`

**参数说明：**

1. propertyName: 进行动画的属性名
2. `values[][]`: 二维数组，至少两组数据，每个 `values[]` 中存放一个 setter 函数中所有的参数，然后从 `values[0]` 中取值为动画开始值，从 `values[最后一组]` 中取值为动画最后的值，如果之间还有值，就作为过渡，从 `values[0]-values[1]-…`

> setXXX 有 n 个参数，就是 n 维数组；起始 values 和结束 values 是固定的；需要自定义 view 添加 getter，setter 函数。

示例：

```java
public class ViewDemo24 extends android.support.v7.widget.AppCompatTextView {
    public ViewDemo24(Context context) {
        this(context,null,0);
    }

    public ViewDemo24(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs,0);
    }

    public ViewDemo24(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
    }

    public void setMulText(int data1,int data2){
        String data = "";
        data = data + data1 + data2;
        setText(data);
        LogUtil.i("data1:" + data1 + "，data2:" + data2);
    }

    public String getMulText(){
        return getText().toString();
    }
}
```

使用：

```java
ObjectAnimator objectAnimator = ObjectAnimator.ofMultiInt(viewDemo24,"mulText",data);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

结果：

```
I: data1:1data2:9
I: data1:1data2:9
I: data1:2data2:10
I: data1:2data2:10
I: data1:3data2:11
I: data1:3data2:11
I: data1:4data2:12
```

过程分析：

`setMulText` 有 2 个参数，对应了二维数组，从 `data[0][0]=1,9` 开始，到 `data[1][1]=4,12`，这 2 个是固定的，如果中间有过渡值，那么就慢慢过渡过来。如 data 第 1 个参数就从 `1~4`，第 2 个参数就从 `9~12`.

若改成下面，data 第 1 个参数就没有渐变了，直接 1 最后到 2。

```kotlin
// val data = arrayOf(intArrayOf(1, 9), intArrayOf(2, 12))
val objectAnimator = ObjectAnimator.ofMultiInt(tv_first, "mulText", data)
objectAnimator.duration = 3000
objectAnimator.interpolator = LinearInterpolator()
objectAnimator.start()
```

结果：

```
I: data1:1，data2:9
I: data1:1，data2:9
I: data1:1，data2:10
I: data1:1，data2:10
I: data1:1，data2:11
I: data1:1，data2:11
I: data1:2，data2:12
```

### ofMultiInt(Object target, String propertyName, Path path) （API21）

用法和上面的函数类似，只不过把二维数组换成了 Path，并且 setter 函数只能接收两个 int 参数，从 path 中取动画开始值和结束值（从 path.moveTo 中取动画开始值，后面的值为动画结束值）。

```java
Path path = new Path();
path.moveTo(0f, 6f);
path.lineTo(5f, 9f);
ObjectAnimator objectAnimator = ObjectAnimator.ofMultiInt(viewDemo24,"mulText",path);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

结果：

```
I: data1:0，data2:6
I: data1:0，data2:6
I: data1:1，data2:6
I: data1:1，data2:6
I: data1:1，data2:7
I: data1:1，data2:7
I: data1:2，data2:7
I: data1:2，data2:7
I: data1:3，data2:8
I: data1:3，data2:8
I: data1:4，data2:8
I: data1:4，data2:8
I: data1:4，data2:9
I: data1:4，data2:9
I: data1:5，data2:9
```

### ofMultiInt() TypeConverter (API21)

`ofMultiInt (Object target, String propertyName, TypeConverter<T, int[]> converter, TypeEvaluator evaluator, T… values)` (API 21)

**参数说明**

1. propertyName: 进行动画的属性名
2. converter 类型转换器
3. evaluator 估值器
4. values，同上面的 values

> Converter: 把 T 类型转换成需要的 `int[]` 数组，然后利用估值器计算 T 得到 ObjectAnimator 需要的类型。

用到的自定义 T 类型：

```java
public static class Point {
    int x;
    int y;

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
```

自定义类型转换，把上面自定义的 Point 类型转换成 `int[]` 数组：

```java
@RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
public static class IntConverter extends TypeConverter <Point ,int[]>{
    public IntConverter(Class<Point> fromClass, Class<int[]> toClass) {
        super(fromClass, toClass);
    }

    @Override
    public int[] convert(Point value) {
        int[] intarr = {value.getX(),value.getY()};
        return intarr;
    }
}
```

自定义估值器：

```java
public static class PointEvaluator implements TypeEvaluator<Point> {
    @Override
    public Point evaluate(float fraction, Point startValue, Point endValue) {
        int startxInt = startValue.getX() ;
        int endxInt = endValue.getX();
        int curx = (int) (startxInt + fraction * (endxInt - startxInt));

        int startyInt = startValue.getY() ;
        int endyInt = endValue.getY();
        int cury = (int) (startyInt + fraction * (endyInt - startyInt));
        Point point = new Point();
        point.setX(curx);
        point.setY(cury);
        return point;
    }
}
```

代码中使用：

```java
IntConverter intConverter = new IntConverter(Point.class,int[].class);
PointEvaluator pointEvaluator = new PointEvaluator();
Point point1 = new Point();
point1.setX(1);
point1.setY(5);
Point point2 = new Point();
point2.setX(4);
point2.setY(9);
ObjectAnimator objectAnimator = ObjectAnimator.ofMultiInt(viewDemo24,"mulText",intConverter,pointEvaluator,point1,point2);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

结果：

```
I: data1:1，data2:5
I: data1:1，data2:5
I: data1:1，data2:6
I: data1:1，data2:6
I: data1:2，data2:6
I: data1:2，data2:6
I: data1:2，data2:7
I: data1:2，data2:7
I: data1:3，data2:7
I: data1:3，data2:7
I: data1:3，data2:7
I: data1:3，data2:7
I: data1:3，data2:8
I: data1:3，data2:8
I: data1:4，data2:9
```

## ofObject

对对象进行动画：

```java
ofObject(Object target, String propertyName, @Nullable TypeConverter<PointF, ?> converter, Path path)

ofObject(Object target, String propertyName, TypeEvaluator evaluator, Object... values)

ofObject(T target, Property<T, P> property,TypeConverter<V, P> converter, TypeEvaluator<V> evaluator, V... values)

ofObject(T target, @NonNull Property<T, V> property, @Nullable TypeConverter<PointF, V> converter, Path path)

ofObject(T target, Property<T, V> property, TypeEvaluator<V> evaluator, V... values)
```

> 上面讲解了 ofInt ,ofFloat,ofMultiInt,ofMultiFloat 等函数，仔细观察上面的 ofObject 函数，可以分析得到 ofObject 把类型泛型化了，每个函数都提供了 TypeEvaluator 供 ObjectAnimator 识别参数，所以 ofObject 的用法和 ofInt，ofFloat 相同。

### ofObject() TypeEvaluator

`ofObject(T target, Property<T, V> property, TypeEvaluator evaluator, V… values)`

**参数说明：**

1. target: 动画目标对象
2. property: 自定义 property，内部调用 getter，setter 函数，不用再指定 propertyName
3. evaluator: 估值器，生成动画所需对象
4. values: 动画传入参数

利用 ofObject 实现 view 的移动。

自定义类：

```java
public static class Point {
    int x;
    int y;

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
```

自定义 property：

```java
public static class MyProperty2 extends Property<TextView,Point>{
    public MyProperty2(String name) {
        super(Point.class, name);
    }

    @Override
    public Point get(TextView object) {
        Point point = new Point();
        point.setX((int) object.getTranslationX());
        point.setY((int) object.getTranslationY());
        return  point;
    }

    @Override
    public void set(TextView object, Point value) {
        object.setTranslationX(value.getX());
        object.setTranslationY(value.getY());
    }
}
```

自定义 Evaluator 估值器：

```java
public static class PointEvaluator implements TypeEvaluator<Point> {

    @Override
    public Point evaluate(float fraction, Point startValue, Point endValue) {
        int startxInt = startValue.getX() ;
        int endxInt = endValue.getX();
        int curx = (int) (startxInt + fraction * (endxInt - startxInt));

        int startyInt = startValue.getY() ;
        int endyInt = endValue.getY();
        int cury = (int) (startyInt + fraction * (endyInt - startyInt));
        Point point = new Point();
        point.setX(curx);
        point.setY(cury);
        return point;
    }
}
```

使用：

```java
MyProperty2 property2 = new MyProperty2("tran");//參數只是为了标识无具体意义
PointEvaluator evaluator = new PointEvaluator();
Point point1 = new Point();
point1.setY(0);
point1.setX(100);

Point point2 = new Point();
point2.setY(700);
point2.setX(1000);
ObjectAnimator objectAnimator = ObjectAnimator.ofObject(mTextView,property2,evaluator,point1,point2);
objectAnimator.setDuration(3000);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.setRepeatCount(-1);
objectAnimator.start();
```

![sxk6v](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/sxk6v.gif)

## ObjectAnimator.ofPropertyValuesHolder

### ofPropertyValuesHolder(Object target, PropertyValuesHolder… values) 同一个动画中改变多个属性

**参数说明：**

1. target：动画目标对象
2. values:PropertyValuesHolder 动画可变参数。

> 同一个动画中改变多个属性，可以替换 AnimatorSet

案例：

```java
PropertyValuesHolder holder1 = PropertyValuesHolder.ofFloat("scaleX", 1,2);
PropertyValuesHolder holder2 = PropertyValuesHolder.ofFloat("scaleY",0, 1);
PropertyValuesHolder holder3 = PropertyValuesHolder.ofFloat("alpha", 0.5f,1.0f);

ObjectAnimator objectAnimator = ObjectAnimator.ofPropertyValuesHolder(mTextView, holder1, holder2, holder3);
objectAnimator.setDuration(3000);
objectAnimator.setRepeatCount(-1);
objectAnimator.setInterpolator(new LinearInterpolator());
objectAnimator.start();
```

![h519v](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/h519v.gif)

### PropertyValuesHolder

- `PropertyValuesHolder.ofInt`
- `PropertyValuesHolder.ofFloat`
- `PropertyValuesHolder.ofObject`
- `PropertyValuesHolder.ofMultiInt`
- `PropertyValuesHolder.ofMultiFloat`
- `PropertyValuesHolder.ofKeyframes`
- `PropertyValuesHolder.ofKeyframe` 把同一个属性拆分

```java
// 在 0% 处开始
Keyframe keyframe1 = Keyframe.ofFloat(0, 0);
// 时间经过 50% 的时候，动画完成度 100%
Keyframe keyframe2 = Keyframe.ofFloat(0.5f, 100);
// 时间见过 100% 的时候，动画完成度倒退到 80%，即反弹 20%
Keyframe keyframe3 = Keyframe.ofFloat(1, 80);
PropertyValuesHolder holder = PropertyValuesHolder.ofKeyframe("progress", keyframe1, keyframe2, keyframe3);

ObjectAnimator animator = ObjectAnimator.ofPropertyValuesHolder(view, holder);
animator.start();
```

通过设置 Keyframe （关键帧），把同一个动画属性拆分成多个阶段。例如，你可以让一个进度增加到 100% 后再「反弹」回来。

![xqflf](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/xqflf.gif)
