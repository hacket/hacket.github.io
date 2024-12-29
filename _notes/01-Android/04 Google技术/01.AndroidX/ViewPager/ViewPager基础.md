---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# ViewPager基础用法

## ViewPager smoothScroll 速度控制

```java
/**
 * 通过反射来修改 ViewPager的mScroller属性
 */
try {
  Class clazz=Class.forName("android.support.v4.view.ViewPager");
  Field f=clazz.getDeclaredField("mScroller");
  FixedSpeedScroller fixedSpeedScroller=new FixedSpeedScroller(this,new LinearOutSlowInInterpolator());
  fixedSpeedScroller.setmDuration(2000);
  f.setAccessible(true);
  f.set(mViewPager,fixedSpeedScroller);
} catch (Exception e) {
  e.printStackTrace();
}


/**
 * 利用这个类来修正ViewPager的滑动速度
 * 我们重写 startScroll方法，忽略传过来的 duration 属性
 * 而是采用我们自己设置的时间
 */
public class FixedSpeedScroller extends Scroller {

  public int mDuration=1500;
  public FixedSpeedScroller(Context context) {
    super(context);
  }

  public FixedSpeedScroller(Context context, Interpolator interpolator) {
    super(context, interpolator);
  }

  public FixedSpeedScroller(Context context, Interpolator interpolator, boolean flywheel) {
    super(context, interpolator, flywheel);
  }

  @Override public void startScroll(int startX, int startY, int dx, int dy) {
    startScroll(startX,startY,dx,dy,mDuration);
  }

  @Override public void startScroll(int startX, int startY, int dx, int dy, int duration) {
    //管你 ViewPager 传来什么时间，我完全不鸟你
    super.startScroll(startX, startY, dx, dy, mDuration);
  }

  public int getmDuration() {
    return mDuration;
  }

  public void setmDuration(int duration) {
    mDuration = duration;
  }
}
```

- [x] ViewPager smoothScroll 速度控制<br /><https://www.jianshu.com/p/44f6e3502412>

## ViewPager中的setCurrentItem失效

在onCreate中给ViewPager设置进入哪个Fragment页面时setCurrentItem()未起作用

```java
getViewTreeObserver().addOnGlobalLayoutListener(new OnGlobalLayoutListener() {
        @SuppressWarnings("deprecation")
        @SuppressLint("NewApi")
        @Override
        public void onGlobalLayout() {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                getViewTreeObserver().removeGlobalOnLayoutListener(this);
            } else {
                getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
            currentPosition = pager.getCurrentItem();
            currentPositionOffset = 0f;
            scrollToChild(currentPosition, 0);
        }
    });
```

- [ ] <https://github.com/astuetz/PagerSlidingTabStrip/issues/75>

## ViewPager的wrap_content无效

### 原因

```java
// ViewPager
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    // For simple implementation, our internal size is always 0.
    // We depend on the container to specify the layout size of
    // our view.  We can't really know what it is since we will be
    // adding and removing different arbitrary views and do not
    // want the layout to change as this happens.
    // 设置测量大小为默认的大小
    setMeasuredDimension(getDefaultSize(0, widthMeasureSpec),
            getDefaultSize(0, heightMeasureSpec));

    final int measuredWidth = getMeasuredWidth();
    final int maxGutterSize = measuredWidth / 10;
    mGutterSize = Math.min(maxGutterSize, mDefaultGutterSize);

    // 设置child的宽高，大小为ViewPager的测量大小减去其内边距
    int childWidthSize = measuredWidth - getPaddingLeft() - getPaddingRight();
    int childHeightSize = getMeasuredHeight() - getPaddingTop() - getPaddingBottom();

    // ---忽略Decor views 的测量---
    
    // 设置child view的 MeasureSpec
    mChildWidthMeasureSpec = MeasureSpec.makeMeasureSpec(childWidthSize, MeasureSpec.EXACTLY);
    mChildHeightMeasureSpec = MeasureSpec.makeMeasureSpec(childHeightSize, MeasureSpec.EXACTLY);

    // ---忽略其他代码

    // Page views next.
    size = getChildCount();
    for (int i = 0; i < size; ++i) {
        final View child = getChildAt(i);
        if (child.getVisibility() != GONE) {
            // ---忽略其他代码
             
            final LayoutParams lp = (LayoutParams) child.getLayoutParams();
            if (lp == null || !lp.isDecor) {
                final int widthSpec = MeasureSpec.makeMeasureSpec(
                        (int) (childWidthSize * lp.widthFactor), MeasureSpec.EXACTLY);
                // 测量child 的大小
                child.measure(widthSpec, mChildHeightMeasureSpec);
            }
        }
    }
}
```

ViewPager 在onMeasure(int widthMeasureSpec, int heightMeasureSpec)方法一开始就对自身宽高进行了默认设置，在此之前并没有进行child view的测量，故而当高度设置为"wrap_content"时不会去匹配child view 的高度。

在测量完自己之后，取得测量的宽高减去内边距后，设置为 child view 的宽高，而后再生成MeasureSpec，并以此来对child view进行测量。这也就解释了为什么明明设置了child view 的宽高，但是并不生效，反而去匹配父布局的大小。

### 错误解决

```java
public class WrapContentHeightViewPager extends ViewPager {
    public WrapContentHeightViewPager(@NonNull Context context) {
        super(context);
    }

    public WrapContentHeightViewPager(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int height = 0;
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            child.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
            int h = child.getMeasuredHeight();
            if (h > height) height = h;
        }

        heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}
```

指定height为具体的数值时，显示不对。

```
child.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
```

这一行，高度的MeasureSpec 指定大小是0，mode为 MeasureSpec.UNSPECIFIED。我们知道一个view 的大小受自身的LayoutParams 和父view 的MeasureSpec 的双重限制，还需要加上LayoutParams的设置。

```java
public class WrapContentHeightViewPager extends ViewPager {
    public WrapContentHeightViewPager(@NonNull Context context) {
        super(context);
    }

    public WrapContentHeightViewPager(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int height = 0;
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            // child 的大小受自身的LayoutParams 和父view 的MeasureSpec 的双重限制！测量高度需要同时考虑这两个因素。
            ViewGroup.LayoutParams lp = child.getLayoutParams();
            child.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(lp.height, heightMeasureSpec));
            int h = child.getMeasuredHeight();
            if (h > height) height = h;
        }

        heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}
```

## ListView头部添加ViewPager事件不响应，ListView下面的ViewPager事件不响应

```java
// 自定义ViewPager，重写dispatchTouchEvent()方法
@Override
public boolean dispatchTouchEvent(MotionEvent ev) {
    switch (ev.getAction()) {
    case MotionEvent.ACTION_DOWN:
        //请求父容器不拦截事件，响应viewpager的左右滑动
        getParent().requestDisallowInterceptTouchEvent(true);
        downX = ev.getX();
        downY = ev.getY();
        break;
    case MotionEvent.ACTION_MOVE:
        float moveX = ev.getX();
        float moveY = ev.getY();
        if (Math.abs(downX - moveX) > Math.abs(downY - moveY)) {
            //请求父容器不可以拦截事件，不响应viewpager的左右滑动，响应listview的上下滑动
            getParent().requestDisallowInterceptTouchEvent(true);
        } else {
            //请求拦截事件
            getParent().requestDisallowInterceptTouchEvent(false);
        }
        break;
    case MotionEvent.ACTION_UP:
        break;
    }
    return super.dispatchTouchEvent(ev);
}  
```

# 定制ViewPager

## 不会滑动的ViewPager

```java
public class NoSlidingViewPager extends LazyViewPager {
    public NoSlidingViewPager(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
    public NoSlidingViewPager(Context context) {
        super(context);
    }
    
    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        return false;
    }
    
    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
//        return super.onInterceptTouchEvent(ev);
        //FIXME：返回false，看看ViewPager事件是怎么拦截的
        return false;
    }
}
```

## 不会预加载页面的ViewPager，懒加载的ViewPager

ViewPager中本来充满善意的预加载就有点令人不爽了。我们能做的就是屏蔽掉ViewPager的预加载机制。虽然ViewPager中提供的有<br />setOffscreenPageLimit()来控制其预加载的数目，但是当设置为0后我们发现其根本没效果，这个的最小值就是1，也就是你只能最少前后各预加载一页。

### 方案1：修改源码

直接将ViewPager中的将`private static final int DEFAULT_OFFSCREEN_PAGES = 0;//默认的加载页面,ViewPager是1个,所以会加载两个Fragment`<br />缺点：<br />应用太受限制，比如使用ViewPagerIndicator时需要传入ViewPager对象

### 方案2：Fragment的懒加载

缺点：<br />不是真正意义上的懒加载，还是会创建3个Fragment实例

### 方案3：LazyViewPager

开源方案<https://github.com/lianghanzhen/LazyViewPager>

# PageTransformer

## ViewPager.PageTransformer介绍

> 实现ViewPager切换动画

```java

public interface PageTransformer {
    /**
        * Apply a property transformation to the given page.
        *
        * @param page Apply the transformation to this page
        * @param position Position of page relative to the current front-and-center
        * position of the pager. 0 is front and center. 1 is one full
        * page position to the right, and -1 is one page position to the left.
        */
    void transformPage(View page, float position);
}
```

比如当前页是0页，从第0页滑动到第1页，默认情况下(setOffscreenPageLimit为默认值1):<br />第0页position的变化：[0,-1]<br />第1页的position变化为：[1,0]<br />页面正中间的item是正常的，两遍<br />如果设置了pageMargin为10，左滑<br />选中的item position: [0,1-offset] // offset = PageMargin/PageWidth<br /><https://www.jianshu.com/p/722ece163629><br /><https://github.com/ToxicBakery/ViewPagerTransforms>

## ViewPager中一个页面显示多个ViewPager的Item

### 方式1-clipChildren

1. 在父容器和ViewPager中都添加上clipChildren属性
2. 然后给ViewPager设置左右两个margin，使其不致于把整个屏幕占满
3. 给ViewPager设置setPageMargin()和setOffscreenPageLimit()

```xml

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:orientation="vertical"
        android:clipChildren="false"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <android.support.v4.view.ViewPager
            android:layout_marginLeft="50dp"
            android:layout_marginRight="50dp"
            android:visibility="visible"
            android:clipChildren="false"
            android:layout_width="match_parent"
            android:id="@+id/vp"
            android:layout_height="wrap_content">
    </android.support.v4.view.ViewPager>

<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:orientation="vertical"
        android:clipChildren="false"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <android.support.v4.view.ViewPager
            android:layout_marginLeft="50dp"
            android:layout_marginRight="50dp"
            android:visibility="visible"
            android:clipChildren="false"
            android:layout_width="match_parent"
            android:id="@+id/vp"
            android:layout_height="wrap_content">
    </android.support.v4.view.ViewPager>
```

### 方式2：clipToPadding

# ViewPager Ref

- [ ] ViewPager 超详解：玩出十八般花样<br /><https://juejin.im/post/5a4c2f496fb9a044fd122631>
