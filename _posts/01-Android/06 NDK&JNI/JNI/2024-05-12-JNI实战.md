---
date created: 2024-05-12 00:22
date updated: 2024-12-24 00:34
dg-publish: true
---

# C/C++调用 Java

## 数据类型

### Java 传递各种类似数据给 C++

**示例：**

- Kotlin 代码

```kotlin
/**
 * Kotlin 将数据传递到 native 中
 */
private external fun testJavaDataToCpp(
	boolean1: Boolean,
	byte1: Byte,
	char1: Char,
	short1: Short,
	long1: Long,
	float1: Float,
	double1: Double,
	name: String?,
	age: Int,
	intArray1: IntArray?,
	strs: Array<String?>?,
	person: Person?,
	bArray: BooleanArray?
)
// 调用
testJavaDataToCpp(  
    true,  
    127,  
    'b',  
    2,  
    10000000000009L,  
    4.0f,  
    5.011991,  
    "hacket",  
    6,  
    intArrayOf(1, 2, 3),  
    arrayOf("a", "b", "c"),  
    Person("hacket", 18),  
    booleanArrayOf(true, false, true)  
)
```

- cpp 代码

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_MainActivity_testJavaDataToCpp(
        JNIEnv *env, // JNI环境
        jobject thiz, // MainActivity 对象
        jboolean jboolean1, // boolean
        jbyte jbyte1, // byte
        jchar jchar1, // char
        jshort jshort1, // short
        jlong jlong1, // long
        jfloat jfloat1, // float
        jdouble jdouble1, // double
        jstring jstring1, // String
        jint jint1, // int
        jintArray jintArray1, // int[]
        jobjectArray strs, // String[]
        jobject person, // Person
        jbooleanArray jbooleanArray1 // boolean[]
) {
    // 接收 Java 传递过来的 boolean 值
    unsigned char b_bool = jboolean1;
    LOGD("b_bool: %d", b_bool);

    // 接收 Java 传递过来的 byte 值
    char b_byte = jbyte1;
    LOGD("b_byte: %d", b_byte);

    // 接收 Java 传递过来的 char 值
    char b_char = jchar1;
    LOGD("b_char: %c", b_char);

    // 接收 Java 传递过来的 short 值
    short b_short = jshort1;
    LOGD("b_short: %d", b_short);

    // 接收 Java 传递过来的 long 值
    long b_long = jlong1;
    LOGD("b_long: %ld", b_long);

    // 接收 Java 传递过来的 float 值
    float b_float = jfloat1;
    LOGD("b_float: %f", b_float);

    // 接收 Java 传递过来的 double 值
    double b_double = jdouble1;
    LOGD("b_double: %f", b_double);

    // 接收 Java 传递过来的 String 值
    const char *b_string = env->GetStringUTFChars(jstring1, 0);
    LOGD("b_string: %s", b_string);
    // 释放
    env->ReleaseStringUTFChars(jstring1, b_string);

    // 接收 Java 传递过来的 int 值
    int age_java = jint1;
    LOGD("int:%d", age_java);

    // 接收 Java 传递过来的 int 数组
    jint *intArray = env->GetIntArrayElements(jintArray1, 0);
    // 获取数组长度
    int length = env->GetArrayLength(jintArray1);
    // 遍历数组
    for (int i = 0; i < length; i++) {
        LOGD("intArray[%d]: %d", i, intArray[i]);
    }
    // 释放数组
    env->ReleaseIntArrayElements(jintArray1, intArray, 0);

    // 接收 Java 传递过来的 String[]
    jsize stringArrayLength = env->GetArrayLength(strs);
    for (jsize i = 0; i < stringArrayLength; i++) {
        jobject jobject1 = env->GetObjectArrayElement(strs, i);
        // 转换成 jstring
        jstring stringArrayData = static_cast<jstring>(jobject1);

        // 转换成 char*（C String）
        const char *itemCStr = env->GetStringUTFChars(stringArrayData, 0);
        LOGD("StringArray[%d]: %s", i, itemCStr);
        // 释放
        env->ReleaseStringUTFChars(stringArrayData, itemCStr);
    }

    // 获取 Person 类
    // 获取 Person 类的全路径
    const char *person_class_str = "me/hacket/jni/Person";
    // 转 jni jclass
    jclass personClass = env->FindClass(person_class_str);
    // 方法签名
    const char *sig = "()Ljava/lang/String;";
    // 获取 Person 类的方法
    jmethodID getNameMethod = env->GetMethodID(personClass, "getName", sig);

    // 调用方法
    jobject obj_string = env->CallObjectMethod(person, getNameMethod);
    // 转换成 jstring
    jstring personGetNameJString = static_cast<jstring>(obj_string);
    // 转换成 char*（C String）
    const char *personGetNameCString = env->GetStringUTFChars(personGetNameJString, 0);
    LOGD("Person.getName() by FindClass: %s", personGetNameCString);

    // 直接获取jstring
    jstring person_get_name_jstring2 = (jstring) env->CallObjectMethod(person, getNameMethod);
    // 转换成 char*（C String）
    const char *person_get_name_cstring2 = env->GetStringUTFChars(person_get_name_jstring2, 0);
    LOGD("Person.getName() by CallObjectMethod(): %s", person_get_name_cstring2);

    // 释放
    env->DeleteLocalRef(personClass); // 回收
//    env->DeleteLocalRef(person); // 不需要回收形参中的person，方法结束后会自动回收

    jclass personClass2 = env->GetObjectClass(person);
    jmethodID getNameMethod2 = env->GetMethodID(personClass2, "getName", "()Ljava/lang/String;");
    jobject obj_string2 = env->CallObjectMethod(person, getNameMethod2);
    jstring personGetNameJString2 = static_cast<jstring>(obj_string2);
    const char *personGetNameCString2 = env->GetStringUTFChars(personGetNameJString2, 0);
    LOGD("Person.getName() by GetObjectClass: %s", personGetNameCString2);
    env->DeleteLocalRef(personClass2); // 需要回收


    // 接收 Java 传递过来的 boolean 数组
    jboolean *b_booleanArray = env->GetBooleanArrayElements(jbooleanArray1, 0);
    // 获取数组长度
    int booleanArrayLength = env->GetArrayLength(jbooleanArray1);
    // 遍历数组
    for (int i = 0; i < booleanArrayLength; i++) {
        bool b = b_booleanArray[i];
        jboolean b2 = b_booleanArray[i];
        LOGD("boolean:%d", b);
        LOGD("jboolean:%d", b2);
    }
    // 释放数组
    env->ReleaseBooleanArrayElements(jbooleanArray1, b_booleanArray, 0);
}
```

输出：

```cpp
 D  b_bool: 1
 D  b_byte: 127
 D  b_char: b
 D  b_short: 2
 D  b_long: 10000000000009
 D  b_float: 4.000000
 D  b_double: 5.011991
 D  b_string: hacket
 D  int:6
 D  intArray[0]: 1
 D  intArray[1]: 2
 D  intArray[2]: 3
 D  StringArray[0]: a
 D  StringArray[1]: b
 D  StringArray[2]: c
 D  Person.getName() by FindClass: hacket
 D  Person.getName() by CallObjectMethod(): hacket
 D  Person.getName() by GetObjectClass: hacket
 D  boolean:1
 D  jboolean:1
 D  boolean:0
 D  jboolean:0
 D  boolean:1
 D  jboolean:1
```

**PointF**

```cpp
// Java
public native CommonStatus SetPoint(PointF point);

// C++
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetPoint(JNIEnv *env, jobject, jobject j_pointf) {
     // step2.2: get value
    float x = env->GetFloatField(j_pointf, graphics_pointf.x);
    float y = env->GetFloatField(j_pointf, graphics_pointf.y);
    TEST_LOG_E("x = %f, y = %f", x, y);
    return getStatus(env, SUCCESS);
}
```

**`ArrayList<PointF>`**

```cpp
// Java
public native CommonStatus SetPointArrayList(ArrayList<PointF> array);

// C++
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetPointArrayList(JNIEnv *env, jobject, jobject j_point_array) {
    int point_count = static_cast<int>(env->CallIntMethod(j_point_array, array_list.size));

    if (point_count < 1) {
        TEST_LOG_W("The array size less than 1");
        return getStatus(env, FAILED);
    }

    double x, y;

    for (int i = 0; i < point_count; ++i) {
        jobject point = env->CallObjectMethod(j_point_array, array_list.get, i);
        jfloat x = env->GetFloatField(point, graphics_pointf.x);
        jfloat y = env->GetFloatField(point, graphics_pointf.y);
        env->DeleteLocalRef(point);

        TEST_LOG_D("x: %lf, y: %lf", x, y);
    }

    return getStatus(env, SUCCESS);
}
```

### JNI 操作 Java `int[]` 数组

**示例：** 将一个 Java `int[]` 对象传入 C++ 中，如何操作这个数组呢？

```cpp
JNIEXPORT void JNICALL
Java_me_hacket_jnitutorial_MainActivity_setArray(JNIEnv *env, jobject thiz, jintArray array) {
    // 1.获取数组长度
    jint len = env->GetArrayLength(array);
    LOGE("array.length:%d", len);

    jboolean isCopy;
    // 2.获取数组地址 
    // 第二个参数代表 Java Array -> C/C++ Array 转换的方式：
    // 0: 把指向Java数组的指针直接传回到本地代码中
    // 1: 新申请了内存，拷贝了数组
    // 返回值： 数组的地址（首元素地址）
    jint *firstElement = env->GetIntArrayElements(array, &isCopy);
    LOGE("is copy array:%d", isCopy);
    // 3.遍历数组（移动地址）
    for (int i = 0; i < len; ++i) {
        LOGE("array[%i] = %i", i, *(firstElement + i));
    }
    // 4.使用后释放数组
    // 第一个参数是 jintArray，第二个参数是 GetIntArrayElements 返回值 
    // 第三个参数代表 mode
    env->ReleaseIntArrayElements(array,firstElement, 0);

    // 5. 创建一个 java 数组
    jintArray newArray = env->NewIntArray(3);
}
```

- `mode = 0` 刷新 Java 数组并释放 C/C++数组
- `mode = JNI_COMMIT(1)` 只刷新 Java 数组
- `mode = JNI_ABORT(2)` 只释放 C/C++数组

## JNI 操作 Java 对象

### JNI 操作 Java 对象步骤

C/C++ 操作 Java 中的对象使用的是 Java 中反射，步骤分为：

- 获取 jclass 类
- 根据成员变量名获取 `methodID` / `fieldID`
- 调用 get/set 方法操作 field，或者 `CallObjectMethod` 调用 method

### JNI: 获取 Java 中的类并生成对象

#### 获取 Java 对象的 JNI API

`JNIEnv` 类中有如下几个方法可以获取 Java 中的类：

- FindClass 根据全路径类名来查找一个类

```cpp
jclass FindClass(const char* name) { return functions->FindClass(this, name); }
// - name 是某个类的完整路径，路径要换成/
```

- GetObjectClass 根据一个对象，获取该对象的类

```cpp
jclass GetObjectClass(jobject obj) { return functions->GetObjectClass(this, obj); }
// - obj 写的jni函数，非静态的函数都会有一个jobject类型的参数
```

- GetSuperClass 获取一个传入的对象获取他的父类的 jclass

```cpp
jclass GetSuperclass(jclass clazz) { return functions->GetSuperclass(this, clazz); }
```

#### 示例

- Kotlin 代码

```kotlin
external fun getPerson(): Person?
```

- Cpp 代码

```cpp
extern "C"
JNIEXPORT jobject JNICALL // Windows
Java_me_hacket_jni_MainActivity_getPerson(JNIEnv *env, jobject thiz) {
    // 获取 Person 类的全路径
    const char *person_java_name = "me/hacket/jni/Person";
    // 获取 Person 类
    jclass person_jclass = env->FindClass(person_java_name);
    // 获取 Person 类的构造方法
    jmethodID person_ctor = env->GetMethodID(person_jclass, "<init>", "(Ljava/lang/String;I)V");
    jstring name_jstring = env->NewStringUTF("hacket");
    // 创建 Person 对象
    jobject person_obj = env->NewObject(person_jclass, person_ctor, name_jstring, 18);

    // 查看toString()方法
    jmethodID toStringMethod = env->GetMethodID(person_jclass, "toString", "()Ljava/lang/String;");
    jobject result = env->CallObjectMethod(person_obj, toStringMethod);
    const char *resultStr = env->GetStringUTFChars((jstring) result, 0);
    LOGD("Person.toString(): %s", resultStr);

    // 调用 Person 的方法: setName()
    const char *setNameSig = "(Ljava/lang/String;)V";
    jmethodID set_name_method = env->GetMethodID(person_jclass, "setName", setNameSig);
    jstring name2 = env->NewStringUTF("Hacket2");
    env->CallVoidMethod(person_obj, set_name_method, name2);
    // 调用 Person 的方法：setAge()
    const char *setAgeSig = "(I)V";
    jmethodID set_age_method = env->GetMethodID(person_jclass, "setAge", setAgeSig);
    env->CallVoidMethod(person_obj, set_age_method, 20);

    // 调用 Person 的toString()方法
    jmethodID toStringMethod2 = env->GetMethodID(person_jclass, "toString", "()Ljava/lang/String;");
    jobject result2 = env->CallObjectMethod(person_obj, toStringMethod2);
    const char *resultStr2 = env->GetStringUTFChars((jstring) result2, 0);
    LOGD("Person.toString(): %s", resultStr2);

    // 释放，报错：JNI DETECTED ERROR IN APPLICATION: use of deleted local reference
//    env->DeleteLocalRef(person_obj); // 不能delete，否则会报错，要给Java层回收

    return person_obj;
}
```

### 复杂对象返回(native->java)

#### 返回 `String[]`

- Java

```java
public native String[] GetStringArray(int size);
```

- C++

```cpp
JNIEXPORT jobjectArray JNICALL Java_me_hacket_test_APIs_GetStringArray(JNIEnv *env, jobject, jint j_size) {
    jobjectArray result;

    result = (jobjectArray)env->NewObjectArray(j_size, env->FindClass("java/lang/String"), env->NewStringUTF(""));
    if (!result) {
        TEST_LOG_E("Failed to new object array");
        return NULL;
    }
    for(int i = 0; i < j_size; i++) {
         env->SetObjectArrayElement(result, i,
            env->NewStringUTF((std::string("item ") + std::to_string(i)).c_str()));
    }
    return result;
}
```

#### 返回PointF

- Java

```java
public native PointF GetPointf();
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_net_me_hacket_APIs_GetPointf
  (JNIEnv *env, jobject j_obj) {
    // The generated values are for testing only
    jobject pt_object = env->NewObject(graphics_pointf.clz,
        graphics_pointf.constructor, j_obj, 1.22f, 3.14f);
    return pt_object;
}
```

### 复杂数组对象返回(native->java)

#### 基本类型二维数组

- Java

```java
public native int[][] GetInt2DArray(int row, int col);
```

- C++

```cpp
JNIEXPORT jobjectArray JNICALL Java_me_hacket_test_APIs_GetInt2DArray(JNIEnv *env, jobject, jint row, jint col) {
    jobjectArray result;
    jclass cls_int_array;
    jint i,j;
    // step1: find class
    cls_int_array = env->FindClass("[I");
    if (cls_int_array == NULL) {
        return NULL;
    }
    // step2: create int array object
    result = env->NewObjectArray(row, cls_int_array, NULL);
    if (result == NULL) {
        return NULL;
    }

    // step3: set value
    for (i = 0; i < row; ++i) {
        jint buff[256];
        jintArray int_array = env->NewIntArray(col);
        if (int_array == NULL) {
            return NULL;
        }
        for (j = 0; j < col; j++) {
            buff[j] = i + j;
        }
        env->SetIntArrayRegion(int_array, 0, col, buff);
        env->SetObjectArrayElement(result, i, int_array);
        env->DeleteLocalRef(int_array);
    }

    return result;
}
```

#### 复杂对象数组

- Java

```java
public native ArrayList<PointF> GetPointArrayList();
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_GetPointArrayList(JNIEnv *env, jobject j_obj) {
    const int array_size = 5;
    jobject result = env->NewObject(array_list.clz, array_list.constructor, array_size);

    for (int i = 0; i < array_size; i++) {
        // step 1/2: new point
        // The generated values are for testing only
        jobject pt_object = env->NewObject(graphics_pointf.clz, graphics_pointf.constructor, j_obj, 0 + i, 1 + i);
        // step 2/2: add point to array list
        env->CallBooleanMethod(result, array_list.add, pt_object);
        env->DeleteLocalRef(pt_object);
    }

    return result;
}
```

### Context 访问

- Java

```java
public native CommonStatus SetContext(Context context);
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetContext(JNIEnv *env, jobject, jobject context) {
    jclass context_clz = env->GetObjectClass(context);

    // get android application package name
    jmethodID m_getpackagename_id = env->GetMethodID(context_clz, "getPackageName", "()Ljava/lang/String;");
    if (!context_clz || !m_getpackagename_id) {
        TEST_LOG_E("Failed to get class or method id");
        return getStatus(env, FAILED);
    }

    jstring j_pkg_name = static_cast<jstring>(env->CallObjectMethod(context, m_getpackagename_id));
    if (!j_pkg_name) {
        TEST_LOG_E("Failed to call object method.");
        return getStatus(env, FAILED);
    }

    const char* pkg_name = env->GetStringUTFChars(j_pkg_name, 0);
     if (NULL == pkg_name) {
        TEST_LOG_E("Failed to get string UTF chars.");
        return getStatus(env, FAILED);
    }
    TEST_LOG_D("package name = %s", pkg_name);
    env->ReleaseStringUTFChars(j_pkg_name, pkg_name);

    return getStatus(env, SUCCESS);
}
```

## JNI 操作Java 方法？

### 获取 Java 中方法的 JNI API

操作 `method` 和 `filed` 非常相似，先获取 `MethodID`，然后对应的 `CallXXXMethod` 方法

在`JNIEnv`环境下，我们有如下两种方法可以获取方法和属性：

- `GetMethodID`: 获取非静态方法的 ID; jmethodID
- `GetStaticMethodID`: 获取静态方法的ID; 来取得相应的jmethodID。

**GetMethodID：**

```cpp
jmethodID GetMethodID(jclass clazz, const char* name, const char* sig)
    { return functions->GetMethodID(this, clazz, name, sig); }
```

方法的参数说明:

- `clazz`: 这个方法依赖的类对象的 class 对象。`jclass`
- `name`: 这个字段的名称。
- sig: 这个字段的签名(每个变量，每个方法都有对应的签名)。

**GetStaticMethodID：**

```cpp
jmethodID GetStaticMethodID(jclass clazz, const char* name, const char* sig)
    { return functions->GetStaticMethodID(this, clazz, name, sig); }
```

`GetStaticMethodID` 的方法和 `GetMoehodID` 相同，只是用来获取静态方法的 ID 而已。

**`CallXXXMethod` 方法：**

| Java层返回值 | 方法族                 | 本地返回类型NativeType |
| -------- | ------------------- | ---------------- |
| void     | CallVoidMethod()    | 无                |
| Object   | CallObjectMethod()  | jobject          |
| boolean  | CallBooleanMethod() | jboolean         |
| byte     | CallByteMethod()    | jbyte            |
| char     | CallCharMethod()    | jchar            |
| short    | CallShortMethod()   | jshort           |
| int      | CallIntMethod()     | jint             |
| long     | CallLongMethod()    | jlong            |
| float    | CallFloatMethod()   | jfloat           |
| double   | CallDoubleMethod()  | jdouble          |

### 获取方法

#### 示例：非静态方法

- kotlin 代码

```kotlin
// 给C++调用的方法
fun describe(): String {
	return "I am a non-static method"
}
```

- cpp 代码

```cpp
extern "C"
JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_testCallMethod(JNIEnv *env, jobject thiz) {
    // 获取对象的类
    jclass a_class = env->GetObjectClass(thiz);
    // 获取方法的ID
    jmethodID a_method = env->GetMethodID(a_class, "describe", "()Ljava/lang/String;");
    //  对jclass进行实例，相当于Java中的new
    jobject jobj = env->AllocObject(a_class);
    // 调用方法，获取返回值
    jstring result = (jstring) env->CallObjectMethod(jobj, a_method);
    const char *str = env->GetStringUTFChars(result, 0); // 转换格式输出。 0 代表不复制
    // 返回结果
    return env->NewStringUTF(str);
}
```

> 非静态方法，参数是 jobject

#### 示例 ：静态方法

```kotlin
companion object {
// 给C++调用的方法
	@JvmStatic
	fun describeStatic(): String {
		return "I am a static method"
	}
}
```

cpp：

```cpp
extern "C"
JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_testStaticCallMethod(JNIEnv *env, jclass clazz) {
    jmethodID a_method = env->GetStaticMethodID(clazz, "describeStatic", "()Ljava/lang/String;");
//    jobject  jobj = env->AllocObject(clazz);
    jstring result = (jstring) env->CallStaticObjectMethod(clazz, a_method);
    const char *str = env->GetStringUTFChars(result, 0);
    return env->NewStringUTF(str);
}
```

> 静态方法参数是 jclass

### 如何在C/C++中调用父类的方法？

JNIEnv 中调用父类和子类方法的唯一区别在于调用方法时，当调用父类的方法时使用 ` CallNonvirtualObjectMethod()  `，而调用子类方法时则是直接使用 `CallObjectMethod()`。

**示例：**

- Kotlin

```kotlin
open class Father {
    override fun toString(): String {
        return "调用的父类中的方法";
    }
}
class Child : Father() {
    override fun toString(): String {
        return "调用的子类中的方法";
    }
}
class MainActivity {
	private val father: Father = Child()
	external fun testCallFatherMethod(): String; //调用父类toString方法
    external fun testCallChildMethod(): String; // 调用子类toString方法
}
```

- cpp

```cpp
extern "C"
JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_testCallFatherMethod(JNIEnv *env, jobject thiz) {
    // 获取对象的类: MainActivity
    jclass a_class = env->GetObjectClass(thiz);

    // 获取field
    jfieldID father_field = env->GetFieldID(a_class, "father", "Lme/hacket/jni/Father;");
    // 获取field的值
    jobject father_obj = env->GetObjectField(thiz, father_field);

    // 获取Father类
    jclass father_class = env->FindClass("me/hacket/jni/Father");

    // 获取Father类的方法：toString()
    jmethodID use_call_non_virtual = env->GetMethodID(father_class, "toString",
                                                      "()Ljava/lang/String;");

    // 如果调用的是非虚方法，需要使用CallNonvirtualObjectMethod
    jobject result = env->CallNonvirtualObjectMethod(father_obj, father_class,
                                                     use_call_non_virtual);
    const char *resultStr = env->GetStringUTFChars((jstring) result, 0);
    LOGD("Father.toString(): %s", resultStr);

    jstring result2 = env->NewStringUTF(resultStr);
    return result2;
}
extern "C"
JNIEXPORT jstring JNICALL
Java_me_hacket_jni_MainActivity_testCallChildMethod(JNIEnv *env, jobject thiz) {
    // 获取对象的类: MainActivity
    jclass a_class = env->GetObjectClass(thiz);
    // 获取field: father
    jfieldID father_field = env->GetFieldID(a_class, "father", "Lme/hacket/jni/Father;");
    // 获取field的值
    jobject father_obj = env->GetObjectField(thiz, father_field);

    // 获取Father类
    jclass father_class = env->FindClass("me/hacket/jni/Father");
    // 获取Father类的方法：toString()
    jmethodID use_call_non_virtual = env->GetMethodID(father_class, "toString",
                                                      "()Ljava/lang/String;");

    // 调用callObjectMethod，调用Child的toString()方法
    jstring result = static_cast<jstring>(env->CallObjectMethod(father_obj, use_call_non_virtual));
    const char *resultStr = env->GetStringUTFChars(result, 0);
    LOGD("Child.toString(): %s", resultStr);

    env->ReleaseStringUTFChars(result, resultStr);
    return result;
}
```

## JNI 中操作 Java 变量

### JNI 操作 Java 变量步骤

修改Java中对应的变量思路其实也很简单

- 找到对应的类对象
- 找到类中的需要修改的属性
  - 非静态成员变量使用: `GetXXXField`，比如 `GetIntField`，对于引用类型，比如 String，使用 `GetObjectField`
  - 对于静态成员变量使用: `GetStaticXXXField`，比如 `GetStaticIntField`
- 重新给类中属性赋值

### C/C++操作 Kotlin 中非静态变量

**示例：**

- Kotlin 代码

```kotlin
class MainActivity {
    var modelNumber = 1;  
    /**  
     * 修改modelNumber属性  
     */  
	external fun testChangeField()
}
```

- C++代码

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jni_MainActivity_testChangeField(JNIEnv *env, jobject thiz) {
    // 获取对象的类: MainActivity
    jclass jclass1 = env->GetObjectClass(thiz);
    // 获取field: modelNumber
    jfieldID a_field = env->GetFieldID(jclass1,"modelNumber", "I");
    // 设置field的值
    env->SetIntField(thiz, a_field, 100);
}
```

### C++中操作 Java 静态和非静态变量

在 Java 代码中，MainActivity 有两个成员变量：

```java
public class MainActivity extends AppCompatActivity {
    String testField = "test1";
    static int staticField = 1;
}
```

C++代码：

```cpp
// 1. 获取类 class
jclass clazz = env->GetObjectClass(thiz);

// 2. 获取成员变量 id
jfieldID strFieldId = env->GetFieldID(clazz,"testField","Ljava/lang/String;");
// 3. 根据 id 获取值
jstring jstr = static_cast<jstring>(env->GetObjectField(thiz, strFieldId));
const char* cStr = env->GetStringUTFChars(jstr,NULL);
LOGE("获取 MainActivity 的 String field ：%s",cStr);

// 4. 修改 String
jstring newValue = env->NewStringUTF("新的字符创");
env-> SetObjectField(thiz,strFieldId,newValue);

// 5. 释放资源
env->ReleaseStringUTFChars(jstr,cStr);
env->DeleteLocalRef(newValue);
env->DeleteLocalRef(clazz);

// 获取静态变量
jfieldID staticIntFieldId = env->GetStaticFieldID(clazz,"staticField","I");
jint staticJavaInt = env->GetStaticIntField(clazz,staticIntFieldId);
```

`GetFieldID` 和 `GetStaticFieldID` 需要三个参数：

- `jclass` ：jclass 类型
- `filed name`：字段名
- sig：类型签名，JNI 使用 JVM 的类型签名

类型签名一览表：

见 [[JNI基础#数据类型描述符]]

## 如何在C/C++中操作Java字符串？

Java 中字符串和C/C++中字符创的区别在于：Java中String对象是Unicode的时候，无论是中文，字母，还是标点符号，都是一个字符占两个字节的。

### JNIEnv中获取字符串的一些方法

#### NewString

函数原型：

```cpp
// 生成jstring对象，将(Unicode)char数组换成jstring对象
jstring NewString(const jchar* unicodeChars, jsize len)
    { return functions->NewString(this, unicodeChars, len); }
```

示例：

```cpp
jchar *data = new jchar[9];
data[0] = 'H';
data[1] = 'e';
data[2] = 'l';
data[3] = 'l';
data[4] = 'o';
data[5] = '-';
data[6] = 'C';
data[7] = '+';
data[8] = '+';
jstring str = env->NewString(data, 5);
return str; // Hello
```

#### NewStringUTF

函数原型：

```cpp
// 利用(UTF-8)char数组生成并返回 java String对象
jstring NewStringUTF(const char* bytes)
    { return functions->NewStringUTF(this, bytes); }
```

示例：

```cpp
std::string learn = "hacket learn android";
return env->NewStringUTF(learn.c_str()); // c_str()函数返回一个指向正规C字符串的指针, 内容与本string串相同.
```

#### 获取字符串长度

- `jsize GetStringLength(jstring jmsg)`：获取字符串(Unicode)的长度。
- `jsize GetStringUTFLength(jstring string)`：获取字符串((UTF-8))的长度。

```cpp
jstring inputString_;
jint result = env -> GetStringLength(inputString_);
jint resultUTF = env -> GetStringUTFLength(inputString_);
```

#### GetStringRegion

- `void GetStringRegion(jstring str, jsize start, jsize len, jchar* buf)`：拷贝 Java 字符串并以 UTF-8编码传入 jstring

```cpp
jstring inputString_;
jint length = env -> GetStringUTFLength(inputString_);
jint half = length /2;
jchar* chars = new jchar[half];
env -> GetStringRegion(inputString_, 0, length/2, chars);
return env->NewString(chars, half);
```

- `void GetStringUTFRegion(jstring str, jsize start, jsize len, char* buf)`：拷贝 Java 字符串并以 UTF-16编码传入 jstring

```cpp
jstring inputString_;
jint length = env -> GetStringUTFLength(inputString_);
jint half = length /2;
char* chars = new char[half];
env -> GetStringUTFRegion(inputString_,0,length/2,chars);
return env->NewStringUTF(chars);
```

#### jstring 转换成 char 指针

##### GetStringChars

- `jchar* GetStringChars(jstring string, jboolean* isCopy)` 将jstring对象转成jchar字符串指针。此方法返回的jchar是一个UTF-16编码的宽字符串。

注意：返回的指针可能指向 Java String 对象，也可能是指向 jni 中的拷贝。

- 参数 `isCopy` 用于返回是否是拷贝,如果 isCopy 参数设置的是 NUll,则不会关心是否对 Java 的 String 对象进行拷贝。

- 返回值是用 const 修饰的，所以获取的(Unicode)char 数组是不能被更改的；还有注意在使用完了之后要对内存进行释放，释放方法是：`ReleaseStringChars(jstring string, const jchar* chars)`。

##### GetStringUTFChars

- `char* GetStringUTFChars(jstring string, jboolean* isCopy)`:将 jstring 对象转成 jchar 字符串指针。方法返回的 jchar 是一个 UTF-8编码的字符串。

返回指针同样可能指向 java String对象。取决与isCopy的值。返回值是const修饰，不支持修改。使用完了也需释放，释放的方法为：`ReleaseStringUTFChars(jstring string, const char* utf)`。

**示例：**

```cpp
extern "C"
JNIEXPORT void JNICALL
Java_me_hacket_jnitutorial_MainActivity_setString(JNIEnv *env, jobject thiz, jstring str) {
    // 1.jstring -> char*
    // java  中的字符创是 unicode 编码， c/C++ 是UTF编码，所以需要转换一下。第二个参数作用同上面
    const char *c_str = env -> GetStringUTFChars(str,NULL);

    // 2.异常处理
    if(c_str == NULL){
        return;
    }

    // 3.当做一个 char 数组打印
    jint len = env->GetStringLength(str);
    for (int i = 0; i < len; ++i) {
        LOGE("c_str: %c",*(c_str+i));
    }

    // 4.释放
    env->ReleaseStringUTFChars(str,c_str);
}

```

调用完 `GetStringUTFChars` 之后**不要忘记安全检查**，因为 `JVM` 需要为新诞生的字符串分配内存空间，当内存空间不够分配的时候，会导致调用失败，失败后 `GetStringUTFChars` 会返回 `NULL`，并抛出一个`OutOfMemoryError` 异常。JNI 的异常和 Java 中的异常处理流程是不一样的，Java 遇到异常如果没有捕获，程序会立即停止运行。
而 JNI 遇到未决的异常不会改变程序的运行流程，也就是程序会继续往下走，这样后面针对这个字符串的所有操作都是非常危险的，因此，我们需要用 return 语句跳过后面的代码，并立即结束当前方法。

##### GetStringCritical

- `const jchar* GetStringCritical(jstring string, jboolean* isCopy)`:将 `jstring` 转换成 `const jchar*`。他和 GetStringChars/GetStringUTF 的区别在于 GetStringCritical 更倾向于获取 Java String 的指针，而不是进行拷贝；对应的释放方法：`ReleaseStringCritical(jstring string, const jchar* carray)`。

特别注意的是，在`GetStringCritical`调用和`ReleaseStringCritical`释放这两个方法调用的之间是一个关键区，不能调用其他JNI函数。否则将造成关键区代码执行期间垃圾回收器停止运作，任何触发垃圾回收器的线程也会暂停，其他的触发垃圾回收器的线程不能前进直到当前线程结束而激活垃圾回收器。就是说在关键区域中千万不要出现中断操作，或在JVM中分配任何新对象;否则会\
造成JVM死锁。

### **字符串传递(java->native)**

- Java:

```java
public native CommonStatus SetString(String str);
```

- C++：

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetString(JNIEnv *env, jobject, jstring j_str) 
{
    const char *c_str = NULL;

    c_str = env->GetStringUTFChars(j_str, NULL);
    if (NULL == c_str) {
        TEST_LOG_E("Failed to get string UTF chars.");
        return getStatus(env, FAILED);
    }
    TEST_LOG_D("c str: %s", c_str);
    // 如使用 GetStringUTFRegion 与 GetStringRegion，则内部未分配内存，无需释放
    env->ReleaseStringUTFChars(j_str, c_str);
    return getStatus(env, SUCCESS);
}
```

### 字符串返回(native->java)

- Java

```java
public native String GetString();
```

- C++

```cpp
JNIEXPORT jstring JNICALL Java_me_hacket_test_APIs_GetString
  (JNIEnv *env, jobject) {
    char str[60] = "Hello";
    // 1. 可以用 const char *
    //const char *str = "Hello";
    // 2. 可以用 std::string str = std::string("Hello"); str.c_str()

    jstring result;
    result = env->NewStringUTF(str);
    return result;
}
```

## 如何在C/C++中操作Java数组？

### 数组相关API

- `jType* GetArrayElements((Array array, jboolean* isCopy))`：这类方法可以把Java的基本类型数组转换成C/C++中的数组。isCopy为true的时候表示数据会拷贝一份，返回的数据的指针是副本的指针。如果false则不会拷贝，直接使用Java数据的指针。不适用isCopy可以传NULL或者0。
- `void ReleaseArrayElements(jTypeArray array, j* elems,jint mode)`：释放操作，只要有调用 `GetArrayElements` 方法，就必须要调用一次对应的 `ReleaseArrayElements` 方法，因为这样会删除掉可能会阻止垃圾回收的 JNI 本地引用。这里我们注意以下这个方法的最后一个参数 mode,他的作用主要用于避免在处理副本数据的时产生对 Java 堆不必要的影响。
  - - `GetArrayElements` 中的 `isCopy` 为 true，我们才需要设置 mode；为 false 我们 mode 可以不用处理,赋值0。mode 有三个值：
      - `0`：更新Java堆上的数据并释放副本使用所占有的空间。
      - `JNI_COMMIT`：提交，更新Java堆上的数据，不释放副本使用的空间。
      - `JNI_ABORT`：撤销，不更新Java堆上的数据，释放副本使用所占有的空间。
- `void* GetPrimitiveArrayCritical(jarray array, jboolean* isCopy)`:作用类似与GetArrayElements。这个方法可能会通过VM返回指向原始数组的指针。注意在使用此方法的时候避免死锁问题。
- `void ReleasePrimitiveArrayCritical(jarray array, void* carray, jint mode)`:上面方法对应的释放方法。注意这两个方法之间不要调用任何JNI的函数方法。因为可能会导致当前线程阻塞。
- `void GetArrayRegion(JNIEnv *env, ArrayType array,jsize start, jsize len, Type *buf)`和 `GetStringRegion` 的作用是相似的，事先在 C/C++中创建一个缓存区，然后将 Java 中的原始数组拷贝到缓冲区中去。
- `void SetArrayRegion(JNIEnv *env, ArrayType array,jsize start, jsize len, const Type *buf)`:上面方法的对应方法，将缓冲区的部分数据设置回Java原始数组中。
- `jsize GetArrayLength(JNIEnv *env, jarray array)`:获取数组长度。
- `jobjectArray NewObjectArray(JNIEnv *env, jsize length,jclass elementClass, jobject initialElement)`:创建指定长度的数组。

**示例：**

- Kotlin代码

```kotlin
private var testArrays = intArrayOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
/**
 * 测试获取数组元素
 */
external fun testGetTArrayElement()
```

- C++代码

```cpp
extern "C"  
JNIEXPORT void JNICALL  
Java_me_hacket_jni_MainActivity_testGetTArrayElement(JNIEnv *env, jobject thiz) {  
    // 获取对象的类: MainActivity  
    jclass jclass1 = env->GetObjectClass(thiz);  
    // 获取Java field: testArrays  
    jfieldID fid_arrays = env->GetFieldID(jclass1, "testArrays", "[I");  
    // 获取Java中数组属性对象  
    jintArray jint_arr = static_cast<jintArray>(env->GetObjectField(thiz, fid_arrays));  
  
    LOGD("---------------获取到的原始数据为---------------");  
    // 获取数组对象的指针  
    jint *arr = env->GetIntArrayElements(jint_arr, 0);  
    // 获取数组长度  
    int length = env->GetArrayLength(jint_arr);  
    LOGD("数组长度：%d", length);  
    // 遍历数组  
    for (int i = 0; i < length; i++) {  
        LOGD("数组元素：%d", arr[i]);  
    }  
  
    // 新建一个jintArray对象  
    jintArray jint_arr_temp = env->NewIntArray(length);  
    // 获取jint_arr_temp对象的指针  
    jint *arr_temp = env->GetIntArrayElements(jint_arr_temp, 0);  
    // 计数  
    jint count = 0;  
    LOGD("-----------打印其中的奇数------------");  
    // 奇数位存入到arr_temp中  
    for (int i = 0; i < length; i++) {  
        if (arr[i] % 2 != 0) {  
            arr_temp[count] = arr[i];  
            LOGD("奇数：%d", arr_temp[count]);  
            count++;  
        }  
    }  
    // 打印arr_temp数组  
    LOGD("-----------打印arr_temp数组------------");  
    for (int i = 0; i < count; i++) {  
        LOGD("arr_temp[%d]: %d", i, arr_temp[i]);  
    }  
  
    LOGD("---------------重新赋值打印---------------");  
    // 创建一个新的数组  
    jint *buffers = new jint[3];  
    jint start = 100;  
    for (int i = start; i < 3 + start; i++) {  
        buffers[i - start] = i + 1;  
    }  
    //重新给jint_arr数组中的从第1位开始往后3个数赋值  
    env->SetIntArrayRegion(jint_arr, 1, 3, buffers);  
    // 重新获取数据指针  
    jint *int_arr2 = env->GetIntArrayElements(jint_arr, 0);  
    // 打印  
    for (int i = 0; i < length; i++) {  
        LOGD("重新赋值之后的结果为 arr2[%d]: %d", i, int_arr2[i]);  
    }  
  
    LOGD("---------------排序---------------");  
    // 排序  
    std::sort(int_arr2, int_arr2 + length);  
    // 打印  
    for (int i = 0; i < length; i++) {  
        LOGD("排序之后的结果为 arr2[%d]: %d", i, int_arr2[i]);  
    }  
  
    LOGD("---------------数据处理完成---------------");  
    // 释放  
    env->ReleaseIntArrayElements(jint_arr, arr, 0);  
    env->ReleaseIntArrayElements(jint_arr_temp, arr_temp, 0);  
    delete[] buffers;  
  
}
```

輸出：

```cpp
 D  ---------------获取到的原始数据为---------------
 D  数组长度：10
 D  数组元素：1
 D  数组元素：2
 D  数组元素：3
 D  数组元素：4
 D  数组元素：5
 D  数组元素：6
 D  数组元素：7
 D  数组元素：8
 D  数组元素：9
 D  数组元素：10
 D  -----------打印其中的奇数------------
 D  奇数：1
 D  奇数：3
 D  奇数：5
 D  奇数：7
 D  奇数：9
 D  -----------打印arr_temp数组------------
 D  arr_temp[0]: 1
 D  arr_temp[1]: 3
 D  arr_temp[2]: 5
 D  arr_temp[3]: 7
 D  arr_temp[4]: 9
 D  ---------------重新赋值打印---------------
 D  重新赋值之后的结果为 arr2[0]: 1
 D  重新赋值之后的结果为 arr2[1]: 101
 D  重新赋值之后的结果为 arr2[2]: 102
 D  重新赋值之后的结果为 arr2[3]: 103
 D  重新赋值之后的结果为 arr2[4]: 5
 D  重新赋值之后的结果为 arr2[5]: 6
 D  重新赋值之后的结果为 arr2[6]: 7
 D  重新赋值之后的结果为 arr2[7]: 8
 D  重新赋值之后的结果为 arr2[8]: 9
 D  重新赋值之后的结果为 arr2[9]: 10
 D  ---------------排序---------------
 D  排序之后的结果为 arr2[0]: 1
 D  排序之后的结果为 arr2[1]: 5
 D  排序之后的结果为 arr2[2]: 6
 D  排序之后的结果为 arr2[3]: 7
 D  排序之后的结果为 arr2[4]: 8
 D  排序之后的结果为 arr2[5]: 9
 D  排序之后的结果为 arr2[6]: 10
 D  排序之后的结果为 arr2[7]: 101
 D  排序之后的结果为 arr2[8]: 102
 D  排序之后的结果为 arr2[9]: 103
 D  ---------------数据处理完成---------------

```

### 数组传递(java->native)

#### 基本类型数组

- Java

```java
public native CommonStatus SetBaseTypeArray(int[] intArray);
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetBaseTypeArray(JNIEnv *env, jobject, jintArray j_array) {
    // step: get length
    int arr_len = env->GetArrayLength(j_array);
    // step: get array
    int * array = env->GetIntArrayElements(j_array, NULL);
    if (!array) {
        TEST_LOG_E("Failed to get int array elements");
        return getStatus(env, FAILED);
    }

    for (int i = 0; i < arr_len; i++) {
        TEST_LOG_D("int array[%d] = %d", i, array[i]);
    }
    // 也可以使用 GetIntArrayRegion/GetPrimitiveArrayCritical 区别不在展开
    env->ReleaseIntArrayElements(j_array, array, 0);

    return getStatus(env, SUCCESS);
}
```

#### 对象类型数组

- Java

```java
public native CommonStatus SetStringArray(String[] strArray);
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetStringArray(JNIEnv *env, jobject, jobjectArray j_str_array) {
    // step1: get array length
    int array_size = env->GetArrayLength(j_str_array);

    // step2: get object array item with a loop
    for (int i = 0; i < array_size; i++) {
        jstring j_str = (jstring)(env->GetObjectArrayElement(j_str_array, i));
        const char *c_str = env->GetStringUTFChars(j_str, NULL);
        TEST_LOG_D("str array[%d] = %s", i, c_str);

        env->ReleaseStringUTFChars(j_str, c_str);
    }

    return getStatus(env, SUCCESS);
}
```

#### 复杂数组对象传递(java->native)

- Java

```java
public native CommonStatus SetPoint2DArray(Point2D[] pointArray);
```

- C++

```cpp
JNIEXPORT jobject JNICALL Java_me_hacket_test_APIs_SetPoint2DArray(JNIEnv *env, jobject, jobjectArray j_array) {
    // step1: get array length
    int array_len = env->GetArrayLength(j_array);
    // step2: get object array item with a loop
    for (int i = 0; i < array_len; i++) {
        // step2.1: get array element
        jobject j_object = env->GetObjectArrayElement(j_array, i);
        if (!j_object) {
            TEST_LOG_E("Failed to get object array element");
            return getStatus(env, FAILED);
        }
        // step2.2: get value
        float x = env->GetFloatField(j_object, point2d.x);
        float y = env->GetFloatField(j_object, point2d.y);
        TEST_LOG_D("array[%d], x = %f, y = %f", i, x, y);
    }
    return getStatus(env, SUCCESS);
}
```

# 官方示例

## `hello-jni`

Hello JNI is an Android sample that uses JNI to call C code from a Android Java Activity.

- [ndk-samples/hello-jni at main · android/ndk-samples · GitHub](https://github.com/android/ndk-samples/tree/main/hello-jni)

## `ndk-app-template`

Android Studio 编写 NDK 示例

- [GitHub - DanAlbert/ndk-app-template: A revised template for NDK apps.](https://github.com/DanAlbert/ndk-app-template)

## `hello-jniCallback`

演示：从 C/C++代码回调 Java

- 从 C 代码创建 java 类实例
- 调用java类的静态和非静态成员函数

[ndk-samples/hello-jniCallback at main · android/ndk-samples · GitHub](https://github.com/android/ndk-samples/tree/main/hello-jniCallback)

## `hello-libs`

演示：引入 pre-compiled 的 C/C++库到项目中

- [ndk-samples/hello-libs at main · android/ndk-samples · GitHub](https://github.com/android/ndk-samples/tree/main/hello-libs)

# Ref

- 官方示例：[android/ndk-samples](https://github.com/android/ndk-samples)
