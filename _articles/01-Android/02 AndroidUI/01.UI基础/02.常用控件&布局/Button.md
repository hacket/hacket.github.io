---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:04 晚上
title: Button
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [Button]
linter-yaml-title-alias: Button
---

# Button

## Button 默认 z 轴对事件分发和 ViewGroup 绘制顺序的影响

从 Android SDK 21（即 5.0）开始，Button 控件按下自带阴影效果，阴影效果相当于是在 Z 轴的一个分量，所以导致 Button 总是在最顶层显示，同层级 View 的事件分发都是先分发给 Button。

```
When the button is pressed, a z-translation (of 4dp) is applied, raising the button from 2dp to 6dp.
When the button isn’t pressed, the elevation is 2dp
When the button is disabled, the elevation becomes 0dp
```

[frameworks/base/core/res/res/anim/button_state_list_anim_material.xml](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/anim/button_state_list_anim_material.xml)

```xml
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:state_enabled="true">
        <set>
            <objectAnimator android:propertyName="translationZ"
                            android:duration="@integer/button_pressed_animation_duration"
                            android:valueTo="@dimen/button_pressed_z_material"
                            android:valueType="floatType"/>
            <objectAnimator android:propertyName="elevation"
                            android:duration="0"
                            android:valueTo="@dimen/button_elevation_material"
                            android:valueType="floatType"/>
        </set>
    </item>
    <!-- base state -->
    <item android:state_enabled="true">
        <set>
            <objectAnimator android:propertyName="translationZ"
                            android:duration="@integer/button_pressed_animation_duration"
                            android:valueTo="0"
                            android:startDelay="@integer/button_pressed_animation_delay"
                            android:valueType="floatType"/>
            <objectAnimator android:propertyName="elevation"
                            android:duration="0"
                            android:valueTo="@dimen/button_elevation_material"
                            android:valueType="floatType" />
        </set>
    </item>
    <item>
        <set>
            <objectAnimator android:propertyName="translationZ"
                            android:duration="0"
                            android:valueTo="0"
                            android:valueType="floatType"/>
            <objectAnimator android:propertyName="elevation"
                            android:duration="0"
                            android:valueTo="0"
                            android:valueType="floatType"/>
        </set>
    </item>
</selector>
```

```xml
<!-- /Android/sdk/platforms/android-R/data/res/values/dimens_material.xml -->
<!-- Elevation when button is pressed -->
<dimen name="button_elevation_material">2dp</dimen>
<!-- Z translation to apply when button is pressed -->
<dimen name="button_pressed_z_material">4dp</dimen>
```

- 解决 1：Button 设置 `android:stateListAnimator="@null"`
- 解决 2：提升同层级 z 轴 (elevation+tranztiaonZ) 值大于 2dp
- 解决 3：用一层布局包裹 Button
- 解决 4：用 [RaiflatButton](https://github.com/rubensousa/RaiflatButton)(A raised button that lowers down to 0dp of elevation)

## Ref

- [x] Button always displays on top in FrameLayout<br /><https://stackoverflow.com/questions/32307245/button-always-displays-on-top-in-framelayout>
- [x] A different raised button behavior<br /><https://rubensousa.github.io/2016/10/raiflatbutton>

# RadioButton

## 解决 RadioButton 图片和文字居中问题

在 RadioButton 中，自定义 RadioButton 样式时，设置了 match_parent，图片和文字不能居中<br />通过自定义 CenterRadioButton

```java
public class CenterRadioButton extends RadioButton {

    public CenterRadioButton(Context context) {
        super(context);
    }

    public CenterRadioButton(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CenterRadioButton(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        if (isInEditMode()) {
            return;
        }
        super.onDraw(canvas);
        Drawable[] drawables = getCompoundDrawables();
        Drawable drawable = drawables[0];
        int gravity = getGravity();
        int left = 0;
        if (gravity == Gravity.CENTER) {
            left = ((int) (getWidth() - drawable.getIntrinsicWidth() - getPaint().measureText(getText().toString())) / 2);
        }
        drawable.setBounds(left, 0, left + drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
    }
}
```

使用，`android:button` 设置为 null，通过 drawableLeft 和 drawPadding 来实现

```xml
<RadioGroup
      android:id="@+id/rg_share_single_button"
      android:orientation="horizontal"
      android:gravity="center"
      android:layout_width="match_parent"
      android:layout_height="@dimen/qb_px_40"
      app:layout_constraintLeft_toLeftOf="parent"
      app:layout_constraintRight_toRightOf="parent"
      app:layout_constraintStart_toStartOf="parent"
      app:layout_constraintEnd_toEndOf="parent"
      app:layout_constraintTop_toBottomOf="@+id/tv_share_single_label"
      android:layout_marginTop="@dimen/qb_px_10"
      android:paddingLeft="@dimen/qb_px_15"
      android:paddingRight="@dimen/qb_px_15"
      android:weightSum="2">

  <qsbk.app.widget.CenterRadioButton
          android:id="@+id/rb_share_single_left"
          android:button="@null"
          android:background="@drawable/selector_btn_bg_share"
          android:drawableLeft="@drawable/selector_radiobutton_bg_share"
          android:text="分享单张图片"
          android:checked="true"
          android:gravity="center"
          android:drawablePadding="@dimen/qb_px_5"
          android:layout_marginRight="@dimen/qb_px_13"
          android:layout_marginEnd="@dimen/qb_px_13"
          android:layout_weight="1"
          android:layout_width="0dp"
          android:layout_height="match_parent"/>

  <qsbk.app.widget.CenterRadioButton
          android:id="@+id/rb_share_single_right"
          android:button="@null"
          android:background="@drawable/selector_btn_bg_share"
          android:drawableLeft="@drawable/selector_radiobutton_bg_share"
          android:text="分享糗事"
          android:gravity="center"
          android:drawablePadding="@dimen/qb_px_5"
          android:layout_weight="1"
          android:layout_width="0dp"
          android:layout_height="match_parent"/>
</RadioGroup>
```

效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688176354815-e4f9b498-e0a7-41d7-95b2-476cc5fc35fb.png#averageHue=%23f5f5f5&clientId=ue06fdb0a-4a81-4&from=paste&height=124&id=ufdb6a87a&originHeight=248&originWidth=1464&originalType=binary&ratio=2&rotation=0&showTitle=false&size=53587&status=done&style=none&taskId=u9c975d22-28d0-4921-b896-9f8a4a582eb&title=&width=732)<br />![](http://note.youdao.com/yws/res/8984/02024150CB4C4E1DB63B5A3B5BE05C68#id=MDlN1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

# 更改 CheckBox 选中时的样式，CheckBox 样式

## 单个 CheckBox

1. 自定义一个 `checkbox.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/check_box" android:state_checked="true" />
    <item android:drawable="@drawable/check_box_b" android:state_checked="false" />
</selector>
```

2. 更改 android:button="@drawable/checkbox"

## 所有 CheckBox 定义 style

1. 自定义一个 `checkbox.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@drawable/check_box" android:state_checked="true" />
    <item android:drawable="@drawable/check_box_b" android:state_checked="false" />
</selector>
```

2. 定义一个 CustomCheckboxTheme

```xml
<style name="CustomCheckboxTheme" parent="@android:style/Widget.CompoundButton.CheckBox">
    <item name="android:button">@drawable/music_tag_selector</item>
</style>
```

系统默认的 CheckBox 样式定义：

```xml
<style name="Widget.CompoundButton.CheckBox">
    <item name="android:background">@android:drawable/btn_check_label_background</item>
    <item name="android:button">@android:drawable/btn_check</item>
</style>
```
