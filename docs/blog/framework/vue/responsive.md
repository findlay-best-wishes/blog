---
title: 响应式原理
date: 2020-11-10
tags: 
    - vue
---

响应式原理指的是数据模型变动时，所依赖它的视图会进行响应式的更新。
## 原理
在组件实例中定义data对象，vue会遍历data对象的所有属性，通过`Object.defineProperity`转化为getter和setter。
```
// 通过defineProperity定义getter、setter。
var d = Date.prototype;
Object.defineProperty(d, "year", {
  get: function() { return this.getFullYear() },
  set: function(y) { this.setFullYear(y) }
});
```
每个组件对应一个监听器，在渲染时会记录所依赖的属性。属性发生变化时会触发setter方法，在通知到监听他的监听器，引起关联的组件重新渲染。
## 监听data对象属性值增删
由于对象属性的监听是基于getter/getter，data里进行属性的增加删除不会触发相应的setter，不会触发响应式。
```
var vm = new Vue({
  data:{
    a:1
  }
})

// `vm.a` 是响应式的

//直接添加b属性不是响应式的
vm.b = 2
```
通过Vue.set添加属性。

`Vue.set(vm.someObject, 'b', 2)`
## 监听数组
data里包含数组属性时，通过索引改变数组值或者改变length时，数组的引用地址并不会发生变化。监听不到变化。
```
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```
改变属性值的方式：

`Vue.set(vm.items, indexOfItem, newValue)`

or

`vm.items.splice(indexOfItem, 1, newValue)`

改变数组长度的方式：

`vm.items.splice(newLength)`