---
date created: 2024-04-06 23:04
tags:
  - '#ifndef'
  - '#define'
  - '#include'
  - '#endif'
  - '#pragma'
date updated: 2024-12-27 23:51
dg-publish: true
---

# class 类

> C++ 在 C 语言的基础上增加了面向对象编程，C++ 支持面向对象程序设计。类是 C++ 的核心特性，用户定义的类型。

## 类基础

### 访问控制符

- 可见性是一个属于面向对象编程的概念，它指的是类的某些成员或方法实际上是否可见。可见性是指：谁能看到它们，谁能调用它们，谁能使用它们，所有这些东西。
- 可见性是对程序实际运行方式、程序性能或类似的东西没影响。它只单纯的是语言层面的概念，让你能够写出更好的代码或者帮助你组织代码。
- C++中有三个基础的可见修饰符（访问修饰符）：**private、protected、public**

class 中的成员，默认不加都是 `private` 的。

| 方式        | 说明                                                                                                                               | 继承                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| public    | 都可见：可以被该类中的函数、子类的函数、友元函数访问，也可以被该类的对象访问。                                                                                          | 基类的 public、protected 成员也是派生类相应的成员，基类的 private 成员不能直接被派生类访问，但是可以通过调用基类的公有和保护成员来访问； |
| protected | 这个**类以及它的所有派生类**都可以访问到这些成员。（但在 main 函数中 new 一个类就不可见，这其实是因为 main**函数不是类的函数**，对 main 函数是不可访问的）。可以被该类中的函数、子类的函数、友元函数访问。但不能被该类的对象访问。 | 基类的公有和保护成员将成为派生类的保护成员；                                                            |
| private   | 只有**自己的类和它的友元**才能访问（继承的子类也不行，友元的意思就是可以允许你访问这个类的私有成员）。                                                                            | 基类的公有和保护成员将成为派生类的私有成员；                                                            |

### class 默认都是私有

类默认都是 private 的

```c++
class Player
{
    int x, y;
    int speed;
};

int main()
{
    Player player;
    // player.x = 5; // error: 'x' is a private member of 'Player'
    // player.y = 5; // error: 'y' is a private member of 'Player'
    // player.speed = 5; // error: 'speed' is a private member of 'Player'
    return 0;
}
```

类示例：

```c++
#include <iostream>

class Log
{
public:
    const int LogLevelError = 0;
    const int LogLevelWarning = 1;
    const int LogLevelInfo = 2;
    const int LogLevelDebug = 3;

private:
    int m_LogLevel = LogLevelInfo;

public:
    void SetLevel(int level)
    {
        m_LogLevel = level;
    }

    void Error(const char *message)
    {
        if (m_LogLevel >= LogLevelError)
            std::cout << "[ERROR]: " << message << std::endl;
    }

    void Warn(const char *message)
    {
        if (m_LogLevel >= LogLevelWarning)
            std::cout << "[WARNING]: " << message << std::endl;
    }

    void Info(const char *message)
    {
        if (m_LogLevel >= LogLevelInfo)
            std::cout << "[INFO]: " << message << std::endl;
    }
    void Debug(const char *message)
    {
        if (m_LogLevel >= LogLevelDebug)
        {
            std::cout << "[DEBUG]: " << message << std::endl;
        }
    }
};

int main(int argc, char const *argv[])
{
    Log log;
    log.SetLevel(log.LogLevelInfo);
    log.Debug("Hello!");
    log.Info("Hello!");
    log.Warn("Hello!");
    log.Error("Hello!");
    return 0;
};
```

### class 和 struct 对比

区别：

- class 和 struct 从技术上是没多大区别的，唯一的区别可能就是可见性：class 默认是 private 的，struct 默认是 public 的

- struct 在 C++中继续存在的唯一原因是希望与 C 保持向后兼容性，因为 C 代码没有 class 只有 struct

使用选择：

- 选择 struct 时，其只作为一堆数据的结构的集合，不添加函数，也不使用继承；如若只包含一些变量结构或POD(plain old data)时，选用struct。例如数学中的向量类。

```c++
struct Vec2 {
 float x, y;
 void Add(const Vec2& other) {
     x += other.x;
     y += other.y;
 }
};
```

### C++ `new` 关键字

- new 的主要目的是分配内存，具体来说就是在堆上分配内存
- 如果你用 `new` 和 `[]` 来分配数组，那么也用 `delete[]`
- new 主要就是找到一个满足我们需求的足够大的内存块，然后**返回一个指向那个内存地址的指针**。

```cpp
int* a = new int; //这就是一个在堆上分配的4字节的整数,这个a存储的就是他的内存地址.
int* b = new int[50];//在堆上需要200字节的内存。
delete a;
delete[] b;
//在堆上分配Entity类
Entity* e = new Entity();
Entity* e = new Entity;//或者这我们不需要使用括号，因为他有默认构造函数。
Entity* e0 = new Entity[50]; //如果我们想要一个Entity数组，我们可以这样加上方括号,在这个数组里，你会在内存中得到50个连续的Entity
delete e;
delete[] e0;
```

- 在 new 类时，该关键字做了两件事：**分配内存**、**调用构造函数**

```cpp
class Entity {
public:
	int x, y;
	Entity() {
		x = 0;
		y = 0;
		std::cout << "Created Entity!" << std::endl;
	}
};
void NewDemo::testNew() {
	std::cout << "testNew" << std::endl;
	Entity* e = new Entity();//1.分配内存 2.调用构造函数
	Entity* e = (Entity*)malloc(sizeof(Entity)); //只分配内存,不调用构造函数
	// 这两行代码之间仅有的区别就是第一行代码new调用了Entity的构造函数
	delete e;//new了，必须要手动清除
}
```

- `new` 是一个**操作符**，就像加、减、等于一样。它是一个操作符，这意味着你可以重载这个操作符，并改变它的行为。
- 通常调用 new 会调用隐藏在里面的 C 函数 `malloc`，但是**malloc 仅仅只是分配内存**然后给我们一个指向那个内存的指针，而**new 不但分配内存，还会调用构造函数**。同样，**delete 则会调用 destructor 析构函数。**
- new 支持一种叫**placement new**的用法，这决定了他的内存来自哪里, 所以你并没有真正的分配内存。在这种情况下，你只需要调用构造函数，并在一个特定的内存地址中初始化你的 Entity，可以通过些 new new ()然后指定内存地址

```cpp
int* b = new int[50]; 
Entity* entity = new(b) Entity();
```

### C++ this 关键字

**this 说明：**

- C++中有 this 关键字，通过他我们可以访问非静态成员函数，非静态成员函数就是属于某个类的函数或方法
- this 在一个**const 函数**中，this 是一个 `const Entity* const` 或者是 `const Entity*`；在一个**非 const 函数**中，那么它就是一个 `Entity*` 类型的
- 在函数内部，我们可以引用 this，**this 是指向这个函数所属的当前对象实例的指针**

**this指针的用途：**

- 当形参和成员变量同名时，可用this指针来区分
- 在类的非静态成员函数中返回对象本身，可使用`return *this`

**示例1：** this 调用成员变量

```cpp
Entity(int x, int y)
 {
    Entity* e = this;
    e->x = x;     
 }
 // 这样更清晰
 Entity(int x, int y)
 {
	this->x = x;  //同(*this).x = x;   
	this->y = y; 
 }
```

**示例2：** this 当参数传递

```cpp
class Entity;  //前置声明。
void PrintEntity(Entity* e); //在这里声明
class Entity  
{
  public:
    int x,y;
    Entity(int x, int y)
    {
        // Entity* e = this;
        this->x = x;   
        this->y = y; 
        PrintEntity(this); //我们希望能在这个类里调用PrintEntity,就可以传入this，这就会传入我已经设置了x和y的当前实例
    }
}; 
void PrintEntity(Entity* e) //在这里定义
{
    //print something
}

//如果我想传入一个常量引用，我要做的就是在这里进行解引用this
void PrintEntity(const Entity& e); //传入常量引用
class Entity  
{
public:
	int x,y;
	Entity(int x, inty)
	{
		// Entity* e = this; 
		this->x = x;   
		this->y = y; 
		PrintEntity(*this); // 解引用
	}
}; 
void PrintEntity(const Entity& e) 
{
      //print something
}
```

在**非 const 函数**里通过**解引用 this**，我们就可**赋值给 Entity&**，如果是在**const 方法**中，我们会得到一个**const 引用**

```cpp
void PrintEntity(const Entity& e);
class Entity  
{
public:
	int x,y;
	Entity(int x, inty)
	{
	  // Entity* e = this;
		this->x = x;   
		this->y = y; 
		Entity& e = *this;  //在非const函数里通过解引用this，我们就可赋值给Entity&
		PrintEntity(*this); //解引用this
	}
	int GetX() const  
	{
		const Entity& e = *this; //在const方法中，我们会得到一个const引用
	}
}; 
void PrintEntity(const Entity& e) 
{
  //print something
}
```

在函数后面加上 const 后，this 也必须是 const 的：

```cpp
class Entity
{
public:
	int x, y;
	Entity(int x, int y)
	{
		this->x = x;
		this->y = y;
	}
	int GetX() const  //在函数后面加上const是很常见的，因为他不会修改这个类
	{
		Entity* e = this; // ERROR!

		const Entity* e = this; //ok
		e->x = 5; // 出错了，const Entity*e 是一个常量，不可修改
		return 0;
	}
};
```

**示例：this 遇到空指针：**
C++中空指针也是可以调用成员函数的，但是也要注意有没有用到 this 指针；如果用到 this 指针，需要加以判断保证代码的健壮性

```cpp
//空指针访问成员函数
class Person {
public:
	void ShowClassName() {
		cout << "我是Person类!" << endl;
	}
	void ShowPerson() {
		if (this == NULL) {
			return;
		}
		cout << mAge << endl;
	}
public:
	int mAge;
};

void test01()
{
	Person * p = NULL;
	p->ShowClassName(); //空指针，可以调用成员函数
	p->ShowPerson();  //但是如果成员函数中用到了this指针，就不可以了
}

int main() {
	test01();
	return 0;
}
```

### inline

在class body内定义的函数自动`inline`，在类外要加`inline`关键字。inline函数可以让编译变快，你可以试着把所有函数都定义inline，但编译器inline不inline就不一定了，换句话说，你只是提交了一份inline“申请”，如果inline的函数简单，编译器就给你通过”申请“。

## 对象的初始化和清理

### 构造和析构函数

见：[[#构造&析构函数]]

### 成员初始化

有两种方法可以**在构造函数中初始化类成员**：

#### `方式1`：默认构造函数

```cpp
class Entity
{
private:
	std::string m_Name;
public:
    Entity()   //默认构造函数
    {    
        m_Name = "Unknow";
    }
    Entity(const std::string& name)
    {
        m_Name = name;
    }
};
```

#### `方式2`：初始化列表

**作用：**

C++提供了**初始化列表**语法，用来初始化属性

**语法：**`构造函数()：属性1(值1),属性2（值2）... {}`

**注意：**

- 在成员初始化列表里需要按成员变量定义的顺序写。这很重要，因为不管你怎么写初始化列表，它都会按照**在定义类的顺序**进行初始化。
- 使用成员初始化列表的原因：代码风格简洁避免性能浪费

**示例：**

```cpp
#include <iostream>
class Entity
{
private:
	std::string m_Name;
	int m_Score;
public:
	Entity() : m_Name("Unknow"), m_Score(0)
	{
	}
	Entity(const std::string& name,int n) :m_Name(name), m_Score(100)
	{
	}
	const std::string& GetName() const { return m_Name; };
	const int& GetScore() const { return m_Score; };
};
int main()
{
	Entity e0;
	Entity e1("lk",50);
	std::cout << e0.GetName() <<e0.GetScore() << std::endl;
	std::cout << e1.GetName() <<e1.GetScore()<<std::endl;
}
```

### 类对象作为类成员

C++类中的成员可以是另一个类的对象，我们称该成员为 **对象成员**

- 当类中成员是其他类对象时，我们称该成员为 对象成员
- 构造的顺序是：先调用对象成员的构造，再调用本类构造
- 析构顺序与构造相反

**示例：**

```cpp
class Phone
{
public:
	Phone(string name)
	{
		m_PhoneName = name;
		cout << "Phone构造" << endl;
	}
	~Phone()
	{
		cout << "Phone析构" << endl;
	}
	string m_PhoneName;
};
class Person
{
public:
	//初始化列表可以告诉编译器调用哪一个构造函数
	Person(string name, string pName) :m_Name(name), m_Phone(pName)
	{
		cout << "Person构造" << endl;
	}
	~Person()
	{
		cout << "Person析构" << endl;
	}
	void playGame()
	{
		cout << m_Name << " 使用" << m_Phone.m_PhoneName << " 牌手机! " << endl;
	}
	string m_Name;
	Phone m_Phone;

};
void test01()
{
	//当类中成员是其他类对象时，我们称该成员为 对象成员
	//构造的顺序是 ：先调用对象成员的构造，再调用本类构造
	//析构顺序与构造相反
	Person p("张三" , "苹果X");
	p.playGame();
}
int main() {
	test01();
	return 0;
}
```

### 静态成员

**静态成员**就是在成员变量和成员函数前加上关键字`static`，称为静态成员

静态成员分为：

- **静态成员变量**
  - 所有对象共享同一份数据
  - 在编译阶段分配内存
  - `类内声明，类外初始化`
- **静态成员函数**
  - 所有对象共享同一个函数
  - 静态成员函数只能访问静态成员变量

> 和 Java 一样，可以使用 static 来声明类成员为静态的
> 当我们使用静态成员属性或者函数时候需要使用域运算符`::`

**示例1：静态成员变量**

```cpp
class Person
{
public:
	static int m_A; //静态成员变量
	//静态成员变量特点：
	//1 在编译阶段分配内存
	//2 类内声明，类外初始化
	//3 所有对象共享同一份数据
private:
	static int m_B; //静态成员变量也是有访问权限的
};
// 类外声明
int Person::m_A = 10;
int Person::m_B = 10;

void test01()
{
	//静态成员变量两种访问方式

	//1、通过对象
	Person p1;
	p1.m_A = 100;
	cout << "p1.m_A = " << p1.m_A << endl;

	Person p2;
	p2.m_A = 200;
	cout << "p1.m_A = " << p1.m_A << endl; //共享同一份数据
	cout << "p2.m_A = " << p2.m_A << endl;

	//2、通过类名
	cout << "m_A = " << Person::m_A << endl;
	//cout << "m_B = " << Person::m_B << endl; //私有权限访问不到
}
int main() {
	test01();
	return 0;
}
```

**示例2：静态成员函数**

```cpp
class Person
{
public:
	//静态成员函数特点：
	//1 程序共享一个函数
	//2 静态成员函数只能访问静态成员变量
	static void func()
	{
		cout << "func调用" << endl;
		m_A = 100;
		//m_B = 100; //错误，不可以访问非静态成员变量
	}
	static int m_A; //静态成员变量
	int m_B; // 
private:
	//静态成员函数也是有访问权限的
	static void func2()
	{
		cout << "func2调用" << endl;
	}
};
int Person::m_A = 10;
void test01()
{
	//静态成员变量两种访问方式

	//1、通过对象
	Person p1;
	p1.func();

	//2、通过类名
	Person::func();
	//Person::func2(); //私有权限访问不到
}
int main() {
	test01();
	return 0;
}
```

**示例3：单例**

```cpp
#ifndef Instance_hpp
#define Instance_hpp
#include <stdio.h>
class Instance {
private:
    static Instance* instance;
    Instance();
public:
    static Instance* getInstance();
};
#endif /* Instance_hpp */


// Instance.cpp
#include "Instance.hpp"
Instance* Instance::instance = 0;
Instance::Instance(){}

Instance* Instance::getInstance(){
    if (!instance) {
        instance = new Instance();
    }
    return instance;
};

// 调用
Instance::getInstance();
```

### 对象初始化

- 当我们编写了一个类并且到了我们实际开始使用该类的时候，就需要实例化它(除非它是完全静态的类)
- 实例化类有两种选择，这两种选择的区别是内存来自哪里，我们的对象实际上会创建在哪里。
- 应用程序会把内存分为两个主要部分：**堆**和**栈**。还有其他部分，比如源代码部分，此时它是机器码。

#### 栈分配

```cpp
// 栈中创建
Entity entity;
Entity entity("lk");
```

- 什么时候栈分配？几乎任何时候，因为在C++中这是初始化对象最快的方式和最受管控的方式。
- 什么时候不栈分配？ 如果创建的**对象太大**，或是需要显示地控制对象的**生存期**，那就需要堆上创建 。

#### 堆分配

```cpp
// 堆中创建
Entity* entity = new Entity("lk");
delete entity； //清除
```

- 当我们调用`new Entity`时，实际发生的就是我们在堆上分配了内存，我们调用了构造函数，然后这个new Entity实际上会返回一个Entity指针，它返回了这个entity在堆上被分配的内存地址，这就是为什么我们要声明成Entity*类型。
- 如果你使用了new关键字，那你就要用delete来进行清理。

## 构造&析构函数

### 构造函数

#### 构造函数概述

**构造函数语法：**`类名(){}`

1. 构造函数，没有返回值也不写void
2. 函数名称与类名相同
3. 构造函数可以有参数，因此可以发生重载
4. 程序在调用对象时候会自动调用构造，无须手动调用，而且只会调用一次

```cpp
class Entity {
public:
  int x, y;
  Entity(){}  // 不带参数
  Entity(int x, int y) : x(x), y(y) {}  // 带参数，用来初始化x和y

  void print()
  {
    std::cout << x << ',' << y << std::endl;
  }
};
```

- 如果你不指定构造函数，你仍然有一个构造函数，这叫做默认构造函数（default constructor），是默认就有的。但是，我们仍然可以删除该默认构造函数：

```cpp
class Log {
public:
    Log() = delete;  // 删除默认构造函数
    // ......
}
```

- 构造函数不会在你没有实例化对象的时候运行，所以如果你只是使用类的静态方法，构造函数是不会执行的。
- 当你用`new`关键字创建对象实例的时候也会调用构造函数。

#### default（C++ 11，生成默认构造器）

```cpp
class String
{
private:
    char *m_Buffer;
    uint32_t m_Size;

public:
    String() =  default; // default constructor
};
```

类中还定义了一个默认构造函数 `String() = default;`。这是 C++11 引入语法的一部分，表示您希望编译器生成默认的构造函数实现，即使您没有显式提供构造函数的定义。使用 `= default` 声明的默认构造函数将按如下方式初始化成员变量：

- 指针类型 (`m_Buffer`) 初始化为 `nullptr`。
- 内置类型 (`m_Size`) 不被初始化，其值是未定义的。

#### 构造函数的分类

**两种分类方式：**

- 按参数分为： 有参构造和无参构造
- 按类型分为： 普通构造和拷贝构造

**三种调用方式：**

- `括号法`
- `显示法`
- `隐式转换法`

```cpp
//1、构造函数分类
// 按照参数分类分为 有参和无参构造   无参又称为默认构造函数
// 按照类型分类分为 普通构造和拷贝构造

class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int a) {
		age = a;
		cout << "有参构造函数!" << endl;
	}
	//拷贝构造函数
	Person(const Person& p) {
		age = p.age;
		cout << "拷贝构造函数!" << endl;
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int age;
};

//2、构造函数的调用
//调用无参构造函数
void test01() {
	Person p; //调用无参构造函数
}

//调用有参的构造函数
void test02() {

	//2.1  括号法，常用
	Person p1(10);
	//注意1：调用无参构造函数不能加括号，如果加了编译器认为这是一个函数声明
	//Person p2();

	//2.2 显式法
	Person p2 = Person(10); 
	Person p3 = Person(p2);
	//Person(10)单独写就是匿名对象  当前行结束之后，马上析构

	//2.3 隐式转换法
	Person p4 = 10; // Person p4 = Person(10); 
	Person p5 = p4; // Person p5 = Person(p4); 

	//注意2：不能利用 拷贝构造函数 初始化匿名对象 编译器认为是对象声明
	//Person p5(p4);
}

int main() {

	test01();
	//test02();

	system("pause");

	return 0;
}
```

#### 拷贝构造函数和拷贝赋值运算符

**拷贝构造函数**（`Copy Constructor`）和**拷贝赋值运算符**（`Copy Assignment Operator`）都用于在 C++ 中创建一个类的对象副本，但它们的应用场景和行为有所不同。

C++中拷贝构造函数调用时机通常有三种情况

- 使用一个已经创建完毕的对象来初始化一个新对象
- 值传递的方式给函数参数传值
- 以值方式返回局部对象

**示例1：拷贝构造函数**

```cpp
class Person {
public:
	Person() {
		cout << "无参构造函数!" << endl;
		mAge = 0;
	}
	Person(int age) {
		cout << "有参构造函数!" << endl;
		mAge = age;
	}
	Person(const Person& p) {
		cout << "拷贝构造函数!" << endl;
		mAge = p.mAge;
	}
	//析构函数在释放内存之前调用
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int mAge;
};

//1. 使用一个已经创建完毕的对象来初始化一个新对象
void test01() {

	Person man(100); //p对象已经创建完毕
	Person newman(man); //调用拷贝构造函数
	Person newman2 = man; // 调用拷贝构造函数

	//Person newman3;
	//newman3 = man; //不是调用拷贝构造函数，赋值操作
}

//2. 值传递的方式给函数参数传值
//相当于Person p1 = p;
void doWork(Person p1) {}
void test02() {
	Person p; //无参构造函数
	doWork(p);
}

//3. 以值方式返回局部对象
Person doWork2()
{
	Person p1;
	cout << (int *)&p1 << endl;
	return p1;
}

void test03()
{
	Person p = doWork2();
	cout << (int *)&p << endl;
}
int main() {
	//test01();
	//test02();
	test03();
	return 0;
}
```

**示例2：拷贝构造函数和拷贝赋值运算符**

```cpp
class MyClass
{
private:
    int data;
public:
    MyClass(int a) : data(a)
    {
        std::cout << "MyClass Constructor" << std::endl;
    } // 在构造函数里分配了一块内存
    ~MyClass()
    {
        std::cout << "MyClass Destructor" << std::endl;
    } // 在析构函数里释放了这块内存

    // 拷贝构造函数
    MyClass(const MyClass &other) : data(0)
    {
        std::cout << "MyClass Copy Constructor" << std::endl;
        data = other.data;
    }
    // 拷贝赋值运算符
    MyClass &operator=(const MyClass &other)
    {
        if (this == &other)
        {
            std::cout << "MyClass Copy Assignment Operator(same object)" << std::endl;
            return *this;
        }
        std::cout << "MyClass Copy Assignment Operator" << std::endl;
        data = other.data;
        return *this;
    }
}
```

##### 拷贝构造函数

**拷贝构造函数的典型声明形式如下：**

```cpp
class MyClass {
public:
    MyClass(const MyClass& other); // other 是要“复制”的对象。
};
```

**拷贝构造函数调用时机：**

- 1、当你通过已存在的对象来初始化新对象的时候：

```cpp
MyClass original;
MyClass copy = original; // 调用复制构造函数
```

- 2、当函数作为**值传递**（如果是引用传递不会调用）参数时，传递给函数的参数将调用复制构造函数：

```cpp
void testFunc(MyClass c) // 这里会调用拷贝构造函数
{
}
void testFunc2(MyClass& c) // 这里会调用拷贝构造函数
{
}
```

- 3、当函数返回值为非引用类型时，返回值会调用复制构造函数：

```cpp
MyClass func() {
   MyClass local;
   return local; // returning 'local' calls the copy constructor
}
// 理论上，在函数返回时会调用拷贝构造函数将本地对象local复制到返回值中。然而，实际上，许多编译器会应用一种叫做返回值优化（`Return Value Optimization, RVO`）的技术来避免这种额外的复制。通过RVO，编译器可以构造返回值直接在调用函数的返回值空间，从而避免调用拷贝构造函数。
```

**C++11 移动语义优化：**

在 C++11 以及后续的标准中，进一步增加了 "`move semantics`"（移动语义），当编译器必须创建一个临时对象时（当 RVO 不适用的场合），它会使用 `移动构造函数` 来避免不必要的拷贝。因此，在支持 C++11 的编译器中，即使 RVO 没有发生，也可能会调用移动构造函数，而不是拷贝构造函数。

##### 拷贝赋值运算符

`拷贝赋值运算符`被用来将一个对象的所有值从另一个对象复制到当前对象中。如果对象已经存在，并且我们想要用另一个对象的数据来更新它，就会使用拷贝赋值运算符。

**拷贝赋值运算符的典型声明形式如下：**

```cpp
class MyClass {
public:
    MyClass& operator=(const MyClass& other);
};
```

- 1、当你将一个对象赋值给另一个已经初始化的对象时：

```cpp
MyClass object1;
MyClass object2;
object1 = object2; // 调用拷贝赋值运算符
//  注意：这里对象 object1 必须已经初始化，否则会调用复制构造函数。
```

- 2、当你以链式赋值的方式将多个对象赋值时

```cpp
MyClass object1, object2, object3;
object1 = object2 = object3; 
// 1. object2 = object3; 首先执行这个操作。此时，将调用 object2 的拷贝赋值运算符，用 object3 的值来更新 object2。
// 2. 接下来，执行 object1 = (object2 = object3);。因为拷贝赋值运算符的返回值是对 object2 的引用，所以现在 object1 的拷贝赋值运算符将被调用，用刚刚已被更新的 object2 的值来更新 object1。

// 因此，总共会有两次拷贝赋值运算符的调用。每次调用都会涉及复制数据从一个 MyClass 对象到另一个 MyClass 对象。
```

- 3、当你在有选择的情况下，例如在赋值运算符重载的函数内显式调用拷贝赋值运算符：

```cpp
MyClass object1(1), object2(2);
object1.operator=(object2); // 显示调用拷贝赋值运算符
```

通常`拷贝构造函数`和`拷贝赋值运算符`都定义了一个类如何进行对象之间的数据复制。在 C++11 之后，有了移动语义之后，如果编译器能确定一个对象是右值，它将优先调用移动构造函数和移动赋值运算符来提高性能。

拷贝赋值的经典**四步曲：**

以`s1 = s2`为例(s1、s2是两个字符串)：

- 第一步：**检测自我赋值**。（否则有可能导致未定义情况）
- 第二步：清理掉旧的资源：s1的数据。
- 第三步：为s1分配一块与s2一样大的内存空间
- 第四步：将s2拷贝到s1中。

```cpp
class Example {
private:
    int* data;

public:
    // 构造函数
    Example(int value) : data(new int(value)) {}

    // 拷贝构造函数
    Example(const Example& other) : data(new int(*other.data)) {
        std::cout << "调用了拷贝构造函数" << std::endl;
    }

    // 复制运算符
    Example& operator=(const Example& other) {
        if (this != &other) { // 避免自赋值
            delete data;  // 先删除旧的资源
            data = new int(*other.data); // 重新分配资源并复制数据
        }
        std::cout << "调用了复制运算符" << std::endl;
        return *this;
    }

    // 获取数据
    int getValue() const { return *data; }

    // 析构函数
    ~Example() {
        delete data; // 释放动态分配的资源
    }
};
```

##### 为什么需要定义拷贝构造函数和拷贝复制运算符

- class with pointer members 必须有拷贝构造和拷贝赋值，否则就会**造成浅拷贝**。
- 为了避免浅拷贝，所以要把指针所指的内容也要拷贝过来，这叫**深拷贝。**
- 需要在拷贝构造函数和拷贝复制运算符做深拷贝

#### 构造函数调用规则

默认情况下，C++编译器至少给一个类添加3个函数

1. 默认构造函数(无参，函数体为空)
2. 默认析构函数(无参，函数体为空)
3. 默认拷贝构造函数，对属性进行值拷贝

构造函数调用规则如下：

1. 如果用户定义有参构造函数，C++不在提供默认无参构造，但是会提供默认拷贝构造
2. 如果用户定义拷贝构造函数，C++不会再提供其他构造函数

```cpp
class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int a) {
		age = a;
		cout << "有参构造函数!" << endl;
	}
	//拷贝构造函数
	Person(const Person& p) {
		age = p.age;
		cout << "拷贝构造函数!" << endl;
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int age;
};

void test01()
{
	Person p1(18);
	//如果不写拷贝构造，编译器会自动添加拷贝构造，并且做浅拷贝操作
	Person p2(p1);

	cout << "p2的年龄为： " << p2.age << endl;
}

void test02()
{
	//如果用户提供有参构造，编译器不会提供默认构造，会提供拷贝构造
	Person p1; //此时如果用户自己没有提供默认构造，会出错
	Person p2(10); //用户提供的有参
	Person p3(p2); //此时如果用户没有提供拷贝构造，编译器会提供

	//如果用户提供拷贝构造，编译器不会提供其他构造函数
	Person p4; //此时如果用户自己没有提供默认构造，会出错
	Person p5(10); //此时如果用户自己没有提供有参，会出错
	Person p6(p5); //用户自己提供拷贝构造
}

int main() {

	test01();

	system("pause");

	return 0;
}
```

#### C++浅拷贝、深拷贝和拷贝构造函数

##### 拷贝本质

- 一个变量被赋值另一个变量时，**总是**在复制。在指针的情况下，你在复制指针，也就是内存地址，内存地址的数字，就是数字而已，而不是指针指向的实际内存。
- 类成员不包括指针和引用时，浅拷贝和深拷贝没区别。
- 浅拷贝只拷贝基本数据类型（非指针变量）

**浅拷贝和深拷贝：**

- 浅拷贝：简单的赋值拷贝操作
- 深拷贝：在堆区重新申请空间，进行拷贝操作

##### 浅拷贝带来的问题

**浅拷贝带来的问题：重复释放堆问题：**
浅拷贝的问题是如果对象中变量带有指针（或引用）, 则会发生错误. 因为两个指针指向同一个内存，一个对象修改, 另一个对象的值也被更改了。当在**析构**的时候, 会 **发生两次 free (double free)** 同一个内存，造成错误。

**案例1：**

```cpp
#include "CopyDemo.h"
#include "CopyDemo.h"
#include <iostream>

class String
{
private:
	char* m_Buffer; // 指向字符串的指针
	size_t m_Size; // 字符串的长度
public:
	String(const char* string) { // 构造函数
		std::cout << "Constructor" << std::endl;
		m_Size = strlen(string); // 计算字符串的长度，这样就可以把这个字符串的数据复制到缓冲区中
		m_Buffer = new char[m_Size + 1]; // 需要一个空终止符，所以+1.(也可以使用strcpy函数（拷贝时，包含了空终止字符）)
		memcpy(m_Buffer, string, m_Size); // 是把这个指针复制到我们实际的缓冲区中，这样缓冲区就会被我们的字符填充
		m_Buffer[m_Size] = 0; // 手动在最后添加自己的空终止符。不在上一行代码中写m_Size+1的原因是为了避免：char* string这个字符串不能正常的通过空终止符结束而造成错误。
	}
	~String() {
		std::cout << "Destructor" << std::endl;
		delete[] m_Buffer;
	}
	char& operator[](const int index) const { // [] 运算符重载
		return m_Buffer[index];
	}
	friend std::ostream& operator<<(std::ostream& stream, const String& string); // 输出运算符重载
};

std::ostream& operator<<(std::ostream& stream, const String& string) {
	stream << string.m_Buffer; // 访问不到m_Buffer，因为m_Buffer是私有的
	return stream;
}


void CopyDemo::testCopy() {
	String string = "hacket";
	String second = string;
	second[2] = 'a';
	std::cout << string << std::endl; // 运算符<<需要重载，不然报错
	std::cout << second << std::endl;
	std::cout << "testCopy end" << std::endl;
}
```

输出：

![image.png|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidianobsidian202404120013049.png)
问题：

1. 修改 `second[2]`，两个字符串都修改了
2. 析构函数调用了 2 次
3. 运行到 `std::cin.get();` 此时敲击回车键，**程序崩溃！**，我这是程序无响应

造成该错误的原因时：String 类中含有一个指针变量(`m_Buffer`)和一个 int 变量(`m_Char`)，复制字符串是，对这两个变量也进行了赋值，但对这个指针只复制了他的内存地址，于时此时由两个指针，**这两个指针指向同一个内存, 一个对象修改, 另一个对象的值也被更改了.** 并且，当在**析构**的时候, 会 **发生两次 free (double free)** 同一个内存，造成错误.。

为了解决这个问题，据需要使用**拷贝构造函数**。

**示例2：**

```cpp
class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int age ,int height) {
		cout << "有参构造函数!" << endl;
		m_age = age;
		m_height = new int(height);
	}
	//拷贝构造函数  
	Person(const Person& p) {
		cout << "拷贝构造函数!" << endl;
		//如果不利用深拷贝在堆区创建新内存，会导致浅拷贝带来的重复释放堆区问题
		m_age = p.m_age;
		m_height = new int(*p.m_height);
		
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
		if (m_height != NULL)
		{
			delete m_height;
		}
	}
public:
	int m_age;
	int* m_height;
};
void test01()
{
	Person p1(18, 180);
	Person p2(p1);
	cout << "p1的年龄： " << p1.m_age << " 身高： " << *p1.m_height << endl;
	cout << "p2的年龄： " << p2.m_age << " 身高： " << *p2.m_height << endl;
}
int main() {
	test01();
	return 0;
}
```

**如果属性有在堆区开辟的，一定要自己提供拷贝构造函数/复制运算符，防止浅拷贝带来的问题。**

##### 拷贝构造函数

拷贝构造函数是一个构造函数，当你复制第二个字符串时，它会被调用，当你把一个字符串赋值给一个对象时，这个对象也是一个字符串。当你试图创建一个新的变量并给它分配另一个变量时，它（这个变量）和你正在创建的变量有相同的类型。你复制这个变量，也就是所谓的拷贝构造函数。

解决：

```cpp
#include "CopyDemo.h"
#include "CopyDemo.h"
#include <iostream>

class String
{
private:
	char* m_Buffer; // 指向字符串的指针
	size_t m_Size; // 字符串的长度
public:
	String(const char* string) { // 构造函数
		std::cout << "Constructor" << std::endl;
		m_Size = strlen(string); // 计算字符串的长度，这样就可以把这个字符串的数据复制到缓冲区中
		m_Buffer = new char[m_Size + 1]; // 需要一个空终止符，所以+1.(也可以使用strcpy函数（拷贝时，包含了空终止字符）)
		memcpy(m_Buffer, string, m_Size); // 是把这个指针复制到我们实际的缓冲区中，这样缓冲区就会被我们的字符填充
		m_Buffer[m_Size] = 0; // 手动在最后添加自己的空终止符。不在上一行代码中写m_Size+1的原因是为了避免：char* string这个字符串不能正常的通过空终止符结束而造成错误。
	}

	String(const String& other) :m_Size(other.m_Size) { // 拷贝构造函数
		std::cout << "Copy Constructor " << std::endl;
		m_Buffer = new char[m_Size + 1]; // 分配一个新的缓冲区，大小和other一样
		memcpy(m_Buffer, other.m_Buffer, m_Size + 1); // 知道other的大小了，other字符串已经有了一个空终止字符，因为它是一个字符串，必须有空终止字符。
	} // 此函数为拷贝构造函数，new出一块内存，复制原来的数组

	~String() {
		std::cout << "Destructor" << std::endl;
		delete[] m_Buffer;
	}
	char& operator[](const int index) const { // [] 运算符重载
		return m_Buffer[index];
	}
	friend std::ostream& operator<<(std::ostream& stream, const String& string); // 输出运算符重载
};

std::ostream& operator<<(std::ostream& stream, const String& string) {
	stream << string.m_Buffer; // 访问不到m_Buffer，因为m_Buffer是私有的
	return stream;
}

void CopyDemo::testCopy() {
	String string = "hacket";
	String second = string; // 赋值时，会调用拷贝构造函数
	second[2] = 'a';
	std::cout << string << std::endl;
	std::cout << second << std::endl;
	std::cout << "testCopy end" << std::endl;
}
```

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidianobsidian202404120026198.png)

#### 单参数构造函数

在 C++ 中，构造函数（构造器，constructor）可细分为“非显式单参数构造函数（`non-explicit-one-argument ctor`）”和“显式单参数构造函数（`explicit-one-argument ctor`）”。关键区别在于它们是否允许在某些情况下进行隐式类型转换。

**总结来说，non-explicit 构造函数容许对象的隐式创建，而explicit 构造函数要求对象的显式创建。使用 explicit 关键字是一个良好的编程实践，它能够避免隐式转换带来的不明确性和潜在错误。在设计类时，应根据你是否希望允许构造函数被隐式调用来决定是否使用 explicit 关键字。**

##### 非显式单参数构造函数（Non-explicit One-Argument Constructor）

**定义：**
非显式的、只带一个参数的构造器允许编译器自动使用该类型的单个参数构造一个类对象。这意味着，在需要该类型对象的上下文中，提供正确类型的单一参数就足以调用构造函数，进行隐式类型转换。

**作用：**
把其他类型转换成class的类型。

**示例：**

```cpp
// 头文件
class MyClassOneArgCtor
{
public:
    MyClassOneArgCtor(int x);
private:
    int x;
};
// cpp文件
MyClassOneArgCtor::MyClassOneArgCtor(int x)
{
    this->x = x;
}
// 测试
// 非显式参数的构造函数测试
void test_non_explicit_args_ctor(MyClassOneArgCtor obj) // 传递对象，会调用 MyClassOneArgCtor 的构造函数，将 10 转换为 MyClassOneArgCtor 对象
{
    // Function implementation
    std::cout << "test_non_explicit_args_ctor" << std::endl;
}
// 非显式参数的构造函数测试
void test_non_explicit_args_ctor1(const MyClassOneArgCtor &obj) // 传递引用需要加 const，否则会报错，因为传递引用会修改对象，加 const 修饰后，不能修改对象
{
    // Function implementation
    std::cout << "test_non_explicit_args_ctor" << std::endl;
}
int main()
{
    MyClassOneArgCtor obj(10); // 10 会被转换为 MyClassOneArgCtor 对象
    test_non_explicit_args_ctor(10); // 10 会被转换为 MyClassOneArgCtor 对象，然后传入 test_non_explicit_args_ctor 函数
    test_non_explicit_args_ctor1(10); // 10 会被转换为 MyClassOneArgCtor 对象，然后传入 test_non_explicit_args_ctor 函数
    return 0;
}
```

`Test_non_explicit_args_ctor` 传递了一个 int 参数。因为 `MyClassOneArgCtor` 有一个非显式的单参数构造器，编译器将自动使用这个 int 值构造一个 `MyClassOneArgCtor` 对象。

##### 显式单参数构造函数（Explicit One-Argument Constructor）

使用 `explicit` 关键字修饰的单参数构造器阻止了编译器执行隐式类型转换。要使用这个构造器，必须显式地调用它（例如通过直接初始化或者使用类型转换语法）。

**示例：**

```cpp
class MyClass {
public:
    explicit MyClass(int value) {
        // Constructor implementation
    }
};

void function(MyClass obj) {
    // Function implementation
}

int main() {
    // 下面的代码将无法编译，因为构造函数是显式的
    // function(10); // Error: no matching function for call to 'function'
    function(MyClass(10)); // 必须显式调用构造函数
    return 0;
}
```

> 在这里，function(10) 会产生编译错误，因为 MyClass 的构造器是 explicit，不允许隐式转换。必须改为 function(MyClass(10))，这样编译器才能正确调用构造函数。

##### C++隐式转换与 `explicit` 关键字

隐式转换**只能进行一次**。

```cpp
#include <iostream>

class Entity
{
private:
	std::string m_Name;
	int m_Age;
public:
	Entity(const std::string& name)
		: m_Name(name), m_Age(-1) {}

	Entity(int age)
		: m_Name("Unknown"), m_Age(age) {}
};

void testExplicit() {
	Entity test1("lk");
	Entity test2(23);
	// Entity test3 = "lk"; //error!只能进行一次隐式转换 ： "初始化"无法从const char[3]"转换为"Entity"
	Entity test4 = std::string("lk"); // ok，需要是std:string
	Entity test5 = 23; //发生隐式转换
}
```

- 在 test 5 中，int 型的 23 就被隐式转换为一个 Entity 对象，这是**因为 Entity 类中有一个 Entity (int age)构造函数，因此可以调用这个构造函数，然后把 23 作为他的唯一参数，就可以创建一个 Entity 对象。**
- 同时我们也能看到，对于语句 `Entity test3 = "lk";` 会报错，原因是**只能进行一次隐式转换**，`"lk"` 是 `const char` 数组，这里需要先转换为 `std::string`，再从 string 转换为 Entity 变量，两次隐式转换是不行的，所以会报错。但是写为 `Entity test4 = std::string("lk");` 就可以进行隐式转换。
- 最好不写 `Entity test5 = 23;` 这样的函数，<font color="#92d050">应尽量避免隐式转换</font>。因为 `Entity test2(23);` 更清晰。

###### `explicit` 关键字

- Explicit 是用来当你想要显示地调用构造函数，而不是让 C++编译器隐式地把任何整形转换成 Entity
- 我有时会在数学运算库的地方用到 explicit，因为我不想把数字和向量来比较
- 如果你在构造函数前面加上 explicit，这意味着这个构造函数不会进行隐式转换
- 如果你想用一个整数构造一个 Entity 对象，那你就必须显示的调用这个构造函数，**explicit 会禁用隐式转换**，explicit 关键字放在构造函数前面
- 一般 explicit 很少用到

```cpp
#include <iostream>
class Ent~ity
{
private:
	std::string m_Name;
	int m_Age;
public:
	Entity(const std::string& name) : m_Name(name), m_Age(-1) {}
	
	explicit Entity(int age) : m_Name("Unknown"), m_Age(age) {} //声明为explicit
	};

int main()
{
	Entity test1("lk");
	Entity test2(23); 
	Entity test3 = "lk"; 
	Entity test4 = std::string("lk");
	Entity test5 = 23; //error！禁用隐式转换

	std::cin.get();
}
```

加了 `explicit` 后还想隐式转换，则可以：

```cpp
Entity test5 = (Entity)23; //ok
```

### 类的析构函数

- 析构函数是在你销毁一个对象的时候运行。
- 析构函数同时适用于栈和堆分配的内存；析构函数调用时机
  - 如果你用 new 关键字创建一个对象（存在于堆上），然后你调用 `delete`，析构函数就会被调用。
  - 如果你只有基于`栈`的对象，当`跳出作用域`的时候这个对象会被删除，所以这时侯析构函数也会被调用。
- 构造函数和析构函数在声明和定义的唯一区别就是放在析构函数前面的波形符（`~`）
- 因为这是栈分配的，我们会看到当main函数执行完的时候析构函数就会被调用
- **析构函数没有参数，不能被重载**，因此一个类只能有一个析构函数。
- 不显式的定义析构函数系统会调用默认析构函数

> 类的析构函数是类的一种特殊的成员函数，它会在每次删除所创建的对象时执行(不需要手动调用)。

**示例：**

- `Student.h`

```cpp
// #pragma once // This is a preprocessor directive that tells the compiler to include the header file only once in the compilation. It is a non-standard but widely supported feature.

// 也可以用下面的方式：
#ifndef PROJECT1_STUDENT_H
#define PROJECT1_STUDENT_H

#include <string>
using namespace std;

class Student
{
private:
	int num;
	string name;
	char gender;
public:
	Student();
	Student(int num, string name, char gender);
	~Student();
	void display();
};

#endif // PROJECT1_STUDENT_H
```

- `Student.cpp`

```cpp
#include "Student.h"
#include <iostream>
using namespace std;

// 无参构造方法
Student::Student() : num(-1), name("None"), gender('N'){}

// 有参构造方法
Student::Student(int num, string name, char g) : num(num), name(name), gender(g) {
	cout << "执行构造函数: " << "Welcome, " << name << "-" << num << "-" << g << "-" << endl;
}

void Student::display() {
	cout << "学号: " << num << ", 姓名: " << name << ", 性别";
	cout << endl;
}

// 析构方法
Student::~Student() {
	cout << "执行析构函数: " << "Bye bye, " << name << endl;
}
```

- `main.cpp` 测试

```cpp
#include "Student.h"
#include <iostream>
using namespace std;
void testStudent() {
	cout << "testStudent" << endl;
	Student s1(1, "张三", 'M');
	Student s2(2, "李四", 'F');
	s1.display();
	s2.display();
	// 栈结束，会调用析构函数
}

int main()
{
	// 测试栈上创建对象
	// testStudent();

	// 测试New
	Student* student = new Student(1, "张三", 'M');
	student->display();
	// 释放
	delete student;
	student = 0;

	std::cin.get();
	return 0;
}
```

## C++对象模型

### 成员变量和成员函数分开存储

在C++中，类内的成员变量和成员函数分开存储

只有非静态成员变量才属于类的对象上

**示例：**

```cpp
#include <iostream>

class Person
{
public:
    int mA;
    static int mB;
    int mC;
    Person()
    {
        mA = 0;
    }
    void func()
    {
        std::cout << "mA: " << mA << std::endl;
        std::cout << "mB: " << mB << std::endl;
    }
    static void sfunc()
    {
        // std::cout << "mA: " << mA << std::endl; // Error
        std::cout << "mB: " << mB << std::endl;
    }
};
// 静态成员类外声明
int Person::mB = 1;

int main()
{
    std::cout << "Person::mB: " << Person::mB << std::endl; // 1
    std::cout << sizeof(Person) << std::endl; // 8，因为有静态成员变量不占用类的大小，只占用内存；函数也不占用类的大小，只占用内存，所以只有两个int型成员变量，所以大小为8
    return 0;
}
```

每一个非静态成员函数只会诞生一份函数实例，也就是说多个同类型的对象会共用一块代码；C++通过提供特殊的对象指针，this 指针，**this 指针指向被调用的成员函数所属的对象** ，来解决是哪个对象调用了函数

### const修饰成员函数

**const函数：**

- 成员函数后加`const`后我们称为这个函数为**常函数**
- 常函数内不可以修改成员属性
- 成员属性声明时加关键字`mutable`后，在常函数中依然可以修改

**const对象：**

- 声明对象前加`const`称该对象为常对象
- 常对象只能调用常函数

```cpp
class Person {
public:
	Person() {
		m_A = 0;
		m_B = 0;
	}
	//this指针的本质是一个指针常量，指针的指向不可修改
	//如果想让指针指向的值也不可以修改，需要声明常函数
	void ShowPerson() const {
		//const Type* const pointer;
		//this = NULL; //不能修改指针的指向 Person* const this;
		//this->mA = 100; //但是this指针指向的对象的数据是可以修改的

		//const修饰成员函数，表示指针指向的内存空间的数据不能修改，除了mutable修饰的变量
		this->m_B = 100;
	}
	void MyFunc() const {
		//mA = 10000;
	}
public:
	int m_A;
	mutable int m_B; //可修改 可变的
};
//const修饰对象  常对象
void test01() {
	const Person person; //常量对象  
	cout << person.m_A << endl;
	//person.mA = 100; //常对象不能修改成员变量的值,但是可以访问
	person.m_B = 100; //但是常对象可以修改mutable修饰成员变量

	//常对象访问成员函数
	person.MyFunc(); //常对象不能调用const的函数
}
int main() {
	test01();
	return 0;
}
```

## 友元类和友元函数

### 友元概念

在程序里，有些私有属性 也想让类外特殊的一些函数或者类进行访问，就需要用到友元的技术

友元的目的：就是让一个函数或者类访问另一个类中私有成员

友元的关键字为：**friend**

### 友元分类

友元的三种实现：

- 全局函数做友元
- 类做友元
- 成员函数做友元

#### 全局函数做友元

```cpp
class Building
{
	//告诉编译器 goodGay全局函数 是 Building类的好朋友，可以访问类中的私有内容
	friend void goodGay(Building * building);
public:
	Building()
	{
		this->m_SittingRoom = "客厅";
		this->m_BedRoom = "卧室";
	}
public:
	string m_SittingRoom; //客厅
private:
	string m_BedRoom; //卧室
};
void goodGay(Building * building)
{
	cout << "好基友正在访问： " << building->m_SittingRoom << endl;
	cout << "好基友正在访问： " << building->m_BedRoom << endl;
}
void test01()
{
	Building b;
	goodGay(&b);
}
int main(){
	test01();
	return 0;
}
```

#### 类做友元

```cpp
class Building;
class goodGay
{
public:
	goodGay();
	void visit();
private:
	Building *building;
};

class Building
{
	//告诉编译器 goodGay类是Building类的好朋友，可以访问到Building类中私有内容
	friend class goodGay;
public:
	Building();

public:
	string m_SittingRoom; //客厅
private:
	string m_BedRoom;//卧室
};

Building::Building()
{
	this->m_SittingRoom = "客厅";
	this->m_BedRoom = "卧室";
}

goodGay::goodGay()
{
	building = new Building;
}

void goodGay::visit()
{
	cout << "好基友正在访问" << building->m_SittingRoom << endl;
	cout << "好基友正在访问" << building->m_BedRoom << endl;
}

void test01()
{
	goodGay gg;
	gg.visit();
}

int main(){
	test01();
	return 0;
}
```

#### 成员函数做友元

```cpp
class Building;
class goodGay
{
public:
	goodGay();
	void visit(); //只让visit函数作为Building的好朋友，可以发访问Building中私有内容
	void visit2(); 
private:
	Building *building;
};

class Building
{
	//告诉编译器  goodGay类中的visit成员函数 是Building好朋友，可以访问私有内容
	friend void goodGay::visit();
public:
	Building();
public:
	string m_SittingRoom; //客厅
private:
	string m_BedRoom;//卧室
};

Building::Building()
{
	this->m_SittingRoom = "客厅";
	this->m_BedRoom = "卧室";
}
goodGay::goodGay()
{
	building = new Building;
}
void goodGay::visit()
{
	cout << "好基友正在访问" << building->m_SittingRoom << endl;
	cout << "好基友正在访问" << building->m_BedRoom << endl;
}
void goodGay::visit2()
{
	cout << "好基友正在访问" << building->m_SittingRoom << endl;
	//cout << "好基友正在访问" << building->m_BedRoom << endl;
}
void test01()
{
	goodGay  gg;
	gg.visit();
}
int main(){
	test01();
	return 0;
}
```

**示例：**
`Student.hpp`

```c
#ifndef Student_hpp
#define Student_hpp

#include <stdio.h>
#include <iostream>
using namespace std;

class Student
{
    friend class Teacher; // 友元类
    friend void st(Student*); // 友元函数
public:
    Student(int i, int j);
    ~Student();
    void setName(char *_name) const {
        //错误 不能修改name 去掉const之后可以
        // name = _name;
    }
private:
    int j;
protected:
    int k = 1;
public:
    int l = 0;
    char *name;
};

class Teacher {
public:
    void call(Student *stu) {
        // 能够使用student中私有的j属性
        stu->j = 10;
        cout << "call:" << stu->j <<endl;
    }
};

#endif /* Student_hpp */
```

`main.cpp`

```c
Student *stu = new Student(1,2);
Teacher teacher;
teacher.call(stu);
```

### 友元函数

因为友元函数没有this指针，则参数要有三种情况： 

- 要访问非 static 成员时，需要对象做参数

- 要访问 static 成员或全局变量时，则不需要对象做参数

- 如果做参数的对象是全局对象，则不需要对象做参数

可以直接调用友元函数，不需要通过对象或指针；一个没有参数并且是某个类的友元函数，那么它实质上是一个普通的非成员函数，而不是一个类方法。友元函数没有参数意味着它不会从调用者那里获取任何信息，因此它无法访问任何特定对象的非静态成员。

**示例:**

```cpp
// 头文件
class MyClassOneArgCtor
{
public:
    MyClassOneArgCtor(int x);
    friend void print(); // 没有参数，不需要传入对象，和普通函数一样
    friend void print2(MyClassOneArgCtor &obj); // 友元函数，传入对象是引用，可以修改对象的值
    friend void print3(MyClassOneArgCtor *obj); // 友元函数，传入对象是指针，可以修改对象的值

private:
    int x;
};
// cpp文件
#include <iostream>
#include "MyClassOneArgCtor.h"

MyClassOneArgCtor::MyClassOneArgCtor(int x)
{
    this->x = x;
}

// print 函数的实现
void print()
{
    std::cout << "print" << std::endl;
}

// 注意由于 print 是友元函数，它可以访问 MyClassOneArgCtor 的私有成员 x
void print2(MyClassOneArgCtor &obj)
{
    obj.x = 100; // 可以修改 obj 的私有成员 x
    std::cout << "print2 x = " << obj.x << std::endl;
}

// 注意由于 print3 是友元函数，它可以访问 MyClassOneArgCtor 的私有成员 x
void print3(MyClassOneArgCtor *obj)
{
    obj->x = 200; // 可以修改 obj 的私有成员 x
    std::cout << "print3 x = " << obj->x << std::endl;
}

// 测试
void test_friend()
{
    MyClassOneArgCtor obj(10);
    // print();
    print2(obj);
    print3(&obj);
}

```

## C++重载函数

> C++ 允许在同一作用域中的某个**函数**和**运算符**指定多个定义，分为**函数重载**和**运算符重载**。

### 函数重载

```c
void print(int i) {
	cout << "整数为: " << i << endl;
}
 
void print(double  f) {
	cout << "浮点数为: " << f << endl;
}
```

### 运算符重载

> C允许重定义或重载大部分 C 内置的运算符
>
> 函数名是由关键字 operator 和其后要重载的运算符符号构成的
>
> 重载运算符可被定义为普通的非成员函数或者被定义为类成员函数

> 允许重载的运算符

| 类型      | 运算符                                             |                                               |
| ------- | ----------------------------------------------- | --------------------------------------------- |
| 关系运算符   | ==(等于)，!= (不等于)，< (小于)，> (大于>，<=(小于等于)，>=(大于等于) |                                               |
| 逻辑运算符   |                                                 | (逻辑或)，&&(逻辑与)，!(逻辑非)                          |
| 单目运算符   | + (正)，-(负)，*(指针)，&(取地址)                         |                                               |
| 自增自减运算符 | ++(自增)，--(自减)                                   |                                               |
| 位运算符    |                                                 | (按位或)，& (按位与)，~(按位取反)，^(按位异或),，<< (左移)，>>(右移) |
| 赋值运算符   | =, +=, -=, *=, /= , % = , &=,                   | =, ^=, <<=, >>=                               |
| 空间申请与释放 | new, delete, new[ ] , delete[]                  |                                               |
| 其他运算符   | ()(函数调用)，->(成员访问)，,(逗号)，                        |                                               |

1. 在类中**成员函数**重载运算符

```c
class Test1 {
public:
    Test1(){}
	//定义成员函数进行重载
    //返回对象   调用拷贝构造函数  释放函数内 t 对象
    //引用类型(Test1&) 没有复制对象 返回的是 t 对象本身 t会被释放 所以会出现问题(数据释放不彻底就不一定)
    // 可以输出 t 与 t3 地址查看
	Test1 operator+(const Test1& t1) {
		Test1 t;
		t.i = this->i + t1.i;
		return t;
	}
    //拷贝构造函数 (有默认的) 
    Test1(const Test1& t){
        //浅拷贝
		this->i = t.i;
		cout << "拷贝" << endl;
        //如果动态申请内存 需要深拷贝
	};
	int i;
};

Test1 t1;
Test1 t2;
t1.i = 100;
t2.i = 200;
//发生两次拷贝
// C++真正的临时对象是不可见的匿名对象
//1、拷贝构造一个无名的临时对象，并返回这个临时对象
//2、由临时对象拷贝构造对象 t3
//语句结束析构临时对象
Test1 t3 = t1 + t2;
cout << t3.i << endl;
```

> Xcode上玩，使用的G!++编译器会进行 **返回值优化(RVO、NRVO)** 从而看不到拷贝构造函数的调用。
>
> 可以加入 "`-fno-elide-constructors`" 取消GNU g++优化
>
> 对Windows vs编译器cl.exe无效，VS Debug执行RVO，Release执行NRVO
>
> RVO（Return Value Optimization）:消除函数返回时创建的临时对象
>
> NRVO(Named Return Value Optimization)：属于 RVO 的一种技术, 直接将要初始化的对象替代掉返回的局部对象进行操作。

![](https://note.youdao.com/src/WEBRESOURCE8a0a4c334487a2c30f7e23a68d211127#id=TcgZR&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

2. 在类外**非成员函数**重载运算符

```c
class Test2 {
public:
	int i;
};
//定义非成员函数进行 + 重载
Test2 operator+(const Test2& t21, const Test2& t22) {
	Test2 t;
	t.i = t21.i + t22.i;
	return t;
}

Test2 t21;
Test2 t22;
t21.i = 100;
t22.i = 200;
Test2 t23 = t21 + t22;
cout << t23.i << endl;
```

## C++的对象生存期（栈作用域生存期）

**基于栈的变量在我们离开作用域的时候就会被摧毁，内存被释放**。在堆上创建的，当程序结束后才会被系统摧毁。

### 局部作用域创建数组的经典错误

例如：返回一个在作用域内创建的数组

如下代码，因为我们没有使用new关键字，所以他不是在堆上分配的，我们只是在栈上分配了这个数组，当我们返回一个指向他的指针时(`return array`)，也就是返回了一个指向栈内存的指针，旦离开这个作用域（CreateArray函数的作用域），这个栈内存就会被回收

```cpp
int CreateArray()
{
    int array[50];  //在栈上创建的
    return array; // array离开 {}，array就释放了
}
int main()
{
    int* a = CreateArray(); // 不能正常工作
}
```

如果你想要像这样写一个函数，那你一般有**两个选择**：

1. 在堆上分配这个数组，这样他就会一直存在:

```cpp
int CreateArray()
{
    int* array = new int[50];  //在堆上创建的
    return array;
}
```

2. 将创建的数组赋值给一个在这个作用域外的变量

> 比如说，我在这里创建一个大小为50的数组，然后把这个数组作为一个参数传给这个函数，当然在这个 CreateArray 函数里就不需要再创建数组了，但是我们可以对传入的数组进行操作，比如，填充数组，因为我们只是闯入了一个指针，所以不会做分配的操作。

```cpp
int CreateArray(int* array)
{
//填充数组
}
int main()
{
   int array[50];
    CreateArray(array); //不能正常工作
}
```

### 基于栈的变量的好处

- 可以帮助我们自动化代码。 比如类的作用域，比如像智能指针`smart_ptr`，或是`unique_ptr`，这是一个作用域指针，或者像作用域锁（`scoped_lock`）。
- 最简单的例子可能是作用域指针，它基本上是一个类，它是一个指针的包装器，在构造时用堆分配指针，然后在析构时删除指针，所以我们可以自动化这个new和delete。

> 创建Entity对象时，我还是想在堆上分配它，但是我想要在跳出作用域时自动删除它，这样能做到吗？我们可以使用标准库中的作用域指针unique_ptr实现。

如下，ScopedPtr 就是我们写的一个最基本的作用域指针，由于其是在栈上分配的，然后作用域结束的时候，ScopedPtr 这个类就被析构，析构中我们又调用 delete 把堆上的指针删除内存。

```cpp
#include <iostream>

class Entity
{
private:

public:
    Entity()
    {
        std::cout << "Create!" << std::endl;
    }
    ~Entity()
    {
        std::cout << "Destroy!" << std::endl;
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
};

int main()
{
    {
		ScopedPtr test = new Entity();  //发生隐式转换。虽然这里是new创建的，但是不同的是一旦超出这个作用域，他就会被销毁。因为这个ScopedPtr类的对象是在栈上分配的
    }

    std::cin.get();
}
```
