---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# AnimatorSet

## AnimatorSet概述

ofPropertyValuesHolder和ObjectAnimator的ofxx函数可以实现一个动画改变多个属性；但这些都是在一个动画中，所有的动画设置都是共用的。有时也需要能够让多个动画相互配合的运行；AnimatorSet就可以实现这个功能（其实我们也可以为每个动画设置监听，然后执行下一个动画，但是操作比较繁琐），AnimatorSet可以实现复杂的组合动画，既可以同时对多个对象做动画并控制执行顺序，也可以控制单个对象的动画执行顺序。

> AnimatorSet可以指定一组动画的执行顺序，让它们可以一起执行，顺序执行，延迟执行。

### AnimatorSet的生成

代码直接利用 `AnimatorSet()`

如果是XML定义AnimatorSet 利用 `AnimatorInflater.loadAnimator()`加载

> AnimatorSet可以作用于ObjectAnimator和ValueAnimator，但通常ObjectAnimator用的比较多

### AnimatorSet和ObjectAnimator中重叠的函数

- 优先AnimatorSet，同时设置的话，AnimatorSet会覆盖ObjectAnimator

> 如果没有设置就使用子动画自己的，如果AnimatorSet设置了就使用AnimatorSet设置的属性。

```java
setDuration (long duration)：设置每个内部子动画的时长，默认每个子动画使用自己默认的时长，如果AnimatorSet设置了时长，子动画将继承这个时长，而子动画自己设置的duration将失效。
setInterpolator (TimeInterpolator interpolator)，设置之后内部子动画的插值器都是这个
setTarget(Object target)，设置之后所有内部子动画都作用于相同的target目标对象
```

- 不会覆盖子动画

```
setStartDelay(long startDelay)函数是个特例，它不会覆盖子动画开始延迟，只对AnimatorSet的开始时间起作用，所以它会延后AnimatorSet激活整体动画的开始时间。
```

## AnimatorSet函数

### 构造函数

- public AnimatorSet()

### 两种添加动画到AnimatorSet的方法

1. 一种是利用`playTogether()`或者`playSequentially()`，可以一次添加所有的动画到AnimatorSet中，
2. 一种是利用`play(Animator)`构建Builder对象，然后利用Builder提供的方法，一个一个的添加动画，并设置各个动画间执行顺序的依赖关系

- public void playTogether(Animator... items)
- public void playTogether(Collection items)
- public void playSequentially(Animator... items)
- public void playSequentially(List items)

### AnimatorSet的其他函数

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

## playTogether和playSequentially

注意：

1. playTogether和playSequentially只负责激活控件动画，后续的动画还是由ObjectAnimator自己控制。
2. playSequentially是一个动画执行完后执行下一个动画，但如果前一个动画是无限循环，下一个动画永远不会执行。

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

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188759864-9ebf21ca-65be-4104-a9af-ac5024507fa3.gif#averageHue=%23eeeeee&clientId=uf7b25f1e-0a80-4&id=W3kMJ&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4508f1af-ddb4-4d47-a3b8-a99702082a5&title=)

#### 多个动画作用于同一个对象同一个属性

多个动画同时对一个属性，会按照playTogether添加的最后一个动画覆盖前面操作相同属性的动画，也可能没有覆盖，但确实是最后一个添加的动画起了作用。

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

- animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4,objectAnimator5,objectAnimator6);<br />最终会按照`objectAnimator6`的效果进行展示。

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188760228-87e229a5-dff3-4b2d-922d-3a58da9e669f.gif#averageHue=%23eeeeee&clientId=uf7b25f1e-0a80-4&id=FrTDH&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7f2b7b65-4bad-43cf-bdfa-a3470d736c8&title=)

- animatorSet.playTogether(objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator6,objectAnimator5,objectAnimator4);<br />最终会按照objectAnimator4的效果进行展示。

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188760686-8a950b83-7ec1-4ebb-8293-b109fc914571.gif#averageHue=%23eeeeee&clientId=uf7b25f1e-0a80-4&id=Kilhn&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud00aa6b1-bbd3-42e9-8c00-a59025437b5&title=)

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

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188760907-5336dfd7-be25-4d47-b007-0c9c9739aebd.gif#averageHue=%23ededed&clientId=uf7b25f1e-0a80-4&id=PF5ru&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u029842c4-e1f0-44cb-9af8-534dcc310c1&title=)

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

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188761047-2dc8d405-a00b-4d63-b7a8-f812ee48fca9.gif#averageHue=%23ededed&clientId=uf7b25f1e-0a80-4&id=zo5xe&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u88278eaf-c90e-40af-b812-0990c81cb63&title=)

### 如何实现动画的循环播放

AnimatorSet中没有设置动画执行次数的函数，所以无法利用AnimatorSet设置动画循环播放， playSequentially一个动画执行完后执行另外一个动画，如果前一个动画是无限循环，后一个动画不会执行，所以也无法实现循环播放动画，所以只能利用playTogether播放动画时每个动画设置无限循环：

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

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188761105-76f6cba7-9fb8-4bb5-8793-13a251bcb772.gif#averageHue=%23eeeeee&clientId=uf7b25f1e-0a80-4&id=ec8lm&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc078aef8-21d1-46d5-9ac7-74909e715c0&title=)

如果利用playSequentially并且前一个动画是无限循环动画：

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188761147-25dbb87b-168a-4864-ae1d-6b9600654c17.gif#averageHue=%23ededed&clientId=uf7b25f1e-0a80-4&id=iCDDR&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud82f9a90-0b04-4e7a-9411-8238d84bce6&title=)

最终实现循环动画的方法为，每个内部子动画设置为无限循环

## 利用play(Animator)构建Builder对象

**Builder play(Animator anim)；生成builder对象，Builder能够控制动画的执行顺序和相互之间的依赖。**<br />通过AnimatorSet中的`play`方法可以获取`AnimatorSet.Builder`对象，通过Builder内部的函数添加动画到AnimatorSet中，后续的所有动画都是以play传入的动画为标准进行相应操作。

### Builder的函数：

1. public Builder with(Animator anim) 和动画(anim)一起执行<br />A.with(B)  A和B一起执行
2. public Builder before(Animator anim) 先执行自己的动画再执行anim<br />A.before(B) 先执行A，再执行B
3. public Builder after(Animator anim)	先执行anim后再执行自己的动画<br />A.after(B) 先执行B，再执行A
4. public Builder after(long delay)	延迟n毫秒之后执行动画

### public Builder with(Animator anim)	和动画(anim)一起执行

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

三个view同时执行变色动画：

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188763644-6939474b-8d08-4574-8605-0a0849d41786.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=Q8CJC&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u923f4126-b032-40ce-92bd-55f3bdea573&title=)

### public Builder before(Animator anim) 先执行自己的动画再执行anim

```java
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).before(objectAnimator2)
animatorSet.duration = 3000
animatorSet.start()
```

第一个view先执行变色操作再执行X轴缩放操作：

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188763717-43a65e55-fed8-4134-bc09-1152cab55cca.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=URxvB&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf929c39d-0c3e-453d-8968-53ff86113a9&title=)

### public Builder after(Animator anim)	先执行anim后再执行自己的动画

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).after(objectAnimator2)
animatorSet.duration = 3000
animatorSet.start()
```

第一个view先执行X轴缩放动画，再执行变色操作。

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188763843-da4c0348-2098-490f-a169-4da882b3d505.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=TUGzZ&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u724ec31f-72fa-4d16-a79b-6d993d63be2&title=)

### public Builder after(long delay)  延迟n毫秒之后执行动画(还有疑问)

```java
AnimatorSet animatorSet = new AnimatorSet();
animatorSet.play(objectAnimator1).after(objectAnimator2).after(10000);
animatorSet.setDuration(3000);
animatorSet.start();
```

> 如果设置过after延迟执行之后设置setDuration，after延迟会被duration的时间覆盖，不会产生延迟；所以上面after(10000)的没有任何效果

```java
animatorSet.play(objectAnimator1).after(objectAnimator2).after(10000);
// animatorSet.setDuration(3000);
animatorSet.start();
```

> 延迟是对play函数中的动画来说的，调用了after（非延迟）之后，after（非延迟）中的动画是不受after延迟时间影响的。

```kotlin
val objectAnimator1 = ObjectAnimator.ofArgb(mTextView, "backgroundColor", Color.WHITE, Color.GREEN)
val objectAnimator2 = ObjectAnimator.ofFloat(mTextView, "scaleX", 0.1f, 1.2f)
val animatorSet = AnimatorSet()
animatorSet.play(objectAnimator1).after(3000).after(objectAnimator2)
//  animatorSet.play(objectAnimator1).after(objectAnimator2).after(3000) // 效果和上面一样，作用于play
//            animatorSet.duration = 3000
animatorSet.start()
```

效果：先scaleX，等3秒后，背景变化

## AnimatorSet Builder的操作方式，每次play，或者链式操作

AnimatorSet 的play函数和Builder的with，before，after函数都返回Builder 对象实例，所以我们可每次通过play获取Builder进行动画操作，也可以利用Builder函数返回Builder对象的特性进行链式操作，两种操作方式有什么不同呢？

### AnimatorSet的play方法产生的Builder对象

```java
public Builder play(Animator anim) {
    if (anim != null) {
        return new Builder(anim);
    }
    return null;
}
```

每次调用play方法都会产生一个新的Builder对象，这个对象约束内部动画的执行顺序。而且重要的一点是**play()方法是唯一一种获取Builder对象的方式**，后续所有的动画执行都以play方法中传入的动画为基准。

```java
AnimatorSet s = new AnimatorSet();
s.play(anim1).with(anim2);
s.play(anim2).before(anim3);
s.play(anim4).after(anim3);
```

动画anim1 和anim2有关系，anim2和anim3有关系，anim3和anim4有关系。anim1和anim2将同时执行，anim2先于anim3执行，anim3 先于anim4执行，所以最终的执行顺序为anim1和anim2同时开始执行，anim2执行完后开始执行anim3,anim3执行完后开始执行anim4.

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

结果：动画会先执行objectAnimator11(gif中的第三个view变背景)，然后objectAnimator1(gif中的第一个view变背景)和objectAnimator7（第二个view变背景）同时执行，最后执行objectAnimator2（缩放）；

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188763910-dc951a3c-48ec-4e2f-9fde-c69d3e6b17f2.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=QeUtZ&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u77d4a62d-cc7b-4ce3-8d33-dbb3f89bd2c&title=)

### Builder with before after 函数返回Builder对象，链式操作动画

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

play之后的链式调用不会产生新的Builder对象，会把传入的动画添加到play函数产生的Builder对象的node列表中等待执行。<br />所以with before after 函数被调用之后链式操作动画是操作同一个Builder对象内部的Node链，所以都是以play函数传入的动画为基准。<br />play(a1).before(a2).before(a3) a2,a3动画都是以a1动画为基准，a1动画执行结束之后a2,a3将同时执行，a1动画和a2,a3有关系，但是a2,a3之间是没有关系的。

#### 案例1

```java
animatorSet.play(objectAnimator1).before(objectAnimator2).after(objectAnimator4).before(objectAnimator3).after(objectAnimator14).after(objectAnimator11);
animatorSet.setDuration(3000);
animatorSet.start();
```

其中objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4 操作左边第一个view。<br />objectAnimator7操作第二个view，<br />objectAnimator11，objectAnimator12操作第三个view。<br />上面的代码会同时执行objectAnimator4,objectAnimator11,objectAnimator14,然后执行objectAnimator1，再执行objectAnimator2 和objectAnimator3

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188764060-b260eb3f-7de8-45bd-b814-1cceaeb73f97.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=trqtU&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub852ffba-b554-441c-b5b7-8ea87474e31&title=)

#### 案例2

```java
AnimatorSet animatorSet = new AnimatorSet();
animatorSet.play(objectAnimator1).before(objectAnimator2).before(objectAnimator3).before(objectAnimator4).with(objectAnimator7).with(objectAnimator11).after(objectAnimator12);
animatorSet.setDuration(3000);
animatorSet.start();
```

其中objectAnimator1,objectAnimator2,objectAnimator3,objectAnimator4 操作左边第一个view。<br />objectAnimator7操作第二个view，<br />objectAnimator11，objectAnimator12操作第三个view。<br />结果：objectAnimator12先执行动画，接着objectAnimator1，objectAnimator7，objectAnimator11动画会同时执行，objectAnimator1执行完之后objectAnimator2,objectAnimator3,objectAnimator4动画会同时执行。

![](https://cdn.nlark.com/yuque/0/2024/gif/694278/1706188764550-45243c55-a7b4-4501-a3be-0d514216b699.gif#averageHue=%23eaeaea&clientId=uf7b25f1e-0a80-4&id=XHsMg&originHeight=536&originWidth=359&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue24aa9cd-da48-476e-ac0d-b768f875248&title=)

---

链式调用动画执行顺序总结如下：

> Builder链式调用中会先执行after函数中的动画（有多个同时执行），然后执行play和with函数（有多个同时执行）中的动画，最后执行before函数中的动画（有多个同时执行）；with/before/after都是相对于play来说的。

## AnimatorSet动画监听

> 调用cancel，会先调用onAnimationCancel，然后onAnimationEnd

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

由于内部主要使用ObjectAnimator所以动画监听显得不那么重要。

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
