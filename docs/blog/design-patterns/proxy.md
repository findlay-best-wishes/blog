---
title: 代理模式
date: 2021-08-10
tags:
    - 代理
    - proxy
    - 设计模式
---
代理模式中可为被访问对象提供替身对象，当对象不方便直接访问时通过替身对象控制对目标的对象的访问，访问者实际上访问的是替身对象，替身对象对访问做一定处理后再将请求转交给目标对象。
## 分类
代理应用非常广泛，根据代理的功能，可对代理做简单的分类。
- 保护代理，对象有不同访问权限时使用。
- 虚拟代理，对于一些开销比较大的对象，延迟到真正需要它时再创建。
- 缓存代理，可以为一些开销大的对象提供暂时的存储，在下次运算时，如果传递进来的参数与之前的一致，则可以直接使用存储的运算结果。
- 防火墙代理，控制网络资源的访问，保护主机。
- 远程代理，为一个对象在不同的地址空间提供局部代表。
- 智能引用代理，在访问对象时执行一些附加操作，比如计算被引用次数。
- 写时复制代理，通常用于复制一个庞大对象的情况，延迟了复制的过程，当对象被真正修改时，才对它进行复制操作，类似于虚拟代理。
后续会着重举例理解虚拟代理和缓存代理。
## 虚拟代理
虚拟代理有很多用处。
### 图片预加载
``` javascript
const myImage = (function(){
    const imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc(src){
            imgNode.src = src;
        }
    }
})();
```
上述代码可向body中添加图片，并且提供了设置src的方法，但在图片加载完成前该位置会显示白屏，可用预加载进行优化。

也就是在目标图片加载完成前使用本地备用图片，当目标图片加载完成后再用它替换本地备用图片。通过代理的实现方式如下：
``` javascript
const proxyImg = (function(){
    const img = new Image;
    img.onload = function(){
        myImage.setSrc(this.src);
    };
    return {
        setSrc(src){
            myImage.setSrc('./paidaxing.jpg');
            img.src = src;
        }
    }
})();
// 设置图片时有预加载功能。
proxyImg.setSrc('https://img0.baidu.com/it/u=3101694723,748884042&fm=26&fmt=auto&gp=0.jpg')
```
本例比较简单，通过正常方式也可实现，但通过代理遵守了单一职责原则。
### 合并http请求
对于一个文件同步的功能，当选中一个checkbox时，它对应的文件就会被同步到另一台服务器上。当频繁点击时，频繁的网络请求会产生巨大的开销。解决方案是，通过代理函数收集一段时间内点击的checkbox，一次性发送给服务器，可以减轻服务器的压力。
``` javascript
const syncFile = (file) => {
    console.log(file+'正在传输');
}
const proxySyncFile = (function(){
    const cache = [];
    let timer;
    return function(id){
        cache.push(id);
        if(timer){
            return 
        }
        timer = setTimeout(() => {
            syncFile(cache.join(','));
            clearTimeout(timer);
            timer = null;
            cache.length = 0;
        }, 2000)
    }
})();
for(let i = 0; i < 10; i++){
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = +i;
    checkbox.onclick = function(){
        if(this.checked){
            proxySyncFile(this.id);
        }
    }
    document.body.append(checkbox)
}
```
## 缓存代理
缓存代理可以为开销比较大的计算结果提供暂时的存储，下次获取该结果时，直接返回存储的结果。实例如下：
### 高运算量缓存
``` javascript
// 计算乘积的函数，仅用于演示代理
function muti(...args){
    return args.reduce((res, num) => res * num, 1);
}

// 可以为用于运算的函数提供缓存的代理方法
function proxyCompute(func){
    const cache = {};
    return function(...args){
        const key = args.sort().join('');
        return cache[key] || (cache[key] = func(...args));
    }
}
// 被代理的计算乘积计算函数
const proxyMuti = proxyCompute(muti);
// mock的数据量
const arrNum = new Array(10000).fill(1.23456789);

// 第一次计算
proxyMuti(...arrNum);

// 第二次计算时直接读取第一次的结果
proxyMuti(...arrNum);
```
### 数据请求缓存
分页数据的缓存示例如下：
``` javascript
// server.js
// 提供getBooks接口，根据页数返回数组数据
const http = require('http');
const mockData = [];
for(let i = 0, index = 0; i < 3; i++){
    mockData[i] = [];
    for(let j = 0; j < 5; j++){
        mockData[i].push(`book${index++}`);
    }
}
const server = http.createServer((req, res) => {
    const params = req.url.split('/');
    if(params[1] === 'getBooks'){
        res.end(JSON.stringify(mockData[params[2]] || []));
    } else {
        res.end(JSON.stringify('请求路径错误'));
    }
})
server.listen(3000, () => {
    console.log('server is running at port 3000');
})
```
``` javascript
// client.js
// 使用缓存代理请求getBooks接口
const fetch = require('node-fetch');

function proxyRquest(){
    const cache = {};
    return function(url){
        if(cache[url]){
            console.log(url + '缓存可用');
            return Promise.resolve(cache[cache[url]]);
        } else {
            console.log(url + '无缓存可用')
            return fetch(url)
                .then(res => res.json())
                .then(data => {
                    cache[url] = data;
                    return data;
                })
        }
    }
}

const request = proxyRquest();
const url = 'http://localhost:3000/getBooks/';
request(url + '0')
.then(data => {
    console.log(data);
});

request(url + '1')
.then(data => {
    console.log(data)
});

setTimeout(() => {
    request(url + '0')
    .then(data => {
        console.log(data)
    });
}, 3000)
```
代码过于简略，请见谅。
## 高阶函数动态创建代理
通过向高阶函数传入所要代理函数，可动态创建代理，之前的`ProxyCompute`就用到了该方法。除了代理乘法之外，还可代理任意计算方法。


