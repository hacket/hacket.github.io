---
date created: 2024-06-11 20:15
date updated: 2024-12-24 00:33
dg-publish: true
---

# Direct Boot mode

Android 7.0引入了Direct Boot模式，用于在设备启动但用户尚未解锁时运行应用程序。系统提供了几种存储位置来支持Direct Boot模式，包括凭据加密存储和设备加密存储。应用可以通过注册为加密感知（encryption aware）来在Direct Boot模式下运行，并在需要时访问设备加密存储。此外，Android还提供了API和工具，用于管理数据迁移和测试加密感知应用。

## Ref

- [支持“直接启动”模式  |  App quality  |  Android Developers](https://developer.android.com/privacy-and-security/direct-boot)
- [android 11 的directboot mode这个机制 android:directbootaware](https://blog.51cto.com/u_16099277/8536840)
