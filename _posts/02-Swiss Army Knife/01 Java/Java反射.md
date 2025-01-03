---
date created: 2024-12-27 23:44
date updated: 2024-12-27 23:44
dg-publish: true
---

# 反射介绍 Refelection

## 什么是反射？

反射是Java中非常重要的特性，使用反射可以在运行时动态生成对象、获取对象属性以及调用对象方法。反射可以做：

- 在运行时判断任意一个对象所属的类
- 在运行时构造任意一个类的对象
- 在运行时判断任意一个类所具有的成员变量和方法,可以通过反射调用private方法
- 在运行时调用任意一个对象的方法

## 反射获取Class对象有几种方式？

1. Class.forName
2. 类.class
3. 对象.getClass()

## 反射的原理/JVM是如何实现反射的？

加载一个类主要有三个阶段：编译加载、连接、初始化

1. 编译 Java文件编译后生成.class字节码文件
2. **加载 **类加载器负责根据一个类的全限定名来读取此类的二进制字节流到JVM，并存储在运行时内存的方法区，然后将其转换为一个与目标类型对应的java.lang.Class对象实例
3. 连接
   1. 验证 格式（class文件规范）语义（final类是否有子类）操作
   2. 准备 静态变量赋初始值和内存空间，final修饰的内存空间直接赋原值，此处不是用户指定的初值
   3. 解析 符号引用转化为直接引用，分配地址
4. 初始化 类的初始化

Java的反射就是利用加载到JVM中class文件来操作的，class文件包含Java类的所有信息

## 反射的用途？

**反射最重要的用途就是开发各种通用框架**。很多框架（比如Spring）都是配置化的（比如通过 XML 文件配置 Bean），为了保证框架的通用性，它们可能需要根据配置文件加载不同的对象或类，调用不同的方法，这个时候就必须用到反射，运行时动态加载需要加载的对象。

## 反射的缺点？

1. 性能差

> 反射会额外消耗⼀定的系统资源，因此如果不需要动态地创建⼀个对象，那么就不需要⽤反射。

2. 安全性

> 反射调⽤⽅法时可以忽略权限检查，因此可能会破坏封装性⽽导致安全问题

### 反射调用的性能开销

# 反射API

## Class

反射始于Class，Class是一个类，封装了当前对象所对应的类的信息。一个类中有属性，方法，构造器等，比如说<br>有一个Person类，一个Order类，一个Book类，这些都是不同的类，现在需要一个类，用来描述类，这就是<br>Class，它应该有类名，属性，方法，构造器等。Class是用来描述类的类。<br>Class类是一个对象照镜子的结果，对象可以看到自己有哪些属性，方法，构造器，实现了哪些接口等等。对于每<br>个类而言，JRE 都为其保留一个不变的 Class 类型的对象。一个 Class 对象包含了特定某个类的有关信息。 对象只<br>能由系统建立对象，一个类（而不是一个对象）在 JVM 中只会有一个Class实例。

### 获取Class对象

获取Class对象的三种方式：

```
1. 通过类名获取 类名.class
2. 通过对象获取 对象名.getClass()
3. 通过全类名获取 Class.forName(全类名) classLoader.loadClass(全类名)
```

- Class.forName<br>让ClassLoader装载类，并进行类的初始化
- xxx.getClass<br>返回类对象运行时真正所指的对象、所属类型的Class对象
- Xxx.class<br>ClassLoader装载入内存，不对类进行类的初始化操作

区别在于，是否进行初始化和是否在实例中获取。

## 反射构造器Constructor

| 方法                                                 | 本Class                   | 父类Class             | 备注                           |
| -------------------------------------------------- | ------------------------ | ------------------- | ---------------------------- |
| Constructor getConstructor(Class[] params)         | 只有public                 | no                  | 获得使用特殊的参数类型的public构造函数(包括父类） |
| Constructor getDeclaredConstructor(Class[] params) | public、protected、private | no                  | 获得使用特定参数类型的构造函数(包括私有)        |
| Constructor[] getConstructors()                    | 只有public                 | no                  | 获得类的所有公共构造函数                 |
| Constructor[] getDeclaredConstructors()            | public、protected、private | 获得类的所有构造函数(与接入级别无关) |                              |

> 构造方法无法调用父类的任何构造方法

通过反射来生成对象主要有两种方式。

1. 使用Class对象的newInstance()方法来创建Class对象对应类的实例。

```java
Class<?> c = String.class;
Object str = c.newInstance();
```

2. 先通过Class对象获取指定的Constructor对象，再调用Constructor对象的newInstance()方法来创建实例。这<br>种方法可以用指定的构造器构造类的实例。

```java
// 获取String所对应的Class对象
Class<?> c = String.class;
// 获取String类带一个String参数的构造器
Constructor constructor = c.getConstructor(String.class);
// 根据构造器创建实例
Object obj = constructor.newInstance("23333");
System.out.println(obj);
```

## 反射构造对象 Object

- Class.newInstance() 对应的Class必须存在一个无参数的构造方法，并且要有访问权限
- Constructor.newInstance() 无限制，有访问限制的用`setAccessible()`

```java
// 获得指定对象的构造方法，参数值传入与构造方法参数对应的类型
Constructor<?> constructors = peopleClass.getConstructor(String.class);

// 分为无参和有参，参数传入与构造方法参数对应的值，获得对象引用
People people = (People) constructors.newInstance("Devin");
```

## 反射方法 Method

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687454079140-ed747b02-10eb-4f84-bcd4-dde4a7472a59.png#averageHue=%23f1f0ef&clientId=u79860698-848b-4&from=paste&height=621&id=u24eaf4fe&originHeight=931&originWidth=1309&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=492637&status=done&style=none&taskId=u91657aab-c8c3-4c8b-af58-7cd41fb8014&title=&width=872.6666666666666)

```java
People people = new People("lisi");
Class<? extends People> aClass = people.getClass();
 Method method = aClass.getDeclaredMethod("setAge", int.class);
//设置true表示可以访问该方法 
method .setAccessible(true);
//调用此方法，如果方法有返回值，则返回方法执行后的返回值，如果没有，则返回 null
Object obj=method .invoke(people, 20);
```

- 反射静态方法<br>静态方法属性类本身，对象参数不用写，就是`Method.invoke(null，xxx)`

## 反射字段 Field

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687454097666-b02f4384-f0b4-4f51-b9e0-de45adc74fa3.png#averageHue=%23f1f0ef&clientId=u79860698-848b-4&from=paste&height=641&id=ue0e0a2ab&originHeight=962&originWidth=1296&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=499480&status=done&style=none&taskId=u1f700d6d-b05c-4845-af65-fbacab8c916&title=&width=864)<br>反射获取字段示例：

```java
People people = new People("lisi");
Class<? extends People> aClass = people.getClass();
Field field = aClass.getDeclaredField("name");
field .setAccessible(true);
String name = (String) field .get(people);
```

子类反射获取父类字段示例：

```java
public class GetFieldDemo {

    public static class Parent {
        public int a = 1;
        protected int b = 2;
        int c = 3;
        private int d = 4;
    }

    public static class Child extends Parent {
        public int aa = 10;
        protected int bb = 11;
        int cc = 12;
        private int dd = 13;
    }

    public static void main(String[] args) throws Exception {
//        Parent parent = new Parent();
//        Child child = new Child();

        Class<?> childClazz = Class.forName("com.example.reflect.getfield.GetFieldDemo$Child");
        Object childObj = childClazz.newInstance();
        int aa = (int) childClazz.getField("aa").get(childObj);
        System.out.println("aa=" + aa);
        int bb = (int) childClazz.getDeclaredField("bb").get(childObj);
        System.out.println("bb=" + bb);
        int cc = (int) childClazz.getDeclaredField("cc").get(childObj);
        System.out.println("cc=" + cc);
        Field ddFiled = childClazz.getDeclaredField("dd");
        ddFiled.setAccessible(true);
        int dd = (int) ddFiled.get(childObj);
        System.out.println("dd=" + dd);

        int a = (int) childClazz.getField("a").get(childObj);
        System.out.println("a=" + a);
        // NoSuchFieldException
//        int b = (int) childClazz.getDeclaredField("b").get(childObj);
//        System.out.println("b=" + b);

        int b2= (int) childClazz.getSuperclass().getDeclaredField("b").get(childObj);
        System.out.println("b2=" + b2);
        int c= (int) childClazz.getSuperclass().getDeclaredField("c").get(childObj);
        System.out.println("c=" + c);
        Field dField = childClazz.getSuperclass().getDeclaredField("d");
        dField.setAccessible(true);
        int d= (int) dField.get(childObj);
        System.out.println("d=" + d);
    }
}
```

输出：

```
aa=10
bb=11
cc=12
dd=13
a=1
b2=2
c=3
d=4
```

**注意：**

1. 子类中通过getFiled可以获取到父类public的字段，protected、private访问修饰符的字段获取不到
2. 子类.getSuperclass().getDeclaredField()可以获取到父类的非public的字段

## ParameterizedType

ParameterizedType简单说来就是形如`实参参数<形参参数1,形参参数2,形参参数3,...>`的类型，比如`Collection<String>`。

- getGenericSuperclass() 返回一个ParameterizedType类型
- getActualTypeArguments() 返回泛型形参参数列表
- getRawType() 返回泛型实参参数

案例1：

```java
@Test
public void testParameterizedType() {
    List<Student> students = new ArrayList<Student>(){}; // 需要用子类
    Type type = students.getClass().getGenericSuperclass();
    ParameterizedType parameterizedType = (ParameterizedType) type;
    Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
    for (Type actualTypeArgument : actualTypeArguments) {
        System.out.println(actualTypeArgument); // class com.example.lib.TypeBuilder.Student
    }
    System.out.println(parameterizedType.getRawType()); // class java.util.ArrayList
    System.out.println(parameterizedType.getOwnerType()); // null
}
```

## 反射-getSuperclass和getGenericSuperclass

### getSuperclass() 返回直接继承的父类（由于编译擦除，没有显示泛型参数）

返回表示此Class所表示的实体（类、接口、基本类型或 void）的超类的Class。

1. 如果此 Class 表示 `Object类`、`一个接口`、`一个基本类型`或`void`，则返回 null。
2. 如果此对象表示一个数组类，则返回表示该 Object 类的 Class 对象。

```java
System.out.println(TestInter.class.getSuperclass()); // 接口.class的getSuperclass为null
System.out.println(Object.class.getSuperclass()); // Object类的getSuperclass为null
int[] i = {1, 2};
System.out.println(i.getClass().getSuperclass()); // 数组.class返回Object  class java.lang.Object
System.out.println(String.class.getSuperclass()); // class java.lang.Object
```

### getGenericSuperclass() 返回直接继承的父类（包含泛型参数）

返回表示此 Class 所表示的实体（类、接口、基本类型或 void）的直接超类的 Type。

返回的为ParameterizedType

1. 如果此 Class 表示 Object 类、接口、基本类型或 void，则返回 null。
2. 如果此对象表示一个数组类，则返回表示 Object 类的 Class 对象。

## 案例

```java
@Test
public void test_getGenericSuperclass_getSuperclass() {
    System.out.println("Student.class.getSuperclass()\t"
            + Student.class.getSuperclass());
    System.out.println("Student.class.getGenericSuperclass()\t"
            + Student.class.getGenericSuperclass());

    System.out.println("Test.class.getSuperclass()\t"
            + TypeBuilderTest.class.getSuperclass());
    System.out.println("Test.class.getGenericSuperclass()\t"
            + TypeBuilderTest.class.getGenericSuperclass());

    System.out.println("Object.class.getGenericSuperclass()\t"
            + Object.class.getGenericSuperclass());
    System.out.println("Object.class.getSuperclass()\t"
            + Object.class.getSuperclass());

    System.out.println("void.class.getSuperclass()\t"
            + void.class.getSuperclass());
    System.out.println("void.class.getGenericSuperclass()\t"
            + void.class.getGenericSuperclass());

    System.out.println("int[].class.getSuperclass()\t"
            + int[].class.getSuperclass());
    System.out.println("int[].class.getGenericSuperclass()\t"
            + int[].class.getGenericSuperclass());
}
public class Person<T> {

}
public class Student extends Person<TypeBuilderTest> {

}
```

结果：

```
Student.class.getSuperclass()	class com.example.lib.TypeBuilder.Person
Student.class.getGenericSuperclass()	com.example.lib.TypeBuilder.Person<com.example.lib.TypeBuilder.TypeBuilderTest>
Test.class.getSuperclass()	class java.lang.Object
Test.class.getGenericSuperclass()	class java.lang.Object
Object.class.getGenericSuperclass()	null
Object.class.getSuperclass()	null
void.class.getSuperclass()	null
void.class.getGenericSuperclass()	null
int[].class.getSuperclass()	class java.lang.Object
int[].class.getGenericSuperclass()	class java.lang.Object
```

## 注意

- setAccessible(true)<br>不是将方法的权限改为public，而是取消Java的权限控制检查

# 反射技巧

## 获取某个指定的Class，如LiveData.class

```
@Nullable
private Class<?> getLiveDataClass(Class<?> liveDataClazz) {
    if (liveDataClazz == null) return null;
    if (liveDataClazz.getSimpleName().equalsIgnoreCase("LiveData")) {
        return liveDataClazz;
    }
    return getLiveDataClass(liveDataClazz.getSuperclass());
}
```

## 判断是否为某个类的实例 isInstance

一般地，我们用 instanceof 关键字来判断是否为某个类的实例。同时我们也可以借助反射中 Class 对象的<br>isInstance() 方法来判断是否为某个类的实例，它是一个 native 方法：

```java
// 判断是否为某个类的实例
public native boolean isInstance(Object obj);

// 判断是否为某个类的类型
public boolean isAssignableFrom(Class<?> cls)
```

## Java反射库jOOR

<https://github.com/jOOQ/jOOR>

## Android反射final

### 案例，修改ViewHolder.itemView

相信大家在继承RecycleView时，对ViewHolder中的itemView都有重写的欲望。这个itemView是final类型的，不容许被修改，极大的限制了开发的自由。

```java
public static void modify(Object object, String fieldName, Object newFieldValue) throws Exception {
    Field field = object.getClass().getDeclaredField(fieldName);

    Field modifiersField = Field.class.getDeclaredField("modifiers");
    modifiersField.setAccessible(true); //Field 的 modifiers 是私有的
    modifiersField.setInt(field, field.getModifiers() & ~Modifier.FINAL);

    if (!field.isAccessible()) {
        field.setAccessible(true);
    }

    field.set(object, newFieldValue);
}
```

在实际运行时，会报错，提示说没有modifiers字段。这也就表明，Android编译后的dex字节码中，并没有java那一套复杂属性访问控制逻辑。

- Android反射时忽视final修饰符

```java
Field field =  RecyclerView.ViewHolder.class.getField("itemView");
field.set(viewHolder, someNewItemView);
```

# 泛型遇到反射

Java的泛型是伪泛型，这是因为Java在编译期间，所有的泛型信息都会被擦除。

由于类型擦除，Java中的泛型对象在运行时是不知道自己类型参数的类型的。

> 能获取到类上泛型一句话：要持有Class对象

## ParameterizedType

ParameterizedType 代表被参数化的类型，也就是增加了泛型限制的类型。

## Java 获取泛型对象的参数类型

下面这种是获取不了对象上的泛型

```java
public class BaseResponse<T> {
    public int code;
    public String err_msg;
    public T data;
}
public static void main(String[] args) {
    BaseResponse<User> response = new BaseResponse<User>();
    Type genericSuperclass = response.getClass().getGenericSuperclass();
    Type[] genericInterfaces = response.getClass().getGenericInterfaces();
    System.out.println(genericSuperclass);
    System.out.println(genericInterfaces.length);
}
```

输出：

```
class java.lang.Object
0
```

泛型在运行时是被擦除了， 但是某些（声明侧的泛型） 泛型信息会被class文件以`Signature`的形式保留在Class文件的`Constant pool`中。

1. 泛型类，或泛型接口的声明 (class文件会保存继承的父类或者接口的泛型信息)
2. 带有泛型参数的方法
3. 带有泛型参数的成员变量

> 方法的局部变量的泛型是不会被保存的，不能通过Signature解析

JDK的Class、Method、Field 类提供了一系列获取 泛型类型的相关方法。

1. Class getGenericSuperclass() 获取父类的Class并带上其类上的泛型
2. Method getGenericReturnType() 获取带泛型信息的返回类型；getGenericParameterTypes()获取带泛型信息的参数类型。
3. Field getGenericType() 获取成员变量上的泛型

### 类中有 class 信息(获取成员变量的泛型)

```java
static class A1<T> {
    public Class<T> mClass;

    public A1(Class<T> aClass) {
        mClass = aClass;
    }
}
```

获取：

```java
A1<String> a1 = new A1<>(String.class);
System.out.println(a1.mClass);
```

输出：

```
class java.lang.String
```

### Class#getGenericSuperclass

#### 父类泛型，子类实现

父类：

```java
public class BaseResponse<T> {
    public int code;
    public String err_msg;
    public T data;
}
```

子类：

```java
public class Response extends BaseResponse<TestBaseResponse.User> {
}
```

获取：

```java
Response response = new Response();
printClass(response);
public static void printClass(Object o) {
    System.out.println();
    format("o: ", o);
    format("class: ", o.getClass());
    format("superClass: ", o.getClass().getSuperclass());
    format("genericSuperClass: ", o.getClass().getGenericSuperclass());
    format("genericSuperClass typeArgument: ", ((ParameterizedType) o.getClass().getGenericSuperclass()).getActualTypeArguments()[0]);
}
```

输出：

```
o:  com.example.泛型.Response@7852e922
class:  class com.example.泛型.Response
superClass:  class com.example.泛型.BaseResponse
genericSuperClass:  com.example.泛型.BaseResponse<com.example.泛型.TestBaseResponse$User>
genericSuperClass typeArgument:  class com.example.泛型.TestBaseResponse$User
```

如果是这样的定义就不行

```java
public class Response2<T> extends BaseResponse<T> {
}
```

获取：

```java
Response2 response2 = new Response2();
printClass(response2);
```

输出：

```
o:  com.example.泛型.Response2@7852e922
class:  class com.example.泛型.Response2
superClass:  class com.example.泛型.BaseResponse
genericSuperClass:  com.example.泛型.BaseResponse<T>
genericSuperClass typeArgument:  T
```

- 获取成员变量的泛型

```java
public class User {
    private List<String> list;
    public static void main(String[] args) {
        try {
            Field field = User.class.getDeclaredField("list");
            Type genericType = field.getGenericType();
            if (genericType != null && genericType instanceof ParameterizedType) {
                Type actualType = ((ParameterizedType) genericType).getActualTypeArguments()[0];
                System.out.println(actualType.getTypeName());
            }
        } catch (Exception e) {
        }
    }
}
```

#### 匿名子类

类定义同上面

```
BaseResponse<User> response2 = new BaseResponse<User>(){} ;
printClass(response2);
```

输出：

```
o:  com.example.泛型.TestBaseResponse$1@7852e922
class:  class com.example.泛型.TestBaseResponse$1
superClass:  class com.example.泛型.BaseResponse
genericSuperClass:  com.example.泛型.BaseResponse<com.example.泛型.TestBaseResponse$User>
genericSuperClass typeArgument:  class com.example.泛型.TestBaseResponse$User
```

### Method

```java
public class RetrofitGeneric {
    public List<String> getData() {
        List<String> list = new ArrayList<>();
        list.add("hacket");
        return list;
    }

    private static void getMethodGeneric() {
        RetrofitGeneric generic = new RetrofitGeneric();
        List<String> data = generic.getData();
        System.out.println("getData()=" + data);
        try {
            Method getDataMethod = generic.getClass().getMethod("getData");
            Type genericReturnType = getDataMethod.getGenericReturnType(); // ParameterizedTypeImpl
            System.out.println("getGenericReturnType()=" + genericReturnType); // java.util.List<java.lang.String>
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }
}
```

### Field

```java
public class RetrofitGeneric {
    public List<Integer> uids = new ArrayList<>();
    private static void getFieldGeneric() {
        RetrofitGeneric generic = new RetrofitGeneric();
        try {
            Field uidsField = generic.getClass().getField("uids");
            Type genericType = uidsField.getGenericType(); // ParameterizedTypeImpl
            System.out.println("uidsField=" + uidsField.get(generic) + "-type=" + genericType); // java.util.List<java.lang.Integer>
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        getFieldGeneric();
    }
}
```

## 通过继承父类来获取泛型应用

### 1. ViewBinding泛型

```java
abstract class BaseViewBindingActivity<VB : ViewBinding> : AppCompatActivity() {
    private lateinit var binding: VB
    private fun initBinding(): VB {
        // 利用反射，调用指定ViewBinding中的inflate方法填充视图
        val type = javaClass.genericSuperclass
        if (type is ParameterizedType) {
            val clazz = type.actualTypeArguments[0] as Class<*>
            val method = clazz.getMethod("inflate", LayoutInflater::class.java)
            @Suppress("UNCHECKED_CAST")
            binding = method.invoke(null, layoutInflater) as VB
            return binding
        }
        throw IllegalAccessException("VB实例化失败，请检查VB参数")
    }
}
```

使用：

```
class ViewBindingFragmentDemo : BaseViewBindingActivity<ActivityViewBindingFragmentDemoBinding>() {}
```

### 2. AbstractDao

```java
public abstract class AbstractDao<T> {
    public Class<T> getActualType() {
        ParameterizedType parameterizedType = (ParameterizedType) this.getClass().getGenericSuperclass();
        return (Class<T>) parameterizedType.getActualTypeArguments()[0];
    }
}

public class UserDao extends AbstractDao<String> {
    public static void main(String[] args) {
        UserDao userDao = new UserDao();
        Class<String> actualType = userDao.getActualType();
        System.out.println(actualType.getName());
    }
}
```

## 开源库处理泛型

### Retrofit

一段请求网络代码：

```java
public interface GitHubService {
  @GET("users/{user}/repos")
  Call<List<Repo>> listRepos(@Path("user") String user);
}
```

Retrofit源码：

```java
// ServiceMethod
static <T> ServiceMethod<T> parseAnnotations(Retrofit retrofit, Method method) {
  // ...
  Type returnType = method.getGenericReturnType();
  // ...
}

// Method
public class Method {
  public Type getGenericReturnType() {
     // 根据 Signature 信息 获取 泛型类型 
    if (getGenericSignature() != null) {
      return getGenericInfo().getReturnType();
    } else { 
      return getReturnType();
    }
  }
}
```

### Gson (要传入内部类)

```java
// Gson 常用的情况
public  List<String> parse(String jsonStr){
    List<String> topNews =  new Gson().fromJson(jsonStr, new TypeToken<List<String>>() {}.getType());
    return topNews;
}
```

Java的class文件会保存继承的父类或者接口的泛型信息。

Gson使用了一个巧妙的方法来获取泛型类型：

1. 创建一个泛型抽象类`TypeToken <T>`，这个抽象类不存在抽象方法，因为匿名内部类必须继承自抽象类或者接口。所以才定义为抽象类。
2. 创建一个 继承自TypeToken的匿名内部类， 并实例化泛型参数TypeToken。
3. 通过class类的`public Type getGenericSuperclass()`方法，获取带泛型信息的父类Type，也就是TypeToken。

> 总结：Gson利用子类会保存父类class的泛型参数信息的特点。通过匿名内部类实现了泛型参数的传递。

## Ref

- [x] retrofit / Gson 是怎么获得擦除后的类型的? 泛型7连问...<br><https://mp.weixin.qq.com/s/tIeRtNYlxx0rdJkqW4_FlQ>
