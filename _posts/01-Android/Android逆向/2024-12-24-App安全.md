---
date created: 2024-12-24 00:45
date updated: 2024-12-24 00:45
dg-publish: true
tags:
  - '#include'
  - '#include'
  - '#define'
  - '#define'
---

# 禁止APP录屏和截屏

Android有些APP会为了安全，禁止录屏和截屏，例如：金融、银行相关的。禁止录屏和截屏并不难，只需要在 Activity 的onCreate() 方法中添加一行代码即可：

```
getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
```

添加这行代码后，当截屏的时候，系统会弹出一个Toast提示“禁止屏幕抓取”；当录屏的时候，看似能够正常录制，但是保存后的视频，都是一片黑色，并没有APP的相关界面。<br /><https://www.cnblogs.com/qixingchao/p/11652392.html>

# Android KeyStore非对称+对称加密

## KeyStore

Android KeyStore系统允许你存储加密密钥。如果是`AndroidKeyStore`这种类型的话，keystore难以从设备中导出，并且可以指明key的使用规则，例如只有用户验证后，才可以使用key等；但如果是`bks`这种的话，就比较容易导出。

1. Key material never enters the application process.
2. Key material may be bound to the secure hardware(e.g., Trusted Execution Environment(TEE), Secure Element(SE)) of the Android device.

可以通过以下代码获取你的KeyStore：

```java
try {
    KeyStore mKeyStore = KeyStore.getInstance(“类型");
} catch (KeyStoreException e) {
    return;
}
```

KeyStore.getInstance(参数)中的参数可以传以下内容：

1. `AndroidKeyStore`：这里要先区分下AndroidKeyStore和Android KeyStore，虽然这两个一样，但是后者中间多了个空格，意义是不一样的，前者是子集，后者是父集，后者包含前者。而AndroidKeyStore主要是用来存储一些密钥key的，存进该处的key可以为其设置KeyProtection，例如只能通过用户验证才能取出key使用等。这些key是存在系统里的，不是在app的目录下，并且每个app不能访问其他app的key，如果app1创建了key1，并且存储的时候命名为temp，app2去通过temp去访问key，是获取不到的！！
2. `KeyStore.getDefaultType()`：该函数返回的是一个字符串，在java下，返回的是JKS，在Android下，返回的是BKS。(注：android 系统中使用的证书要求以BKS的库文件结构保存，通常情况下，我们使用java的keytool只能生成jks的证书库。读取key可以通过psw来读取)。当你使用这个keystore的时候，其文件存放在data（沙盒中）

### 签名和Keystore关系

签名的话其实是对一个app加上开发者的签名，证明这个app和开发者的关系。通过签名可以证明这个是正版的app，如果是假冒伪劣的app，那么是不允许安装的。这怎么说呢？其实就是用了签名keystore文件，在该文件中有一对`非对称密钥`，签名的时候使用`私钥`对apk中所有的文件内容进行加密，并且签名后的apk携带keystore文件中的公钥，当安装在手机系统上的时候系统会取出公钥，对apk进行验证，查看是不是使用正确私钥加密的apk，或者apk是否被人篡改过。如果篡改过，那么公钥验证不通过。

## 使用

```java
/**
 * AndroidKeyStore加密存储
 *
 * 1. 使用KeyStore随机生成RSA Key
 *
 * 2. 产生AES Key，并用RSA Public Key加密后保存到sp
 *
 * 3. 从SP取出AES Key，并用RSA Private Key解密，用这把AES Key来加解密数据
 */
public final class AndroidKeyStoreUtils {

    private static final String KEYSTORE_PROVIDER = "AndroidKeyStore";
    private static final String KEYSTORE_ALIAS = "KEYSTORE_DEMO";

    private static final String AES_MODE = "AES/GCM/NoPadding";
    private static final String RSA_MODE = "RSA/ECB/PKCS1Padding";

    private static KeyStore sMKeyStore;

    public static void init() {
        try {
            initKeyStore();
            generateKey();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static KeyStore initKeyStore() throws Exception {
        if (sMKeyStore == null) {
            log("1. 初始化AndroidKeyStore");
            sMKeyStore = KeyStore.getInstance(KEYSTORE_PROVIDER);
            sMKeyStore.load(null);
        }
        return sMKeyStore;
    }

    private static void generateKey() {
        try {
            if (getAESKey() == null || getAESIV() == null) {
                genKeyStoreKey(GlobalContext.getAppContext());
                genAESKey();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 1、KeyStore生成RSA Key
     */
    private static void genKeyStoreKey(Context context) throws Exception {
        log("2. AndroidKeyStore生成RSA Key");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            generateRSAKey_AboveApi23();
        } else {
            generateRSAKey_BelowApi23(context);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private static void generateRSAKey_AboveApi23() throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator
                .getInstance(KeyProperties.KEY_ALGORITHM_RSA, KEYSTORE_PROVIDER);

        KeyGenParameterSpec keyGenParameterSpec = new KeyGenParameterSpec
                .Builder(KEYSTORE_ALIAS, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
                .build();

        keyPairGenerator.initialize(keyGenParameterSpec);
        keyPairGenerator.generateKeyPair();
    }

    private static void generateRSAKey_BelowApi23(Context context) throws NoSuchAlgorithmException,
            NoSuchProviderException, InvalidAlgorithmParameterException {
        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        end.add(Calendar.YEAR, 30);

        KeyPairGeneratorSpec spec = new KeyPairGeneratorSpec.Builder(context)
                .setAlias(KEYSTORE_ALIAS)
                .setSubject(new X500Principal("CN=" + KEYSTORE_ALIAS))
                .setSerialNumber(BigInteger.TEN)
                .setStartDate(start.getTime())
                .setEndDate(end.getTime())
                .build();

        KeyPairGenerator keyPairGenerator = KeyPairGenerator
                .getInstance(KeyProperties.KEY_ALGORITHM_RSA, KEYSTORE_PROVIDER);

        keyPairGenerator.initialize(spec);
        keyPairGenerator.generateKeyPair();
    }

    /**
     * 生成AES Key和IV，用RSA Public Key加密AES Key保存到SP
     */
    private static void genAESKey() throws Exception {
        // Generate AES-Key
        byte[] aesKey = new byte[16];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(aesKey);

        // Generate 12 bytes iv then save to SharedPrefs
        byte[] generated = secureRandom.generateSeed(12);
        String iv = Base64.encodeToString(generated, Base64.DEFAULT);
        log("【genAESKey】初始化一个iv并进行Base64编码保存：" + iv);
        SPUtils.put("aes_iv", iv);

        // Encrypt AES-Key with RSA Public Key then save to SharedPrefs
        String encryptAESKey = encryptRSA(aesKey);
        SPUtils.put("aes_key", encryptAESKey);
        log("【genAESKey】初始化一个AES Key并通过RSA公钥进行加密保存：" + encryptAESKey);

        log("3. 生成AES Key和IV，用RSA Public Key加密AES Key保存到SP，IV base64：" + iv + "，encryptAESKeyByRSAPublicKey：" + encryptAESKey);
    }

    /**
     * RSA公钥加密
     *
     * 使用RSA Public Key 加密 AES Key，存入缓存中
     */
    private static String encryptRSA(byte[] plainText) throws Exception {
        PublicKey publicKey = initKeyStore().getCertificate(KEYSTORE_ALIAS).getPublicKey();

        Cipher cipher = Cipher.getInstance(RSA_MODE);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        byte[] encryptedByte = cipher.doFinal(plainText);
        return Base64.encodeToString(encryptedByte, Base64.DEFAULT);
    }

    /**
     * RSA私钥解密
     *
     * 使用RSA Private Key 解密 得到 AES Key
     */
    private static byte[] decryptRSA(String encryptedText) throws Exception {
        PrivateKey privateKey = (PrivateKey) initKeyStore().getKey(KEYSTORE_ALIAS, null);

        Cipher cipher = Cipher.getInstance(RSA_MODE);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);

        byte[] encryptedBytes = Base64.decode(encryptedText, Base64.DEFAULT);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

        return decryptedBytes;
    }

    private static SecretKeySpec getAESKey() throws Exception {
        String aesKey = (String) SPUtils.get("aes_key", "");
        if (TextUtils.isEmpty(aesKey)) {
            return null;
        }
        byte[] aesKeyBytes = decryptRSA(aesKey);
        return new SecretKeySpec(aesKeyBytes, AES_MODE);
    }

    private static byte[] getAESIV() {
        String aesIV = (String) SPUtils.get("aes_iv", "");
        if (TextUtils.isEmpty(aesIV)) {
            return null;
        }
        byte[] iv = Base64.decode(aesIV, Base64.DEFAULT);
        return iv;
    }

    /**
     * AES Encryption
     *
     * @param plainText: A string which needs to be encrypted.
     * @return A base64's string after encrypting.
     */
    public static String encryptAES(String plainText) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_MODE);
        cipher.init(Cipher.ENCRYPT_MODE, getAESKey(), new IvParameterSpec(getAESIV()));

        // 加密過後的byte
        byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());

        // 將byte轉為base64的string編碼
        String cipherData = Base64.encodeToString(encryptedBytes, Base64.DEFAULT);
        log("AES加密+base64：" + cipherData);
        return cipherData;
    }

    public static String decryptAES(String encryptedText) throws Exception {
        // 將加密過後的Base64編碼格式 解碼成 byte
        byte[] decodedBytes = Base64.decode(encryptedText.getBytes(), Base64.DEFAULT);

        // 將解碼過後的byte 使用AES解密
        Cipher cipher = Cipher.getInstance(AES_MODE);
        cipher.init(Cipher.DECRYPT_MODE, getAESKey(), new IvParameterSpec(getAESIV()));

        String plainTextData = new String(cipher.doFinal(decodedBytes));
        log("Base64+AES解密：" + plainTextData);
        return plainTextData;
    }

    /**
     * 字节数组转16进制
     *
     * @param bytes 需要转换的byte数组
     * @return 转换后的Hex字符串
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < bytes.length; i++) {
            String hex = Integer.toHexString(bytes[i] & 0xFF);
            if (hex.length() < 2) {
                sb.append(0);
            }
            sb.append(hex);
        }
        return sb.toString();
    }

    private static void log(String msg) {
        LogUtil.i(msg);
    }

}
```

## Reference

- Android Keystore 对称－非对称加密<br /><https://www.cnblogs.com/CharlesGrant/p/8378854.html>

# App安全

## 接口安全

### 请求合法性校验

- 身份校验，一般用token
- token一般要有有效期

### 参数签名校验

1. header或params参与计算，进行hash
2. 加点盐啥的

#### 流程

在http的请求中生成唯一的签名(signature), 当server接收到请求之后首先对请求中参数进行校验，采用同样签名方式生成签名及其校验，如果服务端生成的签名(autograph)和http请求的signature一致，则处理清理，否则，则请求丢弃。其交互流程如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700294031369-e6599539-1565-4fe8-9a9c-b9158a8a5b4a.png#averageHue=%23f9f7f1&clientId=ube845635-0949-4&from=paste&height=517&id=uac8a9068&originHeight=2560&originWidth=2622&originalType=binary&ratio=2&rotation=0&showTitle=false&size=284958&status=done&style=stroke&taskId=uedcbff23-980f-4e19-991d-3f3127fc6ee&title=&width=530)<br />以上所示中，网关和前端针对同一个appKey采取同样的秘钥，用请求签名的版本号老兼容、过度、演进签名算法，其两侧的签名算法保持一致，此处，由于前端逆向工程及其秘钥储存安全性考虑，前端侧采取无线保镖(灰度安全图片)进行秘钥储存，其无线保镖生成规则如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700294063940-903044b0-a52b-42e8-b13b-dd483f55e6ae.png#averageHue=%23f9f4ef&clientId=ube845635-0949-4&from=paste&height=293&id=uff99e513&originHeight=1028&originWidth=1824&originalType=binary&ratio=2&rotation=0&showTitle=false&size=171009&status=done&style=stroke&taskId=u6ea49f5f-bc59-495f-9a80-7dc389b231e&title=&width=519)<br />在前端运行时从无线保镖(安全图片)获取秘钥，该秘钥用于计算生成请求签名，对于请求签名的生成的代码安全。web侧用严格的js混淆、压缩，并将其核心算法注册到service worker，app将签名算法用其C++实现，Android、IOS通过FFI方式进行底层调用， 并将其接入到Http的SDK中。<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1700294093457-939c808c-e73f-4872-8564-560d2566bf17.png#averageHue=%23f9f7f5&clientId=ube845635-0949-4&from=paste&height=282&id=ue41b27f1&originHeight=1464&originWidth=2948&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143870&status=done&style=stroke&taskId=ubfa39fd2-97eb-4aec-99e5-fd934aac794&title=&width=568)<br />其请求签名的核心算法如下：

> 网关会根据请求参数，对签名进行验证，签名不合法的请求将会被拒绝。目前暂定支持的签名算法有三种：MD5(sign_method=md5)，HMAC_MD5(sign_method=hmac)，HMAC_SHA256（sign_method=hmac-sha256)，签名大体过程如下：
>
> - 对所有API请求参数（本地仅仅是请求头)，但除去sign参数和byte[]类型的参数），根据参数名称的[ASCII](http://www.asciima.com/)码表的顺序排序。如：foo:1, bar:2, foo_bar:3, foobar:4排序后的顺序是bar:2, foo:1, foo_bar:3, foobar:4。
> - 将排序好的参数名和参数值拼装在一起，根据上面的示例得到的结果为：bar2foo1foo_bar3foobar4。
> - 把拼装好的字符串采用utf-8编码，使用签名算法对编码后的字节流进行摘要。如果使用MD5算法，则需要在拼装的字符串前后加上app的secret后，再进行摘要，如：md5(secret+bar2foo1foo_bar3foobar4+secret)；如果使用HMAC_MD5算法，则需要用app的secret初始化摘要算法后，再进行摘要，如：hmac_md5(bar2foo1foo_bar3foobar4)。
> - 将摘要得到的字节流结果使用十六进制表示，如：hex("helloworld".getBytes("utf-8")) = "68656C6C6F776F726C64"

说明：MD5和HMAC_MD5都是128位长度的摘要算法，用16进制表示，一个十六进制的字符能表示4个位，所以签名后的字符串长度固定为32个十六进制字符。

#### JAVA 代码签名示例：

```java
public static String signTopRequest(Map<String, String> params, String secret, String signMethod) throws IOException {
    // 第一步：检查参数是否已经排序
    String[] keys = params.keySet().toArray(new String[0]);
    Arrays.sort(keys);
 
    // 第二步：把所有参数名和参数值串在一起
    StringBuilder query = new StringBuilder();
    if (Constants.SIGN_METHOD_MD5.equals(signMethod)) { //签名的摘要算法，可选值为：hmac，md5，hmac-sha256
        query.append(secret);
    }
    for (String key : keys) {
        String value = params.get(key);
        if (StringUtils.areNotEmpty(key, value)) {
            query.append(key).append(value);
        }
    }
 
    // 第三步：使用MD5/HMAC加密
    byte[] bytes;
    if (Constants.SIGN_METHOD_HMAC.equals(signMethod)) {
        bytes = encryptHMAC(query.toString(), secret);
    } else {
        query.append(secret);
        bytes = encryptMD5(query.toString());
    }
 
    // 第四步：把二进制转化为大写的十六进制(正确签名应该为32大写字符串，此方法需要时使用)
    //return byte2hex(bytes);
}
 
public static byte[] encryptHMAC(String data, String secret) throws IOException {
    byte[] bytes = null;
    try {
        SecretKey secretKey = new SecretKeySpec(secret.getBytes(Constants.CHARSET_UTF8), "HmacMD5");
        Mac mac = Mac.getInstance(secretKey.getAlgorithm());
        mac.init(secretKey);
        bytes = mac.doFinal(data.getBytes(Constants.CHARSET_UTF8));
    } catch (GeneralSecurityException gse) {
        throw new IOException(gse.toString());
    }
    return bytes;
}
 
public static byte[] encryptMD5(String data) throws IOException {
    return encryptMD5(data.getBytes(Constants.CHARSET_UTF8));
}
 
public static String byte2hex(byte[] bytes) {
    StringBuilder sign = new StringBuilder();
    for (int i = 0; i < bytes.length; i++) {
        String hex = Integer.toHexString(bytes[i] & 0xFF);
        if (hex.length() == 1) {
            sign.append("0");
        }
        sign.append(hex.toUpperCase());
    }
    return sign.toString();
}
```

#### post参数多层时的sign时候

设计sign校验时，如果要校验body的参数和值，那么需要考虑是否要校验多层的结构，很多只设计了单层的校验。

> 第1种单层`{key1:value1, key2:value2}`，第2种多层`{key1:value1,key2:{key3:value3,key4:value4} }`及第3种多层数组`{key1:value1,  key2:[{key3:value3,key4:value4],} }`传递参数方式，只支持单层；第2种和第3种sign校验要多考虑

案例：

```
{
  "wish": [
        {"gid": 2, // 礼物id
         "cnt": 10, // 目标礼物数量
         "rwd": "奖励xx",
        },
        ...
      ]
}
```

### body加密

body体进行对称加密

### 接口重放攻击

请求重放就是指把请求被原封不动地重复发送，一次，两次...n次，<br />在针对http的请求方式中，有post、put等请求方式是不冪等的。这种情况下，就需要更加注意请求重放啦，从而造成不必要的大量的脏数据。在pc上的处理通常处理方式是隐藏域或token来解决。而针对restful api我们需要用`timestamp+nonce`来解决。

#### client端(HTTP SDK)

1. timestamp
   - 用来表示请求的当前时间戳，这个时间要事先和服务器时间戳校正过。我们预期正常请求带的时间戳会是不同的，如：假设正常人每秒至多会做一个操作。
   - 每个请求携带的时间戳不能和当前时间距离很近，即不能超过规定时间，如60s。这样请求即使被截取了，也只能在有限时间（如：60s）内进行重放，过期就会失效
2. nonce
   - 仅仅提供timestamp还是不够的，我们还是提供给攻击者60s的可攻击时间了。要避免60秒内发生攻击，我们还需要使用一个nonce随机数。
   - nonce是由客户端根据随机生成的，比如 md5(timestamp+rand(0, 1000)，正常情况下，在短时间内（比如60s）连续生成两个相同nonce的情况几乎为0。

#### server端(Gateway)

- 在分布式缓存(如: REDIS)中查找是否有key为nonce:{nonce}的string
- 如果没有，则创建这个key，把这个key失效的时间和验证timestamp失效的时间设置一致，比如是60s。
- 如果有，说明这个key在60s内已被使用过了，这个请求就可以判断为重放请求。

## so安全

### 1、三方app key存so

通过简单的算法将key生成出来

### 2、so防止被盗用

so校验app的签名

## App加固

## App加壳

## App反调试与代码保护的一些基本方案Proguard

### isDebuggerConnected

isDebuggerConnected函数用于检测此刻是否有调试器挂载到程序上，如果返回值为true则表示此刻被调试中。用法很简单，如下：<br />![](http://note.youdao.com/yws/res/19989/C57590A1BB664054AE1A316D8F9D1F59#id=OQT0B&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=stroke&title=)![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691243420668-d300acf1-47a4-4b01-922e-3771271b24c4.png#averageHue=%232c2d26&clientId=u87009442-06f5-4&from=paste&height=83&id=u077f8e06&originHeight=103&originWidth=564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=48054&status=done&style=stroke&taskId=u05e5340d-1201-477c-a9c2-0ae0e5e6bf9&title=&width=455)

### android:debuggable属性

在Android的AndroidManifest.xml清单文件的application节点下加入android:debuggable="false"属性，使程序不能被调试。在Java程序代码里也可检测该属性的值，如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/694278/1691243426441-29127346-4c3b-40f3-ace3-731e92ad1b30.png#averageHue=%232c2c26&clientId=u87009442-06f5-4&from=paste&height=101&id=u4175a3f1&originHeight=138&originWidth=628&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63433&status=done&style=stroke&taskId=u5f659a0f-6791-4af0-be23-a4719b64cc8&title=&width=461)

- Android app反调试与代码保护的一些基本方案<br /><https://mp.weixin.qq.com/s/uvrkAvbfWuDYf7SWX_dJBA>

## Android 密钥、AppSecret保存到native层

### 保存密钥常用方式

1. 硬编码到Java层 or Java层变相/计算保存
2. Gradle，通过BuildConfig读取
3. 写在gradle properties中，再在build gradle中读取，同第二种方法

> 实质都是Java代码，Android代码中很容易让别人通过反编译进行读取；这样就存在很大的安全隐患；

### 保存到C/C++代码

```c
#include <jni.h>
#include <string>

#define LOGINFO(...) ((void)__android_log_print(ANDROID_LOG_INFO, "security", __VA_ARGS__))
#define LOGERROR(...) ((void)__android_log_print(ANDROID_LOG_ERROR, "security", __VA_ARGS__))

extern "C"
JNIEXPORT jstring JNICALL
Java_qsbk_app_voice_common_net_SecurityUtils_getSecretKey(JNIEnv *env, jclass type) {
    std::string hello = "obMImdpSP0mqGKlzIYyJej09HqzOj08G";
    return env->NewStringUTF(hello.c_str());
}

extern "C"
JNIEXPORT jstring JNICALL
Java_qsbk_app_voice_common_net_SecurityUtils_getSault(JNIEnv *env, jclass type) {
    return env->NewStringUTF("sault");
}

extern "C"
JNIEXPORT jstring JNICALL
Java_qsbk_app_voice_common_net_SecurityUtils_getMMKVKey(JNIEnv *env, jclass type) {
    return env->NewStringUTF("hbMImdpSP0mqGKlzIYyJej09HqzOj17G");
}
```

声明Java代码

```java

public final class SecurityUtils {
    static {
        System.loadLibrary("qbvoicechatsecurity");
    }

    public static native String getMMKVKey();

    public static native String getSecretKey();

    public static native String getSault();
}
```

> Jni是通过反射的方式来相互调用，也就是说，我们的native方法是不能混淆的，那么就可以反编译拿到.so库和同名的native方法，然后通过二次打包debug出这个密钥串。所以我们需要一种预防debug的手段，这里我们采取验证apk签名的方式来达到目的，当发现apk签名和我们自己的签名不一致的时候，调用so库直接崩溃即可。
