---
title: 大文件传输
date: 2020-05-04
tags:
    - http
    - 文件传输
---

网络传输数据时，有几百k、几M的小数据，也有几十兆甚至百兆上G的大数据，而这些大数据直接传输的话一时半会结束不了，会一直占用网络资源。基于Http的灵活可拓展性，也有了大文件传输的相关解决方案。
## 压缩
- 服务器对所传数据进行压缩，减小文件大小，浏览器接收到后再用相同方式解压缩。
- 可用`Accept-Encoding`、`Content-Encoding`表示压缩方式。
- 之前所提到的三种压缩方式：`gzip`、`deflate`、`br`。`gzip`适用于文本压缩，`br`是Http专用的压缩方式。
## 分段传输
- 对大文件不直接整体传输，化整为零，分块传输，接收到后再组装。
- 用`Transfer-Encoding：chunked`表示使用使用分块传输。
### 分块传输的格式
- body里的数据由多个数据分块（chunk）组成。
- 每个分块第一行为表示数据块长度的16进制数，结束回车。
- 后面为数据块内容，结束回车。
- 最后以一个长度为0的数据块结尾。
- 
![数据块格式](~@blogImg/chunk-data-format.png)
- 实际响应报文示例

![实际响应报文](~@blogImg/chunk-data-res.png)

- 分块传输是不确定长度的，所以`Transfer-Encoding`不能与`Content-Length`字段同时存在。同时它可用不确定长度的场景，比如流式数据。
## 范围请求
上述方法用于传输整个文件，而有的场景只需获取大文件的某一部分，比如在线视频的进度条，这时候就可以使用范围请求了。仅可用于实现了范围请求的服务器。

服务器端可用`Accept-Range：bytes`字段表明可使用范围请求。字段`Accept-Range:none`或不设置`Accept-Range`表明不接受范围请求。

浏览器发送范围请求时，通过`Range:bytes=start-end`，表明所要获取字节的范围，编号从0开始。如`Range:bytes=0-10`表示后去从0到10的11个字节。、

服务器收到范围请求后，获取到特定片段数据返回，通过`Content-Range:bytes=0-10/30`表明数据的范围，比请求多了文件总长。

范围请求也可用于断点续传等下载功能，获取到文件大小后，开启多个进程并分配各自的下载内容段落，出现意外时也只需重新下载特定的片段。
### 多范围请求
上述范围请求`Accept-Range`字段只有一个字节范围，但也可设置多个。

如：`Accept -Range:bytes=0-10,15-29`，此时获取两个范围的数据。

#### 响应报文中的变动
- 报文段中`Content-Type：multipart/byteranges`
- 主体数据也变为两个数据块，数据块的结构如下

![数据块结构](~@blogImg/multipart-chunk-data-format.png)

#### 例子

![请求两个范围数据](~@blogImg/multipart-chunk-data-res.png)

上述的几种方式，可根据实际场景结合使用。