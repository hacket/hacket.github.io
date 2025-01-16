---
date created: 2024-12-27 23:41
date updated: 2024-12-27 23:41
dg-publish: true
---

# Java SPI

## SPI背景

### 怎么获取接口的实现类?

1. 全局扫描全部的Class，然后判断是否实现了某个接口？代价太大，一般不会这么做
2. 一种合适的方式就是使用配置文件，把实现类名配置在某个地方，然后读取这个配置文件，获取实现类名。JDK给我们提供的ServiceLoader 就是这种方式，通过读取`resources/META-INFO/services`的配置。

### SPI介绍

SPI，全称`Service Provider Interfaces`，服务提供接口。是Java提供的一套供第三方实现或扩展使用的技术体系。主要通过解耦服务具体实现以及服务使用，使得程序的可扩展性大大增强，甚至可插拔。<br>基于服务的注册与发现机制，服务提供者向系统注册服务，服务使用者通过查找发现服务，可以达到服务的提供与使用的分离，甚至完成对服务的管理。

完成分离后的服务，使得服务提供方的修改或替换，不会给服务使用方带来代码上的修改，基于面向接口的服务约定，提供方和使用方各自直接面向接口编程，而不用关注对方的具体实现。同时，服务使用方使用到服务时，也才会真正意义上去发现服务，以完成服务的初始化，形成了服务的动态加载。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1687453361296-6e586920-4dd4-4e59-a8de-a28cc97ccafa.png#averageHue=%23f7f7f7&clientId=u88fcedc9-0927-4&from=paste&height=394&id=u3554369d&originHeight=591&originWidth=886&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=104176&status=done&style=none&taskId=ua6cfab0a-16d0-4420-9be9-f8836617840&title=&width=590.6666666666666)<br>![](https://note.youdao.com/yws/res/65646/6A277E45D5F44145BF4BD414DBADE16A#id=mW39X&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## ServiceLoader

JDK中，基于SPI的思想，提供了默认具体的实现，ServiceLoader。利用JDK自带的ServiceLoader，可以轻松实现面向服务的注册与发现，完成服务提供与使用的解耦。

### ServiceLoader使用

```
1. 创建一个接口文件
2. 在resources资源目录下创建`META-INF/services`文件夹
3. 在services文件夹中创建文件，以接口全名命名
4. 创建接口实现类
```

1. 定义接口`me.hacket.javalib.IMyServiceProvider`

```java
package me.hacket.javalib;
public interface IMyServiceProvider {
    String getName();
}
```

2. 在resources资源目录下创建`META-INF/services`文件夹，以接口全名命名，并将实现类的全路径配置进去

```
me.hacket.javalib.MyServiceProviderImpl1
me.hacket.javalib.MyServiceProviderImpl2
```

3. 接口的实现类

```java
public class MyServiceProviderImpl1 implements IMyServiceProvider {
    @Override
    public String getName() {
        return "name:ProviderImpl1";
    }
}

public class MyServiceProviderImpl2 implements IMyServiceProvider {
    @Override
    public String getName() {
        return "name:ProviderImpl2";
    }
}
```

4. 测试

```java
public class TestSPIClass {
    public static void main(String[] args) {
        ServiceLoader<IMyServiceProvider> serviceLoader = ServiceLoader.load(IMyServiceProvider.class);
        for (IMyServiceProvider item : serviceLoader) {
            System.out.println(item.getName() + ": " + item.hashCode());
        }
    }
}
```

### ServiceLoader原理

从`ServiceLoader#load`开始分析：

```java
public static <S> ServiceLoader<S> load(Class<S> service) {
    ClassLoader cl = Thread.currentThread().getContextClassLoader();
    return ServiceLoader.load(service, cl);
}
public static <S> ServiceLoader<S> load(Class<S> service, ClassLoader loader)
{
    return new ServiceLoader<>(service, loader);
}
private ServiceLoader(Class<S> svc, ClassLoader cl) {
    service = Objects.requireNonNull(svc, "Service interface cannot be null");
    loader = (cl == null) ? ClassLoader.getSystemClassLoader() : cl;
    reload();
}
public void reload() {
    providers.clear();
    lookupIterator = new LazyIterator(service, loader);
}
```

最后调用的是reload方法，清空providers，初始化一个LazyIterator

然后一般会通过ServiceLoader对象遍历，那么就会调用其iterator方法

```java
public Iterator<S> iterator() {
    return new Iterator<S>() {
        Iterator<Map.Entry<String,S>> knownProviders
            = providers.entrySet().iterator();
        public boolean hasNext() {
            if (knownProviders.hasNext()) // 先从缓存中找，有的话直接返回
                return true;
            return lookupIterator.hasNext();
        }
        public S next() {
            if (knownProviders.hasNext()) // 先从缓存中找，有的话直接返回
                return knownProviders.next().getValue();
            return lookupIterator.next();
        }
        public void remove() {
            throw new UnsupportedOperationException();
        }
    };
}
```

实际上是调用的lookUpIterator各个方法，从前面我们知道这是一个LazyIterator。

遍历时会通过hasNext判断是否还有下一个元素，next获取下一个元素。

```java
private class LazyIterator implements Iterator<S> {

    Class<S> service;
    ClassLoader loader;
    Enumeration<URL> configs = null;
    Iterator<String> pending = null;
    String nextName = null;

    private LazyIterator(Class<S> service, ClassLoader loader) {
        this.service = service;
        this.loader = loader;
    }

    private boolean hasNextService() {
        if (nextName != null) {
            return true;
        }
        if (configs == null) { // 枚举，就是META-INF/services/接口全名配置的接口所有实现类的全路径
            try {
                // META-INF/services/接口全名
                String fullName = PREFIX + service.getName();
                if (loader == null)
                    configs = ClassLoader.getSystemResources(fullName);
                else
                    configs = loader.getResources(fullName);
            } catch (IOException x) {
                fail(service, "Error locating configuration files", x);
            }
        }
        while ((pending == null) || !pending.hasNext()) {
            if (!configs.hasMoreElements()) {
                return false;
            }
            pending = parse(service, configs.nextElement());
        }
        nextName = pending.next();
        return true;
    }

    private S nextService() {
        if (!hasNextService()) throw new NoSuchElementException();
        String cn = nextName;
        nextName = null;
        Class<?> c = null;
        try {
            c = Class.forName(cn, false, loader); // 通过获取到的接口实现类的全路径反射
        } catch (ClassNotFoundException x) {
            fail(service,
                 // Android-changed: Let the ServiceConfigurationError have a cause.
                 "Provider " + cn + " not found", x);
                 // "Provider " + cn + " not found");
        }
        if (!service.isAssignableFrom(c)) {
            // Android-changed: Let the ServiceConfigurationError have a cause.
            ClassCastException cce = new ClassCastException(
                    service.getCanonicalName() + " is not assignable from " + c.getCanonicalName());
            fail(service,
                 "Provider " + cn  + " not a subtype", cce);
            // fail(service,
            //        "Provider " + cn  + " not a subtype");
        }
        try {
            S p = service.cast(c.newInstance()); // 反射实例化
            providers.put(cn, p); // 缓存起来
            return p;
        } catch (Throwable x) {
            fail(service,
                 "Provider " + cn + " could not be instantiated",
                 x);
        }
        throw new Error();          // This cannot happen
    }

    public boolean hasNext() {
        return hasNextService();
    }

    public S next() {
        return nextService();
    }

    public void remove() {
        throw new UnsupportedOperationException();
    }
}
```

1. 在`META-INF/services/全路径接口`中配置了接口所有的实现类
2. 通过反射获取所有的实现类，并缓存起来，下次直接返回

## AutoService

<https://github.com/google/auto/tree/master/service>

```java
package foo.bar;

import javax.annotation.processing.Processor;

@AutoService(Processor.class)
final class MyProcessor implements Processor {
  // …
}
```

会自动生成`META-INF/services/javax.annotation.processing.Processor`，文件包含

```java
foo.bar.MyProcessor
```

## 应用案例

### Processor

编译时注解，用到了ServiceLoader，javac会自动加载找到Processor

## Ref

<https://cloud.tencent.com/developer/article/1415083>
