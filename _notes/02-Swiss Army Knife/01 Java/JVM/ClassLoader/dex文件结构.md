---
date created: 2024-12-27 23:42
date updated: 2024-12-27 23:42
dg-publish: true
---

# dex文件结构

## 什么是dex文件?

能够被dvm识别，加载并执行的文件格式

## 如何生成一个dex文件

- ide自动生成
- 手动通过dx命令生成

1. 手写调用javac生成class文件

```
javac -target 1.8 -source 1.8 Temp.java
```

2. 调用dx.bat生成dex文件

```
dx --dex --output Temp.dex Temp.class
```

- 手动运行dex文件到手机

3. 首先push要执行的dex文件到手机sdcard

```
adb push Temp.dex /sdcard
```

4. 调用dalvikvm命令执行

```
adb shell
dalvikvm -cp /sdcard/Temp.dex Temp
```

dalvikvm命令：<br>`dalvikvm -cp <dex文件路径> <执行的类>`

## dex文件的作用

记录整个工程中所有类文件的信息

## dex文件格式详解

1. 一种8位字节的二进制流文件
2. 各个数据按顺序紧密的排列，无间隙
3. 整个应用中所有Java源文件都放在一个dex文件中，注意multidex

dex 文件可以分为3个模块，头文件(header)、索引区(xxxx_ids)、数据区(data)。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560468972-e2beb1ac-7bd2-4e7a-a0e0-a7c44db1f4f7.png#averageHue=%23c5c3b9&clientId=u1ef545c5-3a11-4&from=paste&id=udcb8ed82&originHeight=818&originWidth=800&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u2f3ca307-b167-4525-9879-bb7bafb32a8&title=)<br>![](https://note.youdao.com/yws/res/71477/EE61ADBE422747989A7F310A4E0D4623#id=Pzpqd&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 一、文件头

dex文件里的header。除了描述整个.dex文件的文件分布信息外，包括每一个索引区的大小跟偏移。

![](https://note.youdao.com/yws/res/71481/97338261256E4295A183EFA334055BD8#id=m7Qw9&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560475632-363c4791-c876-48e7-8319-3cd3fcead3af.png#averageHue=%23f1f0ee&clientId=u1ef545c5-3a11-4&from=paste&id=u3b097957&originHeight=778&originWidth=864&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ufcfab9a8-40ef-4085-866b-9c73cca9da6&title=)<br>除了 magic、checksum、signature、file_size、endian_tag、map_off 其他元素都是成对出现的。以`_size`和`_off`为后缀的描述：_size都是描述该区里元素的个数；_off描述相对与文件起始位置的偏移量。(data_size是以Byte为单位描述data区的大小)。各项说明如下：

- 1、magic<br>这8个字节一般是常量，为了使.dex文件能够被识别出来，它必须出现在.dex文件的最开头的位置。转化为字符串为：

```
{ 0x64 0x65 0x78 0x0a 0x30 0x33 0x35 0x00 } = "dex\n035\0"
```

中间是一个换行，后面035是版本号。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560486057-47d5a574-1419-4bbf-99df-f18573646bbf.png#averageHue=%233e3c39&clientId=u1ef545c5-3a11-4&from=paste&id=ua192d983&originHeight=88&originWidth=933&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uecad8aa7-295b-4291-8c81-c91f119a019&title=)

- 2、checksum 和 signature<br>checksum: 文件校验码，使用 alder32 算法校验文件除去 maigc、checksum 外余下的所有文件区域，用于检查文件错误。。<br>signature: 使用 SHA-1 算法 hash 除去 magic、checksum 和 signature 外余下的所有文件区域， 用于唯一识别本文件 。
- 3、file_size<br>dex文件的大小
- 4、header_size<br>header 区域的大小 ，单位 Byte ，一般固定为 0x70 常量。
- 5、endian_tag<br>大小端标签，标准.dex文件格式为小端 ，此项一般固定为 0x12345678 常量 。
- 6、link_size和link_off<br>这个两个字段是表示链接数据的大小和偏移值。
- 7、map_off<br>map item的偏移地址，该item属于data区里的内容，值要大于等于data_off的大小。
- 8、string_ids_size和string_ids_off<br>这两个字段表示dex中用到的所有的**字符串内容**的大小和偏移值，我们需要解析完这部分，然后用一个字符串池存起来，后面有其他的数据结构会用索引值来访问字符串，这个池子也是非常重要的。
- 9、type_ids_size和type_ids_off<br>这两个字段表示dex中的**类型**数据结构的大小和偏移值，比如类类型，基本类型等信息。
- 10、proto_ids_size和type_ids_off<br>这两个字段表示dex中的**元数据**信息数据结构的大小和偏移值，描述方法的元数据信息，比如方法的返回类型，参数类型等信息。
- 11、 field_ids_size和field_ids_off<br>这两个字段表示dex中的**字段**信息数据结构的大小和偏移值。
- 12、method_ids_size和method_ids_off<br>这两个字段表示dex中的**方法**信息数据结构的大小和偏移值
- 13、class_defs_size和class_defs_off<br>这两个字段表示dex中的**类信息**数据结构的大小和偏移值，这个数据结构是整个dex中最复杂的数据结构，他内部层次很深，包含了很多其他的数据结构，所以解析起来也很麻烦。
- 14、data_size和data_off<br>这两个字段表示dex中数据区域的结构信息的大小和偏移值，这个结构中存放的是数据区域，比如我们定义的常量值等信息。

完整的header：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560497899-35828c20-2cbe-4391-b674-103976a79de8.png#averageHue=%23484643&clientId=u1ef545c5-3a11-4&from=paste&id=ua9380aed&originHeight=339&originWidth=1019&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uae451d41-ce6b-46a9-b146-0a653efbcaa&title=)

### 二、索引区

- 1、string_ids<br>string_ids区段描述了dex文件中所有的字符串。

LEB128 ( little endian base 128 )<br>基于1个Byte的一种不定长度的编码方式；若第一个Byte的最高位为1，则表示还需要下一个Byte来描述，直至最后一个Byte的最高位为0；每个Byte的其余bit用来表示数据，如下表所示。实际中LEB128最大只能达到32-bit，可以阅读dalvik中的Leb128.h源码看出来。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560508196-67992012-8469-4f45-8eaa-7dc016214810.png#averageHue=%23484643&clientId=u1ef545c5-3a11-4&from=paste&id=u925018f0&originHeight=339&originWidth=1019&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ua81af560-b54b-44e2-9fb6-78b089c9447&title=)<br>![](https://note.youdao.com/yws/res/71490/B6EEE360BF2640D5A59D27BA48F23B17#id=cCvPa&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

数据结构为：

```c
ubyte    8-bit unsinged int
uint     32-bit unsigned int, little-endian
uleb128  unsigned LEB128, valriable length
struct string_ids_item
{
    uint string_data_off;
}
struct string_data_item
{
    uleb128 utf16_size;
    ubyte   data;
}
```

其中 data 保存的就是字符串的值。string_ids 是比较关键的，后续的区段很多都是直接指向 string_ids 的 index。

- 2、type_ids<br>type_ids 区索引了 dex 文件里的所有数据类型，包括 class 类型，数组类型(array types)和基本类型<br>(primitive types)。区段里的元素格式为 type_ids_item，结构描述如下 :

```c
uint 32-bit unsigned int, little-endian

struct type_ids_item
{
    uint descriptor_idx;  //-->string_ids
}
```

type_ids_item 里面 descriptor_idx 的值的意思，是 string_ids 里的 index 序号，是用来描述此 type 的字符串。

- 3、proto_ids<br>proto 的意思是 method prototype 代表 java 语言里的一个 method 的原型 。proto_ids 里的元素为 proto_id_item，结构如下:

```c
uint 32-bit unsigned int, little-endian

struct proto_id_item
{
    uint shorty_idx;        //-->string_ids
    uint return_type_idx;    //-->type_ids
    uint parameters_off;
}
```

1. shorty_idx: 跟 type_ids 一样，它的值是一个 string_ids 的 index 号 ，最终是一个简短的字符串描述，用来说明该 method 原型。
2. return_type_idx: 它的值是一个 type_ids 的 index 号 ，表示该 method 原型的返回值类型。
3. parameters_off: 指向 method 原型的参数列表 type_list，若 method 没有参数，值为0。参数列表的格式是 type_list，下面会有描述。

- 4、field_ids<br>filed_ids 区里面有 dex 文件引用的所有的 field。区段的元素格式是 field_id_item，结构如下:

```c
ushort 16-bit unsigned int, little-endian 
uint   32-bit unsigned int, little-endian 

struct filed_id_item
{
    ushort class_idx;  //-->type_ids
    ushort type_idx;   //-->type_ids
    uint   name_idx;   //-->string_ids
}
```

1. class_idx: 表示 field 所属的 class 类型，class_idx 的值是 type_ids 的一个 index，并且必须指向一个 class 类型。
2. type_idx: 表示本 field 的类型，它的值也是 type_ids 的一个 index 。
3. name_idx: 表示本 field 的名称，它的值是 string_ids 的一个 index 。

- 5、method_ids<br>method_ids 是索引区的最后一个条目，描述了 dex 文件里的所有的 method。method_ids 的元素格式是 method_id_item，结构跟 fields_ids 很相似:

```c
ushort 16-bit unsigned int, little-endian 
uint   32-bit unsigned int, little-endian 

struct filed_id_item
{
    ushort class_idx;  //-->type_ids
    ushort proto_idx;   //-->proto_ids
    uint   name_idx;   //-->string_ids
}
```

1. class_idx: 表示method所属的class类型，class_idx的值是type_ids的一个index，并且必须指向一个class类型。ushort类型也是为什么我们说一个dex只能有65535个方法的原因，多了必须分包。
2. proto_idx: 表示 method 的类型，它的值也是 type_ids 的一个 index。
3. name_idx: 表示 method 的名称，它的值是 string_ids 的一个 index。<br>索引区：<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560518444-bc24b3d2-6068-412d-a53c-2c0b160edbdc.png#averageHue=%23403d3a&clientId=u1ef545c5-3a11-4&from=paste&id=ucc0d9cf6&originHeight=89&originWidth=1004&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u5db65d7a-8365-4b07-8c14-cbb094a7538&title=)

### 三、数据区

#### 1、class_defs

class_defs区段主要是对class的定义，它的结构很复杂，一层套一层。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560583252-c640e8bf-0d8a-46dd-bb7c-71bd3f0b01c4.png#averageHue=%233e3c39&clientId=u1ef545c5-3a11-4&from=paste&id=udc23597c&originHeight=160&originWidth=1021&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u55b1946f-ec06-4eb6-9f95-01b73c9114a&title=)

- 1、class_def_item<br>class_defs 区域里存放着 class definitions , class 的定义 。它的结构较 dex 区都要复杂些 ,因为有些数据都直接指向了data 区里面。数据结构为：

```c
uint   32-bit unsigned int, little-endian

struct class_def_item
{
    uint class_idx;         //-->type_ids
    uint access_flags;
    uint superclass_idx;    //-->type_ids
    uint interface_off;     //-->type_list
    uint source_file_idx;    //-->string_ids
    uint annotations_off;    //-->annotation_directory_item
    uint class_data_off;    //-->class_data_item
    uint static_value_off;    //-->encoded_array_item
}
```

- class_idx: 描述具体的 class 类型，值是 type_ids 的一个 index 。值必须是一个 class 类型，不能是数组类型或者基本类型。
- access_flags: 描述 class 的访问类型，诸如 public , final , static 等。在 dex-format.html 里 "access_flags Definitions" 有具体的描述 。
- superclass_idx: 描述 supperclass 的类型，值的形式跟 class_idx 一样 。
- interfaces_off: 值为偏移地址，指向 class 的 interfaces，被指向的数据结构为 `type_list` 。class 若没有 interfaces 值为 0。
- source_file_idx: 表示源代码文件的信息，值是 string_ids 的一个 index。若此项信息缺失，此项值赋值为 NO_INDEX=0xffff ffff。
- annotions_off: 值是一个偏移地址，指向的内容是该 class 的注释，位置在 data 区，格式为 `annotations_direcotry_item`。若没有此项内容，值为 0 。
- class_data_off: 值是一个偏移地址，指向的内容是该 class 的使用到的数据，位置在 data 区，格式为 `class_data_item`。若没有此项内容值为 0。该结构里有很多内容，详细描述该 class 的 field、method, method 里的执行代码等信息，后面会介绍`class_data_item`。
- static_value_off: 值是一个偏移地址 ，指向 data 区里的一个列表 (list)，格式为 `encoded_array_item`。若没有此项内容值为 0。
- 1.1 type_list<br>type_list 在 data 区段，class_def_item->interface_off 就是指的这里的数据。数据结构如下：

```c
uint   32-bit unsigned int, little-endian

struct type_list
{
    uint       size;
    type_item  list [size]
}

struct type_item
{
    ushort type_idx   //-->type_ids
}
```

- size: 表示类型个数
- type_idx: 对应一个 type_ids 的 index
- 1.2 annotations_directory_item<br>class_def_item->annotations_off 指向的数据区段，定义了 annotation 相关的数据描述。
- 1.3 class_data_item<br>class_data_off 指向 data 区里的 class_data_item 结构，class_data_item 里存放着本 class 使用到的各种数据，下面是 class_data_item 的结构 :

```c
uleb128 unsigned little-endian base 128 

struct class_data_item
{
    uleb128 static_fields_size;
    uleb128 instance_fields_size;
    uleb128 direct_methods_size;
    uleb128 virtual_methods_size;

    encoded_field  static_fields[static_fields_size];
    encoded_field  instance_fields[instance_fields_size];
    encoded_method direct_methods[direct_methods_size];
    encoded_method virtual_methods[virtual_methods_size];
}

struct encoded_field
{
    uleb128 filed_idx_diff; 
    uleb128 access_flags;  
}

struct encoded_method
{
    uleb128 method_idx_diff; 
    uleb128 access_flags; 
    uleb128 code_off;
}
```

#### 2、map_list

map_list 中大部分 item 跟 header 中的相应描述相同，都是介绍了各个区的偏移和大小，但是 map_list 中描述的更加全面，包括了 HEADER_ITEM 、TYPE_LIST、STRING_DATA_ITEM、DEBUG_INFO_ITEM 等信息。<br>数据结构为：

```c
ushort 16-bit unsigned int, little-endian
uint   32-bit unsigned int, little-endian

struct map_list 
{
    uint     size;
    map_item list [size]; 
}
struct map_item 
{
    ushort type; 
    ushort unuse; 
    uint   size; 
    uint   offset;
}
```

map_list 里先用一个 uint 描述后面有 size 个 map_item，后续就是对应的 size 个 map_item 描述。<br>map_item 结构有 4 个元素: type 表示该 map_item 的类型，Dalvik Executable Format 里 Type Code 的定义; size 表示再细分此 item，该类型的个数;offset 是第一个元素的针对文件初始位置的偏移量; unuse 是用对齐字节的，无实际用处。<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560532524-251ac893-f5f4-42f5-86d8-58f631e0b65d.png#averageHue=%23ebebeb&clientId=u1ef545c5-3a11-4&from=paste&id=u1bd640e0&originHeight=691&originWidth=702&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=ue1c89daa-237f-4864-a57e-00cd50a8c1f&title=)<br>![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560548537-4d9de87e-cb58-4f70-bf69-fa184335d064.png#averageHue=%233e3c39&clientId=u1ef545c5-3a11-4&from=paste&id=u26403c37&originHeight=231&originWidth=1028&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u7c65ca26-0a1b-4d8b-9f87-232797b614e&title=)

## class和dex区别

- class是jvm要执行的文件；dex是dvm要执行的文件；class可以通过dex工具处理成dex文件
- class文件存在很多的冗余信息，dex工具会去除冗余信息，把所有的class文件整合到dex文件，减少了I/O操作，提高了类的查找速度

![](https://cdn.nlark.com/yuque/0/2023/png/694278/1693560697681-bb98f466-01b8-445b-bba3-8bd3c10df097.png#averageHue=%23c0d656&clientId=u1ef545c5-3a11-4&from=paste&id=u4f61e036&originHeight=514&originWidth=604&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u41642428-cb0b-43c0-8c50-cba94d129e4&title=)

## JVM的数据格式规范和Class文件

参考：<http://www.importnew.com/16388.html><br>《Java虚拟机规范》阅读（三）:Class文件格式<br><http://www.cnblogs.com/zhuYears/archive/2012/02/07/2340347.html>

## Reference

-  [ ] Dalvik 可执行文件格式<br><https://source.android.com/devices/tech/dalvik/dex-format?hl=zh-cn>
-  [ ] DEX文件格式分析<br><https://segmentfault.com/a/1190000007652937>
