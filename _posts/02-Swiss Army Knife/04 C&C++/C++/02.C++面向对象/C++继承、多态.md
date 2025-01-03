---
date created: 2024-04-08 08:33
date updated: 2024-12-27 23:51
tags:
  - '#include'
dg-publish: true
---

# C++继承

## 继承概念

- 当你创建了一个子类，它会包含父类的一切
- 派生类是通过对基类进行修改和扩充得到的，在派生类中，可以扩充新的成员变量和成员函数。
- 派生类拥有基类的全部成员函数和成员变量，不论是 `private`、`protected`、`public`；需要注意的是：在派生类的各个成员函数中，不能访问基类的 `private` 成员。

**继承的格式**：

```cpp
class 派生类名：public 基类名
{
};
```

C++继承用 `:` 符号表示，Java 中用 `extends` 关键字不同；默认为 private 继承，外部使用不能访问父类为 `public` 和 `protected` 的成员，都当成是 `private` 的了，只能访问派生类的成员，如果需要访问需要 `class 派生类 : public 父类`。

**示例：**

```c
#include <iostream>
class Entity
{
    int name;
public:
    float x, y;
    void move(float xa, float ya)
    {
        x += xa;
        y += ya;
    }
};

class Player :  public Entity
{
public:
    const char* Name;
    //  float x,y;    //因为是派生类，所以这些是重复代码，只保留新代码即可
    //  void() move(float xa, float ya)
    //  {
    //      x += xa;
    //     y += ya;
    // }
    void printName()   //在派生类中，可以扩充新的成员变量和成员函数
    {
        move(1, 1);
        std::cout << Name << std::endl;
    }
};

int main() {
    Player player;
    player.move(5, 5); // 继承不加修饰符，默认是private，继承加修饰符public，可以访问
    player.printName();

    Entity* p = new Player;
    p->move(5, 5);
    // p->printName(); // 子类新增的，父类没有的，不能访问
}
```

- 这个Player类不再仅仅只是Player类型，它也是Entity类型，就是说它**同时是这两种类型**。意思是我们可以在**任何想要用Entity的地方使用Player**
- Player总是Entity的一个超集，它拥有Entity的所有内容。
- 因为对于Player来说，在Entity中任何**不是私有**的（private）成员，Player都可以**访问**到

## 继承方式

**继承方式一共有三种：**

- 公共继承
- 保护继承
- 私有继承，默认

![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202404300120366.png)

**示例：**

```cpp
class Base1
{
public: 
	int m_A;
protected:
	int m_B;
private:
	int m_C;
};

// 公共继承
class Son1 : public Base1
{
public:
	void func()
	{
		m_A; //可访问 public权限
		m_B; //可访问 protected权限
		//m_C; //不可访问
	}
};

void myClass()
{
	Son1 s1;
	s1.m_A; //其他类只能访问到公共权限
}

// 保护继承
class Base2
{
public:
	int m_A;
protected:
	int m_B;
private:
	int m_C;
};
class Son2 : protected Base2
{
public:
	void func()
	{
		m_A; //可访问 protected权限
		m_B; //可访问 protected权限
		//m_C; //不可访问
	}
};
void myClass2()
{
	Son2 s;
	//s.m_A; //不可访问
}

//私有继承
class Base3
{
public:
	int m_A;
protected:
	int m_B;
private:
	int m_C;
};
class Son3 : private Base3
{
public:
	void func()
	{
		m_A; //可访问 private权限
		m_B; //可访问 private权限
		//m_C; //不可访问
	}
};
class GrandSon3 :public Son3
{
public:
	void func()
	{
		//Son3是私有继承，所以继承Son3的属性在GrandSon3中都无法访问到
		//m_A;
		//m_B;
		//m_C;
	}
};
```

父类中私有成员也是被子类继承下去了，只是由编译器给隐藏后访问不到

## 子类行为

### 继承中构造和析构顺序

子类继承父类后，当创建子类对象，也会调用父类的构造函数

先调用父类构造函数，再调用子类构造函数，析构顺序与构造相反

### 继承同名成员处理方式

1. 子类对象可以直接访问到子类中同名成员
2. 子类对象加作用域可以访问到父类同名成员
3. 当子类与父类拥有同名的成员函数，子类会隐藏父类中同名成员函数，加作用域可以访问到父类中同名函数

**示例：**

```cpp
class Base {
public:
	Base()
	{
		m_A = 100;
	}

	void func()
	{
		cout << "Base - func()调用" << endl;
	}

	void func(int a)
	{
		cout << "Base - func(int a)调用" << endl;
	}

public:
	int m_A;
};


class Son : public Base {
public:
	Son()
	{
		m_A = 200;
	}

	//当子类与父类拥有同名的成员函数，子类会隐藏父类中所有版本的同名成员函数
	//如果想访问父类中被隐藏的同名成员函数，需要加父类的作用域
	void func()
	{
		cout << "Son - func()调用" << endl;
	}
public:
	int m_A;
};

void test01()
{
	Son s;

	cout << "Son下的m_A = " << s.m_A << endl;
	cout << "Base下的m_A = " << s.Base::m_A << endl;

	s.func();
	s.Base::func();
	s.Base::func(10);

}
int main() {
	test01();
	return 0;
}
```

### 继承同名静态成员处理方式

静态成员和非静态成员出现同名，处理方式一致

- 访问子类同名成员 直接访问即可
- 访问父类同名成员 需要加作用域

> 总结：同名静态成员处理方式和非静态处理方式一样，只不过有两种访问的方式（通过对象和通过类名）

**示例：**

```cpp
class Base {
public:
	static void func()
	{
		cout << "Base - static void func()" << endl;
	}
	static void func(int a)
	{
		cout << "Base - static void func(int a)" << endl;
	}

	static int m_A;
};

int Base::m_A = 100;

class Son : public Base {
public:
	static void func()
	{
		cout << "Son - static void func()" << endl;
	}
	static int m_A;
};

int Son::m_A = 200;

//同名成员属性
void test01()
{
	//通过对象访问
	cout << "通过对象访问： " << endl;
	Son s;
	cout << "Son  下 m_A = " << s.m_A << endl;
	cout << "Base 下 m_A = " << s.Base::m_A << endl;

	//通过类名访问
	cout << "通过类名访问： " << endl;
	cout << "Son  下 m_A = " << Son::m_A << endl;
	cout << "Base 下 m_A = " << Son::Base::m_A << endl;
}

//同名成员函数
void test02()
{
	//通过对象访问
	cout << "通过对象访问： " << endl;
	Son s;
	s.func();
	s.Base::func();

	cout << "通过类名访问： " << endl;
	Son::func();
	Son::Base::func();
	//出现同名，子类会隐藏掉父类中所有同名成员函数，需要加作作用域访问
	Son::Base::func(100);
}
int main() {
	//test01();
	test02();
	return 0;
}
```

## 多继承

C++允许**一个类继承多个类**。

**多继承语法：**

```cpp
class <派生类名>:<继承方式1><基类名1>, <继承方式2><基类名2>, …
```

多继承可能会引发父类中有同名成员出现，需要加作用域区分。

**C++实际开发中不建议用多继承**

**多继承示例1：**

```c
class Parent {
public:
    Parent(){
        cout<< "Parent构造函数" <<endl;
    }
    void test() {
         cout<< "Parent test" <<endl;
    }
};
class Parent1 {
public:
    Parent1(){
        cout<< "Parent1构造函数" <<endl;
    }
    void test() {
        cout<< "Parent1 test" <<endl;
    }
};
class Child : public Parent , public Parent1 {
public:
    Child(){
        cout<< "Child构造函数" <<endl;
    }
    void test() {
        Parent::test();
        Parent1::test(); // 相当于Java中的super
        cout<< "Child test" <<endl;
    }
};
```

**多继承示例2：**

```cpp
class Base1 {
public:
	Base1()
	{
		m_A = 100;
	}
public:
	int m_A;
};

class Base2 {
public:
	Base2()
	{
		m_A = 200;  //开始是m_B 不会出问题，但是改为mA就会出现不明确
	}
public:
	int m_A;
};

//语法：class 子类：继承方式 父类1 ，继承方式 父类2 
class Son : public Base2, public Base1 
{
public:
	Son()
	{
		m_C = 300;
		m_D = 400;
	}
public:
	int m_C;
	int m_D;
};
//多继承容易产生成员同名的情况
//通过使用类名作用域可以区分调用哪一个基类的成员
void test01()
{
	Son s;
	cout << "sizeof Son = " << sizeof(s) << endl;
	cout << s.Base1::m_A << endl;
	cout << s.Base2::m_A << endl;
}
int main() {
	test01();
	return 0;
}
```

### 菱形继承

**菱形继承概念：**
C++ 中的多继承允许一个类继承自多个基类。然而，当两个或以上的基类都继承自同一个公共基类时，就会产生所谓的“菱形继承”（也称为“钻石继承”）问题。

**典型的菱形继承案例：**

```cpp
 A
B C
 D
```

> 其中，A 是一个基类，B 和 C 都继承自 A，而 D 同时继承自 B 和 C。如果类 A 有一个成员变量 a，那么在 D 中就会存在两个 a 的副本：一个来自 B 的路径，一个来自 C 的路径。当你访问 D 中的 a 时，编译器就不知道应该使用哪一个，因为存在歧义。

**菱形继承问题：**

- 成员变量的二义性。
- 不必要的资源浪费，因为来自基类 A 的数据成员在派生类 D 中存在着多个副本。
- 如果基类 A 的变量被修改了，那么 B 和 C 的副本可能不会被同时更新，导致数据的不一致性。

**示例 ：存在菱形继承问题**

```cpp
#include <iostream>

class A
{
public:
    int a;
};

class B : public A
{
};

class C : public A
{
};

class D : public B, public C
{
};

int main()
{
    D *d = new D;
    d->a = 10;    // "D::a" is ambiguou
    int a = d->a; // "D::a" is ambiguous
    delete d;
    return 0;
}
```

### 虚继承

- 菱形继承带来的主要问题是子类继承两份相同的数据，导致资源浪费以及毫无意义
- 利用**虚继承**可以解决菱形继承问题

**示例：virtual 解决菱形继承问题**

```cpp
#include <iostream>

class A
{
public:
    int a;
};

class B : virtual public A
{
    // ...
};

class C : virtual public A
{
    // ...
};

class D : public B, public C
{
    // D 现在只有一个 a 的副本
};

int main()
{
    D *d = new D;
    d->a = 10; // OK
    delete d;
    return 0;
}
```

在这段代码中，B 和 C 都是通过 `virtual` 关键字从 A 虚继承。这表示 B 和 C 是共享对 A 的单个实例，而不是拥有各自的实例。因此，当 D 从 B 和 C 继承时，它会创建一个共享的 A 基类部分，避免出现成员变量的二义性和数据不一致问题。

使用虚继承，必须有一些特殊的规则：

- 基类 A 的构造器和析构器的调用行为会有所不同。
- 虚基类的初始化由最底层的派生类负责，即要在 D 的构造函数的初始化列表中初始化 A。

**示例：**

```cpp
#include <iostream>

class A {
public:
    A(int value) : a(value) {
        std::cout << "Constructing A with value " << a << std::endl;
    }
    int a;
};

class B : virtual public A {
public:
    B(int value) : A(value) {
        std::cout << "Constructing B" << std::endl;
    }
};

class C : virtual public A {
public:
    C(int value) : A(value) {
        std::cout << "Constructing C" << std::endl;
    }
};

class D : public B, public C {
public:
    // 注意在这里，D 必须调用 A 的构造函数，即使 B 和 C 都是从 A 虚继承
    // 此处的 value 会被用于初始化虚基类 A
    D(int value) : A(value), B(value), C(value) {
        std::cout << "Constructing D" << std::endl;
    }
};

int main() {
    D d(10);
    std::cout << "Value of a in D: " << d.a << std::endl;
    return 0;
}
// Constructing A with value 10
// Constructing B
// Constructing C
// Constructing D
// Value of a in D: 10
```

> D 构造函数的初始化列表中的顺序是重要的：虚基类 A 必须首先被初始化，接下来是 B 和 C。这确保了 A 的成员 a 只被初始化一次，并且 D 对象中只有一个 A 的副本。这就是如何解决多继承中的菱形继承问题，同时确保了虚基类构造函数的适当调用。

注意以下几点：

- A 是基类，它有一个接受 int 参数的构造函数。
- B 和 C 都虚继承自 A。它们在自己的构造函数中调用 A 的构造函数。
- D 直接继承 B 和 C。在 D 的构造函数中，它负责初始化虚基类 A。尽管 B 和 C 构造函数也调用了 A 的构造函数，但在虚继承中，最底部的派生类（在这个例子中是 D）负责构造虚基类的实例。因此，D 构造函数中的 A (value) 是必需的，并且 value 会被用来初始化 A。
- D 的对象 d 最终只有一个 A 部分，D 中的 a 不会有歧义。

# C++虚函数，纯虚函数

## 虚函数(`Virtual Function`)

### 什么是虚函数？

**虚函数是允许在派生类中被重写的基类函数。** 当你通过基类的指针或引用调用一个虚函数时，将会执行调用对象实际类型的函数版本，即使指针或引用的类型是基类。这种行为称为**动态绑定**或晚期绑定。

虚函数使得派生类能够更改或扩展基类的行为。在基类中声明函数为虚函数，需要在函数声明前使用 `virtual` 关键字。

**示例1：没有使用virtual修饰Base::func()方法**

```cpp
class Base
{
public:
    void func()
    {
        std::cout << "Base::func()" << std::endl;
    }
};
class Derived : public Base
{
public:
    void func()
    {
        std::cout << "Derived::func()" << std::endl;
    }
};
int main()
{
    Derived *d = new Derived();
    d->func(); // Derived::func()
    Base *b = new Derived();
    b->func(); // Base::func()
    return 0;
}
```

当Base类的`func()`方法没有被声明为virtual时，就没有使用多态。在这种情况下，哪个方法被调用取决于指针的静态类型，而不是对象的实际类型。因为没有使用多态，所以`b->func()`调用的是Base类的`func()`方法，尽管b实际上指向的是Derived对象。

**示例2：在Base::func()方法前加上virtual修饰**

```cpp
#include <iostream>

class Base
{
public:
    virtual void func()
    {
        std::cout << "Base::func()" << std::endl;
    }
};

class Derived : public Base
{
public:
    void func()
    {
        std::cout << "Derived::func()" << std::endl;
    }
};

int main()
{
    Derived *d = new Derived();
    d->func(); // Derived::func()

    Base *b = new Derived();
    b->func(); // Derived::func()

    return 0;
}
```

如果在Base类的`func()`方法前加上`virtual`关键字，那么就启用了多态，当通过基类类型的指针或引用调用虚函数时，程序会查找被指对象的实际类型，并调用相应的重写函数。即使b是指向Derived对象的Base类型指针，程序在运行时也会调用Derived对象的func()方法：
因此，使用虚函数（`virtual`）是实现运行时多态的关键。它允许基类指针或引用在运行时解析到派生类中重写的方法，这在实现如动态绑定、接口和抽象类等高级编程概念中非常重要。如果不使用 `virtual`，无论指针或引用的实际对象类型如何，总是会调用指针或引用类型所对应的类中的方法。

### 虚函数 (TheCherno)

虚函数引入示例：

```cpp
//基类
class Entity
{
public:
    std::string GetName() {return "Entity";} 
};

//派生类
class Player : public Entity
{
private: 
 std::string m_Name; 
public: 
 Player(const std::string& name):m_Name (name) {}  //构造函数
 std::string GetName() {return m_Name;}
};

void printName(Entity* entity){
 std::cout << entity -> GetName() << std::endl;
}

int main(){
 Entity* e = new Entity();
 printName(e); // 我们这儿做的就是调用entity的GetName函数，我们希望这个GetName作用于Entity
 Player* p = new Player("hacket"); 
 printName(p); // printName(Entity* entity)，没有报错是因为Player也是 Entity类型。同样我们希望这个GetName作用于Player
}
// 输出：
// Entity
// Entity
```

> 两次输出都是Entity，**原因在于如果我们在类中正常声明函数或方法，当调用这个方法的时候，它总是会去调用属于这个类型的方法**，而`void printName(Entity* entity);` 参数类型是`Entity*`,意味着它会调用 Entity 内部的 GetName 函数，**它只会在 Entity 的内部寻找和调用 GetName**。
> 但是我们希望 C++能意识到，在这里我们传入的其实是一个 Player，所以请调用 Player 的 GetName。**此时就需要使用虚函数了。**

- 虚函数引入了一种要**动态分配**的东西，一般通过虚表（`vtable`）来实现编译。虚表就是一个包含类中所有虚函数映射的列表，通过虚表我们就可以在运行时找到正确的被重写的函数。（<font color="#92d050">虚函数有一定的性能损耗</font>）
- 简单来说，你需要知道的就是**如果你想重写一个函数，你么你必须要把基类中的原函数设置为虚函数**
- **构造函数**任何时候都不可以声明为虚函数
- **析构函数**一般都是虚函数, 释放先执行子类再执行父类
- C++11 版本，派生类复写父类函数，可以添加 `override` 关键字

**示例1：**

```cpp
//基类
class Entity
{
public:
    virtual std::string GetName() {return "Entity";} //第一步，定义基类，声明基类函数为 virtual的。
};

//派生类
class Player : public Entity
{
private: 
    std::string m_Name; 
public: 
    Player(const std::string& name):m_Name (name) {} 
    // 第二步，定义派生类(继承基类)，派生类实现了定义在基类的 virtual 函数。
    std::string GetName() override {return m_Name;}  //C++11新标准允许给被重写的函数用"override"关键字标记,增强代码可读性。
};

void printName(Entity* entity){
    std::cout << entity -> GetName() << std::endl;
}

int main(){
    Entity* e = new Entity();
    printName(e); 
    // 第三步，声明基类指针，并指向派生类，调用virtual函数，此时虽然是基类指针，但调用的是派生类实现的基类virtual函数。Entity* p = new Player("hacket");也可以
    Player* p = new Player("hacket"); 
    printName(p); 
}
// 输出：
// Entity
// hacket
```

**示例2：虚函数和多态**

```c
class Parent {
public:
	void test() {
	cout << "parent" << endl;
	}
};

class Child : public Parent {
public:
	void test() {
		cout << "child" << endl;
	}
};

// 1. 静态多态
Parent *c = new Child();
// 编译期间 确定c 为 Parent 调用Parent的test方法
c->test();

// 2. 动态多态
// 修改Parent的test()函数为virtual虚函数 动态链接，告诉编译器不要静态链接到该函数
virtual void test() {
	cout << "parent" << endl;
}
// 动态多态 调用Child的test方法
c->test();
```

### 虚函数作用

在 C++ 中，虚函数是实现多态行为的一种机制。具体来说，虚函数的作用包括：

1. **支持运行时多态**：
   虚函数允许基类指针或引用在运行时调用派生类重写的同名函数。这种能力让基类接口能够在不同派生类之间透明的调用正确的函数实现，即使是那些在基类代码被编译后才产生的派生类。

2. **实现动态绑定**：
   对于虚函数，函数调用的绑定是在程序运行时发生的（动态绑定），而非编译时（静态绑定）。这样可以根据对象的实际类型来执行相应的函数版本。

3. **创建可扩展的类库和框架**：
   虚函数允许用户继承一个基类并覆盖（重写）其虚函数，以提供特定行为。这是创建可插拔组件和可重用类库的基础。

使用 `virtual` 关键字的原因：

1. **显式声明意图**：
   使用 `virtual` 关键字可以明确表示一个函数打算被派生类重写，提供了继承和重写的意图，使得代码易于理解。

2. **允许派生类定制行为**：
   通过 `virtual` 关键字，基类提供了一个可由派生类定制行为的框架。派生类可以提供这些虚函数的特定实现。

3. **实现接口和抽象类**：
   你可以使用纯虚函数（`virtual void function() = 0;`）声明接口和抽象类。这些类无法实例化，并且要求派生类提供特定函数的实现。

4. **确保资源清理**：
   `虚析构函数`用于确保在通过基类指针删除派生类对象时，可以调用正确的析构函数，从而避免资源泄漏。

5. **为后期扩展做准备**：
   即使当前看似不需要，也可以把成员函数声明为虚函数，以便在将来派生类扩展或修改基类行为时，不需要修改基类代码。

### 使用虚函数注意

#### 编译报错："undefined reference to vtable for Identity"

`Identity.h` 定义：

```cpp
// Identity.h
class Identity
{
public:
    // ...
    virtual void operMenu();
};
```

然后编译报错了：`undefined reference to vtable for Identity`

当你使用 CMake 编译时遇到 "`undefined reference to vtable for Identity`" 这样的错误，通常是因为 C++ 编译器期望为具有虚函数的类 Identity 生成一个虚表（`vtable`），但没有找到虚函数 `operMenu()` ` 的实现。

在你提供的代码片段中，`Identity` 类声明了一个虚函数 `operMenu()`，但你没有提供它的实现。就算这个函数不打算执行任何操作，你仍然需要提供至少一个空的实现。如果这是一个不打算在 `Identity` 类中实现的纯虚函数，你需要将其声明为纯虚函数，以使 `Identity` 成为一个抽象类。那样的话，`Identity` 类就不能被直接实例化了。

**解决1：Identity 提供虚函数空的实现**

```cpp
// Identity.h
class Identity
{
public:
    // ...
    virtual void operMenu() {} // 现在这是一个有默认实现的虚函数
};
```

**解决2：Identity 声明为纯虚函数**

```cpp
// Identity.h
class Identity
{
public:
    // ...
    virtual void operMenu() = 0; // 纯虚函数，使 Identity 成为抽象类
};

```

## 纯虚函数(`Pure Virtual Function` C++接口/抽象类)

### 纯虚函数介绍

纯虚函数是一种特殊的虚函数，它没有具体的实现，并强迫派生类提供自己的实现。一个包含纯虚函数的类称为抽象类，你不能创建该类的实例。**声明纯虚函数的语法是在虚函数声明的末尾加上 = 0**。

纯虚函数经常用于定义接口，即说明派生类应该提供哪些功能，而不是如何实现这些功能。这是实现多态性的关键部分，允许你编写更通用的代码来使用具有不同行为的对象。

**纯虚函数优点**：

- 防止派生类忘记实现虚函数，**纯虚函数使得派生类必须实现基类的虚函数**。
- 在某些场景下，创建基类对象是不合理的，含有纯虚拟函数的类称为**抽象类**，它**不能直接生成对象。**

> 纯虚函数，子类必须实现，类似于 Java 中的抽象方法。

**声明方法**: 在基类中纯虚函数的方法的后面加 **=0**

```cpp
virtual 返回值类型 函数名(参数列表) = 0 ;
```

```cpp
class Parent {
public:
    // 纯虚函数 继承自这个类需要实现 抽象类型
	virtual void test() = 0;
};

class Child :public Parent {
public:
	void test(){}
};
```

- C++中的**纯虚函数**本质上与其他语言（bi如Java或C#）中的抽象方法或接口相同。
- 纯虚函数与虚函数的区别在于，纯虚函数的基类中的 `virtual` 函数，只声明了，但不实现。实现交给派生类来做。
- **只能实例化一个实现了所有纯虚函数的类**。**纯虚函数必须被实现**，然后我们才能创建这个类的实例。
- 纯虚函数允许我们在基类中定义一个没有实现的函数，然后**强制子类**去实现该函数。
- 实际上，其他语言有类似 `interface` 关键字而不是叫 `class`，但 `C++`没有。接口只是 `C++`的类而已。
- 在面向对象程序设计中，创建一个只包含未实现方法然后交由子类去实际实现功能的类是非常普遍的,这通常被称为接口。**接口就是一个只包含未实现的方法并作为一个模板的类**。并且由于此**接口类**实际上不包含方法实现，所以我们**无法实例化**这个类。

示例：

```cpp
//基类
class Entity
{
public:
    virtual std::string GetName() = 0; //声明为纯虚函数。请记住，这仍然被定义为虚函数，但是=0实际上将它变成了一个纯虚函数，这意味着如果你想实例化这个类，那么这个函数必须在子类中实现
};

//派生类
class Player : public Entity
{
private: 
	std::string m_Name; 
public: 
	 Player(const std::string& name):m_Name (name) {} 
	 std::string GetName() override {return m_Name;} //实现纯虚函数
};

void printName(Entity* entity){
	 std::cout << entity -> GetName() << std::endl;
}

int main(){
	// Entity* e = new Entity();  //会报错，在这里我们必须给它一个实际上实现了这个函数的子类
	 Entity* e = new Player("");  //ok
	 printName(e); 
	
	 Player* p = new Player("cherno"); 
	 printName(p); 
}
```

## 虚析构函数和纯虚析构函数

### 虚析构函数

- 如果用基类指针来引用派生类对象，那么基类的析构函数必须是 `virtual` 的，否则 C++ 只会调用基类的析构函数，不会调用派生类的析构函数。
- 继承时，要养成的一个好习惯就是，**基类析构函数中，加上virtual。**

多态使用时，如果子类中有属性开辟到堆区，那么父类指针在释放时无法调用到子类的析构代码

> 为什么要调用派生类析构函数？
> 若派生类有一个成员 int 数组在堆上分配东西，在构造函数中分配，在析构函数中删除。运行当前代码发现没有调用那个派生析构函数，但是它调用了派生类的构造函数。我们在构造函数中分配了一些内存，但是永远不会调用派生析构函数 delete 释放内存，因为析构函数没有被调用，永远不会删除堆分配数组，这就是所谓的内存泄漏。

示例：

```cpp
#include <iostream>

class Base
{
public:
    Base() { std::cout << "Base Constructor\n"; }
    virtual ~Base() { std::cout << "Base Destructor\n"; }
};

class Derived : public Base
{
public:
    Derived()
    {
        m_Array = new int[5];
        std::cout << "Derived Constructor\n";
    }
    ~Derived()
    {
        delete[] m_Array;
        std::cout << "Derived Destructor\n";
    }

private:
    int *m_Array;
};

int main()
{
	// 只有基类，派生类构造和析构不会调用
    Base *base = new Base();
    delete base;
    std::cout << "-----------------" << std::endl;
    // Base Constructor
    // Base Destructor
    // -----------------
	
	// 派生类实例，会调用基类和派生类
    Derived *derived = new Derived();
    delete derived;
    std::cout << "-----------------" << std::endl;
	// Base Constructor
    // Derived Constructor
    // Derived Destructor
    // Base Destructor
    // -----------------

    Base *poly = new Derived();
    delete poly; // 基类析构函数中如果不加virtual，则此处会造成内存泄漏，基类如果不加virtual，只会调用基类析构，派生类析构不会执行，造成内存释放不了
    // Base Constructor
    // Derived Constructor
    // Derived Destructor //基类析构函数中如果不加virtual，子类的虚构函数不会被调用
    // Base Destructor
}
```

注意：定义基类的**虚析构**并不是什么相加，而是：**基类中只要定义了虚析构（且只能在基类中定义虚析构，子类析构才是虚析构，如果在二级子类中定义虚析构，编译器不认，且 virtual 失效）**，在编译器角度来讲，那么由此基类派生出的所有子类地析构均为对基类的虚析构的重写，当多态发生时，用父类引用，引用子类实例时，此时的虚指针保存的子类虚表的地址，该函数指针数组中的第一元素永远留给虚析构函数指针。所以当 delete 父类引用时，即第一个调用子类虚表中的子类重写的虚析构函数此为第一阶段。然后进入第二阶段：（二阶段纯为内存释放而触发的逐级析构与虚析构就没有半毛钱关系了）而当子类发生析构时，子类内存开始释放，因内存包涵关系，触发父类析构执行，层层向上递进，至到子类所包涵的所有内存释放完成。

**示例：多级继承，virtual 写在哪里**

```cpp
#include <iostream>
#include <string.h>
class Base
{
protected:
    int *array = nullptr;

public:
    Base()
    {
        std::cout << "Base() Constructor" << std::endl;
    }
    virtual ~Base()
    {
        std::cout << "~Base() Destructor" << std::endl;
    }
};
class SubClass1 : public Base
{
public:
    SubClass1()
    {
        array = new int[10];
        memset(array, 0, 10 * sizeof(int));
        std::cout << "SubClass1() Constructor, new array size: 10" << std::endl;
    }
    ~SubClass1()
    {
        delete[] array;
        std::cout << "~SubClass1() Destructor" << std::endl;
    }
};
class SubClass2 : public Base
{
public:
    SubClass2()
    {
        array = new int[20];
        memset(array, 1, 20 * sizeof(int));
        std::cout << "SubClass2() Constructor, new array size: 20" << std::endl;
    }
    ~SubClass2()
    {
        delete[] array;
        std::cout << "~SubClass2() Destructor" << std::endl;
    }
};
int main()
{
    Base *b1 = new SubClass1();
    delete b1;

    std::cout << "----------------" << std::endl;

    Base *b2 = new SubClass2();
    delete b2;
    return 0;
}
```

输出：

```
Base() Constructor
SubClass1() Constructor, new array size: 10
~SubClass1() Destructor
~Base() Destructor
----------------
Base() Constructor
SubClass2() Constructor, new array size: 20
~SubClass2() Destructor
~Base() Destructor
```

### 纯虚析构函数

**虚析构和纯虚析构共性：**

- 可以解决父类指针释放子类对象
- 都需要有具体的函数实现

**虚析构和纯虚析构区别：**

- 如果是纯虚析构，该类属于抽象类，无法实例化对象

**虚析构语法：**

```cpp
virtual ~类名(){}
```

**纯虚析构语法：**

```cpp
virtual ~类名() = 0;
类名::~类名(){}
```

**示例：**

```cpp
class Animal1
{
public:
    Animal1()
    {
        std::cout << "Animal1() Constructor" << std::endl;
    }
    virtual void speak() = 0;
    virtual ~Animal1() = 0;
};
// 纯虚析构函数必须提供一个定义，否则链接时会出现错误
Animal1::~Animal1()
{
    std::cout << "Animal1 纯虚析构函数调用！" << std::endl;
}

class Cat1 : public Animal1
{
public:
    // Cat1(std::string name1) : name(new std::string(name1))
    // // Cat1(std::string name) : name(&name) // error, Cat1 类的构造函数存在问题。你正在尝试用一个局部变量的地址初始化一个指向 std::string 的指针成员。这会导致未定义行为，因为构造函数的参数 name 在构造函数执行完毕后会被销毁，你的成员指针 name 将变成悬挂指针，指向一个已经不再有效的内存地址
    // {
    //     // name1的作用域在Cat1构造函数内部，所以不能用&name1
    //     // std::string temp = name;
    //     // std::string temp = "temp";
    //     std::cout << "Cat1() Constructor, name=" << name << std::endl;
    // }
    // 右值引用
    Cat1(std::string&& name): name(new std::string(std::forward<std::string>(name)))
    {
        std::cout << "Cat1() Constructor,forward name=" << name << std::endl;
    }

    void speak() override
    {
        std::cout << *name << " Cat1, is speak()" << std::endl;
    }
    ~Cat1()
    {
        std::cout << "~Cat1() Destructor delete name" << std::endl;
        delete this->name;
    }
private:
    std::string *name;
};

int main()
{
    Cat1 *cat1 = new Cat1("Tom");
    cat1->speak();
    delete cat1;
    return 0;
}
```

# C++多态

## 多态的基本概念

**多态是 C++面向对象三大特性之一**。

多态分为两类：

- 静态多态: **函数重载**、**运算符重载**和 **模板(泛型)** 属于静态多态，复用函数名
- 动态多态: **继承+虚函数**实现运行时多态

静态多态和动态多态区别：

- 静态多态的函数地址早绑定 - 编译阶段确定函数的调用地址
- 动态多态的函数地址晚绑定：函数调用地址不能在编译器期间确定，必须在运行阶段才能确定

**示例：**

```cpp
#include <iostream>
using namespace std;
class Animal
{
public:
    // Speak函数就是虚函数
    // 函数前面加上virtual关键字，变成虚函数，那么编译器在编译的时候就不能确定函数调用了。
    virtual void speak()
    {
        cout << "动物在说话" << endl;
    }
};
class Cat : public Animal
{
public:
    void speak()
    {
        cout << "小猫在说话" << endl;
    }
};
class Dog : public Animal
{
public:
    void speak()
    {
        cout << "小狗在说话" << endl;
    }
};
// 我们希望传入什么对象，那么就调用什么对象的函数
// 如果函数地址在编译阶段就能确定，那么静态联编
// 如果函数地址在运行阶段才能确定，就是动态联编

void DoSpeak(Animal &animal)
{
    animal.speak();
}
//
// 多态满足条件：
// 1、有继承关系
// 2、子类重写父类中的虚函数
// 多态使用：
// 父类指针或引用指向子类对象

void test01()
{
    Cat cat;
    DoSpeak(cat);

    Dog dog;
    DoSpeak(dog);
}
int main()
{
    test01();
    std::cin.get();
    return 0;
}
```

多态满足条件

- 有继承关系
- 子类重写父类中的虚函数

多态使用条件

- 父类指针或引用指向子类对象

重写：函数返回值类型 函数名 参数列表 完全一致称为重写

## 虚指针和虚表 vptr 和 vtbl

在 C++ 中，**vptr**（虚指针）和 **vtbl**（虚表，也称为虚函数表或 virtual method table）是实现类多态性的底层机制。

在讲虚指针和虚表之前，先要知道：

- 当子类继承父类时，除了继承数据之外，同时会继承父类的虚函数。
- 继承父类的函数，继承的其实是它的**调用权**，而不是大小。

### 虚表 vtable vtbl

- vtbl 是一个编译器生成的数组，每一个包含虚函数的类都有自己的 vtbl。每个 vtbl 包含了指向虚函数具体实现的函数指针。如果类有在基类中声明的虚函数，这些函数也会在 vtbl 中有相应的条目。
- vtbl 中虚函数的排列顺序通常与它们在类中声明的顺序一致，但这不是由语言标准规定的，而是由特定编译器的实现决定的。
- 在派生类中，如果一个虚函数被重写，它的函数指针会被更新为新的实现，相应的 vtbl 条目会指向这个新函数。如果没有重写，则会继续使用基类版本的函数指针。

### 虚指针 v-pointer vptr

- vptr 是虚指针的简称，是一个指针，它指向类的虚函数表（vtbl）。每一个拥有虚函数（或继承自含有虚函数的类）的对象都会隐式地包含一个 vptr。
- vptr 的值在对象的构造时被初始化，在整个对象的生命周期中保持不变，除非对象被作为其派生类型构造或析构。（在构造和析构过程中，对象的类型会动态地变化，相应的 vptr 也会随之更新，以指向当前类的 vtbl。）
- 当通过基类指针或引用调用虚函数时，编译器通过对象的 vptr 来动态地确定要调用的函数实现。

### 示例讲解

现在看如下的关系图：

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405080055420.png)
观察关系图：

- 请注意：A B C三个类的非虚函数，他们虽然重名，但其实彼此之间毫无关系，这一点要注意，千万别以为B的非虚函数是继承A的非虚函数。
- `B类的内存大小` = 继承 A 类的数据 + B 本身的数据，C 类同理。（关系图最右边）
- A有两个虚函数**vfunc1**、**vfunc2**以及两个非虚函数`func1`、`func2`；B类继承A类的**vfunc2**，同时覆写A类的**vfunc1**，此时B有两个虚函数(**vfunc1**和**vfunc2**)；C类继承了B类的**vfunc2**（**vfunc2**其实是A的），同时覆写了**vfunc1**，也有两个虚函数。
- 所以A B C这三个类一共有八个函数，四个非虚函数，四个虚函数。（关系图中间偏右）。
- 只要一个类拥有虚函数，则就会有一个**虚指针vptr**，该vptr指向一个**虚表vtbl**，**虚表vtbl中放的都是函数指针，指向虚函数所在的位置**。（可以观察到，关系图中虚表中的函数指针都指向相应的虚函数的位置）这其实就是**动态绑定**的关键。
- 如果创建一个指向 C 类的指针 p（如 `C* p= new C`）,如果让该**指针 p 调用虚函数** `C::vfunc1()`，则编译器就知道这是动态绑定，故这时候就会通过 p 找到 vptr，在找到 vtbl，最终通过 vtbl 的函数指针找到相应的虚函数。该步骤如果要解析成 C 语言的话就如下所示，其中**n**指的是**要调用的虚函数在虚表中的第几个**。n 在写虚函数代码的时候编译器看该虚函数第几个写的则 n 就是几。
  ![image.png|200](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405080058313.png)

C++编译器看到一个函数调用，它有两个考量：

- 是静态绑定吗？（`Call ×××`）
- 还是动态绑定。

要想动态绑定要满足三个条件：

- 第一：必须是**通过指针来调用**
- 第二：该指针是**向上转型**(up-cast)的：`Base* basePtr = new Derived;`
- 第三：调用的是**虚函数**

编译器就会编译成 `( *(p->vptr[n]) )(p)` 这样来调用。

例如：用一个 Shape（父类）的指针，调用 Circle（子类）的 _draw_ 函数（每个形状的 _draw_ 都不一样，继承自 Shape）

==**多态**==：同样是 Shape 的指针，在链表中却指向了不同的类型：`list<Shape*> Mylist`
![image.png|500](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405080112630.png)

到此为止，是不是觉得`多态`、`虚函数`、`动态绑定`是指的一回事了

## 动态绑定

现在考虑一下，为什么动态绑定解析成C语言形式会是：

```c
(*(p->vptr)[n])(p)  //第二个p其实就是this指针（因为p是调用者）
//或
(* p->vptr[n])(p)
```

从汇编角度看一下：

下图中`a`是一个**对象**，它调用函数是一个**静态绑定**，可以看到汇编呈现的就是：`Call xxx`一个地址

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405080108199.png)

下图中 `pa` 满足**动态绑定的三个条件**，所以它是一个动态绑定，而在汇编语言中，汇编所呈现出来的那部分命令就等价于 C 语言中的 `(*(p->vptr)[n])(p)`

![image.png|700](https://raw.githubusercontent.com/hacket/ObsidianOSS/master/obsidian202405080109869.png)
