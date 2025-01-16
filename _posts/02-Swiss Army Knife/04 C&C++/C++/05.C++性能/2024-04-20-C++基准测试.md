---
date created: 2024-04-20 01:01
date updated: 2024-12-27 23:52
dg-publish: true
---

# C++的可视化基准测试

1.利用工具： `chrome://tracing` （Chrome 浏览器自带的一个工具，将该网址输入即可）
2.基本原理： cpp的计时器配合自制简易json配置写出类，将时间分析结果写入一个json文件，用`chrome://tracing` 这个工具进行可视化 。
