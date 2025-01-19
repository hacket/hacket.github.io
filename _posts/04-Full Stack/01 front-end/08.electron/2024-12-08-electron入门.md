---
date created: 2024-12-08 21:28
date updated: 2024-12-26 00:02
dg-publish: true
---

# electron入门

## 什么是electron？

Electron 可以让你使用纯 JavaScript 调用丰富的原生 APIs 来创造桌面应用。你可以把它看作一个专注于桌面应用的 Node.js 的变体，而不是 Web 服务器。<br>这不意味着 Electron 是绑定了 GUI 库的 JavaScript。相反，Electron 使用 web 页面作为它的 GUI，所以你能把它看作成一个被 JavaScript 控制的，**精简版的 Chromium 浏览器**。

## electron Hello World

- 初始化项目

```shell
mkdir tasky
cd tasky
npm init
```

- 安装electron

```shell
cnpm install electron --S # 保存到dependency
```

- 根目录创建index.js，Node.js项目的入口

```javascript
// 引入两个模块：app 和 BrowserWindow

// app 模块，控制整个应用程序的事件生命周期。
// BrowserWindow 模块，它创建和管理程序的窗口。

const { app, BrowserWindow } = require('electron')

// 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
app.on('ready', () => {

  // 创建一个窗口
  const mainWindow = new BrowserWindow()
  
  //窗口加载html文件
  mainWindow.loadFile('./src/main.html')
})
```

- 创建窗口需要加载的html文件：main.html

新建一个 `src` 文件夹，用于存放web页面资源，比如html、css、js、图片等。

```html
// ./src/main.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  hello world
</body>
</html>
```

- 修改package.json的scripts，如下:

```json
"scripts": {
  "start": "electron ."
}
```

- 根目录运行

```shell
npm run start
```

- 效果

![image.png|500](https://cdn.nlark.com/yuque/0/2023/png/694278/1701362204196-73b0089f-168f-48d9-bb05-5bccf79eccb7.png#averageHue=%23f1f1f1&clientId=u2a991099-6b0d-4&from=paste&height=352&id=ub2deb4dc&originHeight=900&originWidth=1200&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=13238&status=done&style=none&taskId=u8233cd52-c71a-4b60-be58-2bb6c3fa025&title=&width=469)

## 热更新 nodemon

nodemon热更新

- 安装nodemon模块

```shell
cnpm i nodemon --D
```

- 修改scripts

> "start" : "electron ."改成下面

```json
"scripts": {
  
  "start": "nodemon --watch index.js --exec electron ."
},
```

- 再次运行`npm run start`，当index.js内容变化时，就会自动重新执行`electron .`来重启应用。

## 调试

### 加log

```javascript
console.log('app on ready.。。');
```

### Developer Tools

窗口页面的调试方法和chrome浏览器类似。点击菜单栏的`View --- Toggle Developer Tools`，或者按它对应的快捷键，就会出现我们熟悉的开发者工具界面。<br>![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1701362450511-280f5de3-2fa4-49c6-9f5c-770ee805caf9.png#averageHue=%23a2a09d&clientId=u2a991099-6b0d-4&from=paste&height=488&id=ue79fc299&originHeight=900&originWidth=1200&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=61938&status=done&style=none&taskId=u33cc1e21-47c1-45fa-aa06-6355cd4deaa&title=&width=651)<br>当页面内容发生变化，可以点击`View --- Reload`，或者快捷键`ctrl+r`，刷新页面内容。

# electron API

## BrowserWindow 窗口

```javascript
// Import parts of electron to use
// app 控制应用生命周期的模块
// BrowserWindow用于创建原生窗口
// Tray用于创建托盘图标
// Menu菜单模块
// ipcMain 用于主进程和渲染进程通信
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
// 创建一个窗口
let mainWindow = new BrowserWindow({
    frame: false, // 隐藏窗口边框和标题栏
    resizable: false,  // 禁止改变窗口大小
    width: 800,
    height: 600,
    icon: iconPath, // 应用运行时的标题栏图标
    webPreferences: {
        nodeIntegration: true, // 在渲染进程中使用nodejs的API，IPC的时候用
        backgroundThrottling: false, // 设置应用在后台可以运行：解决页面被挂起后定时器无法正常工作的问题
        contextIsolation: false, // 设置是否在渲染进程中启用上下文隔离

    }
});

mainWindow.removeMenu(); // 隐藏菜单栏，防止通过快捷键打开菜单栏，比如：ctrl+shift+i开发者工具
// 加载main.html
mainWindow.loadFile('src/main.html');
```

### 无边框窗口

1. 要创建无边框窗口，在 BrowserWindow 的 options 中将 `frame` 设置为 false

```javascript
mainWindow = new BrowserWindow({
   frame: false,
   // ...
})
```

2. 默认情况下，无边框窗口是不可拖拽的。应用程序需要在 CSS 中指定 `-webkit-app-region: drag` 来告诉 Electron 哪些区域是可拖拽的。

```css
html,body {
  height: 100%;
  width: 100%;
}

body{
  -webkit-app-region: drag;
}
```

如果用上面的属性使整个窗口都可拖拽，则必须将其中的按钮标记为不可拖拽，否则按钮将无法点击。

```css
.enable-click {
  -webkit-app-region: no-drag;
}
```

## Tray 托盘

```javascript
// Import parts of electron to use
// app 控制应用生命周期的模块
// BrowserWindow用于创建原生窗口
// Tray用于创建托盘图标
// Menu菜单模块
// ipcMain 用于主进程和渲染进程通信
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
tray = new Tray(iconPath)      // 实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url  
    tray.setToolTip('tasky')       // 设置鼠标悬浮在托盘图标上时的提示文本
    tray.on('click', () => {       // 给托盘图标绑定单击事件    
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    });
    tray.on('right-click', () => { // 给托盘图标绑定右键单击事件
        const contextMenu = Menu.buildFromTemplate([ // 创建一个菜单模板
            {
                label: '退出', click: () => {
                    app.quit()
                }
            }
        ])
        tray.popUpContextMenu(contextMenu) // 给托盘图标绑定菜单
    });
```

## Menu

## ipcRenderer IPC通信

IPC(Inter-Process Communication)，就是进程间通信。Electron应用程序区分主进程和渲染进程，有时候，两者之间需要通信，传输一些数据、发送一些消息。<br>![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1703177077338-2e265a77-bd3c-427c-9e05-126fa134345d.webp#averageHue=%23fefdfa&clientId=u2f7927dd-4883-4&from=paste&id=uf47e7f59&originHeight=327&originWidth=1245&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u617bb40a-6e28-42cc-a349-1e424a4950a&title=)

### 渲染进程 👉 主进程

渲染进程使用Electron内置的`ipcRenderer`模块向主进程发送消息，`ipcRenderer.send`方法的第一个参数是消息管道名称：

```javascript
// 页面的js代码：
const electron = require('electron')
const { ipcRenderer } = electron

closeDom.addEventListener('click', () => {
  ipcRenderer.send('mainWindow:close')
})
```

主进程通过`ipcMain`接收消息，`ipcMain.on`方法的第一个参数也为消息管道的名称，与`ipcRenderer.send`的名称对应，第二个参数是接收到消息的回调函数：

```javascript
// 入口文件index.js
ipcMain.on('mainWindow:close', () => {
  mainWindow.hide()
})
```

### 主进程 👉 渲染进程

主进程向渲染进程发送消息是通过渲染进程的`webContents`。在mainWindow渲染进程设定了任务后，会传输给主进程任务信息，当任务时间到了，主进程会创建提醒窗口remindWindow，并通过`remindWindow.webContents`将任务名称发给remindWindow。

```javascript
function createRemindWindow (task) {
 
  remindWindow = new BrowserWindow({
     //options
  })
  remindWindow.loadURL(`file://${__dirname}/src/remind.html`)
  
  // 主进程发送消息给渲染进程
  remindWindow.webContents.send('setTask', task)
}
```

在remindWindow渲染进程中，通过ipcRenderer.on接受消息：

```javascript
ipcRenderer.on('setTask', (event,task) => {
   document.querySelector('.reminder').innerHTML = 
      `<span>${decodeURIComponent(task)}</span>的时间到啦！`
})
```

### 渲染进程 👉 渲染进程

渲染进程之间传递消息，可以通过主进程中转，即窗口A先把消息发送给主进程，主进程再把这个消息发送给窗口B，这种非常常见。<br>也可以从窗口A直接发消息给窗口B，前提是窗口A知道窗口B的webContents的id。

```javascript
ipcRenderer.sendTo(webContentsId, channel, ...args)
```

值得注意的是，我们在页面的js代码中使用了require，这也是Electron的一大特点，在渲染进程中可以访问Node.js API。这样做的前提是在创建窗口时配置`webPreferences`的`nodeIntegration: true`和`contextIsolation: false`：

```javascript
mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
})
```

# Ref

- [ ] [electron教程-快速入门](https://weishuai.gitbooks.io/electron-/content/tutorial/quick-start.html)
