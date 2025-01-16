---
date created: 2024-03-30 20:10
date updated: 2024-12-27 23:45
dg-publish: true
---

# Kotlin DSL

## 如何实现DSL

### 高阶函数实现大括号调用

常见的 DSL 都会用大括号来表现层级。Kotlin 的高阶函数允许指定一个 lambda 类型的参数，且当 lambda 位于参数列表的最后位置时可以省略圆括号，满足 DSL 中的大括号语法要求。

```kotlin
// 原有代码：
LinearLayout(context).apply {
    orientation = LinearLayout.HORIZONTAL
    addView(ImageView(context))
}
// 改造后
HorizontalLayout(context) {
    ...
    it.addView(ImageView(context) {
        ...
    })
}
// 改造
fun HorizontalLayout(context: Context, init: (LinearLayout) -> Unit) : LinearLayout {
    return LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        init(this)
    }
}
```

### 通过 Receiver 传递上下文

将 lambda 的参数改为 Receiver，大括号中对 it 的引用可以变为 this 并直接省略

```kotlin
fun HorizontalLayout(context: Context, init: LinearLayout.() -> Unit) : LinearLayout {
    return LinearLayout(context).apply {
        orientation = LinearLayout.HORIZONTAL
        init()
    }
}
fun ViewGroup.ImageView(init: ImageView.() -> Unit) {
    addView(ImageView(context).apply(init))
}
```

使用：

```kotlin
HorizontalLayout {
    ...
    ImageView {
        ...
    }
}
```

### infix 增强可读性

Kotlin 的中缀函数可以让函数省略圆点以及圆括号等程序符号，让语句更自然，进一步提升可读性。

现有代码：

```kotlin
HorizontalLayout {
    setTag(1,"a")
    setTag(2,"b")
}
```

infix改造：

```kotlin
class _Tag(val view: View) {
    infix fun <B> Int.to(that: B) =  view.setTag(this, that)
}

fun View.tag(block: _Tag.() -> Unit) {
    _Tag(this).apply(block)
}
```

改造后：

```kotlin
HorizontalLayout {
    tag {
        1 to "a"
        2 to "b"
    }
}
```

### [@DslMarker ](/DslMarker) 限制作用域

Kotlin 为 DSL 的使用场景提供了 `@DslMarker` 注解，可以对方法的作用域进行限制。添加注解的 lambda 中在省略 this 的隐式调用时只能访问到最近的 Receiver 类型，当调用更外层的 Receiver 的方法会报错。

`@DslMarker` 是一个元注解。

```kotlin
@DslMarker
@Target(AnnotationTarget.TYPE)
annotation class ViewDslMarker
fun ViewGroup.TextView(init: (@ViewDslMarker TextView).() -> Unit) {
    addView(TextView(context).apply(init))
}
```

### Context Receivers 传递多个上下文 （Kotlin 1.6.20-M1及以上）

Context Receivers 是刚刚在 Kotlin 1.6.20-M1 中发布的新语法，它使函数定义时拥有多个 Receiver 成为可能。

```kotlin
context(View)
val Float.dp 
    get() = this * this@View.resources.displayMetrics.density

class SomeView : View {
  val someDimension = 4f.dp
}
```

### 使用 inline 和 [@PublishedApi ](/PublishedApi) 提高性能

- DSL 的实现使用了大量高阶函数，过多的 lambda 会产生过的匿名类，同时也会增加运行时对象创建的开销，不少 DSL 选择使用 inline 操作符，减少匿名类的产生，提高运行时性能。
- inline 函数内部调用的函数必须是 public 的，这会造成一些不必要的代码暴露，此时可以借助 `@PublishedApi` 化解。

```kotlin
//resInt 指定图片 
inline fun ViewGroup.ImageView(resId: Int, init: ImageView.() -> Unit) {
    _ImageView(init).apply { setImageResource(resId) }
}

//drawable 指定图片
inline fun ViewGroup.ImageView(drawable: Drawable, init: ImageView.() -> Unit) {
    _ImageView(init).apply { setImageDrawable(drawable) }
}

@PublishedApi
internal inline fun ViewGroup._ImageView(init: ImageView.() -> Unit) =
    ImageView(context).apply {
        this@_ImageView.addView(this)
        init()
    }
```

> 为了方便 DSL 中使用，我们定义了两个 ImageView 方法，分别用于 resId 和 drawable 的图片设置。由于大部分代码可以复用，我们抽出了一个  _ImageView 方法。但是由于要在 inline 方法中使用，所以编译器要求 _ImageView 必须是 public 类型。_ImageView 只需在库的内部服务，所以可以添加为 internal 的同时加 [@PublishdApi ](/PublishdApi) 注解，它允许一个模块内部方法在 inline 中使用，且编译器不会报错。

## DSL总结

1. 使用带尾lambda的高阶函数实现大括号的层级调用
2. 为lambda添加Receiver，通过this传递上下文，避免使用it
3. 通过扩展函数优化代码风格，DSL中避免出现命令式的语义
4. 使用infix减少点`.`和圆括号`()`等符号的出现，提高可读性
5. 使用`@DslMarker`限制DSL作用域，只在最近的Receiver，避免出错
6. 使用 Context Receivers 传递多个上下文，DSL 更聪明（非正式语法，未来有变动的可能）
7. 使用 inline 提升性能，同时使用 [@PublishedApi ](/PublishedApi) 避免不必要的代码暴露

## kotlin 优雅的封装匿名内部类（DSL、高阶函数）

### 默认方式

```kotlin
private var etString: EditText? = null

private fun oldTextWatcher() {
    etString?.addTextChangedListener(object : TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        }

        override fun afterTextChanged(s: Editable?) {
        }
    })
}
```

### fun interface?

### DSL方式

1. 创建接口实现类：XxxxInterfaceDslImpl实现TextWatcher
   - 原接口方法对应的Kotlin函数对象(即高阶函数)，函数对象的签名与对应的方法签名保持一致。
   - DSL函数，函数名称、签名都与原接口的方法一一对应，用于接收 lambda 赋值给 Kotlin 函数对象。
   - 原接口方法的实现，每个接口方法的实现，都是对实现类中 Kotlin 函数对象的调用。
2. 创建与原函数同名的扩展函数，函数参数为实现类扩展函数
3. 使用

- 创建接口实现类：XxxxInterfaceDslImpl实现TextWatcher

```kotlin
class TextWatcherDslImpl : TextWatcher {

    // 原接口对应的kotlin函数对象
    private var afterTextChanged: ((Editable?) -> Unit)? = null

    private var beforeTextChanged: ((CharSequence?, Int, Int, Int) -> Unit)? = null

    private var onTextChanged: ((CharSequence?, Int, Int, Int) -> Unit)? = null

    /**
     * DSL中使用的函数，一般保持同名即可
     */
    fun afterTextChanged(method: (Editable?) -> Unit) {
        afterTextChanged = method
    }

    fun beforeTextChanged(method: (CharSequence?, Int, Int, Int) -> Unit) {
        beforeTextChanged = method
    }

    fun onTextChanged(method: (CharSequence?, Int, Int, Int) -> Unit) {
        onTextChanged = method
    }

    /**
     * 实现原接口的函数
     */
    override fun afterTextChanged(s: Editable?) {
        afterTextChanged?.invoke(s)
    }

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
        beforeTextChanged?.invoke(s, start, count, after)
    }

    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
        onTextChanged?.invoke(s, start, before, count)
    }
}
```

- 创建与原函数同名的扩展函数，函数参数为实现类扩展函数

```kotlin
fun TextView.addTextChangedListenerDsl(init: TextWatcherDslImpl.() -> Unit) {
    val listener = TextWatcherDslImpl()
    init(listener)
    this.addTextChangedListener(listener)
}
```

- 使用：

```kotlin
private fun dslTextWatcher1() {
    etString?.addTextChangedListenerDsl {
        afterTextChanged {
            if (it.toString().length >= 4) {
                KeyboardUtils.toggleSoftInput()
            }
        }
        onTextChanged { charSequence, i, i2, i3 ->
        }
    }
}
```

### 高阶函数方式

- 高阶函数封装

```kotlin
inline fun TextView.addTextChangedListenerClosure(
    crossinline afterTextChanged: (Editable?) -> Unit = {},
    crossinline beforeTextChanged: (CharSequence?, Int, Int, Int) -> Unit = { _, _, _, _ -> },
    crossinline onTextChanged: (CharSequence?, Int, Int, Int) -> Unit = { _, _, _, _ -> }
) {
    val listener = object : TextWatcher {
        override fun afterTextChanged(s: Editable?) {
            afterTextChanged.invoke(s)
        }

        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            beforeTextChanged.invoke(s, start, count, after)
        }

        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            onTextChanged.invoke(s, start, before, count)
        }
    }
    this.addTextChangedListener(listener)
}
```

- 使用：

```kotlin
private fun dslTextWatcher2() {
    etString?.addTextChangedListenerClosure(
        afterTextChanged = {
            if (it.toString().length >= 4) {
                KeyboardUtils.toggleSoftInput()
            }
        },
        onTextChanged = { charSequence, i, i2, i3 ->
        }
    )
}
```

### 动态代理+类委托方式

```kotlin
inline fun <reified T : Any> noOpDelegate(): T {
    val javaClass = T::class.java
    return Proxy.newProxyInstance(
        javaClass.classLoader,
        arrayOf(javaClass),
        NO_OP_HANDLER
    ) as T
}

val NO_OP_HANDLER = InvocationHandler { proxy, method, args ->
    // no op
}

// 复写的方法会回调，未复写的默认处理（不回调）
registerActivityLifecycleCallbacks(object :
        Application.ActivityLifecycleCallbacks by noOpDelegate<ActivityLifecycleCallbacks>() {
        override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
            Log.i("hacket.activity", "onActivityCreated:" + activity.localClassName)
        }

        override fun onActivityDestroyed(activity: Activity) {
            Log.w("hacket.activity", "onActivityDestroyed:" + activity.localClassName)
        }
    })
```

## DSL应用

### 对象初始化赋值

```kotlin
data class User(var name: String = "", var age: Int = 0) {
    override fun toString(): String {
        return "My name is $name ,i am $age years old"
    }
}

private fun testUser() {
    val user = User("hacket1", 30)
    println(user)

    val user2 = User().apply {
        name = "hacket2"
        age = 30
        if (age < 30) {
            return
        }
    }
    println(user2)

    val user3 = create {
        name = "hacket3"
        age = 30
    }
    println(user3)
}

inline fun create(crossinline initBlock: User.() -> Unit): User {
    return User().also { // 或者用apply
        initBlock.invoke(it)
    }
}
```

### 封装匿名内部类有多个实现方法的情况

1. TextView的TextWatcher
2. TabLayout Listener

### TextView的Span封装

思路：

1. 它应该是 TextView的一个扩展函数
2. 它的内部是 DSL 风格的代码
3. 它的每段文字都有设置颜色 & 点击事件的函数

```kotlin
interface DslSpannableStringBuilder {
    //增加一段文字
    fun addText(text: String, method: (DslSpanBuilder.() -> Unit)? = null)
}

interface DslSpanBuilder {
    //设置文字颜色
    fun setColor(color: String)
    //设置点击事件
    fun onClick(useUnderLine: Boolean = true, onClick: (View) -> Unit)
}

//为 TextView 创建扩展函数，其参数为接口的扩展函数
fun TextView.buildSpannableString(init: DslSpannableStringBuilder.() -> Unit) {
    //具体实现类
    val spanStringBuilderImpl = DslSpannableStringBuilderImpl()
    spanStringBuilderImpl.init()
    movementMethod = LinkMovementMethod.getInstance()
    //通过实现类返回SpannableStringBuilder
    text = spanStringBuilderImpl.build()
}


class DslSpannableStringBuilderImpl : DslSpannableStringBuilder {
    private val builder = SpannableStringBuilder()
    //记录上次添加文字后最后的索引值
    var lastIndex: Int = 0
    var isClickable = false

    override fun addText(text: String, method: (DslSpanBuilder.() -> Unit)?) {
        val start = lastIndex
        builder.append(text)
        lastIndex += text.length
        val spanBuilder = DslSpanBuilderImpl()
        method?.let { spanBuilder.it() }
        spanBuilder.apply {
            onClickSpan?.let {
                builder.setSpan(it, start, lastIndex, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
                isClickable = true
            }
            if (!useUnderLine) {
                val noUnderlineSpan = NoUnderlineSpan()
                builder.setSpan(noUnderlineSpan, start, lastIndex, Spanned.SPAN_MARK_MARK)
            }
            foregroundColorSpan?.let {
                builder.setSpan(it, start, lastIndex, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
            }
        }
    }

    fun build(): SpannableStringBuilder {
        return builder
    }
}

class DslSpanBuilderImpl : DslSpanBuilder {
    var foregroundColorSpan: ForegroundColorSpan? = null
    var onClickSpan: ClickableSpan? = null
    var useUnderLine = true

    override fun setColor(color: String) {
        foregroundColorSpan = ForegroundColorSpan(Color.parseColor(color))
    }

    override fun onClick(useUnderLine: Boolean, onClick: (View) -> Unit) {
        onClickSpan = object : ClickableSpan() {
            override fun onClick(widget: View) {
                onClick(widget)
            }
        }
        this.useUnderLine = useUnderLine
    }
}

class NoUnderlineSpan : UnderlineSpan() {
    override fun updateDrawState(ds: TextPaint) {
        ds.color = ds.linkColor
        ds.isUnderlineText = false
    }
}
```

使用:

```kotlin
tvTestDsl.buildSpannableString {
    addText("我已详细阅读并同意")
    addText("《隐私政策》"){
        setColor("#0099FF")
        onClick(false) {
            //do some thing
        }
    }
}
```

### 封装ConfirmDialog

```kotlin
package club.jinmei.mgvoice.core.widget

import android.content.DialogInterface
import android.os.Bundle
import android.view.Gravity
import android.widget.CompoundButton
import androidx.annotation.LayoutRes
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import club.jinmei.mgvoice.core.R

inline fun showConfirmDialogDSL(
    act: FragmentActivity?,
    crossinline initBlock: ConfirmDialogInit.() -> Unit
) {
    val confirmDialogInitImpl = ConfirmDialogInitImpl()
    confirmDialogInitImpl.initBlock()
    val dialog = confirmDialogInitImpl.build()
    dialog.show(act)
}

interface ConfirmDialogInit {

    /**
     * 提供了LifecycleOwner。在onDestroy dismiss
     */
    var lifecycleOwner: LifecycleOwner?

    // region 基础属性 setArguments
    var title: String?
    var subTitle: String?
    var message: String
    var messageHasMoreLines: Boolean
    var multiTextView: Boolean
    var textMessageGravity: Int
    // endregion

    var layoutId: Int

    var canOutCancelable: Boolean

    var okText: String?

    var cancelText: String?

    var isCancelAvailable: Boolean

    var checkText: CharSequence?

    var textGravity: Int
    var messageGravity: Int?

    var tipText: CharSequence?

    /**
     * OK按钮listener 返回false dismiss
     */
    var onOkListener: (ConfirmDialog.() -> Boolean)
    /**
     * Cancel按钮listener 返回false dismiss
     */
    var onCancelListener: (ConfirmDialog.() -> Boolean)

    var onCheckChangeListener: ((CompoundButton?, Boolean) -> Unit)

    var onDismissListener: (DialogInterface?.() -> Unit)?
}

class ConfirmDialogInitImpl(
    @LayoutRes
    override var title: String? = "",
    override var subTitle: String? = "",
    override var message: String = "",
    override var messageHasMoreLines: Boolean = false,
    override var multiTextView: Boolean = false,
    override var textMessageGravity: Int = 0,

    override var layoutId: Int = R.layout.common_confirm_layout,
    override var canOutCancelable: Boolean = true,
    override var okText: String? = null,
    override var cancelText: String? = null,
    override var isCancelAvailable: Boolean = true,
    override var checkText: CharSequence? = null,
    override var textGravity: Int = Gravity.CENTER,
    override var messageGravity: Int? = null,
    override var tipText: CharSequence? = null,
    override var onOkListener: (ConfirmDialog.() -> Boolean) = { false },
    override var onCancelListener: (ConfirmDialog.() -> Boolean) = { false },
    override var onCheckChangeListener: (CompoundButton?, Boolean) -> Unit = { _, _ -> },
    override var onDismissListener: (DialogInterface?.() -> Unit)? = null,
    override var lifecycleOwner: LifecycleOwner? = null
) : ConfirmDialogInit {

    fun build(): ConfirmDialog {
        val dialog = ConfirmDialog()
        val args = Bundle()
        args.putString("title", title)
        args.putString("sub_title", subTitle)
        args.putString("message", message)
        args.putBoolean("more_lines", messageHasMoreLines)
        args.putInt("text_message_gravity", textMessageGravity)
        args.putBoolean("multi_text", multiTextView)
        dialog.arguments = args

        with(dialog) {
            setLayoutId(layoutId)
            setCanOutCancalable(canOutCancelable)
            setOkText(okText)
            setCancelText(cancelText)
            setCancelAvailable(isCancelAvailable)
            setGravity(textGravity)
            setTips(tipText)

            messageGravity?.let {
                setMessageGravity(it)
            }

            setOnConfirmClickListener(object : ConfirmDialog.OnConfirmClickListener() {
                override fun onOk(confirmDialog: ConfirmDialog): Boolean {
                    return onOkListener.invoke(confirmDialog)
                }

                override fun onCancel(confirmDialog: ConfirmDialog): Boolean {
                    return onCancelListener.invoke(confirmDialog)
                }
            })

            setCheckable(
                checkText
            ) { buttonView, isChecked -> onCheckChangeListener.invoke(buttonView, isChecked) }

            onDismissListener?.let {
                setOnDismissListener { dialog -> it.invoke(dialog) }
            }
        }

        lifecycleOwner?.let {
            it.lifecycle.addObserver(object : DefaultLifecycleObserver {
                override fun onDestroy(owner: LifecycleOwner) {
                    if (dialog.isVisible) {
                        dialog.dismiss()
                    }
                }
            })
        }
        return dialog
    }
}

// fun test(activity: FragmentActivity) {
//    showConfirmDialogDSL(activity) {
//        message = "确定取消吗？"
//        onOkListener = {
//            Toast.makeText(activity, "点击了确定", Toast.LENGTH_SHORT).show()
//            false
//        }
//    }
//
//    showConfirmDialogDSL(activity) {
//        title = "title"
//        message = "message"
//        subTitle = "subTitle"
//        message = "message"
//        onOkListener = {
//            false
//        }
//        onCancelListener = {
//            true
//        }
//        onCheckChangeListener = { _, _ -> }
//        onDismissListener = {
//            // dismiss
//        }
//    }
// }
```

未用DSL之前：

```kotlin
var confirmDialog: ConfirmDialog = ConfirmDialog.newInstance(
    resources.getString(R.string.title_for_black_person),
    resources.getString(R.string.message_for_black_person), true, true
)
confirmDialog.setCancelText(getString(R.string.common_cancel))
confirmDialog.setOkText(getString(R.string.common_ok))
confirmDialog.setOnConfirmClickListener(object : ConfirmDialog.OnConfirmClickListener() {
    override fun onOk(confirmDialog: ConfirmDialog): Boolean {
        callback.invoke()
        confirmDialog?.dismiss()
        return true
    }
})
confirmDialog.show(this)
```

使用DSL：

```kotlin
showConfirmDialogDSL(this) {
    lifecycleOwner = this@UserHomeActivity
    title = resources.getString(R.string.title_for_black_person)
    message = resources.getString(R.string.message_for_black_person)
    messageHasMoreLines = true
    multiTextView = true
    cancelText = getString(R.string.common_cancel)
    okText = getString(R.string.common_ok)
    onOkListener = {
        callback.invoke()
        false
    }
}
```

### 封装 ImageLoader 加载

```kotlin
object UserImageLoader {  
  
    const val TAG = "UserImageLoader"  
  
    inline fun loadDSL(  
        url: String? = null,  
        view: SimpleDraweeView? = null,  
        ratio: Float? = null,  
        fillType: ImageFillType? = null,  
        crossinline onInit: (UserOnImageLoadInit.() -> Unit) = { },  
    ) {  
        val init = UserOnImageLoadInit()  
        onInit.invoke(init)  
  
        val urlInner = if (!url.isNullOrEmpty()) url else init.url  
        val viewInner = view ?: init.view  
        val ratioInner = ratio ?: init.ratio  
  
        if (urlInner.isNullOrEmpty() || viewInner !is SimpleDraweeView) {  
            return  
        }  
  
        val fillTypeInner = fillType ?: init.fillType  
        val loadConfig: SImageLoader.LoadConfig = if (fillTypeInner == ImageFillType.MASK) {  
			// 补图时，默认使用蒙层补图方式  
			SImageLoader.LoadConfigTemplate.MASK.getConfig()  
				.copy(  
					isNeedCut = true,  
					aspectRatio = ratioInner,  
					width = viewInner.width.default(),  
					onImageLoadListener = init,  
				)  
		} else {  
			// 不补图时的默认配置  
			SImageLoader.LoadConfigTemplate.DEFAULT.getConfig()  
				.copy(  
					isNeedCut = true,  
					aspectRatio = ratioInner,  
					width = viewInner.width.default(),  
					onImageLoadListener = init,  
				)  
		}  
		SImageLoader.load(  
			url = urlInner.default(),  
			view = viewInner,  
			loadConfig = loadConfig  
		) 
    }    
    class UserOnImageLoadInit : OnImageLoadListener {  
  
        var url: String? = ""  
        var view: SimpleDraweeView? = null  
        var ratio: Float? = null  
        var fillType: ImageFillType = ImageFillType.NONE  
  
        private var onImageLoadStartBlock: ((url: String) -> Unit)? = null  
        private var onImageLoadSuccessBlock: ((  
            url: String, width: Int, height: Int,  
            animatable: Animatable?  
        ) -> Unit)? = null  
        private var onFailureBlock: ((url: String, throwable: Throwable) -> Unit)? = null  
        private var onImageDecodeSuccessBlock: ((url: String, bitmap: Bitmap) -> Unit)? = null  
  
        fun onImageLoadStart(block: ((url: String) -> Unit)? = null) {  
            this.onImageLoadStartBlock = block  
        }  
  
        fun onImageLoadSucces(  
            block: ((  
                url: String, width: Int, height: Int,  
                animatable: Animatable?  
            ) -> Unit)? = null  
        ) {  
            this.onImageLoadSuccessBlock = block  
        }  
  
        fun onFailure(block: ((url: String, throwable: Throwable) -> Unit)? = null) {  
            this.onFailureBlock = block  
        }  
  
        fun onImageDecodeSuccess(block: ((url: String, bitmap: Bitmap) -> Unit)? = null) {  
            this.onImageDecodeSuccessBlock = block  
        }  
  
        override fun onImageLoadStart(url: String) {  
            onImageLoadStartBlock?.invoke(url)  
        }  
  
        override fun onImageLoadSucces(  
            url: String,  
            width: Int,  
            height: Int,  
            animatable: Animatable?  
        ) {  
            onImageLoadSuccessBlock?.invoke(url, width, height, animatable)  
        }  
  
        override fun onFailure(url: String, throwable: Throwable) {  
            onFailureBlock?.invoke(url, throwable)  
        }  
  
        override fun onImageDecodeSuccess(url: String, bitmap: Bitmap) {  
            onImageDecodeSuccessBlock?.invoke(url, bitmap)  
        }  
    }  
}
```

使用：

```kotlin
UserImageLoader.loadDSL {  
    url = icon  
    view = getIv(mode)  
    onImageDecodeSuccess { url, bitmap ->   
          
    }  
    onFailure { url, throwable ->   
          
    }  
}
```

## Ref

- [x] Kotlin DSL 实战：像 Compose 一样写代码 <https://juejin.cn/post/7069568821568208927>
