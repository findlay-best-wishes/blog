---
title: 双向绑定
date: 2020-11-10
tags: 
    - vue
---

## 双向绑定
通过v-model指令将输入组件的输入值与组件实例的属性进行双向绑定。

对于文本输入框和文本域和菜单元素（select），会将它的value属性和组件实例属性进行双向绑定。

对于单选框、复选框，会将它的checked属性和组件实例属性进行双向绑定。
## 实现原理
通过v-bind将vue实例属性响应式的覆盖为input的value属性或者checked属性。

通过v-on监听input元素的input事件或者change事件，在事件处理程序里更新vue实例的属性值。