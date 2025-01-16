---
date created: 2024-12-24 00:27
date updated: 2024-12-24 00:27
dg-publish: true
---

> android:gravity：内部对齐方式：左对齐，右对齐，居中对齐，顶部对齐，底部对齐这些。
> android:inputType：设置文本的数据类型，如果包含非该类型的文本则不显示，如设置为number类型，如果文本有非数字类型文本，则文本显示不出来。类型有：（    "none"：输入普通字符、"text"：输入普通字符、"textCapCharacters"：输入普通字符、"textCapWords"：单词首字母大小、"textCapSentences"：仅第一个字母大小、"textAutoCorrect"：前两个自动完成、"textAutoComplete"：前两个自动完成、"textMultiLine"：多行输入、"textImeMultiLine"：输入法多行（不一定支持）、"textNoSuggestions"：不提示、"textUri"：URI格式、"textEmailAddress"：电子邮件地址格式、"textEmailSubject"：邮件主题格式、"textShortMessage"：短消息格式、"textLongMessage"：长消息格式、"textPersonName"：人名格式、"textPostalAddress"：邮政格式、"textPassword"：密码格式、"textVisiblePassword"：密码可见格式、"textWebEditText"：作为网页表单的文本格式、"textFilter"：文本筛选格式、"textPhonetic"：拼音输入格式、"number"：数字格式、"numberSigned"：有符号数字格式、"numberDecimal"：可以带小数点的浮点格式、"phone"：拨号键盘、"datetime"：日期+时间格式、"date"：日期键盘、"time"：时间键盘）。
> android:lines：设置文本多少行，当长度超出该值时，超出文本部分不显示和android:minLines属性类似。
> android:maxLines：设置文本最大多少行，当文本达到改行数还没显示完，超出部分不显示，和android:lines属性类似。
> android:maxLength：控制文本最多显示多少个字符，比如你设置了10，而文本有几十个字，最终效果只能显示10个字。
> android:drawableBottom：TextVie底部出现一个图片。
> android:drawableEnd：TextView右侧出现一个图片。
> android:drawableRight：TextView右侧出现一个图片。
> android:drawableLeft：TextView左侧出现一个图片。
> android:drawableStart：TextView左侧出现一个图片。
> android:drawablePadding：是设置text与drawable(图片等)的间隔，一般都与drawableLeft、drawableStart 、drawableEnd 、drawableRight、drawableTop、drawableBottom一起使用。
> android:drawableTop：TextView上部出现一个图片。
> android:minLines：限制文本最低多少行显示。
> android:singleLine：布尔类型，表示是否单行显示，已经废弃，建议用android:lines。
> android:text：设置显示的文本。
> android:textSize：设置文本大小。
> android:textStyle：设置文本样式。
> android:typeface：设置文本的字体，monospace：等宽字体，sans：无衬线字体，serif：衬线，normal：普通字体。
> android:fontFamily：字体家，里面可以有多个字体，可搭配字体权重，引用的是xml文件，例如【android:fontFamily="@font/myfont"】，文件在【res-font中】。
> android:textFontWeight：设置使用的字体的权重，权重高使用谁，和android:fontFamily一起使用。
> android:hint：提示文本在文本空时显示，和EditText的hint是同等之妙。
> android:textColorHint：设置android:hint属性文本的颜色。
> android:shadowColor：设置所有文本阴影的颜色，shadowColor、shadowDx、shadowDy、shadowRadius同时使用实现立体文字效果，味道极佳。
> android:shadowDx：设置所有文本x轴即水平偏移，右为正，左为负，shadowColor、shadowDx、shadowDy、shadowRadius同时使用实现立体文字效果，味道极佳。
> android:shadowDy：设置所有文本y轴即垂直偏移，下为正，上为负，shadowColor、shadowDx、shadowDy、shadowRadius同时使用实现立体文字效果，味道极佳。
> android:shadowRadius：设置所有文本阴影的半径，shadowColor、shadowDx、shadowDy、shadowRadius同时使用实现立体文字效果，味道极佳。
> android:textColor：设置文本的颜色。
> android:textColorHighlight：设置点击后文本的背景色，比如android:autoLink="web"为超链接的时候，点击后背景色会展示android:textColorHighlight设置的。
> android:textColorLink：设置文本是链接类型的颜色，和android:autoLink="web"联合使用。
> android:textCursorDrawable：设置光标颜色，这个应用在EditText输入框View中，而且是自定义的drawable文件。
> android:textScaleX：设置文本的水平缩放程度，大于1，x方向拉长，看起来更胖了，小于1，x方向缩短，看起来更瘦了。
> android:autoLink：指定连接形式文字，可以是（"web"：匹配网页模式，点击跳转浏览器应用打开网页、"all"：匹配所有模式（相当于网络|电子邮件|电话|图）、"email"：匹配电子邮件地址，点击后自动跳转邮箱相关的应用、"phone"：匹配电子邮件地，点击后自动跳转拨号页面、"none"：默认值，什么也没有）。
> android:ellipsize：设置省略号（"start"：省略号显示在开头、"end"：省略号显示在结尾、"middle"：省略号显示在中间、"marquee" ：以`[跑马灯]`的方式显示(动画横向移动)），如果TextView的layout_width和layout_height是指定了像素的固定宽高，该属性会直接生效，如果宽高是"wrap_content"类型的，则需要同时结合【android:maxLines】和【android:maxEms】属性才可生效。
> android:ems：代表的是字符M的宽度，注意不同的设备M的宽度不同，假设设置为6，则可显示文本的长度为6个M的长度。
> android:maxEms：设置视图最多ems宽。
> android:minEms：设置视图最小ems宽。
> android:enabled：设置控件针对点击事件是否启用，每个view都有，设置为true则点击事件无响应。
