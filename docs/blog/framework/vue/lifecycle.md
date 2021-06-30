---
title: 生命周期
date: 2020-10-30
tags: 
    - vue
---


vue生命周期分为四个阶段，实例创建、挂载、更新、销毁。

## 创建
在创建前会执行`beforeCreate`，此时vue实例还没创建，创建后需要完成数据观测、属性、方法、事件的初始化，执行`created()`。

## 挂载
在挂载前需要编译模板，将data里的数据和模板生成html，挂载前会调用`beforeMounted`，然后需要将生成的html替换el,插入到页面中，完成后会调用`mounted()`，可对dom节点进行操作，进行数据请求。

## 更新
在数据更新之前会调用`beforeUpdate()`，数据更新后会引起虚拟dom重新渲染，更新完成后会调用`updated()`。

## 销毁
在组件实例销毁前会执行`beforeDestory()`，销毁后执行`destoryed()`，可以用于移除事件监听。