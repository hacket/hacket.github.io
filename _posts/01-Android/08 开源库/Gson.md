---
date created: 2024-08-09 15:19
date updated: 2024-12-24 00:37
dg-publish: true
---

# Gson基本用法

项目主页：<https://github.com/google/gson>
用户指南：<https://github.com/google/gson/blob/master/UserGuide.md>

## 注解

### @SerializedName

1. 使用@SerializedName注解，可以将自定义的字段名与json数据里面的字段对应起来；
2. 需要gson序列化的model（一般定义为Bean类），一般不会混淆，因为混淆后，会导致Bean类里面的属性名字发生改变，然后gson反序列化就会找不到对应的属性名；也可以混淆，然后使用@serializedName来注释，这样当混淆后，反序列化通过注释来找到对应的字段。所以得出的推荐写法是，`用@serializedName来注释Bean对象类，这样即使把Bean对象类混淆了，也不会影响gson对象的反序列化`（序列化和反序列化都可以用该注解，而不是keep该实体类）。

## 1、添加依赖dependencies

`compile 'com.google.code.gson:gson :2.8.0'`

## 2、基本的序列化和反序列化

### 基本数据类型的生成（序列化）

```java
Gson gson = new Gson();
String jsonNumber = gson.toJson(100);       // 100
String jsonBoolean = gson.toJson(false);    // false
String jsonString = gson.toJson("String");  //"String"
```

### 基本数据类型的解析（反序列化）

```java
Gson gson = new Gson();
int i = gson.fromJson("100", int.class);              // 100
double d = gson.fromJson("99.99", double.class);  // 99.99
boolean b = gson.fromJson("true", boolean.class);     // true
String str = gson.fromJson("String", String.class);   // String
```

### 自定义类型生成（序列化）

```java
Gson gson = new Gson();
User user = new User("怪盗kidou",24);
String jsonObject = gson.toJson(user); // {"name":"怪盗kidou","age":24}
```

### 自定义类型解析（反序列化）

```java
String json = "{\"name\":\"hacket\",\"age\":24,\"email\":\"ikidou@example.com\"}";
User user = new Gson().fromJson(json, User.class);
```

## 3、服务端数据字段不一致 (`@SerializedName` 注解)

对于使用PHP作为后台开发语言时，php和js在命名时一般采用下划线风格，而Java中一般采用的驼峰法。

### 1) 一个字段不同

将json中email_address这个属性对应POJO的属性emailAddress，这样的话，很好的保留了前端、后台、Android/java各自的命名习惯。

```java
class User {
    public String name;
    public String age;
    /**
     * 将json中email_address这个属性对应POJO的属性变成emailAddress
     */
    @SerializedName("email_address")
    public String emailAddress;
}
```

### 2) 为POJO字段提供备选属性名，如三个字段(email_address、email、emailAddress)都中出现任意一个时均可以，用`alternate`注解。

如果接中设计不严谨或者其它地方可以重用该类，其它字段都一样，就emailAddress字段不一样

```java
public class User {
    public String name;
    public String age;
    /**
     * 将json中email_address或者email这个属性对应POJO的属性变成emailAddress
     */
    @SerializedName(value = "emailAddress", alternate = {"email", "email_address"})
    public String emailAddress;
}

String json1 = "{\"name\":\"hacket1\",\"age\":24,\"emailAddress\":\"hacket1@example.com\"}";
String json2 = "{\"name\":\"hacket2\",\"age\":25,\"email_address\":\"hacket2@example.com\"}";
String json3 = "{\"name\":\"hacket3\",\"age\":26,\"email\":\"hacket3@example.com\"}";
User user = new Gson().fromJson(json1, User.class);
User user1 = new Gson().fromJson(json2, User.class);
User user2 = new Gson().fromJson(json3, User.class);
```

### 3) 当多种情况同时出时，以最后一个出现的值为准。

```java
Gson gson = new Gson();
String json = "{\"name\":\"怪盗kidou\",\"age\":24,\"emailAddress\":\"ikidou_1@example.com\",\"email\":\"ikidou_2@example.com\",\"email_address\":\"ikidou_3@example.com\"}";
User user = gson.fromJson(json, User.class);
System.out.println(user.emailAddress); // ikidou_3@example.com
```

## 4、数组 (`String[].class`)

```java
String jsonArray = "[\"Android\",\"Java\",\"PHP\"]";
String[] array = new Gson().fromJson(jsonArray, String[].class);
```

## 5、集合

对于List将上面的代码中的`String[].class` 直接改为`List<String>.class` 是行不通的。对于Java来说`List<String>`  和`List<User>`  这俩个的字节码文件只一个那就是`List.class`，这是Java泛型使用时要注意的问题 **泛型擦除**。
Gson为我们提供了`TypeToken`来实现对泛型的支持

```java
String jsonArray = "[\"Android\",\"Java\",\"PHP\"]";
List<String> list = new Gson().fromJson(jsonArray, new TypeToken<List<String>>() {
}.getType());
```

**注：** `TypeToken`的构造方法是_protected_修饰的,所以上面才会写成`new TypeToken<List<String>>() {}.getType() 而不是 new TypeToken<List<String>>().getType()`

## 6、利用泛型解析抽取公共数据bean

**更方便的见：Gson之泛型.md**
泛型的引入可减少无关的代码，如我现在所在公司接口返回的数据分为两类：

```json
{"code":"0","message":"success","data":[{"name":"hacket","age":24},{"name":"hacket22","age":22}]}
{"code":"0","message":"success","data":{"name":"hacket","age":24}}
```

我们真正需要的`data`所包含的数据，而`code`只使用一次，`message`则几乎不用。如果Gson不支持泛型或不知道Gson支持泛型的同学一定会这么定义POJO。

```java
class DataResponse {
    public int code;
    public String message;
    public Data data;
}
```

和

```java
class DataListResponse {
    public int code;
    public String message;
    public List<Data> data;
}
```

当其它接口的时候又重新定义一个XXResponse将data的类型改成XX，很明显code，和message被重复定义了多次，通过泛型的话我们可以将code和message字段抽取到一个Response的类中，这样我们只需要编写data字段所对应的POJO即可，更专注于我们的业务逻辑。

```java
class Response<T> {
    public int code;
    public String message;
    public T data;
}
```

那么对于data字段是User时则可以写为`Response<Data>`,当是个列表的时候为 `Response<List<Data>>`，其它同理。
完整示例：

```java
/**
 * {"code":"0","message":"success","data":{}}
 * <p/>
 * {"code":"0","message":"success","data":[]}
 */
private void genericDemo() {
    String json1 = "{\"code\":\"0\",\"message\":\"success\",\"data\":{\"name\":\"hacket\",\"age\":24}}";
    String json2 = "{\"code\":\"0\",\"message\":\"success\",\"data\":[{\"name\":\"hacket\",\"age\":24},"
            + "{\"name\":\"hacket22\",\"age\":22}]}";
    //  普通的写法
    //        DataResponse dataResponse = new Gson().fromJson(json1, DataResponse.class);
    //        LogUtil.d(TAG, dataResponse);
    //        DataListResponse dataListResponse = new Gson().fromJson(json2, DataListResponse.class);
    //        LogUtil.d(TAG, dataListResponse);

    // 引入泛型
    // JSON_Object写法
    Gson gson = new Gson();
    Type dataType = new TypeToken<Response<Data>>() {
    }.getType();
    Response<Data> dataResponse = gson.fromJson(json1, dataType);
    LogUtil.d(TAG, dataResponse.data);
    // JSON_ARRAY写法
    Type dataListType = new TypeToken<Response<List<Data>>>() {
    }.getType();
    Response<List<Data>> dataListResponse = gson.fromJson(json2, dataListType);
    LogUtil.d(TAG, dataListResponse.data);
}

class Response<T> {
    public int code;
    public String message;
    public T data;
}

class DataResponse {
    public int code;
    public String message;
    public Data data;
}

class DataListResponse {
    public int code;
    public String message;
    public List<Data> data;
}

class Data {
    public String name;
    public int age;
}
```

## GsonBuilder

GsonBuilder，用于构建Gson实例的一个类，要想改变Gson默认的设置必须使用该类配置Gson

### 输出null值的键

Gson在默认情况下是不输出`值为null的键`

```java
public class User {
    public String name;
    public int age;
    public String email;
}

Gson gson = new Gson();
User user = new User("hacket", "24");
String json = gson.toJson(user);
// {"age":"24","name":"hacket"}
```

配置输出`值为null的键`

```
gson = new GsonBuilder()
    .serializeNulls()
    .create();
String json = gson.toJson(user);
// {"age":"24","emailAddress":null,"name":"hacket"}
```

### 其他

日期格式，格式化输出，禁止转义html标签等

```java
Gson gson = new GsonBuilder()
    // 序列化null
    .serializeNulls()
    // 设置日期时间格式，另有2个重载方法
    // 在序列化和反序化时均生效
    .setDateFormat("yyyy-MM-dd")
    // 禁此序列化内部类
    .disableInnerClassSerialization()
    //生成不可执行的Json（多了 )]}' 这4个字符）
    .generateNonExecutableJson()
    //禁止转义html标签
    .disableHtmlEscaping()
    //格式化输出
    .setPrettyPrinting()
    .create();
```

案例：

```java
User user = User.create("hacket", "24", null, new Date(System.currentTimeMillis()));
Gson gson = new GsonBuilder()
    // 序列化null
    .serializeNulls()
    // 设置日期时间格式，另有2个重载方法
    // 在序列化和反序化时均生效
    .setDateFormat("yyyy-MM-dd")
    // 禁此序列化内部类
    .disableInnerClassSerialization()
    // 生成不可执行的Json（多了 )]}' 这4个字符）
    // .generateNonExecutableJson()
    //禁止转义html标签
    .disableHtmlEscaping()
    //格式化输出
    .setPrettyPrinting()
    .create();

json = gson.toJson(user);
```

效果：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688054789472-baa40f76-ea17-4eef-aba3-fffe2cc457db.png#averageHue=%232b2b2b&clientId=u4a035a78-9dee-4&from=paste&height=111&id=u65e9a28b&originHeight=166&originWidth=342&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=15152&status=done&style=none&taskId=ud3da1265-7dd2-41e3-be14-7c9fa998f9c&title=&width=228)

## Gson序列化字段过滤

### 基于@Expose注解(需要[反]序列化的字段加上该注解)

**使用方法：** 简单说来就是需要导出的字段上加上[@Expose ](/Expose) 注解，不导出的字段不加。 **注意是不导出的不加**。

`@Expose`提供了两个属性，且都有默认值，开发者可以根据需要设置不同的值
`@Expose`注解从名字上就可以看出是暴露的意思，所以该注解是用于对处暴露字段的。可是我们以前用Gson的时候也没有`@Expose`注解还是不正确的序列化为JSON了么?是的，所以该注解在使用new Gson() 时是不会发生作用。毕竟最常用的API要最简单，所以该注解必须和GsonBuilder配合使用。

- serialize，序列化，Java Object→JSON strings
- deserialize，反序列化，JSON strings→Java Object

```java
public final class Category {

    @Expose(serialize = false)
    public int id;

    @Expose
    public String name;

    @Expose(deserialize = false, serialize = false)
    public String type;
}
```

序列化：

```java
Category category = new Category(1010, "name_hacket", "hacket_type");
gson = new GsonBuilder()
        .excludeFieldsWithoutExposeAnnotation()
        .create();
String json = gson.toJson(category);
```

结果，id和type的`serialize`为false表示需要过滤，所以只有name一个需要序列化。

```
{"name": "name_hacket"}
```

反序列化：

```java
Category category1 = gson.fromJson(jsonOrigin, Category.class);
```

结果，type的`deserialize`值为false表示需要过滤，id和name没有设置默认为true，所以需要反序列化：

```
Category{id=1010, name='name_hacket', type='null'}
```

### 基于版本`@Since`和`@Until`

Gson在对基于版本的字段导出提供了两个注解 `@Since` 和 `@Until`,和`GsonBuilder.setVersion(Double)`配合使用。`@Since` 和 `@Until`都接收一个`Double`值。
使用方法：当前版本(GsonBuilder中设置的版本) **大于等于Since**的值时该字段导出，**小于Until**的值时该该字段导出。

- [@Since ](/Since) >= version 导出
- [@Until ](/Until) < version 导出

案例

```java
public final class SinceUntilSample {
    @Since(4)
    public String since;

    @Until(5)
    public String until;
}
private void sineUtilTest(double version) {
    SinceUntilSample sinceUntilSample = new SinceUntilSample();
    sinceUntilSample.since = "since";
    sinceUntilSample.until = "until";
    Gson gson = new GsonBuilder().setVersion(version).create();
    LogUtil.i(TAG, "version :" + version + "-------" + gson.toJson(sinceUntilSample));
}
```

测试

```java
sineUtilTest(3); // version :3.0-------{"until":"until"}
sineUtilTest(4); // version :4.0-------{"since":"since","until":"until"}
sineUtilTest(5); // version :5.0-------{"since":"since"}
sineUtilTest(6); // version :6.0-------{"since":"since"}
```

### 基于访问修饰符

#### private,final,static等修饰符 （需要配合GsonBuilder.excludeFieldsWithModifiers）

需要结合`GsonBuilder`使用。使用`GsonBuilder.excludeFieldsWithModifiers`构建gson,支持`int`形的**可变参数**，值由`java.lang.reflect.Modifier`提供。
案例

```java
public final class ModifierSample {
    final String finalField = "final";
    static String staticField = "static";
    public String publicField = "public";
    protected String protectedField = "protected";
    String defaultField = "default";
    private String privateField = "private";
}

ModifierSample modifierSample = new ModifierSample();
Gson gson = new GsonBuilder()
        .excludeFieldsWithModifiers(Modifier.FINAL, Modifier.STATIC, Modifier.PRIVATE)
        .create();
String json = gson.toJson(modifierSample); // {"defaultField":"default","protectedField":"protected","publicField":"public"}
```

#### transient/[@Transient ](/Transient)

加了transient的字段不参与序列化和反序列化

```java
public class Test_transient {

    public static void main(String[] args) {

        Gson gson = new Gson();
        // 序列化
        TestTran testTran = new TestTran();
        testTran.money = 12.0;
        String r = gson.toJson(testTran);
        System.out.println(r);
        // {"name":"hacket","age":29,"hh":false,"ff":"fff"}
        
        // 反序列化
        String rr = "{\"name\":\"hacket\",\"age\":29,\"hh\":false,\"ff\":\"fff\",\"money\":10.0}";
        TestTran testTran1 = gson.fromJson(rr, TestTran.class);
        System.out.println(testTran1);
        // TestTran{name='hacket', age=29, hh=false, ff='fff', money=0.0}
    }

    public static class TestTran {
        public String name = "hacket";
        public int age = 29;
        private boolean hh = false;
        protected String ff = "fff";

        public transient double money;

        @Override
        public String toString() {
            return "TestTran{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    ", hh=" + hh +
                    ", ff='" + ff + '\'' +
                    ", money=" + money +
                    '}';
        }
    }
}
```

- kotlin

```kotlin
@Transient
private var mEtInput: EditText? =null
```

### 基于策略（自定义规则）-- 常用

基于策略是利用Gson提供的`ExclusionStrategy`接口

1. addSerializationExclusionStrategy(ExclusionStrategy) 排除规则应用在serialization
2. addDeserializationExclusionStrategy(ExclusionStrategy) 排除规则应用在deserialization
3. setExclusionStrategies 排除规则应用在serialization and deserialization

- 注意ExclusionStrategy不能传null
- shouldSkipClass/shouldSkipField返回true，排除；false不排除
- 如果带有`@SerializedName`，用实际字段名
- 案例1，addSerializationExclusionStrategy：

```java
public final class ExclusionStrategySample {
    public String finalField = "finalField";
    public String name = "hacket";
    @Expose(deserialize = false, serialize = true)
    public String sex = "male";
    @Expose
    public String hair = "black";
    public int age = 24;
    public Integer age2 = 25;
}
```

测试

```java
ExclusionStrategySample exclusionStrategySample = new ExclusionStrategySample();
Gson gson = new GsonBuilder()
        .addSerializationExclusionStrategy(new ExclusionStrategy() {
            @Override
            public boolean shouldSkipField(FieldAttributes f) {
                // 这里作判断，决定要不要排除该字段,return true为排除

                // 按字段名排除
                if ("finalField".equals(f.getName())) {
                    return true;
                }

                // 按注解排除
                Expose expose = f.getAnnotation(Expose.class);
                if (expose != null && expose.deserialize() == false) {
                    return true;
                }
                return false;
            }

            @Override
            public boolean shouldSkipClass(Class<?> clazz) {
                // 直接排除某个类 ，return true为排除
                return (clazz == int.class || clazz == Integer.class);
            }
        })
//                .addDeserializationExclusionStrategy(null)
        .create();

String json = gson.toJson(exclusionStrategySample); // {"hair":"black","name":"hacket"}
```

案例2：setExclusionStrategies 聊天室过滤字段：

```kotlin
fun save(musicLists: List<AudioBean>) {
    val gson = GsonUtils.defaultGsonBuilder()
            .setExclusionStrategies(object : ExclusionStrategy {
                override fun shouldSkipField(f: FieldAttributes): Boolean {
                    // 过滤掉字段名包含"age"
                    // return f.getName().contains("age")
                    val filter = AudioBean.filter()
                    for (v in filter) {
                        if (f.name == v)
                            return true
                    }
                    return false

                }

                override fun shouldSkipClass(clazz: Class<*>): Boolean {
                    // 过滤掉 类名包含 Bean的类
                    // return clazz.name.contains("Bean")
                    return false
                }
            })
            .create()
    val jsonData = gson.toJson(musicLists)
    SPUtils.getInstance().put(Constant.KEY_SAVED_BG_MUSIC_LIST, jsonData)
    LogUtils.i(TAG, "${anchor("save MusicLists")}保存已选背景音乐列表到本地：${musicLists.log()}，" +
            "保存成功？json：$jsonData")
}
```

- 案例3：排除某个字段不参与序列化，通常这个model是共用的，只是某种情况下，某些字段不需要

```
val gson = GsonBuilder()
    .setExclusionStrategies(object : ExclusionStrategy {
        override fun shouldSkipClass(clazz: Class<*>?): Boolean {
            return false
        }

        override fun shouldSkipField(f: FieldAttributes?): Boolean {
            if (f == null) return true
            return f.name.contains("progressCount") // 过滤掉progressCount字段
        }
    })
    .create()
```

### 字段映射规则setFieldNamingPolicy和setFieldNamingStrategy

#### 默认实现之setFieldNamingPolicy

`GsonBuilder.setFieldNamingPolicy` 方法与Gson提供的另一个枚举类`FieldNamingPolicy`配合使用，该枚举类提供了5种实现方式分别为：

| FieldNamingPolicy            | 说明               | 结果                                                                                                |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| IDENTITY                     | 默认               | `{"email_address":"hacket@useus.cn","myAgeHaha":24,"myGender":"male","myNameHaha":"hacket"}`      |
| LOWER_CASE_WITH_DASHES       | 驼峰大写的字母变小写前面带破折号 | `{"email_address":"hacket@useus.cn","my-age-haha":24,"my-gender":"male","my-name-haha":"hacket"}` |
| LOWER_CASE_WITH_UNDERSCORES  | 驼峰大写的字母变小写前面带下划线 | `{"email_address":"hacket@useus.cn","my_age_haha":24,"my_gender":"male","my_name_haha":"hacket"}` |
| UPPER_CAMEL_CASE             | 驼峰表示             | `{"email_address":"hacket@useus.cn","MyAgeHaha":24,"MyGender":"male","MyNameHaha":"hacket"}`      |
| UPPER_CAMEL_CASE_WITH_SPACES | 拆分驼峰用空格分隔        | `{"email_address":"hacket@useus.cn","My Age Haha":24,"My Gender":"male","My Name Haha":"hacket"}` |

**Note:**   `@SerializedName`注解拥有最高优先级，在加有`@SerializedName`注解的字段上`setFieldNamingPolicy()`不生效。
案例：

```java
public final class FieldNameSample {
    public String myNameHaha;
    public int myAgeHaha;
    public String myGender;
    @SerializedName(value = "email_address", alternate = {"email", "emial_address"})
    public String emialAddress;
}

// 使用
FieldNameSample fieldNameSample = new FieldNameSample("hacket@useus.cn", "male", 24, "hacket");

// FieldNamingPolicy.IDENTITY
Gson gson = new GsonBuilder()
        .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
        .create();
```

#### 自定义实现之setFieldNamingStrategy

`GsonBuilder.setFieldNamingStrategy` 方法需要与Gson提供的`FieldNamingStrategy`接口配合使用，用于实现将POJO的字段与JSON的字段相对应。上面的`FieldNamingPolicy`实际上也实现了`FieldNamingStrategy`接口，也就是说`FieldNamingPolicy`也可以使用`setFieldNamingStrategy`方法。

```java
FieldNameSample fieldNameSample = new FieldNameSample("hacket@useus.cn", "male", 24, "hacket");
Gson gson = new GsonBuilder()
        .setFieldNamingPolicy(FieldNamingPolicy.IDENTITY)
        .setFieldNamingStrategy(new FieldNamingStrategy() {
            @Override
            public String translateName(Field f) {
                String name = f.getName();
                // 实现自己的规则，前面加个标记hacket
                return "hacket_" + name;
            }
        })
        .create();
String json = gson.toJson(fieldNameSample);
Log.i(TAG, json); // {"email_address":"hacket@useus.cn","hacket_myAgeHaha":24,"hacket_myGender":"male","hacket_myNameHaha":"hacket"}
```

**注意：** `@SerializedName`注解拥有最高优先级，在加有`@SerializedName`注解的字段上`FieldNamingStrategy`不生效！`setFieldNamingPolicy`和`setFieldNamingStrategy`同时存在，`setFieldNamingStrategy`生效。

### Reference

- [ ] 你真的会用Gson吗?Gson使用指南（三）- 过滤

<http://www.jianshu.com/p/0e40a52c0063>

## Gson 解析long

- [ ] Gson doesn't deserialise Long numbers correctly

<https://github.com/google/gson/issues/1084>

## List和Map序列化，反序列化

```java
public class TestGsonMap {

    public static void main(String[] args) {
        testGsonList();
        System.out.println("-----------------");
        testGsonMap();
    }

    private static void testGsonList() {

        List<TestGsonMapBean> list = new ArrayList<>();
        list.add(new TestGsonMapBean(1L, "hacket1"));
        list.add(new TestGsonMapBean(2L, "hacket2"));
        list.add(new TestGsonMapBean(3L, "hacket3"));
        list.add(new TestGsonMapBean(4L, "hacket4"));
        String json = new Gson().toJson(list);
        System.out.println(json); // [{"name":"hacket1","id":1},{"name":"hacket2","id":2},{"name":"hacket3","id":3},{"name":"hacket4","id":4}]

        Type type = new TypeToken<List<TestGsonMapBean>>() {
        }.getType();
        List<TestGsonMapBean> list2 = new Gson().fromJson(json, type);
        System.out.println(list2); // [TestGsonMapBean{name='hacket1', id=1}, TestGsonMapBean{name='hacket2', id=2}, TestGsonMapBean{name='hacket3', id=3}, TestGsonMapBean{name='hacket4', id=4}]
    }


    private static void testGsonMap() {
        HashMap map = new HashMap<Long, TestGsonMapBean>();
        map.put(1L, new TestGsonMapBean(1L, "hacket1"));
        map.put(2L, new TestGsonMapBean(2L, "hacket2"));
        map.put(3L, new TestGsonMapBean(3L, "hacket3"));
        map.put(4L, new TestGsonMapBean(4L, "hacket4"));
        String json = new Gson().toJson(map);
        System.out.println(json); // {"1":{"name":"hacket1","id":1},"2":{"name":"hacket2","id":2},"3":{"name":"hacket3","id":3},"4":{"name":"hacket4","id":4}}

        Type type = new TypeToken<Map<Long, TestGsonMapBean>>() {
        }.getType();
        Map<Long, TestGsonMapBean> map2 = new Gson().fromJson(json, type);
        System.out.println(map2); // {1=TestGsonMapBean{name='hacket1', id=1}, 2=TestGsonMapBean{name='hacket2', id=2}, 3=TestGsonMapBean{name='hacket3', id=3}, 4=TestGsonMapBean{name='hacket4', id=4}}
    }
}

class TestGsonMapBean {
    String name;
    long id;

    public TestGsonMapBean(long id, String name) {
        this.name = name;
        this.id = id;
    }

    @Override
    public String toString() {
        return "TestGsonMapBean{" +
                "name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
```

### Map生成Json（序列化）

数据bean，Person

```java
public final class Person {
    public String name;
    public String gender;
    public int age;
    public Person(String name, String gender, int age) {
        this.name = name;
        this.gender = gender;
        this.age = age;
    }
    @Override
    public String toString() {
        return name + "--" + gender + "--" + age;
    }
}
```

序列化：

```java
Gson gson = new GsonBuilder()
        .enableComplexMapKeySerialization()
        .create();

Map<Person, String> map1 = new LinkedHashMap<>(); // 使用LinkedHashMap将结果按先进先出顺序排列
map1.put(new Person("hacket", "male", 24), "aa");
map1.put(new Person("hacket1", "female", 25), "bb");
```

如果没有设置`.enableComplexMapKeySerialization()`，结果为

```json
{"hacket--male--24":"aa","hacket1--female--25":"bb"}
```

设置了`.enableComplexMapKeySerialization()`

```json
[[{"age":24,"gender":"male","name":"hacket"},"aa"],[{"age":25,"gender":"female","name":"hacket1"},"bb"]]
```

### Map反序列化

```java
Type type = new TypeToken<Map<Person, String>>() {
}.getType();
Map<Person, String> map2 = gson.fromJson(json, type);
```

## Gson 反序列化 Kotlin 数据类默认值失效

### 案例

最近开发的时候遇到一个问题，服务端的一个接口返回的 Json 中去掉了一个字段，客户端在使用 Gson 解析出的这个数据类的时候报空崩溃了。我在排查这个问题的时候发现这个数据类的这个字段是给了默认值的，但是解析的时候却赋值为 null，而另外一个接口也有少了几个字段的情况，但是这个接口的数据类的这些变量默认值却是生效的。

### 原因

```kotlin
// 默认值生效
data class Person(@SerializedName("name")val name:String = "no_name",
                  @SerializedName("age")val age:Int = -1)
// 默认值不生效
data class Dog(@SerializedName("name")val name:String = "no_name",
               @SerializedName("age")val age:Int)
```

data class所有属性都设置了默认值后，生成的Java有一个默认构造函数(无参)，只要其中有一个没有设置默认值，就没有默认构造函数。
Gson解析时，会先用默认构造函数，这样可以用默认值；如果没有默认构造函数，从堆中构造，绕过了构造器，导致默认值无法覆盖。
Gson构造对象时，如果类没有默认构造器，就会通过Unsafe类构造对象。这时会绕过类的构造方法

```java
# ReflectiveTypeAdapterFactory.create
@Override 
public <T> TypeAdapter<T> create(Gson gson, final TypeToken<T> type) {
	Class<? super T> raw = type.getRawType();
	
	if (!Object.class.isAssignableFrom(raw)) {
	  return null; // it's a primitive!
	}
	
	ObjectConstructor<T> constructor = constructorConstructor.get(type);
	return new Adapter<T>(constructor, getBoundFields(gson, type, raw));
}


# ConstructorConstructor.get
public <T> ObjectConstructor<T> get(TypeToken<T> typeToken) {
    final Type type = typeToken.getType();
    final Class<? super T> rawType = typeToken.getRawType();
	
	// ...省略一些缓存容器相关代码

    ObjectConstructor<T> defaultConstructor = newDefaultConstructor(rawType);
    if (defaultConstructor != null) {
      return defaultConstructor;
    }

    ObjectConstructor<T> defaultImplementation = newDefaultImplementationConstructor(type, rawType);
    if (defaultImplementation != null) {
      return defaultImplementation;
    }

    // finally try unsafe
    return newUnsafeAllocator(type, rawType);
}
```

### 解决

1. data class所有属性都设置一个默认值(属性声明在构造函数，所有参数都带默认值)
2. 不确定的参数声明为可空
3. 回归到Java的写法即可
4. 替换Gson，用moshi? 好像也不行、

```java
public class StringAdapter extends TypeAdapter<String> {

    public String read(JsonReader in) throws IOException {
        JsonToken peek = in.peek();
        if (peek == JsonToken.NULL) {
            in.nextNull();
            return "";
        }
        /* coerce booleans to strings for backwards compatibility */
        if (peek == JsonToken.BOOLEAN) {
            return Boolean.toString(in.nextBoolean());
        }
        String s = in.nextString();
        if ("null".equalsIgnoreCase(s)) {
            return "";
        }
        return s;
    }

    public void write(JsonWriter writer, String value) throws IOException {
        if (value == null) {
            writer.value("");
            return;
        }
        writer.value(value);
    }
}


public class MyTypeAdapterFactory implements TypeAdapterFactory {

    @SuppressWarnings("unchecked")
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {

        Class rawType = type.getRawType();
        if (rawType == String.class) {
            return (TypeAdapter<T>) new StringAdapter();
        }
//        if (rawType == int.class) {
//            return (TypeAdapter<T>) new IntegerAdapter();
//        }
//        if (rawType == boolean.class)
//            return (TypeAdapter<T>)new BooleanAdapter();
//        if (rawType == double.class)
//            return (TypeAdapter<T>)new DoubleAdapter();
//        if (rawType == float.class)
//            return (TypeAdapter<T>)new FloatAdapter();
        return null;
    }
}
```

### Ref

- [x] Android避坑指南，Gson与Kotlin碰撞出一个不安全的操作

<https://juejin.im/post/5ede5adcf265da7714711d02>

- [ ] Kotlin null safety

<https://github.com/google/gson/issues/1148>

- [ ] Gson 反序列化 Kotlin 数据类默认值失效

<https://extremej.itscoder.com/gson_kotlin_data_class/>

- [ ] kotlin gson反序列化默认值失效

<https://juejin.im/post/5c1b1d346fb9a049d61d7dcc>

- [ ] <https://github.com/JakeWharton/retrofit2-kotlinx-serialization-converter>

## Gson之枚举转换

### Gson中枚举默认行为

Gson默认不支持枚举的，默认序列化是枚举值的String值

```java
public enum Day implements GsonEnum<Day> {
    MONDAY("星期一"),
    TUESDAY("星期二"),
    WEDNESDAY("星期三"),
    THURSDAY("星期四"),
    FRIDAY("星期五"),
    SATURDAY("星期六"),
    SUNDAY("星期日"),
    NONE("不存在");
}
```

如`Day.MONDAY`，默认序列化后的String为`MONDAY`

### 自定义Gson枚举序列化反序列化

#### 枚举←→int

```java
public enum Week {

    MONDAY("星期一"),
    TUESDAY("星期二"),
    WEDNESDAY("星期三"),
    THURSDAY("星期四"),
    FRIDAY("星期五"),
    SATURDAY("星期六"),
    SUNDAY("星期日"),
    NONE("不存在");

    private String name;

    Week(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static final class EnumSerializer implements JsonSerializer<Week>, JsonDeserializer<Week> {

        @Override
        public JsonElement serialize(Week src, Type typeOfSrc, JsonSerializationContext context) {
            return new JsonPrimitive(src.ordinal());
        }

        @Override
        public Week deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            int asInt = json.getAsInt();
            if (asInt < Week.values().length) {
                return Week.values()[asInt];
            }
            return null;
        }
    }

}
```

### 枚举通用封装

```java
// GsonEnumTypeAdapter
public class GsonEnumTypeAdapter<E extends Enum, V> implements JsonSerializer<E>, JsonDeserializer<E> {

    private final IGsonEnumAdapter<E, V> mGsonEnumAdapter;

    public GsonEnumTypeAdapter(IGsonEnumAdapter<E, V> gsonEnumAdapter) {
        this.mGsonEnumAdapter = gsonEnumAdapter;
    }

    @Override
    public JsonElement serialize(E src, Type typeOfSrc, JsonSerializationContext context) {
        if (null != src && src instanceof IGsonEnumAdapter) {
            V serializeValue = mGsonEnumAdapter.serialize(src);

//            Class<?> classOfPrimitive = serializeValue.getClass();
//            if (classOfPrimitive.isAssignableFrom(int.class)) {
//                Integer integer = (Integer) serializeValue;
//                return new JsonPrimitive(integer.intValue());
//            }
            if (serializeValue instanceof String) {
                return new JsonPrimitive((String) serializeValue);
            } else if (serializeValue instanceof Boolean) {
                return new JsonPrimitive((Boolean) serializeValue);
            } else if (serializeValue instanceof Number) {
                return new JsonPrimitive((Number) serializeValue);
            } else if (serializeValue instanceof Character) {
                return new JsonPrimitive((Character) serializeValue);
            }
        }
        return null;
    }

    @Override
    public E deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        if (null != json) {
            return mGsonEnumAdapter.deserialize(json);
        }
        return null;
    }

}

// ----- IGsonEnumAdapter
/**
 * 枚举序列化，反序列化接口
 *
 * @param <E> 具体的枚举
 * @param <V> 只能是Number,String,Boolean,Character
 */
interface IGsonEnumAdapter<E extends Enum, V> {

    V serialize(@NonNull E e);

    E deserialize(@NonNull JsonElement json);

}
```

### 案例

```java
enum class DeeplinkType(val type: Int, val desc: String) {
    DEFAULT(0, ""),
    SHEIN_NEW_DEEPLINK(1, "Shein 新deeplink(sheinlink://shein.com/xxx)"),
    SHEIN_OLD_DEEPLINK(2, "Shein 旧deeplink(sheinlink://xxx)"),
    SHEIN_ONELINK(3, "Shein onelink"),
    ROMWE_DEEPLINK(4, "Romwe deeplink(romwelink://)"),
    ROMWE_ONELINK(5, "Romwe onelink"),
    OTHERS(6, "其他(如跳转到M端，通过DeepLink)"),
}
// json/shein_deeplink.json
[
  {
    "t": 1,
    "d": "新版shein app deeplink"
  },
  {
    "l": "sheinlink://shein.com/trial/trial_center_home?url_from=MXADTW-ANDROID-OTHER-230507-video-TMPL-TTCX-J-nolink-tagid-QJT3O-mixcatid-351",
    "d": "试用中心",
    "t": 0
  },
  {
    "t": 2,
    "d": "旧版shein app deeplink"
  },
  {
    "l": "sheinlink://applink/category?data={\"category_id\":\"1727\",\"top_goods_id\":\"14809350\"}",
  }
]
// 代码
fun load(context: Context): MutableList<DeeplinkItem>? {
    // 读取shein_deeplink.json文件并解析它的content属性
    val jsonContent = loadJsonFromAsset(context, "json/shein_deeplink.json")
    val gson = GsonBuilder()
        .registerTypeAdapter(DeeplinkType::class.java, EnumSerializer())
        .create()
    val items = gson.fromJson<MutableList<DeeplinkItem>>(jsonContent, object : TypeToken<MutableList<DeeplinkItem>>() {}.type)
    return items
}
```

# Gson之泛型擦除

## Gson中的泛型擦除问题总结

1. 用自定义的ParameterizedType
2. 用Gson自带的TypeToken
3. 用Gson自带的$Gson$Types.newParameterizedTypeWithOwner()

## 问题描述

json模板

```
// data 为 object 的情况
{"code":"0","message":"success","data":{}}

// data 为 array 的情况
{"code":"0","message":"success","data":[]}
```

其中bean为：

```java
// BaseResponse
public final class BaseResponse<T> {

    public int code;
    public String message;
    public T data;
}
// User
public class User {
    public String name;
    public String age;
    /**
     * 将json中email_address或者email这个属性对应POJO的属性变成emailAddress
     */
    @SerializedName(value = "emailAddress", alternate = {"email", "email_address"})
    public String emailAddress;
}
```

普通使用就是每次都要用`new TypeToken<XXX>(){}.getType()`好麻烦。

```
Type userType = new TypeToken<BaseResponse<User>>(){}.getType();
BaseResponse<User> userResult = gson.fromJson(json,userType);
User user = userResult.data;

Type userListType = new TypeToken<BaseResponse<List<User>>>(){}.getType();
BaseResponse<List<User>> userListResult = gson.fromJson(json,userListType);
List<User> users = userListResult.data;
```

封装：

```java
// for jsonobject
public static <T> BaseResponse<T> fromJsonObj(String json) {
    Type type = new TypeToken<BaseResponse<T>>() {
    }.getType();
    return new Gson().fromJson(json, type);
}
// for jsonarray
public static <T> BaseResponse<List<T>> fromJsonArray(String json) {
    Type type = new TypeToken<BaseResponse<List<T>>>() {
    }.getType();
    return new Gson().fromJson(json, type);
}
```

其中使用`fromJsonObj(json)`这样会失败，报如下错误

```
com.google.gson.internal.LinkedTreeMap cannot be cast to me.hacket.thirdpart.gson.bean.User
```

代码不会报错，但运行结果肯定是不对的，因为这里的T其实是一个TypeVariable，他在运行时并不会变成我们想要的XXX，所以通过TypeToken得到的，泛型信息只是 "BaseResponse"。但`fromJsonArray()`似乎是可以的。

#### 解决：

既然`TypeToken`的作用是用于获取泛型的类，返回的类型为`Type`，真正的泛型信息就是放在这个Type里面，既然用TypeToken生成会有问题,那我们自己生成Type就行了嘛。
其中的`ParameterizedType`简单说来就是形如`类型<>`的类型，
如:`Map<String,User>`。下面就以`Map<String,User>`为例讲一下里面各个方法的作用。

```java
public interface ParameterizedType extends Type {
    // 返回Map<String,User>里的String和User，所以这里返回[String.class,User.clas]
    Type[] getActualTypeArguments();

    // Map<String,User>里的Map,所以返回值是Map.class
    Type getRawType();

    // 用于这个泛型上中包含了内部类的情况,一般返回null
    Type getOwnerType();
}
```

##### 实现一个简易的 ParameterizedType

```java
public class ParameterizedTypeImpl implements ParameterizedType {

    private final Class raw;
    private final Type[] args;

    public ParameterizedTypeImpl(Class raw, Type[] args) {
        this.raw = raw;
        this.args = args != null ? args : new Type[0];
    }

    // 返回Map<String,User>里的String和User，所以这里返回[String.class,User.clas]
    // 如返回BaseResponse<User>的User.class
    @Override
    public Type[] getActualTypeArguments() {
        return args;
    }

    // Map<String,User>里的Map,所以返回值是Map.class
    // 如返回BaseResponse<User>的BaseResponse.class
    @Override
    public Type getRawType() {
        return raw;
    }

    // 用于这个泛型上中包含了内部类的情况,一般返回null
    @Override
    public Type getOwnerType() {
        return null;
    }
}
```

##### 生成Gson需要的泛型

```java
// for jsonobject
public static <T> BaseResponse<T> fromJsonObj(String json, Class<T> clazz) {
    // 生成BaseResponse<T>
    Type type = new ParameterizedTypeImpl(BaseResponse.class, new Type[]{clazz});
    return new Gson().fromJson(json, type);
}
// for jsonarray
public static <T> BaseResponse<List<T>> fromJsonArray(String json, Class<T> clazz) {
    // 生成BaseResponse<List<T>>中的 List<T>
    Type listType = new ParameterizedTypeImpl(List.class, new Type[]{clazz});
    // 根据List<T>生成完整的BaseResponse<List<T>>
    Type type = new ParameterizedTypeImpl(BaseResponse.class, new Type[]{listType});
    return new Gson().fromJson(json, type);
}
```

#### 使用

- json object

```java
BaseResponse<User> dataResponse = fromJsonObj(json, User.class);
```

- json array

```java
BaseResponse<List<User>> dataResponse = fromJsonArray(json, User.class);
```

#### Reference

搞定Gson泛型封装
<http://www.jianshu.com/p/d62c2be60617>

用Builder生成泛型，generics type builder
<https://github.com/ikidou/TypeBuilder>

# Gson之自定义TypeAdapter

> TypeAdapter

**注意：** TypeAdapter 以及 JsonSerializer 和 JsonDeserializer 都需要与 `GsonBuilder.registerTypeAdapter` 示或`GsonBuilder.registerTypeHierarchyAdapter`配合使用，下面将不再重复说明。

#### TypeAdapter

`TypeAdapter` 是Gson自2.0（源码注释上说的是2.1）开始版本提供的一个抽象类，用于**接管某种类型的序列化和反序列化过程**，包含两个注要方法 `write(JsonWriter,T)` 和 `read(JsonReader)` 其它的方法都是`final`方法并最终调用这两个抽象方法。

##### 案例`CategoryTypeAdapter`：

```java
public final class CategoryTypeAdapter extends TypeAdapter<Category> {
    // Java Object → JSON strings
    @Override
    public void write(JsonWriter out, Category value) throws IOException {
        LogUtil.i(GsonDemoActivity.TAG, "CategoryTypeAdapter write");
        if (value == null) {
            out.nullValue();
            LogUtil.w(GsonDemoActivity.TAG, "CategoryTypeAdapter write nullValues()");
            return;
        }
        out.beginObject();
        out.name("_id").value(value.id);
        out.name("_name").value(value.name);
        out.name("type_").value(value.type);
        out.endObject();
    }

    @Override
    public Category read(JsonReader in) throws IOException {
        LogUtil.i(GsonDemoActivity.TAG, "CategoryTypeAdapter read");
        Category category = new Category();
        in.beginObject();
        while (in.hasNext()) {
            switch (in.nextName()) {
                case "id":
                case "_id":
                    category.id = in.nextInt();
                    break;
                case "name":
                case "_name":
                    category.name = in.nextString();
                    break;
                case "type":
                case "type_":
                case "_type":
                    category.type = in.nextString();
                    break;
            }
        }
        in.endObject();
        return category;
    }
}
```

测试：

```java
Category category = new Category(1111, "hacket", "hacket_type");

Gson gson = new GsonBuilder()
        .registerTypeAdapter(Category.class, new CategoryTypeAdapter().nullSafe())
        .create();

String json = gson.toJson(category);
LogUtil.i(TAG, "write --" + json); // {"_id":1111,"_name":"hacket","type_":"hacket_type"}

Category category1 = gson.fromJson(json, Category.class);
LogUtil.i(TAG, "read --" + category1.toString()); // Category{id=1111, name='hacket', type='hacket_type'}
```

当我们为`Category.class` 注册了 `TypeAdapter`之后，只要是操作`Category.class` 那些之前介绍的`@SerializedName` 、`FieldNamingStrategy`、`Since`、`Until`、`Expos`通通都黯然失色，失去了效果，只会调用我们实现的`CategoryTypeAdapter.write(JsonWriter, Category)` 方法，我想怎么写就怎么写。

##### null判断

正常情况下都需要对`read()`和`write()`进行null判断，下面是典型的判断处理。如果配置了`GsonBuilder#serializeNulls()`那么null值的键会输出。

```java
Gson gson = new GsonBuilder().registerTypeAdapter(Foo.class,
      new TypeAdapter<Foo>() {
        public Foo read(JsonReader in) throws IOException {
          if (in.peek() == JsonToken.NULL) {
            in.nextNull();
            return null;
          }
          // read a Foo from in and return it
        }
        public void write(JsonWriter out, Foo src) throws IOException {
          if (src == null) {
            out.nullValue();
            return;
          }
          // write src as JSON to out
        }
      }).create();
```

我们有个简单方式，在new TypeAdapter()时候加上`nullSafe()`即可，就不再需要上面那段判断逻辑了：

```java
new CategoryTypeAdapter().nullSafe();
```

- read nextNull()
- write nullValue()

nullSafe()源码，其实就是new了一个新的TypeAdapter

```java
public final TypeAdapter<T> nullSafe() {
    return new TypeAdapter<T>() {
      @Override public void write(JsonWriter out, T value) throws IOException {
        if (value == null) {
          out.nullValue();
        } else {
          TypeAdapter.this.write(out, value);
        }
      }
      @Override public T read(JsonReader reader) throws IOException {
        if (reader.peek() == JsonToken.NULL) {
          reader.nextNull();
          return null;
        }
        return TypeAdapter.this.read(reader);
      }
    };
}
```

#### JsonSerializer与JsonDeserializer

`JsonSerializer` 和`JsonDeserializer` 不用像`TypeAdapter`一样，必须要实现序列化和反序列化的过程，你可以据需要选择，如只接管序列化的过程就用 `JsonSerializer` ，只接管反序列化的过程就用 `JsonDeserializer`

##### 案例1，枚举值

EnumSerializer.java，将枚举值序列化成int值保存

```java
public final class EnumSerializer implements JsonSerializer<PackageItem.PackageState>, JsonDeserializer<PackageItem.PackageState> {

    // 对象转为Json时调用,实现JsonSerializer<PackageState>接口
    @Override
    public JsonElement serialize(PackageItem.PackageState src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(src.ordinal());
    }

    // json转为对象时调用,实现JsonDeserializer<PackageState>接口
    @Override
    public PackageItem.PackageState deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        if (json.getAsInt() < PackageItem.PackageState.values().length) {
            return PackageItem.PackageState.values()[json.getAsInt()];
        }
        return null;
    }
}
```

注册及使用

```java
Gson gson = new GsonBuilder()
        .registerTypeAdapter(PackageItem.PackageState.class, new EnumSerializer())
        .create();

PackageItem item = new PackageItem();
item.setName("item_name");
item.setSize("500M");
item.setState(PackageItem.PackageState.UPDATING);// 这个 state是枚举值
String json = gson.toJson(item);
LogUtil.i(TAG, "toJson:" + json); // {"name":"item_name","size":"500M","state":2}

PackageItem packageItem = gson.fromJson(json, PackageItem.class);
LogUtil.i(TAG, "fromJson:" + packageItem); // PackageItem [name=item_name, size=500M, state=UPDATING]
```

##### 案例2，数字转String

```java
public final class NumberSerializer implements JsonSerializer<Number> {
    @Override
    public JsonElement serialize(Number src, Type typeOfSrc, JsonSerializationContext context) {
        return new JsonPrimitive(String.valueOf(src));
    }
}
```

注册及使用：

```java
// registerTypeAdapter，不支持继承
Gson gson = new GsonBuilder()
        .registerTypeAdapter(Number.class, new NumberSerializer())
        .create();

// registerTypeAdapter
gson = new GsonBuilder()
        .registerTypeAdapter(Integer.class, new NumberSerializer())
        .registerTypeAdapter(Long.class, new NumberSerializer())
        .registerTypeAdapter(Float.class, new NumberSerializer())
        .registerTypeAdapter(Double.class, new NumberSerializer())
        .create();

String json1 = gson.toJson(100.0f);
String json2 = gson.toJson(1000008009l);
```

注：`registerTypeAdapter`必须使用包装类型，所以`int.class`,`long.class`,`float.class`和`double.class`是行不通的。同时不能使用父类来替上面的子类型，这也是为什么要分别注册而不直接使用`Number.class`的原因

##### registerTypeAdapter与registerTypeHierarchyAdapter

|      | registerTypeAdapter | registerTypeHierarchyAdapter |
| ---- | ------------------- | ---------------------------- |
| 支持泛型 | 是                   | 否                            |
| 支持继承 | 否                   | 是                            |

所以上面换成`**registerTypeHierarchyAdapter**`** **就可以使用`Number.class`而不用一个一个的当独注册

```java
Gson gson = new GsonBuilder()
        .registerTypeHierarchyAdapter(Number.class, new NumberSerializer())
        .create();
```

注：如果一个被序列化的对象本身就带有泛型，且注册了相应的TypeAdapter，那么必须调用Gson.toJson(Object,Type)，明确告诉Gson对象的类型。

```java
Type type = new TypeToken<List<User>>() {}.getType();
TypeAdapter typeAdapter = new TypeAdapter<List<User>>() {
   //略
};
Gson gson = new GsonBuilder()
        .registerTypeAdapter(type, typeAdapter)
        .create();
List<User> list = new ArrayList<>();
list.add(new User("a",11));
list.add(new User("b",22));
//注意，多了个type参数
String result = gson.toJson(list, type);
```

#### TypeAdapterFactory

TypeAdapterFactory,见名知意，用于创建TypeAdapter的工厂类，通过对比`Type`，确定有没有对应的`TypeAdapter`，没有就返回null，与`GsonBuilder.registerTypeAdapterFactory`配合使用。

```java
Gson gson = new GsonBuilder()
        .registerTypeAdapterFactory(new TypeAdapterFactory() {
            @Override
            public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
                return null;
            }
        })
        .create();
```

#### `@JsonAdapter`注解

`JsonAdapter`相较之前介绍的`SerializedName` 、`FieldNamingStrategy`、`Since`、`Until`、`Expos`这几个注解都是比较特殊的，其它的几个都是用在POJO的字段上，而这一个是用在POJO类上的，接收一个参数，且必须是`TypeAdpater`，`JsonSerializer`或`JsonDeserializer`这三个其中之一。
上面说`JsonSerializer`和`JsonDeserializer`都要配合`GsonBuilder.registerTypeAdapter`使用，但每次使用都要注册也太麻烦了，`JsonAdapter`就是为了解决这个痛点的。
使用时不用再使用 `GsonBuilder`去注册`UserTypeAdapter`了，直接用new Gson就可以了。

```java
@JsonAdapter(CategoryTypeAdapter.class)
public final class Category {
    // ...
}
```

**注：**`@JsonAdapter` 仅支持 `TypeAdapter`或`TypeAdapterFactory`；`JsonAdapter`的优先级比`GsonBuilder.registerTypeAdapter`的优先级更高。

#### TypeAdapter与 JsonSerializer、JsonDeserializer对比

|            | TypeAdapter    | JsonSerializer、JsonDeserializer |
| ---------- | -------------- | ------------------------------- |
| 引入版本       | 2.0            | 1.x                             |
| Stream API | 支持             | 不支持*，需要提前生成`JsonElement`        |
| 内存占用       | 小              | 比`TypeAdapter`                  |
| 大          |                |                                 |
| 效率         | 高              | 比`TypeAdapter`                  |
| 低          |                |                                 |
| 作用范围       | 序列化 **和** 反序列化 | 序列化 **或** 反序列化                  |

#### Reference

- [ ] 你真的会用Gson吗?Gson使用指南（四） -- TypeAdapter

<http://www.jianshu.com/p/3108f1e44155>

- [ ] Gson TypeAdapter 解析非常规 Json

<http://baurine.github.io/2017/02/24/gson_adapter.html>

# Gson的JsonDeserializer应用--Gson选择性转换json数据

### Gson选择性转换json数据

我们只需要解析`"result"`这段

```json
{
  "total": 111,
  "result": [
    {
      "famous_name": "达尔文",
      "famous_saying": "我在科学方面所作出的任何成绩，都只是由于长期思索、忍耐和勤奋而获得的"
    },
    {
      "famous_name": "茅以升",
      "famous_saying": "勤奋就是成功之母。"
    },
    {
      "famous_name": "茅以升",
      "famous_saying": "对搞科学的人来说，勤奋就是成功之母。"
    },
    {
      "famous_name": "法莱塞",
      "famous_saying": "在每一条路上都有成百上千的人在勤奋，所以知名之士为数不少。大海里已经挤满了鲸鱼。"
    },
    {
      "famous_name": "威廉·李卜克内西",
      "famous_saying": "才能的火花，常常在勤奋的磨石上迸发。"
    }
  ],
  "error_code": 0,
  "reason": "Succes"
}
```

代码：

```java
private class MarvelResultsDeserializer<T> implements JsonDeserializer<List<T>> {

        @Override
        public List<T> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            //            JsonElement result = json.getAsJsonObject().get("result");
            JsonElement result = json.getAsJsonObject().getAsJsonArray("result");
            return new Gson().fromJson(result, typeOfT);
        }
    }
    
    
Gson gson = new GsonBuilder().registerTypeAdapter(new TypeToken<List<Quote.ResultBean>>() {
        }.getType(), new MarvelResultsDeserializer<Quote.ResultBean>()).create();
```

## Gson之TypeAdapter原理

### TypeAdapter流程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688058292774-75c4e1f9-a18a-4c63-a479-69346b7ed363.png#averageHue=%23fdfdfd&clientId=u4a035a78-9dee-4&from=paste&height=504&id=u6fde9cc9&originHeight=756&originWidth=824&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=59774&status=done&style=none&taskId=u9245026d-ea9a-4468-a5b1-dbcfcbe80c2&title=&width=549.3333333333334)

#### write

write，也称作序列化，Java Object转成JSON strings，即Gson.toJson(Java)
用`JsonSerializer`

#### read

read，也称作反序列化，JSON转成Java，即Gson.fromJson(JSON)
用`JsonDeserializer`

GSON TYPEADAPTER EXAMPLE
<http://www.javacreed.com/gson-typeadapter-example/>

GSON SERIALISER EXAMPLE
<http://www.javacreed.com/gson-serialiser-example/>

GSON DESERIALISER EXAMPLE
<http://www.javacreed.com/gson-deserialiser-example/>

## Ref

### 你真的会用Gson吗?Gson使用指南系列

[你真的会用Gson吗?Gson使用指南（一）](http://www.jianshu.com/p/e740196225a4)
[你真的会用Gson吗?Gson使用指南（二）](http://www.jianshu.com/p/c88260adaf5e)
[你真的会用Gson吗?Gson使用指南（三）](http://www.jianshu.com/p/0e40a52c0063)
[你真的会用Gson吗?Gson使用指南（四）](http://www.jianshu.com/p/3108f1e44155)

### Json转换利器Gson之实例系列

Json转换利器Gson之实例一-简单对象转化和带泛型的List转化
<http://blog.csdn.net/lk_blog/article/details/7685169>

Json转换利器Gson之实例二-Gson注解和GsonBuilder
<http://blog.csdn.net/lk_blog/article/details/7685190>

Json转换利器Gson之实例三-Map处理(上)
<http://blog.csdn.net/lk_blog/article/details/7685210>
Json转换利器Gson之实例四-Map处理(下)
<http://blog.csdn.net/lk_blog/article/details/7685224>

Json转换利器Gson之实例五-实际开发中的特殊需求处理
<http://blog.csdn.net/lk_blog/article/details/7685237>

Json转换利器Gson之实例六-注册TypeAdapter及处理Enum类型
<http://blog.csdn.net/lk_blog/article/details/7685347>

- [ ] Gson - Java-JSON 序列化和反序列化入门

<https://www.jianshu.com/p/a03bc97875b8>

```
1、Gson - Java-JSON 序列化和反序列化入门
2、Gson - 映射嵌套对象
3、Gson - Arrays 和 Lists 映射对象
4、Gson - Map 结构映射
5、Gson - Set 集合映射
6、Gson - 空值映射
7、Gson Model Annotations - 如何使用 @SerializedName 更改字段的命名
8、Gson Model Annotations - @SerializedName 匹配多个反序列化名称
9、Gson Builder - 基础和命名规则
10、Gson Builder - 序列化空值
11、Gson Builder - 忽略策略
12、Gson Builder - Gson Lenient 属性
13、Gson Builder - 特殊类型 Floats & Doubles
17、Gson Builder - 如何使用 @Expose 忽略字段
19、Gson Advanced - 映射枚举类型
20、Gson Advanced - 映射循环引用
21、Gson Advanced - 泛型
22、Gson Advanced - 简单自定义序列化 (Part 1)
24、Gson Advanced - 自定义反序列化基础
25、Gson Advanced - 自定义对象实例创建
26、Gson Advanced - 通过 @JsonAdapter 自定义(反)序列化过程
32、Practical Gson - 如何解析多态对象
```
