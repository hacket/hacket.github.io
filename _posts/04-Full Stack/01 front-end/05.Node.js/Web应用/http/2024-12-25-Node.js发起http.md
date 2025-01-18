---
date created: 2024-12-25 23:57
date updated: 2024-12-25 23:57
dg-publish: true
---

# HTTPS Module

## HTTP自带

Node.js在标准库中带有https模块

```javascript
const chalk = require("chalk")
const https = require('https')

https.get('https://api.juejin.cn/tag_api/v1/query_category_briefs', res => {
    let list = [];
    res.on('data', chunk => {
        list.push(chunk);
    });
    res.on('end', () => {
        const { data } = JSON.parse(Buffer.concat(list).toString());
        data.forEach(item => {
            console.log(`${chalk.yellow.bold(item.rank)}.${chalk.green(item.category_name)}`);
        })
    });
}).on('error', err => {
    console.log('Error: ', err.message);
});
```

## [Axios](https://github.com/axios/axios)

Axios是一个非常流行且受欢迎的Promise式请求库，可用于浏览器和Node.js环境；有着拦截器，数据自动转换JSON等十分方便的功能。

```shell
npm install axios
```

### GET

#### 不带参数

通过axios获取掘金板块分类简单示例：

```javascript
const chalk = require("chalk")
const axios = require('axios');

axios.get('https://api.juejin.cn/tag_api/v1/query_category_briefs')
    .then(res => {
        const { data } = res.data
        data.forEach(item => {
            console.log(`${chalk.yellow.bold(item.rank)}.${chalk.green(item.category_name)}`);
        })
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
```

#### 带参数

```javascript
function digitalassetlinks(domain, applicationId, cert) {

    if (!domain.startsWith("https://")) {
        domain = "https://" + domain;
    }

    // 定义要发送的参数
    const params = {
        'source.web.site': domain.trim(),
        'relation': 'delegate_permission/common.handle_all_urls'.trim(),
        'target.android_app.package_name': applicationId.trim(),
        'target.android_app.certificate.sha256_fingerprint': cert.trim()
    };
    console.table(params);

    axios({
        method: "GET",
        url: "https://digitalassetlinks.googleapis.com/v1/assetlinks:check",// 使用代理后的 apis
        params: params
    })
        .then((response) => {
            console.log("请求成功", response);
            const data = response.data
            data['linked'] ? alert('验证成功') : alert('验证失败');
        })
        .catch((err) => {
            console.log("请求失败", err);
        });
}
```

## [node-fetch](https://github.com/node-fetch/node-fetch)

这个请求库它的api与window.fetch保持了一致，也是promise式的。最近非常受欢迎，但可能最大的问题是，它的v2与v3版差异比较大，v2保持着cjs标准，而v3则用了ejs的方式

```shell
npm i -S node-fetch@2.6.7
```

```javascript
const chalk = require("chalk")
const fetch = require("node-fetch")

fetch('https://api.juejin.cn/tag_api/v1/query_category_briefs', {
    method: 'GET'
})
.then(async res => {
    let { data } = await res.json()
    data.forEach(item => {
        console.log(`${chalk.yellow.bold(item.rank)}.${chalk.green(item.category_name)}`);
    })
})
.catch(err => {
    console.log('Error: ', err.message);
});

```
