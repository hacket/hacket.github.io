---
date created: 2024-12-27 23:40
date updated: 2024-12-27 23:40
dg-publish: true
---

# HashMap原理

## HashMap特点

- 可以保存null键和null值，只能一个null键，多个null键覆盖；可以有多个null值；null键存放在第一个位置
- 无法保证顺序，也不保证顺序不随时间变化
- 和HashTable类似，除了不同步的和允许null键和null值
- 底层是数组加链表结合的哈希表方式实现
- HashMap中解决hash冲突采用的是链接地址法
- Fail-Fast 机制

HashMap默认初始容量为16，负载因子为0.75<br />HashMap内部数组大小为2的幂值

## HashMap原理

### 一些变量和常量

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
static final int MAXIMUM_CAPACITY = 1 << 30;
static final float DEFAULT_LOAD_FACTOR = 0.75f;

transient int size;
int threshold;
final float loadFactor;

// JDK7.0，大小必须为2的幂，默认是个空的数组，Entry实现了Map.Entry
static final Entry<?,?>[] EMPTY_TABLE = {};
transient Entry<K,V>[] table = (Entry<K,V>[]) EMPTY_TABLE;

// JDK8.0，大小必须为2的幂，首次使用时初始化，Node实现了Map.Entry
transient Node<K,V>[] table;
```

1. size 桶当前装了多少数据<br />记录了Map中KV对的个数
2. capacity 桶能装数据的最大容量<br />bucket容量，即HashMap的容量大小。默认16
3. loadFactor<br />装载因子，loadFactor的默认值为0.75f。负载因子衡量的是一个散列表的空间的使用程度，负载因子越大表示散列表的装填程度越高，反之愈小。对于使用链表法的散列表来说，查找一个元素的平均时间是O(1+a)，因此如果负载因子越大，对空间的利用更充分，然而后果是查找效率的降低；如果负载因子太小，那么散列表的数据将过于稀疏，对空间造成严重浪费。默认的的负载因子0.75是对空间和时间效率的一个平衡选择。当容量超出此最大容量时， resize 后的 HashMap 容量是容量的两倍。
4. threshold<br />临界值，当实际KV个数超过threshold时(`size>=capacity`)，HashMap会将容量扩容，`threshold＝capacity*loadFactor`
5. Map.Entry 包含要存储的key,value,hash和链表下一个节点

```java
// JDK7.0
static class Entry<K,V> implements Map.Entry<K,V> {
    final K key; // key
    V value; // value
    Entry<K,V> next; // 下一个元素
    int hash; // hash值
}
// JDK8.0
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

### 构造器

#### JDK7.0

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
static final int MAXIMUM_CAPACITY = 1 << 30;
static final float DEFAULT_LOAD_FACTOR = 0.75f;
public HashMap() {
    this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR);
}
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    this.loadFactor = loadFactor; // 初始化装载因子
    threshold = initialCapacity; // threshold为初始化容量
    init(); // 空实现，留给子类实现的，比如LinkedHashMap
}
public HashMap(Map<? extends K, ? extends V> m) {
    this(Math.max((int) (m.size() / DEFAULT_LOAD_FACTOR) + 1,
                  DEFAULT_INITIAL_CAPACITY), DEFAULT_LOAD_FACTOR); // 取默认值和m容量的最大值作为新的容量
    inflateTable(threshold); 

    putAllForCreate(m); // 将m添加进去
}
```

看看inflateTable做了什么？

```java
private void inflateTable(int toSize) {
    // Find a power of 2 >= toSize
    int capacity = roundUpToPowerOf2(toSize); // 得到小于等于参数的最大2的幂，如7→4,15→8,16→16,17→16

    threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1); // 扩容阈值
    table = new Entry[capacity]; // 初始化table数组
    initHashSeedAsNeeded(capacity);
}
```

inflateTable又调用了roundUpToPowerOf2()：

```java
// HashMap JDK7.0
private static int roundUpToPowerOf2(int number) {
    // assert number >= 0 : "number must be non-negative";
    return number >= MAXIMUM_CAPACITY
            ? MAXIMUM_CAPACITY // 不超过最大容器
            : (number > 1) ? Integer.highestOneBit((number - 1) << 1) : 1; // 小于等于1都为1；其他情况找最近的不超过这个数的2次幂
}
// Integer.java
public static int highestOneBit(int i) {
    // HD, Figure 3-1
    i |= (i >>  1);
    i |= (i >>  2);
    i |= (i >>  4);
    i |= (i >>  8);
    i |= (i >> 16);
    return i - (i >>> 1);
}
```

> 概念：如果一个数是2的幂次方数，那么这个数表示成10进制的时候，一定只有一个1而其他位上都是0，如：4:0100,8:1000,16:10000

具体的运算过程见：[详解Integer.highestOneBit()](https://blog.csdn.net/qq_43091847/article/details/103902357)

- **JDK7.0构造器小结：**
  1. initialCapacity传递多少就是多少，只要不超过2^30；
  2. loadFactor传递多少就是多少
  3. threshold为initialCapacity；HashMap(Map)构造器threshold=capacity*loadFactor(其中capacity为传递的不大于initialCapacity的2次幂)

#### JDK8.0+/JDK11.0+

```java
static final int MAXIMUM_CAPACITY = 1 << 30; // 2^30
static final float DEFAULT_LOAD_FACTOR = 0.75f;
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}
public HashMap(int initialCapacity, float loadFactor) {
    // ...
    if (initialCapacity > MAXIMUM_CAPACITY) 
        initialCapacity = MAXIMUM_CAPACITY; // 初始化容量最大为2^30次
    // ...
    this.loadFactor = loadFactor; // 装载因子，默认0.75
    this.threshold = tableSizeFor(initialCapacity); 
}
public HashMap(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```

- HashMap最大容量2^30；默认初始化容量16；默认装载因子0.75f
- threshold默认为大于initialCapacity的二次幂，如3→4,7→8,15→16,16→16,17→32

看看tableSizeFor：

```java
// JDK8.0+
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
// JDK11.0+
static final int tableSizeFor(int cap) {
    int n = -1 >>> Integer.numberOfLeadingZeros(cap - 1); // 给定一个int类型数据，返回这个数据的二进制串中从最左边算起连续的“0”的总数量。因为int类型的数据长度为32所以高位不足的地方会以“0”填充。
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

> HashMap的容量计算，JDK11的计算比JDK8.0计算快一倍<br />[HashMap在JDK8和JDK11的容量计算算法tableSizeFor分析](https://blog.csdn.net/itsonglin/article/details/119212493)

### put 存放元素

将key和value存放到map中去，并返回该key原先的value；返回null如果原先没有该key，或者原先该key的位置存储的是null值。

#### put JDK7.0

大致的思路为：

- 如果table为空，初始化table和threshold(`capacity * loadFactor`)
- 如果key为null，插入到table索引为0的位置
- 如果key不为null
  1. 对key的hashCode()做hash，然后再计算index
  2. 如果节点已经存在就替换old value(保证key的唯一性：key的hash一致且key为同一对象或key的equals相等)
  3. 如果没碰撞直接放到bucket里
  4. 如果碰撞了，以链表的形式存在buckets后（头插法）
  5. 如果bucket满了(>=threshold)，就要扩容resize，扩容原有table大小的两倍（先扩容再插入元素）

```java
// HashMap 7.0
transient Entry<K,V>[] table = (Entry<K,V>[]) EMPTY_TABLE;
public V put(K key, V value) {
    if (table == EMPTY_TABLE) { // table为空，初始化threshold和table数组
        inflateTable(threshold);
    }
    // 1、特殊key值处理，key为null，调用putForNullKey
    if (key == null) 
        return putForNullKey(value); // 存放key=null，多次put会覆盖上一次的value
        
    // key不为null
    int hash = hash(key); // 2、计算hash，减少碰撞机会
    int i = indexFor(hash, table.length); // 计算table中目标bucket的下标
    // 3、指定目标bucket，遍历Entry结点链表，若找到key相同的Entry结点，替换，并返回旧值
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
        // 相同的前提，hash一样，key是同一个对象或者key的equals相同
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value; // 旧值
            e.value = value; // 用新值覆盖旧值
            e.recordAccess(this);
            return oldValue; // 返回旧值
        }
    }
    modCount++;
    // 4、若未找到目标Entry结点，则新增一个Entry结点
    addEntry(hash, key, value, i);
    return null;
}
```

##### 1. 特殊key值处理，key为null putForNullKey

特殊key值，指的就是key为null。 先说结论：

1. HashMap中，是允许key、value都为null的，且key为null只存一份，多次存储会将旧value值覆盖；value可以多个为null；
2. key为null的存储位置，都统一放在下标为0的bucket，即：table[0]位置的链表；
3. 如果是第一次对key=null做put操作，将会在table[0]的位置新增一个Entry结点，使用头插法做链表插入。

先来看`putForNullKey`：

```java
private V putForNullKey(V value) {
    // 如果存在table数组第0个不为null，进入循环
    for (Entry<K,V> e = table[0]; e != null; e = e.next) {
        if (e.key == null) { // table[0]的key为null
            V oldValue = e.value; // 原有位置的老值
            e.value = value; // table[0]覆盖成新的值
            e.recordAccess(this);
            return oldValue; // 返回旧的值
        }
    }
    modCount++;
    // table[0]不存在，直接添加Entry
    addEntry(0, null, value, 0);
    return null;
}
```

> putForNullKey()方法中的代码较为简单：首先选择table[0]位置的链表，然后对链表做遍历操作，如果有结点的key为null，则将新value值替换掉旧value值，返回旧value值，如果未找到，则新增一个key为null的Entry结点。

第二个方法`addEntry()`。 这是一个通用方法：

```java
void addEntry(int hash, K key, V value, int bucketIndex) {
    if ((size >= threshold) && (null != table[bucketIndex])) { // 如果table的size大于等于阈值threshold了，需要扩容
        resize(2 * table.length); // 扩容为2倍length
        hash = (null != key) ? hash(key) : 0; // 扩容后，重新计算hash
        bucketIndex = indexFor(hash, table.length); // 扩容后，重新计算索引
    }
    // 创建新的Entry
    createEntry(hash, key, value, bucketIndex);
}
```

> 给定hash、key、value、bucket下标，新增一个Entry结点，另外还担负了扩容职责。如果哈希表中存放的k-v对数量超过了当前阈值(threshold = table.length * loadFactor)，且当前的bucket下标有链表存在，那么就做扩容处理（resize）。扩容后，重新计算hash，最终得到新的bucket下标，然后使用头插法新增结点。

##### 2. 扩容 resize

1. 扩容后大小是扩容前的2倍, `resize(2 * table.length)`
2. 数据搬迁，从旧table迁到扩容后的新table。为避免碰撞过多，先决策是否需要对每个Entry链表结点重新hash，然后根据hash值计算得到bucket下标，然后使用头插法做结点迁移。

```java
void resize(int newCapacity) {
    Entry[] oldTable = table;
    int oldCapacity = oldTable.length;
    if (oldCapacity == MAXIMUM_CAPACITY) { // 旧的容量已经达到了2^30次
        threshold = Integer.MAX_VALUE; // 阈值直接等于int最大值
        return;
    }

    Entry[] newTable = new Entry[newCapacity]; // 创建一个新的Entry数组
    transfer(newTable, initHashSeedAsNeeded(newCapacity));
    table = newTable; // 新的数组赋值给table
    threshold = (int)Math.min(newCapacity * loadFactor, MAXIMUM_CAPACITY + 1); // 阈值重新用新的容量*负载因子计算
}
void transfer(Entry[] newTable, boolean rehash) { // 将旧的元素转移到新的数组去
    int newCapacity = newTable.length;
    for (Entry<K,V> e : table) {
        while(null != e) { // 有元素，遍历链表，将旧的元素重新计算hash值，索引，存到新的数组中去
            Entry<K,V> next = e.next;
            if (rehash) {
                e.hash = null == e.key ? 0 : hash(e.key);
            }
            int i = indexFor(e.hash, newCapacity);
            e.next = newTable[i];
            newTable[i] = e;
            e = next;
        }
    }
}
```

##### 3. 如何计算bucket下标？

1. hash值的计算<br />hash值的计算，首先得有key的hash值，就是一个整数，int类型，其计算方式使用了一种可尽量减少碰撞的算式（高位运算）；使用key的hashCode作为算式的输入，得到了hash值。

**对于两个对象，若其hashCode相同，那么两个对象的hash值就一定相同；但两个对象hash值相同，对象不一定相同。**

```java
// HashMap JDK7.0
final int hash(Object k) {
    int h = hashSeed;
    if (0 != h && k instanceof String) {
        return sun.misc.Hashing.stringHash32((String) k);
    }

    h ^= k.hashCode();

    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

2. 接着看indexFor()，计算索引，就是对length取余：

```java
// HashMap JDK7.0
static int indexFor(int h, int length) {
    // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
    return h & (length-1);
}
```

> 将table的容量与hash值做“与”运算，得到哈希table的bucket下标

table的容量length都是2的幂次方，所以这个等式 `h & (length-1)`也等价于`h % length`，h对length取模，只是位运算性能高点

哈希table的初始大小默认设置为16，为2的次幂数。后面在扩容时，都是以2的倍数来扩容。为什么非要将哈希table的大小控制为2的次幂数？

1. 降低发生碰撞的概率，使散列更均匀。根据key的hash值计算bucket的下标位置时，使用“与”运算公式：`h & (length-1)`，当哈希表长度为2的次幂时，等同于使用表长度对hash值取模（不信大家可以自己演算一下），散列更均匀；
2. 表的长度为2的次幂，那么(length-1)的二进制最后一位一定是1，在对hash值做“与”运算时，最后一位就可能为1，也可能为0，换句话说，取模的结果既有偶数，又有奇数。设想若(length-1)为偶数，那么“与”运算后的值只能是0，奇数下标的bucket就永远散列不到，会浪费一半的空间。

##### 4. 在目标bucket中遍历Entry结点

```java
int i = indexFor(hash, table.length); // 计算table中目标bucket的下标
// 3、指定目标bucket，遍历Entry结点链表，若找到key相同的Entry结点，替换，并返回旧值
for (Entry<K,V> e = table[i]; e != null; e = e.next) {
    Object k;
    // 相同的前提，hash一样，key是同一个对象或者key的equals相同
    if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
        V oldValue = e.value; // 旧值
        e.value = value; // 用新值覆盖旧值
        e.recordAccess(this);
        return oldValue; // 返回旧值
    }
}
```

通过hash值计算出下标，找到对应的目标bucket，然后对链表做遍历操作，逐个比较，如下：<br />![](https://note.youdao.com/yws/res/100741/964843BFBF6C4C6D99F5EFFF439891FC#id=Be0Wp&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455773165-13818e40-00d7-4171-8b6a-a63cd3fa1b87.png#averageHue=%23050404&clientId=ucc19406b-7688-4&from=paste&id=uee1c5f58&originHeight=818&originWidth=1284&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub261c141-e8c8-4af0-8805-961b40644b2&title=)

查找条件：`**e.hash == hash && ((k = e.key) == key || key.equals(k))**` 结点的key与目标key的相等，要么内存地址相等，要么逻辑上相等，两者有一个满足即可。

##### 5. 添加新的Entry createEntry

```java
void createEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex]; // 位置bucketIndex的元素，e不为nulL表示该位置有元素了
    table[bucketIndex] = new Entry<>(hash, key, value, e); // 如果索引bucketIndex存在元素了，那么进行链表头插法
    size++; // 大小加1
}
```

头插法插入到链表

#### put JDK8.0

- JDK8.0 put流程<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455811537-f99234ce-5391-40fc-b0f6-e3f887cf5ec9.png#averageHue=%23f9f7ee&clientId=ucc19406b-7688-4&from=paste&id=u8250f9e9&originHeight=960&originWidth=1211&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u629e919a-feac-4c47-b19c-da6d8cbf0dc&title=)
- JDK8.0 put源码分析

```java
// HashMap JDK8.0
static final int TREEIFY_THRESHOLD = 8;
static final int UNTREEIFY_THRESHOLD = 6;
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0) // 1. table为null或者table数组大小为0
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null) // 2. (n - 1) & hash计算索引，根据index找到目标bucket后，若当前bucket上没有结点，那么直接新增一个结点，赋值给该bucket
        tab[i] = newNode(hash, key, value, null);
    else { // 3. 该位置已经有元素
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k)))) // 3.1 当前bucket上有链表，且头结点key就匹配，那么直接做替换即可；
            e = p;
        else if (p instanceof TreeNode) // 3.2 若当前bucket上的是树结构，则转为红黑树的插入操作；
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else { // 3.3 链表结构
            for (int binCount = 0; ; ++binCount) { // 遍历链表，插入到合适的位置
                if ((e = p.next) == null) { // 3.3.2 遍历到链表最后，未找到相同的key，那么插入
                    p.next = newNode(hash, key, value, null); // 插入到链表尾部
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st // 若链表长度大于TREEIFY_THRESHOLD-1，则执行红黑树转换操作，转换为红黑树
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k)))) // 3.3.1 遍历链表的过程中，找到了相同的key，直接break
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key // 3.4 替换该位置元素
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold) // 4 看当前Map中存储的k-v对的数量是否超出了threshold，若超出，还需再次扩容。
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

##### put主要流程：

1. table为null或者table数组大小为0，进行一次resize扩容
2. 根据index找到目标bucket后，若当前bucket上没有结点，那么直接新增一个结点，赋值给该bucket
3. 该位置有元素，替换还是插入到链表或红黑树
   - 3.1 当前bucket上有链表，且头结点key就匹配，那么直接做替换即可；
   - 3.2 若当前bucket上的是树结构，则转为红黑树的插入操作；
   - 3.3 遍历链表（第一个节点的key不相等）
     - 3.3.1 若链表中有结点匹配，则做value替换
     - 3.3.2 若没有结点匹配，则在链表末尾追加
       - 若链表长度大于`TREEIFY_THRESHOLD-1`且数组长度大于`MIN_TREEIFY_CAPACITY`=64，则执行红黑树转换操作，转换为红黑树
       - 若链表长度大于`TREEIFY_THRESHOLD-1`且数组长度小于`MIN_TREEIFY_CAPACITY`，则执行扩容resize()操作
   - 3.4 替换该位置元素
4. 看当前Map中存储的k-v对的数量是否超出了threshold，若超出，还需再次扩容。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455843772-fb284019-6147-49b2-93ec-1345c23f1edb.png#averageHue=%231b1b1b&clientId=ucc19406b-7688-4&from=paste&id=u859acf9e&originHeight=1278&originWidth=1304&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf4cd1b18-6b2c-40ad-b8e6-760cc2abd65&title=)

红黑树的转换操作如下：

```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY) // 若表为空，或table长度小于MIN_TREEIFY_CAPACITY，也不做转换，直接做扩容处理。
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) { // 转换为红黑树
        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

##### 扩容 resize

**什么场景下会触发扩容？**

1. 哈希table为null或长度为0；
2. Map中存储的k-v对数量超过了阈值threshold（threshold = capacity*loadFactor）；
3. 链表中的长度超过了`TREEIFY_THRESHOLD(8)`，但表长度却小于`MIN_TREEIFY_CAPACITY(64)`。

**扩容分为2步**

1. 对哈希表原有长度的扩展（2倍）
2. 将旧table中的数据搬到新table上。

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table; // 旧table数组
    int oldCap = (oldTab == null) ? 0 : oldTab.length; // 旧table容量大小
    int oldThr = threshold; // 阈值
    int newCap, newThr = 0;
    if (oldCap > 0) { // 1. 旧table大小大于0
        if (oldCap >= MAXIMUM_CAPACITY) { // 1.1 达到最大容量2^30，阈值threshold等于Int最大值
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && 
                 oldCap >= DEFAULT_INITIAL_CAPACITY) // 1.2 原有oldCap扩容一倍；且oldCap大于等于默认容量16
            newThr = oldThr << 1; // double threshold，阈值*2
    }
    else if (oldThr > 0) // initial capacity was placed in threshold // 2.1 初始化为threshold，在构造器中，threshold等于initCapacity
        newCap = oldThr; // 也就是说初始化的容量就是构造器的initCapacity
    else {               // zero initial threshold signifies using defaults // 3.1 未指定initCapacity，容量和阈值都设置为默认的
        newCap = DEFAULT_INITIAL_CAPACITY; // 16
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY); // 12
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap]; // 4 创建一个新的Node数组
    table = newTab; // newTab赋值给table
    
    // 下面就是旧数据的迁移到newTab中去
    if (oldTab != null) { // 5. 旧table有数据
        for (int j = 0; j < oldCap; ++j) { // 循环遍历旧数据的哈希table的每个不为null的bucket
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null) // 5.1 // 若只有一个结点，则原地存储
                    newTab[e.hash & (newCap - 1)] = e; // 该位置的Node没有下一个元素，重新计算索引，放到新的table中newTab
                else if (e instanceof TreeNode) // 5.2 是红黑树
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order // 5.3 链表迁移，"lo"前缀的代表要在原bucket上存储，"hi"前缀的代表要在新的bucket上存储
                    Node<K,V> loHead = null, loTail = null; // 原bucket的头、尾节点
                    Node<K,V> hiHead = null, hiTail = null; // 在新bucket的头、尾节点
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) { // 0，不需要移动
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else { // 1，需要移动
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null); // 循环遍历每个桶上的链表
                    if (loTail != null) { // 不需要迁移的数据
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) { // 需要迁移的数据
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead; // 新下标为从当前下标往前挪oldCap个距离
                    }
                }
            }
        }
    }
    return newTab;
}
```

我们使用的是2次幂的扩展(指长度扩为原来2倍)，所以，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置。看下图可以明白这句话的意思，n为table的长度。

1. 图（a）表示扩容前的key1和key2两种key确定索引位置的示例，
2. 图（b）表示扩容后key1和key2两种key确定索引位置的示例，其中hash1是key1对应的哈希与高位运算结果。

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455899458-7a744f1c-b5b8-4324-b299-42b6b0ead878.png#averageHue=%23fdfcfc&clientId=ucc19406b-7688-4&from=paste&id=u6f4d27bc&originHeight=446&originWidth=1632&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u5482ebe0-0f08-476e-b4b1-9d4b151450c&title=)<br />元素在重新计算hash之后，因为n变为2倍，那么n-1的mask范围在高位多1bit(红色)，因此新的index就会发生这样的变化：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687455961400-1584df33-708d-46ab-b552-5d099c30898d.png#averageHue=%23f5f5f5&clientId=ucc19406b-7688-4&from=paste&id=u88aa2316&originHeight=202&originWidth=1064&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u1ed924fe-42d9-4bd9-851a-24b7ac5270a&title=)<br />因此，我们在扩充HashMap的时候，不需要像JDK1.7的实现那样重新计算hash，只需要看看原来的hash值新增的那个bit是1还是0就好了，是0的话索引没变，是1的话索引变成“原索引+oldCap”，可以看看下图为16扩充为32的resize示意图：<br />![](https://note.youdao.com/yws/res/100745/7A0F03770AA346499DB74AD7A94003AD#id=x2fcA&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687480664509-f0addbef-dda7-46b0-a105-c54ef0c004ad.png#averageHue=%23f1f1f1&clientId=u0ccb56ef-5d2f-4&from=paste&id=ueff323a4&originHeight=730&originWidth=1268&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u39c313e0-705b-471b-9408-03165edfa6c&title=)

这个设计确实非常的巧妙，既省去了重新计算hash值的时间，而且同时，由于新增的1bit是0还是1可以认为是随机的，因此resize的过程，均匀的把之前的冲突的节点分散到新的bucket了。这一块就是JDK1.8新增的优化点。有一点注意区别，JDK1.7中rehash的时候，旧链表迁移新链表的时候，如果在新表的数组索引位置相同，则链表元素会倒置，但是从上图可以看出，JDK1.8不会倒置。

### get 获取元素

#### get JDK7.0

```java
public V get(Object key) {
    if (key == null) // 1. 获取key为null的，索引0位置
        return getForNullKey();
    Entry<K,V> entry = getEntry(key); // 2. 根据key获取Entry

    return null == entry ? null : entry.getValue();
}
final Entry<K,V> getEntry(Object key) {
    if (size == 0) {
        return null;
    }

    int hash = (key == null) ? 0 : hash(key); // 获取hash
    for (Entry<K,V> e = table[indexFor(hash, table.length)]; // 获取index
         e != null;
         e = e.next) {
        Object k;
        if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key.equals(k)))) // 找到返回
            return e;
    }
    return null;
}
```

#### get JDK8.0

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}
final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

### fail-fast机制

`fail-fast`经常和`ConcurrentModificationException`一起出现，来看看这两者的关系？<br />什么是fail-fast？我们可以称它为"快速失效策略"，下面是Wikipedia中的解释：

```
In systems design, a fail-fast system is one which immediately reports at its interface any condition that is likely to indicate a failure. Fail-fast systems are usually designed to stop normal operation rather than attempt to continue a possibly flawed process.
Such designs often check the system's state at several points in an operation, so any failures can be detected early. The responsibility of a fail-fast module is detecting errors, then letting the next-highest level of the system handle them.
```

> 就是在系统设计中，当遇到可能会诱导失败的条件时立即上报错误，快速失效系统往往被设计在立即终止正常操作过程，而不是尝试去继续一个可能会存在错误的过程。

简洁点说，就是尽可能早的发现问题，立即终止当前执行过程，由更高层级的系统来做处理。<br />在HashMap中，我们前面提到的`modCount`域变量(集合框架中的其他集合也是类似的)，就是用于实现hashMap中的fail-fast。出现这种情况，往往是在非同步的多线程并发操作。<br />在对Map的做迭代(Iterator)操作时，会将modCount域变量赋值给expectedModCount局部变量。在迭代过程中，用于做内容修改次数的一致性校验。若此时有其他线程或本线程的其他操作对此Map做了内容修改时，那么就会导致modCount和expectedModCount不一致，立即抛出异常ConcurrentModificationException。<br />比如：

```java
public static void main(String[] args) {
  Map<String, Integer> testMap = new HashMap<>();
  testMap.put("s1", 11);
  testMap.put("s2", 22);
  testMap.put("s3", 33);


  for (Map.Entry<String, Integer> entry : testMap.entrySet()) {
      String key = entry.getKey();
      if ("s1".equals(key)) {
          testMap.remove(key);
      }
  }
}

---- output ---
Exception in thread "main" java.util.ConcurrentModificationException
  at java.util.HashMap$HashIterator.nextNode(HashMap.java:1437)
  at java.util.HashMap$EntryIterator.next(HashMap.java:1471)
  at java.util.HashMap$EntryIterator.next(HashMap.java:1469)
    ...
```

正确的删除Map元素的姿势：只有一个，Iteator的remove()方法。

```java
Iterator<Entry<String, Integer>> iterator = testMap.entrySet().iterator();
while (iterator.hasNext()) {
    Entry<String, Integer> next = iterator.next();
    System.out.println(next.getKey() + ":" + next.getValue());
    if (next.getKey().equals("s2")) {
        iterator.remove();
    }
}
```

> 但也要注意一点，能安全删除，并不代表就是多线程安全的，在多线程并发执行时，若都执行上面的操作，因未设置为同步方法，也可能导致modCount与expectedModCount不一致，从而抛异常ConcurrentModificationException。

## HashMap面试题

### HashMap、HashTable是什么关系？

- 共同点
  1. 底层都是哈希表+链表实现
- 区别
  1. 从层级结构上看，HashMap、HashTable有一个共用的Map接口。另外，HashTable还单独继承了一个抽象类Dictionary；
  2. HashTable诞生自JDK1.0，HashMap从JDK1.2之后才有；<br />H3. ashTable线程安全，HashMap线程不安全；
  3. 初始值和扩容方式不同。HashTable的初始值为11，扩容为原大小的2*d+1。容量大小都采用奇数且为素数，且采用取模法，这种方式散列更均匀。但有个缺点就是对素数取模的性能较低（涉及到除法运算），而HashTable的长度都是2的次幂，设计就较为巧妙，这种方式的取模都是直接做位运算，性能较好。
  4. HashMap的key、value都可为null，且value可多次为null，key多次为null时会覆盖。当HashTable的key、value都不可为null，否则直接NPE(NullPointException)。

### HashMap怎么计算数组下标的？

```java
index = (n - 1) & hash]
```

- hash为key的哈希值
- n为table长度，为2的n次幂，如4、8、16，默认16

以16为例：

```
n = 16
n-1 = 15 = 0000 1111
hash & 1111 = hash的后四位为1的为1，为0的为0
```

上面的公式等于对n取模，这里n为16，n为2的倍数

这就是为什么容量要为2的倍数，可以减少很多hash冲突

### HashMap的hash函数设计？为什么要用异或运算符？还有哪些算法可以计算出hash值？

```java
// JDK7.0
final int hash(Object k) {
    int h = hashSeed;
    if (0 != h && k instanceof String) {
        return sun.misc.Hashing.stringHash32((String) k);
    }

    h ^= k.hashCode();

    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}

// JDK8.0
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

JDK 8.0 中，是通过 hashCode() 的高 16 位异或低 16 位实现的：`(h = k.hashCode()) ^ (h >>> 16)`，主要是从速度，功效和质量来考虑的，减少系统的开销，也不会造成因为高位没有参与下标的计算，从而引起的碰撞。

**为什么要用异或运算符？**<br />保证了对象的 hashCode 的 32 位值只要有一位发生改变，整个 hash() 返回值就会改变。尽可能的减少碰撞。

**其他可以计算出hash值的算法有：**

1. 平方取中法
2. 取余数
3. 伪随机数法

### 一个HashMap的容量（capacity）默认是16，设计成16的好处？为何总是2的n次方？

HashMap根据用户传入的初始化容量，利用无符号右移和按位或运算等方式计算出第一个大于该数的2的幂。<br />**设计成2的幂次方？**

- 使数据分布均匀，减少碰撞
- 性能更好：当length为2的n次方时，`h&(length - 1)` 就相当于对length取模，而且在速度、效率上比直接取模要快得多

> <http://www.hollischuang.com/archives/2091>

---

**为什么HashMap的底层数组长度为何总是2的n次方?**

1. 当length为2的N次方的时候，h & (length-1) = h % length

> 为什么&效率更高呢？因为位运算直接对内存数据进行操作，不需要转成十进制，所以位运算要比取模运算的效率更高

2. 当length为2的N次方的时候，数据分布均匀，减少冲突<br />我们来举例当length为奇数、偶数时的情况：<br />![](https://note.youdao.com/yws/res/100740/8B609D5E32F945A0A8C08FDB6AD9B8C1#id=ADSdd&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687480734116-96b7e213-db08-458b-a38e-aeefa4c37896.png#averageHue=%23f9f7f6&clientId=u0ccb56ef-5d2f-4&from=paste&id=u58b2840a&originHeight=496&originWidth=768&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u13c3d817-bb80-4432-b62b-8fd4a0a12db&title=)

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687480759814-773e4674-817f-4938-a626-e93ff03c60f4.png#averageHue=%23faf8f6&clientId=u0ccb56ef-5d2f-4&from=paste&id=u931efc3c&originHeight=498&originWidth=774&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u060ccc25-2970-4edf-8ac7-9136eb3b6e0&title=)![](https://note.youdao.com/yws/res/100737/AED8BA3C93ED4B87AA88D1D7D9E04B99#id=V8r6K&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)<br />从上面的图表中我们可以看到，当 length 为15时总共发生了8次碰撞，同时发现空间浪费非常大，因为在 1、3、5、7、9、11、13、15 这八处没有存放数据。

这是因为hash值在与14（即 1110）进行&运算时，得到的结果最后一位永远都是0，那么最后一位为1的位置即0001、0011、0101、0111、1001、1011、1101、1111位置处是不可能存储数据的。这样，空间的减少会导致碰撞几率的进一步增加，从而就会导致查询速度慢

而当length为16时，length – 1 = 15， 即 1111，那么，在进行低位&运算时，值总是与原来hash值相同，而进行高位运算时，其值等于其低位值。所以，当`length=2^n`时，不同的hash值发生碰撞的概率比较小，这样就会使得数据在table数组中分布较均匀，查询速度也较快。

**多试一些数，就可以发现规律：**<br />当length为奇数时，length-1为偶数，而偶数二进制的最后一位永远为0，那么与其进行`&`运算，得到的二进制数最后一位永远为0，那么结果一定是偶数，那么就会导致下标为奇数的桶永远不会放置数据，这就不符合我们均匀放置，减少冲突的要求了。<br />那length是偶数不就行了么，为什么一定要是2的N次方，这不就又回到第一点原因了么？JDK的工程师把各种位运算运用到了极致，想尽各种办法优化效率。

### 那么为什么默认是16呢？怎么不是4？不是8？

关于这个默认容量的选择，JDK并没有给出官方解释，那么这应该就是个经验值，既然一定要设置一个默认的2^n作为初始值，那么就需要在效率和内存使用上做一个权衡。这个值既不能太小，也不能太大。

太小了就有可能频繁发生扩容，影响效率。太大了又浪费空间，不划算。

16就作为一个经验值被采用了。

### 装载因子为0.75原因？为啥不设计为0.5或1.0？

装载因子，loadFactor的默认值为0.75f。负载因子衡量的是一个散列表的空间的使用程度。

- loadFactor=0.5<br />loadFactory越小，空间利用率低，数组中个存放的数据(entry)也就越少，表现得更加稀疏
- loadFactor=1.0

loadFactory越趋近于1，空间利用率高，那么数组中存放的数据（entry也就越来越多），数据也就越密集，也就会有更多的链表长度处于更长的数值，我们的查询效率就会越低，当我们添加数据，产生hash冲突的概率也会更高

默认的的负载因子0.75是对空间和时间效率的一个平衡选择

### HashMap允许空键空值么？

HashMap最多只允许一个键为Null(多条键为null的后面的会覆盖前面的)，但允许多个值为Null

### JDK7.0和JDK8.0的initialCapacity和threshold初始化区别？JDK11初始容量计算？

1. JDK7.0，初始化容量就是传进去的initialCapacity，首次put，调用inflateTable，将数组容量调整为2的幂次方
2. JDK8.0，初始化容量为传递进去的initialCapacity，大于initialCapacity最近的的2的n次幂，如3→4；
3. JDK8.0采用的多次右移运行得到2的n次幂；JDK11初始容量的位运算是通过补码，性能大于JDK8.0

见：[HashMap在JDK8和JDK11的容量计算算法tableSizeFor分析](https://blog.csdn.net/itsonglin/article/details/119212493)

### JDK7.0  HashMap 怎么在链表上添加数据，在链表的前⾯还是链表的后⾯？

头插法

### JDK7.0 HashMap 是怎么预防和解决 Hash 冲突的？

二次哈希 + 拉链法

### JDK7.0 HashMap 默认容量是多少？为什么是 16 可以是 15 吗？

1. 默认容量 16
2. 不可以是15，必须是2的幂次方，这样可以更好的减少hash冲突

### JDK7.0 HashMap 的数组是什么时候创建的？

首次put的时候

### JDK7.0 和 JDK8.0 HashMap 数据结构有什么不同？

- JDK7.0，由”数组+链表“组成，数组是HashMap的主体，链表则是主要为了解决哈希冲突而存在的<br />![](https://note.youdao.com/yws/res/100743/D94F0EFA3AA44FE89D7F42737E87FEF9#id=yfAKB&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687480783201-a133a219-64fd-4086-b0b3-1be0e509ad29.png#averageHue=%23050404&clientId=u0ccb56ef-5d2f-4&from=paste&id=ude5dfaaa&originHeight=818&originWidth=1098&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u600ee738-ceda-4b64-8c2e-bbf2fe625f5&title=)
- JDK8.0中，有“数组+链表+红黑树”组成。当链表过长，则会严重影响HashMap的性能，红黑树搜索时间复杂度是O(logn)，而链表是O(n)。因此，JDK8.0对数据结构做了进一步的优化，引入了红黑树，链表和红黑树在达到一定条件会进行转换<br />![](https://note.youdao.com/yws/res/100747/DCB9ACFB45E54026A7795D631D3A3813#id=wv3AW&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=) ![](https://cdn.nlark.com/yuque/0/2023/png/694278/1687480788735-b702b9b0-7b4c-40bc-9302-dff77a24b7f6.png#averageHue=%23050504&clientId=u0ccb56ef-5d2f-4&from=paste&id=u2a898f8c&originHeight=816&originWidth=948&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u81b7466c-2e75-425a-b339-d0519acc75b&title=)
  - 当链表超过8且数组长度(数据总量)超过64才会转为红黑树
  - 链表超过8，将链表转换成红黑树前会判断，如果当前数组的长度小于64，那么会选择先进行数组扩容，而不是转换为红黑树，以减少搜索时间

### JDK8.0 HashMap 往链表上插⼊数据的⽅式和 JDK7.0 有什么不同？

- JDK7.0是头插法，插入到链表的最前面
- JDK8.0是尾插法，插入到链表的最后面

### JDK8.0 HashMap 什么时候会把链表转化为红⿊树？为什么Map桶中节点个数超过8才转为红黑树？

链表长度超过8；并且数组长度不小于64

**为什么Map桶中节点个数超过8才转为红黑树？**<br />树节点占用空间是普通Node的两倍，如果链表节点不够多却转换成红黑树，无疑会耗费大量的空间资源，并且在随机hash算法下的所有bin节点分布频率遵从泊松分布，链表长度达到8的概率只有0.00000006，几乎是不可能事件，所以8的计算是经过重重科学考量的<br />- 从平均查找长度来看，红黑树的平均查找长度是logn，如果长度为8，则logn=3，而链表的平均查找长度为n/4，长度为8时，n/2=4，所以阈值8能大大提高搜索速度<br />- 当长度为6时红黑树退化为链表是因为logn=log6约等于2.6，而n/2=6/2=3，两者相差不大，而红黑树节点占用更多的内存空间，所以此时转换最为友好

### 为什么JDK8.0改用红黑树？

比如某些人通过找到你的hash碰撞值，来让你的HashMap不断地产生碰撞，那么相同key位置的链表就会不断增长，当你需要对这个HashMap的相应位置进行查询的时候，就会去循环遍历这个超级大的链表，性能及其地下。Java8使用红黑树来替代超过8个节点数的链表后，查询方式性能得到了很好的提升，从原来的是O(n)到O(logn)。

### JDK8.0 拉链法导致的链表过深问题为什么不用二叉查找树代替，而选择红黑树？为什么不一直使用红黑树？

之所以选择红黑树是为了解决二叉查找树的缺陷，二叉查找树在特殊情况下会退化为链表（这就跟原来使用链表结构一样了，造成很深的问题），遍历查找会非常慢。

而红黑树在插入新数据后可能需要通过左旋，右旋、变色这些操作来保持平衡，引入红黑树就是为了查找数据快，解决链表查询深度的问题，我们知道红黑树属于平衡二叉树，但是为了保持“平衡”是需要付出代价的，但是该代价所损耗的资源要比遍历线性链表要少，所以当长度大于8的时候，会使用红黑树，如果链表长度很短的话，根本不需要引入红黑树，引入反而会慢。

### JDK8.0 HashMap 扩容后存储位置的计算⽅式？和 JDK7.0 相比有什么不同？

- JDK7.0 再次`indexFor(n, length)`找到数组索引

```java
static int indexFor(int h, int length) {
    // assert Integer.bitCount(length) == 1 : "length must be a non-zero power of 2";
    return h & (length-1);
}
```

- JDK8.0 不需要再次indexFor，直接`n & length`，看结果是0表示索引未动，不为0表示需要移动

使用的是2次幂的扩展(指长度扩为原来2倍)，所以，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置；JDK8.0，只需要看看原来的hash值新增的那个bit是1还是0就好了，是0的话索引没变，是1的话索引变成“原索引+oldCap”

### 解决hash冲突的办法有哪些？HashMap用的哪种？

- 何为hash冲突？

> hash冲突就是在操作哈希表（散列表）的时候，不同的key值经过hash函数（散列算法）之后得到相同的hash值，那么一个位置没法放置两份value，这种情况就是hash冲突。

- 解决hash冲突

> 解决hash冲突方法有：**开放定址法**、**再哈希法**、**链地址法（HashMap中常见的拉链法）**、**建立公共溢出区**。

- HashMap中采用的是**链地址法**。

1. 开放地址法（open addressing）

也称为再散列法，基本思想就是，如果p=H(key)出现冲突时，则以p为基础，再次hash，p1=H(p)，如果p1再次出现冲突，则以p1为基础，以此类推，直到找到一个不冲突的哈希地址pi。因此开放定址法所需要的hash表的长度要大于等于所需要存放的元素，而且因为存在再次hash，所以只能在删除的节点上做标记，而不能真正删除节点

> 通过计算出来冲突的hash值进行再次的运算，直到得到可用的地址

2. 再哈希法（再散列）

提供多个hash函数，冲突时使用其他的hash函数再次运算。

> 这样做虽然不易产生堆集，但增加了计算的时间。

3. 链地址法

链地址法（拉链法），将哈希值相同的元素构成一个同义词的单链表，并将单链表的头指针存放在哈希表的第i个单元中，查找、插入和删除主要在同义词链表中进行，链表法适用于经常进行插入和删除的情况。

> 就是在哈希表中，针对相同的hash值使用链表的方式来存放

4. 建立公共溢出区

建立公共溢出区，将哈希表分为公共表和溢出表，当溢出发生时，将所有溢出数据统一放到溢出区

> 开放定址法和再哈希法的区别：开放定址法只能使用同一种hash函数进行再次hash，再哈希法可以调用多种不同的hash函数进行再次hash

### JDK8.0 中做了哪些优化优化？

1. 数组+链表改成了数组+链表或红黑树，如果链表的长度超过了8，那么链表将转换为红黑树。（桶的数量必须大于64，小于64的时候只会扩容）
2. 发生hash碰撞时，JDK7.0 会在链表的头部插入，而JDK8.0会在链表的尾部插入
3. 扩容的时候7.0需要对原数组中的元素进行重新hash定位在新数组的位置，8.0采用更简单的判断逻辑，`位置不变`或`索引+旧容量大小`
4. 在插入时，7.0先判断是否需要扩容，再插入，8.0先进行插入，插入完成再判断是否需要扩容

### HashMap线程安全方面会出现什么问题？

#### 1、数据覆盖问题

两个线程执行put()操作时，可能导致数据覆盖。JDK7版本和JDK8版本的都存在此问题。

以JDK7.0为例，假设A、B两个线程同时执行put()操作，且两个key都指向同一个buekct，那么此时两个结点，都会做头插法。 先看这里的代码实现：

```java
public V put(K key, V value) {
    ...
    addEntry(hash, key, value, i);
}
void addEntry(int hash, K key, V value, int bucketIndex) {
    ...
    createEntry(hash, key, value, bucketIndex);
}
void createEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex];
    table[bucketIndex] = new Entry<>(hash, key, value, e);
    size++;
}
```

看下最后的createEntry()方法，首先获取到了bucket上的头结点，然后再将新结点作为bucket的头部，并指向旧的头结点，完成一次头插法的操作。

当线程A和线程B都获取到了bucket的头结点后，若此时线程A的时间片用完，线程B将其新数据完成了头插法操作，此时轮到线程A操作，但这时线程A所据有的旧头结点已经过时了（并未包含线程B刚插入的新结点），线程A再做头插法操作，就会抹掉B刚刚新增的结点，导致数据丢失。

其实不光是put()操作，删除操作、修改操作，同样都会有覆盖问题。

#### 2、扩容时导致死循环（JDK7.0才有）

只有JDK7及以前的版本会存在死循环现象，在JDK8中，resize()方式已经做了调整，使用两队链表，且都是使用的尾插法，及时多线程下，也顶多是从头结点再做一次尾插法，不会造成死循环。而JDK7能造成死循环，就是因为resize()时使用了头插法，将原本的顺序做了反转，才留下了死循环的机会。

过程见: [HashMap 扩容时导致的死循环](https://juejin.cn/post/6844904013909983245#heading-24)

#### 如何规避HashMap的线程不安全？

1. Collections.SynchronizedMap()

```java
Map<String, Integer> testMap = new HashMap<>();
// 转为线程安全的map
Map<String, Integer> map = Collections.synchronizedMap(testMap);
```

2. 使用ConcurrentHashMap
   - JDK7.0 Lock+segment分段锁
   - JDK8.0 synchronized

## Reference

-  [x] [JDK7.0下载](https://www.oracle.com/java/technologies/javase/javase7-archive-downloads.html)
-  [x] [JDK7.0下载（国内镜像）](https://files-cdn.liferay.com/mirrors/download.oracle.com/otn-pub/java/jdk/7u80-b15/jdk-7u80-macosx-x64.dmg)
-  [x] HashMap夺命14问，你能坚持到第几问？<br /><https://juejin.cn/post/7077363148281348126>
-  [ ] Java HashMap工作原理及实现<br />[http://yikun.github.io/2015/04/01/Java-HashMap工作原理及实现/](http://yikun.github.io/2015/04/01/Java-HashMap%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/)
-  [x] HashMap面试题，看这一篇就够了！<br /><https://juejin.cn/post/6844904013909983245>
-  [ ] Java 8系列之重新认识HashMap （美团）<br /><https://tech.meituan.com/2016/06/24/java-hashmap.html>
