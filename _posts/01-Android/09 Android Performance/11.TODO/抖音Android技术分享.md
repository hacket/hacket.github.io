---
date created: 2024-12-24 00:39
date updated: 2024-12-24 00:39
dg-publish: true
---

# 抖音Android第4期

## 编译优化

- 多仓库方案的问题

# ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686463692292-58c0a7bf-3cda-4a22-9490-72342cb2618f.png#averageHue=%236b6b5c&clientId=u786436d7-f298-4&from=paste&height=1600&id=u06e532e6&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=292410&status=done&style=none&taskId=ude7f449d-78b4-43f2-b92e-c54be0ccac1&title=&width=720)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686463764859-f335ef09-d021-4d0b-bdd2-2dedab4229d9.png#averageHue=%23978f88&clientId=u786436d7-f298-4&from=paste&height=1571&id=uc752aede&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=507485&status=done&style=none&taskId=u67f99a2e-f84c-4d22-a40c-adfc7590a8e&title=&width=707)

### 抖音全源码实战

全源码编译核心问题：多module引入导致的耗时

#### Android系统构建系统

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686463876449-19244a8e-26af-4e2b-ac76-76ddfc3d7a16.png#averageHue=%23c6b89b&clientId=u786436d7-f298-4&from=paste&height=1347&id=u557087be&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=265493&status=done&style=none&taskId=ud1c795a0-34b9-482c-91cc-f98c15f9507&title=&width=606)

#### 编译优化思路

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686463984519-1fd823db-ae83-4ca5-af2e-632d5cf64b5a.png#averageHue=%23aeb4a2&clientId=u786436d7-f298-4&from=paste&height=1324&id=u0b4702c5&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=250251&status=done&style=none&taskId=ue0c1264f-d586-40c7-b79c-73a474a479f&title=&width=596)

##### <br />

#### ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464063185-353b96e9-9cf5-4228-8dc8-8318e6fc0556.png#averageHue=%23aeb4a2&clientId=u786436d7-f298-4&from=paste&height=1600&id=ue5c9844d&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=250251&status=done&style=none&taskId=ue7b46725-4f0d-40e4-92fd-f3ad1834570&title=&width=720)

##### 硬件，内存

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464128604-ac86b085-dfe4-47b7-9e82-7a586d0b34fd.png#averageHue=%2318202d&clientId=u786436d7-f298-4&from=paste&height=1213&id=ud08f4fc4&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1692754&status=done&style=none&taskId=u1101699e-840f-4a46-8e8c-eb069f36f9b&title=&width=546)

##### 编译缓存

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464185401-eabbbf84-3bd7-4a82-ac86-8d021086e7d3.png#averageHue=%2319202e&clientId=u786436d7-f298-4&from=paste&height=1222&id=u1a5e9f3c&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1641319&status=done&style=none&taskId=u6b0ebd9c-92df-4872-9263-1174809f907&title=&width=550)<br />Gradle远端缓存是默认关闭的

##### ![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464372331-cd6ffebf-f8c7-4119-81e9-e11c3d48f101.png#averageHue=%231f2835&clientId=u786436d7-f298-4&from=paste&height=1569&id=uf76133ee&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=1657879&status=done&style=none&taskId=ue22cdcf8-b5b1-4017-80bb-e2ef7cc7efd&title=&width=706)

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464440450-e3fe53d4-ed76-444d-8804-a3d3df57a828.png#averageHue=%23b6d29f&clientId=u786436d7-f298-4&from=paste&height=1600&id=u08d7935e&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=260486&status=done&style=none&taskId=ue58c3fa5-caf5-4238-882e-9897e630c49&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464586146-e8a481bd-d8ee-436b-aad0-66d6e6991ca8.png#averageHue=%233a4333&clientId=u786436d7-f298-4&from=paste&height=1600&id=u1cf1c3e9&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=329989&status=done&style=none&taskId=ua490f6bb-a016-4c74-825a-3f510faeb62&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464728563-9dbabf29-fde5-4194-a30e-563698081b4a.png#averageHue=%23f1a528&clientId=u786436d7-f298-4&from=paste&height=1600&id=u18262c0b&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=224586&status=done&style=none&taskId=u74da3060-76a8-4c57-8682-e48d68c1503&title=&width=720)

##### 并发

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464790481-b6f0eee8-2e3f-42ee-af85-a357a913be57.png#averageHue=%23c9c7c0&clientId=u786436d7-f298-4&from=paste&height=1562&id=udf56fae5&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=252534&status=done&style=none&taskId=u7675201f-efc6-4cb3-be7a-e7c89e6d096&title=&width=703)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464847232-456f2cf2-9d59-42f1-b907-23c712cda852.png#averageHue=%23f4f2ec&clientId=u786436d7-f298-4&from=paste&height=1600&id=ud8190fc8&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=201081&status=done&style=none&taskId=u4c77e277-7517-4425-abec-ab790d2cba1&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464877772-c342acfe-ddf4-401f-8f4f-85246e9b847d.png#averageHue=%23e6e4de&clientId=u786436d7-f298-4&from=paste&height=1600&id=u2552743f&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=286173&status=done&style=none&taskId=u5e6bc3df-b228-45ee-9746-d36433cc576&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686464933124-a2ca67dd-87d2-492e-b6da-605fe931f52e.png#averageHue=%23f3f2ee&clientId=u786436d7-f298-4&from=paste&height=1600&id=ufb60f149&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=313274&status=done&style=none&taskId=ua0fd588f-cdd1-43cf-b5ca-65ec746eaf2&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465004480-f0412619-d08c-4660-a311-b91a87176126.png#averageHue=%23f4f2ec&clientId=u786436d7-f298-4&from=paste&height=1600&id=ub65dacf2&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=284208&status=done&style=none&taskId=u84738164-aae1-45ec-bb6b-d5b3f4bce97&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465055657-85d82f6f-a4bd-4329-a853-4b917a320d7b.png#averageHue=%23d8d7d2&clientId=u786436d7-f298-4&from=paste&height=1600&id=u0300b1ff&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=217339&status=done&style=none&taskId=ue07f0e40-96cd-45d9-9174-3e4cdd4c355&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465084114-38c9700c-5052-41af-8953-cd9f3c825e90.png#averageHue=%23e5e4dc&clientId=u786436d7-f298-4&from=paste&height=1600&id=u8140d9ab&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=314092&status=done&style=none&taskId=ub5616807-6484-42c8-a958-a179311fd8a&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465124238-980f8178-7ebd-4ae2-842e-1dadcfed1a8f.png#averageHue=%23f0efe8&clientId=u786436d7-f298-4&from=paste&height=1600&id=u82b2267d&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=250744&status=done&style=none&taskId=ub11072cf-acc4-4bc5-a5d0-e1f3acf9351&title=&width=720)

### Gradle局限性

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465310874-56bd26ec-0331-404d-b6b7-c4ae35bcbab9.png#averageHue=%23e0e5bd&clientId=u786436d7-f298-4&from=paste&height=1600&id=u20f6a754&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=242648&status=done&style=none&taskId=uee675f63-404e-4804-b07c-de04a48d299&title=&width=720)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686465357433-61b100dc-2c9b-45de-8e36-eaa24201e743.png#averageHue=%23e0e4be&clientId=u786436d7-f298-4&from=paste&height=1600&id=u95671af9&originHeight=2400&originWidth=1080&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=333783&status=done&style=none&taskId=ub4e1875f-4c45-426a-8298-9a9635ad850&title=&width=720)

## 抖音插件化演进之路

##

## 抖音体验优化

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686470272367-ddf586e6-b22b-4661-9da1-a9ab094c01d7.png#averageHue=%23f4f0f4&clientId=u334bcdb9-b65a-4&from=paste&height=569&id=ud1970d06&originHeight=854&originWidth=1670&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=593546&status=done&style=none&taskId=ue41354ab-cd0a-4fb4-a67a-4ae3e406241&title=&width=1113.3333333333333)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686470409318-1a00d66f-1d84-4703-b5c7-45c7c9643184.png#averageHue=%23efebef&clientId=u334bcdb9-b65a-4&from=paste&height=559&id=u62e5801f&originHeight=838&originWidth=1406&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=477272&status=done&style=none&taskId=u1689e4de-62bf-46fd-bfb1-ad00bedd68b&title=&width=937.3333333333334)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686470525129-a4a98382-376b-4406-866c-a722c0bab0ce.png#averageHue=%23ebe7eb&clientId=u334bcdb9-b65a-4&from=paste&height=573&id=u5191d93e&originHeight=859&originWidth=1633&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=845398&status=done&style=none&taskId=u9c67f10c-e07b-4db6-8505-5445fd73bd6&title=&width=1088.6666666666667)<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1686470593972-38d1bdff-8334-41f1-8d48-ec6e5e7990ad.png#averageHue=%23f3f0f4&clientId=u334bcdb9-b65a-4&from=paste&height=595&id=uc95f12fb&originHeight=893&originWidth=1675&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=508906&status=done&style=none&taskId=u0a346481-409e-415a-8a68-a4de8d2440b&title=&width=1116.6666666666667)
