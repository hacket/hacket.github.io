---
date created: 2024-12-27 23:44
date updated: 2024-12-27 23:44
dg-publish: true
---

# 异常

## 主线程能捕获子线程的异常？

主线程中不能`try catch`子线程的异常

```java
public class CantCatchExp implements Runnable {
    public static void main(String[] args) throws InterruptedException {
        try {
            new Thread(new CantCatchExp(), "Thread-1").start();
            Thread.sleep(300);
            new Thread(new CantCatchExp(), "Thread-2").start();
            Thread.sleep(300);
            new Thread(new CantCatchExp(), "Thread-3").start();
            Thread.sleep(300);
            new Thread(new CantCatchExp(), "Thread-4").start();
        } catch (RuntimeException e) {
            System.out.println("GET EXCEPTION.11111");
        }

    }

    @Override
    public void run() {
        throw new RuntimeException();
    }
}
```

解决：

1. 在子线程中可能出错的代码中try catch
2. UncaughtExceptionHandler

## Error能捕获吗？

## StackOverflowError和OutOfMemoryError

**StackOverflowError**

1. 线程请求的栈深度大于虚拟机所允许的深度，抛出StackOverflowError
   - 递归可能会出现，特别是递归没有写程序出口
   - 不断创建线程也可能造成

**OOM**

1. 栈的深度可以自动扩展，扩展时无法申请到足够的内存时会抛出OOM
2. 堆中没有内存完成实例分配，且堆也无法再扩展时，抛出OOM
3. 方法区无法满足内存分配需求时，抛出OOM
4. 常量池无法再申请到内存时抛出OOM
5. 各个内存区域的总和大于物理内存限制（包括物理上的和操作系统级的限制），抛出OOM
