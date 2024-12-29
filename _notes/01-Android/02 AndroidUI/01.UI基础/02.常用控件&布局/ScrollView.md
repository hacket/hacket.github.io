---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# ScrollView fillViewport属性

为了屏幕适配，包含多元素的布局一般都会使用ScrollView ，以便小屏手机滑动查看，但是在大屏手机上内容全部加载，导致下方空白<br />我们希望最后的Button是置底的，同时是可以跟随滑动的

## 不设置viewport

当子布局高度小于ScrollView的高度时，定义子布局match_parent或者fill_parent不起作用，因此设置layout_gravity也不起作用<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688177169669-3696e417-d684-4eac-b63f-10e044cb77a7.png#averageHue=%23c18b62&clientId=u97605105-8b0f-4&from=paste&height=672&id=ucf41a3f8&originHeight=2340&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=101304&status=done&style=none&taskId=ua97b50cd-93f1-40da-afa2-6445e6ae6b9&title=&width=310)<br />在scrollview里添加属性`android:fillViewport=”true”` 就可以了，使得子布局高度和scrollview一样，而当子布局高度超过scrollview的高度时，这个属性就没有意义了<br />效果：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688177185007-88d7f4d7-e558-4a82-83a4-47b745f5b410.png#averageHue=%23fe6f00&clientId=u97605105-8b0f-4&from=paste&height=665&id=u16ab83f9&originHeight=2340&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=100596&status=done&style=none&taskId=u308c87a8-06e0-4545-a834-97d24659c51&title=&width=307)<br />代码：

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@color/amber_900"
        android:fillViewport="true"
        tools:context=".samples.ui.scrollview.ScrollViewDemo">

    <LinearLayout
            android:orientation="vertical"
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <LinearLayout
                android:orientation="vertical"
                android:layout_width="match_parent"
                android:layout_height="wrap_content">
            <TextView
                    android:text="viewport true 哈哈 \n heh \n 动画 \n 解决\n dd\n 急急急\n"
                    android:background="@color/gray_500"
                    android:layout_margin="10dp"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>

            <TextView
                    android:text="哈哈 \n heh \n 动画 \n 解决\n dd\n 急急急\n"
                    android:background="@color/gray_500"
                    android:layout_margin="10dp"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>


            <TextView
                    android:text="哈哈 \n heh \n 动画 \n 解决\n dd\n 急急急\n"
                    android:background="@color/gray_500"
                    android:layout_margin="10dp"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>

            <TextView
                    android:text="哈哈 \n heh \n 动画 \n 解决\n dd\n 急急急\n"
                    android:background="@color/gray_500"
                    android:layout_margin="10dp"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"/>

        </LinearLayout>

        <LinearLayout
                android:visibility="visible"
                android:layout_marginTop="20dp"
                android:background="@color/indigo_A100"
                android:layout_width="match_parent"
                android:layout_height="match_parent">

            <Button
                    android:text="底部按钮"
                    android:layout_width="match_parent"
                    android:layout_height="45dp"
                    android:layout_gravity="bottom"/>
        </LinearLayout>

    </LinearLayout>

</ScrollView>
```
