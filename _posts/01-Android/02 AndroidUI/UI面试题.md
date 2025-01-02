---
date created: 2024-12-24 00:30
date updated: 2024-12-24 00:30
dg-publish: true
---

# Fragment

## Fragment的生命周期？

## Fragment原理？

# 滑动

## Scroller

### Scroller如何实现View的弹性滑动的？

1. 在ACTION_UP事件触发时调用startScroll()方法，该方法并没有进行实际的滑动操作，而是记录滑动相关变量（滑动距离、滑动时间）
2. 接着调用invalidate方法，请求View重绘，导致View.draw方法被执行
3. 当View重绘后会在draw方法中调用computeScroll()方法，而computeScroll()又会去向Scroller获取当前的scrollX和scrollY，然后通过scrollTo方法实现滑动
4. 接着又调用invalidate()方法进行第二次重绘，和之前流程一样，如此反复导致View不断进行小幅度的滑动，而多次的小幅度滑动就组成了弹性滑动，直到整个滑动过程结束

# 面试题

## RecyclerView

### RecyclerView卡顿

**卡顿的原因：**

1. 界面设计不合理，布局层级嵌套太多，过度绘制
2. bindViewHolder中业务逻辑复杂，数据计算和类型转换等耗时
3. 界面数据改变，一味地全局刷新，导致闪屏卡顿
4. 快速滑动列表，数据加载缓慢

**优化方案：**

1. 布局、绘制优化

> 官方建议布局层级不要超过10层；ViewStub延迟加载、merge标签；重叠UI移除底层背景减少过度绘制

2. 视图绑定与数据处理分离

> 在onBindViewHolder进行日期比较和日期格式化是很耗时的，onBindViewHolder方法中应该只将数据显示到视图上，而不应该进行业务的处理，业务处理在之前处理

3. notifyxxx()局部刷新，payloads
4. 改变mCachedViews的缓存，默认为2，这里面的ViewHolder缓存数据也在，根据position复用，不需要重新绑定onBindViewHolder()

> 通过`setViewCacheSize(int)`方法增大缓存的大小；用空间换时间

5. 共享RecycledViewPool
6. 惯性滑动延迟加载

> 监听addOnScrollListener，在滑动过程中不加载，滚动静止时，刷新界面，实现加载

### 如何让Recycleview的item不被detach (抖音)

### TextureView在rv中不闪屏 (抖音)

## UI场景题？

### 自定义一个五角星View？如果需要动的话？

### 如何快速镜像（翻转）一个View？

**方式1：**推荐，不需要重写onInterceptTouchEvent方法<br />android:scaleX = -1 可用来 水平镜像翻转<br />android:scaleY = -1 可用来 垂直镜像翻转<br />**方式2：**RotateAnimation，需翻转事件

```java
public class Rotate3dAnimation extends Animation {
    // 中心点
    private final float mCenterX;
    private final float mCenterY;
    // 3D变换处理camera（不是摄像头）
    private Camera mCamera = new Camera();
    /**
     * @param centerX 翻转中心x坐标
     * @param centerY 翻转中心y坐标
     */
    public Rotate3dAnimation(float centerX,
                             float centerY) {
        mCenterX = centerX;
        mCenterY = centerY;
    }
    @Override
    protected void applyTransformation(float interpolatedTime, Transformation t) {
        // 生成中间角度
        final Camera camera = mCamera;
        final Matrix matrix = t.getMatrix();
        camera.save();
        camera.rotateY(180);
        // 取得变换后的矩阵
        camera.getMatrix(matrix);
        camera.restore();
        matrix.preTranslate(-mCenterX, -mCenterY);
        matrix.postTranslate(mCenterX, mCenterY);
    }
}
```

仅仅是实现了显示的翻转，手势操作的位置并没有发生翻转，手势翻转需要重写外层的viewgroup的onInterceptTouchEvent方法，对下发的MotionEvent进行一次翻转操作，使得childView接收到的手势都是反过来的。<br />**方式3：**Canvas.scale(-1, 1, xxx, xxx) ，需翻转事件

- 普通View
  - ViewGroup在dispatchDraw中进行canvas scale
  - View在onDraw中进行canvas scale
- SurfaceView

```java
public class TestSurfaceView extends SurfaceView implements SurfaceHolder.Callback{
    SurfaceHolder surfaceHolder ;
    public TestSurfaceView(Context context, AttributeSet attrs) {
        super(context, attrs);
        surfaceHolder = this.getHolder();
        surfaceHolder.addCallback(this);
    }
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        Canvas canvas = surfaceHolder.lockCanvas();
        //绘制之前先对画布进行翻转
        canvas.scale(-1,1, getWidth()/2,getHeight()/2);
        //开始自己的内容的绘制
        Paint paint = new Paint();
        canvas.drawColor(Color.WHITE);
        paint.setColor(Color.BLACK);
        paint.setTextSize(50);
        canvas.drawText("这是对SurfaceView的翻转",50,250,paint);
        surfaceHolder.unlockCanvasAndPost(canvas);
    }
}
```

## 其他

### View树遍历是深度还是广度优先？

Android对View树进行布局时，采用的是深度优先算法，遍历到某个View时，首先沿着该View一直纵向遍历并布局到处于叶子节点的View，只有对该View及其所有子孙View完成布局后，才会布局该View的兄弟节点View

### 给定ViewGroup打印其内所有的View

1. **递归实现**

```kotlin
fun recursionPrint(root: View) {
    printView(root)
    if (root is ViewGroup) {
        for (childIndex in 0 until root.childCount) {
            val childView = root.getChildAt(childIndex)
            recursionPrint(childView)
        }
    }
}
```

2. 广度优先实现

广度优先的过程，就是对每一层节点依次访问，访问完了再进入下一层。就是**按树的深度，一层层的遍历访问；广度优先非常适合用先入先出的队列来实现**，每次子 View 都入队尾，而从对头取新的 View 进行处理。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678638530006-fab3fef0-9eef-4708-8a34-c820ea7eabaf.png#averageHue=%23e6c97f&clientId=u4085a791-f8a1-4&from=paste&height=297&id=u43114701&originHeight=364&originWidth=501&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=31547&status=done&style=none&taskId=u3b7eecb4-ecc5-4b28-9bde-281559604e2&title=&width=409)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678638545042-4e0f4dda-fb37-42c7-b23f-3c9b92d73524.png#averageHue=%23e6c47e&clientId=u4085a791-f8a1-4&from=paste&height=315&id=ubc3e46e0&originHeight=660&originWidth=861&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=96612&status=done&style=none&taskId=u5697335c-2aa2-4095-8f52-0be71d543b2&title=&width=411)

```kotlin
fun breadthFirst(root :View){
    val viewDeque = LinkedList<View>()
    var view = root
    viewDeque.push(view)
    while (!viewDeque.isEmpty()){
        view = viewDeque.poll()
        printView(view) // 这里是打印
        if(view is ViewGroup){
            for(childIndex in 0 until view.childCount){
                val childView = view.getChildAt(childIndex)
                viewDeque.addLast(childView)
            }
        }
    }
}
```

3. 深度优先实现

深度优先的过程，就是对每个可能的分支路径，深度到叶子节点，并且每个节点只访问一次。**深度优先非常适合用先入后出的栈来实现**。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678638658734-834ae6a2-e33b-43f9-8d2b-8f8fec51ed88.png#averageHue=%23e5c079&clientId=u4085a791-f8a1-4&from=paste&height=371&id=ufd42a341&originHeight=660&originWidth=700&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=62095&status=done&style=none&taskId=u7dfbe676-691e-4c9c-8428-041f63966de&title=&width=394)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1678638676262-c5b7d896-4245-46d2-a0d3-398820158835.png#averageHue=%23eac480&clientId=u4085a791-f8a1-4&from=paste&height=403&id=uc2123f3c&originHeight=611&originWidth=600&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=58134&status=done&style=none&taskId=u8f95f1f1-3185-4a87-9380-47d2f6c9a5f&title=&width=396)

```kotlin
fun depthFirst(root :View){
    val viewDeque = LinkedList<View>()
    var view = root
    viewDeque.push(view)
    while (!viewDeque.isEmpty()){
        view = viewDeque.pop()
        printView(view)
        if(view is ViewGroup){
            for(childIndex in 0 until view.childCount){
                val childView = view.getChildAt(childIndex)
                viewDeque.push(childView)
            }
        }
    }
}
```

**变种题：**统计 ViewGroup 子 View 的数量、分层打印 ViewTree、查找 ID 为 Xxx 的 View 等，

### CoordinatorLayout事件冲突怎么解决？

AppBarLayout+CoordinatorLayout+RecyclerView(其中包含横向滑动的RecyclerView)滑动冲突的问题<br />![](https://cdn.nlark.com/yuque/0/2023/gif/694278/1676008376627-a12c5299-46fa-4cf5-b57f-106d54109abf.gif#averageHue=%23acbbb5&clientId=u35ba8ad3-3b24-4&from=paste&height=356&id=u8e2bd73a&originHeight=960&originWidth=540&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u737b7f15-0b01-4415-97df-3f24fc256e7&title=&width=200)

> 这个图中顶部是一个ImageView，下面是整体是一个RecyclerView，其中包含横向可滑动的RecyclerView），如图所示滑动下面的item时候，顶部的ImageView并不会自动折叠

**原因：**CoordinatorLayout实现了NestedScrollingParent2, 外层的RecyclerView是CoordinatorLayout的子类，滑动的时候会通知CoordinatorLayout,进而由其协调CollapsingToolbarLayout发生折叠。而内部嵌套的横向RecyclerView只是实现了NestedScrollingChild2, 属于外层RecyclerView的子类, 如果不关闭横向滑动的嵌套滑动功能，就不能像其它纵向嵌入的View一样触发折叠<br />**解决：**<br />对内部嵌套的横向滑动的RecyclerView设置它的setNestedScrollingEnabled(false)即可

## <br />
