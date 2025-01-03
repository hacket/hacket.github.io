---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# ASM技巧

## 输出log

调用Project.getLogger()输出log

## 排除不需要处理的类

```java
// ARouter Auto-Register
static boolean shouldProcessPreDexJar(String path) {
    return !path.contains("com.android.support") && !path.contains("/android/m2repository")
}

static boolean shouldProcessClass(String entryName) {
    return entryName != null && entryName.startsWith(ScanSetting.ROUTER_CLASS_PACKAGE_NAME)
}
```

## 占位

### 插入的逻辑封装到外部库，ASM调用

ASM插入的代码要尽量简洁，将需要插入的逻辑封装到一个库中去，在ASM代码中，直接调用<br />如：hunter_okhttp库

```java
public final class OkHttpMethodAdapter extends LocalVariablesSorter implements Opcodes {

    private static final LoggerWrapper logger = LoggerWrapper.getLogger(OkHttpMethodAdapter.class);

    private boolean weaveEventListener;

    OkHttpMethodAdapter(int access, String desc, MethodVisitor mv, boolean weaveEventListener) {
        super(Opcodes.ASM7, access, desc, mv);
        this.weaveEventListener = weaveEventListener;
    }

    @Override
    public void visitInsn(int opcode) {
        if ((opcode >= IRETURN && opcode <= RETURN) || opcode == ATHROW) {
            //EventListenFactory
            if(weaveEventListener) {
                mv.visitVarInsn(ALOAD, 0);
                mv.visitFieldInsn(GETSTATIC, "com/hunter/library/okhttp/OkHttpHooker", "globalEventFactory", "Lokhttp3/EventListener$Factory;");
                mv.visitFieldInsn(PUTFIELD, "okhttp3/OkHttpClient$Builder", "eventListenerFactory", "Lokhttp3/EventListener$Factory;");
            }

            //Dns
            mv.visitVarInsn(ALOAD, 0);
            mv.visitFieldInsn(GETSTATIC, "com/hunter/library/okhttp/OkHttpHooker", "globalDns", "Lokhttp3/Dns;");
            mv.visitFieldInsn(PUTFIELD, "okhttp3/OkHttpClient$Builder", "dns", "Lokhttp3/Dns;");

            //Interceptor
            mv.visitVarInsn(ALOAD, 0);
            mv.visitFieldInsn(GETFIELD, "okhttp3/OkHttpClient$Builder", "interceptors", "Ljava/util/List;");
            mv.visitFieldInsn(GETSTATIC, "com/hunter/library/okhttp/OkHttpHooker", "globalInterceptors", "Ljava/util/List;");
            mv.visitMethodInsn(INVOKEINTERFACE, "java/util/List", "addAll", "(Ljava/util/Collection;)Z", true);
            mv.visitInsn(POP);

            //NetworkInterceptor
            mv.visitVarInsn(ALOAD, 0);
            mv.visitFieldInsn(GETFIELD, "okhttp3/OkHttpClient$Builder", "networkInterceptors", "Ljava/util/List;");
            mv.visitFieldInsn(GETSTATIC, "com/hunter/library/okhttp/OkHttpHooker", "globalNetworkInterceptors", "Ljava/util/List;");
            mv.visitMethodInsn(INVOKEINTERFACE, "java/util/List", "addAll", "(Ljava/util/Collection;)Z", true);
            mv.visitInsn(POP);
        }
        super.visitInsn(opcode);
    }
}
```

### 写一个方法占位来填充逻辑

通常是写一个方法占用，用于给ASM生成代码。生成的代码也最好是在已有的代码基础上写好，这样ASM代码实现起来直接调用，就简单很多

```java
// ARouter LogisticsCenter
public class LogisticsCenter {

    // 这个方法是由插件的transform，ASM调用插入的代码
    private static void loadRouterMap() {
        registerByPlugin = false;
        //auto generate register code by gradle plugin: arouter-auto-register
        // looks like below:
        // registerRouteRoot(new ARouter..Root..modulejava());
        // registerRouteRoot(new ARouter..Root..modulekotlin());
    }

    // 要插入的代码逻辑封装在这里，由ASM直接调用
    private static void register(String className) {
        
    }
}
```

## AppInit插桩注册逻辑

原本对`register(AppInitTaskRegister)`代码的插桩，优化成了`register(String)`，String为类名，通过传递进来的类名反射创建对象，避免了还需要同过ASM来new AppInitTaskRegister对象。

### 原始插桩的代码

```kotlin
object AppInitAutoRegister {
    var registerByPlugin = false
    init {
        load()
    }
    @JvmStatic
    fun load() {
        registerByPlugin = false
        // auto generate register code by gradle plugin: AutoRegister
        // 在这里插桩
    }
    // called by ASM
    @JvmStatic
    fun register(register: AppInitTaskRegister) {
        register.register(Warehouse.taskInfoSet)
        registerByPlugin = true
    }
}
```

**不足：** 调用register前，需要new出来AppInitTaskRegister，ASM操作过于复杂

### 优化版

在AppInitAutoRegister将要注册的代码写好，通过反射创建AppInitTaskRegister，让ASM操作简单化

```kotlin
object AppInitAutoRegister {
    var registerByPlugin = false
    init {
        load()
    }
    @JvmStatic
    fun load() {
        registerByPlugin = false
        // auto generate register code by gradle plugin: AutoRegister
    }
    @JvmStatic
    fun register(className: String) {
        if (!TextUtils.isEmpty(className)) {
            try {
                val clazz = Class.forName(className)
                val obj = clazz.getConstructor().newInstance()
                if (obj is AppInitTaskRegister) {
                    obj.register(Warehouse.taskInfoSet)
                    markRegisteredByPlugin()
                } else {
                    AppInit.logger().error(
                        Consts.TAG,
                        "register failed, class name: " + className +
                            " should implements one of IRouteRoot/IProviderGroup/IInterceptorGroup."
                    )
                }
            } catch (e: Exception) {
                AppInit.logger().error(Consts.TAG, "register class error:$className")
            }
        }
    }
    private fun markRegisteredByPlugin() {
        if (!registerByPlugin) {
            registerByPlugin = true
        }
    }
}
```

ASM操作代码：找到load方法，在其内插桩register(String)代码

```groovy
class AppInitAutoRegisterClassVisitor extends ClassVisitor {
    AppInitAutoRegisterClassVisitor(ClassVisitor classVisitor) {
        super(Opcodes.ASM5, classVisitor)
    }

    @Override
    MethodVisitor visitMethod(int access, String name,
                              String desc, String signature,
                              String[] exception) {
        println "visit method: " + name
        MethodVisitor mv = super.visitMethod(access, name, desc, signature, exception)
        // 找到AppInitAutoRegister里的load()方法
        if ("load" == name) {
            mv = new AutoLoadMethodAdapter(mv, access, name, desc)
        }
        return mv
    }
}

class AutoLoadMethodAdapter extends AdviceAdapter {
    protected AutoLoadMethodAdapter(MethodVisitor methodVisitor, int access, String name, String descriptor) {
        super(ASM7, methodVisitor, access, name, descriptor)
    }

    @Override
    protected void onMethodEnter() {
        super.onMethodEnter()
        println "-------onMethodEnter ${this.name}."
    }

    @Override
    protected void onMethodExit(int opcode) {
        println "-------onMethodEnter ${this.name}."
        super.onMethodExit(opcode)
    }

    @Override
    void visitInsn(int opcode) {
        // generate code before return
        if ((opcode >= IRETURN && opcode <= RETURN)) {

            println "-------visitInsn ${this.name},opcode=$opcode, registerTargetClassList(${registerTargetClassList.size()})=$registerTargetClassList------"

            // 在AppInitAutoRegister.load方法调用后添加如下代码功能：
            // AppInitAutoRegister.register("me.hacket.appinit.apt.taskregister.AppInitTaskRegister$app")

            registerTargetClassList.forEach({ proxyClassName ->
                println "----------visitInsn start inject：${proxyClassName}"
                def targetClassName = ScanUtil.TARGET_CLASS_PACKAGE_NAME.replace("/", ".") + "." + proxyClassName.substring(0, proxyClassName.length() - 6)
                println "----------visitInsn targetClassName full classname = ${targetClassName}"

                mv.visitLdcInsn(targetClassName) // 类名
                // generate invoke register method into AppInitAutoRegister.load()
                mv.visitMethodInsn(INVOKESTATIC
                        , ScanUtil.GENERATE_TO_CLASS_NAME
                        , ScanUtil.REGISTER_METHOD_NAME
                        , "(Ljava/lang/String;)V"
                        , false)

                println "-----------visitInsn end inject：${proxyClassName}."
            })
        }

        super.visitInsn(opcode)
    }
}
```

### Ref

具体可参考[ARouter/arouter-gradle-plugin](https://github.com/alibaba/ARouter/blob/develop/arouter-gradle-plugin/src/main/groovy/com/alibaba/android/arouter/register/core/RegisterCodeGenerator.groovy)

## ASM插桩代码

1. 将要注入的java源码先写出来；
2. 通过javac编译出class文件；
3. 通过`asm-all.jar`反编译该class文件，可得到所需的ASM注入代码；

```
java -classpath "asm-all.jar" org.objectweb.asm.util.ASMifier me/hacket/appinit/api/AppInitAutoRegister.class
```

4. 也可以通过AS插件(`ASM Bytecode Viewer Support Kotlin`)将1写好的代码翻译成ASM代码
