---
date created: 2024-12-27 23:41
date updated: 2024-12-27 23:41
dg-publish: true
tags:
  - '#2'
  - '#3'
  - '#4,'
  - '#2,'
  - '#0:run:()Ljava/lang/Runnable;'
  - '#3,'
  - '#61='
  - '#60'
  - '#64;'
  - '#30'
  - '#31'
  - '#32'
  - '#31'
---

# Java Lambda

## Lambda省略格式

```java
 /**
 * lambda语法: 能省则省
 */
@SuppressWarnings("unused")
@Test public void testLambdaSyntax() {
    // 语法
    BinaryOperator<Integer> bo = (Integer x, Integer y) -> {
        return x+y;
    };

    // 简化1: 由于类型推断(编译器javac根据上下文环境推断出类型), 可以省略参数的类型
    bo = (x,y) -> {
        return x+y;
    };

    // 简化2: 当Lambda体只有一条语句的时候可以省略return和大括号{}
    bo = (x,y) -> x + y;

    // 简化3: 当参数只有一个时, 可以省略小括号
    Consumer<String> fun = args -> System.out.println(args);

    // 简化4: 当参数个数为零时, 使用()即可
    Runnable r1 = () -> System.out.println("Hello Lambda");

    // 简化5: 方法引用(下个新特性)
    Consumer<String> fun02 = System.out::println;
}
```

## 匿名内部类

```java
public class TestJavaAnonymousInnerClass {
    public void test() {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                System.out.println("hello java lambda");
            }
        };
        runnable.run();
    }
}
```

编译生成生成2个class文件：

![](https://note.youdao.com/yws/res/74761/FA0A91ED01424F8EBF6AEFD2F9252F6D#id=OfzX7&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://note.youdao.com/yws/res/74768/0FBC1A7644CB445CA4633985FE6371D7#clientId=u39eb14c2-e7d8-4&id=qKNnU&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ude0d3d9d-b20a-488e-a336-bee9d2e339e&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687453516860-b4e38fdc-c70f-4b5e-adbd-96d9f528dbe6.png#averageHue=%23e7e6e6&clientId=u39eb14c2-e7d8-4&from=paste&height=97&id=er7Q3&originHeight=145&originWidth=792&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=46706&status=done&style=none&taskId=u7095277b-9671-42c3-871a-0a552257fc0&title=&width=528)

## Lambda

```java
public class TestJavaLambda {
    public void test() {
        Runnable runnable = () -> {
            System.out.println("hello java lambda");
        };
        runnable.run();
    }
}
```

编译生成1个class文件：<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687453533597-b3ea681a-7c56-4bcf-a83c-fc7b45d42ad4.png#averageHue=%23f3f2f2&clientId=u39eb14c2-e7d8-4&from=paste&height=75&id=u6e0b3ce2&originHeight=113&originWidth=560&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=18023&status=done&style=none&taskId=u384e9461-494a-4963-8cc2-6fead5547ed&title=&width=373.3333333333333)

### 匿名内部类和Lambda区别

我们javap看下字节码

1. 匿名内部类 `javap -v TestJavaAnonymousInnerClass`

```
public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=3, locals=2, args_size=1
         0: new           #2                  // class com/example/lambda/TestJavaAnonymousInnerClass$1
         3: dup
         4: aload_0
         5: invokespecial #3                  // Method com/example/lambda/TestJavaAnonymousInnerClass$1."<init>":(Lcom/example/lambda/TestJavaAnonymousInnerClass;)V
         8: astore_1
         9: aload_1
        10: invokeinterface #4,  1            // InterfaceMethod java/lang/Runnable.run:()V
        15: return
      LineNumberTable:
        line 9: 0
        line 15: 9
        line 16: 15
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      16     0  this   Lcom/example/lambda/TestJavaAnonymousInnerClass;
            9       7     1 runnable   Ljava/lang/Runnable;
```

可以看到匿名内部类是new的一个新的类`com/example/lambda/TestJavaAnonymousInnerClass$1`

2. Lambda `javap -v TestJavaLambda`

```
public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=2, args_size=1
         0: invokedynamic #2,  0              // InvokeDynamic #0:run:()Ljava/lang/Runnable;
         5: astore_1
         6: aload_1
         7: invokeinterface #3,  1            // InterfaceMethod java/lang/Runnable.run:()V
        12: return
      LineNumberTable:
        line 8: 0
        line 11: 6
        line 12: 12
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      13     0  this   Lcom/example/lambda/TestJavaLambda;
            6       7     1 runnable   Ljava/lang/Runnable;
    // ..
SourceFile: "TestJavaLambda.java"
InnerClasses:
 public static final #61= #60 of #64; //Lookup=class java/lang/invoke/MethodHandles$Lookup of class java/lang/invoke/MethodHandles
BootstrapMethods:
0: #30 invokestatic java/lang/invoke/LambdaMetafactory.metafactory:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;
Method arguments:
  #31 ()V
  #32 invokestatic com/example/lambda/TestJavaLambda.lambda$test$0:()V
  #31 ()V
```

用的是invokedynamic

### Lambda中间产物

文中lambda表达式的写法，在首次运行时，会帮我们生成中间类，类名格式为 `原类名$$Lambda$数字`，然后通过这个中间类最终完成调用。

Oracle JDK 8 / OpenJDK8对lambda表达式在运行时的实现方式是动态生成跟匿名内部类相似形式的类，而负责生成代码的类位于`java.lang.invoke.InnerClassLambdaMetafactory`。可以看到，这个类里有一个调试用的Java property可以设置：

```
jdk.internal.lambda.dumpProxyClasses
```

相关代码在：

```java
 static {
    final String key = "jdk.internal.lambda.dumpProxyClasses";
    String path = AccessController.doPrivileged(
            new GetPropertyAction(key), null,
            new PropertyPermission(key , "read"));
    dumper = (null == path) ? null : ProxyClassesDumper.getInstance(path);
}
```

所以我们在启动Java的时候，传入这个参数：

```java
java -Djdk.internal.lambda.dumpProxyClasses 要运行的包名.类
```

就可以让JDK把lambda表达式对应的运行时生成的类给dump下来了。

> 其实动态代理中间也会生成代理类，也可以通过类似方式导出。

如上面案例，运行如下命令（注意目录，AS在`/Module目录/build/classes/java/main`下执行）：

```
java -Djdk.internal.lambda.dumpProxyClasses com.example.lambda.TestJavaLambda
```

就会dump出运行时中间生成的lambda类<br>![](https://note.youdao.com/yws/res/74788/2C9FAD9FD5D84D48A5A052A4F47CFFA7#id=FNh2n&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687453552083-5ba69aab-f340-48c1-b083-15b0de02b716.png#averageHue=%23e5e5e4&clientId=u39eb14c2-e7d8-4&from=paste&height=40&id=ue74e25e8&originHeight=60&originWidth=668&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=22401&status=done&style=none&taskId=u7c8d128b-df62-4da5-8745-88a4bef6943&title=&width=445.3333333333333)

## Lambda小结

1. 匿名内部类在编译的时候会一个class文件
2. Lambda在程序运行的时候形成一个类

## Lambda Ref

-  [x] Android开发太难了：Java Lambda ≠ Android Lambda（hongyang）<br><https://mp.weixin.qq.com/s/bnljzi2fpFyNqXfRBBkJSg>
-  [x] 每日一问 | Java中匿名内部类写成 lambda，真的只是语法糖吗？<br><https://www.wanandroid.com/wenda/show/16717>

# JDK8中的时间日期

## 日期时间

java8引入了一套全新的时间日期API，java.time包中的是类是不可变且线程安全的。新的时间及日期API位于java.time中，

Java 8 新提供的API可以很好的操作时间

时间和日期，可以实现简单的加plus 减 minus。可以操作的跨度：年月日时分秒周纳秒

### LocalDate、LocalTime、LocalDateTime

在新的Java 8中，日期和时间被明确划分为LocalDate和LocalTime

```
LocalDate无法包含时间；
LocalTime无法包含日期；
LocalDateTime才能同时包含日期和时间，用来替代Java中的Calendar
```

### LocalDateTime

LocalDateTime类用于表示日期和时间，包含日期、时间

#### 常用方法

```
LocalDateTime.now()：获取系统当前时间。
LocalDateTime.of(int year,int month,int dayOfMonth,int hour,int minute,int second):按指定日期和时间创建LocalDateTime对象。
getYear():返回日期中的年份。
getMonth():返回日期中的月份。
getDayOfMonth():返回月份中的日。
getHour():返回小时。
getMinute():返回分钟.
getSecond():返回秒。
```

```java
/**
 * jdk 1.8 中的 LocalDateTime 的使用
 */
private static void localDateTimeTest() {
    System.out.println("-----------test java 8 LocalDateTime-----------");
    //当前时间，以秒为单位。
    long epochSecond = System.currentTimeMillis() / 1000L;
    //默认使用系统时区
    ZoneId zoneId = ZoneOffset.systemDefault();
    //之所以这么初始化，是因为根据传入的时间进行操作
    LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSecond), zoneId);
    //LocalDateTime.now();//也可以这么获得当前时间
    System.out.println("localDateTime 初始化值：" + localDateTime);
    System.out.println("getYear：" + localDateTime.getYear());
    //方法返回值类型特殊，是枚举类型：Month类型
    System.out.println("getMonth：" + localDateTime.getMonth());
    System.out.println("getDayOfMonth：" + localDateTime.getDayOfMonth());
    System.out.println("getHour：" + localDateTime.getHour());
    System.out.println("getMinute：" + localDateTime.getMinute());
    System.out.println("getSecond：" + localDateTime.getSecond());
    System.out.println("getNano：" + localDateTime.getNano());
    System.out.println("getDayOfWeek：" + localDateTime.getDayOfWeek());

    /*
     * 获得传入时间的某一天的凌晨零分零秒的秒数
     */
    long dayStart = localDateTime.withHour(0).withMinute(0).withSecond(0).atZone(zoneId).toEpochSecond();
    System.out.println("dayStart 时间戳，秒数：" + dayStart);
    /*
     * 获得传入时间的周一的凌晨零分零秒的秒数
     */
    localDateTime = LocalDateTime.of(2017, 12, 2, 0, 0, 0);
    System.out.println("localDateTime 设置当前值：" + localDateTime);
    System.out.println("getDayOfWeek：" + localDateTime.getDayOfWeek());
    System.out.println("getDayOfWeek 的 ordinal 值：" + localDateTime.getDayOfWeek().ordinal());
    LocalDateTime weekStart = localDateTime.minusDays(localDateTime.getDayOfWeek().ordinal()).withHour(0).withMinute(0).withSecond(0);
    System.out.println("weekStart：" + weekStart);
    /*
     * 获得传入时间的月份的第一天的凌晨零分零秒的秒数
     */
    long monthStart = localDateTime.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).atZone(zoneId).toEpochSecond();
    System.out.println("monthStart 时间戳，秒数：" + monthStart);

    /*
     * 传入时间的年的第一天
     */
    LocalDateTime firstDayOfYear = localDateTime.with(TemporalAdjusters.firstDayOfYear());
    System.out.println("firstDayOfYear：" + firstDayOfYear);

    /*
     * 当前时间，往后推一周的时间。plus   加
     */
    LocalDateTime plusWeeks = localDateTime.plusWeeks(1);
    System.out.println("plus one week：" + plusWeeks);
    /*
     * 当前时间，向前推一周的时间。minus  减
     */
    LocalDateTime minusWeeks = localDateTime.minusWeeks(1);
    System.out.println("minus one week：" + minusWeeks);

    DateTimeFormatter sf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    String startTime = "2016-11-13 23:59";
    localDateTime = LocalDateTime.parse(startTime, sf);
    System.out.println(localDateTime);
}
```

结果：

```
-----------test java 8 LocalDateTime-----------
localDateTime 初始化值：2018-10-19T14:24:29
getYear：2018
getMonth：OCTOBER
getDayOfMonth：19
getHour：14
getMinute：24
getSecond：29
getNano：0
getDayOfWeek：FRIDAY
dayStart 时间戳，秒数：1539878400
localDateTime 设置当前值：2017-12-02T00:00
getDayOfWeek：SATURDAY
getDayOfWeek 的 ordinal 值：5
weekStart：2017-11-27T00:00
monthStart 时间戳，秒数：1512057600
firstDayOfYear：2017-01-01T00:00
plus one week：2017-12-09T00:00
minus one week：2017-11-25T00:00
2016-11-13T23:59
```

### LocalTime（时间，不包含日期）

```java
/**
 * jdk 1.8 中的 LocalTime 的使用
 */
private static void localTimeTest() {
    System.out.println("-----------test java 8 LocalTime-----------");
    LocalTime now = LocalTime.now();
    System.out.println("当前时间" + now);
    System.out.println("当前时间：小时--" + now.getHour());
    System.out.println("当前时间：分钟--" + now.getMinute());
    System.out.println("当前时间：秒--" + now.getSecond());
    //纳秒，不是毫秒，是十亿分之一秒。
    System.out.println("当前时间：纳秒--" + now.getNano());
    //清除毫秒数，也就是说，你可以肆意设置时间的任意一个位置的值，使用withXXX()就可以啦。
    System.out.println("当前时间：清空纳秒--" + now.withNano(0));
    System.out.println("当前时间：挨个清零--" + now.withHour(0).withMinute(0).withSecond(0).withNano(0));
}
```

结果：

```
-----------test java 8 LocalTime-----------
当前时间14:22:00.210
当前时间：小时--14
当前时间：分钟--22
当前时间：秒--0
当前时间：纳秒--210000000
当前时间：清空纳秒--14:22
当前时间：挨个清零--00:00
```

### LocalDate（日期，不包含时间）

只保存日期LocalDate无法包含时间

```java
/**
 * jdk 1.8 中的 localDate 的使用
 */
private static void localDateTest() {
    System.out.println("-----------test java 8 LocalDate-----------");
    LocalDate today = LocalDate.now();
    System.out.println("当前日期：" + today);
    System.out.println("当前日期的年：" + today.getYear());
    //返回的是枚举类型：Month，Java 8  新增的枚举类型
    System.out.println("当前日期的月--枚举类型：" + today.getMonth());
    //这个返回int才是我们常用的月的数字形式。
    //记得以前你学Java的时候，一月的数字是0吗？这不用你自己手动+1啦，自动就是月份对应的数字，1-12.
    System.out.println("当前日期的月--数字类型：" + today.getMonthValue());
    System.out.println("当前日期的日：" + today.getDayOfMonth());
    //返回的是枚举类型：DayOfWeek，Java 8 新增的枚举类型
    System.out.println("当前日期是周几：" + today.getDayOfWeek());
    System.out.println("当前日期是一年之中的第几天：" + today.getDayOfYear());
    //Chronology：翻译为年代学;年表。此处的返回值是 ISO
    System.out.println("年表：" + today.getChronology());

    LocalDate christmas = LocalDate.of(2017, 12, 25);
    System.out.println("christmas：" + christmas);
    //严格按照ISO yyyy-MM-dd验证，02写成2都不行，当然也有一个重载方法允许自己定义格式
    LocalDate endOfDec = LocalDate.parse("2017-12-28");
    System.out.println("endOfDec：" + endOfDec);
    /*
     * 无效日期无法通过：DateTimeParseException: Invalid date
     */
//        System.out.println(LocalDate.parse("2017-02-29"));

    System.out.println("当前日期：" + today);
    LocalDate firstDayOfMonth = today.with(TemporalAdjusters.firstDayOfMonth());
    System.out.println("当前日期所在的月的第一天：" + firstDayOfMonth);
    LocalDate lastDayOfThisMonth = today.with(TemporalAdjusters.lastDayOfMonth());
    System.out.println("当前日期所在的月的最后一天：" + lastDayOfThisMonth);
    LocalDate secondDayOfThisMonth = today.withDayOfMonth(2);
    System.out.println("当前日期所在的月的第二天：" + secondDayOfThisMonth);

    //对日期进行加减 plus minus
    System.out.println("当前日期plus一天：" + today.plusDays(1));
    System.out.println("当前日期minus一天：" + today.minusDays(1));

    System.out.println("当前日期plus一周：" + today.plusWeeks(1));
    System.out.println("当前日期minus一周：" + today.minusWeeks(1));
}
```

结果：

```
-----------test java 8 LocalDate-----------
当前日期：2018-10-19
当前日期的年：2018
当前日期的月--枚举类型：OCTOBER
当前日期的月--数字类型：10
当前日期的日：19
当前日期是周几：FRIDAY
当前日期是一年之中的第几天：292
年表：ISO
christmas：2017-12-25
endOfDec：2017-12-28
当前日期：2018-10-19
当前日期所在的月的第一天：2018-10-01
当前日期所在的月的最后一天：2018-10-31
当前日期所在的月的第二天：2018-10-02
当前日期plus一天：2018-10-20
当前日期minus一天：2018-10-18
当前日期plus一周：2018-10-26
当前日期minus一周：2018-10-12
```

### Instant

它代表的是时间戳

### ZonedDateTime

这是一个包含时区的完整的日期时间，偏移量是以UTC/格林威治时间为基准的。

## 格式化

### DateTimeFormatter（替代SimpleDateFormat）

DateTimeFormatter类用于将字符串解析为日期对象<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687453653160-d32d7663-bdc8-45ab-9016-26522a1c20a6.png#averageHue=%23fbfaf8&clientId=u39eb14c2-e7d8-4&from=paste&height=297&id=udc088ee8&originHeight=445&originWidth=1131&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=223908&status=done&style=none&taskId=uf9a38744-0811-4124-9454-e7a17e2f540&title=&width=754)<br>Java8新增的`DateTimeFormatter`与`SimpleDateFormat`最大区别是:Java8的DateTimeFormatter是线程安全的，而SimpleDateFormat不是线程安全。

#### 常用方法

1. static ofPattern(String pattern):静态方法，根据指定的字符串设定的格式，将返回一个DateTimeFormatter对象。
2. LocalDateTime.parse(strDate,formatter);静态方法，此方法将指定的字符串strDate,按DateTimeFormatter对象的字符串格式解析为一个LocalDateTime对象。
3. format(formatter):此方法属于LocalDateTime类的方法。用于将LocalDateTime对象按照DateTimeFormatter指定的格式，转换为一个字符串对象。

```java
private static void testDateTimeFormatter() {
    DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // 将字符串按照DateTimeFormatter对象指定的格式解析为LocalDateTime对象
    LocalDateTime date = LocalDateTime.parse("2018-08-18 22:30:22", formatter);
    System.out.println(date.toString()); // 2018-08-18T22:30:22

    // 将LocalDateTime对象按照DateTimeFormatter指定的格式转换为字符串输出
    formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd_HH/mm/ss");
    String str = date.format(formatter);
    System.out.println(str); // 2018/08/18_22/30/22
}
```

### 日期格式化 YYYY-MM-dd 导致的Bug

```java
public class TestDate {

    public static void main(String[] args) {
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");
        SimpleDateFormat format2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        System.out.println(format.format(date));
         System.out.println(format2.format(date));
    }
}
```

效果（2019-12-31 12:56运行）：

```
2020-12-31 12:56:50
2019-12-31 12:56:50
```

YYYY 是表示：当天所在的周属于的年份，一周从周日开始，周六结束，只要本周跨年，那么这周就算入下一年<br>YYYY 的意义：“YYYY 表示的是以周为基础的年度，会计人员依靠这一点来避免在两个不同的年份之间拆分周数，从而避免公司的工资单。”

```
yyyy       year-of-era 
YYYY       week-based-year
```

<https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html#patterns>

### Ref

- [ ] 你今天因为 YYYY-MM-dd 被提 BUG 了吗<br><https://www.v2ex.com/t/633650>
- [ ] <https://mp.weixin.qq.com/s/SJClwQOXaEI03EbztcKb8A>
