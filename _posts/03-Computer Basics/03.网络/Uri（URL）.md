---
date created: 2024-07-04 20:29
tags:
  - '#getQueryParameter'
  - '#fragment'
  - '#harvic'
  - '#`)，其中，(`+'
date updated: 2024-12-24 00:15
dg-publish: true
---

# URL Encode（Uri Encode）

## 什么是 URL Encode？

URL 编码（URL Encoding）：也称作百分号编码（Percent Encoding），是特定上下文的统一资源定位符 URL 的编码机制。URL 编码（URL Encoding）也适用于统一资源标志符（URI）的编码，同样用于 `application/x-www-form-urlencoded MIME` 准备数据。<br>中文不在 ASCII 字符中，因此中文出现在 URL 地址中时，需要进行编码；同时可书写的 ASCII 字符中，存在一些不安全字符也需要转码，如 `空格`（空格容易被忽略，也容易意想不到的原因引入）。

## 为什么需要 URL Encode？

因为根据 [rfc3986](https://tools.ietf.org/html/rfc3986#section-2.2) 规范所定义的，在 URL 中有一些字符是有保留字符，他们在 URL 中有着特殊含义，所以如果保留字符在 URL 中被用做其它用途的话，就必须使用 [Percent-Encoding](https://tools.ietf.org/html/rfc3986#section-2.1) 做 encode。<br>**通俗点：**<br>http 协议中参数的传输是 `key=value` 这种简直对形式的，如果要传多个参数就需要用 `&` 符号对键值对进行分割。如"? Name 1=value 1&name 2=value 2"，这样在服务端在收到这种字符串的时候，会用“&”分割出每一个参数，然后再用“=”来分割出参数值，在计算机中使用用 ASCII 码表示。<br>如果我的参数值中就包含=或&这种特殊字符的时候该怎么办。 <br>比如说 `name1=value1`, 其中 value 1 的值是“va&lu=e 1”字符串，那么实际在传输过程中就会变成这样 `name1=va&lu=e1`。我们的本意是就只有一个键值对，但是服务端会解析成两个键值对，这样就产生了歧义。<br>URL 编码只是简单的在特殊字符的各个字节前加上%，例如，我们对上述会产生奇异的字符进行 URL 编码后结果：`name1=va%26lu%3D`，这样服务端会把紧跟在“%”后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符。

## 编码原理

编码的原理可以表述为： `将需要转码的字符，按指定编码方式（默认使用UTF-8编码）转化为字节流，每个字节按16进制表示，并添加%组成一个percent编码`。

> 简言之：取出字符的 ASCII 码，转成 16 进制，然后前面加上百分号即可。如果是多字节的字符，则取出每一字节，按照同样的规则进行转换即可。例如问号? 的 ASCII 码为 63，转换为 16 进制为 3 F，所以%3 F 即为? 进行 Urlencode 编码的结果。

例如：汉字 “你好”

- UTF-8 字节流打印为：-28 -67 -96 -27 -91 -67
- 对应的 16 进制表示为：E 4 BD A 0 E 5 A 5 BD
- URLEncode 编译后为：%E 4%BD%A 0%E 5%A 5%BD

## 哪些字符需要转码？

### Value 中值**包含不安全的字符**

如 `**=**`、`**&**`**、中文**<br>两个概念

- Reserved (保留字符)是那些具有特殊含义的字符，例如：`/` 字符用于 URL 不同部分的分界符；
- Unreserved (非保留字符)没有特殊含义，包含 `希腊字母``数字``-``.``_``~`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1685191707326-afe7834e-dba6-4c5e-bb01-a98d24059eda.png#averageHue=%23f7f7f7&clientId=uaa015316-37d7-4&from=paste&height=219&id=u5255accd&originHeight=438&originWidth=1578&originalType=binary&ratio=2&rotation=0&showTitle=false&size=366643&status=done&style=none&taskId=uba2d347d-34ad-415a-8bd5-641c1186c9d&title=&width=789)<br>需要转码的字符：

1. 除了 Reserved (保留字符)和 Unreserved (非保留字符)之外的所有字符，均需要 percent 编码；
2. 某些情况下 Reserved (保留字符)也需要进行 percent 编码： 当 Reserved (保留字符)不用于 URL 分隔符，而是用于其他的位置，不代表某种特性的含义时，需要进行 percent 编码。例如：保留字符用于 URL 请求 query 后面的 value 中时，要对此时用到的 Reserved (保留字符)做 percent 编码；

**举例：**

1. ASCII 的控制字符： 这些字符都是不可打印的，自然需要进行转化。
2. 一些非 ASCII 字符：这些字符自然是非法的字符范围。转化也是理所当然的了。
3. 一些保留字符：很明显最常见的就是“&”了，这个如果出现在 url 中了，那你认为是 url 中的一个字符呢，还是特殊的参数分割用的呢？
4. 一些不安全的字符了：例如：空格。为了防止引起歧义，需要被转化为 `+`。

### 空格的编码有 `+` 和 `%20` 两种

1. 空格编码为 `+` 情况： 提交表单时请求时 `Content-Type：application/x-www-form-urlencoded` 的情况下，URL 请求查询字符串中出现空格时，需替换为+
2. 其他情况空格编码为 `%20`

## 什么需要 URL Encode

### Url 中的 host 需要 url encode 吗？

一般情况下，URL 的 host 部分不需要进行 URL 编码。Host 指的是标识特定网站或服务器的域名或 IP 地址。通常，主机名由字母、数字、连字符和点号组成，不包含需要编码的保留字符。然而，如果你的主机名包含特殊字符，比如空格、非 ASCII 字符或保留字符（如斜线或问号），你可能需要对这些特定字符进行 URL 编码。最好确保你的主机名符合标准的 URL 格式，不包含任何需要编码的字符。<br>url 中的 `/` 不需要 url encode<br>如 <https://www.yuque.com/hacket/matrix/oh9p2w01hurqgs9z> 就变成了 `https%3A%2F%2Fwww.yuque.com%2Fhacket%2Fmatrix%2Foh9p2w01hurqgs9z`

### 需要 URL 编码的部分？

原始链接：`http://www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4&va%26lu%3De1#harvic`<br>对 name 后编码后：`http://www.java2s.com:8080/yourpath/fileName.htm?name%3D%E5%A4%A7%E5%9C%A3%26stove%3D10%26path%3D32%26id%3D4%23harvic`<br>uri.GetQueryParameter ("name"); 获取到的为空，因为把 query 都给编码了

- Host 不需要 URL 编码
- URL 编码 value 的部分（value 带不安全的字符 `&``=``中文` 等）

#### Uri #getQueryParameter (key)能正确获取

获取 deeplink 中 data 参数：uri.GetQueryParameter ("data");

- Data 里有 url，url 有 1 个参数，data 后的数据都是没有 URL Encode

支持 `sheinlink://applink/pushtoweb2?data={"url":"https://api-shein.shein.com/h5/game/happy-flip/happy-flip2-us5test/invitation?abc=123"}`

- Data 里有 url，url 有 2 个参数，data 后的数据都是没有 URL Encode

不支持 `sheinlink://applink/pushtoweb2?data={"url":"https://api-shein.shein.com/h5/game/happy-flip/happy-flip2-us5test/invitation?abc=123&hacket=456"}`

- 对 data 后的 url 整体编码

支持 `sheinlink://applink/pushtoweb2?data={"url":"https%3A%2F%2Fapi-shein.shein.com%2Fh5%2Fgame%2Fhappy-flip%2Fhappy-flip2-us5test%2Finvitation%3Fabc%3D123%26hacket%3D456"}`

- 对 url 后的多个参数编码，编码第 1 个参数=后及后面的参数的部分，1 个参数的不用编码也支持

支持 `sheinlink://applink/pushtoweb2?data={"url":"https://api-shein.shein.com/h5/game/happy-flip/happy-flip2-us5test/invitation?abc%3D123%26hacket%3D456"}`

## 多次 UrlEncode？

不能多次 UrlEncode，否则 decode 会不对；可以多次 decode

# Uri

## URL 的组成部分

一个完整的 URL 分为很多个组成部分，如下图所示：

```
http://example.com:8042/over/there?name=ferret#nose
\__/   \______________/\_________/ \_________/ \__/
  |           |            |            |        |
scheme    authority       path        query   fragment
```

`[scheme:][//authority][path][?query][#fragment]` 或 `[scheme:][//host:port][path][?query][#fragment]`

- Scheme
  - 协议部分，常见的有 http, https, ftp 等
- Authority
  - 这部分较常见的就是一个域名，如www.google.com
  - 不那么常见的还会带上用户名、密码和端口信息
- Path
  - 路径部分，通常会有层次结构，path 可以有多个，每个用/连接；如/customers/100/orders
- Query
  - 参数部分，如搜索功能常用的 keyword=xxx
  - query 参数可以带有对应的值，也可以不带，如果带对应的值用 `=` 表示
  - query 参数可以有多个，每个用 `&` 连接
- Fragment
  - 这部分就是我们常说的 hash 部分，一般用来做页面内的定位
  - 不过在一些前端框架中会被用来作为页面跳转的定位
- 在 android 中，除了 scheme、authority 是必须要有的，其它的几个 path、query、fragment，它们每一个可以选择性的要或不要，但顺序不能变，比如：
  - 其中"path"可不要：scheme://authority? Query #fragment
  - 其中"path"和"query"可都不要：scheme://authority #fragment
  - 其中"query"和"fragment"可都不要：scheme://authority/path
  - "path","query","fragment"都不要：scheme://authority

## Android Uri API

以 `http://www.java2s.com:8080/yourpath/fileName.htm?stove=10&path=32&id=4#harvic` 为例

- GetScheme () : 获取 Uri 中的 scheme 字符串部分，在这里即，http
- getSchemeSpecificPart (): 获取 Uri 中的 scheme-specific-part: 部分，这里是：// [www.java2s.com:8080/yourpath/fileName.htm](http://www.java2s.com:8080/yourpath/fileName.htm)?
- GetFragment (): 获取 Uri 中的 Fragment 部分，即 harvic
- getAuthority (): 获取 Uri 中 Authority 部分，即www.java2s.com:8080
- GetPath (): 获取 Uri 中 path 部分，会 decode，即/yourpath/fileName.Htm
- GetEncodedPath�() 获取 path，不会 decode
- GetQuery (): 获取 Uri 中的 query 部分，会 decode，即 stove=10&path=32&id=4
- GetEncodedQuery�() 获取 query，不会 decode
- getHost (): 获取 Authority 中的 Host 字符串，即www.java2s.com
- GetPost (): 获取 Authority 中的 Port 字符串，即8080

案例：

```java
private void testUri() {
    String uriStr = "http://www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4&name1=va%26lu%3De1#harvic";
    printUri(uriStr);

    String uriStr2 = "http://www.java2s.com:8080/yourpath/fileName.htm?name%3D%E5%A4%A7%E5%9C%A3%26stove%3D10%26path%3D32%26id%3D4%23harvic";
    // 解码后：http://www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4#harvic
    printUri(uriStr2);
}
private void printUri(String uriStr) {
    Log.d("uri", "uriStr=" + uriStr);
    Uri uri = Uri.parse(uriStr);
    String scheme = uri.getScheme();
    Log.d("uri", "scheme=" + scheme);
    String schemeSpecificPart = uri.getSchemeSpecificPart();
    Log.d("uri", "schemeSpecificPart=" + schemeSpecificPart);

    String host = uri.getHost();
    Log.d("uri", "host=" + host);
    int port = uri.getPort();
    Log.d("uri", "port=" + port);

    String path = uri.getPath();
    Log.d("uri", "path=" + path);
    String encodedPath = uri.getEncodedPath();
    Log.d("uri", "encodedPath=" + encodedPath);
    List<String> pathSegments = uri.getPathSegments();
    Log.d("uri", "pathSegments=" + pathSegments);

    String query = uri.getQuery();
    Log.d("uri", "query: " + query);
    String encodedQuery = uri.getEncodedQuery();
    Log.d("uri", "encodedQuery: " + encodedQuery);
    String name = uri.getQueryParameter("name");
    Log.d("uri", "getQueryParameter: name=" + name);
    String name1 = uri.getQueryParameter("name1");
    Log.d("uri", "getQueryParameter: name1=" + name1);

    String fragment = uri.getFragment();
    Log.d("uri", "fragment=" + fragment);
}

```

结果：

> `uriStr=<http://www.java2s.com:8080/yourpath/fileName.htm?name=>大圣&stove=10&path=32&id=4&name 1=va%26 lu%3 De 1 #harvic
> Scheme=http
> schemeSpecificPart=// [www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4&name1=va&lu=e1](http://www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4&name1=va&lu=e1)
> host=[www.java2s.com](http://www.java2s.com)
> Port=8080
> Path=/yourpath/fileName. Htm
> EncodedPath=/yourpath/fileName. Htm
> PathSegments=[yourpath, fileName. Htm]
> Query: name=大圣&stove=10&path=32&id=4&name 1=va&lu=e 1
> EncodedQuery: name=大圣&stove=10&path=32&id=4&name 1=va%26 lu%3 De 1
> GetQueryParameter: name=大圣
> GetQueryParameter: name 1=va&lu=e 1
> Fragment=harvic`
>
> uriStr=<http://www.java2s.com:8080/yourpath/fileName.htm?name%3D%E5%A4%A7%E5%9C%A3%26stove%3D10%26path%3D32%26id%3D4%23harvic>
> Scheme=http
> schemeSpecificPart=// [www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4#harvic](http://www.java2s.com:8080/yourpath/fileName.htm?name=大圣&stove=10&path=32&id=4#harvic)
> host=[www.java2s.com](http://www.java2s.com)
> Port=8080
> Path=/yourpath/fileName. Htm
> EncodedPath=/yourpath/fileName. Htm
> PathSegments=[yourpath, fileName. Htm]
> query: name=大圣&stove=10&path=32&id=4 #harvic
> EncodedQuery: name%3 D%E 5%A 4%A 7%E 5%9 C%A 3%26 stove%3 D 10%26 path%3 D 32%26 id%3 D 4%23 harvic
> GetQueryParameter: name=null
> GetQueryParameter: name 1=null
> Fragment=null

# Java 和 JS Url encode

## JS 中的 `escape`、`encodeURI` 和 `encodeURIComponent`

### escape

`escape`是对字符串(`string`)进行编码(而另外两种是对URL)，作用是让它们在所有电脑上可读。编码之后的效果是`%XX`或者`%uXXXX`这种形式。其中 `ASCII字母` `数字` `@*/+` 这几个字符不会被编码，其余的都会。最关键的是，当你需要对URL编码时，请忘记这个方法，这个方法是针对字符串使用的，不适用于URL。

### `encodeURI` 和 `encodeURIComponent`

MDN文档：

- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI>
- <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent>

它们是为 URI 服务的函数，但二者的名字又有所区别，component 为组件、一部分的意思，现在就好理解了，如果需要对整个 uri 编码则用 encodeURI，如果对 uri 的部分编码则用 encodeURIComponent。

它们都是编码 URI，唯一区别就是编码的字符范围，其中 `encodeURI` 方法不会对下列字符编码： `ASCII字母`，`数字`，` ~!@#$&_()=:/,;?+'  `，`encodeURIComponent` 方法不会对下列字符编码：`ASCII 字母`，`数字`， `~!_()'`，所以 `encodeURIComponent` 比 `encodeURI` 编码的范围更大。

> `encodeURIComponent` 会把 `http://` 编码成 `http%3A%2F%2F` 而 `encodeURI` 却不会。

### 应用场景

- 如果只是编码字符串，不和URL有半毛钱关系，那么用escape
- 如果你需要编码整个 URL，然后需要使用这个 URL，那么用 encodeURI；encodeURIComponent 编码后浏览器访问不了
- 当你需要编码 URL 中的参数的时候，那么 encodeURIComponent 是最好方法；encodeURI 不会对 `&=` 编码导致取参数出错

```js
var param = "http://www.cnblogs.com/season-huang/"; // param为参数
param = encodeURIComponent(param);
var url = "http://www.cnblogs.com?next=" + param;
console.log(url) //"http://www.cnblogs.com?next=http%3A%2F%2Fwww.cnblogs.com%2Fseason-huang%2F"
```

### 测试1

**escape()**

```js
document.write(escape("+-*/._@ '()阳春三月"));
// 结果： +-*/._@%20%27%28%29%u9633%u6625%u4E09%u6708
// 从结果中可以看出，+-*/._@不会被编码，空格转成%20，单引号转成%27，圆括号转成%28和%29，四个汉字用Unicode编码成四个%uXXXX序列。

// 二次escape
document.write(escape(escape("+-*/._@ '()阳春三月")));
// +-*/._@%2520%2527%2528%2529%25u9633%25u6625%25u4E09%25u6708
// 可以看出，escape会编码已经escape过的字符%为%25
```

**encodeURI和encodeURIComponent**

```js
document.write(encodeURI("+-*/._@ '()"));
// +-*/._@%20'()
document.write(encodeURI("阳春三月"));
// %E9%98%B3%E6%98%A5%E4%B8%89%E6%9C%88
// encodeURI把每个中文字符都转成了%XX%XX%XX格式
```

**encodeURI 和 encodeURIComponent 区别：**  encodeURIComponent会编码encodeURI不管的(`, / ? : @ & = + $ #`)，其中，(`+ / @`)escape也不闻不问

```js
document.write(encodeURI(",/?:@&=+$#"));  
document.write(encodeURIComponent(",/?:@&=+$#"));
// 输出结果：  
// ,/?:@&=+$#  
// %2C%2F%3F%3A%40%26%3D%2B%24%23
```

总结：\
 - `escape` 是元老级的方法，很多浏览器表示都支持，适用于 html 字符编码\
 - `encodeURI` 和 `encodeURIComponent` 出道较晚，适用于 uri 字符编码，并且后者对很多 URI 中可能出现的特殊字符都进行编码

### 测试2

- JS 代码测试

```js
let url =
  'xxxlink://xxx.com/web/web?data={"title":"","url_from":"msp_cubes_featured_andshus_es","url":"https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER"}';
console.log(`原始链接：${url}`);

let encodeUrl1 = encodeURI(url);
console.log(`encodeURI后：${encodeUrl1}`);

let encodeUrl2 = encodeURIComponent(url);
console.log(`encodeURIComponent后：${encodeUrl2}`);

// 结果：
// 原始链接：xxxlink://xxx.com/web/web?data={"title":"","url_from":"msp_cubes_featured_andshus_es","url":"https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER"}
// encodeURI后：xxxlink://xxx.com/web/web?data=%7B%22title%22:%22%22,%22url_from%22:%22msp_cubes_featured_andshus_es%22,%22url%22:%22https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER%22%7D
// encodeURIComponent后：xxxlink%3A%2F%2Fxxx.com%2Fweb%2Fweb%3Fdata%3D%7B%22title%22%3A%22%22%2C%22url_from%22%3A%22msp_cubes_featured_andshus_es%22%2C%22url%22%3A%22https%3A%2F%2Fapi-xxx-us-gray01.shein.com%2Fh5%2Fcampaigns%2Fyangdddd%3Faod_id%3D%26anchor%3D%26styleType%3DIMMERSIVE_BANNER%22%7D
```

- Java 代码测试

```java
private static void urlEncodeTest() {  
    String urlOrigin = "xxxlink://xxx.com/web/web?data={\"title\":\"\",\"url_from\":\"msp_cubes_featured_andshus_es\",\"url\":\"https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER\"}";  
    System.out.println("urlOrigin: " + urlOrigin);  
  
    String data = "{\"title\":\"\",\"url_from\":\"msp_cubes_featured_andshus_es\",\"url\":\"https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER\"}";  
    String encodeData = URLEncoder.encode(data, Charset.defaultCharset());  
    String encodeUrl = "xxxlink://xxx.com/web/web?data=" + encodeData;  
    System.out.println("encodeUrl: " + encodeUrl);  
}
// 结果：
// urlOrigin: xxxlink://xxx.com/web/web?data={"title":"","url_from":"msp_cubes_featured_andshus_es","url":"https://api-xxx-us-gray01.shein.com/h5/campaigns/yangdddd?aod_id=&anchor=&styleType=IMMERSIVE_BANNER"}
// encodeUrl: xxxlink://xxx.com/web/web?data=%7B%22title%22%3A%22%22%2C%22url_from%22%3A%22msp_cubes_featured_andshus_es%22%2C%22url%22%3A%22https%3A%2F%2Fapi-xxx-us-gray01.shein.com%2Fh5%2Fcampaigns%2Fyangdddd%3Faod_id%3D%26anchor%3D%26styleType%3DIMMERSIVE_BANNER%22%7D
```

### Java 中的 `URLEncoder.encode`

- Java 代码中的 `URLEncoder.encode` 方法和 JS 的 `encodeURIComponent` 功能差不多，它会将处字母和数字，以及 `*` 字符外的都编码成 `%xx` 形式。
- JS的`unescape`和`decodeURI`都不能用来解码Java中`URLEncoder.encode`编码的字符串。
- 在 Java 代码中的 `URLEncoder.encode` 的字符串可以在 JS 中用 ` decodeURIComponent  `还原成字符串。
- 在Java代码中可以用`URLDecoder.decode(request.getParameter("param"),"UTF-8")`来将在JS中用`encodeURIComponent`的参数还原成字符串。
