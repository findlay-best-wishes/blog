---
title: 简述
date: 2020-4-28
prev: false
tags:
  - http
  - 报文
---

## 简介
- http协议是web应用使用的处于应用层的协议。
- http协议规定了（其他应用层协议也是这样）
  - 报文的类型
  - 各种报文类型的语法（报文中各个字段以及字段是如何描述的）
  - 字段的语义
  - 确定一个进程何时、如何发送报文，对报文进行响应的规则
- http使用tcp作为它的传输层协议
- 用户请求一个页面时
1.浏览器进程先与服务器对应进程建立tcp连接
2.浏览器进程向它的socket发送http请求报文到达服务器进程
3.服务器进程所关联的socket接收请求报文，依据请求返回相应的http响应报文
4.浏览器再接收响应报文，获取到响应对象（html文档等）
5.断开tcp连接

## 持续连接和非持续连接
上述请求页面流程中，如果要发起多次http请求，对tcp连接的利用也有不同方式。
### 非持续连接
第一次http请求到步骤4之后，直接断开tcp连接。下次http请求时，启用全新新的tcp连接。
#### 缺点
- 为每个http请求创建维护一个tcp连接，为客户和服务器造成负担。
- 每次http请求都要经过tcp连接，用户经受更多的交付时延。
### 持续连接
第一次http请求到步骤4之后，不立即断开tcp连接，下次http请求或响应时，使用同个tcp连接。一条连接一段时间未被使用，http服务器就关闭该连接。
### 如何规定
http报文首部行中设置Connection选项的值，选择连接方式。
## http报文格式
### 请求报文组成
上到下四个部分
1.请求头
|请求方法|sp|url|sp|http协议版本|cr|1f
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
2.首部行
|首部字段名：|sp|值|cr|1f|
|:-:|:-:|:-:|:-:|:-:|
|首部字段名：|sp|值|cr|1f|
|---|sp|---|cr|1f|
常见通用首部字段：Connection、Cache-control、Date、Transfer-Encoding、via。
请求报文常见首部字段：Host、Accept、Authorization、If-Modify-Since、User-Agent。
和实体相关字段：Content-Type、Content-Length、Last-Modify。
3.空行
|cr|1f|
|:-:|:-:|
4.实体体(get方法时为空,post方法时传入参数)
||
|:-:|

### 响应报文组成
1.状态行
|http协议版本|sp|状态码|sp|短语|cr|1f|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:
常见状态码及短语
状态码|短语|含义
:-:|:-:|:-:
200|ok|请求成功
301|Moved Permanently|请求的对象已被转移，新的url在location首部行中，并自动获取。
400|Bad Request|该请求不被服务器理解
404|Not Found|找不到该对象
505|HTTP Version Not Suported|服务器不支持报文所用http协议版本
2.首部行
|首部字段名：|sp|值|cr|1f|
|:-:|:-:|:-:|:-:|:-:|
|首部字段名：|sp|值|cr|1f|
|---|sp|---|cr|1f|
响应报文常见首部字段：Server、location、Www-Authorization。
3.空行
|cr|1f|
|:-:|:-:|
4.实体体

待续