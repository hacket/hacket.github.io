---
date created: 2024-12-24 00:37
date updated: 2024-12-24 00:37
dg-publish: true
---

# 依赖注入概念

**依赖注入**（Dependency Injection），简称DI，又叫控制反转（Inversion of Control），简称IOC。简言之，目标类（需要进行依赖初始化的类）中所依赖的其他的类的初始化过程，不是通过手段编码方式创建，而是通过技术手段，把其他类已经初始化好的实例自动注入到目标类。Dagger2就是实现**依赖注入**的一种技术手段。

**Dagger2实质：** 就是帮我们写工厂代码，当然比工厂模式更加强大

## 依赖注入概念

##### 1、依赖概念

一个类的实例需要另一个类的实例进行协助时。传统的设计，通常由调用者来创建被调用者的实例。

> 如：一个类ClassA中，有一个类ClassB的实例，则称ClassA对ClassB有一个依赖。依赖在构造方法中直接hard init。

```java
public class ClassA {
    ClassB classB;
    public ClassA(){
       classB = new ClassB();
    }
}
```

#### 2、依赖注入

除了上面的传统依赖方式。创建被调用者不再由调用者创建实例，创建被调用者的实例工作由IOC容器来完成，然后注入到调用者中，这个叫做依赖注入。

- 构造方法注入

> 将classB对象作为ClassA构造方法的一个参数传入，在调用ClassB的构造方法时已经初始化好了ClassA对象了。**这种非自己主动初始化依赖，而通过外部传入依赖的方式，称之为依赖注入。**

```java
public class ClassA {
    ClassB classB;
    public ClassA(ClassB classB){
       this.classB = classB;
    }
}
```

- setter注入
- 接口注入

## Dagger2

### Dagger2介绍

Dagger2 使用注解来实现依赖注入，但它利用 APT(Annotation Process Tool) 在编译时生成辅助类，这些类继承特定父类或实现特定接口，程序在运行时 Dagger2 加载这些辅助类，调用相应接口完成依赖生成和注入。没有用到运行时反射，对性能影响很小。

### 取名

Dagger 这个库的取名不仅仅来自它的本意“匕首”，同时也暗示了它的原理。Jake Wharton 在对 Dagger 的介绍中指出，Dagger 即 DAG-er，这里的 DAG 即数据结构中的 DAG——有向无环图(Directed Acyclic Graph)。也就是说，Dagger 是一个**基于有向无环图结构的依赖注入库。**

### 优点

1. 将类的初始化以及类之间的依赖关系集中在一处处理
2. 有大量类的初始化，以及类之间的依赖关系很复杂的时候

### Reference

- [ ] [公共技术点之依赖注入](http://www.codekk.com/open-source-project-analysis/detail/Android/%E6%89%94%E7%89%A9%E7%BA%BF/%E5%85%AC%E5%85%B1%E6%8A%80%E6%9C%AF%E7%82%B9%E4%B9%8B%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)
- [ ] 依赖注入原理<br /><http://codethink.me/2015/08/01/dependency-injection-theory/>

# Dagger2之注解详解

#### Dagger2中的注解介绍

对象之间的互相依赖可以想象成一个**有向无环图**。描述这个图，可以像Spring框架一样用一个配置文件来描述依赖关系，Dagger2用注解来描述依赖关系，更加的直接清晰。

#### Dagger2中的注解

##### 1、[@Inject ](/Inject) 注入标记

- 说明/作用

1. @Inject注解标记在一个属性上，表示该属性需要依赖（表现在目标类中需要依赖被注入一个对象）
2. @Inject注解标记在一个构造方法上，表示该构造方法可以提供依赖。

- 注意

1. 注解在类的构造方法上，这个类的构造方法只能有一个有[@Inject ](/Inject)
2. 注解在类的属性上，该属性不能private修饰
3. 注解在构造方法上，如果注解的构造方法`AClass()`是带参数`BClass`的，那么会去Module类中检查是否有返回`BClass`参数的方法，或者`BClass`是否有被@Inject注解的构造函数，如果没有找到会在编译期报错（这在编译期保证了对象之间的依赖被满足）

```java
 public class AClass{
    @Inject
    public AClass(BClass bClass){
        //do something
    }
 }
```

- @Inject注入构造方法时弊端（那就需要@Provides来注解）

1. 接口是没有构造方法的，不能对构造方法进行注解
2. 第三方库提供的类，我们无法修改源码，也不能注解它们的构造方法
3. 有些类需要提供统一的生成方法(一般会同时私有化构造方法)或需要动态选择初始化的配置，而不是使用一个单一的构造方法

##### 2、[@Component ](/Component) 注入器

- 说明/作用<br />也叫注入器（Injector），`@Component`是目标类中所依赖的其他类与其他类的构造方法之间的一个桥梁；把目标类依赖的实例注入目标类中，来初始化目标类中的依赖；`@Component`一端连接目标类（`@Inject`），另一端连接目标类依赖的实例（`@Module`），它把目标类依赖实例注入到目标类中，管理好`@Module`，`@Component`中的_modules_属性可以把@Module加入到@Component，modules可以加入多个@Module；@Module提供依赖，@Inject请求依赖，@Component就是联系这两者的纽带。Component主要说明4件事：

1. 谁来提供依赖
2. 该Component依赖哪些其他的Component
3. 该Component为谁提供依赖注入
4. 该Component可以提供哪些依赖

- 案例说明

```java
@Singleton
@Component(modules = {AppModule.class}，dependencies = {xxxComponent.class})
public interface AppComponent{
  void inject（MyActivity myActivity）；
  public MyApplication getApplication();
}
```

1. modules 参数{}里的类就表示提供依赖的Module类（可以有多个），也就是用 [@Module ](/Module) 注解的类
2. dependencies 表示该Component提供的注入类的构造函数中，还依赖其他 [@Component ](/Component) 提供的一些类
3. 有参无反的方法指明该参数为Component注入的目标，比如本例中，就说明 MyActivity 中需要 AppComponent 提供的依赖
4. 有反无参的方法指明该 Component 可以提供哪些依赖，或者说暴露哪些依赖。因为这里可能会有疑问，Component 可提供的依赖不就是 Module 里的那些吗？确实没错，但是 Component 也可以有选择的只对外界暴露它的一部分能力，并不一定会声明所有的在 Module 里定义的类。
5. 这个接口可以理解成一份声明，告诉Dagger哪些对象可以被注入，以及谁（Module类中被@Provides注解的方法）来提供这些依赖。需要注意，只有在 Component 接口中声明了的类，才会被暴露给依赖它的其他 Component。也就是说，Module 类中提供的依赖，并不一定都会在 Component 中声明。

- 工作原理<br />`@Component`需要引用目标类的实例，查找目标类中用`@Inject`注解标注的属性，查找到相应的属性后，接着查找该属性对应的用`@Inject`标注的构造方法，剩下的工作就是初始化该属性的实例并把实例进行赋值。
- 注意

1. `@Component`修饰的必须是接口或抽象类。Dagger2框架将自动生成`@Component`的实现类，对应类名DaggerXXX(XXX为你的Component类)。添加的注入方法一般使用`inject()`方法名，需要一个参数对应为需要注入依赖的容器的实例。
2. 如果Component中的某个对象具有Scope(Module中的一个方法具有Scope)，那么该Component也具有Scope。

- 疑问？<br />用@Inject和@Component就可以注入了；但如果需要注入第三方的类库，第三方的类库又不能修改，怎么把@Inject注解加入到这些类中呢？那就是@Module作用了。

##### 3、[@Module ](/Module) 依赖类容器

- 说明/作用<br />`@Module`就是一个简单的工厂模式，里面的方法基本都是创建_目标类所依赖的其他类的实例_的方法<br />真正提供依赖的类。一个类用@Module注解修饰，这样Dagger在构造类的实例的时候，就知道从哪里去找到需要的依赖。Module其实就是一个依赖的制造工厂。其实Module就是**完成各种对象的实例化**的一个集合。类里面可以包含很多 `@Provides` 注解的方法，每个方法对应一种对象的创建。Module类可以理解成一个用来组织对象创建方法的容器。
- 注意<br />一个完整的Module必须拥有@Module与@Provides注解。
- 疑问？<br />把@Module中各种创建类的实例方法与目标类中的@Inject注解标记的依赖产生关联，那就是@Providers注解的作用了。

##### 4、[@Provides ](/Provides) 提供创建依赖的类或参数

- 说明/作用<br />@Module中创建类的实例方法用@Providers进行注解，@Component在搜索到目标类中用@Inject注解标注的属性后，@Component就会去@Module中查找用@Providers标注的对应的创建类的实例方法
- 注意<br />写在@Module中某些方法上，表示这个方法用来提供依赖对象的特殊方法；<br />为@Provides方法添加输入参数，Module中@Provides方法可以带输入参数，其中参数由Module中的其他Provides方法提供，或者自动调用构造方法；如果找不到@Provides方法提供对应参数的对象，自动调用带@Inject参数的构造方法生成对应对象

##### 5、[@Qualifier ](/Qualifier) 限定符

- 来由<br />创建依赖注入类实例有2个纬度：

1. 通过@Inject注解标注的构造方法来创建
2. 通过@Module工厂模式来创建<br />这2个纬度是有优先级的，@Component会首先从@Module维度中查找类实例，若找到就用@Module维度创建类实例，并停止查找@Inject维度。否则才是从@Inject维度查找类实例。所以创建类实例级别@Module维度要高于@Inject维度。

- 依赖注入迷失<br />**依赖注入迷失： **基于同一个维度条件下，若一个类的实例有多种方法可以创建出来，那注入器（Component）应该选择哪种方法来创建该类的实例呢？
- @Qualifier作用<br />给不同的创建依赖类实例的方法用**标识**进行标注；同时用**要使用的创建依赖类实例方法的标识**对**目标类相应的实例属性**进行标注。那这样我们的问题就解决了，提到的**标识**就是Qualifier注解，当然这种注解得需要我们自定义。
- 注意<br />dagger2在发现**依赖注入迷失**时在编译代码时会报错。

##### 6、[@Scope ](/Scope)

- 介绍<br />Dagger2可以通过自定义@Scope注解，来限定通过@Module和@Inject方式创建的依赖类实例的生命周期与目标类的生命周期相同。或者更好的管理创建的依赖类实例的生命周期。
- 作用

1. 更好的管理Component之间的组织方式，不管是**依赖方式**还是**包含方式**，都有必要用自定义的@Scope注解标注这些Component，这些注解最好不要一样，这样可以更好的体现出Component之间的组织方式。还有编译器检查有依赖关系或包含关系的Component，若发现有Component没有用自定义@Scope注解标注，会报错。
2. 更好的管理Component与Module之间的匹配关系，编译器会检查Component管理的modules，若发现标注Component的自定义@Scope注解与modules中的标注创建依赖类实例方法的注解不一样，会报错。
3. 可读性提高，如用@Singleton标注全局依赖类，立马能明白这类是全局单例类。<br />![](index_files/813db43f-da1e-472d-a5bb-73b014d91153.png#id=EgRxo&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 自定义Scope<br />自定义Scope名字随便取，Scope实际上并没有帮助你管理对象的生命周期；无论是@Singleton还是自定义的Scope都是单例的，只不过这个单例是基于Component的。自定义的Scope标记只是起到一个标识作用，让Coder不要忘了按照对象生命周期的不同来组织依赖。
- 注意

1. 一个Module里只能存在一种Scope
2. 如果两个Component间有依赖关系(dependencies)，那么它们不能使用相同的Scope，即不同的Component之间的Scope必须不同
3. Singleton的Component不能依赖其他Scope的Component，只能其他Scope的组件依赖Singleton的Component
4. 没有Scope的Component不能依赖有Scope的Component
5. 一个Component不能同时有多个Scope，SubComponent除外
6. Dagger2框架不会帮你管理对象的生命周期，需要自己来控制

##### 7、[@Singleton ](/Singleton)

- 注意<br />本身@Singleton没有创建单例的能力，它的单例范围为Component实例内；它是Scope的一个默认实现，是Dagger2唯一带@Scope注解的。
- 如何创建单例<br />1· 在@Module中定义创建全局依赖类实例的方法

2. ApplicationComponent管理Module
3. 保证ApplicationComponent只有一个实例（在app的Application中实例化ApplicationComponent）

- @Singleton真正作用

1. 更好的管理ApplicationComponent和Module之间的关系，保证ApplicationComponent和Module是匹配的。若ApplicationComponent和Module的Scope是不一样的，则在编译时报错
2. 代码可读性，让程序员更好的了解Module中创建的依赖类实例是单例的

##### 8、[@SubComponent ](/SubComponent)

子Component<br />和Component的`dependencies`区别：<br />dependencies不会继承范围（Scope），但SubComponent会继承Scope，这样SubComponent同时具备了两种Scope

##### 9、[@Named ](/Named)

是一个`@Qualifier`，如果Module中需要生成同一个类的两个不同实例，需要用`@Named`，根据 `@Named` 后面字符串来匹配需要注入哪种实例，

```java
@Provides
@Named("default")
SharedPreferences provideDefaultSharedPrefs() { /*…*/ }

@Provides
@Named("secret")
SharedPreferences provideSecretSharedPrefs() {/*…*/ }
```

提供两种不同的 SharedPreferences 依赖，在需要注入的地方这样标记：

```java
@Inject @Named("default")
SharedPreferences mDefaultSharedPrefs;
@Inject @Named("secret")
SharedPreferences mSecretSharedPrefs;
```

##### 10、Lazy 接口和Provider 接口

见 Dagger2之Lazy和Provider.md

##### 11、Multibindings

Multibindings的应用场景比较少，主要用于插件化的实现，Multibindings分成Set与Map，Map的Multibindings目前还是Beta版本，也就是说还是在试验阶段，所以只介绍简单的Set的Multibindings。<br />通过Multibindings，Dagger可以将不同Module产生的元素整合到同一个集合。更深层的意义是，Module在此充当的插件的角色，客户端通过这些插件的不同而获取到不同的集合。

#### 其他

##### 1、@Inject和@Provides依赖生成方式的区别

- @Inject用于注入可实例化的类；@Providers可用于注入所有类（接口，抽象类等）
- @Inject可用于修饰属性和构造方法，可用于任何非@Module类在目标类中可作用于属性，在依赖类中作用于构造方法；@Providers只可用于修饰非构造方法，且该方法必须在某个Module内部
- @Inject修饰的方法只能是构造方法；@Providers修饰的方法必须以`provide`开头

# Dagger2之Component

#### 一、Component的组织方式（重点）

##### 1、按什么粒度划分[@Component ](/Component)

- 一个Component？<br />如果一个Android App中只有一个Component，那这个Component是很难维护的、变化率很高和很庞大的，因为这个Component的职责太多了导致。

##### 2、划分规则

- 有一个全局的Component（可以叫ApplicationComponent），负责管理整个App的全局类实例（全局类实例是整个App都要用到的类的实例，这些类基本上都是单例的）
- 每个页面对应一个Component，比如一个Activity页面定义一个Component，一个Fragment定义一个Component；当然这不是必须，有些页面之间的依赖类是一样的，可以共用一个Component。

##### 3、划分粒度不能过小

假如使用mvp架构搭建app，划分粒度是基于每个页面的m、v、p各自定义Component的，那Component的粒度就太小了，定义这么多的Component，**管理、维护就很非常困难**。<br />所以以**页面**划分Component在管理、维护上面相对来说更合理。

#### 二、组织Component

问题：其他的Component想要全局的依赖类实例，涉及到了**依赖类实例共享**问题。因为Component有管理创建类实例的能力。因此只要能很好的组织Component之间的关系，问题就好办了，具体的组织方式分为以下3种：

##### 依赖方式

一个Component是依赖于一个或多个Component，Component的`dependencies`属性就是依赖方式的具体体现。

##### 包含方式

一个Component是包含一个或多个Component的，被包含的Component还可以继续包含其他的Component。这种方式特别像Activity与Fragment的关系。SubComponent就是包含方式的具体体现。

##### 继承方式

官网没有提到该方式，具体没有提到的原因我觉得应该是，该方式不是解决**类实例共享**的问题，而是从更好的管理、维护Component的角度，把一些Component共有的方法抽象到一个父类中，然后子Component继承。

#### 三、SubComponent

如果一个Component的功能不能满足你的需求，你需要对它进行拓展，一种办法是使用`Component(dependencies=××.classs)`。另外一种是使用`@Subcomponent`，Subcomponent用于拓展原有component。同时，这将产生一种副作用——子component同时具备两种不同生命周期的scope。子Component具备了父Component拥有的Scope，也具备了自己的Scope。<br />Subcomponent其功能效果优点类似component的dependencies。但是使用@Subcomponent不需要在父component中显式添加子component需要用到的对象，只需要添加返回子Component的方法即可，子Component能自动在父Component中查找缺失的依赖。<br />父AppComponent：

```java
@PerApp
@Component(modules = {AppModule.class})
public interface AppComponent { //父Component
    ActivitySubComponent subAppComponent();  //1.只需要在父Component添加返回子Component的方法即可
}
```

子ActivitySubComponent：

```java
@PerActivity //2.注意子Component的Scope范围小于父Component
@Subcomponent(modules = {ActivityModule.class})//3.使用@Subcomponent
public interface ActivitySubComponent {  //子Component
    void inject(SubcomponentDemoActivity subcomponentDemoActivity);
}
```

使用：

```java
// 4.调用subComponent方法创建出子Component
DaggerAppComponent
        .builder()
        .appModule(new AppModule())
        .build()
        .subAppComponent()
        .inject(this);

// 通过调用父Component
String runningActivityName = mActivityInfo.runningActivityName();
// 通过ActivitySubComponent
AppInfo appInfo = mActivityInfo.mAppInfo();
```

通过Subcomponent，子Component就好像同时拥有两种Scope，当注入的元素来自父Component的Module，则这些元素会缓存在父Component；当注入的元素来自子Component的Module，则这些元素会缓存在子Component中。

# Dagger2之Lazy和Provider接口

Lazy和Provider都是用于包装目标类中需要被注入的类型

#### Lazy

Lazy用于延迟加载，在get()的时候，才会创建对象，后面每次get()都是一样的对象。

#### Provider

Provider用于强制重新加载，Provider保证每次重新加载，但并不意味着每次返回的对象都是不同的，只有Module的@Provide方法每次都创建新的实例时，Provider每次get()的对象才相同。

#### 案例：

- CounterComponent

```java
@Component(modules = {CounterModule.class})
public interface CounterComponent {
//    不能用父类或父接口
//    void inject(Counter counter);
    void inject(DirectCounter counter);
    void inject(LazyCounter counter);
    void inject(ProviderCounter counter);
}
```

- CounterModule

```java
 @Module
 public class CounterModule {
    int next = 100;
    private final String type;
    public CounterModule(String type) {
        this.type = type;
    }
    @Provides
    public Integer provideInteger() {
        Log.i(Counter.TAG, type + " computing...");
        return next++;
    }
 }
```

- DirectCounter

```java
 public class DirectCounter extends Counter {
    @Inject
    Integer value;
    @Override
    public void init() {
        DaggerCounterComponent.builder().counterModule(new CounterModule(this.getClass().getSimpleName())).build().inject(this);
    }
    @Override
    public void log() {
        super.log();
        logi(value.toString());
        logi(value.toString());
        logi(value.toString());
    }
 }
```

```
// DirectCounter computing
// DirectCounter printing...
// 100
// 100
// 100
```

- LazyCounter

```java
 public class LazyCounter extends Counter {
    @Inject
    Lazy<Integer> lazy;
    @Override
    public void init() {
        DaggerCounterComponent.builder().counterModule(new CounterModule(this.getClass().getSimpleName())).build().inject(this);
    }
    @Override
    public void log() {
        super.log();
        logi(lazy.get().toString()); //在这时才创建对象,以后每次调用get会得到同一个对象
        logi(lazy.get().toString());
        logi(lazy.get().toString());
    }
 }
```

```
// LazyCounter printing...
// LazyCounter computing...
// 100
// 100
// 100
```

- ProviderCounter

```java
 public class ProviderCounter extends Counter {
    @Inject
    Provider<Integer> provider;
    @Override
    public void init() {
        DaggerCounterComponent.builder().counterModule(new CounterModule(this.getClass().getSimpleName())).build().inject(this);
    }
    @Override
    public void log() {
        super.log();
        logi(provider.get().toString()); //在这时创建对象，以后每次调用get会再强制调用Module的Provides方法一次，根据Provides方法具体实现的不同，可能返回跟前面的是同一个对象，也可能不是。
        logi(provider.get().toString());
        logi(provider.get().toString());
    }
 }
```

```
// ProviderCounter printing...
// ProviderCounter computing...
// 100
// ProviderCounter computing...
// 101
// ProviderCounter computing...
// 102
```

# Dagger2之注意点及易错点

#### 一、Dagger2使用注意点

##### 1、为@Provides方法添加输入参数

Module中@Provides方法可以带输入参数，其参数由Module集合中的其他@Provides方法提供，或者自动调用@Inject的构造方法；如果找不到@Provides方法提供对应参数的对象，自动调用带@Inject参数的构造方法生成相应对象

##### 2、添加多个Module

一个Component可以包含多个Module，这样Component获取依赖时候会自动从多个Module中查找获取，Module间不能有重复方法。添加多个Module有两种方法，一种是在Component的注解@Component(modules={××××，×××}) 添加多个modules，

```java
@Component(modules={ModuleA.class,ModuleB.class,ModuleC.class}) //添加多个Module
public interface FruitComponent{
    // ...
}
```

另外一种添加多个Module的方法可以被使用Module中的@Module（includes={××××，×××})，这种使用Module的includes的方法一般用于构建更高层的Module时候使用。

```java
@Module(includes={ModuleA.class,ModuleB.class,ModuleC.class})
public class FruitModule{
    // ...
}
@Component(modules={FruitModule.class}) //添加多个Module
public interface FruitComponent{
    // ...
}
```

##### 3、DaggerXXXComponent.create()--Module实例的创建

```java
DaggerFruitComponent.create().inject(this); //7 使用FruitComponent的实现类注入
// 等价于
DaggerFruitComponent.builder().appleModule(new AppleModule()).bananaModule(new BananaModule()).build().inject(this);
```

调用`DaggerFruitComponent.create()`实际上等价于`DaggerFruitComponent.builder().build()`。DaggerFruitComponent使用了构建者模式，在构建的过程中，默认使用了Module无参的构造方法产生实例。

```java
public FruitComponent build() {
  if (appleModule == null) {
    this.appleModule = new AppleModule();
  }
  if (bananaModule == null) {
    this.bananaModule = new BananaModule();
  }
  return new DaggerFruitComponent(this);
}
```

**Note: **如果需要传入特定的Module；使用Module的有参构造器，那么必须显示传入Module实例。

##### 4、区分返回类型相同的@Providers修饰的方法

当有Fruit需要注入时，Dagger2就会在Module中查找返回类型为Fruit的方法，也就是说，Dagger2是按照Provide方法返回类型查找对应的依赖。但是，当Container需要依赖两种不同的Fruit时，你就需要写两个@Provides方法，而且这两个@Provides方法都是返回Fruit类型，靠判别返回值的做法就行不通了，编译时报如下错误：

```
Error:(20, 10) 错误: me.hacket.thirdpart.dagger2.demo3.bean.Fruit is bound multiple times:
@Provides me.hacket.thirdpart.dagger2.demo3.bean.Fruit me.hacket.thirdpart.dagger2.demo3.module.FruitModule.provideApple()
@Provides me.hacket.thirdpart.dagger2.demo3.bean.Fruit me.hacket.thirdpart.dagger2.demo3.module.FruitModule.provideBanana()
@Provides me.hacket.thirdpart.dagger2.demo3.bean.Fruit me.hacket.thirdpart.dagger2.demo3.module.AppleModule.provideFruit(int)
```

这就需要使用@Named来区分，只有具有相同`@Named`注解标记的目标类中@Inject和生成依赖类中Module的@Provides对应起来。

```java
//定义Module
@Module
public class FruitModule{
    @Named("typeA")
    @Provides
    public Fruit provideApple(){  //提供Apple给对应的mFruitA
        return new Apple();
    }
    @Named("typeB")
    @Provides
    public Fruit provdeBanana(){ //提供Banana给对应的mFruitB
        return new Banana()
    }
}
//定义Component
@Component(modules={FruitModule.class})
interface FruitComponent{    //Dagger根据接口自动生成FruitComponent
    void inject(Container container);
}
//定义Container
class Container{
    @Named("typeA") //添加标记@Name("typeA")，只获取对应的@Name("typeA")的元依赖
    @Inject
    Fruit mFruitA;
    @Named("typeB") //添加标记@Name("typeA")，只获取对应的@Name("typeA")的依赖
    @Inject
    Fruit mFruitB;
    // ...
    public void init(){
         DaggerFruitComponent.creaete().inject(this); //使用FruitComponent的实现类注入
     }

}
```

如果觉得@Named只能用字符串区分不满足需求，你也可以自定义类似@Named的注解，使用元注解@Qualifier可以实现这种注解，比如实现一个用int类型区分的@IntNamed，用法同@Named注解一样：

```java
@Qualifier // 必须，表示IntNamed是用来做区分用途
@Documented // 规范要求是Documented，当然不写也问题不大，但是建议写，做提示作用
@Retention(RetentionPolicy.RUNTIME) // 规范要求是Runtime级别
public @interface IntNamed{
    int value();
}
```

##### 5、Component定义方法的规则

- 1、Component的方法输入参数一般只有一个，对应了需要注入的类Container。**有输入参数返回值类型就是void**。

```java
@Component(modules = {FruitModule.class, AppleModule.class, BananaModule.class})
public interface FruitComponent {
    void inject(Container container);
}
```

- 2、Component的方法可以没有输入参数，但是就必须有返回值：返回的实例会先从定义的Module中查找，没有找到就用该实例对应的类带@Inject的构造器来生成返回实例。

```java
//定义ComponentB
@Component(modules={××××××××})//1.假设Module中没有provideApp()方法,但有provideInfo()
interface ComponentB{
    Apple apple(); //2.实现类自动返回由Apple(info)构建的实现类
}
public class Apple{
    @Inject
    Apple(Info info){//被@Inject标记，使用这个构造器生成实例
        // ...
    }
    Apple(){   //不会使用这个构造器，没有被@Inject标记
    }
}
```

代码会生成ComponentB的实现类DaggerComponetB,调用其apple()方法会自动使用Apple(info)构造器生成实例返回。

##### 6、目标类（如Container）中的@Inject规则

- @Inject可以标记目标类（Container）中的成员变量，这些成员变量要求至少是包级可见的，不可以标记为private
- 当@Inject标记目标类的成员变量时，会按照以下规则来查找对应依赖：

```
1.该成员变量的依赖会从Module的@Provides方法集合中查找；
2.如果查找不到，则查找成员变量对应的类是否有@Inject构造方法，并注入构造方法且递归注入该类型的成员变量
```

##### 7、Dagger2中的单例

Java中的单例通常保存在一个静态域中，这样的单例往往要等到虚拟机关闭的时候，该单例所占用的资源才释放。<br />但Dagger2创建出来的单例并不保持在静态域中，而是保留在Component实例中。

#### 二、易错点

遇到的一些常见错误

##### 1、Module中存在多个返回相同类的@Provides方法，导致Component依赖注入迷失

一个Module中，存在多个可以提供相同类的@Providers，编译时出错。

```java
@Module
public class ActivityModule {

    @Provides
    public UserModel provideUserModel() {
        UserModel userModel = new UserModel();
        userModel.name = "default hacket";
        userModel.gender = "default gender male";
        return userModel;
    }

    @Provides
    public UserModel provideUserModel2() {
        UserModel userModel = new UserModel("hacket_2", "hacket_male_2");
        return userModel;
    }
}
```

错误如下：

```
Error:(17, 10) 错误: me.hacket.thirdpart.dagger2.demo2.ui.bean.UserModel is bound multiple times:
@Provides me.hacket.thirdpart.dagger2.demo2.ui.bean.UserModel me.hacket.thirdpart.dagger2.demo2.di.module.ActivityModule.provideUserModel()
@Provides me.hacket.thirdpart.dagger2.demo2.ui.bean.UserModel me.hacket.thirdpart.dagger2.demo2.di.module.ActivityModule.provideUserModel2()
@Provides me.hacket.thirdpart.dagger2.demo2.ui.bean.UserModel me.hacket.thirdpart.dagger2.demo2.di.module.ActivityModule.provideUserModel3()
```

解决，用@Qualifier注解，在@Inject和@Provides标记一一对应起来。

##### 2、Component注入的对象不对（如为目标对象类的父类）

Component中注入的对象不对，如注入MainActivity，但是写了父类Activity，编译不会出错，运行时注入的对象为null。

```java
@Component(modules = {ActivityModule.class})
public interface ActivityComponent {
    void injectUserModel(Activity activity);
}
```

**注意：** 这里必须是真正消耗依赖的类型MainActivity，而不可以写成其父类，比如Activity。因为Dagger2在编译时生成依赖注入的代码，会到inject方法的参数类型中寻找可以注入的对象，但是实际上这些对象存在于MainActivity，而不是Activity中。如果函数声明参数为Activity，Dagger2会认为没有需要注入的对象。当真正在MainActivity中创建Component实例进行注入时，会直接执行按照Activity作为参数生成的inject方法，导致所有注入都失败。(是的，我是掉进这个坑了。)

##### 3、命名@Provider修饰的方法

```
Error:(32, 16) 错误: Cannot have more than one @Provides method with the same name in a single module
```

##### 4、Scope没有标记Scope

```
Error:(14, 1) 错误: me.hacket.thirdpart.dagger2.demo4.component.JuiceComponent (unscoped) may not reference scoped bindings:
@Singleton @Provides me.hacket.thirdpart.dagger2.demo4.bean.JuiceMachine me.hacket.thirdpart.dagger2.demo4.module.MachineModule.provideJuiceMachine()
```

# ListView展示数据

#### UserAdapter

在构造方法前添加`@Inject`注解，这个Dagger2会在获取UserAdapter对象时，调用这个标记的构造方法，从而生成一个UserAdapter对象。

```java
 public class UserAdapter extends BaseAdapter {
     private LayoutInflater inflater;
     private List<String> users;

     @Inject
     public UserAdapter(Context ctx, List<String> users) {
         this.inflater = LayoutInflater.from(ctx);
         this.users = users;
     }

     // ...
 }
```

如果构造方法含有参数，Dagger2会在调用构造对象的时候先去获取这些参数，所以要保证它的参数也提供可被Dagger调用的生成函数。<br />Dagger2调用生成对象的两种函数：

1. 用@Inject修饰的构造方法
2. @Module里用@Provides修饰的方法

#### 构建Module

用`@Provides`提供给UserAdapter的两个参数`Context`和`List<String>`，这样生成UserAdapter时需要的依赖从这里获取。

```java
@Module
public class UserModule {
    private static final int COUNT = 30;
    private final Context mContext;
    @Inject
    public UserModule(Context context) {
        this.mContext = context;
    }
    @ActivityScope
    @Provides
    public Context provideActivityContext() {
        return mContext;
    }
    @ActivityScope
    @Provides
    public List<String> providerUsers() {
        List<String> users = new ArrayList<>(COUNT);

        for (int i = 0; i < COUNT; i++) {
            users.add("item " + i);
        }

        return users;
    }
}
```

#### 构建Component

负责注入依赖，@Component生成实现并命名为`Dagger$${YouComponentClassName}`

```java
@ActivityScope
@Component(modules = {UserModule.class})
public interface UserComponent {
    void inject(Dagger2MainActivity activity);
}
```

**注意**：这里必须是真正消耗依赖的类型 `MainActivity`，而不可以写成其父类，比如`Activity` ，否则会导致注入失败。

#### [@ActivityScope ](/ActivityScope)

是一个自定义的范围注解，作用是允许对象被记录在正确的组件中，当然这些对象的生命周期应该遵循 Activity 的生命周期

```java
@Scope
@Retention(RetentionPolicy.RUNTIME)
public @interface ActivityScope {

}
```

#### 完成注入

```java
 public class Dagger2MainActivity extends AppCompatActivity {
     // ...
     @Inject
     UserAdapter adapter;
     @Override
     protected void onCreate(Bundle savedInstanceState) {
         // ...
         // 完成注入
         DaggerUserComponent.builder()
             .userModule(new UserModule(this))
             .build()
             .inject(this);
         listView.setAdapter(adapter);
     }
 }
```

#### Reference

Dagger 2: Step To Step<br /><http://www.jianshu.com/p/7505d92d7748>

# Dagger2资源

#### Dagger2基础

- 2篇：Android常用开源工具，写得还可以，很多dagger使用细节<br />Android常用开源工具（1）-Dagger2入门<br /><http://blog.csdn.net/duo2005duo/article/details/50618171><br />Android常用开源工具（2）-Dagger2进阶<br /><http://blog.csdn.net/duo2005duo/article/details/50696166>
- 这篇Dagger2对注解讲解的很到位<br />Dagger2 菜鸟入门<br /><http://www.jianshu.com/p/329611679a1c>
- 讲解的比较简单<br />依赖注入原理<br /><http://codethink.me/2015/08/01/dependency-injection-theory/><br />使用Dagger 2进行依赖注入<br /><http://codethink.me/2015/08/06/dependency-injection-with-dagger-2/>
- 一般<br />Dagger 2: Step To Step<br /><http://www.jianshu.com/p/7505d92d7748>
- 讲解的还可以<br />从零开始的Android新项目4 - Dagger2篇<br /><http://blog.zhaiyifan.cn/2016/03/27/android-new-project-from-0-p4/>
- Dagger系列：

1. [Dagger 2从浅到深(一)](http://blog.csdn.net/io_field/article/details/70947365)
2. [Dagger 2从浅到深(二)](http://blog.csdn.net/io_field/article/details/70988569)
3. [Dagger 2从浅到深(三)](http://blog.csdn.net/io_field/article/details/71055031)
4. [Dagger 2从浅到深(四)](http://blog.csdn.net/io_field/article/details/71083516)
5. [Dagger 2从浅到深(五)](http://blog.csdn.net/io_field/article/details/71122979)
6. [Dagger 2从浅到深(六)](http://blog.csdn.net/io_field/article/details/71170727)
7. [Dagger 2从浅到深(七)](http://blog.csdn.net/io_field/article/details/71319138)
8. [Dagger 2应用于Android的完美扩展库-dagger.android](http://blog.csdn.net/IO_Field/article/details/71730248)
9. <br />

#### Dagger2进阶

Android：dagger2让你爱不释手-基础依赖注入框架篇<br /><http://www.jianshu.com/p/cd2c1c9f68d4><br />Android：dagger2让你爱不释手-重点概念讲解、融合篇<br /><http://www.jianshu.com/p/1d42d2e6f4a5><br />Android：dagger2让你爱不释手-终结篇<br /><http://www.jianshu.com/p/65737ac39c44>

#### Dagger2原理

Dagger2工作流程分析<br /><http://ifarseer.github.io/2016/05/09/dagger2/>

Dagger1源码解析<br />[http://a.codekk.com/detail/Android/扔物线/Dagger 源码解析](http://a.codekk.com/detail/Android/%E6%89%94%E7%89%A9%E7%BA%BF/Dagger%20%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90)

#### Dagger2项目

<https://github.com/saulmm/Avengers>
