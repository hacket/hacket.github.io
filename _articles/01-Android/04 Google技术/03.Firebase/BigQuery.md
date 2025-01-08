---
date created: 2024-08-16 14:18
date updated: 2024-12-24 00:33
dg-publish: true
---

# BigQuery

## 什么是 BigQuery？

## BigQuery 和 Firebase 介绍

您可以将 Firebase 配置为将数据从以下 Firebase 产品导出到 BigQuery：

- [Analytics 分析](https://firebase.google.com/docs/analytics#integrations_with_other_services)
- [Cloud Messaging 云消息传递](https://firebase.google.com/docs/cloud-messaging/understand-delivery#bigquery-data-export)
- [Crashlytics 崩溃解决方案](https://firebase.google.com/docs/crashlytics/bigquery-export)
- [Performance Monitoring 性能监控](https://firebase.google.com/docs/perf-mon/bigquery-export)
- [A/B Testing A/B 测试](https://firebase.google.com/docs/ab-testing/abtest-config#bigquery_data_export)
- [Remote Config personalization 远程配置个性化](https://firebase.google.com/docs/remote-config/personalization/bigquery)

### 需要的权限

要查看或管理将数据导出到 BigQuery 的设置，您必须具有所需的访问级别。

如果没有权限，让项目所有者，添加对应的权限：[Firebase console IAM settings](https://console.firebase.google.com/project/_/settings/iam?_gl=1*9arlo9*_ga*NzA5MzIzMjk0LjE2ODM4NTcwNjU.*_ga_CW55HF8NVT*MTcyMjY5OTc4NS4yMjEuMS4xNzIyNjk5OTEyLjYwLjAuMA..)

具体所需权限列举：[Export project data to BigQuery  |  Firebase Documentation](https://firebase.google.com/docs/projects/bigquery-export#permissions-and-roles)

## BigQuery enable

1. Go to the [Integrations](https://console.firebase.google.com/project/_/settings/integrations?_gl=1*5f6nio*_ga*NzA5MzIzMjk0LjE2ODM4NTcwNjU.*_ga_CW55HF8NVT*MTcyMjY5OTc4NS4yMjEuMS4xNzIyNzAwODQzLjYwLjAuMA..) page in the Firebase console.\
   转到 Firebase 控制台中的[集成](https://console.firebase.google.com/project/_/settings/integrations)页面。
2. In the **BigQuery** card, click **Link**.\
   在**BigQuery**卡片中，点击**链接**。
3. Follow the on-screen instructions to enable BigQuery.\
   按照屏幕上的说明启用 BigQuery。

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240804002838.png)
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240804003054.png)
![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240804003120.png)
![|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240804003243.png)

![](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240804003354.png)

## 代码

[了解消息传送  |  Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/understand-delivery?hl=zh-cn&platform=android#what-data-exported)

## BigQuery 开启验证

1. 配置 Firebase Remote 开关：`and_1151_big_query_enable`，测试包已经配置成1（1 开始，0 关闭），
2. 查看 Firebase Remote 开关是否拉取到： Debug 工具→展示配置→查看 Firebase 配置 →输入 `and_1151_big_query_enable`（不为 0 表示打开）
3. 查看本地 `shared_prefs` 是否成功开启：`export_to_big_query` 为 true 表示开启

```shell
adb shell 
run-as com.zzkko
# 可以使用ls命令查看当前目录下的所有文件，然后找到 shared_prefs，cd进入该文件
cd shared_prefs
# 再ls查看 shared_prefs 目录中所有的文件，并用cat查看具体的 SharedPreferences 文件内容
cat com.google.firebase.messaging.xml
```

![|600](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian/20240816141238.png)

## FCM BigQuery

- [了解消息传送  |  Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/understand-delivery?hl=zh-cn&platform=android#what-can-you-do-with-the-exported-data)

### 数据查询

#### 按应用统计已发送消息的数量

```sql
SELECT app_name, COUNT(1)
FROM `project ID.firebase_messaging.data`
WHERE
  _PARTITIONTIME = TIMESTAMP('date as YYYY-MM-DD')
  AND event = 'MESSAGE_ACCEPTED'
  AND message_id != ''
GROUP BY 1;
```

**示例：**

```sql
SELECT app_name, COUNT(1)
FROM `shein-3876.firebase_messaging.data`
WHERE
  _PARTITIONTIME = TIMESTAMP('2024-10-31')
  AND event = 'MESSAGE_ACCEPTED'
  AND message_id != ''
GROUP BY 1;
```

#### 统计已发送的通知消息的数量

```sql
SELECT COUNT(1)
FROM `project ID.firebase_messaging.data`
WHERE
  _PARTITIONTIME = TIMESTAMP('date as YYYY-MM-DD')
  AND event = 'MESSAGE_ACCEPTED'
  AND message_type = 'DISPLAY_NOTIFICATION';
```

#### 统计已发送的数据消息的数量

```sql
SELECT COUNT(1)
FROM `project ID.firebase_messaging.data`
WHERE
  _PARTITIONTIME = TIMESTAMP('date as YYYY-MM-DD')
  AND event = 'MESSAGE_ACCEPTED'
  AND message_type = 'DATA_MESSAGE';
```

**示例：**

```sql
SELECT app_name, COUNT(1)
FROM `shein-3876.firebase_messaging.data`
WHERE
  _PARTITIONTIME = TIMESTAMP('2024-10-31')
  AND event = 'MESSAGE_ACCEPTED'
  AND message_type = 'DATA_MESSAGE';
GROUP BY 1;
```

# Ref

- [ ] [Export project data to BigQuery  |  Firebase Documentation](https://firebase.google.com/docs/projects/bigquery-export)
