---
date_created: Thursday, February 29th 2016, 10:50:50 pm
date_updated: Monday, January 27th 2025, 10:25:35 pm
title: AnimatorSet
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
date updated: 星期一, 一月 6日 2025, 9:54:27 晚上
image-auto-upload: true
feed: show
format: list
aliases: [AnimatorSet]
linter-yaml-title-alias: AnimatorSet
---

# AnimatorSet

## AnimatorSet 概述

ofPropertyValuesHolder 和 ObjectAnimator 的 ofxx 函数可以实现一个动画改变多个属性；但这些都是在一个动画中，所有的动画设置都是共用的。有时也需要能够让多个动画相互配合的运行；AnimatorSet 就可以实现这个功能（其实我们也可以为每个动画设置监听，然后执行下一个动画，但是操作比较繁琐），AnimatorSet 可以实现复杂的组合动画，既可以同时对多个对象做动画并控制执行顺序，也可以控制单个对象的动画执行顺序。

> AnimatorSet 可以指定一组动画的执行顺序，让它们可以一起执行，顺序执行，延迟执行。

### AnimatorSet 的生成

代码直接利用 `AnimatorSet()`

如果是 XML 定义 AnimatorSet 利用 `AnimatorInflater.loadAnimator()` 加载

> AnimatorSet 可以作用于 ObjectAnimator 和 ValueAnimator，但通常 ObjectAnimator 用的比较多

### AnimatorSet 和 ObjectAnimator 中重叠的函数

- 优先 AnimatorSet，同时设置的话，AnimatorSet 会覆盖 ObjectAnimator

> 如果没有设置就使用子动画自己的，如果 AnimatorSet 设置了就使用 AnimatorSet 设置的属性。

```java
setDuration (long duration)：设置每个内部子动画的时长，默认每个子动画使用自己默认的时长，如果AnimatorSet设置了时长，子动画将继承这个时长，而子动画自己设置的duration将失效。
setInterpolator (TimeInterpolator interpolator)，设置之后内部子动画的插值器都是这个
setTarget(Object target)，设置之后所有内部子动画都作用于相同的target目标对象
```

- 不会覆盖子动画

```
setStartDelay(long startDelay)函数是个特例，它不会覆盖子动画开始延迟，只对AnimatorSet的开始时间起作用，所以它会延后AnimatorSet激活整体动画的开始时间。
```

## AnimatorSet 函数

### 构造函数

- public AnimatorSet()

### 两种添加动画到 AnimatorSet 的方法

1. 一种是利用 `playTogether()` 或者 `playSequentially()`，可以一次添加所有的动画到 AnimatorSet 中，
2. 一种是利用 `play(Animator)` 构建 Builder 对象，然后利用 Builder 提供的方法，一个一个的添加动画，并设置各个动画间执行顺序的依赖关系

- public void playTogether(Animator… items)
- public void playTogether(Collection items)
- public void playSequentially(Animator… items)
- public void playSequentially(List items)

### AnimatorSet 的其他函数

```java
cancle() 取消动画，会取消AnimatorSet中的所有子动画。
end() 结束动画，会结束AnimatorSet中的所有子动画。
getChildAnimations() 获取所有受AnimatorSet控制的动画
isStarted() AnimationSet动画是否开始了，true开始
isRunning() AnimationSet开始之后（isStarted = true），内部是否有子动画正在执行，有动画执行返回true
pause() 暂停动画，
resume() 恢复暂停的动画
play(Animator anim) 获取Builder对象
```

## playTogether 和 playSequentially

注意：

1. playTogether 和 playSequentially 只负责激活控件动画，后续的动画还是由 ObjectAnimator 自己控制。
2. playSequentially 是一个动画执行完后执行下一个动画，但如果前一个动画是无限循环，下一个动画永远不会执行。

### playTogether 多个动画同时执行

多个动画同时执行，可以是对一个对象执行的多个动画，也可以是对多个对象的多个动画。

#### 多个动画作用于一个对象

```java
ObjectAnimator objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0, 250);

AnimatorSet animatorSet = new AnimatorSet();
animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4);
animatorSet.setDuration(3000);
animatorSet.start();
```

![3e4tx](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/3e4tx.gif)

#### 多个动画作用于同一个对象同一个属性

多个动画同时对一个属性，会按照 playTogether 添加的最后一个动画覆盖前面操作相同属性的动画，也可能没有覆盖，但确实是最后一个添加的动画起了作用。

```java
ObjectAnimator objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0, 250);
ObjectAnimator objectAnimator5 = ObjectAnimator.ofFloat(mTextView, "translationY", 200, 450);
ObjectAnimator objectAnimator6 = ObjectAnimator.ofFloat(mTextView, "translationY", 300, 600);

AnimatorSet animatorSet = new AnimatorSet();
animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4,objectAnimator5,objectAnimator6);
animatorSet.setDuration(3000);
animatorSet.start();
```

- `animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4,objectAnimator5,objectAnimator6)`;<br />
最终会按照 `objectAnimator6` 的效果进行展示。

![371p6](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/371p6.gif)

- `animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator6,objectAnimator5,objectAnimator4)`;<br />
最终会按照 objectAnimator4 的效果进行展示。
![9m6hn](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/9m6hn.gif)

#### 多个动画作用于多个对象

```java
ObjectAnimator objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0, 250);

ObjectAnimator objectAnimator7 = ObjectAnimator.ofArgb(mTextView2, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator8 = ObjectAnimator.ofFloat(mTextView2, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator9 = ObjectAnimator.ofFloat(mTextView2, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator10 = ObjectAnimator.ofFloat(mTextView2, "translationY", 0, 250);

ObjectAnimator objectAnimator11 = ObjectAnimator.ofArgb(mTextView3, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator12 = ObjectAnimator.ofFloat(mTextView3, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator13 = ObjectAnimator.ofFloat(mTextView3, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator14 = ObjectAnimator.ofFloat(mTextView3, "translationY", 0, 250);

AnimatorSet animatorSet = new AnimatorSet();
animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4
,objectAnimator7,objectAnimator8,objectAnimator9,objectAnimator10,objectAnimator11,objectAnimator12,objectAnimator13,objectAnimator14);
animatorSet.setDuration(3000);
animatorSet.start();
```

![p6lsi](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/p6lsi.gif)

### playSequentially 动画顺序执行

顺序播放动画：

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f)
val objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0f, 250f)

val objectAnimator7 = ObjectAnimator.ofArgb(mTextView2, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator8 = ObjectAnimator.ofFloat(mTextView2, "scaleX", 0.1f, 1.2f)
val objectAnimator9 = ObjectAnimator.ofFloat(mTextView2, "scaleY", 0.5f, 1.0f)
val objectAnimator10 = ObjectAnimator.ofFloat(mTextView2, "translationY", 0f, 250f)

val objectAnimator11 = ObjectAnimator.ofArgb(mTextView3, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator12 = ObjectAnimator.ofFloat(mTextView3, "scaleX", 0.1f, 1.2f)
val objectAnimator13 = ObjectAnimator.ofFloat(mTextView3, "scaleY", 0.5f, 1.0f)
val objectAnimator14 = ObjectAnimator.ofFloat(mTextView3, "translationY", 0f, 250f)
val animatorSet = AnimatorSet()
animatorSet.playSequentially(objectAnimator1, objectAnimator2, objectAnimator3, objectAnimator4, objectAnimator7, objectAnimator8, objectAnimator9, objectAnimator10, objectAnimator11, objectAnimator12, objectAnimator13, objectAnimator14)
animatorSet.duration = 1000
animatorSet.start()
```

![0zas0](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/0zas0.gif)

### 如何实现动画的循环播放

AnimatorSet 中没有设置动画执行次数的函数，所以无法利用 AnimatorSet 设置动画循环播放， playSequentially 一个动画执行完后执行另外一个动画，如果前一个动画是无限循环，后一个动画不会执行，所以也无法实现循环播放动画，所以只能利用 playTogether 播放动画时每个动画设置无限循环：

```java
ObjectAnimator objectAnimator5 = ObjectAnimator.ofFloat(mTextView, "translationY", 200, 450);
ObjectAnimator objectAnimator6 = ObjectAnimator.ofFloat(mTextView, "translationY", 300, 600);
ObjectAnimator objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0, 250);

ObjectAnimator objectAnimator7 = ObjectAnimator.ofArgb(mTextView2, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator8 = ObjectAnimator.ofFloat(mTextView2, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator9 = ObjectAnimator.ofFloat(mTextView2, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator10 = ObjectAnimator.ofFloat(mTextView2, "translationY", 0, 250);

ObjectAnimator objectAnimator11 = ObjectAnimator.ofArgb(mTextView3, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator12 = ObjectAnimator.ofFloat(mTextView3, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator13 = ObjectAnimator.ofFloat(mTextView3, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator14 = ObjectAnimator.ofFloat(mTextView3, "translationY", 0, 250);
objectAnimator1.setRepeatCount(-1);
objectAnimator2.setRepeatCount(-1);
objectAnimator3.setRepeatCount(-1);
objectAnimator4.setRepeatCount(-1);
objectAnimator5.setRepeatCount(-1);
objectAnimator6.setRepeatCount(-1);
objectAnimator7.setRepeatCount(-1);
objectAnimator8.setRepeatCount(-1);
objectAnimator9.setRepeatCount(-1);
objectAnimator10.setRepeatCount(-1);
objectAnimator11.setRepeatCount(-1);
objectAnimator12.setRepeatCount(-1);
objectAnimator13.setRepeatCount(-1);
objectAnimator14.setRepeatCount(-1);

AnimatorSet animatorSet = new AnimatorSet();
animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4
,objectAnimator7,objectAnimator8,objectAnimator9,objectAnimator10,objectAnimator11,objectAnimator12,objectAnimator13,objectAnimator14);
//  animatorSet.play()
animatorSet.setDuration(3000);
animatorSet.start();
```

![6bfbr](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/6bfbr.gif)

如果利用 playSequentially 并且前一个动画是无限循环动画：

![v58d4](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/v58d4.gif)

最终实现循环动画的方法为，每个内部子动画设置为无限循环

## 利用 play(Animator) 构建 Builder 对象

**Builder play(Animator anim)；生成 builder 对象，Builder 能够控制动画的执行顺序和相互之间的依赖。**<br />通过 AnimatorSet 中的 `play` 方法可以获取 `AnimatorSet.Builder` 对象，通过 Builder 内部的函数添加动画到 AnimatorSet 中，后续的所有动画都是以 play 传入的动画为标准进行相应操作。

### Builder 的函数

1. public Builder with(Animator anim) 和动画 (anim) 一起执行<br />A.with(B)  A 和 B 一起执行
2. public Builder before(Animator anim) 先执行自己的动画再执行 anim<br />A.before(B) 先执行 A，再执行 B
3. public Builder after(Animator anim)	先执行 anim 后再执行自己的动画<br />A.after(B) 先执行 B，再执行 A
4. public Builder after(long delay)	延迟 n 毫秒之后执行动画

### public Builder with(Animator anim)	和动画 (anim) 一起执行

```java
ObjectAnimator objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator3 = ObjectAnimator.ofFloat(mTextView, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator4 = ObjectAnimator.ofFloat(mTextView, "translationY", 0, 250);

ObjectAnimator objectAnimator7 = ObjectAnimator.ofArgb(mTextView2, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator8 = ObjectAnimator.ofFloat(mTextView2, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator9 = ObjectAnimator.ofFloat(mTextView2, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator10 = ObjectAnimator.ofFloat(mTextView2, "translationY", 0, 250);

ObjectAnimator objectAnimator11 = ObjectAnimator.ofArgb(mTextView3, "backgroundColor", Color.WHITE, Color.GREEN);
ObjectAnimator objectAnimator12 = ObjectAnimator.ofFloat(mTextView3, "scaleX", 0.1f, 1.2f);
ObjectAnimator objectAnimator13 = ObjectAnimator.ofFloat(mTextView3, "scaleY", 0.5f, 1.0f);
ObjectAnimator objectAnimator14 = ObjectAnimator.ofFloat(mTextView3, "translationY", 0, 250);

AnimatorSet animatorSet = new AnimatorSet();
animatorSet.play(objectAnimator1).with(objectAnimator7).with(objectAnimator11);
animatorSet.setDuration(3000);
animatorSet.start();
```

三个 view 同时执行变色动画：

![cq47w](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/cq47w.gif)

### public Builder before(Animator anim) 先执行自己的动画再执行 anim

```java
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).before(objectAnimator2)
animatorSet.duration = 3000
animatorSet.start()
```

第一个 view 先执行变色操作再执行 X 轴缩放操作：

![em3cg](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/em3cg.gif)

### public Builder after(Animator anim)	先执行 anim 后再执行自己的动画

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).after(objectAnimator2)
animatorSet.duration = 3000
animatorSet.start()
```

第一个 view 先执行 X 轴缩放动画，再执行变色操作。

![a8i1t](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/a8i1t.gif)

### public Builder after(long delay)  延迟 n 毫秒之后执行动画 (还有疑问)

```java
AnimatorSet animatorSet = new AnimatorSet();
animatorSet.play(objectAnimator1).after(objectAnimator2).after(10000);
animatorSet.setDuration(3000);
animatorSet.start();
```

> 如果设置过 after 延迟执行之后设置 setDuration，after 延迟会被 duration 的时间覆盖，不会产生延迟；所以上面 after(10000) 的没有任何效果

```java
animatorSet.play(objectAnimator1).after(objectAnimator2).after(10000);
// animatorSet.setDuration(3000);
animatorSet.start();
```

> 延迟是对 play 函数中的动画来说的，调用了 after（非延迟）之后，after（非延迟）中的动画是不受 after 延迟时间影响的。

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).after(3000).after(objectAnimator2)
//  animatorSet.play(objectAnimator1).after(objectAnimator2).after(3000) // 效果和上面一样，作用于play
//            animatorSet.duration = 3000
animatorSet.start()
```

效果：先 scaleX，等 3 秒后，背景变化

## AnimatorSet Builder 的操作方式，每次 play，或者链式操作

AnimatorSet 的 play 函数和 Builder 的 with，before，after 函数都返回 Builder 对象实例，所以我们可每次通过 play 获取 Builder 进行动画操作，也可以利用 Builder 函数返回 Builder 对象的特性进行链式操作，两种操作方式有什么不同呢？

### AnimatorSet 的 play 方法产生的 Builder 对象

```java
public Builder play(Animator anim) {
    if (anim != null) {
        return new Builder(anim);
    }
    return null;
}
```

每次调用 play 方法都会产生一个新的 Builder 对象，这个对象约束内部动画的执行顺序。而且重要的一点是**play() 方法是唯一一种获取 Builder 对象的方式**，后续所有的动画执行都以 play 方法中传入的动画为基准。

```java
AnimatorSet s = new AnimatorSet();
s.play(anim1).with(anim2);
s.play(anim2).before(anim3);
s.play(anim4).after(anim3);
```

动画 anim1 和 anim2 有关系，anim2 和 anim3 有关系，anim3 和 anim4 有关系。anim1 和 anim2 将同时执行，anim2 先于 anim3 执行，anim3 先于 anim4 执行，所以最终的执行顺序为 anim1 和 anim2 同时开始执行，anim2 执行完后开始执行 anim3,anim3 执行完后开始执行 anim4.

代码示例：

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)

val objectAnimator7 = ObjectAnimator.ofArgb(mTextView2, "backgroundColor", Color.WHITE, Color.GREEN)

val objectAnimator11 = ObjectAnimator.ofArgb(mTextView3, "backgroundColor", Color.WHITE, Color.GREEN)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).before(objectAnimator2);
animatorSet.play(objectAnimator1).with(objectAnimator7);
animatorSet.play(objectAnimator7).after(objectAnimator11);
animatorSet.duration = 3000;
animatorSet.start();
```

结果：动画会先执行 objectAnimator11(gif 中的第三个 view 变背景)，然后 objectAnimator1(gif 中的第一个 view 变背景) 和 objectAnimator7（第二个 view 变背景）同时执行，最后执行 objectAnimator2（缩放）；

![330pq](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/330pq.gif)

### Builder with before after 函数返回 Builder 对象，链式操作动画

```java
public Builder with(Animator anim) {
    Node node = getNodeForAnimation(anim);
    mCurrentNode.addSibling(node);
    return this;
}
public Builder before(Animator anim) {
    Node node = getNodeForAnimation(anim);
    mCurrentNode.addChild(node);
    return this;
}
public Builder after(Animator anim) {
    Node node = getNodeForAnimation(anim);
    mCurrentNode.addParent(node);
    return this;
}
```

play 之后的链式调用不会产生新的 Builder 对象，会把传入的动画添加到 play 函数产生的 Builder 对象的 node 列表中等待执行。<br />所以 with before after 函数被调用之后链式操作动画是操作同一个 Builder 对象内部的 Node 链，所以都是以 play 函数传入的动画为基准。<br />play(a1).before(a2).before(a3) a2,a3 动画都是以 a1 动画为基准，a1 动画执行结束之后 a2,a3 将同时执行，a1 动画和 a2,a3 有关系，但是 a2,a3 之间是没有关系的。

#### 案例 1

```java
animatorSet.play(objectAnimator1).before(objectAnimator2).after(objectAnimator4).before(objectAnimator3).after(objectAnimator14).after(objectAnimator11);
animatorSet.setDuration(3000);
animatorSet.start();
```

其中 objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4 操作左边第一个 view。<br />objectAnimator7 操作第二个 view，<br />objectAnimator11，objectAnimator12 操作第三个 view。<br />上面的代码会同时执行 objectAnimator4,objectAnimator11,objectAnimator14,然后执行 objectAnimator1，再执行 objectAnimator2 和 objectAnimator3

![sf4ac](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/sf4ac.gif)

#### 案例 2

```java
AnimatorSet animatorSet = new AnimatorSet();
animatorSet.play(objectAnimator1).before(objectAnimator2).before(objectAnimator3).before(objectAnimator4).with(objectAnimator7).with(objectAnimator11).after(objectAnimator12);
animatorSet.setDuration(3000);
animatorSet.start();
```

其中 objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4 操作左边第一个 view。<br />objectAnimator7 操作第二个 view，<br />objectAnimator11，objectAnimator12 操作第三个 view。<br />结果：objectAnimator12 先执行动画，接着 objectAnimator1，objectAnimator7，objectAnimator11 动画会同时执行，objectAnimator1 执行完之后 objectAnimator2,objectAnimator3,objectAnimator4 动画会同时执行。

![iaizi](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/iaizi.gif)

---

链式调用动画执行顺序总结如下：

> Builder 链式调用中会先执行 after 函数中的动画（有多个同时执行），然后执行 play 和 with 函数（有多个同时执行）中的动画，最后执行 before 函数中的动画（有多个同时执行）；with/before/after 都是相对于 play 来说的。

## AnimatorSet 动画监听

> 调用 cancel，会先调用 onAnimationCancel，然后 onAnimationEnd

```java
//如果不想实现那么多方法，可以利用AnimatorListenerAdapter代替AnimatorListener
animatorSet.addListener(new Animator.AnimatorListener() {
    @Override
    public void onAnimationStart(Animator animation) {
        
    }

    @Override
    public void onAnimationEnd(Animator animation) {

    }

    @Override
    public void onAnimationCancel(Animator animation) {

    }

    @Override
    public void onAnimationRepeat(Animator animation) {

    }
});

//需要api19
animatorSet.addPauseListener(new Animator.AnimatorPauseListener() {
    @Override
    public void onAnimationPause(Animator animation) {
        
    }

    @Override
    public void onAnimationResume(Animator animation) {

    }
});
```

由于内部主要使用 ObjectAnimator 所以动画监听显得不那么重要。

## AnimationSet xml 文件实现

```xml
<set android:ordering="sequentially">
    <set>
        <objectAnimator
            android:propertyName="x"
            android:duration="500"
            android:valueTo="400"
            android:valueType="intType"/>
        <objectAnimator
            android:propertyName="y"
            android:duration="500"
            android:valueTo="300"
            android:valueType="intType"/>
    </set>
    <objectAnimator
        android:propertyName="alpha"
        android:duration="500"
        android:valueTo="1f"/>
</set>
```

代码调用：

```java
AnimatorSet set = (AnimatorSet) AnimatorInflater.loadAnimator(myContext, R.animator.property_animator);
set.setTarget(myObject);
set.start();
```
