---
date created: 2024-08-28 00:34
date updated: 2024-12-26 00:18
dg-publish: true
---

# Repeater

Burp Repeater能够修改并反复发送一个HTTP或WebSocket消息。

在拦截到请求时点击Action -> Send to Repeater, 拦截的请求会被发送到Repeater中（可以发送多个请求到Repeater中）。在Repeater里，可以任意修改请求内容，并且查看对应的响应。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280032945.png)

而且，在请求或响应中选择的对应文本，会直接显示在Inspector中，伴随显示解码后的文本，解码类型有四种`URL encoding`, `HTML encoding`, `Base 64`, `Base 64 URL`。

# Sequencer

Sequencer用来生成随机数和伪随机数，可以帮助分析分析token样本中的随机性质量。token可以是`Session tokens`, `Anti-CSRF tokens`, `Password reset tokens`等旨在保持不可预测性的令牌。

将包含会话信息的请求转发到`Sequencer`中，

- `Token Location Within Response` 会自动识别 token，也可以自己选择想要分析的 token；
- `Live Capture Options` 可以控制线程数量和请求的限制速率等。设置好上述两个部分，就可以点击 `Start live capture` 来分析对应的 token 了。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280034586.png)

Burp Suite会产生另一个页面来分析token的指标，有效熵、可靠性等，还有字符级别和位级别的分析。不点击stop，样本量会无限增长，可以在Auto analyze旁边的next知道这一阶段的目标样本量。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280035895.png)

# Comparer

Comparer可以比较识别出请求或响应之间的微妙差异，也可以比较任何两个数据项。

拦截请求后发送给Comparer，请求会自动复制到Comparer的列表上，在上下两个部分分别选择两个不同的选项，并在右下角选择比较单词还是字节。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280036260.png)

弹出的弹窗里会自动进行左右两边的对比，像diff一样将右边与左边对比修改，删除和增加的各项。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202408280036798.png)

拦截请求只能将请求进行对比，如果想对比响应的话，需要自己复制粘贴到列表中，选择后也可以进行对比。
