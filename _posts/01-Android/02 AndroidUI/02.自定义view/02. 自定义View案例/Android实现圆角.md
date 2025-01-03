---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# Android实现圆角

## View使用 ViewOutlineProvider 裁剪 制作圆角或者倒角 (API21及以上)

```java
view.setOutlineProvider(new ViewOutlineProvider() {
    @Override
    public void getOutline(View view, Outline outline) {
        //设置圆角；
        outline.setRoundRect(0,0,view.getWidth(),view.getHeight(),20);
    }
});
//setClipToOutline方法针对于前景进行裁剪，如果设置为false则表示禁止裁剪，setOutlineProvider方法将无效。
//注意：如果我们的应用设置了android:hardwareAccelerated="false"，以上方式都将无效
view.setClipToOutline(true);
```

kotlin扩展方法：

```kotlin
/**
 * 设置View圆角
 */
fun View.setCornerAfterLollipop(radius: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP && radius > 0) {
        this.outlineProvider = object : ViewOutlineProvider() {
            override fun getOutline(view: View, outline: Outline) {
                val rect = Rect()
                view.getDrawingRect(rect)
                val leftMargin = 0
                val topMargin = 0
                val selfRect = Rect(
                    leftMargin,
                    topMargin,
                    rect.right - rect.left - leftMargin,
                    rect.bottom - rect.top - topMargin
                )
                outline.setRoundRect(selfRect, radius.toFloat())
            }
        }
        this.clipToOutline = true
    }
}
```

## CardView实现圆角和圆形

```xml
<android.support.v7.widget.CardView
    android:layout_width="100dp"
    android:layout_height="100dp"
    android:layout_gravity="center"
    android:layout_marginTop="10dp"
    app:cardCornerRadius="50dp">

    <ImageView
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:scaleType="centerCrop"
        android:src="@drawable/girl" />
</android.support.v7.widget.CardView>
```

设置CardView的cardCornerRadius属性，如果要展示指定的圆角，把这个值设置成你想要的圆角值就行，如果展示为圆形，首先要设置CardView长宽等值，而且cardCornerRadius为长宽的一半

## BitmapShader

### BitmapShader圆角边框

```java
/**
 * 通过BitmapShader 圆角边框
 */
public static Bitmap getRoundBitmapByShader(Bitmap bitmap, int outWidth, int outHeight, int radius, int boarder) {
    if (bitmap == null) {
        return null;
    }
    int width = bitmap.getWidth();
    int height = bitmap.getHeight();
    float widthScale = outWidth * 1f / width;
    float heightScale = outHeight * 1f / height;

    Matrix matrix = new Matrix();
    matrix.setScale(widthScale, heightScale);
    //创建输出的bitmap
    Bitmap desBitmap = Bitmap.createBitmap(outWidth, outHeight, Bitmap.Config.ARGB_8888);
    //创建canvas并传入desBitmap，这样绘制的内容都会在desBitmap上
    Canvas canvas = new Canvas(desBitmap);
    Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    //创建着色器
    BitmapShader bitmapShader = new BitmapShader(bitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP);
    //给着色器配置matrix
    bitmapShader.setLocalMatrix(matrix);
    paint.setShader(bitmapShader);
    //创建矩形区域并且预留出border
    RectF rect = new RectF(boarder, boarder, outWidth - boarder, outHeight - boarder);
    //把传入的bitmap绘制到圆角矩形区域内
    canvas.drawRoundRect(rect, radius, radius, paint);

    if (boarder > 0) {
        //绘制boarder
        Paint boarderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        boarderPaint.setColor(Color.GREEN);
        boarderPaint.setStyle(Paint.Style.STROKE);
        boarderPaint.setStrokeWidth(boarder);
        canvas.drawRoundRect(rect, radius, radius, boarderPaint);
    }
    return desBitmap;
}
```

### com.blankj.utilcode.util.ImageUtils.toRound()

## xFermode
