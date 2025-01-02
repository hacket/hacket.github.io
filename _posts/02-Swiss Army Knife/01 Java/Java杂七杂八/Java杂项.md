---
date created: 2024-12-27 23:41
date updated: 2024-12-27 23:41
dg-publish: true
---

- [ ] [Java核心技术面试精讲](https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/Java%20%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E9%9D%A2%E8%AF%95%E7%B2%BE%E8%AE%B2)

# 运行一串 java 代码时，系统怎么处理的？

> 题目等价于Java代码怎么运行的？JVM 是怎样运行 Java 代码的呢？

1. 通过 javac 命令将 .java 源文件编译为字节码（文件后缀名为 .class）
2. 通过java启动一个JVM将其运行起来
3. JVM运行字节码文件之前，有一个类加载器，将编译的字节码文件加载到JVM中，加载到方法区
4. 通过字节码执行引擎，来按需执行那些加载到内存中的类

> [我们编写的Java代码到底是如何运行起来的?](https://blog.prger.com/2021/05/01/%E6%88%91%E4%BB%AC%E7%BC%96%E5%86%99%E7%9A%84Java%E4%BB%A3%E7%A0%81%E5%88%B0%E5%BA%95%E6%98%AF%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E8%B5%B7%E6%9D%A5%E7%9A%84/) [你知道 Java 代码是如何运行的吗？](https://zhuanlan.zhihu.com/p/92906774)

# Java事务

## 什么是事务？

事务（Transaction）是并发控制单位，是用户定义的一个操作序列，这些操作要么都做，要么都不做，是一个不可分割的工作单位。

## 事务的特性？

事务必须服从ISO/IEC所制定的ACID原则。ACID是原子性（atomicity）、一致性（consistency）、隔离性 （isolation）和持久性（durability）的缩写。<br>1、原子性（Atomicity）：<br>事务是一个完整的操作。事务的各步操作是不可分的（原子的）；要么都执行，要么都不执行。<br>2、一致性（Consistency）：<br>当事务执行失败时，所有被该事务影响的数据都应该恢复到事务执行前的状态。<br>3、隔离性（Isolation）：<br>对数据进行修改的所有并发事务是彼此隔离的，这表明事务必须是独立的，它不应以任何方式依赖于或影响其他事务。<br>4、持久性(Durability)：<br>事务完成后，它对数据库的修改被永久保持，事务日志能够保持事务的持久性。

通俗的理解，事务是一组原子操作单元，从数据库角度说，就是一组SQL指令，要么全部执行成功，若因为某个原因其中一条指令执行有错误，则撤销先前执行过的所有指令。更简答的说就是：要么全部执行成功，要么撤销不执行。

# Socket

## 什么是Socket？

网络协议是分层次的，从HTTP ->TCP/UDP ->IP ->MAC层，实现了对数据的封装和分发。而套接字Socket，实际上是以门面模式实现对TCP/IP协议的封装。

## Socket怎么验证安全性？

SSLSocket和SSLServerSocket

SSLContext这个类是对安全套接字协议的实现，并扮演了一个安全套接字工厂的角色。

## WebSocket？

# 随机数Random

## 随机1-10的值

```java
public static void main(String[] args) {
    Random random = new Random();
    for (int i = 0; i < 20; i++) {
        System.out.println(random.nextInt(10)+1);
    }
}
```

## 随机0-10的值

```java
public static void main(String[] args) {
    Random random = new Random();
    for (int i = 0; i < 20; i++) {
        System.out.println(random.nextInt(11));
    }
}
```

# Java序列化

## 序列化和反序列化

### 序列化

将数据结构或对象转换成二进制串的过程

### 反序列化

将在序列化过程中所生成的二进制串转换成数据结构或者对象的过程

### 几种常见的序列化和反序列化协议

1. XML&SOAP
2. JSON
3. Protobuf

## Serializable接口

是 Java 提供的序列化接口，它是一个空接口

```java
public interface Serializable {
}
```

Serializable 用来标识当前类可以被 ObjectOutputStream 序列化，以及被 ObjectInputStream 反序列<br>化。

### Serializable特点

1. 可序列化类中，未实现 Serializable 的属性状态无法被序列化/反序列化
2. 要有个空参数构造函数
3. 一个实现序列化的类，它的子类也是可序列化的

```java
public class Student implements Serializable {
    // serialVersionUID唯一标识了一个可序列化的类
    private static final long serialVersionUID = -2100492893943893602L;
    
    private String name;
    private String sax;
    private Integer age;
    // Course也需要实现Serializable接口
    private List<Course> courses;
    
    // 用transient关键字标记的成员变量不参与序列化(在被反序列化后，transient 变量的值被设为初始值，如 int 型的是 0，对象型的是 null)
    private transient Date createTime;
    
    // 静态成员变量属于类不属于对象，所以不会参与序列化(对象序列化保存的是对象的“状态”，也
    就是它的成员变量，因此序列化不会关注静态变量)
    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat();
   
    public Student() {
        System.out.println("Student: empty");
    }
    public Student(String name, String sax, Integer age) {
        System.out.println("Student: " + name + " " + sax + " " + age);
        this.name = name;
        this.sax = sax;
        this.age = age;
        courses = new ArrayList<>();
        createTime = new Date();
    }
    //...
}
// Course也需要实现Serializable接口
public class Course implements Serializable {
    private static final long serialVersionUID = 667279791530738499L;
    private String name;
    private float score;
    // ...
}
```

### serialVersionUID与兼容性

- serialVersionUID的作用

serialVersionUID 用来表明类的不同版本间的兼容性。如果你修改了此类，要修改此值。否则以前用老版本的类序列化的类恢复时会报错:InvalidClassException

- 设置方式

在JDK中，可以利用JDK的bin目录下的serialver.exe工具产生这个serialVersionUID，对于Test.class，执行命令：`serialver Test`

- 兼容性问题

为了在反序列化时，确保类版本的兼容性，最好在每个要序列化的类中加入 private static final long serialVersionUID这个属性，具体数值自己定义。这样，即使某个类在与之对应的对象 已经序列化出去后做了修改，该对象依然可以被正确反序列化。否则，如果不显式定义该属性，这个属性值将由JVM根据类的相关信息计算，而修改后的类的计算 结果与修改前的类的计算结果往往不同，从而造成对象的反序列化因为类版本不兼容而失败。不显式定义这个属性值的另一个坏处是，不利于程序在不同的JVM之间的移植。因为不同的编译器实现该属性值的计算策略可能不同，从而造成虽然类没有改变，但是因为JVM不同，出现因类版本不兼容而无法正确反序列化的现象出现

## Externalizable接口

```java
public interface Externalizable extends Serializable {
    void writeExternal(ObjectOutput var1) throws IOException;
    void readExternal(ObjectInput var1) throws IOException, ClassNotFoundException;
}
```

简单使用：

```java
public class Course1 implements Externalizable {
    private static final long serialVersionUID = 667279791530738499L;
    private String name;
    private float score;
    // ...
    @Override
    public void writeExternal(ObjectOutput objectOutput) throws IOException {
        System.out.println("writeExternal");
        objectOutput.writeObject(name);
        objectOutput.writeFloat(score);
    }
    @Override
    public void readExternal(ObjectInput objectInput) throws IOException, ClassNotFoundException {
        System.out.println("readExternal");
        name = (String)objectInput.readObject();
        score = objectInput.readFloat();
    }
    // ...
    public static void main(String... args) throws Exception {
        Course1 course = new Course1("英语", 12f);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(out);
        oos.writeObject(course);
        course.setScore(78f);
        oos.close();
        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(bs));
        Course1 course1 = (Course1) ois.readObject();
        System.out.println("course1: " + course1);
    }
}
```

# 杂症

## 1、i++ 是线程安全的吗？

1. 如果是方法里定义的，一定是线程安全的，因为每个方法栈是线程私有的，JVM的栈是线程私有的，所以每个栈帧上定义的局部变量也是线程私有的，意味着是线程安全的。
2. 如果是类的成员变量，i++则不是线程安全的，因为i++会被编译成几句字节码语句执行
   1. 不是原子的，因为这个是分为三步，读值，+1，写值。在这三步任何之间都可能会有CPU调度产生，造成i的值被修改，造成脏读脏写
   2. volatile不能解决这个线程安全问题。因为volatile只能保证可见性，不能保证原子性。
3. 解决
   1. 锁：用synchronized或者ReentrantLock都可以解决这个问题。这里还可以比较下这两种方式的优劣。教科书式的比较结束后，来一句“我认为一般使用synchronized更好，因为JVM团队一直以来都在优先改进这个机制，可以尽早获得更好的性能，并且synchronized对大多数开发人员来说更加熟悉，方便代码的阅读”。讲讲JVM对synchronized的优化。
   2. AtomicInteger 为什么AtomicInteger使用CAS完成？因为传统的锁机制需要陷入内核态，造成上下文切换，但是一般持有锁的时间很短，频繁的陷入内核开销太大，所以随着机器硬件支持CAS后，JAVA推出基于compare and set机制的AtomicInteger，实际上就是一个CPU循环忙等待。因为持有锁时间一般较短，所以大部分情况CAS比锁性能更优。（最初是没有CAS，只有陷入内核态的锁，这种锁当然也需要硬件的支持。后来硬件发展了，有了CAS锁，把compare 和 set 在硬件层次上做成原子的，才有了CAS锁。）
