---
date created: Tuesday, December 24th 2024, 12:25:00 am
date updated: Monday, January 6th 2025, 11:02:51 pm
title: 部分特殊View的WindowInsets分发逻辑
dg-publish: true
image-auto-upload: true
feed: show
format: list
categories: [Android]
aliases: [部分特殊 View 的 WindowInsets 分发逻辑]
linter-yaml-title-alias: 部分特殊 View 的 WindowInsets 分发逻辑
---

# 部分特殊 View 的 WindowInsets 分发逻辑

这些 view 都是设置了 `OnApplyWindowInsetsListener`，不会走默认的分发 WindowInsets 逻辑（即默认设置 padding），都是自行处理 WindowsInsets。

## AppBarLayout

```java
public AppBarLayout() {
  ViewCompat.setOnApplyWindowInsetsListener(
    this,
    new androidx.core.view.OnApplyWindowInsetsListener() {
      @Override
      public WindowInsetsCompat onApplyWindowInsets(View v, WindowInsetsCompat insets) {
        return onWindowInsetChanged(insets);
      }
    });
}  
WindowInsetsCompat onWindowInsetChanged(final WindowInsetsCompat insets) {
    WindowInsetsCompat newInsets = null;

    if (ViewCompat.getFitsSystemWindows(this)) {
      // If we're set to fit system windows, keep the insets
      newInsets = insets;
    }

    // If our insets have changed, keep them and trigger a layout...
    if (!ObjectsCompat.equals(lastInsets, newInsets)) {
      lastInsets = newInsets;
      updateWillNotDraw();
      requestLayout();
    }

    return insets;
}
```

1. 作为 CoordinatorLayout 的直接孩子，不然有些功能可能失效
2. 需要设置 `fitsSystemWindows` 为 true，否则 lastInsets 记录的为 null
3. AppBarLayout 不消费 WindowInsets；记录最后的 lastInsets，只处理 top，在 measure 和 layout 时，加上 top 偏移

## CoordinateLayout

1. CoordinateLayout 本身设置了 `fitsSystemWindow=true` 属性
2. 子 View 设置了 `fitsSystemWindow=true` 属性
3. WindowInsets 分发给了子 View 的 Behavior

与 DrawerLayout 类似，通过设置 OnApplyWindowInsetsListener 来改变它的 dispatchApply 逻辑，与 DrawerLayout 最大的区别在于它对子 view 的分发是通过 Behavior 实现的。

```java
@Override
public void setFitsSystemWindows(boolean fitSystemWindows) {
    super.setFitsSystemWindows(fitSystemWindows);
    setupForInsets();
}
private void setupForInsets() {
    if (Build.VERSION.SDK_INT < 21) {
        return;
    }
        
    if (ViewCompat.getFitsSystemWindows(this)) { // 设置了fitsSystemWindow=true属性
        if (mApplyWindowInsetsListener == null) {
            mApplyWindowInsetsListener =
                    new androidx.core.view.OnApplyWindowInsetsListener() {
                        @Override
                        public WindowInsetsCompat onApplyWindowInsets(View v,
                                WindowInsetsCompat insets) {
                            return setWindowInsets(insets);
                        }
                    };
        }
        // First apply the insets listener
        ViewCompat.setOnApplyWindowInsetsListener(this, mApplyWindowInsetsListener);

        // Now set the sys ui flags to enable us to lay out in the window insets
        setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    } else {
        ViewCompat.setOnApplyWindowInsetsListener(this, null);
    }
}
final WindowInsetsCompat setWindowInsets(WindowInsetsCompat insets) {
    if (!ObjectsCompat.equals(mLastInsets, insets)) {
        mLastInsets = insets;
        mDrawStatusBarBackground = insets != null && insets.getSystemWindowInsetTop() > 0;
        setWillNotDraw(!mDrawStatusBarBackground && getBackground() == null);

        // Now dispatch to the Behaviors
        insets = dispatchApplyWindowInsetsToBehaviors(insets);
        requestLayout();
    }
    return insets;
}
private WindowInsetsCompat dispatchApplyWindowInsetsToBehaviors(WindowInsetsCompat insets) {
    if (insets.isConsumed()) {
        return insets;
    }

    for (int i = 0, z = getChildCount(); i < z; i++) {
        final View child = getChildAt(i);
        if (ViewCompat.getFitsSystemWindows(child)) {
            final LayoutParams lp = (LayoutParams) child.getLayoutParams();
            final Behavior b = lp.getBehavior();

            if (b != null) {
                // If the view has a behavior, let it try first
                insets = b.onApplyWindowInsets(this, child, insets);
                if (insets.isConsumed()) {
                    // If it consumed the insets, break
                    break;
                }
            }
        }
    }

    return insets;
}
```

## DrawerLayout

1. DrawerLayout 本身设置了 `fitsSystemWindow=true` 属性
2. 子 View 设置了 `fitsSystemWindow=true` 属性
3. WindowInsets 分发给了子 View 的 dispatchApplyWindowInsets

```java
if (ViewCompat.getFitsSystemWindows(this)) {
    if (Build.VERSION.SDK_INT >= 21) {
        setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                final DrawerLayout drawerLayout = (DrawerLayout) view;
                drawerLayout.setChildInsets(insets, insets.getSystemWindowInsetTop() > 0);
                return insets.consumeSystemWindowInsets();
            }
        });
        setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        final TypedArray a = context.obtainStyledAttributes(THEME_ATTRS);
        try {
            mStatusBarBackground = a.getDrawable(0);
        } finally {
            a.recycle();
        }
    } else {
        mStatusBarBackground = null;
    }
}
public void setChildInsets(Object insets, boolean draw) {
    mLastInsets = insets;
    mDrawStatusBarBackground = draw;
    setWillNotDraw(!draw && getBackground() == null);
    requestLayout();
}
// 在onMeasure
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    final boolean applyInsets = mLastInsets != null && ViewCompat.getFitsSystemWindows(this);
    for (int i = 0; i < childCount; i++) {
        final View child = getChildAt(i);
        if (child.getVisibility() == GONE) {
            continue;
        }
        final LayoutParams lp = (LayoutParams) child.getLayoutParams();
        if (applyInsets) {
            final int cgrav = GravityCompat.getAbsoluteGravity(lp.gravity, layoutDirection);
            if (ViewCompat.getFitsSystemWindows(child)) {
                if (Build.VERSION.SDK_INT >= 21) {
                    WindowInsets wi = (WindowInsets) mLastInsets;
                    if (cgrav == Gravity.LEFT) {
                        wi = wi.replaceSystemWindowInsets(wi.getSystemWindowInsetLeft(),
                                wi.getSystemWindowInsetTop(), 0,
                                wi.getSystemWindowInsetBottom());
                    } else if (cgrav == Gravity.RIGHT) {
                        wi = wi.replaceSystemWindowInsets(0, wi.getSystemWindowInsetTop(),
                                wi.getSystemWindowInsetRight(),
                                wi.getSystemWindowInsetBottom());
                    }
                    child.dispatchApplyWindowInsets(wi);
                }
            } else {
                if (Build.VERSION.SDK_INT >= 21) {
                    WindowInsets wi = (WindowInsets) mLastInsets;
                    if (cgrav == Gravity.LEFT) {
                        wi = wi.replaceSystemWindowInsets(wi.getSystemWindowInsetLeft(),
                                wi.getSystemWindowInsetTop(), 0,
                                wi.getSystemWindowInsetBottom());
                    } else if (cgrav == Gravity.RIGHT) {
                        wi = wi.replaceSystemWindowInsets(0, wi.getSystemWindowInsetTop(),
                                wi.getSystemWindowInsetRight(),
                                wi.getSystemWindowInsetBottom());
                    }
                    lp.leftMargin = wi.getSystemWindowInsetLeft();
                    lp.topMargin = wi.getSystemWindowInsetTop();
                    lp.rightMargin = wi.getSystemWindowInsetRight();
                    lp.bottomMargin = wi.getSystemWindowInsetBottom();
                }
            }
        }
        // ...
    }
}
```

DrawableLayout，自己设置了 fitsSystemWindow=true，在 onMeasure 分发给子 View

## CollapsingToolbarLayout

```java
public CollapsingToolbarLayout() {
   ViewCompat.setOnApplyWindowInsetsListener(
    this,
    new androidx.core.view.OnApplyWindowInsetsListener() {
      @Override
      public WindowInsetsCompat onApplyWindowInsets(
          View v, @NonNull WindowInsetsCompat insets) {
        return onWindowInsetChanged(insets);
      }
    });
}
WindowInsetsCompat onWindowInsetChanged(@NonNull final WindowInsetsCompat insets) {
    WindowInsetsCompat newInsets = null;
    
    if (ViewCompat.getFitsSystemWindows(this)) {
      // If we're set to fit system windows, keep the insets
      newInsets = insets;
    }
    
    // If our insets have changed, keep them and invalidate the scroll ranges...
    if (!ObjectsCompat.equals(lastInsets, newInsets)) {
      lastInsets = newInsets;
      requestLayout();
    }
    
    // Consume the insets. This is done so that child views with fitSystemWindows=true do not
    // get the default padding functionality from View
    return insets.consumeSystemWindowInsets();
}

@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    ensureToolbar();
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);

    final int mode = MeasureSpec.getMode(heightMeasureSpec);
    final int topInset = lastInsets != null ? lastInsets.getSystemWindowInsetTop() : 0;
    if (mode == MeasureSpec.UNSPECIFIED && topInset > 0) {
      // If we have a top inset and we're set to wrap_content height we need to make sure
      // we add the top inset to our height, therefore we re-measure
      heightMeasureSpec =
          MeasureSpec.makeMeasureSpec(getMeasuredHeight() + topInset, MeasureSpec.EXACTLY);
      super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
    // ...
}
@Override
protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    super.onLayout(changed, left, top, right, bottom);

    if (lastInsets != null) {
      // Shift down any views which are not set to fit system windows
      final int insetTop = lastInsets.getSystemWindowInsetTop();
      for (int i = 0, z = getChildCount(); i < z; i++) {
        final View child = getChildAt(i);
        if (!ViewCompat.getFitsSystemWindows(child)) {
          if (child.getTop() < insetTop) {
            // If the child isn't set to fit system windows but is drawing within
            // the inset offset it down
            ViewCompat.offsetTopAndBottom(child, insetTop);
          }
        }
      }
    }
    // ...
}
```

1. 只要 CollapsingToolbarLayout 的标记为 true，是一定消费 Insets 的。
2. 需要设置 `fitsSystemWindows` 为 true，否则 lastInsets 记录的为 null，也就获取不到 top 值了
3. AppBarLayout 不消费 WindowInsets；记录最后的 lastInsets，只处理 top，在 measure 会加上 top
4. 在 layout 时上遍历所有子 View，如果子 View 没有设置 fitsSystemWindows 标记，只要 getTop() 的值小于 insetTop，就将其偏移到 insetTop（设置了标记的子 View 会在 StatusBar 下面（under）绘制，没有设置标记的子 View 会被挤下去（down））
5. 在 onDraw 中，statusBarScrim 设置 setBounds

CollapsingToolbarLayout 还有一个有意思的逻辑：

```java
@Override
protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    // Add an OnOffsetChangedListener if possible
    final ViewParent parent = getParent();
    if (parent instanceof AppBarLayout) {
      AppBarLayout appBarLayout = (AppBarLayout) parent;

      disableLiftOnScrollIfNeeded(appBarLayout);

      // Copy over from the ABL whether we should fit system windows
      ViewCompat.setFitsSystemWindows(this, ViewCompat.getFitsSystemWindows(appBarLayout));

      if (onOffsetChangedListener == null) {
        onOffsetChangedListener = new OffsetUpdateListener();
      }
      appBarLayout.addOnOffsetChangedListener(onOffsetChangedListener);

      // We're attached, so lets request an inset dispatch
      ViewCompat.requestApplyInsets(this);
    }
}
```

如果 CollapsingToolbarLayout 的直接父 View 是 AppBarLayout，会同步 AppBarLayout 的 fitsSystemWindows 属性的值。

下面是 CollapsingToolbarLayout、AppBarLayout、TabLayout，ImageView 的 fitsSystemWindow 值的情况的表现：

- [x] [[Digging] Android Translucent Status Bar](https://blog.kyleduo.com/2017/05/02/digging-translucentstatusbar/)

## ViewPager

```java
void initViewPager() {
    // ...
    ViewCompat.setOnApplyWindowInsetsListener(this,
        new androidx.core.view.OnApplyWindowInsetsListener() {
            private final Rect mTempRect = new Rect();

            @Override
            public WindowInsetsCompat onApplyWindowInsets(final View v,
                    final WindowInsetsCompat originalInsets) {
                // First let the ViewPager itself try and consume them...
                final WindowInsetsCompat applied =
                        ViewCompat.onApplyWindowInsets(v, originalInsets);
                if (applied.isConsumed()) {
                    // If the ViewPager consumed all insets, return now
                    return applied;
                }

                // Now we'll manually dispatch the insets to our children. Since ViewPager
                // children are always full-height, we do not want to use the standard
                // ViewGroup dispatchApplyWindowInsets since if child 0 consumes them,
                // the rest of the children will not receive any insets. To workaround this
                // we manually dispatch the applied insets, not allowing children to
                // consume them from each other. We do however keep track of any insets
                // which are consumed, returning the union of our children's consumption
                final Rect res = mTempRect;
                res.left = applied.getSystemWindowInsetLeft();
                res.top = applied.getSystemWindowInsetTop();
                res.right = applied.getSystemWindowInsetRight();
                res.bottom = applied.getSystemWindowInsetBottom();

                for (int i = 0, count = getChildCount(); i < count; i++) {
                    final WindowInsetsCompat childInsets = ViewCompat
                            .dispatchApplyWindowInsets(getChildAt(i), applied);
                    // Now keep track of any consumed by tracking each dimension's min
                    // value
                    res.left = Math.min(childInsets.getSystemWindowInsetLeft(),
                            res.left);
                    res.top = Math.min(childInsets.getSystemWindowInsetTop(),
                            res.top);
                    res.right = Math.min(childInsets.getSystemWindowInsetRight(),
                            res.right);
                    res.bottom = Math.min(childInsets.getSystemWindowInsetBottom(),
                            res.bottom);
                }

                // Now return a new WindowInsets, using the consumed window insets
                return applied.replaceSystemWindowInsets(
                        res.left, res.top, res.right, res.bottom);
            }
        });
}
```

1. ViewPager 自己先调用 `onApplyWindowInsets(View)` 来处理，如果 consumed 了，其子 view 就不会处理了
2. ViewPager 自己未处理，再 `dispatchApplyWindowInsets` 分发给其子 view
