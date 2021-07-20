---
title: 单例模式
tags: 
    - 设计模式
    - 单例
    - 单例模式
---
单例模式，即保证一个类只会存在一个实例，即使多次调用了实例创建方法，并提供一个访问它的全局访问方式。
## 实现
``` javascript
const proxySingleton = (func) => {
    var instance = null;
    return (...args) => instance || (instance = func.apply(this, args));
}
```
将返回待创建实例对象的`func`函数传入`proxySingleton`即可得到始终返回单个实例对象的函数。如：
``` javascript
const createGlobalData = (id, name) => {
    id,
    name,
}

const getSingletonGD = proxySingleton(createGlobalData);
const gd1 = getSingletonGD('id1', 'n1');
const gd2 = getSingletonGD('id2', 'n2');
gd1 === gd2 // => true
```
用到了闭包、高阶函数及代理。
## 应用
用于创建全局唯一的对象实例，如线程池、全局window对象、全局缓存等。
