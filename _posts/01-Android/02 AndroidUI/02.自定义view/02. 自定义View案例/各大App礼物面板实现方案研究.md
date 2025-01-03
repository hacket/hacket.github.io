---
date created: 2024-12-24 00:29
date updated: 2024-12-24 00:29
dg-publish: true
---

# 各大App礼物面板实现方案研究

## 礼物面板实现总结

1. RecyclerView+GridView
2. ViewPager+ViewPager
3. RecyclerView+RecyclerView
4. 自定义LayoutManager（PagerGridLayoutManager）
5. RecyclerView+SnapHelper

## 国内

### 企鹅电竞

```
ViewPager
  --ViewPager
    -- LinearLayout
      -- LinearLayout
      -- LinearLayout
  -- RadioGroup
```

1. 切换用的是ViewPager嵌套ViewPager
2. 指示器用的是RadioGroup
3. 点击item会放大

![](http://note.youdao.com/yws/res/44926/533B944A33A4403FAACA5B0A83C3E523#id=WLTcj&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688403410481-1fa6bab5-27fe-4fe5-a706-52d5b72e4e57.png#averageHue=%23e3e3e3&clientId=u3ce12287-d71c-4&from=paste&id=u2ce2ab86&originHeight=332&originWidth=810&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua3754827-fe8f-4542-a403-ddb0ae125f3&title=)

![](http://note.youdao.com/yws/res/44934/732F90E499E64E64B45B1218897385B7#id=VStD1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688403419456-5c891f1f-321e-4e3c-8f30-a883ce1efa47.png#averageHue=%23f8f4ee&clientId=u3ce12287-d71c-4&from=paste&id=uddd29f92&originHeight=532&originWidth=692&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=udb9f43ba-a3fd-4908-8003-57deac0db10&title=)<br />不足：

1. tab不能左右滑动，一个礼物面板滑动最右边不能滑动到其他tab

### 虎牙

1. tab用的RecyclerView
2. 礼物面板内容用的ViewPager+GridView
3. 指示器用LinearLayout

![](http://note.youdao.com/yws/res/44939/4330CF1F85894EECBEA47A36CBACF564#id=QTtPw&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688403425684-67861bdd-26a4-4119-8ea8-57bb142b0d0c.png#averageHue=%23e8e7e6&clientId=u3ce12287-d71c-4&from=paste&id=u2a952056&originHeight=658&originWidth=960&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u53129848-bfd3-4c67-a7c7-7b0e323c0a7&title=)

不足：

1. 每次点击item时，右上角`周`角标会跳动
2. tab不能左右滑动，一个礼物面板滑动最右边不能滑动到其他tab

### 斗鱼

1. tab用的LinearLayout
2. 礼物面板内容用的RecyclerView
3. 指示器用LinearLayout

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688403432402-9591cb1f-b7d8-45a0-9e46-567e73a9b43f.png#averageHue=%23eae8e8&clientId=u3ce12287-d71c-4&from=paste&id=ucfa97712&originHeight=406&originWidth=876&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u24a33b13-921d-429e-98bf-5af549e93ff&title=)<br />![](http://note.youdao.com/yws/res/44958/3E2273BDD73148798B3F19799A4A0A73#id=E0WRw&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1. tab不能左右滑动，一个礼物面板滑动最右边不能滑动到其他tab

### 抖音直播

1. 礼物面板内容用的RecyclerView
2. 指示器是自定义View<br />![](http://note.youdao.com/yws/res/44964/00BD5E9325D2490DAFFA35828D0135C0#id=jAj6T&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1688403439634-74d96334-7621-49d9-85de-952c71fcb086.png#averageHue=%23e4e2e2&clientId=u3ce12287-d71c-4&from=paste&id=u0516c367&originHeight=258&originWidth=848&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua20a0ec9-8fb8-499f-a367-7164020b58c&title=)

### 花椒直播(接近新版mashi实现)

1. tab用的HorizontalScrollView
2. 礼物面板内容用的ViewPager+RecyclerView
3. 指示器用ImageView

![](https://note.youdao.com/src/E56E135564E946D7860AAEEE68EFC57E#id=Ougnu&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 热猫/mashi

PagerGridLayoutManager

### 新版mashi

## 海外

### yalla

1. 礼物面板采用RecyclerView+RecyclerView
2. 指示器采用LinearLayout+ImageView

![](https://note.youdao.com/src/8F6C098A5993403C9E8F8AD84B3ED4E4#id=kkFc0&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://note.youdao.com/src/488F2A5F94F14A63A7260CC5F970BA2D#id=r6VU6&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### StarChat

1. tab是HorizontalScrollView
2. 礼物面板采用ViewPager+RecyclerView
3. 指示器采用HorizontalScrollView

![](https://note.youdao.com/src/A076BF6D835B434B928900A604578FB3#id=pGqsq&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://note.youdao.com/src/1C5596208F5645A1974CFEC033406370#id=B45Lq&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
