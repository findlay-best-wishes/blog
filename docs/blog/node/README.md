---
title: 概述
date: 2021-05-26
prev: false
tags:
    - node
    - web
---
Node.js整合了上层javascript和底层C++操作，其中使用了性能出色的V8引擎，自行实现了底层libuv和中间层binding机制。不仅让js跳出了浏览器沙盒隔离的限制，还实现了非阻塞IO模型。因此Node适用于IO密集型场景。

Node的用途已经很广泛，主要在于：工具的开发（如webpack、babel）、提供web服务（如express、koa）等。

本章节计划分享Node中主要模块的使用细节、事件循环机制及其他的基于Node的一些框架类库的介绍。持续更新...