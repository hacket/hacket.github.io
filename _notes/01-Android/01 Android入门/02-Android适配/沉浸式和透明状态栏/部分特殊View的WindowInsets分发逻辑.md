---
date created: 2024-12-24 00:25
date updated: 2024-12-24 00:25
dg-publish: true
---

# 部分特殊View的WindowInsets分发逻辑

这些view都是设置了`OnApplyWindowInsetsListener`，不会走默认的分发WindowInsets逻辑（即默认设置padding），都是自行处理WindowsInsets。

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

1. 作为CoordinatorLayout的直接孩子，不然有些功能可能失效
2. 需要设置`fitsSystemWindows`为true，否则lastInsets记录的为null
3. AppBarLayout不消费WindowInsets；记录最后的lastInsets，只处理top，在measure和layout时，加上top偏移

## CoordinateLayout

1. CoordinateLayout本身设置了`fitsSystemWindow=true`属性
2. 子View设置了`fitsSystemWindow=true`属性
3. WindowInsets分发给了子View的Behavior

与DrawerLayout类似，通过设置OnApplyWindowInsetsListener来改变它的dispatchApply逻辑，与DrawerLayout最大的区别在于它对子view的分发是通过Behavior实现的。

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

1. DrawerLayout本身设置了`fitsSystemWindow=true`属性
2. 子View设置了`fitsSystemWindow=true`属性
3. WindowInsets分发给了子View的dispatchApplyWindowInsets

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

DrawableLayout，自己设置了fitsSystemWindow=true，在onMeasure分发给子View

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

1. 只要CollapsingToolbarLayout的标记为true，是一定消费Insets的。
2. 需要设置`fitsSystemWindows`为true，否则lastInsets记录的为null，也就获取不到top值了
3. AppBarLayout不消费WindowInsets；记录最后的lastInsets，只处理top，在measure会加上top
4. 在layout时上遍历所有子View，如果子View没有设置fitsSystemWindows标记，只要getTop()的值小于insetTop，就将其偏移到insetTop（设置了标记的子View会在StatusBar下面（under）绘制，没有设置标记的子View会被挤下去（down））
5. 在onDraw中，statusBarScrim设置setBounds

CollapsingToolbarLayout还有一个有意思的逻辑：

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

如果CollapsingToolbarLayout的直接父View是AppBarLayout，会同步AppBarLayout的fitsSystemWindows属性的值。

下面是CollapsingToolbarLayout、AppBarLayout、TabLayout，ImageView的fitsSystemWindow值的情况的表现：

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

1. ViewPager自己先调用`onApplyWindowInsets(View)`来处理，如果consumed了，其子view就不会处理了
2. ViewPager自己未处理，再`dispatchApplyWindowInsets`分发给其子view
