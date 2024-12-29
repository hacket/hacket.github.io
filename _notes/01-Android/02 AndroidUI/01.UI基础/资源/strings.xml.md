---
date created: 2024-09-25 20:55
date updated: 2024-12-24 00:29
dg-publish: true
---

# String.format

## 字符串格式化

获取字符串使用 `String.format(String format, Object... args)` 来创建格式化的字符串

- 转化符说明参考表

| 转化符 | 说明                     | 示例      |
| --- | ---------------------- | ------- |
| %s  | 字符串类型                  | “asdf”  |
| %c  | 字符类型                   | 'm'     |
| %b  | 布尔类型                   | true    |
| %d  | 整数类型（十进制）              | 99      |
| %x  | 整数类型（十六进制）             | FF      |
| %o  | 整数类型（八进制）              | 77      |
| %f  | 浮点类型                   | 99.99   |
| %a  | 十六进制浮点类型               | FF.35AE |
| %e  | 指数类型                   | 9.38e+5 |
| %g  | 通用浮点类型（f和e类型中较短的)      |         |
| %h  | 散列码                    |         |
| %%  | 百分比类型                  | 99%     |
| %n  | 换行符                    |         |
| %tx | 日期与时间类型（x代表不同的日期与时间转换符 |         |

- 示例

```java
String str=null;
str=String.format("Hi,%s", "王力");
System.out.println(str);
str=String.format("Hi,%s:%s.%s", "王南","王力","王张");
System.out.println(str);
System.out.printf("字母a的大写是：%c %n", 'A');
System.out.printf("3>7的结果是：%b %n", 3>7);
System.out.printf("100的一半是：%d %n", 100/2);
System.out.printf("100的16进制数是：%x %n", 100);
System.out.printf("100的8进制数是：%o %n", 100);
System.out.printf("50元的书打8.5折扣是：%f 元%n", 50*0.85);
System.out.printf("上面价格的16进制数是：%a %n", 50*0.85);
System.out.printf("上面价格的指数表示：%e %n", 50*0.85);
System.out.printf("上面价格的指数和浮点数结果的长度较短的是：%g %n", 50*0.85);
System.out.printf("上面的折扣是%d%% %n", 85);
System.out.printf("字母A的散列码是：%h %n", 'A');
```

## string.xml中动态配置多个占位字符串内容

```
%n$ms、%n$md、%n$mf （也可以简写为%s、%d、%f）
```

分别代表输出字符串、整数、浮点数，n代表是第几个参数，m的值用来设置空格（3代表一个空格、4代表两个..以此类推）

> 输出浮点数时，m的值可以控制小数位数，如m=2.2时，输出格式为00.00

```
<string name="mis_action_button_string">%1$s(%2$d/%3$d)</string>
```

# plurals strings 复数

```xml
<plurals name="buy_kindle">   
    <item quantity="one">I want to buy a Kindle</item>    
    <item quantity="other">I want to buy some Kindles</item>
</plurals>
```

获得该plurals方法如下，第二参数传入quantity，系统会根据quantity来选择对应的显示，该方法后也可以加入参数：

```java
getResources().getQuantityString(R.plurals.buy_kindle, 2)
```

# strings.xml放html标签

Html.fromHtml(text)支持的html标签却不只这些,具体有那些android平台并没有详细列举.在 HTML Tags Supported By TextView 有详细列举.但是额外的标签不能直接定义在xml中.貌似会被过滤掉.所以使用额外的标签时,必须用`<![CDATA[`xxx`]]>`包围住.当然这样的字符串就不能直接在xml中调用了<br />`Html.fromHtml`这个操作耗时，注意

# strings.xml放置特殊字符

## 转义字符

- 1、用转义字符

```java

// 以下为XML标志符的数字和字符串转义符 

" (&#34; 或 &quot;) 

' (&#39; 或 &apos;) 

& (&#38; 或 &amp;) 

lt(<) (&#60; 或 &lt;) 

gt(>) (&#62; 或 &gt;)
```

- 2、在特殊字符前添加（反斜杠\）

```xml

I\'m coming.
```

空格

```java

&#160; // 这个就代表着空格
```

## 特殊字符

- %格式化字符，多个占位符用数字表示

```xml

<string name="welcome_messages">Your First Var is %1$s! You Second Var is %2$d.</string>
```

# strings.xml放emoji

strings.xml是UTF-8编码，<br />直接将emoji放到strings.xml中，会报错：

```java

JNI DETECTED ERROR IN APPLICATION: input is not valid Modified UTF-8: illegal start byte 0xf0
```

```xml

<!--异常的-->

<string name="withdraw_share_title">👉最近很火的App🔥看新闻👀👀轻轻松松赚零花💰1元提现，秒到账！填写我的邀请码领额外现金红包：BX00100014 🔥 点击下载 👉 http://url.cn/51HKuI8</string>



<!--正确的-->

<string name="withdraw_share_title">&#x1F449;最近很火的App&#x1F525;看新闻&#x1F440;&#x1F440;轻轻松松赚零花&#x1F4B0;1元提现，秒到账！填写我的邀请码领额外现金红包：BX00100014 &#x1F525; 点击下载 &#x1F449; http://url.cn/51HKuI8</string>
```

- 方法1

需要将emoji换成unicode，然后放到strings.xml中去<br /><https://www.ifreesite.com/unicode/><br />这种方式部分手机不支持，如oppo a37m

- 方法2

用Java代码转换

```java

// greeting_3 is defined as: "hello there %1$s!"

String s = context.getString(R.string.greeting_3, "😜");

// OR:

String s = context.getString(R.string.greeting_3, new String(Character.toChars(0x1F61C)));
```

- 用Java代码拼接

```java

private String buildShareMsgWithEmojiStr() {

    StringBuilder sb = new StringBuilder();

    sb.append(getEmojiByUnicode(0x1F525));

    sb.append("最近很火的App");

    sb.append(getEmojiByUnicode(0x1F449));

    sb.append("看新闻");

    sb.append(getEmojiByUnicode(0x1F440));

    sb.append(getEmojiByUnicode(0x1F440));

    sb.append("轻轻松松赚零花");

    sb.append(getEmojiByUnicode(0x1F4B0));

    sb.append("1元提现，秒到账！\n");

    sb.append("填写我的邀请码领额外现金红包：" + UserCenter.getInstance().getInviteCode() + "\n");

    sb.append("点击下载");

    sb.append(getEmojiByUnicode(0x1F449));

    sb.append("http://url.cn/51HKuI8\n");

    return sb.toString();

}

public String getEmojiByUnicode(int unicode) {

    return new String(Character.toChars(unicode));

}
```

<https://stackoverflow.com/questions/26893796/how-set-emoji-by-unicode-in-a-textview>

---

使用在xml文件中定义的带有emoji表情内容的文字崩溃的问题

<https://github.com/chiemy/android-summary/issues/11>

<https://stackoverflow.com/questions/35792856/emoji-symbol-in-string-xml-crashes-app>

[https://stackoverflow.com/questions/24852806/how-can-i-put-ut‌f-16-characters-in-a‌ndroid-string-resour‌ce](https://stackoverflow.com/questions/24852806/how-can-i-put-ut%E2%80%8C%E2%80%8Bf-16-characters-in-a%E2%80%8C%E2%80%8Bndroid-string-resour%E2%80%8C%E2%80%8Bce)
