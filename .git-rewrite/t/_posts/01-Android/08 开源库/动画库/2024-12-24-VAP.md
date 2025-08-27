---
date created: 2024-12-24 00:36
date updated: 2024-12-24 00:36
dg-publish: true
---

## VAP遇到的问题

### onFailed errorType:10005, errorMsg:0x5 parse config fail

从服务器上下载的视频无法播放（或播放内容严重错误）。经过调试，发现是服务器对mp4文件进行了修改（比如压缩），导致vapc节点丢失，播放失败（Android上会有此日志：vapc box head not found 或错误 10005 0x5 parse config fail ）。<br />从网络上下载的素材，强烈建议进行md5校验，在工具导出的时候已经生成了一份md5，播放前需要进行md5的校验，防止播放被篡改的文件。至于服务器篡改mp4文件问题，需要自己业务负责修正。<br />也可能是放的文件错了，我们这边就遇到放了svga的导致播放不了

### 视频播放出现10002错误

如果出现此错误：onFailed errorType=10002, errorMsg=0x2 MediaCodec exception<br />先检查下是否视频分辨率过高，比如达到2k或4k分辨率，低端机器视频分辨率过高会导致解码失败，解决方法：减小原始素材的分辨率，不要超过1504。
