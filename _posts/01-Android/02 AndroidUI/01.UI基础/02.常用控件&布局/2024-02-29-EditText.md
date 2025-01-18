---
date created: 星期二, 十二月 24日 2024, 12:28:00 凌晨
date updated: 星期一, 一月 6日 2025, 9:54:07 晚上
title: EditText
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [EditText 设置]
linter-yaml-title-alias: EditText 设置
---

# EditText 设置

## 基本设置

### IME Options

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688176149153-b801a382-445e-4c71-af9a-23e008b120ac.png#averageHue=%23fbfaf9&clientId=ufe914e95-d363-4&from=paste&height=405&id=uc7042e52&originHeight=810&originWidth=999&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88356&status=done&style=none&taskId=u751dcb59-0228-485f-87be-f22de54ed25&title=&width=499.5)

### inputType

#### EditText 设置输入类型为数字

```
android:inputType="number"

setInputType(EditorInfo.TYPE_CLASS_NUMBER);
```

#### EditText 设置不可编辑

```
android:inputType="none"
setInputType(EditorInfo.TYPE_NULL);
```

#### EditText 设置可自动换行

```
android:inputType="textMultiLine"
```

### 光标

#### textCursorDrawable 光标 Cursor 颜色及粗细

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <size android:width="1.5dp" />
    <solid android:color="@color/white" />
    <padding
        android:top="-5dp"
        android:bottom="-5dp" />
</shape>
```

- 颜色 solid
- 粗细 size
- 高度 padding<br />正数让光标向上多延伸 5dp 的高度，负数让光标在下面缩短 5dp 的高度

使用

```xml
<EditText
    android:id="@+id/login_username_et"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:inputType="text"
    android:maxLength="25"
    android:paddingTop="@dimen/qb_px_4"
    android:paddingBottom="@dimen/qb_px_4"
    android:singleLine="true"
    android:textCursorDrawable="@drawable/shape_login_color_cursor"
    android:textSize="16sp" />
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688176166440-1cdf7b0e-946d-4cc4-88a3-254a9025f660.png#averageHue=%23382f38&clientId=ufe914e95-d363-4&from=paste&height=34&id=udfef4296&originHeight=68&originWidth=174&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6809&status=done&style=none&taskId=uef0c1b62-0745-4987-99f9-f6b0213ee55&title=&width=87)

#### EditText 设置未进行输入时候光标不闪烁

```
android:cursorVisible="false"
```

#### 代码设置光标

```kotlin
// 修改光标
fun EditText.textCursor(@DrawableRes textCursorDrawable: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        setTextCursorDrawable(textCursorDrawable)
    } else {
        try { // 修改光标的颜色（反射）
            val mCursorDrawableResField = this.javaClass.getDeclaredField("mCursorDrawableRes");
            mCursorDrawableResField.isAccessible = true
            mCursorDrawableResField.set(this, textCursorDrawable)
        } catch (ignored: Exception) {
        }
    }
}
```

### 背景 background

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:radius="@dimen/qb_px_4" />
    <solid android:color="@color/black_30_percent_transparent" />
</shape>
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688176174716-042b8830-725a-451a-81d6-bfa3a48276b3.png#averageHue=%23382f38&clientId=ufe914e95-d363-4&from=paste&height=34&id=ub7381871&originHeight=68&originWidth=174&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6809&status=done&style=none&taskId=u1051c79b-ed86-4d6c-8ba3-65b6adce057&title=&width=87)

## 限制 EditText 最大输入字符数

### 在 xml 文件中设置文本编辑框属性作字符数限制

`android:maxLength="10"` 即限制最大输入字符个数为 10

### InputFilter

在代码中使用 InputFilter 进行过滤<br />[//editText.setFilters](//editText.setFilters)(new InputFilter[]{new InputFilter.LengthFilter(20)}); 即限定最大输入字符数为 20

> 如果输入框中有自定义的 emotion，imagespan。则不行。

### 利用 TextWatcher 进行监听

```java
package cie.textEdit;
 
import android.text.Editable;
import android.text.Selection;
import android.text.TextWatcher;
import android.widget.EditText;
 
/*
 * 监听输入内容是否超出最大长度，并设置光标位置
 * */
public class MaxLengthWatcher implements TextWatcher {
 
	private int maxLen = 0;
	private EditText editText = null;
	
	
	public MaxLengthWatcher(int maxLen, EditText editText) {
		this.maxLen = maxLen;
		this.editText = editText;
	}
 
	public void afterTextChanged(Editable arg0) {
		// TODO Auto-generated method stub
		
	}
 
	public void beforeTextChanged(CharSequence arg0, int arg1, int arg2,
			int arg3) {
		// TODO Auto-generated method stub
		
	}
 
	public void onTextChanged(CharSequence arg0, int arg1, int arg2, int arg3) {
		// TODO Auto-generated method stub
		Editable editable = editText.getText();
		int len = editable.length();
		
		if(len > maxLen)
		{
			int selEndIndex = Selection.getSelectionEnd(editable);
			String str = editable.toString();
			//截取新字符串
			String newStr = str.substring(0,maxLen);
			editText.setText(newStr);
			editable = editText.getText();
			
			//新字符串的长度
			int newLen = editable.length();
			//旧光标位置超过字符串长度
			if(selEndIndex > newLen)
			{
				selEndIndex = editable.length();
			}
			//设置新光标所在的位置
			Selection.setSelection(editable, selEndIndex);
			
		}
	}
 
}
```
