---
title: setState
date: 2020-11-4
tags: 
    - react
---

## setState的更新特点
  - 不是立即更新。
  - 执行所有组件的`didMount`后，执行完父组件的`didMount后，统一更新。
  - 更新时会把多个更新合并，只更新一次。
  - 传入对象作为参数多次更新时，会忽略之前的只更新最后一次；
    传入函数作为参数多次更新时，多次更新都会生效。
  - `setState`是同步更新。
## setState执行过程
1.将`setState`传入的参数存到当前组件的state暂存队列里。
2.React处于批量更新时候，将该组件添到待更新组件队列中；
未处于批量更改时，将批量更新标记置为true，启动批量更新，再将组件添加到待更新队列中。
3.遍历更新队列，依次执行更新。
4.将组件当前`state`与暂存队列中`state`合并，生成新的`state对象`。
5.执行`componentShouldUpdate（）`，返回值为true时，执行后续更新。
6.执行`render（）`，进行真实的更新。
7.执行`componentDidUpdate（）`。
## 其他
- ### setState的异步假象
  调用`setState`时，如果react正处于更新阶段，当前更新会被暂存，等到上次更新完成时，才会执行当前更新。造成异步更新的错觉。
- ### 推荐的更新方式
传入函数，先获取到state值，再更新。
  `this.setState((state)=>({age:state.age+1});`
- ### 在生命周期钩子中使用
  - 不建议在`didMount`中使用，会造成二次渲染，尽量在构造函数中初始化。
  - 不建议在`didUpdate`中使用，不加条件判断会造成死循环。

*[来源](https://mp.weixin.qq.com/s/vDJ_Txm4wi-cMVlX5xypLg)*