---
date created: 2024-12-27 23:49
date updated: 2024-12-27 23:49
dg-publish: true
tags:
  - "#!/usr/bin/env"
---

# Think python电子书

# python脚本案例

## jenkins打包时生成二维码

### 1. 先用pip安装qrcode库

```
curl https://bootstrap.pypa.io/get-pip.py | python3
pip install qrcode
```

### 2. 编码

```python
#!/usr/bin/env python
# encoding: utf-8

import qrcode
import sys
url = sys.argv[1]
qr = qrcode.QRCode(
    version=5,  # 二维码的大小，取值1-40
    box_size=10, # 二维码最小正方形的像素数量
    error_correction=qrcode.constants.ERROR_CORRECT_H, # 二维码的纠错等级
    border=5 # 白色边框的大小
)
qr.add_data(url) # 设置二维码数据
img = qr.make_image() # 创建二维码图片
img.save('QRCode.png') # 保存二维码
print("url:"+url)
```

### 3. 使用

```
python3 qrcodedemo.py "http://www.baidu.com"
```

## 适配android 12的android:exported="false"

写个脚本增加`android:exported="false"`的适配<br />�多语言工具<br />渠道包工具

## 快速批量统计aar包大小

<https://yuweiguocn.github.io/aar-size-summary/>

## 上传到蒲公英

## 多语言工具

## Python Git

## 获取ip

```python
import socket

# 获取本机计算机名称
hostname = socket.gethostname()
# 获取本机ip
ip = socket.gethostbyname(hostname)
print(ip)

# 或者
# import socket
# def get_host_ip():
#     """
#     查询本机ip地址
#     :return: ip
#     """
#     try:
#         s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#         s.connect(('8.8.8.8', 80))
#         ip = s.getsockname()[0]
#     finally:
#         s.close()
#
#     return ip
#
#
# if __name__ == '__main__':
#     print(get_host_ip())

```
