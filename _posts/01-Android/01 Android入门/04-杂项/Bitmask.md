---
date created: 2024-12-24 00:26
date updated: 2024-12-24 00:26
dg-publish: true
---

# Android中应用程序的状态表示

通过int值表示，通过1左移n位来表示不同的状态

## int值表示多种状态（最多32个状态）

1、Android中应用程序的状态表示：一个int值有32位，Android中用前28位，每一位代表一个功能(一总状态)<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687879960078-85abc85e-bd81-4a15-83e9-9e4549554e3e.png#averageHue=%23f8f5f3&clientId=u5c446bf5-1edb-4&from=paste&id=u5500def1&originHeight=287&originWidth=526&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uefad328b-c05b-449e-94a1-04bffce7dfb&title=)![](http://note.youdao.com/yws/res/4036/21783DCF1D964DB098E91113692CF876#id=PWEQu&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />2、如：flags = 21<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687879966692-34ef55ec-f3f1-486c-8fc4-03c077339822.png#averageHue=%23f6f6f6&clientId=u5c446bf5-1edb-4&from=paste&id=uf7a8a62d&originHeight=148&originWidth=356&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ud48387fc-847e-4335-8cef-f118fe547c4&title=)<br />`flags & FLAG_SYSTEM != 0` 说明了第0位为1，表示是系统应用，否则是非系统应用<br />3、再如

```
①int flags = applicationInfo.flags;  
flags = 572998
转换成32位的二进制为：0000 0000 0000 1000 1011 1110 0100 0110 
②分析：和定义好的常量进行&操作，如果不为0，表示该位为1
第0位为0，第17位为0，表示该应用不是系统应用，没有安装在sd卡(安装在内置存储空间)
③代码：
if ((flags&ApplicationInfo.FLAG_EXTERNAL_STORAGE)!=0) {
    //表示应用安装在内部存储空间
}
if ((flags&ApplicationInfo.FLAG_SYSTEM)!=0) {
    //表示应用是系统应用
}
```

## ApplicationInfo中常见的状态

```java
public static final int FLAG_SYSTEM = 1<<0;    //该位为1表示是系统应用
public static final int FLAG_EXTERNAL_STORAGE = 1<<18;  //该位为1表示应用安装在外部存储设备
```

## 应用：如果应用的状态过多，可以这样定义，如：一个电视频道的状态，游戏的状态机（满足很多条件才能做某件事）

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687880001942-2e886fc7-8490-4f23-a028-e8d1550ff15c.png#averageHue=%23fbfafa&clientId=u5c446bf5-1edb-4&from=paste&id=uedf89f31&originHeight=262&originWidth=602&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue8192543-c3ee-4ed9-b2ba-67c6e26fb3e&title=)

```
ApplicationInfo中定义的常量，用一个int值来表示该应用的各种信息，
ApplicationInfo applicationInfo = packageInfo.applicationInfo;  
public static final int FLAG_SYSTEM = 1<<0;  //if set, this application is installed in the * device's system image. 
public static final int FLAG_DEBUGGABLE = 1<<1; 
public static final int FLAG_HAS_CODE = 1<<2; 
......
public static final int FLAG_CANT_SAVE_STATE = 1<<28;     
int flags = packageInfo.applicationInfo.flags;  //Flags associated with the application.
flags是该应用程序信息的标识，一个int来表示，每一位代表一个信息，
所以，要想知道某一位是否设置了，只需要将该flags和某一位进行与操作，
如果为0，说明该位没有设置，否则，表示该位设置了。
(ApplicationInfo.FLAG_SYSTEM & flags) != 0  

应用：如上面的手机频道项目，一个频道有n多个属性，该频道是否免费，是否优惠，是否在套餐中，是否18岁以上才能看等10几个属性，可以这样定义，
private int isFree = 1<<0;
private int isFavorable 1<<1;
private int isInCombo 1<<2;
......
要想判断一个频道是否具备某些属性，只需要将该频道的flag和某一个属性进行与操作，
如果结果不等于0，说明具备该属性。

重要：对于一些状态较多的，可以借鉴这种方式定义状态
```

# BitMask之int表示32状态或byte表示8种状态

## Bitmask 位操作，bit mask int bit int bit mask

在Android中，也大量地使用了BitMask，比如`android.view.View`这个类。

### 位操作

#### 1、NOT

```java
int a = 1;
int b = ~a;

NOT 0000 0001 = 1111 1110
```

#### 2、OR

```java
int a = 1;
int b = 2;
int c = a | b;
```

#### 3、AND

### Bitmask

每一个bit可以有两种取值：0或1；<br />**BitMask采用一个数值来记录状态，使用这个数值的每一位来表达一个状态。**使用 BitMask 可用非常少的资源表达非常丰富的状态。更为重要的是，基于BitMask可 **非常简单地进行组合状态查询**。

#### byte

在Java中，一个byte 类型，有8位（bit），可以表达8个不同的状态，并且这些状态是互不影响的。

- 设置状态<br />设置状态即和 mask 值进行逻辑『或』

```java
status |= mask;
```

- 清除状态<br />清除状态与 mask 的反码进行逻辑『与』运算。
- 查询状态<br />与 mask 进行逻辑『与』运行，判断是否为零即可

一个诗人的状态在喝酒还是在写作：

```java
public final class Poet {

    private byte mState;

    /**
     * 喝酒状态
     */
    // 0000 0010
    private static final byte STATE_BUSY_IN_WRITING = 0x01 << 1;

    /**
     * 写作状态
     */
    // 0000 0100
    private static final byte STATE_BUSY_IN_DRINKING = 0x01 << 2;

    /**
     * 边喝酒边写作状态
     */
    private static final byte STATE_BUSY_MASK = STATE_BUSY_IN_WRITING | STATE_BUSY_IN_DRINKING;


    /**
     * 设置是否在喝酒
     */
    public void setBusyInDrinking(boolean busy) {
        if (busy) {
            mState |= STATE_BUSY_IN_DRINKING;
        } else {
            mState &= ~STATE_BUSY_IN_DRINKING;
        }
    }

    /**
     * 设置是否在写作
     */
    public void setBusyInWriting(boolean busy) {
        if (busy) {
            mState |= STATE_BUSY_IN_WRITING;
        } else {
            mState &= ~STATE_BUSY_IN_WRITING;
        }
    }

    /**
     * 查询是否在喝酒
     */
    public boolean isBusyInDrinking() {
        return (mState & STATE_BUSY_IN_DRINKING) != 0;
    }

    /**
     * 查询是否在写作
     */
    public boolean isBusyInWriting() {
        return (mState & STATE_BUSY_IN_DRINKING) != 0;
    }

    /**
     * 是否处于忙碌状态
     */
    public boolean isBusy() {
        return (mState & STATE_BUSY_MASK) != 0;
    }
}
```

详细见 [android-BitMaskSample](https://github.com/liaohuqiu/android-BitMaskSample/blob/master/app/src/main/java/in/srain/bitmasksample/people/Poet.java)

#### int

一个int 类型，则有32位，可以表达32种状态。<br />一个int值32位，二进制数要转换为十六进制，就是以4位一段，分别转换为十六进制，如<br />0000 0000 , 1111 1101 , 1010 0101 , 1001 1011<br />0 0 , F D , A 5 , 9 B<br />十六进制表示就是：0x00FDA59B

**Gson中的Modifier大量用到**

#### Reference

- [ ] 细谈Android 中的attributes 属性标志<br /><http://www.jianshu.com/p/045c8529b9c6#>
- [ ] BitMask 使用参考<br /><http://www.jianshu.com/p/694979e1c252#>
- [ ] 就算不去火星种土豆，也请务必掌握的 Android 状态管理最佳实践！<br /><https://juejin.im/entry/5d1c2270e51d4576bc1a0e59>

## BitMask int 32位

```java
/**
 * 64bit flag  <br/>
 * 1. 可根据按bit index add flag <br/>
 * 2. 也可以自定义flag位 <br/>
 */
public abstract class BitMaskLong {

    private static final long FLAG_UNKNOWN = 0x00;
    private static final long FLAG_BASE = 0x01;

    private long flags = FLAG_UNKNOWN;

    public BitMaskLong() {
        clearFlags();
    }

    public void addBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        operateFlag(bitIndex, true);
    }

    public void clearBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        operateFlag(bitIndex, false);
    }

    public boolean hasBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        return hasFlag(FLAG_BASE << bitIndex);
    }

    // --------

    public void addFlag(long flag) {
        flags |= flag;
    }

    public boolean hasFlag(long flag) {
        return (flags & flag) != FLAG_UNKNOWN;
    }

    public void clearFlag(long flag) {
        flags &= ~flag;
    }

    // --------

    public BitMaskLong addAllFlags() {
        for (int i = 0; i < maxBitCount(); i++) {
            addBitIndexFlag(i);
        }
        return this;
    }

    public void clearFlags() {
        flags = FLAG_UNKNOWN;
    }

    public long getFlags() {
        return flags;
    }

    /**
     * set index位 flag
     *
     * @param bitIndex index bit位
     * @param isAdd    true设置flag，false清除flag
     */
    private void operateFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex, boolean isAdd) {
        if (bitIndex < 0 || bitIndex > maxBitCount() - 1) {
            throw new IllegalArgumentException("index must range 0~" + (maxBitCount() - 1) + " , current bitIndex is " + bitIndex);
        }
        if (isAdd) {
            addFlag(FLAG_BASE << bitIndex);
        } else {
            clearFlag(FLAG_BASE << bitIndex);
        }
    }

    // --------

    public int maxBitCount() {
        return Long.SIZE;
    }

    public String toBinaryString() {
        String binaryString = Long.toBinaryString(flags);

        while (maxBitCount() - binaryString.length() > 0) {
            binaryString = 0 + binaryString;
        }
        return binaryString;
    }

    public String toString() {
        int i = Long.bitCount(flags);
        StringBuilder sb = new StringBuilder();
        sb.append("[二进制位]");
        sb.append(toBinaryString());
        sb.append("[位数]");
        sb.append(i);
        return sb.toString();
    }
}
```

案例：控制新闻列表页的自动刷新逻辑

```java
public final class ListRefreshStateInt {

    public static class ArticleRefreshBitMaskInt extends BitMaskInt {
        private ArticleRefreshBitMaskInt() {
        }

        public static BitMaskInt newFlag() {
            return new ArticleRefreshBitMaskInt();
        }

        private static final int FLAG_BASE = 0x01;

        private static final int FLAG_SUBSCRIBE = FLAG_BASE << 0;
        private static final int FLAG_VIDEO = FLAG_BASE << 1;
        private static final int FLAG_TEXT = FLAG_BASE << 3;
        private static final int FLAG_IMAGE = FLAG_BASE << 5;


    }

    public static void main(String[] args) {
        test1();
//        test2();
    }

    // 自定义flag
    private static void test2() {
        BitMaskInt flags = ArticleRefreshBitMaskInt.newFlag();
        flags.addFlag(ArticleRefreshBitMaskInt.FLAG_TEXT | ArticleRefreshBitMaskInt.FLAG_VIDEO);
        System.out.println(flags.toString());
        flags.addFlag(ArticleRefreshBitMaskInt.FLAG_SUBSCRIBE | ArticleRefreshBitMaskInt.FLAG_IMAGE);
        System.out.println(flags.toString());
    }

    // 通过bit index 
    private static void test1() {
        BitMaskInt flags = ArticleRefreshBitMaskInt.newFlag();
//                .addFlags();
        flags.addBitIndexFlag(31);
        System.out.println(flags.toString());
    }

}
```

## BitMask(long 64 bit)实现列表各个列表刷新状态的控制

### Long版，支持最多64位

```java
/**
 * 64bit flag  <br/>
 * 1. 可根据按bit index add flag <br/>
 * 2. 也可以自定义flag位 <br/>
 */
public abstract class BitMaskLong {

    private static final long FLAG_UNKNOWN = 0x00;
    private static final long FLAG_BASE = 0x01;

    private long flags = FLAG_UNKNOWN;

    public BitMaskLong() {
        clearFlags();
    }

    public void addBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        operateFlag(bitIndex, true);
    }

    public void clearBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        operateFlag(bitIndex, false);
    }

    public boolean hasBitIndexFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex) {
        return hasFlag(FLAG_BASE << bitIndex);
    }

    // --------

    public void addFlag(long flag) {
        flags |= flag;
    }

    public boolean hasFlag(long flag) {
        return (flags & flag) != FLAG_UNKNOWN;
    }

    public void clearFlag(long flag) {
        flags &= ~flag;
    }

    // --------

    public BitMaskLong addAllFlags() {
        for (int i = 0; i < maxBitCount(); i++) {
            addBitIndexFlag(i);
        }
        return this;
    }

    public void clearFlags() {
        flags = FLAG_UNKNOWN;
    }

    public long getFlags() {
        return flags;
    }

    /**
     * set index位 flag
     *
     * @param bitIndex index bit位
     * @param isAdd    true设置flag，false清除flag
     */
    private void operateFlag(@IntRange(from = 0, to = Long.SIZE - 1) int bitIndex, boolean isAdd) {
        if (bitIndex < 0 || bitIndex > maxBitCount() - 1) {
            throw new IllegalArgumentException("index must range 0~" + (maxBitCount() - 1) + " , current bitIndex is " + bitIndex);
        }
        if (isAdd) {
            addFlag(FLAG_BASE << bitIndex);
        } else {
            clearFlag(FLAG_BASE << bitIndex);
        }
    }

    // --------

    public int maxBitCount() {
        return Long.SIZE;
    }

    public String toBinaryString() {
        String binaryString = Long.toBinaryString(flags);

        while (maxBitCount() - binaryString.length() > 0) {
            binaryString = 0 + binaryString;
        }
        return binaryString;
    }

    public String toString() {
        int i = Long.bitCount(flags);
        StringBuilder sb = new StringBuilder();
        sb.append("[二进制位]");
        sb.append(toBinaryString());
        sb.append("[位数]");
        sb.append(i);
        return sb.toString();
    }

}
```

### 参考

- [ ] Android中BitMask的使用

<http://wukongcode.com/2016-8-10-android-bitmask-md.html>
