---
date created: 2024-12-27 23:44
date updated: 2024-12-27 23:44
dg-publish: true
---

# 基础

## 基础中的基础

### Java为什么跨平台？

由于JVM的存在。因为Java程序编译之后的代码不是能被硬件系统直接运⾏的代码，⽽是⼀种“中间码”—字节码。然后不同的硬件平台上安装有不同的Java虚拟机(JVM)，由JVM来把字节码再“翻译”成所对应的硬件平台能够执⾏的代码。因此对于Java编程者来说，不需要考虑硬件平台是什么，所以Java可以跨平台。

### 浮点数的计算

**BigDecimal**类进⾏商业计算，**Float**和**Double**只能⽤来做科学计算或者是⼯程计算

### /和>>运算符？

### Java中的编码

#### 字符、字符集和字符编码

1. 字符(Character) 是各种文字和符号的总称，包括各国家文字、标点符号、图形符号、数字等。
2. 字符集(Character set) 是一个系统支持的所有抽象字符的集合。通常以二维表的形式存在，二维表的内容和大小是由使用者的语言而定。如ASCII,GBxxx,Unicode等。
3. 字符编码(Character encoding) 是把字符集中的字符编码为特定的二进制数，以便在计算机中存储。每个字符集中的字符都对应一个唯一的二进制编码。

#### 常见字符集

1. ASCII字符集

最初1个字符总是存储为1个字节。一个字节(8位)可能有256个不同的可能值。但实际上只使用了前7位。所以只定义了128个字符。这个集合称为ASCII字符集

> ASCII是字符集还是编码？ASCII是一个字符集。然而，在编程中，charset和encoding被广泛用作同义词。如果我想引用只包含ASCII字符而不包含其他字符的编码(第8位总是0)：那就是`US-ASCII`

2. Unicode

> Unicode（中文：万国码、国际码、统一码、单一码）是计算机科学领域里的一项业界标准。它对世界上大部分的文字系统进行了整理、编码，使得电脑可以用更为简单的方式来呈现和处理文字。<br>Unicode伴随着通用字符集的标准而发展，同时也以书本的形式对外发表。Unicode至今仍在不断增修，每个新版本都加入更多新的字符。目前最新的版本为2016年6月21日公布的9.0.0,已经收入超过十万个字符（第十万个字符在2005年获采纳）。Unicode涵盖的数据除了视觉上的字形、编码方法、标准的字符编码外，还包含了字符特性，如大小写字母。

#### 常见编码

1. GB2312/GBK

> GB2312标准共收录6763个汉字，其中一级汉字3755个，二级汉字3008个；同时收录了包括拉丁字母、希腊字母、日文平假名及片假名字母、俄语西里尔字母在内的682个字符。
> GBK对GB2312-80进行扩展, 总计拥有 23940 个码位，共收入21886个汉字和图形符号，其中汉字（包括部首和构件）21003 个，图形符号883 个；GBK向下完全兼容GB2312-80编码。支持GB2312-80编码不支持的部分中文姓，中文繁体，日文假名，还包括希腊字母以及俄语字母等字母。不过这种编码不支持韩国字，也是其在实际使用中与Unicode编码相比欠缺的部分。

2. UTF-8、UTF-16、UTF-32

> **UTF-16**用两个字节来表示Unicode转换格式，这个是定长的表示方法，不论什么字符都可以用两个字节表示，两个字节就是16bit，所以叫UTF-16。UTF-16每两个字节表示一个字符，这个在字符串操作时就大大简化了操作，这也是Java以UTF-16作为内存的字符存储格式的一个很重要的原因；
> UTF-16统一采用两个字节表示一个字符，有很多字符一个字节就可以了。UTF-8采用了一种变长技术，每个编码区域有不同的字码长度，不同类型的字符可以是由1~3个字节组成。
> **UTF-32**：用固定长度的字节存储字符编码，不管Unicode字符编号需要几个字节，全部都用4个字节存储，直接存储Unicode编号。无需经过字符编号向字符编码的转换步骤，提高效率，用空间换时间。

#### 为什么需要编码？

计算机存储信息的最⼩单元是⼀个字节即8bit，所以能表示的范围是0~255，这个范围⽆法保存所有的字符；世界上有很多语言，一个字节不能全表示出来；从char到byte就是编码，它告诉如何将字符编码成字节序列。

#### Java 中需要编码的场景

涉及到编码的地方一般都在字符到字节或者字节到字符的转换上

1. I/O 操作中存在的编码
2. 内存中操作中的编码

#### URL 的编解码

##### 为什么需要URL编码？

对于Url来说，之所以要进行编码，是因为Url中有些字符会引起歧义，比如`&``=``?`

> Url参数字符串中使用key=value键值对这样的形式来传参，键值对之间以&符号分隔，如/s?q=abc&ie=utf-8。如果你的value字符串中包含了=或者&，那么势必会造成接收Url的服务器解析错误，因此必须将引起歧义的&和=符号进行转义，也就是对其进行编码。

##### 什么是URL编码？

URL编码只是简单的在特殊字符的各个字节前加上`%`，这样服务端会把紧跟在`%`后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符。

> 例如，我们对奇异的字符`name1=va&lu=e1`进行URL编码后结果：`name1=va%26lu%3D`

##### 为什么我们要用ASCII传输，可不可以用别的编码？

Url的编码格式采用的是ASCII码，而不是Unicode，这也就是说你不能在Url中包含任何非ASCII字符，例如中文。否则如果客户端浏览器和服务端浏览器支持的字符集不同的情况下，中文可能会造成问题。Url编码的原则就是使用安全的字符（没有特殊用途或者特殊意义的可打印字符）去表示那些不安全的字符。

### Java 中的char

1. Java中的char占用两个字节
2. Java char不存UTF-8，而是UTF-16
3. Unicode通用字符集占两个字节
4. Unicode是字符集，不是编码
5. Java String的length不等于字符数量，用`codePointCount()`可以计算出真实的字符数量

```java
public static void main(String[] args) {
    String B = "𝄞"; // 这个就是那个音符字符，只不过由于当前的网页没支持这种编码，所以没显示。
    String C = "\uD834\uDD1E"; // 这个就是音符字符的UTF-16编码
    System.out.println(C);
    System.out.println(B.length()); // 2
    System.out.println(B.codePointCount(0, B.length())); // 1
}
```

# BigDecimal

## 什么是BigDecimal？

Java在java.math包中提供的API类BigDecimal，用来对**超过16位有效位**的数进行精确的运算。双精度浮点型变量double可以处理**16位**有效数，但在实际应用中，可能需要对更大或者更小的数进行运算和处理。

一般情况下，对于那些不需要准确计算精度的数字，我们可以直接使用Float和Double处理，但是`Double.valueOf(String)` 和`Float.valueOf(String)`会丢失精度。所以开发中，如果我们需要精确计算的结果，则必须使用BigDecimal类来操作。

BigDecimal所创建的是对象，故我们不能使用传统的`+`、`-`、`*`、`/`等算术运算符直接对其对象进行数学运算，而必须调用其相对应的方法。方法中的参数也必须是BigDecimal的对象。构造器是类的特殊方法，专门用来创建对象，特别是带有参数的对象。

## 使用BigDecimal

### 常用构造函数

1. BigDecimal(int) 创建一个具有参数所指定整数值的对象
2. BigDecimal(double) 创建一个具有参数所指定双精度值的对象
3. BigDecimal(long) 创建一个具有参数所指定长整数值的对象
4. BigDecimal(String) 创建一个具有参数所指定以字符串表示的数值的对象

**示例：**

```java
BigDecimal a =new BigDecimal(0.1);
System.out.println("a values is:"+a);
System.out.println("=====================");
BigDecimal b =new BigDecimal("0.1");
System.out.println("b values is:"+b);
```

**输出：**

```
a values is:0.1000000000000000055511151231257827021181583404541015625
=====================
b values is:0.1
```

**原因分析：**

- 参数类型为double的构造方法的结果有一定的不可预知性。有人可能认为在Java中写入newBigDecimal(0.1)所创建的BigDecimal正好等于 0.1（非标度值 1，其标度为1），但是它实际上等于`0.1000000000000000055511151231257827021181583404541015625`。这是因为0.1无法准确地表示为 double（或者说对于该情况，不能表示为任何有限长度的二进制小数）。这样，传入到构造方法的值不会正好等于 0.1（虽然表面上等于该值）。
- String 构造方法是完全可预知的：写入 newBigDecimal(“0.1”) 将创建一个 BigDecimal，它正好等于预期的0.1。因此，比较而言， 通常建议优先使用String构造方法
- 当double必须用作BigDecimal的源时，请注意，此构造方法提供了一个准确转换；它不提供与以下操作相同的结果：先使用Double.toString(double)方法，然后使用BigDecimal(String)构造方法，将double转换为String。要获取该结果，请使用static valueOf(double)方法

### BigDecimal常用方法详解

1. add(BigDecimal)<br>BigDecimal对象中的值相加，返回BigDecimal对象
2. subtract(BigDecimal)<br>BigDecimal对象中的值相减，返回BigDecimal对象
3. multiply(BigDecimal)<br>BigDecimal对象中的值相乘，返回BigDecimal对象
4. divide(BigDecimal)<br>BigDecimal对象中的值相除，返回BigDecimal对象
5. toString()<br>将BigDecimal对象中的值转换成字符串
6. doubleValue()<br>将BigDecimal对象中的值转换成双精度数
7. floatValue()<br>将BigDecimal对象中的值转换成单精度数
8. longValue()<br>将BigDecimal对象中的值转换成长整数
9. intValue()<br>将BigDecimal对象中的值转换成整数
10. int compareTo()<br>BigDecimal大小比较

```java
int a = bigdemical.compareTo(bigdemical2)
// a = -1, 表示bigdemical小于bigdemical2；
// a = 0, 表示bigdemical等于bigdemical2；
// a = 1, 表示bigdemical大于bigdemical2；
```

### BigDecimal格式化

由于NumberFormat类的format()方法可以使用BigDecimal对象作为其参数，可以利用BigDecimal对超出16位有效数字的货币值，百分值，以及一般数值进行格式化控制。

- **案例1：利用BigDecimal对货币和百分比格式化**<br>首先，创建BigDecimal对象，进行BigDecimal的算术运算后，分别建立对货币和百分比格式化的引用，最后利用BigDecimal对象作为format()方法的参数，输出其格式化的货币值和百分比。

```java
NumberFormat currency = NumberFormat.getCurrencyInstance(); //建立货币格式化引用
NumberFormat percent = NumberFormat.getPercentInstance();  //建立百分比格式化引用
percent.setMaximumFractionDigits(3); //百分比小数点最多3位

BigDecimal loanAmount = new BigDecimal("15000.48"); //贷款金额
BigDecimal interestRate = new BigDecimal("0.008"); //利率
BigDecimal interest = loanAmount.multiply(interestRate); //相乘

System.out.println("贷款金额:\t" + currency.format(loanAmount));
System.out.println("利率:\t" + percent.format(interestRate));
System.out.println("利息:\t" + currency.format(interest));
```

输出：

```
贷款金额: ￥15,000.48 利率: 0.8% 利息: ￥120.00
```

- **案例2：BigDecimal格式化保留2为小数，不足则补0**

```java
private static void test4() {
    System.out.println(formatToNumber(new BigDecimal("3.435")));
    System.out.println(formatToNumber(new BigDecimal(0)));
    System.out.println(formatToNumber(new BigDecimal("0.00")));
    System.out.println(formatToNumber(new BigDecimal("0.001")));
    System.out.println(formatToNumber(new BigDecimal("0.006")));
    System.out.println(formatToNumber(new BigDecimal("0.206")));
//        3.44
//        0.00
//        0.00
//        0.00
//        0.01
//        0.21
}

/**
 * 1. 0~1之间的BigDecimal小数，格式化后失去前面的0,则前面直接加上0。
 *
 * 2. 传入的参数等于0，则直接返回字符串"0.00"
 *
 * 3. 大于1的小数，直接格式化返回字符串
 *
 * @param obj 传入的小数
 */
public static String formatToNumber(BigDecimal obj) {
    DecimalFormat df = new DecimalFormat("#.00");
    if (obj.compareTo(BigDecimal.ZERO) == 0) {
        return "0.00";
    } else if (obj.compareTo(BigDecimal.ZERO) > 0 && obj.compareTo(new BigDecimal(1)) < 0) {
        return "0" + df.format(obj).toString();
    } else {
        return df.format(obj).toString();
    }
}
```

### BigDecimal常见异常

#### 除法的时候出现异常

```
private static void test5() {
    BigDecimal three = new BigDecimal("3");
    BigDecimal one = new BigDecimal("1");
    System.out.println("one=" + one);
//        BigDecimal divide = one.divide(three); //  Non-terminating decimal expansion; no exact representable decimal result.
//        System.out.println("1/3=" + divide);

    BigDecimal divide = one.divide(three, 3, RoundingMode.CEILING);//  0.33
    System.out.println("1/3=" + divide);
}
```

- 异常：

```
java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result
```

- 原因分析：<br>通过BigDecimal的divide方法进行除法时当不整除，出现无限循环小数时，就会抛异常：`java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result`.
- 解决方法：

```
// divide方法设置精确的小数点：
BigDecimal divide = one.divide(three, 3, RoundingMode.CEILING);//  0.33
```

## BigDecimal工具类

```java
/**
 * 用于高精确处理常用的数学运算
 */
public class ArithmeticUtils {
    // 默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */

    public static double add(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
    public static BigDecimal add(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2);
    }

    /**
     * 提供精确的加法运算
     *
     * @param v1    被加数
     * @param v2    加数
     * @param scale 保留scale 位小数
     * @return 两个参数的和
     */
    public static String add(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static double sub(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    /**
     * 提供精确的减法运算。
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static BigDecimal sub(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2);
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1    被减数
     * @param v2    减数
     * @param scale 保留scale 位小数
     * @return 两个参数的差
     */
    public static String sub(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static BigDecimal mul(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2, int scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.multiply(b2).doubleValue(), scale);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static String mul(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到 小数点以后10位，以后的数字四舍五入
     *
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */

    public static double div(double v1, double v2) {
        return div(v1, v2, DEF_DIV_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double div(double v1, double v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示需要精确到小数点以后几位
     * @return 两个参数的商
     */
    public static String div(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v1);
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(double v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static String round(String v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(v);
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static String remainder(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.remainder(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数  BigDecimal
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static BigDecimal remainder(BigDecimal v1, BigDecimal v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        return v1.remainder(v2).setScale(scale, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 比较大小
     *
     * @param v1 被比较数
     * @param v2 比较数
     * @return 如果v1 大于v2 则 返回true 否则false
     */
    public static boolean compare(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.compareTo(b2) > 0;
    }
}
```

## BigDecimal总结

1. 在需要精确的小数计算时再使用BigDecimal，BigDecimal的性能比double和float差，在处理庞大，复杂的运算时尤为明显。故一般精度的计算没必要使用BigDecimal。尽量使用参数类型为String的构造函数；精度低的用Double/Float等，性能好点
2. BigDecimal都是不可变的（immutable）的， 在进行每一次四则运算时，都会产生一个新的对象 ，所以在做加减乘除运算时要记得要保存操作后的值。

## Ref

- [x] [Java中的 BigDecimal，80%的人都用错了....](https://mp.weixin.qq.com/s?__biz=MjM5NzMyMjAwMA==&mid=2651514508&idx=1&sn=32983c9c8d38bf1e6da28e438aeddb2e&chksm=bd258af38a5203e523f71988fdc82aabbb906f108bd622db402de19f9199d781382aaa3dff94&scene=90&subscene=93&sessionid=1652723020&clicktime=1652723082&enterid=1652723082&ascene=56&fasttmpl_type=0&fasttmpl_fullversion=6156497-zh_CN-zip&fasttmpl_flag=0&realreporttime=1652723082030#rd)

# DecimalFormat

## double类型如果小数点后为零显示整数否则保留

```kotlin
java.lang.String.valueOf(DecimalFormat("###.##").format(float))
```

保留2位小数，如果小数位0，不显示

案例：

```java
DecimalFormat df = new DecimalFormat("###.####");
float f = 20.0f;
System.out.println("你不想要的：" + f);
System.out.println("你想要的答案：" + df.format(f));
```

## float格式化成m/k显示

```kotlin
fun formatCoin(coin: Float): String {
    val mm = 1000 * 1000
    val kk = 1000

    var temp = coin

    val m = temp / mm
    temp %= mm
    println("m=$m,temp=$temp")

    val k = temp / kk
    temp %= kk
    println("k=$k,temp=$temp")

    val mod = temp
    println("mod=$mod")
    var format = ""
    if (m >= 1) {
        format += m.toInt().toString() + "m"
    }
    if (k >= 1) {
        format += k.toInt().toString() + "k"
    }
    if (mod >= 1) {
        format += java.lang.String.valueOf(DecimalFormat("###.##").format(mod))
    }
    println("format=$format")
    return format
}
```

结果:

```
fun main() {
    val coin = 4434433.35
    println(formatCoin(coin))
}

4.43m4433.35k
```

# Java基础相关面试题

###
