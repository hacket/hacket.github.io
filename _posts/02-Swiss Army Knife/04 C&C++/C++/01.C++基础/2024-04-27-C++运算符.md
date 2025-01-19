---
date created: 2024-04-27 00:25
date updated: 2024-12-27 23:51
tags:
  - '#include'
dg-publish: true
---

# C++运算符

## 运算符分类

**作用：** 用于执行代码的运算

运算符分类：

| **运算符类型** | **作用**              |
| --------- | ------------------- |
| 算术运算符     | 用于处理四则运算            |
| 赋值运算符     | 用于将表达式的值赋给变量        |
| 比较运算符     | 用于表达式的比较，并返回一个真值或假值 |
| 逻辑运算符     | 用于根据表达式的值返回真值或假值    |

### 算术运算符

**作用**：用于处理四则运算

算术运算符包括以下符号：

| **运算符** | **术语** | **示例**        | **结果**    |
| ------- | ------ | ------------- | --------- |
| +       | 正号     | +3            | 3         |
| -       | 负号     | -3            | -3        |
| +       | 加      | 10 + 5        | 15        |
| -       | 减      | 10 - 5        | 5         |
| *       | 乘      | 10 * 5        | 50        |
| /       | 除      | 10 / 5，除数不能为0 | 2         |
| %       | 取模(取余) | 10 % 3        | 1         |
| ++      | 前置递增   | a=2; b=++a;   | a=3; b=3; |
| ++      | 后置递增   | a=2; b=a++;   | a=3; b=2; |
| --      | 前置递减   | a=2; b=--a;   | a=1; b=1; |
| --      | 后置递减   | a=2; b=a--;   | a=1; b=2; |

示例：

```cpp
//加减乘除
int main() {

	int a1 = 10;
	int b1 = 3;

	cout << a1 + b1 << endl;
	cout << a1 - b1 << endl;
	cout << a1 * b1 << endl;
	cout << a1 / b1 << endl;  //两个整数相除结果依然是整数

	int a2 = 10;
	int b2 = 20;
	cout << a2 / b2 << endl; 

	int a3 = 10;
	int b3 = 0;
	//cout << a3 / b3 << endl; //报错，除数不可以为0

	//两个小数可以相除
	double d1 = 0.5;
	double d2 = 0.25;
	cout << d1 / d2 << endl;

	system("pause");

	return 0;
}
```

**总结：**

- 在除法运算中，除数不能为0
- 只有整型变量可以进行取模运算
- 前置递增先对变量进行++，再计算表达式，后置递增相反

### 赋值运算符

**作用：** 用于将表达式的值赋给变量

赋值运算符包括以下几个符号：

| **运算符** | **术语** | **示例**     | **结果**    |
| ------- | ------ | ---------- | --------- |
| =       | 赋值     | a=2; b=3;  | a=2; b=3; |
| +=      | 加等于    | a=0; a+=2; | a=2;      |
| -=      | 减等于    | a=5; a-=3; | a=2;      |
| *=      | 乘等于    | a=2; a*=2; | a=4;      |
| /=      | 除等于    | a=4; a/=2; | a=2;      |
| %=      | 模等于    | a=3; a%2;  | a=1;      |

### 比较运算符

**作用：** 用于表达式的比较，并返回一个真值或假值。

C和C++ 语言的比较运算中， ==“真”用数字“1”来表示， “假”用数字“0”来表示。==

比较运算符有以下符号：

| **运算符** | **术语** | **示例** | **结果** |
| ------- | ------ | ------ | ------ |
| ==      | 相等于    | 4 == 3 | 0      |
| !=      | 不等于    | 4 != 3 | 1      |
| <       | 小于     | 4 < 3  | 0      |
| >       | 大于     | 4 > 3  | 1      |
| <=      | 小于等于   | 4 <= 3 | 0      |
| >=      | 大于等于   | 4 >= 1 | 1      |

### 逻辑运算符

**作用：** 用于根据表达式的值返回真值或假值

逻辑运算符有以下符号：

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202404270035461.png)

## 运算符

### 运算符（操作符）介绍

- **操作符就是函数。**
- 运算符是给我们使用的一种符号，通常代替一个函数来执行一些事情。比如 `加减乘除`、`dereference运算符`、`箭头运算符`、`+=运算符`、`&运算符`、`左移运算符`、`new` 和 `delete`、`逗号`、`圆括号`、`方括号` 等等。
- 运算符重载允许你在程序中定义或者更改一个操作符的行为。
- 应该相当少地使用操作符重载，只在他非常有意义的时候使用。

### 箭头 `->` 操作符

#### 特点

- 箭头运算符必须是类的成员。
- 一般将箭头运算符定义成了 `const` 成员，这是因为与递增和递减运算符不一样，获取一个元素并不会改变类对象的状态。

#### `->` 和 `.` 区别

在 C++ 中，`.`（点运算符）和 `->`（箭头运算符）都用于访问对象的成员，但它们各自有不同的使用场景：

- `.（点运算符）`：用于访问一个实际对象的成员。如果你有一个对象（不是指针），你可以使用点运算符来访问它的公有成员（public fields）和成员函数（member functions）。

```cpp
class MyClass {
public:
    int myMember;
};

MyClass myObject;
myObject.myMember = 1; // 使用点运算符
```

如果您拥有对象的引用，应当使用 `.（点运算符）` 来访问成员。

在 C++中，引用可以被看作是给已经存在的对象的另一个名字（别名），因此通过引用访问对象成员时，其行为和直接通过对象访问成员一样。这也意味着即使引用可能本质上是指针的「语法糖」（尽管这是实现细节，不必关心），您仍然像使用实际对象一样使用点运算符。

```cpp
class MyClass {
public:
    int value;
    
    void doSomething() {
        // ...
    }
};

MyClass myObject;
MyClass& myReference = myObject;

// 通过引用访问成员变量和函数
myReference.value = 10;      // 通过引用，使用点运算符
myReference.doSomething();   // 同上

```

- `->（箭头运算符）`：用于通过对象的指针来访问成员。如果你有一个指向对象的指针，你使用箭头运算符来访问它指向的对象的成员。

```cpp
MyClass *myObjectPtr = &myObject;
myObjectPtr->myMember = 1; // 使用箭头运算符
```

总结一下：

- 使用 `.` 当你有一个对象并且需要直接访问它的成员。
- 使用 `->` 当你有一个指向对象的指针并且想通过该指针来访问其成员。

它们的使用完全取决于你是直接操作对象还是操作指向对象的指针。

#### 对箭头运算符返回值的限定

重载的箭头运算符**必须返回类的指针或者自定义了箭头运算符的某个类的对象。**

#### 应用场景

1. 可用于指针调用成员：`p->x` 等价于 `(*p).x`
2. 重载箭头操作符

```cpp
#include <iostream>
class Entity
{
private:
    int x;
public:
    void Print() 
    {
        std::cout << "Hello!" << std::endl;
    }
};
class ScopedPtr
{
private:
    Entity* m_Ptr;
public:
    ScopedPtr(Entity* ptr) : m_Ptr(ptr)
    {
    }
    ~ScopedPtr()
    {
        delete m_Ptr;
    }
    Entity* operator->()  //重载操作符
    {
        return m_Ptr;
    }
};
int main()
{
    {
        ScopedPtr entity = new Entity();
        entity->Print();
    }
    std::cin.get();
}
```

写为 `const` 版本的：

```cpp
#include <iostream>
class Entity
{
private:
    int x;
public:
    void Print() const   //添加const
    {
        std::cout << "hello!" << std::endl;
    }
};
class ScopedPtr
{
private:
    Entity* m_Ptr;
public:
    ScopedPtr(Entity* ptr) : m_Ptr(ptr)
    {
    }
    ~ScopedPtr()
    {
        delete m_Ptr;
    }
    Entity* operator->()
    {
        return m_Ptr;
    }
    const Entity* operator->() const //添加const
    {
        return m_Ptr;
    }
};
int main()
{
    {
        const ScopedPtr entity = new Entity(); //如果是const，则上面代码要改为const版本的。
        entity->Print();
    }
    std::cin.get();
}
```

3. 可用于计算成员变量的 offset

因为"`指针->属性`"访问属性的方法实际上是通过把指针的值和属性的偏移量相加，得到属性的内存地址进而实现访问。而把指针设为 `nullptr(0)`，然后->属性就等于 0+属性偏移量。编译器能知道你指定属性的偏移量是因为你把 `nullptr` 转换为类指针，而这个类的结构你已经写出来了 `(float x,y,z)`，float 4 字节，所以它在编译的时候就知道偏移量 (0,4,8)，所以无关对象是否创建

```cpp
struct vec2
{
    int x,y;
    float pos,v;
};
int main()
{   
    int offset = (int)&((vec2*)nullptr)->x; // x,y,pos,v的offset分别为0,4,8,12
    std::cout<<offset<<std::endl;
    std::cin.get();
}
```

## 运算符重载

### `operator+` 和 `operator*` 操作符重载

**+重载作用：** 自定义数据类型做相加运算

**示例1：**

```cpp
#include <iostream>
struct Vector2
{
    float x, y;
    Vector2(float x,float y) :x(x),y(y){}
    Vector2 Add(const Vector2& other) const // 普通函数，没用重载
    {
        return Vector2(x + other.x, y + other.y);
    }

    Vector2 operator+(const Vector2& other) const  //重载：定义+操作符
    {
        return Add(other);
    }

    Vector2 Multiply(const Vector2& other) const
    {
        return Vector2(x * other.x, y * other.y);
    }
    Vector2 operator*(const Vector2& other) const  //重载：定义*操作符
    {
        return Multiply(other);
    }
};
int main()
{
    Vector2 position(4.0f, 4.0f); // 对象position
    Vector2 speed(0.5f, 1.5f);  // 对象speed
    Vector2 powerup(1.1f, 1.1f); // 对象powerup
    Vector2 result1 = position.Add(speed.Multiply(powerup)); //无重载方式
    Vector2 result2 = position + speed * powerup; //重载方式

    std::cin.get();
}
```

> result 2 的写法比 rusult 1 看起来好的多。

**示例2：** 实现两个自定义数据类型相加的运算

```cpp
class Person {
public:
	Person() {};
	Person(int a, int b)
	{
		this->m_A = a;
		this->m_B = b;
	}
	//成员函数实现 + 号运算符重载
	Person operator+(const Person& p) {
		Person temp;
		temp.m_A = this->m_A + p.m_A;
		temp.m_B = this->m_B + p.m_B;
		return temp;
	}
public:
	int m_A;
	int m_B;
};
//全局函数实现 + 号运算符重载
//Person operator+(const Person& p1, const Person& p2) {
//	Person temp(0, 0);
//	temp.m_A = p1.m_A + p2.m_A;
//	temp.m_B = p1.m_B + p2.m_B;
//	return temp;
//}
//运算符重载 可以发生函数重载 
Person operator+(const Person& p2, int val)  
{
	Person temp;
	temp.m_A = p2.m_A + val;
	temp.m_B = p2.m_B + val;
	return temp;
}
void test() {
	Person p1(10, 10);
	Person p2(20, 20);

	//成员函数方式
	Person p3 = p2 + p1;  //相当于 p2.operaor+(p1)
	cout << "mA:" << p3.m_A << " mB:" << p3.m_B << endl;
	
	Person p4 = p3 + 10; //相当于 operator+(p3,10)
	cout << "mA:" << p4.m_A << " mB:" << p4.m_B << endl;
}
```

### 左移 `operator<<` 操作符的重载

**作用：** 重载左移运算符配合友元可以实现输出自定义数据类型

现在我们有了这个 Vector 2，然后我们想要把它打印到控制台：

```cpp
Vector2 result2 = position + speed * powerup; //重载方式
std::cout << result2 << std::endl; // 报错：C++ 没有与这些操作数匹配的运算符 操作数类型为:  std::ostream << Vector2
```

报错的原因在于"`<<`"操作符还没有被重载，他接受两个参数，一个是输出流，也就是 cout，然后另一个就是 `Vector2` （操作数类型为: `std::ostream << Vector2` 我们可以**在 Vector 2 类外面**对它进行重载，因为她其实和 Vector 2 其实没什么关系

```cpp
#include <iostream>
struct Vector2
{
	//...
};
//定义左移操作符的重载
std::ostream& operator<<(std::ostream& stream, const Vector2& other)
{
    stream << other.x << "," << other.y;  //这里的stream已经知道要如何打印浮点数.所以我们不需要再对浮点数进行重载
    return stream;
}

int main()
{
    // ...
    Vector2 result2 = position + speed * powerup; 
    std::cout << result2 << std::endl; //需要重载<<
    std::cin.get();
}
```

### bool `operator==/operator!=` 操作符的重载

```cpp
#include <iostream>
struct Vector2
{
    //...
    bool operator==(const Vector2& other) const  //定义操作符的重载,如果!=，这里做相应修改即可
    {
        return x == other.x && y == other.y;
    }

    bool operator!=(const Vector2& other) const  //如果!=，这里做相应修改即可
    {
        return !(*this == other);
    }
};
//....
int main()
{
    //...
    Vector2 result1 = position.Add(speed.Multiply(powerup));
    Vector2 result2 = position + speed * powerup; 
    if (result1 == result2)   //需要对==进行重载操作 （！=同理）
    {
      //...
    }
    std::cin.get();
}
```

### `operator []` 操作符的重载

```cpp
template <typename T, size_t S>
class MyArray1
{
private:
    T m_Data[S];

public:
    // 返回数组大小
    constexpr size_t size() const { return S; }
    // 重载下标操作符
    T operator[](size_t index) { return m_Data[index]; } //  data[0] = 1; error expression must be a modifiable lvalue

    T &operator[](size_t index) { return m_Data[index]; } //  data[0] = 1; ok

    const T &operator[](size_t index) // data[0] = 1; error expression must be a modifiable lvalueC
    {
         return m_Data[index];
    }

    T *getData() { return m_Data; }

    const T *getData() const { return m_Data; }
};
```

重载 `operator[]` 的几种不同方式，每种都有其特定的用途和场景：

- `T operator[](size_t index) { return m_Data[index]; }`
  - 这个函数返回数组 `m_Data` 中指定索引处的元素的拷贝。调用者**无法通过这个函数来修改**原数组中的元素，因为它仅提供对数组元素值的**仅只读访问**。同时，因为它返回值而不是引用，这可能导致性能开销，尤其当 T 是一个大型或复杂对象时。
- `T &operator[](size_t index) { return m_Data[index]; }`
  - 这个函数返回一个对数组 `m_Data` 中指定索引处元素的引用。这允许调用者**不仅可以读取该元素，还可以修改它**。这是最常见的 `operator[]` 重载方式，因为它允许使用标准的数组访问语法来直接修改容器内容。
- `const T &operator[](size_t index) { return m_Data[index]; }`
  - 这个函数返回一个对数组 `m_Data` 中指定索引元素的常量引用。它类似于第二个重载，但提供的是**仅只读访问**。它是常量成员函数，这意味着即使在只能访问类的常量成员的上下文（例如，通过常量对象或指向常量对象的 `指针/引用`）中，也可以调用它。这是为了在不修改容器内容的情况下访问元素。

通常你会同时看到第二个和第三个版本的重载一起出现在类中，这样即可以在需要修改元素时使用非常量版本，也可以在仅仅需要访问元素时使用常量版本，并能够保证对常量对象的只读操作。

为了更完整地适应各种可能的调用上下文，正确的做法是同时提供第二个和第三个重载，如下：

```cpp
T &operator[](size_t index) { return m_Data[index]; }
const T &operator[](size_t index) const { return m_Data[index]; }
```

请注意，第三个重载的结尾应该有 const 关键字，这样它才能被常量对象调用。如果 const 关键字被遗漏，那么这个重载将无法在只读上下文中使用。

在 C++ 中，为了避免在常量和非常量版本的成员函数中重复相同的逻辑，通常的做法是在常量成员函数中调用非常量成员函数，并进行适当的类型转换。然而，直接这样做可能会造成编译错误，因为在常量成员函数中不能调用非常量成员函数，这违反了常量性的规则。

一个避免这种重复的通用技巧是使用 `const_cast` 来临时去除对象的常量性，以便调用相应的非常量版本函数。这种方法使用时必须非常小心，只有在你确信对象实际上不是常量时，才能安全地这样做。

以下是如何在常量 `operator[]` 重载中调用非常量版本的示例代码：

```cpp

#include <cstddef>
#include <cassert>

class MyClass {
private:
    int m_Data[10];
    
public:
    // 非常量版本的 operator[]
    int& operator[](std::size_t index) {
        assert(index < 10);  // 简单的边界检查
        return m_Data[index];
    }

    // 常量版本的 operator[]
    const int& operator[](std::size_t index) const {
        // 使用 const_cast 来移除 *this 的常量性
        // 这样就可以调用非常量版本的 operator[]
        // 这是安全的，因为我们知道非常量版本的 operator[] 
        // 不修改对象的状态
        return const_cast<MyClass*>(this)->operator[](index);
    }
};

int main() {
    MyClass myClass;

    // 调用非常量版本的 operator[]
    myClass[5] = 10;

    // 调用常量版本的 operator[]
    const MyClass constMyClass = myClass;
    int value = constMyClass[5];
    
    return 0;
}
```

在这个示例中，**常量 operator[]** 使用 **const_cast** 移除了 this 指针的常量性，并且调用了**非常量版本的 operator[]**。这样做的确保是，**常量版本的 operator[]** 只是被用于读取数据，而不是写入数据，所以这种临时的类型转换是安全的。

不过，需要格外注意，仅在你完全理解你的函数不会修改对象状态的情况下，才能使用 constcast。否则，使用 constcast 可能导致未定义行为。

### `++i` 和 `i++` 递增运算符重载

**作用：** 通过重载递增运算符，实现自己的整型数据

```cpp
class MyInteger {
	friend ostream& operator<<(ostream& out, MyInteger myint);

public:
	MyInteger() {
		m_Num = 0;
	}
	//前置++
	MyInteger& operator++() {
		//先++
		m_Num++;
		//再返回
		return *this;
	}
	//后置++
	MyInteger operator++(int) {
		//先返回
		MyInteger temp = *this; //记录当前本身的值，然后让本身的值加1，但是返回的是以前的值，达到先返回后++；
		m_Num++;
		return temp;
	}
private:
	int m_Num;
};

ostream& operator<<(ostream& out, MyInteger myint) {
	out << myint.m_Num;
	return out;
}

//前置++ 先++ 再返回
void test01() {
	MyInteger myInt;
	cout << ++myInt << endl;
	cout << myInt << endl;
}

//后置++ 先返回 再++
void test02() {

	MyInteger myInt;
	cout << myInt++ << endl;
	cout << myInt << endl;
}

int main() {
	test01();
	//test02();
	return 0;
}
```

**总结：** 前置递增返回引用，后置递增返回值

### `=` 赋值运算符重载

C++编译器至少给一个类添加4个函数

1. **默认构造函数(无参，函数体为空)**
2. **默认析构函数(无参，函数体为空)**
3. **默认拷贝构造函数，对属性进行值拷贝**
4. **赋值运算符 operator=, 对属性进行值拷贝**

如果类中有属性指向堆区，做赋值操作时也会出现深浅拷贝问题

**示例：**

```cpp
class Person
{
public:
	Person(int age)
	{
		//将年龄数据开辟到堆区
		m_Age = new int(age);
	}
	// 重载赋值运算符 
	Person& operator=(Person &p)
	{
		if (m_Age != NULL)
		{
			delete m_Age;
			m_Age = NULL;
		}
		//编译器提供的代码是浅拷贝
		//m_Age = p.m_Age;

		// 提供深拷贝 解决浅拷贝的问题
		m_Age = new int(*p.m_Age);

		// 返回自身
		return *this;
	}
	~Person()
	{
		if (m_Age != NULL)
		{
			delete m_Age;
			m_Age = NULL;
		}
	}
	//年龄的指针
	int *m_Age;
};
void test01()
{
	Person p1(18);
	Person p2(20);
	Person p3(30);
	p3 = p2 = p1; //赋值操作
	cout << "p1的年龄为：" << *p1.m_Age << endl;
	cout << "p2的年龄为：" << *p2.m_Age << endl;
	cout << "p3的年龄为：" << *p3.m_Age << endl;
}

int main() {
	test01();

	//int a = 10;
	//int b = 20;
	//int c = 30;

	//c = b = a;
	//cout << "a = " << a << endl;
	//cout << "b = " << b << endl;
	//cout << "c = " << c << endl;
	return 0;
}
```

### `>` 关系运算符重载

**作用：** 重载关系运算符，可以让两个自定义类型对象进行对比操作

**示例：**

```cpp
class Person
{
public:
	Person(string name, int age)
	{
		this->m_Name = name;
		this->m_Age = age;
	};
	bool operator==(Person & p)
	{
		if (this->m_Name == p.m_Name && this->m_Age == p.m_Age)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	bool operator!=(Person & p)
	{
		if (this->m_Name == p.m_Name && this->m_Age == p.m_Age)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	string m_Name;
	int m_Age;
};
void test01()
{
	//int a = 0;
	//int b = 0;
	Person a("孙悟空", 18);
	Person b("孙悟空", 18);
	if (a == b)
	{
		cout << "a和b相等" << endl;
	}
	else
	{
		cout << "a和b不相等" << endl;
	}
	if (a != b)
	{
		cout << "a和b不相等" << endl;
	}
	else
	{
		cout << "a和b相等" << endl;
	}
}
int main() {
	test01();
	return 0;
}
```

### `()` 函数调用运算符重载

- 函数调用运算符 `()` 也可以重载
- 由于重载后使用的方式非常像函数的调用，因此称为**仿函数**
- 仿函数没有固定写法，非常灵活

**示例：**

```cpp
class MyPrint
{
public:
	void operator()(string text)
	{
		cout << text << endl;
	}
};
void test01()
{
	//重载的（）操作符 也称为仿函数
	MyPrint myFunc;
	myFunc("hello world");
}
class MyAdd
{
public:
	int operator()(int v1, int v2)
	{
		return v1 + v2;
	}
};
void test02()
{
	MyAdd add;
	int ret = add(10, 10);
	cout << "ret = " << ret << endl;

	//匿名对象调用  
	cout << "MyAdd()(100,100) = " << MyAdd()(100, 100) << endl;
}
int main() {
	test01();
	test02();
	return 0;
}
```
