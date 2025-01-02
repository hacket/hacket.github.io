---
date created: 2024-12-24 00:31
date updated: 2024-12-24 00:31
dg-publish: true
---

# RecyclerView实现网页分格布局

- GridLayoutManager+SnapHelper+坐标转换

具体实现见[PagingRecyclerView]()

- PagerGridLayoutManager

## Ref 其他一些开源库

- [x] <https://github.com/hanhailong/GridPagerSnapHelper>

> 1. 不支持RTL 2. smoothScrollToPosition不支持

- [x] <https://github.com/GcsSloop/pager-layoutmanager>

> 2. 不支持RTL 2.每次滚动都是remove/add view性能差 3. 不支持item刷新/局部刷新，diffUtils

# RecyclerView应用之多宫格抽奖

![](https://img2018.cnblogs.com/common/1450935/201911/1450935-20191122163921469-1421130888.gif#id=RTaDW&originHeight=643&originWidth=420&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 请求获取到结果后做动画

```kotlin
/**
 * 多宫格抽奖helper
 */
class LuckyDrawHelper<T, Result> private constructor(
        builder: Builder<T, Result>) : DefaultLifecycleObserver {

    companion object {
        const val TAG = "lucky_draw"
    }

    private var repeatCount = 0
    private var row = 0
    private var column = 0
    private var dataList = emptyList<T>()
    private var mStartLuckyPosition = 0
    private var animDuration = 0L
    private var mLuckyDrawAnimationListener: OnLuckyDrawAnimationListener<Result>? = null

    // 抽奖位置：抽奖动画要走的位置，顺时针
    private val luckyPositionList: MutableList<Int> = mutableListOf()

    // 抽奖位置和抽奖数据列表对应关系
    private var luckMap: MutableMap<Int, T> = HashMap()

    private var isLuckyDrawIdle = true // 标记抽奖是否处于idle

    /**
     * 可以通过对 mLuckyTruePosition 设置计算策略，来控制用户 中哪些奖 以及 中大奖 的概率
     */
    private var mLuckyTruePosition = 0 // 最终中奖真实RecyclerView位置(这个值是多少就停在哪个位置)

    private var mCurrentLuckyListPosition = -1 // 当前转圈所在luckyPositionList的位置

    private var mAnimator: ValueAnimator? = null

    init {
        require(!builder.dataList.isNullOrEmpty()) {
            "must call Builder.setDataList and mDataList not blank."
        }
        require(builder.row >= 1) {
            "must call Builder.setRow and row greater than 0."
        }
        require(builder.column >= 1) {
            "must call Builder.setColumn and column greater than 0."
        }
        require(builder.animDuration >= 1) {
            "must call Builder.setAnimDuration and animDuration greater than 0."
        }
        this.dataList = builder.dataList
        this.row = builder.row
        this.column = builder.column
        this.mLuckyDrawAnimationListener = builder.listener
        this.repeatCount = builder.repeatCount
        this.animDuration = builder.animDuration
        initLuckyPosition()
        initLuckMap()
        var p = findLuckyPositionByTruePosition(builder.startPosition)
        if (p == -1) {
            p = 0
        }
        this.mStartLuckyPosition = p
    }

    private fun initLuckyPosition() {
        luckyPositionList.clear()
        // 运动顺序为顺时针--按运动顺序加入所有边缘的元素
        // 1.先加入第一行的所有元素
        for (i in 0 until column) {
            luckyPositionList.add(i)
        }
        //2.加入最后一列的(最后一列的第一行已经加入所以从1开始)
        for (j in 1 until row) {
            luckyPositionList.add(column * j + (column - 1))
        }
        //3.先加入最后一行的所有元素(最后一行的最后一列已经加入所以从1开始)
        for (m in 1 until column) {
            luckyPositionList.add(column * row - 1 - m)
        }
        //4.先加入第一列的所有元素(最后一行的第一行已经加入所以从1开始)
        for (n in row - 1 - 1 downTo 1) {
            luckyPositionList.add(column * n)
        }
        LogUtils.e(TAG, "initLuckyPosition(抽奖顺时针位置)=$luckyPositionList")
    }

    private fun initLuckMap() {
        for (i in luckyPositionList.indices) {
            luckMap[luckyPositionList[i]] = dataList[i]
        }
    }

    private fun findLuckyPositionByTruePosition(truePosition: Int): Int {
        return luckyPositionList.indexOf(truePosition)
    }

    /**
     * 开始抽奖动画
     */
    fun startAnim(result: LuckyDrawHelperResult<Result>) {
        if (!isLuckyDrawIdle) {
            showShortDebug("startAnim failed 正在抽奖动画")
            LogUtils.e(TAG, "startAnim failed. 正在抽奖动画")
            return
        }
        var luckyTruePosition = 0 // 预期中间位置，真实的位置
        if (result.positions.isNotEmpty()) {
            luckyTruePosition = result.positions[0]
        }
        when {
            luckyTruePosition < 0 -> {
                setLuckyPosition(0)
            }
            luckyTruePosition >= luckMap.size -> {
                setLuckyPosition(luckyTruePosition % luckMap.size)
            }
            else -> {
                setLuckyPosition(luckyTruePosition)
            }
        }
        var luckyPosition = findLuckyPositionByTruePosition(mLuckyTruePosition)
        if (luckyPosition == -1) {
            LogUtils.e(TAG, "startAnim 在未找到luckyPositionList对应的位置，请确保填入的位置在动画路径上，luckyPosition=$luckyTruePosition")
            luckyPosition = 0
        }
        val start = mStartLuckyPosition
        val end = repeatCount * luckMap.size + luckyPosition
        LogUtils.e(TAG, "startAnim 预设中奖结果真实位置luckyPosition=$luckyTruePosition，start=$start，end=$end")
        mAnimator = ValueAnimator.ofInt(start, end)
                .setDuration(animDuration)
//        mAnimator?.interpolator = EaseCubicInterpolator(0.3f, 0.23f, 0.2f, 0.9f)
        mAnimator?.addUpdateListener { animation ->
            val position = animation.animatedValue as Int
            val p = position % luckMap.size
            LogUtils.d(TAG, "startAnim ValueAnimator onAnimationUpdate animPosition=$position，p=$p")
            luckyDrawUpdatePosition(p)
            isLuckyDrawIdle = false
        }
        mAnimator?.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator?) {
                super.onAnimationStart(animation)
                mLuckyDrawAnimationListener?.onLuckAnimationStart()
            }

            override fun onAnimationEnd(animation: Animator) {
                var endLuckyPosition = findLuckyPositionByTruePosition(mLuckyTruePosition)
                if (endLuckyPosition == -1) {
                    endLuckyPosition = 0
                }
                mStartLuckyPosition = endLuckyPosition
                LogUtils.e(TAG, "startAnim ValueAnimator onAnimationEnd endLuckyPosition=$endLuckyPosition")
                // 最终选中的位置
                mLuckyDrawAnimationListener?.onLuckAnimationEnd(mLuckyTruePosition, result)
                isLuckyDrawIdle = true
            }
        })
        mAnimator?.start()
    }

    private fun setLuckyPosition(luckyTruePosition: Int) {
        mLuckyTruePosition = luckyTruePosition
    }

    private fun luckyDrawUpdatePosition(position: Int) {
        if (mCurrentLuckyListPosition == position) {
            return
        }
        LogUtils.i(TAG, "setCurrentPosition==$position")
        if (mCurrentLuckyListPosition != -1) {
            val truePosition = luckyPositionList[mCurrentLuckyListPosition]
            LogUtils.i(TAG, "setCurrentPosition---last--truePosition=$truePosition，mCurrentPosition=$mCurrentLuckyListPosition")
            mLuckyDrawAnimationListener?.onLuckAnimationUpdated(truePosition, false)
        }
        val truePosition = luckyPositionList[position]
        mCurrentLuckyListPosition = position
        LogUtils.i(TAG, "setCurrentPosition---new--truePosition=$truePosition，mCurrentPosition=$mCurrentLuckyListPosition")
        mLuckyDrawAnimationListener?.onLuckAnimationUpdated(truePosition, true)
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        mStartLuckyPosition = 0
        mLuckyTruePosition = 0
        mAnimator?.cancel()
        mLuckyDrawAnimationListener = null
    }

    /**
     * 用于抽奖结果回调
     */
    interface OnLuckyDrawAnimationListener<Result> {
        fun onLuckAnimationStart()
        fun onLuckAnimationUpdated(position: Int, isCheck: Boolean)
        fun onLuckAnimationEnd(position: Int, result: LuckyDrawHelperResult<Result>)
    }

    class Builder<T, Result> {

        var dataList: List<T> = emptyList() // 数据源
        var repeatCount = 3 // 转的圈数
        var row = 2 // 行
        var column = 4 // 列
        var startPosition = 0 // 开始抽奖的位置
        var animDuration = 3000L
        var listener: OnLuckyDrawAnimationListener<Result>? = null

        /**
         * 中奖数据源，required
         */
        fun setDataList(data: List<T>): Builder<T, Result> {
            this.dataList = data
            return this
        }

        fun setLuckAnimationEndListener(listener: OnLuckyDrawAnimationListener<Result>?
        ): Builder<T, Result> {
            this.listener = listener
            return this
        }

        fun setRow(row: Int): Builder<T, Result> {
            this.row = row
            return this
        }

        fun setColumn(column: Int): Builder<T, Result> {
            this.column = column
            return this
        }

        fun setStartPosition(startTruePosition: Int): Builder<T, Result> {
            this.startPosition = startTruePosition
            return this
        }

        fun setRepeatCount(repeatCount: Int): Builder<T, Result> {
            this.repeatCount = repeatCount
            return this
        }

        fun setAnimDuration(duration: Long): Builder<T, Result> {
            this.animDuration = duration
            return this
        }

        fun build(): LuckyDrawHelper<T, Result> {
            return LuckyDrawHelper(this)
        }
    }

}

/**
 * @param positions 中奖的位置集合
 * @param data 中奖后的数据
 */
class LuckyDrawHelperResult<Result>(
        val positions: List<Int>,
        val data: Result? = null) {
    companion object {
        fun <Result> of(positions: List<Int>, result: Result? = null): LuckyDrawHelperResult<Result> {
            return LuckyDrawHelperResult(positions, result)
        }

        fun <Result> of(position: Int, result: Result? = null): LuckyDrawHelperResult<Result> {
            return LuckyDrawHelperResult(listOf(position), result)
        }
    }
}
```

## 边做请求边做假动画，请求完毕后设置结果

```kotlin
/**
 * 多宫格抽奖helper，支持假动画，请求完毕后停动画
 */
class LuckyDrawHelperV2<T, Result> private constructor(
        builder: Builder<T, Result>) : DefaultLifecycleObserver {

    companion object {
        private const val DEFAULT_TURNS = 20
        const val TAG = "lucky_draw"
    }

    private var repeatCount = 0
    private var row = 0
    private var column = 0
    private var dataList = emptyList<T>()
    private var mStartLuckyPosition = 0
    private var animDuration = 0L
    private var mLuckyDrawAnimationListener: OnLuckyDrawAnimationListener<Result>? = null

    // 抽奖位置：抽奖动画要走的位置，顺时针
    private val luckyPositionList: MutableList<Int> = mutableListOf()

    // 抽奖位置和抽奖数据列表对应关系
    private var luckMap: MutableMap<Int, T> = HashMap()

    private var isLuckyDrawIdle = true // 标记抽奖是否处于idle

    /**
     * 可以通过对 mLuckyTruePosition 设置计算策略，来控制用户 中哪些奖 以及 中大奖 的概率
     */
    private var mLuckyTruePosition = -1 // 最终中奖真实RecyclerView位置(这个值是多少就停在哪个位置)

    private var mCurrentLuckyListPosition = -1 // 当前转圈所在luckyPositionList的位置

    private var mAnimator: ValueAnimator? = null

    private var result: LuckyDrawHelperResultV2<Result>? = null

    init {
        require(!builder.dataList.isNullOrEmpty()) {
            "must call Builder.setDataList and mDataList not blank."
        }
        require(builder.row >= 1) {
            "must call Builder.setRow and row greater than 0."
        }
        require(builder.column >= 1) {
            "must call Builder.setColumn and column greater than 0."
        }
        require(builder.animDuration >= 1) {
            "must call Builder.setAnimDuration and animDuration greater than 0."
        }
        this.dataList = builder.dataList
        this.row = builder.row
        this.column = builder.column
        this.mLuckyDrawAnimationListener = builder.listener
        this.repeatCount = builder.repeatCount
        this.animDuration = builder.animDuration
        initLuckyPosition()
        initLuckMap()
        var p = findLuckyPositionByTruePosition(builder.startPosition)
        if (p == -1) {
            p = 0
        }
        this.mStartLuckyPosition = p
    }

    private fun initLuckyPosition() {
        luckyPositionList.clear()
        // 运动顺序为顺时针--按运动顺序加入所有边缘的元素
        // 1.先加入第一行的所有元素
        for (i in 0 until column) {
            luckyPositionList.add(i)
        }
        //2.加入最后一列的(最后一列的第一行已经加入所以从1开始)
        for (j in 1 until row) {
            luckyPositionList.add(column * j + (column - 1))
        }
        //3.先加入最后一行的所有元素(最后一行的最后一列已经加入所以从1开始)
        for (m in 1 until column) {
            luckyPositionList.add(column * row - 1 - m)
        }
        //4.先加入第一列的所有元素(最后一行的第一行已经加入所以从1开始)
        for (n in row - 1 - 1 downTo 1) {
            luckyPositionList.add(column * n)
        }
        LogUtils.e(TAG, "initLuckyPosition(抽奖顺时针位置)=$luckyPositionList")
    }

    private fun initLuckMap() {
        for (i in luckyPositionList.indices) {
            luckMap[luckyPositionList[i]] = dataList[i]
        }
    }

    private fun findLuckyPositionByTruePosition(truePosition: Int): Int {
        return luckyPositionList.indexOf(truePosition)
    }

    /**
     * 开始抽奖动画
     */
    fun startAnim(startTruePosition: Int = mStartLuckyPosition) {
        if (!isLuckyDrawIdle) {
            showShortDebug("startAnim failed 正在抽奖动画")
            LogUtils.e(TAG, "startAnim failed. 正在抽奖动画")
            return
        }
        reset()
        var luckyPosition = findLuckyPositionByTruePosition(startTruePosition)
        if (luckyPosition == -1) {
            LogUtils.e(TAG, "startAnim 在未找到luckyPositionList对应的位置，请确保填入的位置在动画路径上，luckyPosition=$luckyPosition")
            luckyPosition = 0
        }
        val end = DEFAULT_TURNS * (luckMap.size + luckyPosition)
        LogUtils.e(TAG, "startAnim 预设中奖结果真实位置luckyPosition=$luckyPosition，start=$startTruePosition，end=$end")
        mAnimator = ValueAnimator.ofInt(startTruePosition, end)
                .setDuration(animDuration * DEFAULT_TURNS)
        mAnimator?.interpolator = LinearInterpolator()
        mAnimator?.repeatCount = ValueAnimator.INFINITE
//        mAnimator?.interpolator = EaseCubicInterpolator(0.3f, 0.23f, 0.2f, 0.9f)
        mAnimator?.addUpdateListener { animation ->
            val position = animation.animatedValue as Int
            val luckyListPosition = position % luckMap.size
            val curTruePosition = luckyPositionList[luckyListPosition]
            val turnCount = position / luckMap.size
            luckyDrawUpdatePosition(luckyListPosition)
            if (mLuckyTruePosition == curTruePosition && result != null && turnCount >= repeatCount) {
                LogUtils.e(TAG, "startAnim 有请求结果了，cancel掉，mLuckyTruePosition=$curTruePosition，turnCount=$turnCount")
                // 停止动画
                mStartLuckyPosition = curTruePosition
                mAnimator?.cancel()
                mLuckyDrawAnimationListener?.onLuckAnimationEnd(curTruePosition, result!!)
                isLuckyDrawIdle = true
            }
        }
        mAnimator?.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationStart(animation: Animator?) {
                super.onAnimationStart(animation)
                isLuckyDrawIdle = false
                mLuckyDrawAnimationListener?.onLuckAnimationStart()
            }

            override fun onAnimationCancel(animation: Animator?) {
                super.onAnimationCancel(animation)
                isLuckyDrawIdle = true
            }

            override fun onAnimationEnd(animation: Animator) {
//                var endLuckyPosition = findLuckyPositionByTruePosition(mLuckyTruePosition)
//                if (endLuckyPosition == -1) {
//                    endLuckyPosition = 0
//                }
//                mStartLuckyPosition = endLuckyPosition
//                LogUtils.e(TAG, "startAnim ValueAnimator onAnimationEnd endLuckyPosition=$endLuckyPosition")
//                // 最终选中的位置
//                mLuckyDrawAnimationListener?.onLuckAnimationEnd(false, mLuckyTruePosition, result)

                LogUtils.e(TAG, "startAnim ValueAnimator onAnimationEnd")
                isLuckyDrawIdle = true
            }
        })
        mAnimator?.start()
    }

    fun updateResult(result: LuckyDrawHelperResultV2<Result>) {
        LogUtils.e(TAG, "updateResult $result")
        this.result = result
        var luckyTruePosition = 0 // 预期中间位置，真实的位置
        if (result.positions.isNotEmpty()) {
            luckyTruePosition = result.positions[0]
        }
        when {
            luckyTruePosition < 0 -> {
                setLuckyPosition(0)
            }
            luckyTruePosition >= luckMap.size -> {
                setLuckyPosition(luckyTruePosition % luckMap.size)
            }
            else -> {
                setLuckyPosition(luckyTruePosition)
            }
        }
    }

    fun cancel() {
        mLuckyDrawAnimationListener?.onLuckAnimationCancel()
        reset()
    }

    private fun setLuckyPosition(luckyTruePosition: Int) {
        mLuckyTruePosition = luckyTruePosition
    }

    private fun luckyDrawUpdatePosition(position: Int) {
        if (mCurrentLuckyListPosition == position) {
            return
        }
        LogUtils.i(TAG, "luckyDrawUpdatePosition-->>luckyDrawUpdatePosition==$position")
        if (mCurrentLuckyListPosition != -1) {
            val truePosition = luckyPositionList[mCurrentLuckyListPosition]
            LogUtils.i(TAG, "luckyDrawUpdatePosition-->>last--truePosition=$truePosition，mCurrentLuckyListPosition=$mCurrentLuckyListPosition")
            mLuckyDrawAnimationListener?.onLuckAnimationUpdated(truePosition, false)
        }
        val truePosition = luckyPositionList[position]
        mCurrentLuckyListPosition = position
        LogUtils.i(TAG, "luckyDrawUpdatePosition-->>new--truePosition=$truePosition，mCurrentLuckyListPosition=$mCurrentLuckyListPosition")
        mLuckyDrawAnimationListener?.onLuckAnimationUpdated(truePosition, true)
    }

    private fun reset() {
        result = null
        if (mAnimator != null && (mAnimator!!.isRunning || mAnimator!!.isStarted)) {
            mAnimator?.cancel()
        }
        mCurrentLuckyListPosition = -1
    }

    override fun onDestroy(owner: LifecycleOwner) {
        super.onDestroy(owner)
        reset()
        mStartLuckyPosition = 0
        mLuckyTruePosition = 0


        mAnimator?.cancel()
        mLuckyDrawAnimationListener = null
    }

    /**
     * 用于抽奖结果回调
     */
    interface OnLuckyDrawAnimationListener<Result> {
        fun onLuckAnimationStart() {}
        fun onLuckAnimationCancel() {}
        fun onLuckAnimationUpdated(position: Int, isCheck: Boolean)
        fun onLuckAnimationEnd(position: Int, result: LuckyDrawHelperResultV2<Result>) {}
    }

    class Builder<T, Result> {

        var dataList: List<T> = emptyList() // 数据源
        var repeatCount = 3 // 转的圈数
        var row = 2 // 行
        var column = 4 // 列
        var startPosition = 0 // 开始抽奖的位置
        var animDuration = 900L
        var listener: OnLuckyDrawAnimationListener<Result>? = null

        /**
         * 中奖数据源，required
         */
        fun setDataList(data: List<T>): Builder<T, Result> {
            this.dataList = data
            return this
        }

        fun setLuckAnimationEndListener(listener: OnLuckyDrawAnimationListener<Result>?
        ): Builder<T, Result> {
            this.listener = listener
            return this
        }

        fun setRow(row: Int): Builder<T, Result> {
            this.row = row
            return this
        }

        fun setColumn(column: Int): Builder<T, Result> {
            this.column = column
            return this
        }

        fun setStartPosition(startTruePosition: Int): Builder<T, Result> {
            this.startPosition = startTruePosition
            return this
        }

        fun setRepeatCount(repeatCount: Int): Builder<T, Result> {
            this.repeatCount = repeatCount
            return this
        }

        fun setAnimDuration(duration: Long): Builder<T, Result> {
            this.animDuration = duration
            return this
        }

        fun build(): LuckyDrawHelperV2<T, Result> {
            return LuckyDrawHelperV2(this)
        }
    }

}

/**
 * @param positions 中奖的位置集合
 * @param data 中奖后的数据
 */
class LuckyDrawHelperResultV2<Result>(
        val positions: List<Int>,
        val data: Result? = null) {
    companion object {
        fun <Result> of(positions: List<Int>, result: Result? = null): LuckyDrawHelperResultV2<Result> {
            return LuckyDrawHelperResultV2(positions, result)
        }

        fun <Result> of(position: Int, result: Result? = null): LuckyDrawHelperResultV2<Result> {
            return LuckyDrawHelperResultV2(listOf(position), result)
        }
    }

    override fun toString(): String {
        return "positions=$positions, data=$data"
    }
}
```

使用：

```kotlin
private val mLuckyDrawHelper: LuckyDrawHelperV2<LuckyDrawContentItem, LuckyDrawResult> by lazy(LazyThreadSafetyMode.NONE) {
        val helper = LuckyDrawHelperV2.Builder<LuckyDrawContentItem, LuckyDrawResult>()
                .setDataList(mLuckyDrawMainAdapter.data).setRow(ROW).setColumn(COLUMN)
                .setLuckAnimationEndListener(this).build()
        lifecycle.addObserver(helper)
        helper
    }
    
// 开启动画，假
mLuckyDrawHelper.startAnim()

// 网络请求结果出来，设置结果
val helperResult = LuckyDrawHelperResultV2.of(positions, data)
mLuckyDrawHelper.updateResult(helperResult)

// 网络请求出现异常等取消动画
mLuckyDrawHelper.cancel()
```

![](http://note.youdao.com/yws/res/41789/2601F75F11D140029937513B2B31D250#id=NZZ89&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 计算多宫格要加入到动画list

```kotlin
public class LuckyDraw {
    public int row = 4;   // 行
    public int column = 4; // 列

    private List<Integer> luckyPositionList = new ArrayList<>();

    public static void main(String[] args) {
        List<Integer> calculate = new LuckyDraw().calculate();
        System.out.println(calculate);
    }

// 0 1 2 3
// 4 5 6 7
// 8 9 10 11
// 12 13 14 15
    private List<Integer> calculate() {
        // 第一行
        for (int i = 0; i < column; i++) {
            luckyPositionList.add(i);
        }
        // 最后一列（除去第一行和最后一行）
        for (int j = 1; j < row - 1; j++) {
            int p = (j + 1) * column - 1;
            luckyPositionList.add(p);
        }
        // 最后一行
        for (int k = column-1; k >= 0; k--) {
            int p = (row - 1) * column + k;
            luckyPositionList.add(p);
        }
        // 第一列（除去第一行和最后一行）
        for (int m = row - 2; m > 0; m--) {
            int p = m * column;
            luckyPositionList.add(p);
        }
        return luckyPositionList;
    }
}
```
