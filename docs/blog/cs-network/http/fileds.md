---
title: 常见字段
date: 2020-05-03
tags:
    - http
    - http字段
---

Http中存在多个字段可实现Http功能的扩展，也就是之前所提到的易于扩展特性。
## 数据类型与编码类型字段
- 客户端和服务器常常需要协商返回的数据。客户端发送请求时需告知服务器所需返回的文件类型，服务端需告知浏览器实际返回的数据是什么类型。
- 同样，他们之间也需协商数据的编码类型。
### 常见数据类型（MIME type）
#### text
文本类型数据，具体包括纯文本文档（text/plain）、超文本文档（text/html）和样式文档（text/css）等。
#### image
图片类型数据，具体包含image/jpg、image/png、image/gif等。
#### audio/video
音频或视频数据，具体有audio/mp3和video/mp4等。
#### application
表示不确定的数据类型，可能为文本或者二进制文件，具体由应用程序识别，如：application/json、application/javascript等。
### 常见编码方式（Encoding type）
流行程度从高到低：gzip、deflate、br（专门为HTTP优化的算法）。
### 数据类型字段
#### Accept
- 发送方设置Accept字段,表达所需服务器返回数据的类型。
- 可选多个数据类型，用逗号隔开，优先级从前往后降低。
- 例如：
`Accept:text/html,application/xml`
#### Content-type
- 接收方接收到请求后，返回给发送方数据通过Content-type表明返回数据的类型。
- 接收方根据数据类型做相应处理。
- 例如：
`Content-Type:text/html`
### 编码类型字段
#### Accept-Encoding
- 请求方通过Accept-Encoding确定客户端可用的编码方式。
- 例如：
`Accept-Encoding:gzip,deflate,br`
#### Content-Encoding
- 响应数据在服务器端采取的编码方式。
- 例如：
`Content-Encoding:gzip`
## 语言类型及字符集
### 语言类型
Http是供全世界使用的，需要应用于各种语言场景，如中文（zh）、英文（en），更加详细的zh-CN、en-GB（英式英语）、en-US（美式英语）。
### 字符集
用文字编码的方式表示、处理文字。常见的有UTF-8、GBK、ASCII。
### 语言类型相关字段
#### Accept-Language
- 规定客户端可接受的自然语言。
- 例如：
`Accept-Language:zh-CN,en-US`
#### Content-Type
- 规定响应数据所使用的自然语言。
- 例如：
`Content-Language:zh-CN`
### 字符集相关字段
#### Accept-Charset
- 表示客户端可用的字符集。
- 例如：
`Accept-Charset:UTF-8,GBK`
#### Content-Type
- 没错，还是它，数据类型后可加所用字符集，用分号隔开。
- 例如：
`Content-Type:text/html;charset=utf-8`
## 内容协商
上述多个字段规定了返回数据的类型、编码方式、语言及字符集。字段中有多个可选值时，可设置该值的权重，服务器端进行协商计算以确定最终输出的数据。

### 设置权值
可以用一个特殊的参数“q”设置具体值的权重，权重从0.01-1，默认值为1。在所要设置值后用分号隔开赋权值。

例如：
`Accept:text/html,text/plain;q=0.8`
### 协商结果
上述请求头中的值都可有自己的权值，服务器须根据自身的协商算法，确定最终的返回结果。

### Vary字段
- 响应报文中可设置Vary字段，显示返回的数据参考了哪些请求字段。
- 例子：
`Vary:Accept,Accept-Encoding`
## 重定向跳转字段
状态码部分讲到过，3XX的状态码表示重定向，即第一次请求路径的资源访问不到，须重定向到新的资源路径。

而新的资源路径在`Location`字段中显示,`Location`字段只作用于3XX的响应报文中。重定向路径可为绝对路径或相对路径。进行站外跳转时需用绝对路径，进行站内跳转时用相对路径，可根据重定向的上下文补全路径。

示例：
访问的路径是“/18-1”，重定向到“/index.html”。
![重定向实例](~@blogImg/302.png)


