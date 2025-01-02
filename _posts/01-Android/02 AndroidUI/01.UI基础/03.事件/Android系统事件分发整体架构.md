---
date created: 2024-12-24 00:28
date updated: 2024-12-24 00:28
dg-publish: true
---

# 事件分发整体架构

## 总结

- 事件分发通过一条InputStage链来分发各种事件，触摸事件在ViewPostImeInputStage处理，不管事件是否消费，所有的InputStage都会被调用
- UI事件分发只是整个事件分发的一小部分<br />![](http://note.youdao.com/yws/res/55805/0DDD965857074DE997A1CD04307A43D4#id=xzgqL&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688193633967-4a6af8ac-494a-4dfd-acaf-9b3748b8c652.png#averageHue=%23f7f7f7&clientId=uc8eb0190-d1f4-4&from=paste&height=281&id=u2c611b0d&originHeight=562&originWidth=1223&originalType=binary&ratio=2&rotation=0&showTitle=false&size=225183&status=done&style=none&taskId=u661df992-b4b4-45e0-beb4-af7223a87ed&title=&width=611.5)
- UI触摸事件整体事件分发流程

```java
InputEventReceiver#dispatchInputEvent(native调用，事件分发开始) →
WindowInputEventReceiver#onInputEvent（ViewRootImpl内部类） → 
ViewRootImpl#enqueueInputEvent →
ViewRootImpl#doProcessInputEvents →
ViewRootImpl#deliverInputEvent →
EarlyPostImeInputStage#deliver(QueuedInputEvent) →
EarlyPostImeInputStage#onProcess →
EarlyPostImeInputStage#apply →
NativePostImeInputStage#deliver(QueuedInputEvent) →
NativePostImeInputStage#onProcess （这里进行UI事件分发） →
NativePostImeInputStage#apply →
ViewPostImeInputStage#deliver(QueuedInputEvent) →
ViewPostImeInputStage#onProcess →
ViewPostImeInputStage#apply →
ViewPostImeInputStage#deliver(QueuedInputEvent) →
ViewPostImeInputStage#onProcess →
ViewPostImeInputStage#apply →
SyntheticInputStage#deliver(QueuedInputEvent) →
SyntheticInputStage#forward →
SyntheticInputStage#finishInputEvent →
InputEventReceiver#finishInputEvent（native调用，事件分发结束）
InputEventReceiver#nativeFinishInputEvent
```

- DecorView有两个职责
  - **作为View树根节点**，将事件分发给Window.Callback(Activity、Dialog)；
  - **作为ViewGroup**，将事件分发给其子View或自身onTouchEvent

## 基础

Android系统中将输入事件定义为InputEvent，而InputEvent根据输入事件的类型又分为了KeyEvent和MotionEvent，前者对应键盘事件，后者则对应屏幕触摸事件，这些事件统一由系统输入管理器InputManager进行分发。

![](http://note.youdao.com/yws/res/47109/C718487DDDCC4764A6506F9962A3577F#id=TEfo5&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### InputManager 系统输入管理器

#### InputManager作用

InputManager负责从硬件接收输入事件InputEvent，并将事件分发给当前激活的窗口（Window）处理

#### InputManager何时创建？

在系统启动的时候，`SystemServer`会启动窗口管理服务`WindowManagerService`，WindowManagerService在启动的时候就会通过启动系统输入管理器InputManager来负责监控键盘消息。

SystemServer进程中包含着各种各样的系统服务，比如ActivityManagerService、WindowManagerService等等，SystemServer由zygote进程启动, 启动过程中对WindowManagerService和InputManagerService进行了初始化:

```java
public final class SystemServer {

  private void startOtherServices() {
     // 初始化 InputManagerService
     InputManagerService inputManager = new InputManagerService(context);
     // WindowManagerService 持有了 InputManagerService
     WindowManagerService wm = WindowManagerService.main(context, inputManager,...);

     inputManager.setWindowManagerCallbacks(wm.getInputMonitor());
     inputManager.start();
  }
}
```

InputManagerService的构造器中，通过调用native函数，通知native层级初始化InputManager：

```java
public class InputManagerService extends IInputManager.Stub {

  public InputManagerService(Context context) {
    // ...通知native层初始化 InputManager
    mPtr = nativeInit(this, mContext, mHandler.getLooper().getQueue());
  }

  // native 函数
  private static native long nativeInit(InputManagerService service, Context context, MessageQueue messageQueue);
}
```

> SystemServer会启动窗口管理服务WindowManagerService，WindowManagerService在启动的时候就会通过InputManagerService启动系统输入管理器InputManager来负责监控键盘消息。

### Window 应用UI

应用层级的UI

### ViewRootImpl WMS和Window的纽带

InputManager和UI之间的通信

#### ViewRootImpl作用

ViewRootImpl作为链接WindowManager和DecorView的纽带，同时实现了ViewParent接口，ViewRootImpl作为整个控件树的根部，它是View树正常运作的动力所在，控件的测量、布局、绘制以及输入事件的分发都由ViewRootImpl控制。

#### ViewRootImpl何时被创建？

```java
ActivityThread#handleLaunchActivity() →
ActivityThread#performLaunchActivity() →
ActivityThread#handleResumeActivity() →
ActivityThread#performResumeActivity() →
Activity#onResume()/makeVisible() →
WindowManager#addView(View view/*DecorView*/, ViewGroup.LayoutParams params) →
WindowManagerImpl#addView() →
WindowManagerGlobal#addView() （new ViewRootImpl）→
ViewRootImpl#setView(View view, WindowManager.LayoutParams attrs, View panelParentView) →
```

> ViewRootImpl是在Activity#onResume后，通过WindowManager#addView后创建的

### InputChannel 事件通信渠道

Android中Window和InputManagerService之间的通信实际上使用的InputChannel，InputChannel是一个pipe，底层实际是通过socket进行通信。在ViewRootImpl.setView()过程中，也会同时注册InputChannel

```java
public final class InputChannel implements Parcelable { }
```

InputChannel实现了Parcelable，所以它可以通过Binder传输。具体是通过addDisplay()将当前window加入到WindowManagerService中管理:

```java
public final class ViewRootImpl {

    public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
        requestLayout();
        // ...
        // 创建InputChannel
        mInputChannel = new InputChannel();
        // 通过Binder在SystemServer进程中完成InputChannel的注册
        mWindowSession.addToDisplay(mWindow, mSeq, mWindowAttributes,
                getHostVisibility(), mDisplay.getDisplayId(),
                mAttachInfo.mContentInsets, mAttachInfo.mStableInsets,
                mAttachInfo.mOutsets, mInputChannel);
    }
}
```

> 在SystemServer进程中，WindowManagerService根据当前的Window创建了SocketPair用于跨进程通信，同时并对App进程中传过来的InputChannel进行了注册，这之后，ViewRootImpl里的InputChannel就指向了正确的InputChannel, 作为Client端，其fd与SystemServer进程中Server端的fd组成SocketPair, 它们就可以双向通信了。

---

## 事件整体分发流程

### 事件捕获

硬件捕获事件保存到`dev/input`节点，`InputManager`负责将从硬件捕获的事件分发给激活的`Window`，它们之间的通过`InputChannel`通信。而每个Window又绑定一个`ViewRootImpl`，事件会分发到ViewRootImpl；Android提供了`InputEventReceiver`类，以接收分发这些事件：

```java
public abstract class InputEventReceiver {
    // Called from native code.
    private void dispatchInputEvent(int seq, InputEvent event, int displayId) {
        onInputEvent(event);
    }
    public void onInputEvent(InputEvent event) {
        finishInputEvent(event, false);
    }
}
```

InputEventReceiver是一个抽象类，其默认的实现是将接收到的输入事件直接消费掉，因此真正的实现是ViewRootImpl.WindowInputEventReceiver类

```java
public final class ViewRootImpl {

    final class WindowInputEventReceiver extends InputEventReceiver {
    @Override
     public void onInputEvent(InputEvent event, int displayId) {
         // 将输入事件加入队列
         enqueueInputEvent(event, this, 0, true);
     }
    }
    // InputEventReceiver
    public abstract class InputEventReceiver {
        // Called from native code.
        private void dispatchInputEvent(int seq, InputEvent event) {
            onInputEvent(event);
        }
        public void onInputEvent(InputEvent event) {
            finishInputEvent(event, false);
        }
    }
}
```

输入事件加入队列之后，接下来就是对事件的分发了。

> 设计者在这里使用了经典的 责任链 模式：对于一个输入事件的分发而言，必然有其对应的消费者，在这个过程中为了使多个对象都有处理请求的机会，从而避免了请求的发送者和接收者之间的耦合关系。将这些对象串成一条链，并沿着这条链一直传递该请求，直到有对象处理它为止。

### 事件分发

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688193674405-02506a79-7b7b-4e3d-bd2b-cde9ca7c177b.png#averageHue=%23f7f7f7&clientId=uc8eb0190-d1f4-4&from=paste&height=281&id=u36401325&originHeight=562&originWidth=1223&originalType=binary&ratio=2&rotation=0&showTitle=false&size=225183&status=done&style=none&taskId=ubaac1d78-ab85-4c6e-adcf-da9f9bc828d&title=&width=611.5)

> UI层级的事件分发只是完整事件分发流程的一部分

在WindowInputEventReceiver#onInputEvent调用enqueueInputEvent将事件QueuedInputEvent添加到事件队列，QueuedInputEvent是一个单链表

```java
// ViewRootImpl Android29
void enqueueInputEvent(InputEvent event,
    InputEventReceiver receiver, int flags, boolean processImmediately) {
    QueuedInputEvent q = obtainQueuedInputEvent(event, receiver, flags);
    QueuedInputEvent last = mPendingInputEventTail;
    if (last == null) {
        mPendingInputEventHead = q;
        mPendingInputEventTail = q;
    } else {
        last.mNext = q;
        mPendingInputEventTail = q;
    }
    mPendingInputEventCount += 1;
    if (processImmediately) { // 一般为true
        doProcessInputEvents();
    } else {
        scheduleProcessInputEvents();
    }    
}
void doProcessInputEvents() {
    QueuedInputEvent q = mPendingInputEventHead;
    deliverInputEvent(q);
}
private void deliverInputEvent(QueuedInputEvent q) {
    InputStage stage;
    if (q.shouldSendToSynthesizer()) {
        stage = mSyntheticInputStage;
    } else {
        stage = q.shouldSkipIme() ? mFirstPostImeInputStage : mFirstInputStage;
    }
    if (stage != null) {
        handleWindowFocusChanged();
        stage.deliver(q);
    } else {
        finishInputEvent(q);
    }
}
```

在doProcessInputEvents又调用deliverInputEvent，将事件交给`InputStage#deliver`分发。

> 事件分发的整个责任链设计了`InputStage`类作为基类，作为责任链中的模版，并实现了若干个子类，为输入事件按顺序分阶段进行分发处理：

#### InputStage

```java
abstract class InputStage {
    private final InputStage mNext;
    
    protected static final int FORWARD = 0; // 交给下一个链处理标记
    protected static final int FINISH_HANDLED = 1; // 当前InputStage已经处理了
    protected static final int FINISH_NOT_HANDLED = 2; // 当前InputStage未处理
    
    // 构造时将下一个链传进来
    public InputStage(InputStage next) {
        mNext = next;
    }
    
    // 分发事件
    public final void deliver(QueuedInputEvent q) {
        if ((q.mFlags & QueuedInputEvent.FLAG_FINISHED) != 0) { // 事件已经被处理了 如果事件未结束，交给链下一个InputStage处理
            forward(q);
        } else if (shouldDropInputEvent(q)) { // 丢弃事件，view被移除 或 window没有focus了
            finish(q, false);
        } else { // 分发事件
            apply(q, onProcess(q));
        }
    }
    
    // 当前Stage对事件的处理结果
    protected int onProcess(QueuedInputEvent q) {
        return FORWARD; // 默认是事件交给链上的下一个Stage处理
    }
    
    // 如果有下一个Stage，继续分发事件
    protected void forward(QueuedInputEvent q) {
        onDeliverToNext(q);
    }
    protected void onDeliverToNext(QueuedInputEvent q) { 
        if (mNext != null) {
            mNext.deliver(q);
        } else {
            finishInputEvent(q);
        }
    }
    
    // 根据链上当前Stage#onProcess处理的结果来决定是否分发事件
    protected void apply(QueuedInputEvent q, int result) {
        if (result == FORWARD) { // 继续分发给链上下一个Stage
            forward(q);
        } else if (result == FINISH_HANDLED) { // 事件被处理
            finish(q, true); 
        } else if (result == FINISH_NOT_HANDLED) { // 事件未被处理
            finish(q, false);
        } else {
            throw new IllegalArgumentException("Invalid result: " + result);
        }
    }
}
```

InputStage的子类：

```java
// InputStage的子类，象征事件分发的各个阶段
final class ViewPreImeInputStage extends InputStage {}
final class EarlyPostImeInputStage extends InputStage {}
final class ViewPostImeInputStage extends InputStage {} // View的触摸事件的处理是ViewPostImeInputStage，source为InputDevice.SOURCE_CLASS_POINTER
final class SyntheticInputStage extends InputStage {}
abstract class AsyncInputStage extends InputStage {}
final class NativePreImeInputStage extends AsyncInputStage {}
final class ImeInputStage extends AsyncInputStage {}
final class NativePostImeInputStage extends AsyncInputStage {}
```

##### InputStage分类

1. SyntheticInputStage 综合性处理阶段，主要针对轨迹球、操作杆、导航面板及未捕获的事件使用键盘进行处理:

```java
final class SyntheticInputStage extends InputStage {
    @Override
    protected int onProcess(QueuedInputEvent q) {
        q.mFlags |= QueuedInputEvent.FLAG_RESYNTHESIZED;
        if (q.mEvent instanceof MotionEvent) {
            final MotionEvent event = (MotionEvent)q.mEvent;
            final int source = event.getSource();
            if ((source & InputDevice.SOURCE_CLASS_TRACKBALL) != 0) {
                mTrackball.process(event);
                return FINISH_HANDLED;
            } else if ((source & InputDevice.SOURCE_CLASS_JOYSTICK) != 0) {
                mJoystick.process(event);
                return FINISH_HANDLED;
            } else if ((source & InputDevice.SOURCE_TOUCH_NAVIGATION)
                    == InputDevice.SOURCE_TOUCH_NAVIGATION) {
                mTouchNavigation.process(event);
                return FINISH_HANDLED;
            }
        } else if ((q.mFlags & QueuedInputEvent.FLAG_UNHANDLED) != 0) {
            mKeyboard.process((KeyEvent)q.mEvent);
            return FINISH_HANDLED;
        }
        return FORWARD;
    }
}
```

2. ImeInputStage 输入法事件处理阶段，会从事件中过滤出用户输入的字符，如果输入的内容无法被识别，则将输入事件向下一个阶段继续分发：

```java
final class ImeInputStage extends AsyncInputStage {
    @Override
    protected int onProcess(QueuedInputEvent q) {
        if (mLastWasImTarget && !isInLocalFocusMode()) {
            InputMethodManager imm = mContext.getSystemService(InputMethodManager.class);
            if (imm != null) {
                final InputEvent event = q.mEvent;
                if (DEBUG_IMF) Log.v(mTag, "Sending input event to IME: " + event);
                int result = imm.dispatchInputEvent(event, q, this, mHandler);
                if (result == InputMethodManager.DISPATCH_HANDLED) {
                    return FINISH_HANDLED;
                } else if (result == InputMethodManager.DISPATCH_NOT_HANDLED) {
                    // The IME could not handle it, so skip along to the next InputStage
                    return FORWARD;
                } else {
                    return DEFER; // callback will be invoked later
                }
            }
        }
        return FORWARD;
    }
}
```

3. ViewPostImeInputStage 视图输入处理阶段，这里将InputEvent转化为MotionEvent，主要处理按键、轨迹球、手指触摸及一般性的运动事件，触摸事件的分发对象是View，这也正是我们熟悉的 UI层级的事件分发 流程的起点:

```java
final class ViewPostImeInputStage extends InputStage {
    @Override
    protected int onProcess(QueuedInputEvent q) {
        if (q.mEvent instanceof KeyEvent) {
            return processKeyEvent(q);
        } else {
            final int source = q.mEvent.getSource();
            if ((source & InputDevice.SOURCE_CLASS_POINTER) != 0) {
                return processPointerEvent(q);
            } else if ((source & InputDevice.SOURCE_CLASS_TRACKBALL) != 0) {
                return processTrackballEvent(q);
            } else {
                return processGenericMotionEvent(q);
            }
        }
    }
    private int processPointerEvent(QueuedInputEvent q) {
        final MotionEvent event = (MotionEvent)q.mEvent;

        mAttachInfo.mUnbufferedDispatchRequested = false;
        mAttachInfo.mHandlingPointerEvent = true;
        boolean handled = mView.dispatchPointerEvent(event); // DecorView
        maybeUpdatePointerIcon(event);
        maybeUpdateTooltip(event);
        mAttachInfo.mHandlingPointerEvent = false;
        if (mAttachInfo.mUnbufferedDispatchRequested && !mUnbufferedInputDispatch) {
            mUnbufferedInputDispatch = true;
            if (mConsumeBatchedInputScheduled) {
                scheduleConsumeBatchedInputImmediately();
            }
        }
        return handled ? FINISH_HANDLED : FORWARD;
    }
}
```

- 如果构建InputStage chain？在ViewRootImpl#setView构建的

```java
mSyntheticInputStage = new SyntheticInputStage();
InputStage viewPostImeStage = new ViewPostImeInputStage(mSyntheticInputStage);
InputStage nativePostImeStage = new NativePostImeInputStage(viewPostImeStage,
        "aq:native-post-ime:" + counterSuffix);
InputStage earlyPostImeStage = new EarlyPostImeInputStage(nativePostImeStage);
InputStage imeStage = new ImeInputStage(earlyPostImeStage,
        "aq:ime:" + counterSuffix);
InputStage viewPreImeStage = new ViewPreImeInputStage(imeStage);
InputStage nativePreImeStage = new NativePreImeInputStage(viewPreImeStage,
        "aq:native-pre-ime:" + counterSuffix);

mFirstInputStage = nativePreImeStage;
mFirstPostImeInputStage = earlyPostImeStage;
```

#### ViewPostImeInputStage

```java
// InputStage
public final void deliver(QueuedInputEvent q) {
    if ((q.mFlags & QueuedInputEvent.FLAG_FINISHED) != 0) {
        forward(q);
    } else if (shouldDropInputEvent(q)) {
        finish(q, false);
    } else {
        apply(q, onProcess(q));
    }
}
```

在InputStage#deliver中，如果事件未结束，调用apply将onProcess的结果传递进去

在ViewPostImeInputStage#onProcess()，判断如果是触摸事件，调用processPointerEvent()

```
final class ViewPostImeInputStage extends InputStage {
    @Override
    protected int onProcess(QueuedInputEvent q) {
        if (q.mEvent instanceof KeyEvent) {
            return processKeyEvent(q);
        } else {
            final int source = q.mEvent.getSource();
            if ((source & InputDevice.SOURCE_CLASS_POINTER) != 0) {
                return processPointerEvent(q);
            } else if ((source & InputDevice.SOURCE_CLASS_TRACKBALL) != 0) {
                return processTrackballEvent(q);
            } else {
                return processGenericMotionEvent(q);
            }
        }
    }
    private int processPointerEvent(QueuedInputEvent q) {
        final MotionEvent event = (MotionEvent)q.mEvent;

        mAttachInfo.mUnbufferedDispatchRequested = false;
        mAttachInfo.mHandlingPointerEvent = true;
        boolean handled = mView.dispatchPointerEvent(event); // DecorView
        maybeUpdatePointerIcon(event);
        maybeUpdateTooltip(event);
        mAttachInfo.mHandlingPointerEvent = false;
        if (mAttachInfo.mUnbufferedDispatchRequested && !mUnbufferedInputDispatch) {
            mUnbufferedInputDispatch = true;
            if (mConsumeBatchedInputScheduled) {
                scheduleConsumeBatchedInputImmediately();
            }
        }
        return handled ? FINISH_HANDLED : FORWARD; // 如果handled返回true，事件分发结束了
    }
}
```

在`processPointerEvent()`然后内部调用mView.dispatchPointerEvent()，此时的mView为DecorView，DecorView没有实现该方法，调用的是`View#dispatchPointerEvent`，最后会辗转调用到了`DecorView.dispatchTouchEvent()`。

#### DecorView

在View#dispatchPointerEvent判断是否是touchEvent，然后调用`DecorView#dispatchTouchEvent`，其实就是`ViewGroup#dispatchTouchEvent`，在VG#dispatchTouchEvent中通过mWindow.getCallback()获取Window.Callback然后调用Window.Callback.dispatchTouchEvent()，这个Callback就是PhoneWindow里的mCallback，而mCallback则是Activity的attach()赋值的，此处也就自然调用到了Activity中，

```
// View
public final boolean dispatchPointerEvent(MotionEvent event) {
    if (event.isTouchEvent()) {
        return dispatchTouchEvent(event);
    } else {
        return dispatchGenericMotionEvent(event);
    }
}

// DecorView
@Override
public boolean dispatchTouchEvent(MotionEvent ev) {
    final Window.Callback cb = mWindow.getCallback();
    return cb != null && !mWindow.isDestroyed() && mFeatureId < 0
            ? cb.dispatchTouchEvent(ev) : super.dispatchTouchEvent(ev);
}
```

> 如果Window没有设置Window.Callback==null，调用的就是super.dispatchTouchEvent(ev)及View#dispatchTouchEvent(ev)。否则调用的cb.dispatchTouchEvent，Activity实现了Window.Callback，最后回到了Activity的dispatchTouchEvent；其他Dialog，PopupWindow具体要看有没有实现这个Window.Callback

```java
public class Activity implements Window.Callback {
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            onUserInteraction();
        }
        if (getWindow().superDispatchTouchEvent(ev)) {
            return true;
        }
        return onTouchEvent(ev);
    }
}
```

##### DecorView的双重职责

```java
// 伪代码
public class DecorView extends FrameLayout {
  
    // 0.这个是继承View的，在ViewRootImpl#ViewPostImeInputStage#onProcess#processPointerEvent调用
    public final boolean dispatchPointerEvent(MotionEvent event) {
        if (event.isTouchEvent()) {
            return dispatchTouchEvent(event);
        } else {
            return dispatchGenericMotionEvent(event);
        }
    }
    
    // 1.将事件分发给Activity
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
      return window.getActivity().dispatchTouchEvent(ev)
    }

    // 4.执行ViewGroup 的 dispatchTouchEvent
    public boolean superDispatchTouchEvent(MotionEvent event) {
      return super.dispatchTouchEvent(event);
    }
}

// 2.将事件分发给Window
public class Activity {
    public boolean dispatchTouchEvent(MotionEvent ev) {
      return getWindow().superDispatchTouchEvent(ev);
    }
}

// 3.将事件再次分发给DecorView
public class PhoneWindow extends Window {
    @Override
    public boolean superDispatchTouchEvent(MotionEvent event) {
      return mDecor.superDispatchTouchEvent(event);
    }
}
```

> DecorView作为View树的根节点，接收到屏幕触摸事件MotionEvent时，应该通过递归的方式将事件分发给子View，这似乎理所当然。但实际设计中，设计者将DecorView接收到的事件首先分发给了Activity，Activity又将事件分发给了其Window，最终Window才将事件又交回给了DecorView，形成了一个小的循环

```java
ViewRootImpl.ViewPostImeInputStage#onProcess → 
ViewRootImpl.ViewPostImeInputStage#processPointerEvent →
DecorView#dispatchPointerEvent（这里其实调用的View#dispatchPointerEvent） →  
View#dispatchPointerEvent →
DecorView#dispatchTouchEvent → 
Activity#dispatchTouchEvent → 
PhoneWindow#superDispatchTouchEvent →
DecorView#superDispatchTouchEvent →
ViewGroup#dispatchTouchEvent
```

事实上DecorView这样设计，是 `面向对象程序设计` 中灵活运用 多态这一特征的有力体现——对于DecorView而言，它承担了2个职责：

1. 在接收到输入事件时，DecorView不同于其它View，它需要先将事件转发给最外层的Activity，使得开发者可以通过重写Activity.onTouchEvent()函数以达到对当前屏幕触摸事件拦截控制的目的，这里DecorView履行了自身（根节点）特殊的职责；
2. 从Window接收到事件时，作为View树的根节点，将事件分发给子View，这里DecorView履行了一个普通的View的职责。

### UI层级事件分发

现在进入UI层级的事件分发，如果是Activity，这个window是PhoneWindow，mDecor是DecorView

```java
// PhoneWindow Android29
private DecorView mDecor;
@Override
public boolean superDispatchTouchEvent(MotionEvent event) {
    return mDecor.superDispatchTouchEvent(event);
}
```

然后调用DecorView#superDispatchTouchEvent，最终调用ViewGroup#dispatchTouchEvent

```java
// DecorView Android29
public boolean superDispatchTouchEvent(MotionEvent event) {
    return super.dispatchTouchEvent(event);
}
```

下面就是正常的UI层级的事件分发了，见`UI层级事件分发-事件分发（ViewGroup）`

### 事件分发结果的返回

真正从Native层的InputManager接收输入事件的是ViewRootImpl的WindowInputEventReceiver对象，既然负责输入事件的分发，自然也负责将事件分发的结果反馈给Native层，作为事件分发的结束：

```java
public final class ViewRootImpl {
  final class WindowInputEventReceiver extends InputEventReceiver {
    @Override
     public void onInputEvent(InputEvent event, int displayId) {
         // 【开始】将输入事件加入队列,开始事件分发
         enqueueInputEvent(event, this, 0, true);
     }
  }
}

// ViewRootImpl.WindowInputEventReceiver 是其子类，因此也持有finishInputEvent函数
public abstract class InputEventReceiver {
  private static native void nativeFinishInputEvent(long receiverPtr, int seq, boolean handled);

  public final void finishInputEvent(InputEvent event, boolean handled) {
     //...
     // 【结束】调用native层函数，结束应用层的本次事件分发
     nativeFinishInputEvent(mReceiverPtr, seq, handled);
  }
}
```

从前面的InputStage我们知道，在InputStage的子类重写的onProcess方法中，根据处理结果，会返回`InputStage#FORWARD/FINISH_HANDLED/FINISH_NOT_HANDLED`，然后在`InputStage#apply`根据onProcess处理结果，分别调用`forward()/finish()`，在finish中，添加事件结束标记`QueuedInputEvent.FLAG_FINISHED`或未结束`QueuedInputEvent.FLAG_FINISHED_HANDLED`

```java
// InputStage
protected void finish(QueuedInputEvent q, boolean handled) {
    q.mFlags |= QueuedInputEvent.FLAG_FINISHED;
    if (handled) {
        q.mFlags |= QueuedInputEvent.FLAG_FINISHED_HANDLED;
    }
    forward(q);
}
```

然后调用forward，最后走到最后一个InputStage，SyntheticInputStage#onDeliverToNext，此时mNext为null，调用`InputStage#finishInputEvent`结束了事件

### Activity中事件分发最终流程图

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688193700520-22879d1b-bc7b-469a-976f-99f722c68bc8.png#clientId=uc8eb0190-d1f4-4&from=paste&height=526&id=ucdea3f9b&originHeight=1052&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=245868&status=done&style=none&taskId=uf8cca03c-9656-45a1-be36-eae22e72fd7&title=&width=540)

## ViewRootImpl是如何分发事件

```java
final class ViewPostImeInputStage extends InputStage {
    protected int onProcess(QueuedInputEvent q) {
        // ...
        return processPointerEvent(q);
        // ...
    }
    private int processPointerEvent(QueuedInputEvent q) {
        // 这个mView就是ViewRootImpl，Activity和Dialog是DecorView，PopupWindow是PopupDecorView
        boolean handled = mView.dispatchPointerEvent(event);
        return handled ? FINISH_HANDLED : FORWARD;
    }
}
```

### mView是哪里来的？

mView是在ViewRootImpl的setView中调用：

```java
View mView;
// ViewRootImpl
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView,  int userId) {
    synchronized (this) {
        if (mView == null) {
            mView = view;
        }
    }
}
```

那么ViewRootImpl又是怎么调用的？

```java
WindowManager.addView(View,ViewGroup.LayoutParams) → // 注意这里的view
WindowManagerImpl.addView(View,ViewGroup.LayoutParams) →
WindowManagerGlobal.addView(View,ViewGroup.LayoutParams,Display,parentWindow,userId) →
ViewRootImpl.setView(view,attrs,panelParentView,userId)
```

可以看到ViewRootImpl是在WindowManagerGlobal.addView添加的。

所以通过WindowManager.addView(View)添加view的时候，mView就是参数view

### mView.dispatchPointerEvent

ViewRootImpl管理一棵view树，View树的最外层是ViewGroup,而ViewGroup继承于view。因此整一棵view树，从外部可以看做一个view。viewRootImpl接收到触摸信息之后，经过处理之后，封装成MotionEvent对象发送给他所管理的view，由View自己进行分发。

```java
// View
public final boolean dispatchPointerEvent(MotionEvent event) {
    if (event.isTouchEvent()) {
        return dispatchTouchEvent(event);
    } else {
        return dispatchGenericMotionEvent(event);
    }
}
```

- mView大多数情况下是DecorView，也有不是的比如PopupDecorView
- DecorView和PopupDecorView都是FrameLayout，它们都没有重写dispatchPointerEvent()，这里只看触摸事件，所以我们只需要看dispatchTouchEvent

#### DecorView

Activity和Dialog，window是PhoneWindow，顶层的ViewGroup为DecorView，因此会调用DecorView的dispatchTouchEvent 方法进行分发。

```java
// DecorView.java api29
public boolean dispatchTouchEvent(MotionEvent ev) {
    final Window.Callback cb = mWindow.getCallback();
    return cb != null && !mWindow.isDestroyed() && mFeatureId < 0
            ? cb.dispatchTouchEvent(ev) : super.dispatchTouchEvent(ev);
}
```

> 这里的windowCallBack是一个接口，他里面包含了一些window变化的回调方法，其中就有 dispatchTouchEvent ，也就是事件分发方法。

##### 1. 如果window callBack对象不为空，则调用callBack对象的分发方法进行分发

1. Activity实现了Window.CallBack接口，并在创建布局的时候，把自己设置给了DecorView，因此在Activity的布局界面中，DecorView会把事件分发给Activity进行处理。
2. Dialog的布局界面中，会分发给实现了callBack接口的Dialog

##### 2. 如果window callBack对象为空，则调用父类ViewGroup的事件分发方法进行分发

如果顶层的viewGroup不是DecorView，那么对调用对应view的dispatchTouchEvent方法进行分发。例如，顶层的view是一个Button，那么会直接调用Button的 dispatchTouchEvent 方法；如果顶层viewGroup子类没有重写 dispatchTouchEvent 方法，那么会直接调用ViewGroup默认的 dispatchTouchEvent 方法。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688193727294-172975b5-357c-4a2d-8c66-aad0a40e030f.png#averageHue=%23f9f6f5&clientId=uc8eb0190-d1f4-4&from=paste&height=311&id=u1baf8918&originHeight=622&originWidth=892&originalType=binary&ratio=2&rotation=0&showTitle=false&size=62562&status=done&style=none&taskId=u4b9a78eb-ba9d-4ae2-aa64-9100ed224fe&title=&width=446)

1. viewRootImpl会直接调用管理的view的 dispatchTouchEvent 方法，根据具体的view的类型，调用具体的方法。
2. view树的根view可能是一个view，也可能是一个viewGroup，view会直接处理事件，而viewGroup则会进行分发。
3. DecorView重写了 dispatchTouchEvent方法，会先判断是否存在callBack，优先调用callBack的方法，也就是把事件传递给了Activity。
4. 其他的viewGroup子类会根据自身的逻辑进行事件分发。

#### PopupDecorView

下面就进入到了PupupDocorView，具体看下章节的`不同组件对于事件的分发`

#### 自定义View

这个就看自己的处理流程了，如果不处理dispatchTouchEvent的话，默认就走View那套事件分发

### 不同组件对于事件的分发

触摸事件是先发送到ViewRootImpl，然后由ViewRootImpl调用其所管理的view的方法进行事件分发。按照正常的流程，view会按照控件树向下去分发。而事件却到了activity、dialog，就是因为DecorView/PopupDocorView这个“叛徒”的存在。

#### Activity处理事件分发

前面我们知道，会回调`Window.Callback`的`dispatchTouchEvent`，而Activity实现了该方法：

```java
// Activity.java api29
public boolean dispatchTouchEvent(MotionEvent ev) {
    // down事件，回调onUserInteraction方法
    // 这个方法是个空实现，给开发者去重写
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        onUserInteraction();
    }
    // getWindow返回的就是PhoneWindow实例
    // 直接调用PhoneWindow的方法
    if (getWindow().superDispatchTouchEvent(ev)) {
        return true;
    }
    // 如果前面分发过程中事件没有被处理，那么调用Activity自身的方法对事件进行处理
    return onTouchEvent(ev);
}
```

#### Dialog处理事件分发

Dialog和Activity类似，也实现了`Window.Callback`接口，直接看dispatchTouchEvent：

```java
// Dialog.java api29
public boolean dispatchTouchEvent(@NonNull MotionEvent ev) {
    if (mWindow.superDispatchTouchEvent(ev)) {
        return true;
    }
    return onTouchEvent(ev);
}
```

这里的mWindow，就是Dialog内部维护的PhoneWindow实例，接下去的逻辑就和Activity的流程一样了。

#### PopupWindow处理事件分发

PopupWindow他的根View是`PopupDecorView`，而不是DecorView。虽然他的名字带有DecorView，但是却和DecorView一点关系都没有，他是直接继承于FrameLayout。我们看到他的事件分发方法：

```java
// PopupWindow.PopupDecorView.java api29
public boolean dispatchTouchEvent(MotionEvent ev) {
    if (mTouchInterceptor != null && mTouchInterceptor.onTouch(this, ev)) {
        return true;
    }
    return super.dispatchTouchEvent(ev);
}
```

`mTouchInterceptor` 是一个拦截器，我们可以手动给PopupWindow设置拦截器。时间会优先交给拦截器处理，如果没有拦截器或拦截器没有消费事件，那么才会交给ViewGroup去进行分发。

#### WM添加自定义View事件处理

如果未自定义处理，那么走View默认那套事件处理流程

### 最终流程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1688193599651-e65841ae-c532-4162-8f85-c2a09a964081.png#averageHue=%23f9f7f6&clientId=uc8eb0190-d1f4-4&from=paste&height=372&id=u7b6a0f2c&originHeight=744&originWidth=1118&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80819&status=done&style=none&taskId=u43296f12-db54-44ef-8467-e0dfa750e93&title=&width=559)

## Ref

- [x] 反思|Android 事件分发机制的设计与实现<br /><https://juejin.cn/post/6844903926446161927>

> 从事件分发整体分析，很不错

- [x] Android 的事件到底是怎么来的？<br /><https://mp.weixin.qq.com/s/nxiPBMyRzhkU_dwTqnp_rA>

> 分析事件来源

- [ ] Android Input<br /><https://www.jianshu.com/p/2bff4ecd86c9>

> FrameWork Android input框架
