---
title: vue-router
date: 2020-11-11
next: false
tags: 
    - vue
---

对于一个单页面应用而言，第一次访问时就会加载所有的资源。之后对于页面的导航、切换都是通过对当前url解析，去决定渲染什么内容，不需要再向服务器请求页面。

vue-router是vue官方维护的路由管理的工具，通过对url的监控决定如何展示组件。

使用的时候新建router对象，通过去配置path和对应的component去决定如何展示组件。

路由匹配路径后可将相应的组件渲染到`<router-view />`中，可以通过`<router-link />`进行路由的跳转。通过`<Redirect />`进行重定向。

其他功能的话，可在路由配置中添加参数名。组件匹配到后，可以通过this.$router获取到路由实例，在param中获取到参数。

还可以做导航守卫，有全局守卫（在router对象里router.beforeEach、router.afterEach）、路由守卫（route配置里配置beforeEnter）、组件守卫（在组件里配置beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave）

模式：hash、history。默认的为hash模式。

hash模式，将域名和路径通过#拼接起来，#后面的路径也就是当前的hash值，通过location对象获取到，设置hashchange事件的处理程序，在hash值变化后根据重新更新页面。

history模式：使用正常的url，也是对于url解析决定页面显示什么。基于history对象，可以通过它的pushState、replaceState方法在不发送请求前提下去改变url，通过popState事件去监听url的变化。缺点：刷新时，会想服务器发起页面的请求，服务器需要去做重定向到根页面。