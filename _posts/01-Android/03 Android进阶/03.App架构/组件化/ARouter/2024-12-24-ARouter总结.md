---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# ARouter

## 为什么需要ARouter？解耦

传统的Activity之间通信，通过startActivity(intent)，而在组件化的项目中，上层的module没有依赖关系(即便两个module有依赖关系，也只能是单向的依赖)。<br>那么如何实现在没有依赖的情况下进行界面跳转呢？<br>**使用ARouter的原因就是为了解耦,即没有依赖时可以彼此跳转**

## Arouter提供的功能？

1. 根据URL路由到指向的页面
2. 依赖注入
3. 路由失败降级服务
4. 组件间通信的Provider
5. 支持获取Fragment
6. 路由过程中支持拦截，拦截是在子线程中，通过CountDownLatch实现，每个Interceptor会countDown一下

## ARouter的实现原理

![](https://cdn.nlark.com/yuque/0/2022/webp/694278/1658476986769-85ff21d3-8094-4c1d-9cfe-51bc85de8f6a.webp#averageHue=%2328353a&clientId=ue82a6c00-19a4-4&errorMessage=unknown%20error&from=paste&height=685&id=u2210f27a&originHeight=1271&originWidth=904&originalType=url&ratio=1&rotation=0&showTitle=false&status=error&style=none&taskId=u472c6ed2-1d34-41bb-968b-d14e5179076&title=&width=487)

### ARouter如何生成路由表？

1. 根据`Route`注解，通过kapt工具，在RouteProcessor生成对应的页面路由信息

> Activity、Fragment、Provider等

2. `Interceptor`注解，通过InteceptorProcessor生成对应的拦截器信息

### ARouter如何加载路由表的？

所谓的加载路由表，其实就是加载 RouteProcessor 生成的类文件。<br>在我们调用 ARouter 的 init() 方法时，ARouter 会调用 LogisticsCenter 的 init() 方法，在 LogisticsCenter 的 init() 方法中，会判断当前路由表加载方式是否为插件，不是的话则从 Dex 中加载路由表，是的话则由插件从 Jar 中加载路由表。<br>在LogisticsCenter.init()，从dex扫描到保存到一个set集合，这个会存本地sp文件，然后还会更新到Warehouse里保存的路由信息和provider信息。

> 运行时扫描dex会增加启动耗时，用`com.alibaba.arouter`配合asm在编译时就把路由表装载好

### ARouter navigation跳转原理？

1. LogisticsCenter.completion填充Postcard信息
2. Fragment和Provider类型直接跳转(IProvider在LogisticsCenter.completion反射创建，Fragment在_navigation时创建)
3. 其他类型需要走拦截器逻辑

### ARouter路由如何查找Activity/Fragment的？

1. 通过`@Route`注解的Activity或Fragment，通过kapt会生成对应的路由信息
2. 在navigation时，通过LogisticsCenter.completion()完善Postcard信息
3. 如果Activity的话，通过Postcard信息填满Intent，最后startActivity实现的，没有反射
4. Fragment的话就是通过PostCard的数据，反射创建Fragment(在_navigation()反射创建)

### ARouter实现组件间通信的原理？IProvider

ARouter中通过`IProvider`实现。<br>以im_module需要调用room_module的礼物功能为例：

1. 在common_module中下沉接口，定义要提供的功能

```kotlin
interface IMGiftProvider : IProvider {
    fun loadGift(message: GiftMessage)
}
```

2. room_module实现IMGiftProvider

```kotlin
@Route(path = ARouterConstants.Room.ROUTER_PATH_PROVIDER_LOAD_GIFT)
class GiftProvider : IMGiftProvider {
    
    override fun loadGift(message: GiftMessage) {
        GiftWareHouse.addGift(message)
    }
}
```

3. im_module使用该功能

```kotlin
internal class IMGlobalGiftMessageInterceptor : IMBizMessageInterceptor {
    
    @Autowired
    @JvmField
    var giftProvider: IMGiftProvider? = null
    init {
        ARouter.getInstance().inject(this)
    }
    
    // ...
    giftProvider?.loadGift(boxGiftMessage)
    // ...
}
```

**IProvider的实现原理？**

1. 通过`@Route`注解的IProvider，通过kapt，在RouteProcessor处理，生成对应的IProviderGroup

```kotlin
public class ARouter$$Providers$$m_room implements IProviderGroup {
  @Override
  public void loadInto(Map<String, RouteMeta> providers) {
    providers.put("club.jinmei.mgvoice.core.arouter.provider.family.IFamilyRecallProvider", RouteMeta.build(RouteType.PROVIDER, FamilyRecallProvider.class, "/room/family_recall_provider", "room", null, -1, -2147483648));
    providers.put("club.jinmei.mgvoice.core.arouter.provider.gift.IMGiftProvider", RouteMeta.build(RouteType.PROVIDER, GiftProvider.class, "/room/load_gift", "room", null, -1, -2147483648));
    providers.put("club.jinmei.mgvoice.core.arouter.provider.room.IRoomProvider", RouteMeta.build(RouteType.PROVIDER, RoomProviderImpl.class, "/room/room_provider", "room", null, -1, -2147483648));
  }
}
```

2. 通过inject，我们就可以得到该IMGiftProvider的实现类实例，具体是通过navigation(Class)实现的

```java
public class IMGlobalGiftMessageInterceptor$$ARouter$$Autowired implements ISyringe {
  private SerializationService serializationService;

  @Override
  public void inject(Object target) {
    serializationService = ARouter.getInstance().navigation(SerializationService.class);
    IMGlobalGiftMessageInterceptor substitute = (IMGlobalGiftMessageInterceptor)target;
    substitute.giftProvider = ARouter.getInstance().navigation(IMGiftProvider.class);
  }
}
```

3. 在navigation(Class)中会调用LogisticsCenter.completion()，在这里会将Provider反射创建出来，navigation()的返回值postcard.getProvider()，就是Provider反射创建出来的实例。

```java
public synchronized static void completion(Postcard postcard) {
     switch (routeMeta.getType()) {
         case PROVIDER:
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
     }
}
```

### com.alibaba.arouter插件做了什么？

1. 扫描class，找到实现了IRouteRoot、IInterceptorGroup、IProviderGroup的类
2. 在LogisticsCenter.loadRouterMap中将上面扫描到的类调用register进行注册，这样就不需要在启动时扫描dex了
3. 可以缩短初始化时间；同时解决应用加固导致无法直接访问dex文件，初始化失败的问题

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

### ARouter如何实现动态路由？

```java
ARouter.getInstance().addRouteGroup(new IRouteGroup() {
    @Override
    public void loadInto(Map<String, RouteMeta> atlas) {
        atlas.put("/dynamic/activity",      // path
            RouteMeta.build(
                RouteType.ACTIVITY,         // 路由信息
                TestDynamicActivity.class,  // 目标的 Class
                "/dynamic/activity",        // Path
                "dynamic",                  // Group, 尽量保持和 path 的第一段相同
                0,                          // 优先级，暂未使用
                0                           // Extra，用于给页面打标
            )
        );
    }
});
```

## ARouter的思考

### ARouter的group设计？

Warehouse中有groupsIndex和routes

```java
class Warehouse {
    // Cache route and metas
    static Map<String, Class<? extends IRouteGroup>> groupsIndex = new HashMap<>();
    static Map<String, RouteMeta> routes = new HashMap<>();
}
```

groupsIndex在ARouter时，会调用LogisticsCenter.init进行初始化；而routes是在navigation时，在LogisticsCenter.completion时进行装载的。<br>也就是说groupsIndex的设计，用到了懒加载的思想，用到了哪个group，在首次navigation时，完善Postcard时，会将routes给装载，并缓存到Warehouse.routes中。<br>groupsIndex：

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

routes(about)：

```java
public class ARouter$$Group$$about implements IRouteGroup {
  @Override
  public void loadInto(Map<String, RouteMeta> atlas) {
    atlas.put("/about/about", RouteMeta.build(RouteType.ACTIVITY, AboutActivity.class, "/about/about", "about", null, -1, -2147483648));
    atlas.put("/about/change_environment", RouteMeta.build(RouteType.ACTIVITY, ChangeEnvironmentActivity.class, "/about/change_environment", "about", null, -1, -2147483648));
  }
}
```

## ARouter的不足？

### 1、启动时进行路由表的初始化

ARouter init时会扫描dex，将所有的路由分组添加到groupIndex中去，然后存到sp去。

```java
public synchronized static void init(Context context, ThreadPoolExecutor tpe) throws HandlerException {
    // ...
    Set<String> routerMap;
    routerMap = ClassUtils.getFileNameByPackageName(mContext, ROUTE_ROOT_PAKCAGE);
    for (String className : routerMap) {
        if (className.startsWith(ROUTE_ROOT_PAKCAGE + DOT + SDK_NAME + SEPARATOR + SUFFIX_ROOT)) {
            // This one of root elements, load root.
            ((IRouteRoot) (Class.forName(className).getConstructor().newInstance())).loadInto(Warehouse.groupsIndex);
        }
    }
}
```

**缺点：**<br>ARouter的缺陷在于首次初始化时会通过反射扫描dex（只有首次，第二次会从sp读取），同时将结果存储在SP中，会拖慢首次启动速度

> 这两次操作都是耗时的

**优化：**<br>用tramsform+asm在编译器进行处理，可节省1秒左右的启动时间

### 2、ARouter接口下沉到公共common_module问题

**问题：**<br>以login_module登录模块和room_module房间模块为例，room_module依赖login_module的登录状态。

1. 所有的业务模块都依赖common_module，可能只有部分module需要和login_module交互，但下沉到了common_module，导致所有的业务模块都可见下沉的接口和数据类
2. 因为所有的业务模块都可以和login_module通信，如果这个过程出现了问题，排查也造成困扰，不知道是哪个module和login_module通信
3. 所有业务组件的接口下沉，一定程度上造成了底层的膨胀，这种显然也不利于通用层的维护

**解决：**<br>将组件对外开放的功能和数据对象打成jar包，哪个组件需要，那么通过申请的形式获取这个jar包，那么对于开放方是知晓那些组件使用了自己的功能的，发生问题时，只需要在这几个组件里面排查就可以了。此时由于不在经过通用层，通用层膨胀的问题也解决了。

> 接口和事件以及一些跨组件使用的 Model 放到哪里好呢？如果直接将这些类下沉到一个公共组件中，由于业务的频繁更新，这个公共组件可能会更新得十分频繁，开发也十分的不方便，所以使用公共组件是行不通的，于是我们采取了另一种方式——组件 API ：为每个有对外暴露需求的组件添加一个 API 模块，API 模块中只包含对外暴露的 Model 和组件通信用的 Interface 与 Event。有需要引用这些类的组件只要依赖 API 即可。

**组件 API 模块实现**<br>![image.png](https://cdn.nlark.com/yuque/0/2022/png/694278/1658760751732-bd06c81d-0034-4b90-9bae-dc98e091edc9.png#averageHue=%23f7f9f3&clientId=u153b8ccd-889a-4&errorMessage=unknown%20error&from=paste&id=u727f3641&originHeight=338&originWidth=1250&originalType=url&ratio=1&rotation=0&showTitle=false&size=166773&status=error&style=none&taskId=u71e70c57-6bf8-452b-a602-fe56ab23a20&title=)<br>一个典型的组件工程结构是这个样子：

- template ：组件代码，它包含了这个组件所有业务代码
- template-api：组件的接口模块，专门用于与其他组件通信，只包含 Model、Interface 和 Event，不存在任何业务和逻辑代码
- app 模块：用于独立运行 app，它直接依赖组件模块，只要添加一些简单的配置，即可实现组件独立运行。

### 3、页面不支持正则，不支持一个页面多个路由地址

### 4、不支持动态路由

不支持动态路由的下发，最近的提交好像有暴露接口动态更新路由了

### 5、transform未支持增量更新；不支持KSP
