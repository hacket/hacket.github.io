---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# Lint

## Lint介绍

Android Studio提供了lint工具来确认和纠正存在结构问题的代码，不需要执行你的app和写test cases。每个被lint工具探测出来的问题会报告成一个描述信息和一个严重级别，

官网lint教程<br /><https://developer.android.com/studio/write/lint.html>

最新的lint规则<br /><http://tools.android.com/tips/lint-checks>

## Lint工作流程

lint扫描工作流程，如下图所示：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691242581733-9ae5e840-821e-4d1c-9b90-7b06dc839f18.png#averageHue=%23f6f7f4&clientId=ued06dd38-94f1-4&from=paste&height=182&id=u082c2d45&originHeight=327&originWidth=611&originalType=binary&ratio=2&rotation=0&showTitle=false&size=37502&status=done&style=stroke&taskId=u21b6b859-f127-4378-9e24-545dc269564&title=&width=340.5)<br />![](http://note.youdao.com/yws/res/3577/C693CB49A1FA432BBA147F00CC1F6D71#clientId=u8f32b384-005c-4&id=rbOLr&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&taskId=u29f26c45-b31e-4c33-93ae-4aca1cc48e1&title=)<br />**Application source files**<br />组成Android项目文件，包括Java、XML、icons和Proguard配置文件。

**The **`**lint.xml**`** file**<br />lint扫描规则配置文件，用来指定你想排除和自定义问题的严重级别

**The lint tool**<br />一个静态代码扫描工具，你能在Android Studio中运行，也能在命令行中运行。lint工具用来扫描检测存在质量和影响性能的的问题代码。强烈建议你在发布你的应用前纠正任何lint工具探测出来的问题

**Results of lint checking**<br />你能在console或者在Android Studio的`Inspection Results`窗口查看

## Lint使用

### 命令行使用Lint

- 针对一个project文件扫描

```
lint [flags] <project directory>
```

- 针对某一个问题（也叫issue ID）的扫描，如对`myproject`项目中的`MissingPrefix`（扫描xml属性中缺少了android名称空间前缀）的扫描：

```
lint --check MissingPrefix myproject
```

- 查看所有`flags`和命令行的参数：

```
lint --help
```

### 在Gradle中使用Lint

- 所有的`build variants`(配置的buildTypes)

```
gradlew lint
```

- 指定一个`build variant`

```
gradlew lintDebug
```

### 配置lint压制警告

默认情况下，lint扫描lint所支持多所有issues。<br />你能配置lint不同的级别：

- Globally (entire project)
- Project module
- Production module
- Test module
- Open files
- Class hierarchy
- Version Control System (VCS) scopes

### 在Android Studio中配置lint

Analyze→Inspect Code→Inspection Results

### 配置lint文件

指定lint检测参数在`lint.xml`文件中。<br />`lint.xml`由封闭的`<lint>`标签作为根节点，包含由一个或多个`<issue>`，每个`<issue>`定义必须的`id`属性：

```xml
<?xml version="1.0" encoding="UTF-8"?>
    <lint>
        <!-- list of issues to configure -->
</lint>
```

你可以在`<issue>`标签，改变该issue的严重级别或者disable lint check通过`severity`属性

> **Tip**: 查看lint支持的所有issues，用`lint --list`命令

一个简单的`lint.xml`案例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lint>
    <!-- Disable the given check in this project -->
    <issue id="IconMissingDensityFolder" severity="ignore" />

    <!-- Ignore the ObsoleteLayoutParam issue in the specified files -->
    <issue id="ObsoleteLayoutParam">
        <ignore path="res/layout/activation.xml" />
        <ignore path="res/layout-xlarge/activation.xml" />
    </issue>

    <!-- Ignore the UselessLeaf issue in the specified file -->
    <issue id="UselessLeaf">
        <ignore path="res/layout/main.xml" />
    </issue>

    <!-- Change the severity of hardcoded strings to "error" -->
    <issue id="HardcodedText" severity="error" />
</lint>
```

### 配置lint检测Java和XML源文件

你能配置lint不检测Java和XML源文件。<br />在`Settings→Editor→Inspections`可以配置

- 配置lint检测Java<br />让lint不检测Java的类或者方法，加上`@SuppressLint`注解。<br />案例：不检测`NewApi`在`onCreate`方法，其他方法检测：

```java
@SuppressLint("NewApi")
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);
}
```

- 抑制所有的lint issues，用`all`

```
@SuppressLint("all")
```

- 配置lint检测XML<br />用`tool:ignore`来关闭在xml中的lint检测，在你的`lint.xml`中添加下面名称空间以便lint工具认识该属性

```
namespace xmlns:tools="http://schemas.android.com/tools"
```

下面这个案例展示你如何关闭lint检测`UnusedResources`issue在`<LinearLayout>`在xml的布局中，这个`igonre`属性可以在子节点中继承：

```xml
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    tools:ignore="UnusedResources" >

    <TextView
        android:text="@string/auto_update_prompt" />
</LinearLayout>
```

检测多个，用逗号分隔：

```
tools:ignore="NewApi,StringFormatInvalid"
```

抑制所有，用`all`：

```
tools:ignore="all"
```

### [用Gradle配置lint选项](http://google.github.io/android-gradle-dsl/current/com.android.build.gradle.internal.dsl.LintOptions.html)

`Android plugin for Gradle`允许你配置lint选项：

```groovy
def configDir = "${project.rootDir}/config/quality"
def reportsDir = "${project.buildDir}/reports"
// http://developer.android.com/intl/zh-cn/tools/help/lint.html
lintOptions {

    abortOnError false // lint扫描到errors是否终止退出

    absolutePaths true // 是否lint应该展示full path在errors ouput。默认相对路径。

    checkReleaseBuilds true
    // 是否在release build检测fatal errors，默认为true，一旦检测到严重级别为'fatal'的errors，release build立即终止

    explainIssues true // 是否lint需要包含issue errors的解释（HTML和XML的报告故意做了这个解释，可以忽略）

    lintConfig file("$configDir/lint/lint.xml") // 自己配置的lint.xml
    xmlReport true // 默认为true
    htmlReport true // 默认为true
    xmlOutput file("$reportsDir/lint/lint-result.xml") // xml报告输出路径
    htmlOutput file("$reportsDir/lint/lint-result.html") // html扫描报告输出路径

    ignoreWarnings false // lint是否只扫描error而忽略errors

    noLines true // 是否lint应该在errors的地方包含源码的行数（默认true）

    // Turns off checks for the issue IDs you specify.
    // disable 'TypographyFractions','TypographyQuotes'

    // Turns on checks for the issue IDs you specify. These checks are in
    // addition to the default lint checks.
    // enable 'RtlHardcoded','RtlCompat', 'RtlEnabled'

    // To enable checks for only a subset of issue IDs and ignore all others,
    // list the issue IDs with the 'check' property instead. This property overrides
    // any issue IDs you enable or disable using the properties above.
    // check 'NewApi', 'InlinedApi'

    // If set to true, turns off analysis progress reporting by lint.
    // quiet true

}
```

### baseline

#### 手动允许inspections

手动允许lint配置，通过`Analyze → Inspect Code`，结果在`Inspection Results`窗口展示。

#### 设置inspection scope和profile

选择你想要分析的文件(inspection scope)和你想要允许的安全规则(inspection profile)：

1. 在Android，打开你的project，选择你想要分析的project，一个folder，或一个file。
2. 在菜单中，选择`Analyze → Inspect Code`
3. 在`Specify Inspection Scope`对话框，review你的设置<br />![](https://note.youdao.com/src/26510884B2864ADFABEE52F18C052827#clientId=u8f32b384-005c-4&id=u9Ueo&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&taskId=u3b3917da-56b0-4845-b478-096a8e7f723&title=)
4. Under Inspection profile, keep the default profile (Project Default).
5. Click OK 运行这个Inspection

#### Review和编辑inspection profile

## Android Lint可以忽略的检查规则

### 1、ContentDescription

Summary: Image without contentDescription<br />ImageView和ImageButton控件缺少`android:contentDescription`属性；对于一些视力有障碍的用户，由于这两个控件没有text，这时用户点击这个控件。开了Accessible权限，android系统会自动使用人声朗读控件上`android:contentDescription`属性说指向的内容。

Priority: 3 / 10<br />Severity: Warning<br />Category: Accessibility

Non-textual widgets like ImageViews and ImageButtons should use the<br />contentDescription attribute to specify a textual description of the widget<br />such that screen readers and other accessibility tools can adequately describe<br />the user interface.

Note that elements in application screens that are purely decorative and do<br />not provide any content or enable a user action should not have accessibility<br />content descriptions. In this case, just suppress the lint warning with a<br />tools:ignore="ContentDescription" attribute.

Note that for text fields, you should not set both the hint and the<br />contentDescription attributes since the hint will never be shown. Just set the<br />hint. See<br /><http://developer.android.com/guide/topics/ui/accessibility/checklist.html#spec><br />al-cases.

### 2、RtlHardcoded

Summary: Using left/right instead of start/end attributes<br />用`gravity`、`paddingLeft`、`layout_marginLeft`等left,right用start,end代替。保证right-to-left布局能用

Priority: 5 / 10<br />Severity: Warning<br />Category: Internationalization:Bidirectional Text

Using Gravity#LEFT and Gravity#RIGHT can lead to problems when a layout is<br />rendered in locales where text flows from right to left. Use Gravity#START and<br />Gravity#END instead. Similarly, in XML gravity and layout_gravity attributes,<br />use start rather than left.

For XML attributes such as paddingLeft and layout_marginLeft, use paddingStart<br />and layout_marginStart. NOTE: If your minSdkVersion is less than 17, you<br />should add both the older left/right attributes as well as the new start/right<br />attributes. On older platforms, where RTL is not supported and the start/right<br />attributes are unknown and therefore ignored, you need the older left/right<br />attributes. There is a separate lint check which catches that type of error.

(Note: For Gravity#LEFT and Gravity#START, you can use these constants even<br />when targeting older platforms, because the start bitmask is a superset of the<br />left bitmask. Therefore, you can use gravity="start" rather than<br />gravity="left|start".)

### 3、RtlSymmetry

Summary: Padding and margin symmetry<br />如果指定了margin或者padding的一半，left和right应该都要指定，对称性

Priority: 6 / 10<br />Severity: Warning<br />Category: Internationalization:Bidirectional Text

If you specify padding or margin on the left side of a layout, you should<br />probably also specify padding on the right side (and vice versa) for<br />right-to-left layout symmetry.

### 4、HardcodedText

Summary: Hardcoded text<br />在布局中硬编码

Priority: 5 / 10<br />Severity: Warning<br />Category: Internationalization

Hardcoding text attributes directly in layout files is bad for several<br />reasons:

- When creating configuration variations (for example for landscape or<br />portrait)you have to repeat the actual text (and keep it up to date when<br />making changes)
- The application cannot be translated to other languages by just adding new<br />translations for existing string resources.

There are quickfixes to automatically extract this hardcoded string into a<br />resource lookup.

### 5、SetTextI18n

Summary: TextView Internationalization

Priority: 6 / 10<br />Severity: Warning<br />Category: Internationalization

When calling TextView#setText

- Never call Number#toString() to format numbers; it will not handle fraction<br />separators and locale-specific digits properly. Consider using String#format<br />with proper format specifications (%d or %f) instead.<br />不要调用`Number#toString()`格式化数字，它不会处理小数点分隔符和地区数字特性。考虑用`String#format()`加上格式符(%d 或 %f)
- Do not pass a string literal (e.g. "Hello") to display text. Hardcoded text<br />can not be properly translated to other languages. Consider using Android<br />resource strings instead.<br />不要传递一个String文本。硬编码不好翻译成其他语言，考虑用Android resource替代。
- Do not build messages by concatenating text chunks. Such messages can not be<br />properly translated.

More information:<br /><http://developer.android.com/guide/topics/resources/localization.html>

### SetJavaScriptEnabled

Summary: Using setJavaScriptEnabled<br />开启`setJavaScriptEnabled`可能导致XSS漏洞

Priority: 6 / 10<br />Severity: Warning<br />Category: Security

Your code should not invoke setJavaScriptEnabled if you are not sure that your<br />app really requires JavaScript support.

More information:<br /><http://developer.android.com/guide/practices/security.html>

## Android Lint检查规则

官网最新lint check规则<br /><http://tools.android.com/tips/lint-checks>

#### Correctness 正确性检查

##### 1、AdapterViewChildren

Summary: AdapterViews cannot have children in XML<br />确保没有在XML文件中定义AdapterViews的子view

Priority: 10 / 10<br />Severity: Warning<br />Category: Correctness

AdapterViews such as ListViews must be configured with data from Java code,<br />such as a ListAdapter.

More information:<br /><http://developer.android.com/reference/android/widget/AdapterView.html>

##### 2、OnClick

Summary: onClick method does not exist<br />确保XML文件声明的OnClick的调用函数在代码中实际存在（必须以public修饰，一个参数为View）

Priority: 10 / 10<br />Severity: Error<br />Category: Correctness

The onClick attribute value should be the name of a method in this View's<br />context to invoke when the view is clicked. This name must correspond to a<br />public method that takes exactly one parameter of type View.

Must be a string value, using ';' to escape characters such as '\n' or<br />'\uxxxx' for a unicode character.

##### 3、StopShip

Summary: Code contains STOPSHIP marker<br />代码注释中有// SHOPSHIP的地方应该被lint扫描，需要解决掉

Priority: 10 / 10<br />Severity: Warning<br />Category: Correctness<br />NOTE: This issue is disabled by default!<br />You can enable it by adding --enable StopShip

Using the comment // STOPSHIP can be used to flag code that is incomplete but<br />checked in. This comment marker can be used to indicate that the code should<br />not be shipped until the issue is addressed, and lint will look for these.

##### 4、MissingPermission

Summary: Missing Permissions<br />代码中需要运行权限的地方没有加权限

Priority: 9 / 10<br />Severity: Error<br />Category: Correctness

This check scans through your code and libraries and looks at the APIs being<br />used, and checks this against the set of permissions required to access those<br />APIs. If the code using those APIs is called at runtime, then the program will<br />crash.

Furthermore, for permissions that are revocable (with targetSdkVersion 23),<br />client code must also be prepared to handle the calls throwing an exception if<br />the user rejects the request for permission at runtime.

##### 5、MissingSuperCall

Summary: Missing Super Call<br />需要调用`super.`地方

Priority: 9 / 10<br />Severity: Error<br />Category: Correctness

Some methods, such as View#onDetachedFromWindow, require that you also call<br />the super implementation as part of your method.

##### 6、ResAuto

Summary: Hardcoded Package in Namespace<br />资源文件中的namespace不要hardcode，需要用`http://schemas.android.com/apk/res-auto`，不要用以前的那种加包名的方式

Priority: 9 / 10<br />Severity: Fatal<br />Category: Correctness

In Gradle projects, the actual package used in the final APK can vary; for<br />example,you can add a .debug package suffix in one version and not the other.<br />Therefore, you should not hardcode the application package in the resource;<br />instead, use the special namespace <http://schemas.android.com/apk/res-auto><br />which will cause the tools to figure out the right namespace for the resource<br />regardless of the actual package used during the build.

##### 7、SuspiciousImport

Summary: 'import android.R' statement<br />检查代码中是否有`'import android.R'`

Priority: 9 / 10<br />Severity: Warning<br />Category: Correctness

Importing android.R is usually not intentional; it sometimes happens when you<br />use an IDE and ask it to automatically add imports at a time when your<br />project's R class it not present.

Once the import is there you might get a lot of "confusing" error messages<br />because of course the fields available on android.R are not the ones you'd<br />expect from just looking at your own R class.

##### 8、UsesMinSdkAttributes

Summary: Minimum SDK and target SDK attributes not defined<br />检查是否在AndroidManifest.xml文件中定义了minimum SDK 和 target SDK这两个属性

Priority: 9 / 10<br />Severity: Warning<br />Category: Correctness

The manifest should contain a  element which defines the minimum API<br />Level required for the application to run, as well as the target version (the<br />highest API level you have tested the version for.)

More information:<br /><http://developer.android.com/guide/topics/manifest/uses-sdk-element.html>

##### 9、WrongViewCast

Summary: Mismatched view type<br />检查对XML中定义的View在Java代码中进行强转换时是否正确

Priority: 9 / 10<br />Severity: Fatal<br />Category: Correctness

Keeps track of the view types associated with ids and if it finds a usage of<br />the id in the Java code it ensures that it is treated as the same type.

##### 10、AaptCrash

Summary: Potential AAPT crash<br />不要在style文件中定义`android:id`属性，可以在ids.xml文件中定义

Priority: 8 / 10<br />Severity: Fatal<br />Category: Correctness

Defining a style which sets android:id to a dynamically generated id can cause<br />many versions of aapt, the resource packaging tool, to crash. To work around<br />this, declare the id explicitly with  instead.

More information:<br /><https://code.google.com/p/android/issues/detail?id=20479>

##### 11、GradleCompatible

Summary: Incompatible Gradle Versions<br />不兼容的Gradle版本

Priority: 8 / 10<br />Severity: Error<br />Category: Correctness

There are some combinations of libraries, or tools and libraries, that are<br />incompatible, or can lead to bugs. One such incompatibility is compiling with<br />a version of the Android support libraries that is not the latest version (or<br />in particular, a version lower than your targetSdkVersion.)

##### 12、GradlePluginVersion

Summary: Incompatible Android Gradle Plugin<br />不兼容的Android Gradle Plugin版本

Priority: 8 / 10<br />Severity: Error<br />Category: Correctness

Not all versions of the Android Gradle plugin are compatible with all versions<br />of the SDK. If you update your tools, or if you are trying to open a project<br />that was built with an old version of the tools, you may need to update your plugin version number.

##### 13、IllegalResourceRef

Summary: Name and version must be integer or string, not resource<br />versionCode和versionName必须是integer或string

Priority: 8 / 10<br />Severity: Warning<br />Category: Correctness

For the versionCode attribute, you have to specify an actual integer literal;<br />you cannot use an indirection with a @dimen/name resource. Similarly, the<br />versionName attribute should be an actual string, not a string resource url.

##### 14、MergeMarker

Summary: Code contains merge marker<br />代码中存在merge标志（`<<<`），这种情况一般是意外留下的

Priority: 8 / 10<br />Severity: Error<br />Category: Correctness

Many version control systems leave unmerged files with markers such as `<<<` in<br />the source code. This check looks for these markers, which are sometimes<br />accidentally left in, particularly in resource files where they don't break<br />compilation.

##### 15、MissingLeanbackLauncher

##### 16、MissingRegistered

...

## 自定义Lint规则

### 自定义lint接入方案

#### 全局

把此 jar 拷贝到 `~/.android/lint/` 目录中即可

#### AAR壳

另一种实现方式是将 jar 置于一个 aar 中，如果某个工程想要接入执行自定义的 lint 规则，只需依赖这个发布后的 aar 即可，如此一来，新增的 lint 规则就可将影响范围控制在单个项目内了。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700210450166-86b1e081-a0d7-4e88-8b88-c1b4e7b754c2.png#averageHue=%23f9f9f9&clientId=u5d234244-2963-4&from=paste&height=444&id=u851ae4b2&originHeight=1148&originWidth=1596&originalType=binary&ratio=2&rotation=0&showTitle=false&size=167684&status=done&style=stroke&taskId=u5944a7e8-e186-443b-bfe9-f7b4901c304&title=&width=617)

### 自定义Lint规则

#### 创建 java-library & 配置 lint 依赖

```groovy
plugins {
    id "java-library"
    id "kotlin"
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
jar {
    manifest {
        // Only use the "-v2" key here if your checks have been updated to the
        // new 3.0 APIs (including UAST)
        attributes("Lint-Registry-V2": "me.hacket.lint.todo.MyCustomIssueRegistry")
    }
}
configurations {
    lintJarOutput
}
dependencies {
    lintJarOutput files(jar)
}
defaultTasks "assemble"


dependencies {
    def kotlin_version = "1.9.10"

    implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"

    def lint_version = "31.1.2"
    // 官方提供的Lint相关API，并不稳定，每次AGP升级都可能会更改，且并不是向下兼容的
    compileOnly "com.android.tools.lint:lint-api:$lint_version"
    // 目前Android中内置的lint检测规则
    compileOnly "com.android.tools.lint:lint-checks:$lint_version}"

    testImplementation "com.android.tools.lint:lint-tests:$lint_version"
    testImplementation "junit:junit:4.13.2"
}
```

如果你创建 module 时选择的是 kotlin 语言，还可能会遇到以下这个坑：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700212837992-cd4964e8-08bd-4db2-9261-1c901ed0cf4a.png#averageHue=%232e2e2e&clientId=u5d234244-2963-4&from=paste&height=339&id=ue60e70b5&originHeight=678&originWidth=3110&originalType=binary&ratio=2&rotation=0&showTitle=false&size=164526&status=done&style=none&taskId=uac542652-288f-4a3e-8d09-b1f1d652fe2&title=&width=1555)<br />只需要将 kotlin 标准库依赖方式改为 compileOnly 即可：

> compileOnly "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"

#### 编写 lint-rules

- KotlinTodoDetector

```kotlin
@Suppress("UnstableApiUsage")
class KotlinTodoDetector : Detector(), Detector.UastScanner {

    override fun getApplicableMethodNames(): List<String> {
        return listOf("TODO")
    }

    override fun visitMethodCall(context: JavaContext, node: UCallExpression, method: PsiMethod) {
        println("KotlinTodoDetector >>> matched TODO in [${method.parent.containingFile}]")
        if (context.evaluator.isMemberInClass(method, "kotlin.StandardKt__StandardKt")) {
            val deleteFix = fix()
                .name("Delete this TODO method")
                .replace()
                .all()
                .with("")
                .build()
            context.report(
                ISSUE,
                context.getLocation(node),
                "You must fix `TODO()` first.", deleteFix
            )
        }
    }

    companion object {
        private const val ISSUE_ID = "KotlinTodo"
        val ISSUE = Issue.create(
            ISSUE_ID,
            "Detecting `TODO()` method from kotlin/Standard.kt.",
            """
       You have unimplemented method or undo work marked by `TODO()`,
       please implement it or remove dangerous TODO.
       """,
            category = Category.CORRECTNESS,
            priority = 9,
            severity = Severity.ERROR,
            implementation = Implementation(KotlinTodoDetector::class.java, Scope.JAVA_FILE_SCOPE),
        )
    }
}
```

我们需要检测的对象是 java/kt 源文件，这里只需要继承自 Detector 并实现 Detector.UastScanner 接口即可。当然，我们也可以选择按组合方式实现更多其他 Scanner，这取决于我们希望扫描的文件范围。目前支持的扫描范围有：

- UastScanner：扫描 Java 或者 kotlin 源文件
- ClassScanner：扫描字节码或编译的类文件
- BinaryResourceScanner：扫描二进制资源文件（res/raw/bitmap等）
- ResourceFolderScanner：扫描资源文件夹
- XmlScanner：扫描 xml 格式文件
- GradleScanner：扫描 Gradle 格式文件
- OtherFileScanner：其他类型文件

检测 java/kt 源文件，可以通过 `getApplicableMethodNames` 指定扫描的方法名，其他还有`类名`、`文件名`、`属性名`等等，并通过 `visitMethodCall` 接受检测到的方法。这里我们只需要检测 Kotlin 标准库中的 Standard.kt 中的 TODO 方法，匹配到后通过 context.report 来报告具体问题，这里需要指定一个 Issue 对象来描述问题具体信息，相关字段如下：

- id : 唯一值，应该能简短描述当前问题。利用 Java 注解或者 XML 属性进行屏蔽时，使用的就是这个 id。
- summary : 简短的总结，通常5-6个字符，描述问题而不是修复措施。
- explanation : 完整的问题解释和修复建议。
- category : 问题类别。常见的有：CORRECTNESS、SECURITY、COMPLIANCE、USABILITY、LINT等等。
- priority : 优先级。1-10 的数字，10 为最重要/最严重。
- severity : 严重级别：Fatal, Error, Warning, Informational, Ignore。
- Implementation : 为 Issue 和 Detector 提供映射关系，Detector 就是当前 Detector。声明扫描检测的范围Scope，Scope 用来描述 Detector 需要分析时需要考虑的文件集，包括：Resource文件或目录、Java文件、Class文件等。

还可以设置出现该 issue 上报时的默认解决方案 fix，这里我们创建了一个 `deleteFix` 实现开发者快速移除报错位置的 TODO 代码。<br />最后，只需要自定义一个 Registry 声明自己需要检测的 Issues 即可：

```kotlin
@Suppress("UnstableApiUsage")
class MyCustomIssueRegistry : IssueRegistry() {
    init {
        println("MyCustomIssueRegistry, run...")
    }

    override val issues: List<Issue>
        get() = listOf(
//            JcenterDetector.ISSUE,
            KotlinTodoDetector.ISSUE,
        )

    override val minApi: Int
        get() = 8 // works with Studio 4.1 or later; see com.android.tools.lint.detector.api.Api / ApiKt

    override val api: Int
        get() = CURRENT_API

    override val vendor: Vendor
        get() = Vendor(
            vendorName = "hacket",
            contact = "shengfanzeng@gmail.com"
        )

}
```

### Lint发布

出于灵活性和可用性角度考虑自然选择 aar 壳的方式。经过这几年 lint 的发展，实现起来也很简单：只需要创建一个 Android-Library module，然后稍微配置下 gradle 即可：

```groovy
dependencies {
    lintPublish(project(":lint"))
}
```

此处的 lintPublish 配置允许我们引用另一个 module，它会获取该组件输出的 jar 并将其打包为 lint.jar 然后放到自身的 AAR 中

### Lint接入

在 app 模块中依赖一下 `androidLintlibrary`这个组件<br />./gradlew :app:lint 即可看到控制台输出以下内容：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700212940171-6a93c8c9-78f3-40b7-9df2-675ea992e1b4.png#averageHue=%232e2d2d&clientId=u5d234244-2963-4&from=paste&height=529&id=ud2c0342c&originHeight=1058&originWidth=2748&originalType=binary&ratio=2&rotation=0&showTitle=false&size=232906&status=done&style=none&taskId=ua7be24ca-5496-4ebc-aa62-28f7fd4349e&title=&width=1374)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700212891116-e8de654f-d1a5-4478-865c-807e18def5a4.png#averageHue=%23f7f7f7&clientId=u5d234244-2963-4&from=paste&height=594&id=u161262aa&originHeight=1188&originWidth=3568&originalType=binary&ratio=2&rotation=0&showTitle=false&size=198362&status=done&style=none&taskId=u785e4f50-14e1-491d-9dc1-2ee0be8d772&title=&width=1784)

### AGP4.0 lint

AGP 4.0开始，Android studio 支持了独立的 com.android.lint 插件，进一步降低了自定义 lint 的成本，通过在 manifest 中注册自定义 Registry 改为通过服务表单注册<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700222300229-4d9e2b6c-5e62-47e0-bc17-e60b27e828d3.png#averageHue=%23384236&clientId=u5d234244-2963-4&from=paste&height=512&id=u82d5de69&originHeight=1024&originWidth=1756&originalType=binary&ratio=2&rotation=0&showTitle=false&size=145522&status=done&style=none&taskId=uab90925b-5ca2-472c-af5c-7eb2dd9b7d2&title=&width=878)

```groovy
plugins {
    id 'com.android.lint'
}
```

### 示例

#### 用Logger替代Log

### Ref

- [ ] [Android Lint（官方）](https://googlesamples.github.io/android-custom-lint-rules/index.html)
- [ ] [Android Lint API Guide（官方）](https://googlesamples.github.io/android-custom-lint-rules/api-guide.html#terminology)
- [ ] Android自定义Lint实践<br /><http://tech.meituan.com/android_custom_lint.html>
- [ ] 浅谈Android自定义Lint规则的实现 （一）<br />[http://www.carrotsight.com/2016/01/29/浅谈Android自定义Lint规则的实现 （一）.html#](http://www.carrotsight.com/2016/01/29/%E6%B5%85%E8%B0%88Android%E8%87%AA%E5%AE%9A%E4%B9%89Lint%E8%A7%84%E5%88%99%E7%9A%84%E5%AE%9E%E7%8E%B0%20%EF%BC%88%E4%B8%80%EF%BC%89.html#)
