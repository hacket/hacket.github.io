---
date created: 2024-05-31 14:15
date updated: 2024-12-24 00:40
dg-publish: true
---

从 Android API28开始，AMS 向客户端进程有关 Activity 部分的通信封装成一个统一的 Transaction 来操作，不再直接使用客户端进程 `ApplicationThread` 的本地代理了。
