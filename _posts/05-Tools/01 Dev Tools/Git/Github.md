---
date created: 2024-12-27 23:55
date updated: 2024-12-28 23:32
dg-publish: false
---

# Github两步认证（2FA）丢失后处理方法

## recovery-code

github设置了两步认证以后有一个recovery-code要你下载，并且会在邮件里面通知你，这时你最好是下载下来保存好。在github 2FA的说明里面解释说这是在丢失两步认证后能登录帐号的唯一方式。的确是这样，在两步认证没办法进行下去时，你可以输入你的recovery-code来登录github。如果你没有下载下来，那么往下<br>[github-recovery-codes.txt](https://www.yuque.com/attachments/yuque/0/2023/txt/694278/1696687336948-b5a6bdc1-c3cd-4d16-b176-44df756081ef.txt?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Ftxt%2F694278%2F1696687336948-b5a6bdc1-c3cd-4d16-b176-44df756081ef.txt%22%2C%22name%22%3A%22github-recovery-codes.txt%22%2C%22size%22%3A206%2C%22ext%22%3A%22txt%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22uad47fa6c-e1b8-48aa-bfaf-f49ee67b803%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22text%2Fplain%22%2C%22__spacing%22%3A%22both%22%2C%22id%22%3A%22ud5a7255d%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)<br>![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/202412290111042.png)

## 手机认证身份

国内没法绑定手机号

## 私钥认证你的身份

在一台你上传了公钥的机器上执行：`ssh -T git@github.com verify` 他将返回一段字符串，将这段字符串提供给github的工作人员，他们可以帮你解除2FA(表扬一下github的工作人员效率还是很高的，而且有问必答，即使你的英语写的和我一样屎).
