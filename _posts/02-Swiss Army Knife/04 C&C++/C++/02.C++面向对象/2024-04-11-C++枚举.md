---
date created: 2024-04-11 00:16
date updated: 2024-12-27 23:51
dg-publish: true
---

## C++枚举

### 枚举量的声明

- `enum` 是 `enumeration` 的缩写。基本上它就是一个数值集合。不管怎么说，这里面的**数值只能是整数。**
- 定义枚举类型的主要目的：**增加程序的可读性**
- 枚举变量的名字一般以**大写字母**开头（非必需）
- 默认情况下，编译器设置第一个枚举变量值为 0，下一个为 1，以此类推（也可以手动给每个枚举量赋值），且 **未被初始化的枚举值的值默认将比其前面的枚举值大 1。**）
- 枚举量的值可以相同
- 枚举类型所使用的类型默认为 `int` 类型，也可指定其他类型，如：`unsigned char`

示例：

```cpp
enum example {   // 声明example为新的数据类型，称为枚举(enumeration);
 Aa, Bb, Cc   // 声明Aa, Bb, Cc等为符号常量，通常称之为枚举量，其值默认分别为0，1，2
};

enum example {
 Aa = 1, Bb, Cc = 1，Dd, Ee // 1 2 1 2 3 未被初始化的枚举值的值默认将比其前面的枚举值大1。
};

enum example : unsigned char // 将类型指定成unsigned char，枚举变量变成了8位整型，减少内存使用。
{
 Aa, Bb = 10, Cc
};

enum example : float  // ERROR！枚举量必须是一个整数，float不是整数（double也不行）。
{
 Aa, Bb = 10, Cc
};
```

### 枚举量的定义

可利用新的枚举类型**example**声明这种类型的变量 example Dd，可以在定义枚举类型时定义枚举变量：

```cpp
enum example
{
	Aa, Bb, Cc
}Dd; // Dd是枚举变量

int main()
{
	Dd = Cc;
	Dd = Aa;

	example e1 = Aa;
	example e2 = Bb;
	// 比较两个枚举类型的值是否相等：比较Dd和e1、e2是否相等
	if (Dd == e1)
	{
		// do something
		std::cout << "Dd == e1" << (Dd == e1) << std::endl; // 输出这个
	}
	else {
		std::cout << "Dd != e1" << (Dd == e1) << std::endl;
	}
}
```

与基本变量类型不同的地方是，**在不进行强制转换的前提下**，只能将定义的**枚举变量**赋值给该种枚举的变量 (非绝对的，可用强制类型转换将其他类型值赋给**枚举变量**)

```cpp
Dd = Bb; //ok
Dd = Cc; //ok

Dd = 5; //Error!因为5不是枚举量
```

枚举量可赋给非枚举变量：

```cpp
int a = Aa; //ok.枚举量是符号常量，赋值时编译器会自动把枚举量转换为int类型。
```

对于枚举，**只定义了赋值运算符，没有为枚举定义算术运算** ，但**能参与其他类型变量的运算**

```cpp
Aa++;          //非法！
Dd = Aa + Cc   //非法！
int a = 1 + Aa //Ok,编译器会自动把枚举量转换为int类型。
```

可以通过**强制转换**将其他类型值赋给枚举变量

```cpp
Dd = example(2);
//等同于
Dd = Cc
//若试图将一个超出枚举取值范围的值通过强制转换赋给枚举变量
Dd = example(10); //结果将是不确定的，这么做不会出错，但得不到想要的结果
```

### 枚举的取值范围

枚举的上限：大于【最大枚举量】的【最小的 2 的幂】，减去 1；
枚举的下限：

- 枚举量的最小值不小于 0，则枚举下限取 0
- 枚举量的最小值小于 0，则枚举下限是: 小于【最小枚举量】的【最大的 2 的幂】，加上 1。

例如定义 enumType 枚举类型：

```cpp
enum enumType {
    First=-5，Second=14，Third=10
};
```

则枚举的上限是 16-1=15（16 大于最大枚举量 14，且为 2 的幂）；枚举的下限是-8+1=-7（-8 小于最小枚举量-5，且为 2 的幂）；

### **枚举应用**

**枚举**和**switch**是最好的搭档：

```cpp
enum enumType{
    Step0, Step1, Step2
}Step=Step0; // 注意这里在声明枚举的时候直接定义了枚举变量Step, 并初始化为Step0 

switch (Step)
{
case Step0:{ /*…;*/ break;}
case Step1:{ /*…;*/ break;}
case Step2:{ /*…;*/ break;}
default:break;

}
```
