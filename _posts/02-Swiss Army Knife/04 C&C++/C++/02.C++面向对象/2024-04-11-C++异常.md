---
date created: 2024-04-11 00:16
date updated: 2024-12-27 23:51
dg-publish: true
---

## C++异常

1. `throw` 抛出异常
2. `try{}catch()` 捕获异常
3. 可以抛出任何对象

```c
void test1()
{
	throw "测试!";
}

void test2()
{
	throw exception("测试");
}

try {
	test1();
}
catch (const char *m) {
	cout << m << endl;
}
try {
	test2();
}
catch (exception  &e) {
	cout << e.what() << endl;
}

//自定义
class MyException : public exception
{
public:
   virtual char const* what() const
    {
        return "myexception";
    }
};

//随便抛出一个对象都可以
```
