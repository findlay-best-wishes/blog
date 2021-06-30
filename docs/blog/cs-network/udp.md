---
title: udp
date: 2020-04-26
---

## 实现功能
### 多路复用、多路分解
与tcp所实现的区别在于:传输层接收到报文段时，指向同一端口号的所有报文段都会被传入同一udp socket。而tcp中，指向同一端口，不同源端口或源IP报文段会分别传入应用进程下的  多个子socket线程（每个子线程socket对应一种来源）。
### 差错检测（检验和）
检验报文段从源到目的地过程中比特数是否改变。
1.计算检验和。
2.将计算检验和放入首部行中。
3.目标接收到后，将全部16比特字（包括检验和）相加，值得各位全为1时，表明没有差错；有差错时告知进程，进一步处理。只能告知进程是否有差错，不能告知具体差错。
## 报文格式
- 首部

源端口号|目的端口号
:-:|:-:
长度|检验和
- 应用数据（报文）

|应用数据（报文）|
|:-:|

## 特点及优点
- 无需连接建立
无需三次握手，减少时延。
- 无连接状态
无需维护连接状态（发送接收缓存、拥塞控制参数、序列号与确认号参数），不用跟踪参数，可支持更多活跃客户。
- 首部开销小
tcp报文首部20位，udp首部8位。
## 应用场景
常用于电话、视频会议、网络控制等。