---
title: 生命周期
date: 2021-04-04
tags: 
    - react
---

react生命周期指的是react组件从挂载到卸载的过程。

![react生命周期总览](~@blogImg/react-lifecycle.png)

## 1.组件挂载
组件实例被创建并插入DOM时，依次执行下面生命周期方法。

### constructor( )
挂载前调用，常用于初始化state、绑定事件方法到组件实例上，使用较少。
              
### getDerivedStateFromProps( )
- 每次渲染时都会调用，会根据props返回一个对象更新state，返回值为null时不更新。
- 将props初始化存储到state时会调用，而这种做法并不提倡，所以不建议使用
### render( );
render()调用时检查props、state是否更新。返回值为react元素等。不应直接与浏览器交互。
### componentDidMount( )
组件实例被挂载（插入dom树）后立即调用。可进行和dom相关的操作、适合发起数据请求、添加订阅、组件初始化。
## 2.组件更新
组件的props、state变化时触发更新，生命周期方法调用如下。
### getDerivedStateFromProps( ) 
### componentShouldUpdate( )
该方法具有默认行为，根据props、state变化决定是否重新渲染，有返回值。返回值为false时，不会执行后续的render等方法。
### render( )
### getSnapshotBeforeUpdate( )
调用该方法可在在组件更新前，获取dom信息。具有返回值，会作为componentDidUpdate()的第三个参数。
### componentDidUpdate( );
组件更新后立即调用，可依据更新前后props操作dom。
## 3.组件卸载
### componentDidUnmount( )
该方法在组件卸载前调用，可在其中清除定时器、取消请求、取消订阅。