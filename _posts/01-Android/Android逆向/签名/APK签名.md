---
date created: 2024-12-24 00:40
date updated: 2024-12-24 00:40
dg-publish: true
---

# 签名基础

## 加密算法

### 对称加密

对称加密算法是较传统的加密体制，即通信双方在加/解密过程中使用他们**共享的单一密钥**，鉴于其算法简单和加密速度快的优点，目前仍然在使用，但是安全性方面就差一点可能。最常用的对称密码算法是DES算法，而DES密钥长度较短，已经不适合当今分布式开放网络对数据加密安全性的要求。一种新的基于Rijndael算法的对称高级数据加密标准AES取代了数据加密标准DES，弥补了DES的缺陷，目前使用比较多一点

### 非对称加密

非对称加密由于加/解密钥不同（公钥加密，私钥解密），密钥管理简单，得到了很广泛的应用。RSA是非对称加密系统最著名的公钥密码算法。但是由于RSA算法进行的都是大数计算，使得RSA最快的情况也比AES慢上倍，这是RSA最大的缺陷。但是其安全性较高，这也是大家比较喜欢的地方吧。<br />**非对称加密应用：**

1. 加密数据：公钥加密，私钥解密，如HTTPS过程中Client拿Server的公钥加密数据发给Server
2. 验证：私钥加密，公钥解密，如数字签名

## 消息摘要

**什么是消息摘要**？<br />将任意长度的消息通过hash算法转换成固定长度的短消息，这就是消息摘要；经过hash算法生成的密文也被称为数字指纹<br />**常见摘要算法？**<br />常见的摘要算法都有 **MD5**、**SHA-1 **和 **SHA-256**<br />**特点：**

1. **固定长度 **长度固定，与内容长度无关：MD5是128位、SHA-1是160位、SHA-256是256位
2. **唯一性 **在不考虑碰撞的情况下，不同的数据计算出的摘要是不同的
3. **不可逆性 **正向计算的摘要不可能逆向推导出原始数据

## 数字签名

**消息摘要**：原数据经过hash后的数据<br />**数字签名**：原数据+通过RSA私钥加密后的消息摘要<br />数字签名容易伪造，造成中间人攻击

数字签名是可以被伪造的，不能辨别数字签名的发送方的真实身份

## 数字证书

前提：

> 接收方必须要知道发送方的公钥和所使用的算法。如果数字签名和公钥一起被篡改，接收方无法得知，还是会校验通过。如何保证公钥的可靠性呢？

数字证书是由权威的CA机构颁发的无法被伪造的证书，用于校验发送方实体身份的认证。文件中包含了证书颁发机构，颁发机构的签名，颁发机构的加密算法（非对称加密），算法的公钥等。<br />**数字证书**：数字证书中包含的明文内容+数字签名+CA公钥<br />**为什么CA制作的证书是无法被伪造的？**<br />CA制作的数字证书内包含CA对证书的数字签名，接收方可以使用CA公开的公钥解密数字证书，并使用相同的摘要算法验证当前数字证书是否合法。制作证书需要使用对应CA机构的私钥，只要CA的私钥不被泄露，CA颁发的证书是无法被非法伪造的。<br />**数字证书解决的问题：主要是用来解决公钥的安全发放问题**<br />**数字证书的格式**普遍采用的是X.509V3国际标准，一个标准的X.509数字证书包含以下一些内容：

> 1、证书的版本信息；
> 2、证书的序列号，每个证书都有一个唯一的证书序列号；
> 3、证书所使用的签名算法；
> 4、证书的发行机构名称，命名规则一般采用X.500格式；
> 5、证书的有效期，通用的证书一般采用UTC时间格式；
> 6、证书所有人的名称，命名规则一般采用X.500格式；
> 7、证书所有人的公开密钥；
> 8、证书发行者对证书的签名。

## 签名过程和校验过程（没有数字证书）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676685955089-1e9221f9-76e0-4374-8658-a2266aa270f3.png#averageHue=%23fdfdfc&clientId=u1328ae71-bc13-4&from=paste&height=327&id=tLD4U&originHeight=693&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=201385&status=done&style=stroke&taskId=u0e79771d-58fa-4f63-8058-aef2d9db146&title=&width=566)<br />**签名过程：**

1. 计算摘要 通过Hash算法计算出原生数据的摘要
2. 计算签名 通过私钥的非对称加密算法对摘要进行加密，加密后的数据就是签名信息
3. 写入签名 将签名信息写入原始数据的签名区块内

**校验过程：**

1. 计算摘要 接收方接收到数据后，首先用同样的Hash算法从接收到的数据中计算出摘要
2. 解密签名 使用发送方的公钥对数字签名进行解密，解密出原始摘要；
3. 比较摘要 如果解密后的数据和步骤1计算出的摘要一致，则校验通过；如果数据被第三方篡改过，解密后的数据和摘要不一致，校验不通过。

## 签名和校验过程（带数字证书，完整的）

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676686743172-81827cdf-d8ad-4a33-8130-92941f423014.png#averageHue=%231b1b1b&clientId=u1328ae71-bc13-4&from=paste&height=468&id=u37955ea5&originHeight=900&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=183553&status=done&style=stroke&taskId=u59de708d-e8fd-41f5-8677-5fe0e457e69&title=&width=624)

# 签名

## .jks 和 .keystore 的区别

- keystore 是 Eclipse 打包生成的签名
- jks 是 Android studio 生成的签名

## 标准 keystore (standard jdk keystore types)

包括 `JCEKS`，`JKS`，`PKCS12` 这几种格式。

- JCEKS : 存储对称密钥（分组密钥、私密密钥）
- JKS : 只能存储非对称密钥对（私钥 + x509公钥证书）
- PKCS12 ： 通用格式（rsa公司标准）。微软和java 都支持。

## 生成签名

### Android Studio生成keystore

Android studio本身也可以生成keystore：`Build--》Generate Signed apk-->create new keystore` 然后一步步next就可以了；<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1691253670695-2cc08b43-cb42-4c88-b699-19d994528210.png#averageHue=%23404346&clientId=ub95896c0-25b3-4&from=paste&id=evsb0&originHeight=1268&originWidth=1772&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u6cd3c5eb-17c7-4900-8ace-4b879c6492f&title=)

- 各个keystore部分代表的意思<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1691253684838-db31fff0-aac0-48b0-9ae0-7c1bc02b51c3.png#averageHue=%23dcd0c4&clientId=ub95896c0-25b3-4&from=paste&id=JGm8G&originHeight=532&originWidth=548&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u4d062670-bcbd-4ae5-ba63-5eee4a1a9d9&title=)

### Eclipse keystore

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1691253697328-65417ee2-25c7-42c6-9823-43d15cd8ffd2.png#averageHue=%23f3f2f0&clientId=ub95896c0-25b3-4&from=paste&id=br6TU&originHeight=521&originWidth=525&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u2734301c-bc03-4239-87a5-028cf344fbd&title=)

### 利用JDK下的keytool工具生成

> keytool -genkey -alias alias_hacket-keypass 998866 -keyalg RSA -keysize 2048 -validity 36500 -keystore hacket.jks -storepass 998866

- -keystore hacket.jks （hacket.jks 签名文件名字）
- -keyalg RSA （密钥算法名称 为 RSA）
- -keysize 2048 （密钥位大小 为 2048）
- -validity 36500 （有效期为36500天）
- -alias alias_hacket （别名为 alias_hacket ）
- -keypass 后面 证书密码
- -storepass 998866 自定义密码

## Android 默认 debug.keystore

- keystore名字：debug.keystore
- alias：androiddebugkey
- keystore密码：android
- alias别名密码：android

## keystore和证书格式

Apk签名时并没有直接指定私钥、公钥和数字证书，而是使用keystore文件，这些信息都包含在了keystore文件中。<br />根据编码不同，keystore文件分为很多种，Android使用的是Java标准keystore格式**JKS**(Java Key Storage)，所以通过Android Studio导出的keystore文件是以.jks结尾的。<br />keystore使用的证书标准是X.509，X.509标准也有多种编码格式，常用的有两种：**pem**（Privacy Enhanced Mail）和**der**（Distinguished Encoding Rules）。jks使用的是der格式，Android也支持直接使用pem格式的证书进行签名

1. DER（Distinguished Encoding Rules）二进制格式，所有类型的证书和私钥都可以存储为der格式。
2. PEM（Privacy Enhanced Mail）base64编码，内容以`-----BEGIN xxx-----` 开头，以`-----END xxx-----` 结尾

> -----BEGIN RSA PRIVATE KEY----- MIIEpAIBAAKCAQEAlmXFRXEZomRKhNRp2XRoXH+2hm17RfrfecQlT49fktoDLkF6r99uiNnuUdPi6UQuXOnzEbe1nZkfuqfB10aBLrDqBUSZ+3
> -----END RSA PRIVATE KEY-----
> -----BEGIN CERTIFICATE----- MIICvTCCAaWgAwIBAgIEcWTElDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDEwRyPQDLnVKeEIh81OwD3KIrQOUwsxyptOVVea1D8CzIAnGs
> -----END CERTIFICATE-----

## 签名工具jarsigner和apksigner

Android提供了两种对Apk的签名方式，一种是基于JAR的签名方式，另一种是基于Apk的签名方式，它们的主要区别在于使用的签名文件不一样：jarsigner使用keystore文件进行签名；apksigner除了支持使用keystore文件进行签名外，还支持直接指定pem证书文件和私钥进行签名。

### jarsigner

JDK自带的签名工具，可以对jar进行签名；使用keystore文件进行签名，生成的签名文件默认使用keystore的别名命名

### apksigner

Android SDK提供的专门用于Android应用的签名工具，除了支持keystore，也可以使用pk8、x509.pem文件进行签名，其中pk8是私钥文件，x509.pem是含有公钥的文件，生成的签名文件统一使用`CERT`命名

## APK签名的作用

1. 对开发者的身份认证

> 由于开发者可能通过使用相同的package name来混淆替换已经安装的程序，以此保证签名不同的包不被替换；

2. 保证APK的安全

> 签名在APK中根据文件写入指纹，APK中有任何修改，指纹就会失效，Android系统在安装APK进行签名校验时就会不通过，从而保证了安全，防止APK被伪造

3. 防止交易中的抵赖发生，market对软件的要求。

## 获取应用签名(MD5/SHA1/SHA256)

### keytool

```
keytool -list -v -keystore hacket.keystore
```

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1691253716082-eacb219a-f5de-477e-9157-a58b5be1e066.png#averageHue=%23392f2f&clientId=ub95896c0-25b3-4&from=paste&height=288&id=PdLbK&originHeight=574&originWidth=876&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=u7ee59b27-8c0b-4278-907b-aae23f20a65&title=&width=440)<br />高版本只有SHA1和SHA256，没有MD5<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694938740480-8e7b54d3-1988-49c5-95a7-5bdaceba54b7.png#averageHue=%232f2e2e&clientId=ufa80aaab-3a63-4&from=paste&height=624&id=aEHw8&originHeight=1248&originWidth=1796&originalType=binary&ratio=2&rotation=0&showTitle=false&size=201596&status=done&style=stroke&taskId=ub17e55be-7405-4c9b-a1ce-8ec76b3c4ad&title=&width=898)<br />高版本java 移除了 这些 [Disable MD5 or MD2 signed jars](https://www.java.com/en/configure_crypto.html#disableMD5)

- [ ] [Oracle JRE and JDK Cryptographic Roadmap](https://www.java.com/en/jre-jdk-cryptoroadmap.html)

| 2017-04-18 | [8u131 b11](http://www.oracle.com/technetwork/java/javase/8u131-relnotes-3565278.html)<br />, [7u141 b11](http://www.oracle.com/technetwork/java/javaseproducts/documentation/javase7supportreleasenotes-1601161.html#R170_141)<br />, [6u151 b10](http://www.oracle.com/technetwork/java/javase/documentation/overview-156328.html#R160_151)<br />, [R28.3.14](https://docs.oracle.com/cd/E15289_01/JRRLN/newchanged.htm#GUID-64B46D62-4B59-42F8-831D-8D9A422F10E6) | MD5 | JAR files signed with MD5 algorithms are treated as unsigned JARs. | [Disabling MD5 signed jars](https://www.java.com/en/configure_crypto.html#disableMD5) | 2017-04-18 Released2016-12-08 Target date changed from 2017-01-17 to 2017-04-182016-10-24 Testing instructions added2016-09-30 Announced |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |

### 通过APK中的CERT.RSA文件查询MD5签名

1. 解压构建的Apk得到RSA文件：APK以zip文件方式打开，在\META-INF\目录中存在一个.RSA后缀的文件，一般名为CERT.RSA。
2. 使用keytool命令获取MD5签名

> keytool -printcert -file CERT.RSA

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694938238466-1e50d425-095f-4325-bd0b-c9406323b8d6.png#averageHue=%23e9e9e9&clientId=ufa80aaab-3a63-4&from=paste&height=240&id=oiQfL&originHeight=480&originWidth=711&originalType=binary&ratio=2&rotation=0&showTitle=false&size=69231&status=done&style=stroke&taskId=u48b747e4-6c78-4ead-ba5b-ff326f1caba&title=&width=355.5)

### jadx-gui查看

> jadx-gui xxx.apk

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1694938628607-d624b00c-4882-4495-85c6-9798dc2dbb81.png#averageHue=%23c3c2c2&clientId=ufa80aaab-3a63-4&from=paste&height=439&id=Mubpd&originHeight=878&originWidth=1417&originalType=binary&ratio=2&rotation=0&showTitle=false&size=238498&status=done&style=stroke&taskId=u56f361a2-37c4-4ef3-9180-5f26ad61885&title=&width=708.5)

### 通过Gradle task signingReport

```groovy
gradle signingReport
```

### 通过代码

```java
/**
 * 获取签名工具类
 */
public class AppSigning {
    public final static String MD5 = "MD5";
    public final static String SHA1 = "SHA1";
    public final static String SHA256 = "SHA256";
    private static HashMap<String, ArrayList<String>> mSignMap = new HashMap<>();

    /**
     * 返回一个签名的对应类型的字符串
     *
     * @param context
     * @param type
     * @return 因为一个安装包可以被多个签名文件签名，所以返回一个签名信息的list
     */
    public static ArrayList<String> getSignInfo(Context context, String type) {
        if (context == null || type == null) {
            return null;
        }
        String packageName = context.getPackageName();
        if (packageName == null) {
            return null;
        }
        if (mSignMap.get(type) != null) {
            return mSignMap.get(type);
        }
        ArrayList<String> mList = new ArrayList<String>();
        try {
            Signature[] signs = getSignatures(context, packageName);
            for (Signature sig : signs) {
                String tmp = "error!";
                if (MD5.equals(type)) {
                    tmp = getSignatureByteString(sig, MD5);
                } else if (SHA1.equals(type)) {
                    tmp = getSignatureByteString(sig, SHA1);
                } else if (SHA256.equals(type)) {
                    tmp = getSignatureByteString(sig, SHA256);
                }
                mList.add(tmp);
            }
        } catch (Exception e) {
            LogUtil.e(e.toString());
        }
        mSignMap.put(type, mList);
        return mList;
    }

    /**
     * 获取签名sha1值
     *
     * @param context
     * @return
     */
    public static String getSha1(Context context) {
        String res = "";
        ArrayList<String> mlist = getSignInfo(context, SHA1);
        if (mlist != null && mlist.size() != 0) {
            res = mlist.get(0);
        }
        return res;
    }

    /**
     * 获取签名MD5值
     *
     * @param context
     * @return
     */
    public static String getMD5(Context context) {
        String res = "";
        ArrayList<String> mlist = getSignInfo(context, MD5);
        if (mlist != null && mlist.size() != 0) {
            res = mlist.get(0);
        }
        return res;
    }

    /**
     * 获取签名SHA256值
     *
     * @param context
     * @return
     */
    public static String getSHA256(Context context) {
        String res = "";
        ArrayList<String> mlist = getSignInfo(context, SHA256);
        if (mlist != null && mlist.size() != 0) {
            res = mlist.get(0);
        }
        return res;
    }

    /**
     * 返回对应包的签名信息
     *
     * @param context
     * @param packageName
     * @return
     */
    private static Signature[] getSignatures(Context context, String packageName) {
        PackageInfo packageInfo = null;
        try {
            packageInfo = context.getPackageManager().getPackageInfo(packageName, PackageManager.GET_SIGNATURES);
            return packageInfo.signatures;
        } catch (Exception e) {
            LogUtil.e(e.toString());
        }
        return null;
    }

    /**
     * 获取相应的类型的字符串（把签名的byte[]信息转换成16进制）
     *
     * @param sig
     * @param type
     * @return
     */
    private static String getSignatureString(Signature sig, String type) {
        byte[] hexBytes = sig.toByteArray();
        String fingerprint = "error!";
        try {
            MessageDigest digest = MessageDigest.getInstance(type);
            if (digest != null) {
                byte[] digestBytes = digest.digest(hexBytes);
                StringBuilder sb = new StringBuilder();
                for (byte digestByte : digestBytes) {
                    sb.append((Integer.toHexString((digestByte & 0xFF) | 0x100)).substring(1, 3));
                }
                fingerprint = sb.toString();
            }
        } catch (Exception e) {
            LogUtil.e(e.toString());
        }

        return fingerprint;
    }

    /**
     * 获取相应的类型的字符串（把签名的byte[]信息转换成 95:F4:D4:FG 这样的字符串形式）
     *
     * @param sig
     * @param type
     * @return
     */
    private static String getSignatureByteString(Signature sig, String type) {
        byte[] hexBytes = sig.toByteArray();
        String fingerprint = "error!";
        try {
            MessageDigest digest = MessageDigest.getInstance(type);
            if (digest != null) {
                byte[] digestBytes = digest.digest(hexBytes);
                StringBuilder sb = new StringBuilder();
                for (byte digestByte : digestBytes) {
                    sb.append(((Integer.toHexString((digestByte & 0xFF) | 0x100)).substring(1, 3)).toUpperCase());
                    sb.append(":");
                }
                fingerprint = sb.substring(0, sb.length() - 1).toString();
            }
        } catch (Exception e) {
            LogUtil.e(e.toString());
        }

        return fingerprint;
    }
}
```

# 工具

## zipalign

<https://developer.android.com/studio/command-line/zipalign><br />zipalign 是一种 zip 归档文件对齐工具。它可确保归档中的所有未压缩文件相对于文件开头都是对齐的。这样一来，您便可直接通过 `mmap`访问这些文件，而无需在 RAM 中复制相关数据并减少了应用的内存用量。<br />在将 APK 文件分发给最终用户之前，应该先使用 zipalign 进行优化。如果您使用 Android Studio 进行构建，则此步骤会自动完成。自定义构建系统的维护者需要注意

1. 如果您使用的是 apksigner，只能在为 APK 文件签名之前执行 zipalign。如果您在使用 apksigner 为 APK 签名之后对 APK 做出了进一步更改，签名便会失效。
2. 如果您使用的是 jarsigner，只能在为 APK 文件签名之后执行 zipalign。

### 用法

如果您的 APK 包含共享库（.so 文件），则应使用 -p 来确保它们与适合 mmap(2) 的 4KiB 页面边界对齐。对于其他文件（其对齐方式由 zipalign 的必选对齐参数确定），Studio 将在 32 位和 64 位系统中对齐到 4 个字节。

- 如需对齐 infile.apk 并将其保存为 outfile.apk，请运行以下命令：

```
zipalign -p -f -v 4 infile.apk outfile.apk
```

- 如需确认 existing.apk 的对齐方式，请运行以下命令：

```
zipalign -c -v 4 existing.apk
```

您可以使用 `zipalign -h` 来查看支持的完整标志集。<br />一个未zipalign的apk：<br />![](https://cdn.nlark.com/yuque/0/2023/png/694278/1691253873960-48abd61d-191c-4b7a-bbe2-566bc99d2b29.png#averageHue=%23312f2a&clientId=ub95896c0-25b3-4&from=paste&id=ude065915&originHeight=778&originWidth=1288&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=uf4181819-755f-42e0-ac1b-e37003fd1f2&title=)

# APK签名机制

## APK格式（zip文件结构）

Apk文件本质上就是一个zip文件， zip文件整体是由三个部分组成，分别是`Contents of ZIP entries`(数据区)、`Central Directory Header`（中央目录区）以及`End of Central Directory Record`（中央目录结尾记录）。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676611599985-87d53c03-085d-4170-a760-8dca1ffb101a.png#averageHue=%231fc6d4&clientId=u1328ae71-bc13-4&from=paste&height=65&id=u08232c54&originHeight=98&originWidth=746&originalType=binary&ratio=1.5&rotation=0&showTitle=false&size=23734&status=done&style=stroke&taskId=u404c277c-11e4-42a9-b863-04de7b2f86e&title=&width=497.3333333333333)

1. Contents of ZIP entries 此区块包含了zip中所有文件的记录，是一个列表，每条记录包含：文件名、压缩前后size、压缩后的数据等
2. Central Directory 存放目录信息，也是一个列表，每条记录包含：文件吗、压缩前后size、本地文件头的起始偏移量等。通过本地文件头的起始偏移量即可找到压缩后的数据
3. End of Central Directory 标识中央目录结尾，包含：中央目录条目数、size、起始偏移量、zip文件注释内容等存储zip文件的整体信息

通过中央目录起始偏移量和size即可定位到中央目录，再遍历中央目录条目，根据本地文件头的起始偏移量即可在数据区中找到相应的压缩数据<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676684938797-328325fb-c912-4c31-8acc-4aee51a6915d.png#averageHue=%23ccdcd2&clientId=u1328ae71-bc13-4&from=paste&id=udb4b9681&originHeight=805&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=397060&status=done&style=stroke&taskId=ub1699476-44fa-4d10-a4fe-090b9f6bd39&title=)

## v1签名、v2签名、v3签名、v4签名

### V1签名：JAR签名

APK最初的签名，JAR签名

#### JAR签名过程

对一个APK文件签名之后，APK文件根目录下会增加META-INF目录，该目录下增加三个文件，分别是：`MANIFEST.MF`、`CERT.SF`和`CERT.RSA`，Android系统就是根据这三个文件的内容对APK文件进行签名检验的。<br />![](https://cdn.nlark.com/yuque/0/2023/webp/694278/1676907758204-33703262-db12-402f-b359-4586f00e2879.webp#averageHue=%23e6edf2&clientId=u4df06c95-acb5-4&from=paste&height=478&id=u3d6491e3&originHeight=714&originWidth=628&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=stroke&taskId=ub292cfdf-0ffc-4f61-97a6-67866beb222&title=&width=420)

##### MAINFEST.MF

对APK中的每个文件(除了/META-INF文件夹）的**SHA1+Base64**编码后的值保存到**MAINFEST.MF**

```groovy
Manifest-Version: 1.0
Built-By: Generated-by-ADT
Created-By: Android Gradle 3.5.0

Name: AndroidManifest.xml
SHA1-Digest: R7+PmGTdYXnFfiDdNMwRZoe6b5I=

Name: META-INF/androidx.activity_activity.version
SHA1-Digest: xTi2bHEQyjoCjM/kItDx+iAKmTU=

Name: META-INF/androidx.appcompat_appcompat-resources.version
SHA1-Digest: BeF7ZGqBckDCBhhvlPj0xwl01dw=

Name: META-INF/androidx.appcompat_appcompat.version
SHA1-Digest: BeF7ZGqBckDCBhhvlPj0xwl01dw=

Name: META-INF/androidx.arch.core_core-runtime.version
SHA1-Digest: H7e+Eu+qFgjcY+eE4zCCrgrHkZs=
```

##### CERT.SF

1. 计算这个MANIFEST.MF文件的整体SHA1值，再经过BASE64编码后，记录在CERT.SF主属性块（在文件头上）的“SHA1-Digest-Manifest”属性值值下
2. 逐条计算MANIFEST.MF文件中每一个块的SHA1，并经过BASE64编码后，记录在CERT.SF中的同名块中，属性的名字是“SHA1-Digest

```groovy
Signature-Version: 1.0
Created-By: 1.0 (Android)
SHA1-Digest-Manifest: 2+h4dULSBbymj0FVSLjqAW9znkI=
X-Android-APK-Signed: 2

Name: AndroidManifest.xml
SHA1-Digest: 9/BgaLnfamzOiddg+fhuZx5LGug=

Name: META-INF/androidx.activity_activity.version
SHA1-Digest: RkNW8YDqxBjvnU/8M+42MoBO998=

Name: META-INF/androidx.appcompat_appcompat-resources.version
SHA1-Digest: L1WSnCxLg4cpL9uEb+hKu7Q2iL0=

Name: META-INF/androidx.appcompat_appcompat.version
SHA1-Digest: Sibj0VVmL7B67oBCzlyitRpAkSE=

Name: META-INF/androidx.arch.core_core-runtime.version
SHA1-Digest: HpjKtBXDZV16FYTUu9XKKNWOX6k=
```

##### CERT.RSA

CERT.RSA中的是二进制内容，里面保存了签名者的证书信息，以及对cert.sf文件的签名

#### JAR签名校验

##### 首先校验cert.sf文件的签名

计算cert.sf文件的摘要，与通过签名者公钥解密签名得到的摘要进行对比，如果一致则进入下一步；

##### 校验manifest.mf文件的完整性

计算manifest.mf文件的摘要，与cert.sf主属性中记录的摘要进行对比，如一致则逐一校验mf文件各个条目的完整性；

##### 校验apk中每个文件的完整性

逐一计算apk中每个文件（META-INF目录除外）的摘要，与mf中的记录进行对比，如全部一致，刚校验通过；

##### 校验签名的一致性

如果是升级安装，还需校验证书签名是否与已安装app一致。

##### APK签名过程为什么能保证apk没有被篡改？

我们来看看篡改了apk内容会发生什么？

1. 篡改apk内容，没有改manifest.mf内容

如果你改变了apk中的任何文件，那么在apk安装校验时，改变后的文件摘要信息与MANIFEST.MF的校验信息不同，于是验证失败

2. 篡改apk内容，同时篡改manifest.mf文件item相应的摘要信息，但没有改cert.sf内容

如果你改变了apk的文件，并更改了MANIFEST.MF文件里对应的属性值，那么mf计算出的摘要值必定与CERT.SF文件中算出的摘要值不一样，验证失败

3. 篡改apk内容，同时篡改manifest.mf文件相应的摘要，以及cert.sf文件的内容

最后，如果你改变的apk的文件，更改了MANIFEST.MF文件的值，并计算出MANIFEST.MF的摘要值，相应的更改了CERT.SF里面的值，那么数字签名值必定与CERT.RSA文件中记录的不一样，还是验证失败；由于不能伪造数字证书，没有对应的私钥，就改变不了cert.rsa中的内容。

4. 把apk内容和签名信息一同全部篡改

这相当于对apk进行了重新签名，在此apk没有安装到系统中的情况下，是可以正常安装的，这相当于是一个新的app；但如果进行覆盖安装，则证书不一证，安装失败

#### JAR签名机制缺点

1. **签名校验速度慢** 校验过程中需要对apk中所有的文件进行摘要计算，在apk资源很多、性能较差的机器上签名校验会花费较长时间，导致安装速度慢
2. **完整性保障不够 **META-INF目录用来存放签名，自然此目录本身是不计入签名校验过程的，可以随意在这个目录中添加文件，之前一些旧的打渠道包方案就是在这里添加渠道文件的

### V2签名：APK Signing Block

Android7引入，v2 签名模式在原先 APK 块中增加了一个APK签名分块`APK Signing Block`。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676737447873-1a8e3018-c3bf-4b26-a7f7-7de260510a5d.png#averageHue=%2370c24d&clientId=u1328ae71-bc13-4&from=paste&id=u1d3ee56a&originHeight=234&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=151999&status=done&style=stroke&taskId=u44ea4949-5149-4554-8cdb-18137db09ad&title=)

> JAR签名在APK中添加META-INF目录，需要修改数据区、中央目录，因为添加文件后会导致中央目录大小和偏移量发生变化，还需要修改中央目录结尾记录；V2签名为加强数据完整性保证，不在数据区和中央目录中插入数据，新增一个APK签名分块，从而保证了APK数据的完整性

V2签名块负责保护第1、3、4部分的完整性，以及第2部分包含的APK Signing Block中的signed data分块的完整性；V2签名后，任何对1、3、4部分的修改都逃不过v2签名方案的检查，APK Signing Block块替代了V1中META-INF的作用。

#### V2签名块格式

- size of block  8字节
- 带uint64 长度前缀的`ID-VALUE`对序列  变长
- size of block 8字节
- magic value APK签名分块 42 （16个字节）

APK签名分块包含了4部分：分块长度、ID-VALUE序列、分块长度、固定magic值。其中APK 签名方案 v2分块存放在ID为`0x7109871a`的键值对中，包含的内容如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676738641219-9445d445-d719-45c2-b75d-a9536b664594.png#averageHue=%23b0cfd0&clientId=u1328ae71-bc13-4&from=paste&height=657&id=u0ae24dec&originHeight=844&originWidth=624&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=197403&status=done&style=stroke&taskId=ucaf95924-86ca-486a-9672-d3c3c2e1c22&title=&width=486)

- 带长度前缀的 signer1：
  - 带长度前缀的 signed data，包含digests序列，X.509 certificates 序列， additional attributes序列
  - 带长度前缀的 signatures（带长度前缀）序列
  - 带长度前缀的 public key（SubjectPublicKeyInfo，ASN.1 DER 形式）
- signer2，因为Android允许多个签名。

#### V2签名过程

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676738857771-4436a822-daf9-42b3-a904-bbe4b7677525.png#averageHue=%23d6dbc3&clientId=u1328ae71-bc13-4&from=paste&height=244&id=u536e4265&originHeight=425&originWidth=1200&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=178416&status=done&style=stroke&taskId=u135050a0-1126-4500-85f6-0a88943477a&title=&width=690)

1. 拆分chunk

将_ZIP条目的内容_、_ZIP中央目录_、_ZIP中央目录结尾_拆分成多个大小为1MB大小的chunk，最后一个chunk可能小于1M。**之所以分块，是为了可以通过并行计算摘要以加快计算速度**；

2. 计算chunk摘要

计算每个小块的数据摘要，数据内容是：`0xa5 + 块字节长度 + 块的内容`

3. 计算整体摘要

数据内容是：`0x5a + 数据块的数量(chunk数量) + 每个数据块的摘要内容`<br />**总之，就是把 APK 按照 1M 大小分割，分别计算这些分段的摘要，最后把这些分段的摘要在进行计算得到最终的摘要也就是 APK 的摘要。然后将 APK 的摘要 + 数字证书 + 其他属性生成签名数据写入到 APK Signing Block 区块。**

#### V2签名校验

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676739200865-a2c1fce4-ee51-4e31-b997-d9d2b740c854.png#averageHue=%23faedea&clientId=u1328ae71-bc13-4&from=paste&id=ude18e290&originHeight=427&originWidth=657&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=119075&status=done&style=stroke&taskId=u0599a774-754c-4b7a-8334-94c56fbef0d&title=)<br />v2 签名机制是在 Android 7.0 以及以上版本才支持的。因此对于 Android 7.0 以及以上版本，在安装过程中，如果发现有 v2 签名块，则必须走 v2 签名机制，不能绕过。否则降级走 v1 签名机制。v1 和 v2 签名机制是可以同时存在的，其中对于 v1 和 v2 版本同时存在的时候，v1 版本的 META_INF 的 .SF 文件属性当中有一个 `X-Android-APK-Signed: 2` 属性。

### V3签名：密钥转轮

Android9.0引入，支持密钥轮换，使得应用能够在APK更新过程中更改其签名密钥。为了支持密钥轮换，在V2的基础上增加两个数据块来存储APK密钥轮替所需要的一些信息。<br />V3在签名部分可以添加新的证书（Attr块）。在这个新块中，会记录我们之前的签名信息以及新的签名信息，以密钥转轮的方案，来做签名的替换和升级。这意味着，只要旧签名证书在手，我们就可以通过它在新的 APK 文件中，更改签名。<br />v3 签名新增的新块（attr）存储了所有的签名信息，由更小的 Level 块，以链表的形式存储。<br />其中每个节点都包含用于为之前版本的应用签名的签名证书，最旧的签名证书对应根节点，系统会让每个节点中的证书为列表中下一个证书签名，从而为每个新密钥提供证据来证明它应该像旧密钥一样可信。

#### V3签名校验过程

Android 的签名方案，无论怎么升级，都是要确保向下兼容。因此，在引入 v3 方案后，Android 9.0 及更高版本中，可以根据 APK 签名方案，v3 -> v2 -> v1 依次尝试验证 APK。而较旧的平台会忽略 v3 签名并尝试 v2 签名，最后才去验证 v1 签名。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676739878504-50d5d810-d52a-4de2-bfd8-52a2269deb3d.png#averageHue=%23fcfcfc&clientId=u1328ae71-bc13-4&from=paste&id=u4b077c9c&originHeight=648&originWidth=1018&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=94235&status=done&style=stroke&taskId=uafa4944b-d2f6-4d94-953c-94cbe3f8446&title=)

> 需要注意的是，对于覆盖安装的情况，签名校验只支持升级，而不支持降级。也就是说设备上安装了一个使用 v1 签名的 APK，可以使用 v2 签名的 APK 进行覆盖安装，反之则不允许。

### V4签名：ADB 增量 APK 安装

Android11引入，支持与流式传输兼容的签名方案。为了支持ADB增量APK安装功能。<br />因为需要流式传输，所以需要将文件分块，对每一块进行签名以便校验，使用的方式就是Merkle 哈希树（<https://www.kernel.org/doc/html/latest/filesystems/fsverity.html#merkle-tree），APK> v4就是做这部分功能的。所以APK v4与APK v2或APK v3可以算是并行的，所以APK v4签名后还需要 v2 或 v3 签名作为补充。

**ADB 增量 APK 安装**<br />在设备上安装大型（2GB 以上）APK 可能需要很长的时间，即使应用只是稍作更改也是如此。ADB 增量 APK 安装可以安装足够的 APK 以启动应用，同时在后台流式传输剩余数据，从而加速这一过程。如果设备支持该功能，并且您安装了最新的 SDK 平台工具，adb install 将自动使用此功能。如果不支持，系统会自动使用默认安装方法。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1676740092601-a948e07e-bbc2-45cb-badd-f68fa2997145.png#averageHue=%23140804&clientId=u1328ae71-bc13-4&from=paste&id=uc56ee216&originHeight=442&originWidth=1080&originalType=url&ratio=1.5&rotation=0&showTitle=false&size=143463&status=done&style=stroke&taskId=u36da6a4f-d96c-4a80-8f8b-aaabbd8d6f2&title=)

### 小结

1. v1方案：基于JAR签名，签名信息写入到/META-INF中，此目录不受签名保护
2. v2方案：在Android7.0引入，引入APK Signing Blocking区域，用于解决v1签名速度过慢（需要对所有文件Hash及签名；及/META-INF下的文件不计入签名校验的，解决完整性保障不够的问题
3. v3方案：在Android9.0引入，用于支持密钥轮换
4. v4方案：支持ADB增量更新

其中v1到v2时颠覆性的，主要是为了解决JAR签名方案的安全性问题；v3方案，结构上并没有太大的调整，可以理解为v2签名方案的升级版

# APK和AAB

# Ref

- [x] 1、[APK签名机制原理详解](https://www.jianshu.com/p/286d2b372334)

- [x] 2、[APK签名机制之——JAR签名机制详解](https://www.jianshu.com/p/682bb351099f)

- [x] 3、[APK签名机制之——V2签名机制详解](https://www.jianshu.com/p/308515c94dc6)
