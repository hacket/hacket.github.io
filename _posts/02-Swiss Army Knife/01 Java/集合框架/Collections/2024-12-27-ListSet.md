---
date created: 2024-12-27 23:38
date updated: 2024-12-27 23:39
dg-publish: true
---

# Java 集合框架

![ ](https://cdn.nlark.com/yuque/0/2022/gif/694278/1666144636723-40336ef5-ac02-40ff-bf43-739a8563cb2f.gif#averageHue=%23f1e9c5&clientId=ue1fa66d5-a8c6-4&from=paste&height=476&id=u2f2792bb&originHeight=611&originWidth=643&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7729fb0c-5daf-4917-862b-3b5e0b95182&title=&width=501)

# List

## LinkedList

见队列中`LinkedList`介绍

## ArrayList和LinkedList

### ArrayList和Linkedlist区别？

**ArrayList**

1. 优点：ArrayList是基于动态数组实现的，地址连续，查询操作效率高
2. 缺点：因为地址连续，ArrayList要移动数据，所以插入和删除操作效率比较低

**LinkedList**

1. 优点：LinkedList是基于链表的，地址是任意的，不需要连续的内存地址空间，对新增和删除操作比ArrayList效率高。LinkedList适用于要头尾操作或插入指定位置的场景
2. 缺点：LinkedList要移动指针，查询操作性能比较低

**适用场景**

- 对数据进行快速访问的情况下用ArrayList；对数据进行多次增删修改时用LinkedList

### ArrayList和LinkedList初始化容量是多少？如何扩容的？

- ArrayList初始容量为10，可在初始化时指定容量，避免动态扩容的开销；ArrayList扩容规则是，扩容后的大小=原始大小+原始大小/2+1（比如原始10，扩容后10+5+1=16）
- LinkedList是一个双向链表，没有初始化大小，也没有扩容机制，就是一直在前或后面新增节点

# Set

## HashSet和TreeSet

**TreeSet**<br />TreeSet是基于红黑树实现的，TreeSet中的数据是自动排好序的，不允许放null；底层实现是TreeMap<br />**HashSet**<br />HashSet是基于哈希表实现的，HashSet中的数据是无序的可以放入null，但只能放入一个null；HashSet要求放入的对象必须实现hashCode方法，因为放入的对象是以hashCode码作为标识的；底层实现是HashMap<br />**适用场景**<br />HashSet基于hash算法实现的，性能通常由于TreeSet，为快速查找而设计的，一般情况下我们都应该使用HashSet；只有需要排序时，才使用TreeSet

## CopyOnWriteArraySet
