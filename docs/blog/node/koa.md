---
title: koa原理剖析
date: 2021-4-11
next: false
tags:
  - node
  - koa
  - http
  - web
---

`koa`源码中主要维护了多个对象：
- req
- res
- context
- koa

其中，在`req`和`res`的`proto`上定义了用于设置Http字段的许多`method`。将`req`和`res`中的属性和方法迁移到`context`。
## 执行流程
通常执行一段简单的`koa`程序。经过`new koa`、`app.use()`、`app.listen()`和处理传入请求这几部分。
### new koa
该阶段会创建koa实例，实例中主要维护了：
- 中间件数组`mwArray`
- `req`对象、`res`对象和`context`对象，此时三个对象为空对象，但`_proto_`属性指向原型。具有原型方法。
- 其他的配置项属性，如`proxy`、`env`等。
- 用到的方法，如：`use()`、`listen()`、`createContext()`等等。
#### 关键代码:
``` js
constructor(options) {
    super();
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
 }
 ```
## app.use
app.use用于使用中间件，会将参数中的函数式中间件`push`到`mwArray`中。
### 关键代码
``` js
use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
}
```
## app.listen()
此阶段至关重要，主要做以下几件事：
- 通过`http.createServer(this.callback())`创建http服务。
- `this.callback()`返回http请求的处理函数`
- 根据`app.listen(...arg)`传入的参数`...arg`调用http服务的`listen`方法监听端口。

关键代码：
``` js
 listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```
### callback()
`this.callback`决定如何处理传入的http请求。该方法中实现了`promise`的异步处理方案和中间件执行的“洋葱模型”。

方法内完成了两件事：
- 调用`compose(this.middleware)`组合中间件得出可串联中间件的请求处理函数`fn`，实现了洋葱模型的调用方式。
- 根据端口监听到的`req`创建`ctx`。
- `fn`即可根据`ctx`调用中间件处理http请求，返回响应。

组合而成的`fn`如下：
``` js
function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
}
```
- 按照`mwArray`下标依次`dispatch`中间件函数处理`ctx`。
- 中间件中的`next()`正是对应了`dispatch()`的调用。
- 用`Promise.resolve`包裹`middleware`调用中间件，实现了基于`promise`的异步处理。
- 最后一个包裹中间件的`promise`状态变为`fulfilled`时，上一个middleware中`next()`之后的代码得以继续执行，实现了“洋葱模型”。
## http请求处理
`listen`中已经完成了端口监听和请求处理函数。监听到请求可进行处理。
