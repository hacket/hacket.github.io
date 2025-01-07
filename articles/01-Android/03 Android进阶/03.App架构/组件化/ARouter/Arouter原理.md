---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# ARouter架构原理

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999520177-b964d10f-d80e-4855-b02a-777a91e55b32.png#averageHue=%2392d18d&clientId=u7fa04686-552f-4&from=paste&id=uef014ae0&originHeight=466&originWidth=1000&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u30fe0ef7-3b5b-42e5-8357-c66ecc399f0&title=)

## Compiler（编译器）

> 最基础的就是`Compiler`这个SDK，主要是用来在编译期间处理注解`@Route/@Interceptor/@Autowired三个注解，在编译期间自动注册注解标注的类，成员变量等。

1. [@Route ](/Route) 生成路由信息，生成在 `build/generated/source/kapt/debug/com.alibaba.android.arouter.routes/`，一个group一个类。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999530764-be03096a-7e87-49fc-86ea-aa260d0465cd.png#averageHue=%233f4245&clientId=u7fa04686-552f-4&from=paste&height=307&id=ua1e12047&originHeight=470&originWidth=702&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uae4ae14a-c979-4ebf-8614-b89a1e8c513&title=&width=459)

2. [@Interceptor ](/Interceptor) 生成拦截器信息

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999543439-3b50dcf2-7a39-4c75-ab63-fabc6b0ece8d.png#averageHue=%231f3647&clientId=u7fa04686-552f-4&from=paste&height=38&id=uf818e83f&originHeight=56&originWidth=524&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u0272bd68-4a0a-48fb-b7a7-003cc15ca08&title=&width=354)

3. [@Autowired ](/Autowired) 依赖注入使用，类似于ButterKnife的[@Bind ](/Bind)

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999553082-5c2fed48-f139-4ada-ae96-5a80b7322fcc.png#averageHue=%23203646&clientId=u7fa04686-552f-4&from=paste&height=34&id=uabb0ec92&originHeight=58&originWidth=594&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u28b27479-a16b-4fbd-9973-b9289a0339c&title=&width=349)![](https://note.youdao.com/yws/res/101239/50B5FB484BBD4EE4A0B4A351EA781C7E#clientId=uf4124348-6810-4&id=xc5uj&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubcaeae13-bee5-449f-804d-041b2dbfe5e&title=)

## API（用户在运行期使用）

1. Launcher这一层只有ARouter和_ ARouter，ARouter就是我们需要打交道的接口，这里使用了代理模式，实际ARouter是通过_ ARouter进行工作。
2. 第二层也是绿色的，用户也是可以调用到，这里主要是提供接口，我们可以扩展服务，比如拦截器服务，成员变量装配服务等，Template主要是提供模版接口，这个SDK会在编译期生成一些映射文件，而这些映射文件会按照Template组件中提供的模板来生成，这样按照一定的规则和约束生成映射文件也方便Route在运行的时候进行读取。
3. `Warehouse`类似一个仓库，主要存储ARouter在运行期间加载的一些配置文件以及映射关系（存储页面路由/Provider/Interceptor映射关系）

```java
class Warehouse {
    // Cache route and metas
    static Map<String, Class<? extends IRouteGroup>> groupsIndex = new HashMap<>();
    static Map<String, RouteMeta> routes = new HashMap<>(); // 页面路由/Fragment等，按group来加载

    // Cache provider
    static Map<Class, IProvider> providers = new HashMap<>(); // 服务提供Provider
    static Map<String, RouteMeta> providersIndex = new HashMap<>();

    // Cache interceptor
    static Map<Integer, Class<? extends IInterceptor>> interceptorsIndex = new UniqueKeyTreeMap<>("More than one interceptors use same priority [%s]");
    static List<IInterceptor> interceptors = new ArrayList<>(); // 拦截器

    static void clear() {
        routes.clear();
        groupsIndex.clear();
        providers.clear();
        providersIndex.clear();
        interceptors.clear();
        interceptorsIndex.clear();
    }
}
```

4. Thread则是提供了线程池，因为存在多个拦截器的时候以及跳转过程中都是需要异步执行的。
5. Logistics Center。从名字上翻译就是物流中心，整个SDK的流转以及内部调用最终都会下沉到这一层。（和编译相关路由配置都在这里加载）

> 整个框架分层仔细，各个层之间分工明确。与编译期间映射关系打交道的工作都下层到`LogisticsCenter`，与用户打交道的API都在`ARouter`中。

# ARouter源码分析

## ARouter基本使用

- Activity跳转

```java
ARouter.getInstance().build("/test/activity2").withString("name", "老王").navigation();
```

- 获取服务功能

```java
// ByClass
ARouter.getInstance().navigation(HelloService.class).sayHello("mike");
// ByName
((HelloService) ARouter.getInstance().build("/yourservicegroupname/hello").navigation()).sayHello("mike");
```

## ARouter源码分析

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999942176-35f80c1f-908c-415f-96ef-baba061fd350.png#averageHue=%23189fdf&clientId=uec31ee7a-84ca-4&from=paste&height=407&id=ubc862093&originHeight=611&originWidth=596&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=90482&status=done&style=none&taskId=u092672e0-b48e-4452-9299-7ea03664d38&title=&width=397.3333333333333)<br />![](http://note.youdao.com/yws/res/25633/498DF300F70F4E50B476BC30BCED24DD#id=rNe2u&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=&width=400)

### Init流程

#### init逻辑

入口：

```java
ARouter.init(getApplication());
// ARouter
public static void init(Application application) {
    if (!hasInit) {
        logger = _ARouter.logger;
        hasInit = _ARouter.init(application); // hasInit变量用于保证初始化代码只执行一次
        if (hasInit) {
            _ARouter.afterInit();
        }
    }
}
```

ARouter是外观模式的门面，实现逻辑在`_ARouter`类中，便于解藕。<br />接着看`_ARouter.init()`：

```java
protected static synchronized boolean init(Application application) {
    mContext = application;
    LogisticsCenter.init(mContext, executor);
    hasInit = true;
    mHandler = new Handler(Looper.getMainLooper());
    return true;
}
```

1. new了一个Handler（Looper是主线程 ）
2. 初始化逻辑交给了LogisticsCenter.init()

#### LogisticsCenter

```java
public synchronized static void init(Context context, ThreadPoolExecutor tpe) throws HandlerException {
    mContext = context;
    executor = tpe;
    try {
        // 通过arouter-auto-register插件加载路由表
        loadRouterMap();
        if (registerByPlugin) { // 通过arouter-auto-register插件加载路由表
            logger.info(TAG, "Load router map by arouter-auto-register plugin.");
        } else { // App启动时动态扫描dex
            Set<String> routerMap;

            // It will rebuild router map every times when debuggable.
            if (ARouter.debuggable() || PackageUtils.isNewVersion(context)) { // 如果是debug版或是新的版本（即debug包每次初始化都会rebuild路由表）
                // 遍历所有dex文件，找到经过APT + JavaPoet处理生成的文件，并且将文件存到Map中
                routerMap = ClassUtils.getFileNameByPackageName(mContext, ROUTE_ROOT_PAKCAGE); // getFileNameByPackageName()方法返回所有满足需求的类名
                if (!routerMap.isEmpty()) { // 路由表保存到本地缓存sp
                    context.getSharedPreferences(AROUTER_SP_CACHE_KEY, Context.MODE_PRIVATE).edit().putStringSet(AROUTER_SP_KEY_MAP, routerMap).apply();
                }
                PackageUtils.updateVersion(context);    // Save new version name when router map update finishes.
            } else { // 从本地sp缓存中加载
                routerMap = new HashSet<>(context.getSharedPreferences(AROUTER_SP_CACHE_KEY, Context.MODE_PRIVATE).getStringSet(AROUTER_SP_KEY_MAP, new HashSet<String>()));
            }
            
            // 根据全路径名去匹配生成的Java文件类型，并且通过反射创建这个类的实例，并调用它的loadInto方法
            for (String className : routerMap) {
                if (className.startsWith(ROUTE_ROOT_PAKCAGE + DOT + SDK_NAME + SEPARATOR + SUFFIX_ROOT)) {
                    // com.alibaba.android.arouter.routes.ARouter$$Root
                    ((IRouteRoot) (Class.forName(className).getConstructor().newInstance())).loadInto(Warehouse.groupsIndex);
                } else if (className.startsWith(ROUTE_ROOT_PAKCAGE + DOT + SDK_NAME + SEPARATOR + SUFFIX_INTERCEPTORS)) {
                    // com.alibaba.android.arouter.routes.ARouter$$Interceptors
                    // Load interceptorMeta
                    ((IInterceptorGroup) (Class.forName(className).getConstructor().newInstance())).loadInto(Warehouse.interceptorsIndex);
                } else if (className.startsWith(ROUTE_ROOT_PAKCAGE + DOT + SDK_NAME + SEPARATOR + SUFFIX_PROVIDERS)) {
                    // com.alibaba.android.arouter.routes.ARouter$$Providers
                    // Load providerIndex
                    ((IProviderGroup) (Class.forName(className).getConstructor().newInstance())).loadInto(Warehouse.providersIndex);
                }
            }
        }
 
        if (Warehouse.groupsIndex.size() == 0) {
            logger.error(TAG, "No mapping files were found, check your configuration please!");
        }

        if (ARouter.debuggable()) {
            logger.debug(TAG, String.format(Locale.getDefault(), "LogisticsCenter has already been loaded, GroupIndex[%d], InterceptorIndex[%d], ProviderIndex[%d]", Warehouse.groupsIndex.size(), Warehouse.interceptorsIndex.size(), Warehouse.providersIndex.size()));
        }
    } catch (Exception e) {
        throw new HandlerException(TAG + "ARouter init logistics center exception! [" + e.getMessage() + "]");
    }
}
```

LogisticsCenter的init()方法主要做两件事：

1. 找出`com.alibaba.android.arouter.routes`包下面所有的类名（这些是通过apt生成的），存到集合中。通过两种方式来获取，一种是在运行期间动态的遍历所有dex文件，另外一种是通过编译期间自定义插件通过ASM的方式把符合预期的类信息插入注册代码到loadRouterMap中。<br />![](https://note.youdao.com/yws/res/101350/WEBRESOURCE974876f8065a1b405323c24b2fc26025#id=neZBX&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999960410-5a7ea673-632e-4535-8f21-59b1d6fa0ebd.png#averageHue=%23383e43&clientId=uec31ee7a-84ca-4&from=paste&id=uf97e12af&originHeight=373&originWidth=587&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufcbad430-7143-4b8c-a5c7-0d03b5c656f&title=)
2. 根据类名，通过反射创建这个类的实例并且调用这个对象的loadInto方法去初始化Warehouse里面的参数(Root、Interceptor和Provider)

#### Warehouse

WareHouse相当于ARouter的全局缓存：

```java
//Warehouse.java
// Cache route and metas
static Map<String, Class<? extends IRouteGroup>> groupsIndex = new HashMap<>();
static Map<String, RouteMeta> routes = new HashMap<>();

// Cache provider
static Map<Class, IProvider> providers = new HashMap<>();
static Map<String, RouteMeta> providersIndex = new HashMap<>();

// Cache interceptor
static Map<Integer, Class<? extends IInterceptor>> interceptorsIndex = new UniqueKeyTreeMap<>("More than one interceptors use same priority [%s]");
static List<IInterceptor> interceptors = new ArrayList<>();
```

1. groupsIndex<br />key为group名字，一般为module名，key为`@Route`注解通过apt生成的class
2. routes
3. providersIndex
4. providers
5. interceptorsIndex
6. interceptors

- **1、groupsIndex** 对应IRouteRoot

```java
public class ARouter$$Root$$app implements IRouteRoot {
  @Override
  public void loadInto(Map<String, Class<? extends IRouteGroup>> routes) {
    routes.put("about", ARouter$$Group$$about.class);
    routes.put("home", ARouter$$Group$$home.class);
    routes.put("splash", ARouter$$Group$$splash.class);
  }
}
```

key为group名称，官方推荐group名与当前模块名字相同，但是也可以一个模块设置多个分组；关于value 是一个Class类型，它继承 IRouteGroup接口，这个类是通过APT自动生成的,这个类记载了同个Module同个组名下所有被@Route注解修饰的类信息

```java
public class ARouter$$Group$$home implements IRouteGroup {
  @Override
  public void loadInto(Map<String, RouteMeta> atlas) {
    atlas.put("/home/dialog_provider", RouteMeta.build(RouteType.PROVIDER, HomePageDialogProvider.class, "/home/dialog_provider", "home", null, -1, -2147483648));
    atlas.put("/home/immersive_web", RouteMeta.build(RouteType.ACTIVITY, ImmersiveWebActivity.class, "/home/immersive_web", "home", new java.util.HashMap<String, Integer>(){{put("back", 0); put("url", 8); }}, -1, -2147483648));
    atlas.put("/home/tab", RouteMeta.build(RouteType.ACTIVITY, MainActivity.class, "/home/tab", "home", new java.util.HashMap<String, Integer>(){{put("tab", 8); put("isFormLogin", 0); put("click_ad_deeplink", 8); put("page", 8); }}, -1, 3));
    atlas.put("/home/web", RouteMeta.build(RouteType.ACTIVITY, SimpleWebActivity.class, "/home/web", "home", new java.util.HashMap<String, Integer>(){{put("back", 0); put("url", 8); }}, -1, -2147483648));
  }
}
```

- key为@Route注解设置的路径，value是RouteMeta对象

```java
public class RouteMeta {
    private RouteType type;         // Type of route
    private Element rawType;        // Raw type of route
    private Class<?> destination;   // Destination
    private String path;            // Path of route
    private String group;           // Group of route
    private int priority = -1;      // The smaller the number, the higher the priority
    private int extra;              // Extra data
    private Map<String, Integer> paramsType;  // Param type
    private String name;
}

// 记录了路由类型，目标class等信息
public enum RouteType {
    ACTIVITY(0, "android.app.Activity"),
    SERVICE(1, "android.app.Service"),
    PROVIDER(2, "com.alibaba.android.arouter.facade.template.IProvider"),
    CONTENT_PROVIDER(-1, "android.app.ContentProvider"),
    BOARDCAST(-1, ""),
    METHOD(-1, ""),
    FRAGMENT(-1, "android.app.Fragment"),
    UNKNOWN(-1, "Unknown route type");
}
```

其他的一些Group：

```java
public interface IRouteRoot {
    void loadInto(Map<String, Class<? extends IRouteGroup>> routes);
}

public interface IRouteGroup {
    void loadInto(Map<String, RouteMeta> atlas);
}

public interface IInterceptorGroup {
    void loadInto(Map<Integer, Class<? extends IInterceptor>> interceptor);
}

public interface IProviderGroup {
    void loadInto(Map<String, RouteMeta> providers);
}
```

- **2、providersIndex** 对应IProviderGroup

```java
public class ARouter$$Providers$$m_room implements IProviderGroup {
  @Override
  public void loadInto(Map<String, RouteMeta> providers) {
    providers.put("club.jinmei.mgvoice.core.arouter.provider.family.IFamilyRecallProvider", RouteMeta.build(RouteType.PROVIDER, FamilyRecallProvider.class, "/room/family_recall_provider", "room", null, -1, -2147483648));
    providers.put("club.jinmei.mgvoice.core.arouter.provider.gift.IMGiftProvider", RouteMeta.build(RouteType.PROVIDER, GiftProvider.class, "/room/load_gift", "room", null, -1, -2147483648));
    providers.put("club.jinmei.mgvoice.core.arouter.provider.room.IRoomProvider", RouteMeta.build(RouteType.PROVIDER, RoomProviderImpl.class, "/room/room_provider", "room", null, -1, -2147483648));
  }
}
```

> key为Provider的全路径名，value为RouteMeta对象

- **3、interceptorsIndex** 对应IInterceptorGroup

```java
public class ARouter$$Interceptors$$m_core implements IInterceptorGroup {
  @Override
  public void loadInto(Map<Integer, Class<? extends IInterceptor>> interceptors) {
    interceptors.put(1, ARouterLoginInterceptor.class);
    interceptors.put(2, ARouterMiniRoomInterceptor.class);
    interceptors.put(3, ARouterUpdateInterceptor.class);
    interceptors.put(4, RoomLockInterceptor.class);
  }
}
```

> key为拦截器的priority，value为Interceptor的class

### navigation流程

```java
ARouter.getInstance()
    .build(ARouterConstants.Me.ROUTER_PATH_ACTIVITY_FEEDBACK)
    .withInt("reportFrom", 3/*ReportPostRequestBean.REPORT_FROM_VOICE_ROOM*/)
    .withString("feedbackUserId", uid)
    .navigation()
```

build方法的真正实现也在_ARouter中：

```java
// ARouter
public Postcard build(String path) {
    return _ARouter.getInstance().build(path);
}
// _ARouter
protected Postcard build(String path, String group) {
    if (TextUtils.isEmpty(path) || TextUtils.isEmpty(group)) {
        throw new HandlerException(Consts.TAG + "Parameter is invalid!");
    } else {
        PathReplaceService pService = ARouter.getInstance().navigation(PathReplaceService.class);
        if (null != pService) {
            path = pService.forString(path);
        }
        return new Postcard(path, group);
    }
}
```

- 通过path和group创建了Postcard对象

#### Postcard

Postcard 明信片，路由的一些信息和参数

```java
// A container that contains the roadmap.
public final class Postcard extends RouteMeta {
    // Base
    private Uri uri;
    private Object tag;             // A tag prepare for some thing wrong.
    private Bundle mBundle;         // Data to transform
    private int flags = -1;         // Flags of route
    private int timeout = 300;      // Navigation timeout, TimeUnit.Second
    private IProvider provider;     // It will be set value, if this postcard was provider.
    private boolean greenChannel;
    private SerializationService serializationService;

    // Animation
    private Bundle optionsCompat;    // The transition animation of activity
    private int enterAnim = -1;
    private int exitAnim = -1;
}
```

#### navigation

而navigation最终会调用到_ARouter中的navigation方法：

##### navigation(Class)

```java
// ARouter
public <T> T navigation(Class<? extends T> service) {
    return _ARouter.getInstance().navigation(service);
}
// _ARouter
protected <T> T navigation(Class<? extends T> service) {
    try {
        Postcard postcard = LogisticsCenter.buildProvider(service.getName());

        // Compatible 1.0.5 compiler sdk.
        // Earlier versions did not use the fully qualified name to get the service
        if (null == postcard) {
            // No service, or this service in old version.
            postcard = LogisticsCenter.buildProvider(service.getSimpleName());
        }

        if (null == postcard) {
            return null;
        }

        LogisticsCenter.completion(postcard);
        return (T) postcard.getProvider();
    } catch (NoRouteFoundException ex) {
        logger.warning(Consts.TAG, ex.getMessage());
        return null;
    }
}
```

1. 通过LogisticsCenter.completion填充Postcard
2. 返回postcard.getProvider()，其为destination，在LogisticsCenter.completion会反射创建出来，然后缓存到`Warehouse.providers()`

##### navigation(Context mContext, Postcard postcard, int requestCode, NavigationCallback callback)

```java
// ARouter
public Object navigation(Context mContext, Postcard postcard, int requestCode, NavigationCallback callback) {
    return _ARouter.getInstance().navigation(mContext, postcard, requestCode, callback);
}
// _ARouter
protected Object navigation(final Context context, final Postcard postcard, final int requestCode, final NavigationCallback callback) {
    PretreatmentService pretreatmentService = ARouter.getInstance().navigation(PretreatmentService.class);
    if (null != pretreatmentService && !pretreatmentService.onPretreatment(context, postcard)) {
        // Pretreatment failed, navigation canceled.
        return null;
    }
    try {
        LogisticsCenter.completion(postcard); // 1
    } catch (NoRouteFoundException ex) {
        if (null != callback) { // 路由失败的callback
            callback.onLost(postcard);
        } else { // 路由失败降级服务
            DegradeService degradeService = ARouter.getInstance().navigation(DegradeService.class);
            if (null != degradeService) {
                degradeService.onLost(context, postcard);
            }
        }
        return null;
    }
    if (null != callback) { // 有可达路由
        callback.onFound(postcard);
    }
    if (!postcard.isGreenChannel()) {   // It must be run in async thread, maybe interceptor cost too mush time made ANR.
        // 拦截服务
        interceptorService.doInterceptions(postcard, new InterceptorCallback() {
            @Override
            public void onContinue(Postcard postcard) {
                _navigation(context, postcard, requestCode, callback);
            }
            @Override
            public void onInterrupt(Throwable exception) {
                if (null != callback) {
                    callback.onInterrupt(postcard);
                }
            }
        });
    } else {
        return _navigation(context, postcard, requestCode, callback);
    }
    return null;
}
```

1. 调用`LogisticsCenter.completion`方法去从WareHouse中获取缓存数据填充当前的Postcard
2. 如果是Green Channel，直接调用_navigation()
3. 如果不是Green Channel，通过InterceptorService在子线程中进行拦截服务，然后_navigation()

##### Postcard信息完善

先看看`LogisticsCenter.completion`：

```java
public synchronized static void completion(Postcard postcard) {
    RouteMeta routeMeta = Warehouse.routes.get(postcard.getPath()); // 从routes取出RouteMeata信息
    if (null == routeMeta) {    // Maybe its does't exist, or didn't load. // 不存在或未加载
        Class<? extends IRouteGroup> groupMeta = Warehouse.groupsIndex.get(postcard.getGroup());  // Load route meta.
        if (null == groupMeta) {
            throw new NoRouteFoundException(TAG + "There is no route match the path [" + postcard.getPath() + "], in group [" + postcard.getGroup() + "]");
        } else {
            // Load route and cache it into memory, then delete from metas.
            try {
                IRouteGroup iGroupInstance = groupMeta.getConstructor().newInstance();
                iGroupInstance.loadInto(Warehouse.routes);
                Warehouse.groupsIndex.remove(postcard.getGroup());
            } catch (Exception e) {
                throw new HandlerException(TAG + "Fatal exception when loading group meta. [" + e.getMessage() + "]");
            }
            completion(postcard);   // Reload
        }
    } else {
        postcard.setDestination(routeMeta.getDestination());
        postcard.setType(routeMeta.getType());
        postcard.setPriority(routeMeta.getPriority());
        postcard.setExtra(routeMeta.getExtra());

        Uri rawUri = postcard.getUri();
        if (null != rawUri) {   // Try to set params into bundle.
            Map<String, String> resultMap = TextUtils.splitQueryParameters(rawUri);
            Map<String, Integer> paramsType = routeMeta.getParamsType();

            if (MapUtils.isNotEmpty(paramsType)) {
                // Set value by its type, just for params which annotation by @Param
                for (Map.Entry<String, Integer> params : paramsType.entrySet()) {
                    setValue(postcard,
                            params.getValue(),
                            params.getKey(),
                            resultMap.get(params.getKey()));
                }

                // Save params name which need auto inject.
                postcard.getExtras().putStringArray(ARouter.AUTO_INJECT, paramsType.keySet().toArray(new String[]{}));
            }

            // Save raw uri
            postcard.withString(ARouter.RAW_URI, rawUri.toString());
        }

        switch (routeMeta.getType()) {
            case PROVIDER:  // if the route is provider, should find its instance
                // Its provider, so it must implement IProvider
                Class<? extends IProvider> providerMeta = (Class<? extends IProvider>) routeMeta.getDestination();
                IProvider instance = Warehouse.providers.get(providerMeta);
                if (null == instance) { // There's no instance of this provider
                    IProvider provider;
                    try {
                        provider = providerMeta.getConstructor().newInstance();
                        provider.init(mContext);
                        Warehouse.providers.put(providerMeta, provider);
                        instance = provider;
                    } catch (Exception e) {
                        throw new HandlerException("Init provider failed! " + e.getMessage());
                    }
                }
                postcard.setProvider(instance);
                postcard.greenChannel();    // Provider should skip all of interceptors
                break;
            case FRAGMENT:
                postcard.greenChannel();    // Fragment needn't interceptors
            default:
                break;
        }
    }
}
```

1. 根据path去`Warehouse.routes`查找RouteMeta，如果不存在，从`Warehouse.groupsIndex`中查找，找到通过反射创建实例，然后填充到`Warehouse.routes`中去；如果存在，看2步骤
2. 根据获取到的RouteMeta将信息填充到Postcard，FRAGMENT和PROVIDER类型是绿色通道。

##### 路由

接着看`_navigation()`逻辑：

```java
private Object _navigation(final Context context, final Postcard postcard, final int requestCode, final NavigationCallback callback) {
    final Context currentContext = null == context ? mContext : context;
    switch (postcard.getType()) {
        case ACTIVITY:
            // Build intent
            final Intent intent = new Intent(currentContext, postcard.getDestination());
            intent.putExtras(postcard.getExtras());

            // Set flags.
            int flags = postcard.getFlags();
            if (-1 != flags) {
                intent.setFlags(flags);
            } else if (!(currentContext instanceof Activity)) {    // Non activity, need less one flag.
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            }

            // Set Actions
            String action = postcard.getAction();
            if (!TextUtils.isEmpty(action)) {
                intent.setAction(action);
            }

            // Navigation in main looper.
            runInMainThread(new Runnable() {
                @Override
                public void run() {
                    startActivity(requestCode, currentContext, intent, postcard, callback);
                }
            });

            break;
        case PROVIDER:
            return postcard.getProvider();
        case BOARDCAST:
        case CONTENT_PROVIDER:
        case FRAGMENT:
            Class fragmentMeta = postcard.getDestination();
            try {
                Object instance = fragmentMeta.getConstructor().newInstance();
                if (instance instanceof Fragment) {
                    ((Fragment) instance).setArguments(postcard.getExtras());
                } else if (instance instanceof android.support.v4.app.Fragment) {
                    ((android.support.v4.app.Fragment) instance).setArguments(postcard.getExtras());
                }

                return instance;
            } catch (Exception ex) {
                logger.error(Consts.TAG, "Fetch fragment instance error, " + TextUtils.formatStackTrace(ex.getStackTrace()));
            }
        case METHOD:
        case SERVICE:
        default:
            return null;
    }
    return null;
}
```

1. ACTIVITY类型，构建Intent，在主线程中startActivity
2. PROVIDER类型，直接调用getProvider()，provider是在LogisticsCenter.completion完成的，反射创建实例的
3. BROADCAST、CONTENT_PROVIDER和FRAGMENT类型，通过反射创建实例的
4. 其他类型，方法null

### Inject流程

```java
ARouter.getInstance().inject(this);
```

最终会调用到_ARouter中的如下方法：

```java
// _ARouter.java
static void inject(Object thiz) {
    AutowiredService autowiredService = ((AutowiredService) ARouter.getInstance().build("/arouter/service/autowired").navigation());
    if (null != autowiredService) {
        autowiredService.autowire(thiz);
    }
}
```

path 是`/arouter/service/autowired`对应的实例是`AutowiredServiceImpl`，最终inject方法会调用到`AutowiredServiceImpl.autowire()`方法。

```java
public interface AutowiredService extends IProvider {
    void autowire(Object instance);
}

@Route(path = "/arouter/service/autowired")
public class AutowiredServiceImpl implements AutowiredService {
    private LruCache<String, ISyringe> classCache;
    private List<String> blackList;

    @Override
    public void init(Context context) {
        classCache = new LruCache<>(66);
        blackList = new ArrayList<>();
    }

    @Override
    public void autowire(Object instance) {
        String className = instance.getClass().getName();
        try {
            if (!blackList.contains(className)) {
                ISyringe autowiredHelper = classCache.get(className);
                if (null == autowiredHelper) {  // No cache.
                    // SUFFIX_AUTOWIRED: 目标类名$$ARouter$$Autowired，如：MainActivity$$ARouter$$Autowired.java
                    autowiredHelper = (ISyringe) Class.forName(instance.getClass().getName() + SUFFIX_AUTOWIRED).getConstructor().newInstance();
                }
                autowiredHelper.inject(instance);
                classCache.put(className, autowiredHelper);
            }
        } catch (Exception ex) {
            blackList.add(className);    // This instance need not autowired.
        }
    }
}
```

- 根据inject传入的class对象，构造AutowiredProcessor注解处理器自动生成的Java文件名，然后通过反射方式获取这个类的实例。

下面是MainActivity生成的自动注入代码：

```java
public class MainActivity$$ARouter$$Autowired implements ISyringe {
  private SerializationService serializationService;

  @Override
  public void inject(Object target) {
    serializationService = ARouter.getInstance().navigation(SerializationService.class);
    MainActivity substitute = (MainActivity)target;
    substitute.tabId = substitute.getIntent().getStringExtra("tab");
    substitute.page = substitute.getIntent().getStringExtra("page");
    substitute.isFormLogin = substitute.getIntent().getBooleanExtra("isFormLogin", substitute.isFormLogin);
    substitute.shouldJumpAdDeeplink = substitute.getIntent().getStringExtra("click_ad_deeplink");
    substitute.userAwardedBadge = ARouter.getInstance().navigation(IAwardedUserBadgeProvider.class);
  }
}
```

### Interceptor流程

在前面init流程初始化完成之后会调用afterInit去初始化拦截器

```java
static void afterInit() {
    // Trigger interceptor init, use byName.
    interceptorService = (InterceptorService) ARouter.getInstance().build("/arouter/service/interceptor").navigation(); // 返回的是InterceptorServiceImpl实例
}
```

path:`/arouter/service/interceptor`对应目标类`InterceptorServiceImpl`

#### 初始化interceptors

在navigation流程在创建IProvider对象时候会调用它的init方法（LogisticsCenter.completion()方法中）

```java
// InterceptorServiceImpl.java
@Override
public void init(final Context context) {
    LogisticsCenter.executor.execute(new Runnable() {
        @Override
        public void run() {
            if (MapUtils.isNotEmpty(Warehouse.interceptorsIndex)) {
                for (Map.Entry<Integer, Class<? extends IInterceptor>> entry : Warehouse.interceptorsIndex.entrySet()) {
                    Class<? extends IInterceptor> interceptorClass = entry.getValue();
                    try {
                        IInterceptor iInterceptor = interceptorClass.getConstructor().newInstance();
                        iInterceptor.init(context);
                        Warehouse.interceptors.add(iInterceptor);
                    } catch (Exception ex) {
                        throw new HandlerException(TAG + "ARouter init interceptor error! name = [" + interceptorClass.getName() + "], reason = [" + ex.getMessage() + "]");
                    }
                }
                interceptorHasInit = true;
                synchronized (interceptorInitLock) {
                    interceptorInitLock.notifyAll();
                }
            }
        }
    });
}
```

- 根据Warehouse.interceptorsIndex去初始化Warehouse.interceptors
- 如果在doInterceptions进行拦截时，还未init，会先init，然后通过interceptorInitLock唤醒

#### doInterceptions 拦截逻辑

在navigation流程，构建完Postcard之后如果是非IProvider或者Fragment会去尝试判断是否拦截：

```java
protected Object navigation(final Context context, final Postcard postcard, final int requestCode, final NavigationCallback callback) {
    // ...
    try {
        LogisticsCenter.completion(postcard);
    } catch (NoRouteFoundException ex) {
        //...
    }
    // ...
    if (!postcard.isGreenChannel()) {   // It must be run in async thread, maybe interceptor cost too mush time made ANR.
        // interceptorService其实就是InterceptorServiceImpl实例
        interceptorService.doInterceptions(postcard, new InterceptorCallback() {
            @Override
            public void onContinue(Postcard postcard) {}
            @Override
            public void onInterrupt(Throwable exception) {}
        });
    } 
    // ...
}
```

调用了InterceptorServiceImpl.doInterceptions方法：

```java
@Override
public void doInterceptions(final Postcard postcard, final InterceptorCallback callback) {
    if (null != Warehouse.interceptors && Warehouse.interceptors.size() > 0) {
        checkInterceptorsInitStatus();
        if (!interceptorHasInit) {
            callback.onInterrupt(new HandlerException("Interceptors initialization takes too much time."));
            return;
        }
        LogisticsCenter.executor.execute(new Runnable() {
            @Override
            public void run() {
                CancelableCountDownLatch interceptorCounter = new CancelableCountDownLatch(Warehouse.interceptors.size());
                try {
                    _excute(0, interceptorCounter, postcard);
                    interceptorCounter.await(postcard.getTimeout(), TimeUnit.SECONDS); // 在这阻塞者，直到调用了count次countDown()方法
                    if (interceptorCounter.getCount() > 0) {    // Cancel the navigation this time, if it hasn't return anythings.
                        callback.onInterrupt(new HandlerException("The interceptor processing timed out."));
                    } else if (null != postcard.getTag()) {    // Maybe some exception in the tag.
                        callback.onInterrupt(new HandlerException(postcard.getTag().toString()));
                    } else {
                        callback.onContinue(postcard);
                    }
                } catch (Exception e) {
                    callback.onInterrupt(e);
                }
            }
        });
    } else {
        callback.onContinue(postcard);
    }
}
private static void _execute(final int index, final CancelableCountDownLatch counter, final Postcard postcard) {
    if (index < Warehouse.interceptors.size()) {
        IInterceptor iInterceptor = Warehouse.interceptors.get(index);
        iInterceptor.process(postcard, new InterceptorCallback() {
            @Override
            public void onContinue(Postcard postcard) {
                // Last interceptor excute over with no exception.
                counter.countDown(); // 执行了一个Interceptor后，countDown下
                _execute(index + 1, counter, postcard);  // When counter is down, it will be execute continue ,but index bigger than interceptors size, then U know.
            }
            @Override
            public void onInterrupt(Throwable exception) {
                //...
                counter.cancel();
            }
        });
    }
}
```

- 建一个与拦截器数量相同的CancelableCountDownLatch初始计数值，每放行一个拦截器就countDown，并交给后一个拦截器，如果拦截则清0计数，并将拦截的Throwable存入postcard的tag字段，interceptorCounter.await();阻塞直到计数归0或者阻塞超时（默认是300秒），最后通过interceptorCounter.getCount()判断是否是超时，还是拦截或者放行。
- 拦截的过程都是在子线程中处理，包括Interceptor的process也是在子线程调用的，因此，如果想要在拦截过程中展示dialog等都需要切换到主线程。

> CancelableCountDownLatch，调用await方法后，会一直阻塞着，直到调用了count次countDown后，才会执行await后代码。

## com.alibaba.arouter插件分析

<https://github.com/alibaba/ARouter/tree/develop/arouter-gradle-plugin>

入口类`com.alibaba.android.arouter.register.launch.PluginLaunch`

```groovy
public class PluginLaunch implements Plugin<Project> {
    @Override
    public void apply(Project project) {
        def isApp = project.plugins.hasPlugin(AppPlugin)
        // only application module needs this plugin to generate register code
        if (isApp) {
            Logger.make(project)

            Logger.i('Project enable arouter-register plugin')

            def android = project.extensions.getByType(AppExtension)
            def transformImpl = new RegisterTransform(project) // 注册transform

            //init arouter-auto-register settings
            ArrayList<ScanSetting> list = new ArrayList<>(3)
            list.add(new ScanSetting('IRouteRoot'))
            list.add(new ScanSetting('IInterceptorGroup'))
            list.add(new ScanSetting('IProviderGroup'))
            RegisterTransform.registerList = list
            //register this plugin
            android.registerTransform(transformImpl)
        }
    }
}
```

1. 只有app module（应用了`com.android.application`插件的module）才需要应用该插件
2. 注册RegisterTransform一个AGP的transform
3. ScanSetting是一些插件名、ARouter类全路径等的一些配置

现在看看`RegisterTransform`，重点看`transform(...)`方法

```groovy
class RegisterTransform extends Transform {
    @Override
    void transform(Context context, Collection<TransformInput> inputs
                   , Collection<TransformInput> referencedInputs
                   , TransformOutputProvider outputProvider
                   , boolean isIncremental) throws IOException, TransformException, InterruptedException {

        Logger.i('Start scan register info in jar file.')

        long startTime = System.currentTimeMillis()
        boolean leftSlash = File.separator == '/'

        inputs.each { TransformInput input ->

            // scan all jars // 处理jar
            input.jarInputs.each { JarInput jarInput ->
                String destName = jarInput.name
                // rename jar files // 重命名
                def hexName = DigestUtils.md5Hex(jarInput.file.absolutePath)
                if (destName.endsWith(".jar")) {
                    destName = destName.substring(0, destName.length() - 4) // 取jar的name，不包括.jar后缀
                }
                // input file
                File src = jarInput.file
                // output file 输出路径，名字为：原有jar的name_全路径的md5值
                File dest = outputProvider.getContentLocation(destName + "_" + hexName, jarInput.contentTypes, jarInput.scopes, Format.JAR)

                // scan jar file to find classes
                if (ScanUtil.shouldProcessPreDexJar(src.absolutePath)) {
                    ScanUtil.scanJar(src, dest)
                }
                FileUtils.copyFile(src, dest)

            }
            // scan class files // 处理class
            input.directoryInputs.each { DirectoryInput directoryInput ->
                File dest = outputProvider.getContentLocation(directoryInput.name, directoryInput.contentTypes, directoryInput.scopes, Format.DIRECTORY)
                String root = directoryInput.file.absolutePath
                if (!root.endsWith(File.separator))
                    root += File.separator
                directoryInput.file.eachFileRecurse { File file ->
                    def path = file.absolutePath.replace(root, '')
                    if (!leftSlash) {
                        path = path.replaceAll("\\\\", "/")
                    }
                    if(file.isFile() && ScanUtil.shouldProcessClass(path)){
                        ScanUtil.scanClass(file)
                    }
                }

                // copy to dest
                FileUtils.copyDirectory(directoryInput.file, dest)
            }
        }

        Logger.i('Scan finish, current cost time ' + (System.currentTimeMillis() - startTime) + "ms")

        if (fileContainsInitClass) {
            registerList.each { ext ->
                Logger.i('Insert register code to file ' + fileContainsInitClass.absolutePath)

                if (ext.classList.isEmpty()) {
                    Logger.e("No class implements found for interface:" + ext.interfaceName)
                } else {
                    ext.classList.each {
                        Logger.i(it)
                    }
                    RegisterCodeGenerator.insertInitCodeTo(ext)
                }
            }
        }

        Logger.i("Generate code finish, current cost time: " + (System.currentTimeMillis() - startTime) + "ms")
    }
}
```

1. 分别处理jar和源文件编译的class，分别调用`ScanUtil.scanJar`和`ScanUtil.scanClass`
2. 遍历registerList，调用`RegisterCodeGenerator.insertInitCodeTo()`

先看`ScanUtil.scanClass`：

```java
static void scanClass(InputStream inputStream) {
    ClassReader cr = new ClassReader(inputStream)
    ClassWriter cw = new ClassWriter(cr, 0)
    ScanClassVisitor cv = new ScanClassVisitor(Opcodes.ASM5, cw)
    cr.accept(cv, ClassReader.EXPAND_FRAMES)
    inputStream.close()
}
static class ScanClassVisitor extends ClassVisitor {
    ScanClassVisitor(int api, ClassVisitor cv) {
        super(api, cv)
    }
    void visit(int version, int access, String name, String signature,
               String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces)
        RegisterTransform.registerList.each { ext ->
            if (ext.interfaceName && interfaces != null) {
                interfaces.each { itName ->
                    if (itName == ext.interfaceName) {
                        ext.classList.add(name)
                    }
                }
            }
        }
    }
}
```

RegisterTransform.registerList为：

```groovy
ArrayList<ScanSetting> list = new ArrayList<>(3)
list.add(new ScanSetting('IRouteRoot'))
list.add(new ScanSetting('IInterceptorGroup'))
list.add(new ScanSetting('IProviderGroup'))
RegisterTransform.registerList = list
```

扫描所有的class，找到实现了上诉3个接口的类，添加到`ScanSetting.classList`

```groovy
// 存放扫描到实现了指定接口的所有class
ArrayList<String> classList = new ArrayList<>()
```

接口看`RegisterCodeGenerator.insertInitCodeTo()`

```groovy
static void insertInitCodeTo(ScanSetting registerSetting) {
    if (registerSetting != null && !registerSetting.classList.isEmpty()) {
        RegisterCodeGenerator processor = new RegisterCodeGenerator(registerSetting)
        File file = RegisterTransform.fileContainsInitClass
        if (file.getName().endsWith('.jar'))
            processor.insertInitCodeIntoJarFile(file)
    }
}
```

接着走到`insertInitCodeIntoJarFile()`方法：

```java
private File insertInitCodeIntoJarFile(File jarFile) {
    if (jarFile) {
        def optJar = new File(jarFile.getParent(), jarFile.name + ".opt")
        if (optJar.exists())
            optJar.delete()
        def file = new JarFile(jarFile)
        Enumeration enumeration = file.entries()
        JarOutputStream jarOutputStream = new JarOutputStream(new FileOutputStream(optJar))

        while (enumeration.hasMoreElements()) {
            JarEntry jarEntry = (JarEntry) enumeration.nextElement()
            String entryName = jarEntry.getName()
            ZipEntry zipEntry = new ZipEntry(entryName)
            InputStream inputStream = file.getInputStream(jarEntry)
            jarOutputStream.putNextEntry(zipEntry)
            // 如果class name为com/alibaba/android/arouter/core/LogisticsCenter
            if (ScanSetting.GENERATE_TO_CLASS_FILE_NAME == entryName) {
                Logger.i('Insert init code to class >> ' + entryName)

                def bytes = referHackWhenInit(inputStream)
                jarOutputStream.write(bytes)
            } else {
                jarOutputStream.write(IOUtils.toByteArray(inputStream))
            }
            inputStream.close()
            jarOutputStream.closeEntry()
        }
        jarOutputStream.close()
        file.close()

        if (jarFile.exists()) {
            jarFile.delete()
        }
        optJar.renameTo(jarFile)
    }
    return jarFile
}
```

接着调用`referHackWhenInit()`方法：

```java
//refer hack class when object init
    private byte[] referHackWhenInit(InputStream inputStream) {
    ClassReader cr = new ClassReader(inputStream)
    ClassWriter cw = new ClassWriter(cr, 0)
    ClassVisitor cv = new MyClassVisitor(Opcodes.ASM5, cw)
    cr.accept(cv, ClassReader.EXPAND_FRAMES)
    return cw.toByteArray()
}
```

现在看MyClassVisitor：

```java
class MyClassVisitor extends ClassVisitor {

    MyClassVisitor(int api, ClassVisitor cv) {
        super(api, cv)
    }

    void visit(int version, int access, String name, String signature,
               String superName, String[] interfaces) {
        super.visit(version, access, name, signature, superName, interfaces)
    }
    @Override
    MethodVisitor visitMethod(int access, String name, String desc,
                              String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions)
        //generate code into this method
        if (name == ScanSetting.GENERATE_TO_METHOD_NAME) { // 如果是loadRouterMap方法
            mv = new RouteMethodVisitor(Opcodes.ASM5, mv)
        }
        return mv
    }
}

class RouteMethodVisitor extends MethodVisitor {

    RouteMethodVisitor(int api, MethodVisitor mv) {
        super(api, mv)
    }

    @Override
    void visitInsn(int opcode) {
        //generate code before return  // 在loadRouterMap方法return前
        if ((opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN)) { 
            // classList就是刚刚扫描到的实现了指定接口的class集合
            extension.classList.each { name -> 
                name = name.replaceAll("/", ".")
                mv.visitLdcInsn(name)//类名
                // 生成调用LogisticsCenter.register的代码，传递的参数为name
                // generate invoke register method into LogisticsCenter.loadRouterMap()
                mv.visitMethodInsn(Opcodes.INVOKESTATIC
                        , ScanSetting.GENERATE_TO_CLASS_NAME
                        , ScanSetting.REGISTER_METHOD_NAME
                        , "(Ljava/lang/String;)V"
                        , false)
            }
        }
        super.visitInsn(opcode)
    }
    @Override
    void visitMaxs(int maxStack, int maxLocals) {
        super.visitMaxs(maxStack + 4, maxLocals)
    }
}
```

接着看看`LogisticsCenter.register()`方法，这个是ARouter里的源码：

```java
// LogisticsCenter
private static void register(String className) {
    if (!TextUtils.isEmpty(className)) {
        try {
            Class<?> clazz = Class.forName(className);
            Object obj = clazz.getConstructor().newInstance();
            if (obj instanceof IRouteRoot) {
                registerRouteRoot((IRouteRoot) obj);
            } else if (obj instanceof IProviderGroup) {
                registerProvider((IProviderGroup) obj);
            } else if (obj instanceof IInterceptorGroup) {
                registerInterceptor((IInterceptorGroup) obj);
            } else {
                logger.info(TAG, "register failed, class name: " + className
                        + " should implements one of IRouteRoot/IProviderGroup/IInterceptorGroup.");
            }
        } catch (Exception e) {
            logger.error(TAG,"register class error:" + className);
        }
    }
}
```

分情况，根据实现接口`IRouteRoot`、`IProviderGroup`和`IInterceptorGroup`注册对应的路由表，到此就路由表就注册完毕了。

一句话就是将运行时扫描dex注册路由表的工作提前到了编译期来做

下面是插入的代码：<br />![](https://note.youdao.com/yws/res/101554/098527879E64478FAAF826E4DB7DC35D#id=NuJZN&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687999996690-5f34ec85-1da5-4fb8-b87c-051b444e06b8.png#averageHue=%232b2b2b&clientId=uec31ee7a-84ca-4&from=paste&id=u0452eff7&originHeight=1382&originWidth=1712&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u8fd4d12e-2562-4f7d-a6c5-9fe89ca387c&title=)

loadRouterMap插入了什么代码？

```java
//源码代码，插桩前
private static void loadRouterMap() {
	//registerByPlugin一直被置为false
    registerByPlugin = false;
}
//插桩后反编译代码
private static void loadRouterMap() {
    registerByPlugin = false;
    register("com.alibaba.android.arouter.routes.ARouter$$Root$$modulejava");
    register("com.alibaba.android.arouter.routes.ARouter$$Root$$modulekotlin");
    register("com.alibaba.android.arouter.routes.ARouter$$Root$$arouterapi");
    register("com.alibaba.android.arouter.routes.ARouter$$Interceptors$$modulejava");
    register("com.alibaba.android.arouter.routes.ARouter$$Providers$$modulejava");
    register("com.alibaba.android.arouter.routes.ARouter$$Providers$$modulekotlin");
    register("com.alibaba.android.arouter.routes.ARouter$$Providers$$arouterapi");
}
```
