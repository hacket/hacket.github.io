---
date created: Friday, December 27th 2024, 11:47:00 pm
date updated: Saturday, January 4th 2025, 12:25:32 am
title: Python并发
dg-publish: true
layout: post
categories:
  - Python
image-auto-upload: true
feed: show
format: list
aliases: [进程]
linter-yaml-title-alias: 进程
category: python
---

Python 中实现并发编程的三种方案：`多线程`、`多进程` 和 `异步I/O`。并发编程的好处在于可以提升程序的执行效率以及改善用户体验；坏处在于并发的程序不容易开发和调试，同时对其他程序来说它并不友好。#

# 进程

Unix 和 Linux 操作系统上提供了 `fork()` 系统调用来创建进程，调用 `fork()` 函数的是父进程，创建出的是子进程，子进程是父进程的一个拷贝，但是子进程拥有自己的 PID。`fork()` 函数非常特殊它会返回两次，父进程中可以通过 `fork()` 函数的返回值得到子进程的 PID，而子进程中的返回值永远都是 0。Python 的 os 模块提供了 `fork()` 函数。由于 Windows 系统没有 `fork()` 调用，因此要实现跨平台的多进程编程，可以使用 multiprocessing 模块的 `Process` 类来创建子进程，而且该模块还提供了更高级的封装，例如批量启动进程的进程池（`Pool`）、用于进程间通信的队列（`Queue`）和管道（`Pipe`）等。

## os

Python 的 os 模块封装了常见的系统调用，其中就包括 fork，可以在 Python 程序中轻松创建子进程：

```python
import os

print('Process (%s) start...' % os.getpid())
# Only works on Unix/Linux/Mac:
pid = os.fork()
if pid == 0:
    print('I am child process (%s) and my parent is %s.' % (os.getpid(), os.getppid()))
else:
    print('I (%s) just created a child process (%s).' % (os.getpid(), pid))
```

结果：

> Process (876) start…

(876) just created a child process (877).

am child process (877) and my parent is 876.

由于 Windows 没有 fork 调用，上面的代码在 Windows 上无法运行。

## Process

`multiprocessing` 模块就是跨平台版本的多进程模块。multiprocessing 模块提供了一个 Process 类来代表一个进程对象

```python
from multiprocessing import Process
import os

# 子进程要执行的代码
def run_proc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Process(target=run_proc, args=('test',))
    print('Child process will start.')
    p.start()
    p.join()
    print('Child process end.')
```

结果：

> Parent process 928.

Child process will start.

Run child process test (929)…

Process end.

示例：使用多进程的方式将两个下载任务放到不同的进程中

```python
from multiprocessing import Process
from os import getpid
from random import randint
from time import time, sleep


def download_task(filename):
    print('启动下载进程，进程号[%d].' % getpid())
    print('开始下载%s...' % filename)
    time_to_download = randint(5, 10)
    sleep(time_to_download)
    print('%s下载完成! 耗费了%d秒' % (filename, time_to_download))


def main():
    start = time()
    p1 = Process(target=download_task, args=('Python从入门到住院.pdf', ))
    p1.start()
    p2 = Process(target=download_task, args=('Peking Hot.avi', ))
    p2.start()
    p1.join()
    p2.join()
    end = time()
    print('总共耗费了%.2f秒.' % (end - start))


if __name__ == '__main__':
    main()
```

### Pool

如果要启动大量的子进程，可以用进程池的方式批量创建子进程：

```python
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(long_time_task, args=(i,))
    print('Waiting for all subprocesses done...')
    p.close()
    p.join()
    print('All subprocesses done.')
```

### 子进程

`subprocess` 模块可以让我们非常方便地启动一个子进程，然后控制其输入和输出。

```python
import subprocess

print('$ nslookup www.python.org')
r = subprocess.call(['nslookup', 'www.python.org'])
print('Exit code:', r)
```

如果子进程还需要输入，则可以通过 communicate() 方法输入：

```python
import subprocess

print('$ nslookup')
p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
print(output.decode('utf-8'))
print('Exit code:', p.returncode)
```

### 进程间通信

```python
from multiprocessing import Process
from time import sleep

counter = 0


def sub_task(string):
    global counter
    while counter < 10:
        print(string, end='', flush=True)
        counter += 1
        sleep(0.01)

        
def main():
    Process(target=sub_task, args=('Ping', )).start()
    Process(target=sub_task, args=('Pong', )).start()


if __name__ == '__main__':
    main()
```

上面的代码存在多进程问题。

使用 multiprocessing 模块中的 Queue 类，它是可以被多个进程共享的队列，底层是通过管道和信号量（semaphore）机制来实现的。

## 分布式进程

# 多线程

Python 的线程是真正的 Posix Thread，而不是模拟出来的线程。

Python 的标准库提供了两个模块：`_thread` 和 `threading`，`_thread` 是低级模块，`threading` 是高级模块，对 `_thread` 进行了封装。绝大多数情况下，我们只需要使用 `threading` 这个高级模块。

## threading

示例：多线程下载

```python
from random import randint
from threading import Thread
from time import time, sleep


def download(filename):
    print('开始下载%s...' % filename)
    time_to_download = randint(5, 10)
    sleep(time_to_download)
    print('%s下载完成! 耗费了%d秒' % (filename, time_to_download))


def main():
    start = time()
    t1 = Thread(target=download, args=('Python从入门到住院.pdf',))
    t1.start()
    t2 = Thread(target=download, args=('Peking Hot.avi',))
    t2.start()
    t1.join()
    t2.join()
    end = time()
    print('总共耗费了%.3f秒' % (end - start))


if __name__ == '__main__':
    main()
```

也可以继承 `Thread` 来实现：

```python
from random import randint
from threading import Thread
from time import time, sleep


class DownloadTask(Thread):

    def __init__(self, filename):
        super().__init__()
        self._filename = filename

    def run(self):
        print('开始下载%s...' % self._filename)
        time_to_download = randint(5, 10)
        sleep(time_to_download)
        print('%s下载完成! 耗费了%d秒' % (self._filename, time_to_download))


def main():
    start = time()
    t1 = DownloadTask('Python从入门到住院.pdf')
    t1.start()
    t2 = DownloadTask('Peking Hot.avi')
    t2.start()
    t1.join()
    t2.join()
    end = time()
    print('总共耗费了%.2f秒.' % (end - start))


if __name__ == '__main__':
    main()
```

## lock 锁

```python
from time import sleep
from threading import Thread, Lock


class Account(object):

    def __init__(self):
        self._balance = 0
        self._lock = Lock()

    def deposit(self, money):
        # 先获取锁才能执行后续的代码
        self._lock.acquire()
        try:
            new_balance = self._balance + money
            sleep(0.01)
            self._balance = new_balance
        finally:
            # 在finally中执行释放锁的操作保证正常异常锁都能释放
            self._lock.release()

    @property
    def balance(self):
        return self._balance


class AddMoneyThread(Thread):

    def __init__(self, account, money):
        super().__init__()
        self._account = account
        self._money = money

    def run(self):
        self._account.deposit(self._money)


def main():
    account = Account()
    threads = []
    for _ in range(100):
        t = AddMoneyThread(account, 1)
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    print('账户余额为: ￥%d元' % account.balance)


if __name__ == '__main__':
    main()
```

## ThreadLocal

```python
import threading
    
# 创建全局ThreadLocal对象:
local_school = threading.local()

def process_student():
    # 获取当前线程关联的student:
    std = local_school.student
    print('Hello, %s (in %s)' % (std, threading.current_thread().name))

def process_thread(name):
    # 绑定ThreadLocal的student:
    local_school.student = name
    process_student()

t1 = threading.Thread(target= process_thread, args=('Alice',), name='Thread-A')
t2 = threading.Thread(target= process_thread, args=('Bob',), name='Thread-B')
t1.start()
t2.start()
t1.join()
t2.join()
```

ThreadLocal 最常用的地方就是为每个线程绑定一个数据库连接，HTTP 请求，用户身份信息等，这样一个线程的所有调用到的处理函数都可以非常方便地访问这些资源。

# 单线程 + 异步 I/O

## 背景

代操作系统对 I/O 操作的改进中最为重要的就是支持异步 I/O。如果充分利用操作系统提供的异步 I/O 支持，就可以用单进程单线程模型来执行多任务，这种全新的模型称为**事件驱动模型**。Nginx 就是支持异步 I/O 的 Web 服务器，它在单核 CPU 上采用单进程模型就可以高效地支持多任务。在多核 CPU 上，可以运行多个进程（数量与 CPU 核心数相同），充分利用多核 CPU。用 Node.js 开发的服务器端程序也使用了这种工作模式，这也是当下并发编程的一种流行方案。

在 Python 语言中，单线程 + 异步 I/O 的编程模型称为**协程**，有了协程的支持，就可以基于事件驱动编写高效的多任务程序。协程最大的优势就是极高的执行效率，因为子程序切换不是线程切换，而是由程序自身控制，因此，没有线程切换的开销。协程的第二个优势就是不需要多线程的锁机制，因为只有一个线程，也不存在同时写变量冲突，在协程中控制共享资源不用加锁，只需要判断状态就好了，所以执行效率比多线程高很多。如果想要充分利用 CPU 的多核特性，最简单的方法是多进程 + 协程，既充分利用多核，又充分发挥协程的高效率，可获得极高的性能。

同步 IO：IO 挂起时，CPU 阻塞了，做不了其他事情

异步 IO：IO 挂起时，CPU 不阻塞

## 异步 IO

同步 IO 模型的代码是无法实现异步 IO 模型的。

异步 IO 模型需要一个消息循环，在消息循环中，主线程不断地重复 " 读取消息 - 处理消息 " 这一过程。

消息模型是如何解决同步 IO 必须等待 IO 操作这一问题的呢？当遇到 IO 操作时，代码只负责发出 IO 请求，不等待 IO 结果，然后直接结束本轮消息处理，进入下一轮消息处理过程。当 IO 操作完成后，将收到一条 "IO 完成 " 的消息，处理该消息时就可以直接获取 IO 操作结果。

在 " 发出 IO 请求 " 到收到 "IO 完成 " 的这段时间里，同步 IO 模型下，主线程只能挂起，但异步 IO 模型下，主线程并没有休息，而是在消息循环中继续处理其他消息。这样，在异步 IO 模型下，一个线程就可以同时处理多个 IO 请求，并且没有切换线程的操作。对于大多数 IO 密集型的应用程序，使用异步 IO 将大大提升系统的多任务处理能力。

## 协程

Python 对协程的支持是通过 `generator` 实现的。在 generator 中，我们不但可以通过 for 循环来迭代，还可以不断调用 `next()` 函数获取由 yield 语句返回的下一个值。但是 Python 的 `yield` 不但可以返回一个值，它还可以接收调用者发出的参数。

示例：协程实现生产者消费者模型

```python
def consumer():
    r = ''
    while True:
        n = yield r
        if not n:
            return
        print('[CONSUMER] Consuming %s...' % n)
        r = '200 OK'

def produce(c):
    c.send(None)
    n = 0
    while n < 5:
        n = n + 1
        print('[PRODUCER] Producing %s...' % n)
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    c.close()

c = consumer()
produce(c)
```

结果：

[PRODUCER] Producing 1…

[CONSUMER] Consuming 1…

[PRODUCER] Consumer return: 200 OK

[PRODUCER] Producing 2…

[CONSUMER] Consuming 2…

[PRODUCER] Consumer return: 200 OK

[PRODUCER] Producing 3…

[CONSUMER] Consuming 3…

[PRODUCER] Consumer return: 200 OK

[PRODUCER] Producing 4…

[CONSUMER] Consuming 4…

[PRODUCER] Consumer return: 200 OK

[PRODUCER] Producing 5…

[CONSUMER] Consuming 5…

[PRODUCER] Consumer return: 200 OK

注意到 `consumer` 函数是一个 `generator`，把一个 `consumer` 传入 `produce` 后：

1. 首先调用 `c.send(None)` 启动生成器；
2. 然后，一旦生产了东西，通过 `c.send(n)` 切换到 `consumer` 执行；
3. `consumer` 通过 `yield` 拿到消息，处理，又通过 `yield` 把结果传回；
4. `produce` 拿到 `consumer` 处理的结果，继续生产下一条消息；
5. `produce` 决定不生产了，通过 `c.close()` 关闭 `consumer`，整个过程结束。

整个流程无锁，由一个线程执行，`produce` 和 `consumer` 协作完成任务，所以称为 " 协程 "，而非线程的抢占式多任务。

## asyncio`

`asyncio` 是 Python 3.4 版本引入的标准库，直接内置了对异步 IO 的支持。

`asyncio` 的编程模型就是一个消息循环。我们从 `asyncio` 模块中直接获取一个 `EventLoop` 的引用，然后把需要执行的协程扔到 `EventLoop` 中执行，就实现了异步 IO。

```python
import asyncio

@asyncio.coroutine
def wget(host):
    print('wget %s...' % host)
    connect = asyncio.open_connection(host, 80)
    reader, writer = yield from connect
    header = 'GET / HTTP/1.0\r\nHost: %s\r\n\r\n' % host
    writer.write(header.encode('utf-8'))
    yield from writer.drain()
    while True:
        line = yield from reader.readline()
        if line == b'\r\n':
            break
        print('%s header > %s' % (host, line.decode('utf-8').rstrip()))
    # Ignore the body, close the socket
    writer.close()

loop = asyncio.get_event_loop()
tasks = [wget(host) for host in ['www.sina.com.cn', 'www.sohu.com', 'www.163.com']]
loop.run_until_complete(asyncio.wait(tasks))
loop.close()
```

用 `asyncio` 提供的 `@asyncio.coroutine` 可以把一个 generator 标记为 coroutine 类型，然后在 coroutine 内部用 `yield from` 调用另一个 coroutine 实现异步操作。

- 多个协程并发是在同一个线程中
- 异步操作需要在 `coroutine` 中通过 `yield from` 完成；
- 多个 `coroutine` 可以封装成一组 Task 然后并发执行。

## async 和 await

为了简化并更好地标识异步 IO，从 Python 3.5 开始引入了新的语法 `async` 和 `await`，可以让 coroutine 的代码更简洁易读。

请注意，`async` 和 `await` 是针对 coroutine 的新语法，要使用新的语法，只需要做两步简单的替换：

1. 把 `@asyncio.coroutine` 替换为 `async`；
2. 把 `yield from` 替换为 `await`。

asyncio 写法：

```python
import asyncio

@asyncio.coroutine
def hello():
    print("Hello world!")
    # 异步调用asyncio.sleep(1):
    r = yield from asyncio.sleep(1)
    print("Hello again!")

# 获取EventLoop:
loop = asyncio.get_event_loop()
# 执行coroutine
loop.run_until_complete(hello())
loop.close()
```

async/await 写法：

```python
async def hello():
    print("Hello world!")
    r = await asyncio.sleep(1)
    print("Hello again!")

loop = asyncio.get_event_loop()
# 执行coroutine
loop.run_until_complete(hello())
loop.close()
```

## aiohttp

`asyncio` 可以实现单线程并发 IO 操作。如果仅用在客户端，发挥的威力不大。如果把 `asyncio` 用在服务器端，例如 Web 服务器，由于 HTTP 连接就是 IO 操作，因此可以用单线程 +`coroutine` 实现多用户的高并发支持。

`asyncio` 实现了 TCP、UDP、SSL 等协议，`aiohttp` 则是基于 `asyncio` 实现的 HTTP 框架。

先安装 `aiohttp`：

```shell
pip install aiohttp
```

编写一个 HTTP 服务器，分别处理以下 URL：

- `/` - 首页返回 `b'<h1>Index</h1>'`；
- `/hello/{name}` - 根据 URL 参数返回文本 `hello, %s!`。

```python
import asyncio

from aiohttp import web

async def index(request):
    await asyncio.sleep(0.5)
    return web.Response(body=b'<h1>Index</h1>')

async def hello(request):
    await asyncio.sleep(0.5)
    text = '<h1>hello, %s!</h1>' % request.match_info['name']
    return web.Response(body=text.encode('utf-8'))

async def init(loop):
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', index)
    app.router.add_route('GET', '/hello/{name}', hello)
    srv = await loop.create_server(app.make_handler(), '127.0.0.1', 8000)
    print('Server started at http://127.0.0.1:8000...')
    return srv

loop = asyncio.get_event_loop()
loop.run_until_complete(init(loop))
loop.run_forever()
```

注意 `aiohttp` 的初始化函数 `init()` 也是一个 `coroutine`，`loop.create_server()` 则利用 `asyncio` 创建 TCP 服务。

Python 还有很多用于处理并行任务的三方库，例如：`joblib`、`PyMP` 等。实际开发中，要提升系统的可扩展性和并发性通常有垂直扩展（增加单个节点的处理能力）和水平扩展（将单个节点变成多个节点）两种做法。可以通过消息队列来实现应用程序的解耦合，消息队列相当于是多线程同步队列的扩展版本，不同机器上的应用程序相当于就是线程，而共享的分布式消息队列就是原来程序中的 Queue。消息队列（面向消息的中间件）的最流行和最标准化的实现是 AMQP（高级消息队列协议），AMQP 源于金融行业，提供了排队、路由、可靠传输、安全等功能，最著名的实现包括：Apache 的 ActiveMQ、RabbitMQ 等。

要实现任务的异步化，可以使用名为 `Celery` 的三方库。`Celery` 是 Python 编写的分布式任务队列，它使用分布式消息进行工作，可以基于 RabbitMQ 或 Redis 来作为后端的消息代理。
