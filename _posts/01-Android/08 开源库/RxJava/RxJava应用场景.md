---
date created: 2024-05-30 16:44
date updated: 2024-12-24 00:37
dg-publish: true
---

# RxJava2应用场景

- [ ] 18个RxJava2应用场景<br><https://github.com/kaushikgopal/RxJava-Android-Samples>
- [ ] RxJava应用场景<br><https://blog.csdn.net/johnny901114/article/details/51568562>
- [ ] RxJava1.x使用场景小结-大头鬼<br><https://blog.csdn.net/lzyzsd/article/details/50120801>
- [ ] RxJava2 实战知识梳理<br><https://www.jianshu.com/p/c935d0860186>

## RxBinding实现UI响应式

1、 各种事件绑定<br>2、 结合RxBinding实现表单校验

> 结合combineLatest，如注册的时候所有输入信息（邮箱、密码、电话号码等）合法才点亮注册按钮。

3、 过滤重复点击

> 结合throttleFirst

4、 自定义Listener响应式<br>5、 响应式界面（CheckBox更新和sp更新）

> 结合RxBinding和rx-preference

6、buffer结合RxBinding统计n秒内点击次数

> buffer

## 网络请求相关

1、利用concatXXX实现多级缓存

> 内存、本地（文件、数据库）、网络<br>使用concat和first实现多级缓存.md

2、多个请求依赖，接口依赖 --flatmap

> 例如用户注册成功后需要自动登录，我们只需要先通过注册接口注册用户信息，注册成功后马上调用登录接口进行自动登录即可。

3、合并接口（结合多个接口更新ui界面）--zip

> 用zip来实现，多个Observable发射多个数据，切换线程保证发射一个，zip一个，subscribe一个。

4、网络轮询

> schedulePeriodically

5、使用merge合并两个数据源，界面需要等到多个接口并发取完数据，再更新<br>拼接两个Observable的输出，不保证顺序，按照事件产生的顺序发送给订阅者

> 例如一组数据来自网络，一组数据来自文件，需要合并两组数据一起展示。

6、检测网络连接状态

> PublicSubject

7、重试机制

> retryWhen

## 其他

1、 搜索关键字提醒

> 结合debounce。使用debounce做textSearch<br>使用debounce做textSearch.md

2、 替代EventBus

> RxBus

3、 定时和周期性

> timer，interval

4、 数组和集合遍历

> from

5、 解决嵌套回调（callback hell）问题

> 一个接口的请求依赖另一个API请求返回的数据，用flatMap

6、 做缓存

> concat、first。依次检查memory、disk和network中是否存在数据，任何一步一旦发现数据后面的操作都不执行。

7、Schedulers做应用线程池

8、BehaviorSubject预缓存

9、轮询操作

> interval+take 或 repeatWhen

10、延迟工作

> 结合zip

11、超时

> timeout

12、App登录退出登录响应

> Subject? 用RxBus可能更好

# combineLatest结合RxBinding实现表单校验

1. 操作符combineLatest
2. skip(1)，因为InitialValueObservable订阅时，会发射一个默认的值`""`，用skip过滤掉默认的值，用`skipInitialValue()`也更好
3. combineLatest必须每个Observable都至少发射一次数据项，以后就不需要了，所以skipInitialValue可以不用加，如果需要最开始对按钮进行置灰或者可用不可用操作。

## Observable版本

```java
InitialValueObservable<CharSequence> enterPhoneObservable = RxTextView.textChanges(tv_bind_phone);

InitialValueObservable<CharSequence> enterAlipayAccountObservable = RxTextView.textChanges(et_alipay_account);

Observable
        .combineLatest(enterPhoneObservable, enterAlipayAccountObservable, (phone, aliAccount) -> {
            if (StringUtils.isEmpty(phone) || !ValidRegexUtils.isMobile(phone.toString())) {
                LogUtil.w(TAG, "提现校验，绑定支付宝校验，phone为空或格式不对：" + phone + "，aliAccount：" + aliAccount);
                return false;
            }

            if (StringUtils.isEmpty(aliAccount)) {
                LogUtil.w(TAG, "提现校验，绑定支付宝校验，phone：" + phone + "，aliAccount格式不对：" + aliAccount);
                return false;
            }
            int maxLength = 11;
            if (aliAccount.length() > maxLength) {
                CharSequence mobile = aliAccount.subSequence(0, maxLength);
                LogUtil.w(TAG, "提现校验，绑定支付宝校验，aliAccount超过11位：" + aliAccount + "，截断：" + mobile);
                et_alipay_account.setText(mobile);
                et_alipay_account.setSelection(et_alipay_account.getText().length());
            }

            if (!ValidRegexUtils.isMobile(aliAccount.toString())) {
                LogUtil.w(TAG, "绑定手机校验，绑定的phone：" + phone + "，aliAccount：" + aliAccount);
                return false;
            }

            if (!StringUtils.isEquals(phone.toString(), aliAccount.toString())) {
                return false;
            }
            return true;
        })
        .doOnDispose(() -> LogUtil.i(TAG, "提现校验，绑定支付宝校验，dispose"))
        .as(bindLifecycle())
        .subscribe(check -> ViewUtils.setEnable(btn_bind_go, check));
```

## Flowable版本

```java
_emailChangeObservable =
    RxTextView.textChanges(_email).skip(1).toFlowable(BackpressureStrategy.LATEST);
_passwordChangeObservable =
    RxTextView.textChanges(_password).skip(1).toFlowable(BackpressureStrategy.LATEST);
_numberChangeObservable =
    RxTextView.textChanges(_number).skip(1).toFlowable(BackpressureStrategy.LATEST);
    
private void _combineLatestEvents() {

_disposableObserver =
    new DisposableSubscriber<Boolean>() {
      @Override
      public void onNext(Boolean formValid) {
        if (formValid) {
          _btnValidIndicator.setBackgroundColor(
              ContextCompat.getColor(getContext(), R.color.blue));
        } else {
          _btnValidIndicator.setBackgroundColor(
              ContextCompat.getColor(getContext(), R.color.gray));
        }
      }

      @Override
      public void onError(Throwable e) {
        Timber.e(e, "there was an error");
      }

      @Override
      public void onComplete() {
        Timber.d("completed");
      }
    };

Flowable.combineLatest(
        _emailChangeObservable,
        _passwordChangeObservable,
        _numberChangeObservable,
        (newEmail, newPassword, newNumber) -> {
          boolean emailValid = !isEmpty(newEmail) && EMAIL_ADDRESS.matcher(newEmail).matches();
          if (!emailValid) {
            _email.setError("Invalid Email!");
          }

          boolean passValid = !isEmpty(newPassword) && newPassword.length() > 8;
          if (!passValid) {
            _password.setError("Invalid Password!");
          }

          boolean numValid = !isEmpty(newNumber);
          if (numValid) {
            int num = Integer.parseInt(newNumber.toString());
            numValid = num > 0 && num <= 100;
          }
          if (!numValid) {
            _number.setError("Invalid Number!");
          }

          return emailValid && passValid && numValid;
        })
    .subscribe(_disposableObserver);
}
```

# 使用debounce做textSearch

debounce：当N个结点发生的时间太靠近（即发生的时间差小于设定的值T），debounce就会自动过滤掉前N-1个结点。

比如在做百度地址联想的时候，可以使用debounce减少频繁的网络请求。避免每输入（删除）一个字就做一次联想<br>结合RxBinding，在输入框变化时，没个2S做一次联网请求联想操作，可以避免每次输入都联网请求。<br>debounce()+RxBinding做搜索时间过滤

```java

RxTextView.textChangeEvents(et_enter)
        .debounce(2000, TimeUnit.MILLISECONDS)
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(new Observer<TextViewTextChangeEvent>() {
            @Override
            public void onError(Throwable e) {
                Log.d(TAG, "Error");
            }
            @Override
            public void onComplete() {
                Log.d(TAG, "onComplete");
            }
            @Override
            public void onSubscribe(Disposable d) {
            }
            @Override
            public void onNext(TextViewTextChangeEvent onTextChangeEvent) {
                Log.d(TAG, format("开始联网搜索Searching for %s", onTextChangeEvent.text().toString()));
            }
        });
```

可参考：<br><https://github.com/kaushikgopal/RxJava-Android-Samples#3-instantauto-searching-text-listeners-using-subjects--debounce>

# buffer 一段时间内的平均值

## buffer结合RxBinding统计2秒内点击次数

- `Observable<List> buffer(long timespan, TimeUnit unit)`<br>收集unit时间内的item并发射

```java
RxView.clicks(mButton18)
        .buffer(2, TimeUnit.SECONDS)
        .observeOn(AndroidSchedulers.mainThread())
        .subscribeWith(new DisposableObserver<List<Object>>() {
            @Override
            public void onNext(List<Object> objects) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < objects.size(); i++) {
                    sb.append(LogUtil.buildLogMsg("buffer", "点击了_" + i + "次"));
                }
                Log.e(TAG, sb.toString());
            }
            @Override
            public void onError(Throwable e) {

            }
            @Override
            public void onComplete() {
            }
        });
```

结果：

```
【buffer】点击了_0次，线程：main，日期：2018-11-07 11:16:07
【buffer】点击了_1次，线程：main，日期：2018-11-07 11:16:07
【buffer】点击了_2次，线程：main，日期：2018-11-07 11:16:07
【buffer】点击了_3次，线程：main，日期：2018-11-07 11:16:07
```

可参考：<br><https://github.com/kaushikgopal/RxJava-Android-Samples#2-accumulate-calls-using-buffer>

## buffer计算一段时间内数据的平均值

### 应用场景

1. 统计一段时间内的平均温度
2. 糗百聊天室中，监听自己说话的音量，平均1秒说话音量大于一个值A，那么降低背景音乐的音量；当1秒内说话音量小于A时，恢复背景音乐的音量

### 糗百聊天室单位时间内背景音乐降低实现

```kotlin
class VoiceVolumeDetecter private constructor() {

    companion object {
        const val TAG = VoiceChatRoomActivity.TAG
        const val BUFFER_TIMESPAN: Long = 1_000
        const val BG_VOLOLE_BIAS: Float = 0.5F
        const val YOUME_VOLUME_CALLBACK_LEVEL_LOW: Int = YoumeVoiceManager.YOUME_VOLUME_CALLBACK_LEVEL_LOW

        @JvmStatic
        fun newInstance(): VoiceVolumeDetecter {
            return VoiceVolumeDetecter()
        }
    }

    private val mPublishSubject: PublishSubject<Int> = PublishSubject.create()
    private val mCompositeDisposable: CompositeDisposable = CompositeDisposable()

    /**
     * callback: true需要降低背景音乐，false不需要
     */
    fun register(callback: Callback<Boolean>?): VoiceVolumeDetecter {
        val disposableObserver = object : DisposableObserver<List<Int>>() {
            override fun onComplete() {
            }

            override fun onNext(volumes: List<Int>) {
                var avgVolume = 0
                if (volumes.isNotEmpty()) {
                    for (d in volumes) {
                        avgVolume += d
                    }
                    avgVolume /= volumes.size
                }
                val savedBgMusicVolume = SPUtils.getInstance().getInt(BgMusicBottomDialog.KEY_BG_VOLUME)
                if (avgVolume >= YOUME_VOLUME_CALLBACK_LEVEL_LOW) {
                    val bgMusicVolume = (savedBgMusicVolume * BG_VOLOLE_BIAS)
                        .roundToInt()
                    YoumeVoiceManager.setBackgroundMusicVolume(bgMusicVolume)
                    callback?.onSuccess(true)
                    LogUtils.w(
                        TAG, "2秒内说话音量$avgVolume 不小于$YOUME_VOLUME_CALLBACK_LEVEL_LOW" +
                                "，当前背景音乐音量：${YoumeVoiceManager.getBackgroundMusicVolume()}，" +
                                "更新youme背景音乐到当前50%：$bgMusicVolume"
                    )
                } else {
                    callback?.onSuccess(false)
                    YoumeVoiceManager.setBackgroundMusicVolume(savedBgMusicVolume)
                    LogUtils.e(
                        TAG, "2秒内说话音量$avgVolume 小于$YOUME_VOLUME_CALLBACK_LEVEL_LOW" +
                                "，恢复youme背景音乐到用户设置值：$savedBgMusicVolume"
                    )
                }
            }

            override fun onError(e: Throwable) {
                callback?.onFailed(Callback.commonErrorCode, "更新平均说话音量失败了")
            }
        }
        mPublishSubject.buffer(BUFFER_TIMESPAN, TimeUnit.MILLISECONDS)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(disposableObserver)
        mCompositeDisposable.add(disposableObserver)
        return this
    }

    fun update(volume: Int) {
        getSubject().onNext(volume)
    }

    private fun getSubject(): PublishSubject<Int> {
        return mPublishSubject
    }

    fun unregister() {
        if (!mCompositeDisposable.isDisposed) {
            mCompositeDisposable.dispose()
        }
    }
}
```

### 统计一段时间温度变化

```kotlin
class CalcAverageActivity : AppCompatActivity() {

    private val mPublishSubject: PublishSubject<Int>? = PublishSubject.create()
    private var mCompositeDisposable: CompositeDisposable? = null
    private var mSourceHandler: SourceHandler? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(me.hacket.assistant.R.layout.activity_calc_average)
        val disposableObserver = object : DisposableObserver<List<Int>>() {
            override fun onNext(o: List<Int>) {
                var result = 0.0
                if (o.size > 0) {
                    for (d in o) {
                        result += d
                    }
                    result = result / o.size
                }
                LogUtil.d("BufferActivity", "更新平均温度：$result")
                tv_average.setText("过去3秒收到了" + o.size + "个数据， 平均温度为：" + result)
            }

            override fun onError(throwable: Throwable) {

            }

            override fun onComplete() {

            }
        }
        mPublishSubject?.buffer(3000, TimeUnit.MILLISECONDS)
                ?.observeOn(AndroidSchedulers.mainThread())
                ?.subscribe(disposableObserver)
        mCompositeDisposable = CompositeDisposable()
        mCompositeDisposable?.add(disposableObserver)

        // 开始测量温度。
        mSourceHandler = SourceHandler()
        mSourceHandler?.sendEmptyMessage(0)
    }

    fun updateTemperature(temperature: Int) {
        LogUtil.d("BufferActivity", "温度测量结果：$temperature")
        mPublishSubject?.onNext(temperature)
    }

    private inner class SourceHandler : Handler() {

        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)
            val temperature = (Math.random() * 25 + 5).toInt()
            updateTemperature(temperature)
            //循环地发送。
            sendEmptyMessageDelayed(0, 250 + (250 * Math.random()).toLong())
        }
    }
    
}
```

### Ref

- RxJava2 实战知识梳理(2) - 计算一段时间内数据的平均值<br><https://www.jianshu.com/p/5dd01b14c02a>

# 检测网络连接状态

PublishProcessor<br>distinctUntilChanged()

```java
public class NetworkDetectorAct extends BaseActivity {
    @BindView(R.id.tv_network)
    TextView tv_network;
    private BroadcastReceiver broadcastReceiver;
    private PublishProcessor<Boolean> publishProcessor;
    private Disposable disposable;

    @Override
    public int getLayoutResId() {
        return R.layout.activity_network_detector;
    }

    @Override
    public void onStart() {
        super.onStart();

        publishProcessor = PublishProcessor.create();

        disposable = publishProcessor
                        .startWith(getConnectivityStatus(this))
                        .distinctUntilChanged()
                        .observeOn(AndroidSchedulers.mainThread())
                        .subscribe(
                                online -> {
                                    if (online) {
                                        String msg = LogUtil.buildLogMsg("网络监测", "You are online\n");
                                        LogUtil.i(msg);
                                        tv_network.append(msg);
                                    } else {
                                        String msg = LogUtil.buildLogMsg("网络监测", "You are offline\n");
                                        LogUtil.e(msg);
                                        tv_network.append(msg);
                                    }
                                });

        listenToNetworkConnectivity();
    }

    @Override
    public void onStop() {
        super.onStop();
        disposable.dispose();
        unregisterReceiver(broadcastReceiver);
    }

    private void listenToNetworkConnectivity() {

        broadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                publishProcessor.onNext(getConnectivityStatus(context));
            }
        };

        final IntentFilter intentFilter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(broadcastReceiver, intentFilter);
    }

    private boolean getConnectivityStatus(Context context) {
        ConnectivityManager cm =
                (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = cm.getActiveNetworkInfo();
        return networkInfo != null && networkInfo.isConnected();
    }
}
```

# zip和merge

## zip

### 使用zip合并多个接口并行

合并接口（结合多个接口更新ui界面）

> 用zip来实现，多个Observable发射多个数据，切换线程保证发射一个，zip一个，subscribe一个。

zip会将多个数据源合并为一个

### 推迟做一些工作

zip将多个Observable相应位置上的数据(用item更贴切)按指定的函数合成一个结果,然后重新形成一个新的Observable。<br>比如Observable1发射了第一个数据,那么必须等到Observable2发射了第一个数据,才能按指定的函数生成新的Observable的第一个数据.<br>利用这个特性,我们可以做一些推迟的工作。

```java

Observable.zip(
    Observable.timer(5, TimeUnit.SECONDS)
            .doOnNext(it -> System.out.println("timer：" + it)),
    Observable.just(doSomething()),
    (x, y) -> y)
    .subscribe(new Consumer<Object>() {
        @Override
        public void accept(Object o) throws Exception {
            sb.append("zip : accept : " + o + "\n");
            Log.e(TAG, "zip : accept : " + o + "\n");
            mTvOperatorResult1.setText(sb.toString());
        }
    });
private Object doSomething() {
    sb.append("zip延迟发射数据");
    Log.e(TAG, "zip延迟发射数据");
    return "zip发射数据";
}
```

## merge

见缓存的`merge`

# 缓存

## 场景1：先缓存数据源，再网络数据源 --concat

先内存缓存，然后磁盘缓存，最后网络缓存，最后合并起来<br>这种用concat操作符就可以

- concat最大缺点<br>我们白白浪费了前面读取缓存的这段时间，能不能同时发起读取缓存和网络的请求，而不是等到读取缓存完毕之后，才去请求网络呢（一个个串行执行，后面的需要等待前面的完成）

```kotlin
Observable.concat(CacheDemoUtils.getMemory(), CacheDemoUtils.getDisk(), CacheDemoUtils.getNetwork())
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribeWith(object : CacheObserver() {
        override fun onStart() {
            super.onStart()
            LogUtil.logd("rxjava2", "onStart", "开始了")
        }

        override fun onNext(t: MutableList<CacheDemoUtils.User>) {
            LogUtil.logi("rxjava2", "getDatas", "获取到数据：" + t.size + "，来源：" + t[0].from)
            bindDatas(t)
        }

        override fun onError(e: Throwable) {
            super.onError(e)
            LogUtil.logw("rxjava2", "onError", e.message)
        }

        override fun onComplete() {
            super.onComplete()
            LogUtil.logw("rxjava2", "onComplete", "onComplete")
        }
    })
```

## 场景2：同时取缓存数据源、网络数据源 --concatEager

缓存数据源和网络数据源同时取数据，如果网络源取数据要快于缓存数据源，那么先缓存起来等缓存数据源数据取到，然后再发射网络源数据

- concatEager缺点<br>在某些异常情况下，如果读取缓存的时间要大于网络请求的时间，那么就会导致出现“网络请求的结果”等待“读取缓存”这一过程完成后才能传递给下游，白白浪费了一段时间

> 和concat相比，concatEager可以同时请求，后面快的Observable可以缓存起来等待前面的Observable，然后再一起合并

- 缺点<br>后面快的Observable需要等待前面的Observable，浪费了等待时间

```java
Observable.concatArrayEager(CacheDemoUtils.getMemory().subscribeOn(Schedulers.io()), CacheDemoUtils.getDisk().subscribeOn(Schedulers.io()), CacheDemoUtils.getNetwork().subscribeOn(Schedulers.io()))
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribeWith(object : CacheObserver() {
            override fun onStart() {
                super.onStart()
                LogUtil.logd("rxjava2", "onStart", "开始了")
            }

            override fun onNext(t: MutableList<CacheDemoUtils.User>) {
                LogUtil.logi("rxjava2", "getDatas", "获取到数据：" + t.size + "，来源：" + t[0].from)
                bindDatas(t)
            }

            override fun onError(e: Throwable) {
                super.onError(e)
                LogUtil.logw("rxjava2", "onError", e.message)
            }

            override fun onComplete() {
                super.onComplete()
                LogUtil.logw("rxjava2", "onComplete", "onComplete")
            }
        })
```

结果：disk和network比memory快，需要等待memory完成并发射数据后，再发射他们的数据

```
D/hacket.rxjava2: 【onStart】开始了，线程：main，日期：2018-11-09 16:02:10
I/hacket.rxjava2: 【getMemory】开始从内存获取数据，需要耗时：20000，线程：RxCachedThreadScheduler-6，日期：2018-11-09 16:02:10
I/hacket.rxjava2: 【getDisk】开始从磁盘获取数据，需要耗时：5000，线程：RxCachedThreadScheduler-7，日期：2018-11-09 16:02:10
I/hacket.rxjava2: 【getNetwork】开始从网络获取数据，需要耗时：10000，线程：RxCachedThreadScheduler-8，日期：2018-11-09 16:02:10
I/hacket.rxjava2: 【getDatas】获取到数据：20，来源：memory，线程：main，日期：2018-11-09 16:02:30
I/hacket.rxjava2: 【getDatas】获取到数据：15，来源：disk，线程：main，日期：2018-11-09 16:02:30
I/hacket.rxjava2: 【getDatas】获取到数据：30，来源：network，线程：main，日期：2018-11-09 16:02:30
W/hacket.rxjava2: 【onComplete】onComplete，线程：main，日期：2018-11-09 16:02:30
```

## 场景3：依次从内存缓存、磁盘缓存、网络缓存中取数据，哪里取到数据了，就终止 -- concat+first

### concat+first

- concat 将所有的Observable发射的数据合并起来
- first 取第一个数据
- 首先，这个只适合一个Item的时候。如果我们有多个Item从这个Observable中流出。 fisrt()操作符只会取第一个。

concat+first，也就是说依次检查memory、disk和network是否存在数据（需要有onNext，onComplete算没数据），一旦其中一个有数据，后续不执行<br>依次检查memory、disk和network中是否存在数据，任何一步一旦发现数据后面的操作都不执行。

```java
public void onViewClicked() {
    Observable<String> memory = Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> emitter) throws Exception {
            emitter.onNext("从内存获取缓存数据");
        }
    });
    Observable<String> disk = Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> emitter) throws Exception {
            String cachePref = RxPreferencesUtils.newInstance(getApplicationContext())
                    .rxSharedPreferences().getString("cache").get();
            if (!TextUtils.isEmpty(cachePref)) {
                emitter.onNext(cachePref);
            } else {
                emitter.onComplete();
            }
        }
    });
    Observable<String> network = Observable.just("network");
    //依次检查memory、disk、network
    Observable.concat(memory, disk, network)
            .first("默认初始化数据")
            .subscribeOn(Schedulers.newThread())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(s -> {
                String s1 = LogUtil.buildLogMsg("concat-subscribe", "--------------subscribe: " + s);
                LogUtil.logi(TAG, "concat-subscribe", "--------------subscribe: " + s);
                mTextView12.setText(s1);
            });
}
```

需要注意的是如果memorySource, diskSource, networkSource返回的都null，那么会报一个异常：<br>`java.util.NoSuchElementException: Sequence contains no elements`<br>用rxjava2.x试，好像没这个问题。

### concat+takeFirst

用takeFirst操作，即使都没有数据，也不会报异常

```java
Observable.concat(memorySource, diskSource, networkSource)
    // first()-> if no data from observables will cause exception :
    // java.util.NoSuchElementException: Sequence contains no elements
    // takeFirst -> no exception
    .takeFirst(new Func1<String, Boolean>() {
        @Override
        public Boolean call(String s) {
            return s != null;
        }
    })
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Action1<String>() {
        @Override
        public void call(String s) {
            printLog(tvLogs, "Getting data from ", s);
        }
    }, new Action1<Throwable>() {
        @Override
        public void call(Throwable throwable) {
            throwable.printStackTrace();
            printLog(tvLogs, "Error: ", throwable.getMessage());
        }
    });
```

## 场景4：从内存缓存、磁盘缓存、网络获取数据，哪个先来就先发射数据 --merge

它和concatEager一样，会让多个Observable同时开始发射数据，但是它不需要Observable之间的互相等待，而是直接发送给下游。

```java
Observable.merge(CacheDemoUtils.getMemory().subscribeOn(Schedulers.io()), CacheDemoUtils.getDisk().subscribeOn(Schedulers.io()), CacheDemoUtils.getNetwork().subscribeOn(Schedulers.io()))
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribeWith(object : CacheObserver() {
            override fun onStart() {
                super.onStart()
                LogUtil.logd("rxjava2", "onStart", "开始了")
            }

            override fun onNext(t: MutableList<CacheDemoUtils.User>) {
                LogUtil.logi("rxjava2", "getDatas", "获取到数据：" + t.size + "，来源：" + t[0].from)
                bindDatas(t)
            }

            override fun onError(e: Throwable) {
                super.onError(e)
                LogUtil.logw("rxjava2", "onError", e.message)
            }

            override fun onComplete() {
                super.onComplete()
                LogUtil.logw("rxjava2", "onComplete", "onComplete")
            }
        })
```

结果：哪个先快的Observable，先发射数据

```
D/hacket.rxjava2: 【onStart】开始了，线程：main，日期：2018-11-09 16:04:43
I/hacket.rxjava2: 【getMemory】开始从内存获取数据，需要耗时：20000，线程：RxCachedThreadScheduler-10，日期：2018-11-09 16:04:43
I/hacket.rxjava2: 【getDisk】开始从磁盘获取数据，需要耗时：5000，线程：RxCachedThreadScheduler-11，日期：2018-11-09 16:04:43
I/hacket.rxjava2: 【getNetwork】开始从网络获取数据，需要耗时：10000，线程：RxCachedThreadScheduler-12，日期：2018-11-09 16:04:43
I/hacket.rxjava2: 【getDatas】获取到数据：15，来源：disk，线程：main，日期：2018-11-09 16:04:48
I/hacket.rxjava2: 【getDatas】获取到数据：30，来源：network，线程：main，日期：2018-11-09 16:04:53
I/hacket.rxjava2: 【getDatas】获取到数据：20，来源：memory，线程：main，日期：2018-11-09 16:05:03
W/hacket.rxjava2: 【onComplete】onComplete，线程：main，日期：2018-11-09 16:05:03
```

## 场景5：同时发起读取缓存、访问网络的请求，如果缓存的数据先回来，那么就先展示缓存的数据，而如果网络的数据先回来，那么就不再展示缓存的数据。 publish+merge+takeUntil

同时发起读取缓存、访问网络的请求，如果缓存的数据先回来，那么就先展示缓存的数据，而如果网络的数据先回来，那么就不再展示缓存的数据<br>publish + merge + takeUntil

- 使用publish目的：<br>调用merge和takeUntil会发生两次订阅，这时候就需要使用publish操作符，它接收一个Function函数，该函数返回一个Observable，该Observable是对原Observable，也就是上面网络源的Observable转换之后的结果，该Observable可以被takeUntil和merge操作符所共享，从而实现只订阅一次的效果

```java
CacheDemoUtils.getNetwork()
        .publish(network -> {
            return Observable.merge(network, CacheDemoUtils.getDisk().subscribeOn(Schedulers.io()).takeUntil(network),
                    CacheDemoUtils.getMemory().subscribeOn(Schedulers.io()).takeUntil(network));
        })
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribeWith(new CacheObserver() {
            @Override
            public void onNext(List<CacheDemoUtils.User> users) {
                LogUtil.logi("rxjava2", "getDatas", "获取到数据：" + users.size() + "，来源：" + users.get(0).from);
                bindDatas(users);
            }

            @Override
            public void onError(Throwable e) {
                super.onError(e);
                LogUtil.logw("rxjava2", "onError", e.getMessage());
            }

            @Override
            public void onComplete() {
                super.onComplete();
                LogUtil.logw("rxjava2", "onComplete", "onComplete");
            }
        });
```

效果：

```
I/hacket.rxjava2: 【getMemory】开始从内存获取数据，需要耗时：20000，线程：RxCachedThreadScheduler-11，日期：2018-11-09 17:40:54
I/hacket.rxjava2: 【getNetwork】开始从网络获取数据，需要耗时：10000，线程：RxCachedThreadScheduler-9，日期：2018-11-09 17:40:54
I/hacket.rxjava2: 【getDisk】开始从磁盘获取数据，需要耗时：5000，线程：RxCachedThreadScheduler-10，日期：2018-11-09 17:40:54
I/hacket.rxjava2: 【getDatas】获取到数据：15，来源：disk，线程：main，日期：2018-11-09 17:40:59
I/hacket.rxjava2: 【getDatas】获取到数据：30，来源：network，线程：main，日期：2018-11-09 17:41:04
W/hacket.rxjava2: 【onComplete】onComplete，线程：main，日期：2018-11-09 17:41:04
```

**问题：** 如果网络请求先返回时发生了错误（例如没有网络等）导致发送了onError事件，从而使得缓存的Observable也无法发送事件，最后界面显示空白。<br>针对这个问题，我们需要对网络的Observable进行优化，让其不将onError事件传递给下游。其中一种解决方式是通过使用onErrorResume操作符，它可以接收一个Func函数，其形参为网络发送的错误，而在上游发生错误时会回调该函数。我们可以根据错误的类型来返回一个新的Observable，让订阅者镜像到这个新的Observable，并且忽略onError事件，从而避免onError事件导致整个订阅关系的结束。<br>这里为了避免订阅者在镜像到新的Observable时会收到额外的时间，我们返回一个Observable.never()，它表示一个永远不发送事件的上游。

```java
public static Observable<List<User>> getNetwork() {
    return Observable
            .create(new ObservableOnSubscribe<List<User>>() {
                @Override
                public void subscribe(ObservableEmitter<List<User>> emitter) throws Exception {
                    long t = 10000;
                    LogUtil.logi("rxjava2", "getNetwork", "开始从网络获取数据，需要耗时：" + t);

                    for (int i = 0; i < 10; i++) {
                        SystemClock.sleep(t / 10);
                        if (i == 3) {
                            String s = null;
                            s.toUpperCase();
                        }
                    }
//                emitter.onComplete();

                    List<User> users = new ArrayList<>();
                    for (int i = 50; i < 80; i++) {
                        users.add(new User("eason_" + i, "male", 0 + i, "network"));
                    }
                    if (!emitter.isDisposed()) {
                        emitter.onNext(users);
                    }
                    emitter.onComplete();
                }
            })
            .onErrorResumeNext(throwable -> {
                return Observable.never();
            });
}
```

## 使用switchIfEmpty操作符实现Android检查本地缓存逻辑判断

```java
//从本地数据获取文章列表
getArticlesObservable(pageIndex, pageSize, categoryId)
    //本地不存在,请求api
    .switchIfEmpty(articleApi.getArticlesByCategoryId(pageIndex + "", pageSize + "", categoryId + "")
    .compose(this.<RespArticlePaginate>handlerResult())
    .flatMap(new Func1<RespArticlePaginate, Observable<RespArticlePaginate>>() {
        @Override
        public Observable<RespArticlePaginate> call(RespArticlePaginate respArticlePaginate) {
            if (respArticlePaginate != null && respArticlePaginate.getList() != null) {
                try {
                   articleDao.insertOrReplaceInTx(respArticlePaginate.getList());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return Observable.just(respArticlePaginate);
        }
    
    }))
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(createSubscriber(ID_ARTICLE_LIST)))
```

# RxJava的Scheduler做线程池用

```java
public class SchedulerUtils {
    /**
     * io操作较大时选择这个
     */
    @NonNull
    public static Disposable runInIOThread(Runnable run) {
        return Schedulers.io().scheduleDirect(run);
    }

    public static Disposable runInIOThreadDelay(Runnable run, long milliseconds) {
        return Schedulers.io().scheduleDirect(run, milliseconds, TimeUnit.MILLISECONDS);
    }

    /**
     * 计算量较大的时候，选择这个
     */
    public static Disposable runInComputeThread(Runnable run) {
        return Schedulers.io().scheduleDirect(run);
    }

    public static Disposable runInComputeThreadDelay(Runnable run, long milliseconds) {
        return Schedulers.computation().scheduleDirect(run, milliseconds, TimeUnit.MILLISECONDS);
    }

    /**
     * 仅在一个子线程中处理，选择这个
     */
    public static Disposable runInNewThread(Runnable run) {
        return Schedulers.newThread().scheduleDirect(run);
    }

    public static Disposable runInNewThreadDelay(Runnable run, long milliseconds) {
        return Schedulers.newThread().scheduleDirect(run, milliseconds, TimeUnit.MILLISECONDS);
    }

    /**
     * 主线程操作选择这个
     */
    public static Disposable runInMain(Runnable run) {
        return AndroidSchedulers.mainThread().scheduleDirect(run);
    }

    public static Disposable runInMainDelay(Runnable run, long milliseconds) {
        return AndroidSchedulers.mainThread().scheduleDirect(run, milliseconds, TimeUnit.MILLISECONDS);
    }

    public static Disposable runInSingle(Runnable run) {
        return Schedulers.single().scheduleDirect(run);
    }

    public static Disposable runInSingleDelay(Runnable run, long milliseconds) {
        return Schedulers.single().scheduleDirect(run, milliseconds, TimeUnit.MILLISECONDS);
    }
}
```

# Subject实现登录注销登录各个页面状态切换

1. 其实就是个观察者而已
2. 利用Relay实现可能更好，避免`UndeliverableException`终止状态
3. 还可以利用Lifecycle自动dispose

- PublishSubject实现的简易版本

```kotlin
class UserCenter private constructor() {

    private lateinit var mUserInfo: UserInfo

    var subject: Subject<UserInfo> = PublishSubject.create()

    fun register(): Subject<UserInfo> {
        return subject
    }

    fun update(userInfo: UserInfo) {
        subject.onNext(userInfo)
    }

    fun loginIn(userInfo: UserInfo) {
        subject.onNext(userInfo)
    }

    fun loginOff() {
        subject.onError(RuntimeException("退出登录了"))
    }

    companion object {
        @JvmStatic
        fun getInstance(): UserCenter {
            return ObjectHolder.instance
        }
    }
    private object ObjectHolder {
        val instance: UserCenter = UserCenter()
    }
}
// 调用
UserCenter.getInstance().register()
    .subscribe(new Observer<UserInfo>() {
        @Override
        public void onSubscribe(Disposable d) {

        }
        @Override
        public void onNext(UserInfo userInfo) {
            ToastUtils.showShort("用户信息更新了：" + userInfo);
        }
        @Override
        public void onError(Throwable e) {
            ToastUtils.showShort("用户退出登录了，记得切换状态");
        }
        @Override
        public void onComplete() {

        }
    });
```

# BehaviorSubject预缓存

```java
public class RxPreLoader<T> {

    // 能够缓存订阅之前的最新数据
    private BehaviorSubject<T> mBehaviorSubject;
    private Disposable preDisposable;
    private Disposable disposable;

    private RxPreLoader(@NonNull Observable<T> preloadObservable) {
        mBehaviorSubject = BehaviorSubject.create();
        preDisposable = preloadObservable
                .subscribe(
                        data -> {
                            if (mBehaviorSubject != null) {
                                publish(data);
                            }
                        },
                        throwable -> {
                            // nothing to do
                            if (mBehaviorSubject != null) {
                                mBehaviorSubject.onError(throwable);
                            }
                        },
                        () -> {
                            if (mBehaviorSubject != null) {
                                mBehaviorSubject.onComplete();
                            }
                        });
    }

    public static <T> RxPreLoader<T> preLoad(@NonNull Observable<T> preloadObservable) {
        return new RxPreLoader<>(preloadObservable);
    }

    /**
     * 发送事件
     */
    private void publish(T data) {
        mBehaviorSubject.onNext(data);
    }

    public Disposable subscribe(Consumer<T> onNext) {
        disposable = mBehaviorSubject.subscribe(onNext);
        return disposable;
    }

    public Disposable subscribe(DisposableObserver<T> observer) {
        disposable = mBehaviorSubject.subscribeWith(observer);
        return disposable;
    }

    public Disposable subscribe(ResourceObserver<T> observer) {
        disposable = mBehaviorSubject.subscribeWith(observer);
        return disposable;
    }

    /**
     * 反订阅
     */
    public void dispose() {
        if (preDisposable != null && !preDisposable.isDisposed()) {
            preDisposable.dispose();
            preDisposable = null;
        }

        if (disposable != null && !disposable.isDisposed()) {
            disposable.dispose();
            disposable = null;
        }

    }

    /**
     * 获取缓存数据的Subject
     */
    public BehaviorSubject<T> getCacheDataSubject() {
        return mBehaviorSubject;
    }

    /**
     * 直接获取最近的一个数据
     */
    @Nullable
    public T getCacheData() {
        return mBehaviorSubject.getValue();
    }

}
```

# 重试

## 重试抛出异常

```java
public class RetryWhen implements Function<Observable<? extends Throwable>, Observable<?>> {

    private final int retryTimes;
    private final int delayMillis;

    /**
     * RetryWhen
     *
     * @param retryTimes  重试次数
     * @param delayMillis 延时，单位ms
     * @return RetryWhen
     */
    public RetryWhen create(int retryTimes, int delayMillis) {
        return new RetryWhen(retryTimes, delayMillis);
    }

    private RetryWhen(int retryTimes, int delayMillis) {
        this.retryTimes = retryTimes;
        this.delayMillis = delayMillis;
    }

    @Override
    public Observable<?> apply(Observable<? extends Throwable> observable) {
        return observable
                .zipWith(Observable.range(1, retryTimes),
                        new BiFunction<Throwable, Integer, Pair<Integer, Throwable>>() {
                            @Override
                            public Pair<Integer, Throwable> apply(Throwable throwable, Integer integer) throws Exception {
                                return Pair.create(integer, throwable);
                            }
                        })
                .flatMap(new Function<Pair<Integer, Throwable>, Observable<?>>() {

                    @Override
                    public Observable<?> apply(Pair<Integer, Throwable> pair) {
                        if (pair.first < retryTimes) {
                            return Observable.timer(delayMillis, TimeUnit.MILLISECONDS);
                        } else {
                            return Observable.error(pair.second);
                        }
                    }
                });
    }

    /**
     * Container to ease passing around a tuple of two objects. This object provides a sensible
     * implementation of equals(), returning true if equals() is true on each of the contained
     * objects.
     */
    private static final class Pair<F, S> {
        public final F first;
        public final S second;

        /**
         * Constructor for a Pair.
         *
         * @param first  the first object in the Pair
         * @param second the second object in the pair
         */
        public Pair(F first, S second) {
            this.first = first;
            this.second = second;
        }

        /**
         * Checks the two objects for equality by delegating to their respective {@link
         * Object#equals(Object)} methods.
         *
         * @param o the {@link Pair} to which this one is to be checked for equality
         * @return true if the underlying objects of the Pair are both considered equal
         */
        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Pair)) {
                return false;
            }
            Pair<?, ?> p = (Pair<?, ?>) o;
            return Objects.equals(p.first, first) && Objects.equals(p.second, second);
        }

        /**
         * Compute a hash code using the hash codes of the underlying objects
         *
         * @return a hashcode of the Pair
         */
        @Override
        public int hashCode() {
            return (first == null ? 0 : first.hashCode()) ^ (second == null ? 0 : second.hashCode());
        }

        @Override
        public String toString() {
            return "Pair{" + String.valueOf(first) + " " + String.valueOf(second) + "}";
        }

        /**
         * Convenience method for creating an appropriately typed pair.
         *
         * @param a the first object in the Pair
         * @param b the second object in the pair
         * @return a Pair that is templatized with the types of a and b
         */
        public static <A, B> Pair<A, B> create(A a, B b) {
            return new Pair<A, B>(a, b);
        }
    }
}
```

案例:

```java
private static void retry2() {
    new Test().sourceMayFailThrow()
            .retryWhen(RetryWhen.create(3, 500))
//                .subscribeOn(Schedulers.io())
//                .observeOn(Schedulers.io())
            .subscribe(new Consumer<Integer>() {
                @Override
                public void accept(Integer integer) {
                    System.out.println("testRetry complete: " + integer);
                }
            }, new Consumer<Throwable>() {
                @Override
                public void accept(Throwable throwable) {
                    System.out.println("testRetry error: " + throwable.toString());
                }
            });
}
private Observable<Integer> sourceMayFailThrow() {
    return Observable.just(new Random())
            .map(new Function<Random, Integer>() {
                @Override
                public Integer apply(Random random) {
                    return random.nextInt(100);
                }
            })
            .doOnNext(new Consumer<Integer>() {
                @Override
                public void accept(Integer integer) {
                    System.out.println("integer:" + integer + "，executeTimes: " + executeTimes++);
                    if (integer > 50) {
                        throw new RuntimeException();
                    }
                }
            });
}
```

## 重试不抛出异常

```java
public abstract class RetryWrapper<T> {

    private Observable<T> source;
    private int retryCount = 0;

    public RetryWrapper(Observable<T> source) {
        this.source = source;
    }

    /**
     * 重试
     *
     * @param retryTimes 最大重试次数
     * @return Observable<T>
     */
    public Observable<T> retry(final int retryTimes) {
        retryCount = 0;
        return source
                .doOnNext(new Consumer<T>() {
                    @Override
                    public void accept(T t) throws Exception {
                        if (checkResult(t)) {
                            return;
                        }
                        retryCount++;
                        if (retryCount < retryTimes) {
                            throw new ResultFailException();
                        }
                    }
                })
                .retryWhen(new Function<Observable<Throwable>, ObservableSource<Integer>>() {
                    @Override
                    public ObservableSource<Integer> apply(Observable<Throwable> throwableObservable) throws Exception {
                        return throwableObservable.zipWith(
                                Observable.range(1, retryTimes), new BiFunction<Throwable, Integer, Integer>() {
                                    @Override
                                    public Integer apply(Throwable throwable, Integer integer) throws Exception {
                                        return integer;
                                    }
                                });
                    }
                });
    }

    /**
     * 校验结果，校验不通过需要重试
     *
     * @param t t
     * @return true校验通过；false校验不通过
     */
    abstract public boolean checkResult(T t);

    private static class ResultFailException extends RuntimeException {
    }
}

public class BooleanRetryWrapper extends RetryWrapper<Boolean> {

    public BooleanRetryWrapper(Observable<Boolean> source) {
        super(source);
    }

    @Override
    public boolean checkResult(Boolean aBoolean) {
        return aBoolean;
    }
}
```

### 案例1

小于50的数值，需要重试3次

```java

public class Test {

    private int executeTimes;

    public static void main(String[] args) throws InterruptedException {
        System.out.println("");

        Observable<Boolean> sourceMayFail = new Test().sourceMayFail();

        new BooleanRetryWrapper(sourceMayFail)
                .retry(3)
                .subscribeOn(Schedulers.io())
                .observeOn(Schedulers.io())
                .retry()
                .subscribe(
                        new Consumer<Boolean>() {
                            @Override
                            public void accept(Boolean aBoolean) {
                                System.out.println("testRetry complete: " + aBoolean);
                            }
                        }, new Consumer<Throwable>() {
                            @Override
                            public void accept(Throwable throwable) {
                                System.out.println("testRetry error: " + throwable.toString());
                            }
                        });


        Thread.sleep(50000);
    }

    private Observable<Boolean> sourceMayFail() {
        return Observable.just(new Random())
                .map(new Function<Random, Integer>() {
                    @Override
                    public Integer apply(Random random) {
                        return random.nextInt(100);
                    }
                })
                .map(new Function<Integer, Boolean>() {
                    @Override
                    public Boolean apply(Integer integer) {
                        System.out.println("integer：" + integer + "，executeTimes: " + executeTimes++);
                        return integer < 20;
                    }
                });
    }
```

结果：

```
// 大于20的需要重试，最多3次
integer：94，executeTimes: 0
integer：48，executeTimes: 1
integer：58，executeTimes: 2
testRetry complete: false

// 小于20的不需要重试，校验通过
integer：12，executeTimes: 0
testRetry complete: true
```

### 案例2

字符串长度大于5需要重试

```java
public final class StringRetryWrapper extends RetryWrapper<String> {
    private static final int len = 5;
    public StringRetryWrapper(Observable<String> source) {
        super(source);
    }
    @Override
    public boolean checkResult(String s) {
        // 字符串长度大于5需要重试
        return s.length() <= 5;
    }
}
```

## 失败重试机制

- retryWhen<br>只要Function的Observable不是发射Error，那么就会进行retry。

```kotlin
fun startExecutingWithExponentialBackoffDelay() {

    val disposableSubscriber = object : DisposableSubscriber<Any>() {
        override fun onNext(aVoid: Any) {
            LogUtil.logd(TAG, "startExecutingWithExponentialBackoffDelay", "on Next")
            tv_threading_log.append("onNext\n")
        }

        override fun onComplete() {
            LogUtil.logd(TAG, "startExecutingWithExponentialBackoffDelay", "on Completed")
            tv_threading_log.append("onComplete\n")
        }

        override fun onError(e: Throwable) {
            e.printStackTrace()
            LogUtil.logw(TAG, "startExecutingWithExponentialBackoffDelay", "Error: " + e.message)
            tv_threading_log.append("onError\n")
        }
    }

    Flowable.error<Any>(RuntimeException("testing retryWhen error！"))
            .retryWhen(RetryWithDelay(5, 1000))
            .doOnSubscribe { subscription ->
                LogUtil.logi(TAG, "Retry", "尝试5次机会，每次间隔1秒")
                tv_threading_log.append("[Retry] Attempting the impossible 5 times in intervals of 1s\n")
            }
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(disposableSubscriber)
}

inner class RetryWithDelay(private val _maxRetries: Int, private val _retryDelayMillis: Int) : Function<Flowable<out Throwable>, Publisher<*>> {
    private var _retryCount: Int = 0

    override fun apply(inputObservable: Flowable<out Throwable>): Publisher<*> {
        return inputObservable.flatMap { throwable ->
            if (++_retryCount < _maxRetries) {
                LogUtil.logi(TAG, "RetryWithDelay", String.format("Retrying in %d次 ，总次数%d，%d ms", _retryCount, _maxRetries, _retryCount * _retryDelayMillis))
                SchedulerUtils.runInMain {
                    tv_threading_log.append(String.format("[RetryWithDelay] Retrying in %d次 ，总次数%d，%d ms\n", _retryCount, _maxRetries, _retryCount * _retryDelayMillis))
                }

                return@flatMap Flowable.timer((_retryCount * _retryDelayMillis).toLong(), TimeUnit.MILLISECONDS)
            } else {
                LogUtil.logw(TAG, "RetryWithDelay", "Argh! 我放弃了")
                SchedulerUtils.runInMain {
                    tv_threading_log.append("[RetryWithDelay] Argh!我放弃了\n")
                }

                return@flatMap Flowable.error<Any>(throwable)
            }
        }
    }
}
```

效果：

```
I/hacket.rxjava2: 【Retry】尝试5次机会，每次间隔1秒，线程：main，日期：2018-11-12 19:08:47
I/hacket.rxjava2: 【RetryWithDelay】Retrying in 1次 ，总次数5，1000 ms，线程：main，日期：2018-11-12 19:08:47
I/hacket.rxjava2: 【RetryWithDelay】Retrying in 2次 ，总次数5，2000 ms，线程：RxComputationThreadPool-2，日期：2018-11-12 19:08:48
I/hacket.rxjava2: 【RetryWithDelay】Retrying in 3次 ，总次数5，3000 ms，线程：RxComputationThreadPool-3，日期：2018-11-12 19:08:50
I/hacket.rxjava2: 【RetryWithDelay】Retrying in 4次 ，总次数5，4000 ms，线程：RxComputationThreadPool-4，日期：2018-11-12 19:08:53
W/hacket.rxjava2: 【RetryWithDelay】Argh! 我放弃了，线程：RxComputationThreadPool-5，日期：2018-11-12 19:08:57
W/hacket.rxjava2: 【startExecutingWithExponentialBackoffDelay】Error: testing retryWhen error！，线程：main，日期：2018-11-12 19:08:57
```

## 失败重试，token过期续签

```java
.retryWhen(new Function<Observable<Throwable>, ObservableSource<?>>() {
    private int mRetryCount;

    @Override
    public ObservableSource<?> apply(Observable<Throwable> throwableObservable) throws Exception {
        return throwableObservable.flatMap(throwable -> {
            if (throwable instanceof IOException || throwable instanceof SocketException) { // 网络异常重试3次
                mRetryCount++;
                if (mRetryCount > 3) {
                    System.out.println("错误超过3次");
                    return Observable.error(throwable);
                } else {
                    System.out.println("错误" + mRetryCount + "次");
                    return Observable.timer(mRetryCount * 1000, TimeUnit.MILLISECONDS);
                }
            /*} else if (throwable instanceof ApiException) { // token过期，重试
                if (((ApiException) throwable).getCode() == 401) {
                    return UploadManager.getInstance().getImageTokenObservable();
                }
                return Observable.error(throwable);*/
            } else { // 未知异常直接返回发送 error 的 Observable
                System.out.println("未知异常");
                throwable.printStackTrace();
                return Observable.error(throwable);
            }
        });
    }
});
```

# 轮询

## 定时轮询取前n条

interval+take实现定时轮询，取前N条数据

```kotlin
Disposable d 
    Flowable.interval(INITIAL_DELAY, POLLING_INTERVAL, TimeUnit.MILLISECONDS)
        .map(this::_doNetworkCallAndGetStringResult)
        .take(pollCount)
        .doOnSubscribe(
            subscription -> {
              _log(String.format("Start simple polling - %s", _counter));
            })
        .subscribe(
            taskName -> {
              _log(
                  String.format(
                      Locale.US,
                      "Executing polled task [%s] now time : [xx:%02d]",
                      taskName,
                      _getSecondHand()));
            });
```

## 轮询之延时轮询repeatWhen

```java
Flowable.just(1L)
  .repeatWhen(new RepeatWithDelay(pollCount, pollingInterval))
  .subscribe(
      o ->
          _log(
              String.format(
                  Locale.US,
                  "Executing polled task now time : [xx:%02d]",
                  _getSecondHand())),
      e -> Timber.d(e, "arrrr. Error")));


public class RepeatWithDelay implements Function<Flowable<Object>, Publisher<Long>> {

  private final int _repeatLimit;
  private final int _pollingInterval;
  private int _repeatCount = 1;

  RepeatWithDelay(int repeatLimit, int pollingInterval) {
    _pollingInterval = pollingInterval;
    _repeatLimit = repeatLimit;
  }

  // this is a notificationhandler, all we care about is
  // the emission "type" not emission "content"
  // only onNext triggers a re-subscription

  @Override
  public Publisher<Long> apply(Flowable<Object> inputFlowable) throws Exception {
    // it is critical to use inputObservable in the chain for the result
    // ignoring it and doing your own thing will break the sequence

    return inputFlowable.flatMap(
        new Function<Object, Publisher<Long>>() {
          @Override
          public Publisher<Long> apply(Object o) throws Exception {
            if (_repeatCount >= _repeatLimit) {
              // terminate the sequence cause we reached the limit
              _log("Completing sequence");
              return Flowable.empty();
            }

            // since we don't get an input
            // we store state in this handler to tell us the point of time we're firing
            _repeatCount++;

            return Flowable.timer(_repeatCount * _pollingInterval, TimeUnit.MILLISECONDS);
          }
        });
  }
}
```

## 轮询请求某个接口，得到值时返回

```java
object PollTest2 {
    @Suppress("CheckResult")
    fun interval(milliseconds: Long) {
        Observable.interval(milliseconds, TimeUnit.MILLISECONDS, Schedulers.io())
            .doOnNext(object : Consumer<Long?> {
                override fun accept(aLong: Long?) {
                    println("doOnNext " + aLong + "- " + Thread.currentThread().name)
                }
            })
            .map<DDLInfo>(
                Function { aLong ->
                    println("模拟获取sp数据 start.【$aLong】sleep 5s" + Thread.currentThread().name)
                    if (aLong == 5L) {
                        return@Function DDLInfo("deeplink", System.currentTimeMillis())
                    }
                    SleepTools.second(1)
                    println("----模拟获取sp数据 end.【$aLong】" + Thread.currentThread().name)
                    DDLInfo()
                }
            )
            .takeUntil { ddlInfo ->
                println("takeUntil s=" + ddlInfo + " " + Thread.currentThread().name)
                ddlInfo.isValid()
            }
            .filter { ddlInfo ->
                System.err.println("filter s=" + ddlInfo + " " + Thread.currentThread().name)
                ddlInfo.isValid()
            }
            .timeout(3000L, TimeUnit.MILLISECONDS) // 2秒超时
            .onErrorReturnItem(DDLInfo())
            .subscribeOn(Schedulers.io())
            .observeOn(Schedulers.single())
            .subscribe(
                object : Consumer<DDLInfo> {
                    override fun accept(t: DDLInfo?) {
                        println("==========succeed " + t + "," + Thread.currentThread().name)
                        println()
                    }
                },
                object : Consumer<Throwable?> {
                    override fun accept(throwable: Throwable?) {
                        throwable?.printStackTrace()
                        System.err.println("error: " + throwable?.message + Thread.currentThread().name)
                        println()
                    }
                }
            )
    }
}

data class DDLInfo(
    val deeplink: String = "",
    val timestamp: Long = 0L
) {
    fun isValid(): Boolean {
        return deeplink.isNotBlank()
    }
}

fun main() {
    PollTest2.interval(200L)

    Thread.sleep(12_000L)
}

```

- interval 用来每隔多少时间执行一次
- takeUntil 直到什么条件结束（返回false的往下走，返回true就终止）
- filter 过滤，返回的true的往下走，false的丢弃
- timeout 超时
- onErrorReturnItem 失败时返回的默认数据，timeout超时时也会走到这里

### 采用repeat、结合retry实现轮询

```groovy
// 按照顺序loop，意味着第一次结果请求完成后，再考虑下次请求
private void loopSequence() {
    Disposable disposable = getDataFromServer()
            .doOnSubscribe(new Consumer<Disposable>() {
                @Override
                public void accept(Disposable disposable) throws Exception {
                    Log.d(TAG, "loopSequence subscribe");
                }
            })
            .doOnNext(new Consumer<Integer>() {
                @Override
                public void accept(Integer integer) throws Exception {
                    Log.d(TAG, "loopSequence doOnNext: " + integer);
                }
            })
            .doOnError(new Consumer<Throwable>() {
                @Override
                public void accept(Throwable throwable) throws Exception {
                    Log.d(TAG, "loopSequence doOnError: " + throwable.getMessage());
                }
            })
            .delay(5, TimeUnit.SECONDS, true)       // 设置delayError为true，表示出现错误的时候也需要延迟5s进行通知，达到无论是请求正常还是请求失败，都是5s后重新订阅，即重新请求。
            .subscribeOn(Schedulers.io())
            .repeat()   // repeat保证请求成功后能够重新订阅。
            .retry()    // retry保证请求失败后能重新订阅
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(new Consumer<Integer>() {
                @Override
                public void accept(Integer integer) throws Exception {
                    view.showText(integer + "");
                }
            }, new Consumer<Throwable>() {
                @Override
                public void accept(Throwable throwable) throws Exception {
                    view.showText(throwable.getMessage());
                }
            });
    compositeDisposable.add(disposable);
}
```

RxJava中的repeat操作符可以在原始数据源发射数据完成后重新订阅数据源，而retry可以在原始数据源产生错误后重新订阅数据源。结合起来就可以在无论是成功还是失败的都能重新执行任务，则实现了轮询请求。再结合delay操作符，实现延迟执行任务。
