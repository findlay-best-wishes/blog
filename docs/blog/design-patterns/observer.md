---
title: 观察者模式
next: false
tags:
    - 设计模式
    - 观察者模式
    - 发布-订阅
---
在一个系统中有多个模块，并且模块之间存在对应关系时，可以将子模块独立的抽离出来，而模块之间的映射关系可以通过发布订阅模式完成。这样子写出的代码降低了模块之间的耦合性，包含时间上的和空间上的。同样，发布订阅订阅也有它的弊端，比如：订阅会占据额外内存，并且订阅的场景可能不会发布；过量使用时，多个订阅可能使得数据变化难以追踪。

JS中最常见的发布订阅的实例，就是MVVM框架的响应式原理和事件监听器。MVVM框架分为三大部分：model、view、viewModal，数据变化时会通知通知更新视图。事件监听器相当于订阅了某个DOM元素的事件，事件触发时做了一次发布。
## 实现
javascript 发布-订阅模式常常通过事件订阅实现。

我们设想可以这样子使用它。
```
const consumer = {
    callback(info) {
        alert(info);
    }
};
const provider = {};
const Event = (() => {
    const subList = {};
    const listen = () => {};
    const once = () => {}
    const trigger = () => {};
    const remove = () => {};

    return {
        listen,
        trigger,
        remove,
    }
})()

// 订阅change事件
Event.create('namespane1').listen('change', consumer.callback);
Event.trigger('change', 'new Info');
```
思路是通过事件的监听和触发事件，使用了回调函数。可以为全局Event对象创建命名空间，防止事件重复。实现的Event对象如下：
```

```