---
title: suspense
date: 2021-04-21
tags: 
    - react
---

`Suspense`组件可用于包裹包含数据请求的组件，并且可监听到数据请求的状态，控制渲染。
如：
``` jsx
function Detail(){
    const [data, setData] = useState(null);
    useEffect(() => {
        const data = await fetch("");
        setData(data);
    })
    return <div>{data}</div>
}

function App(){
    <>
        <Suspense fallback = {<p>loading</p>}>
            <Detail />
        </Suspense>
    </>
}
```
在`Detail`组件进行数据请求时，`App`组件渲染`Loading`，请求完成后渲染`Detail`组件。

`React`组件和数据请求都有各自的生命周期，而`Suspense`可将两个生命周期联系起来，前提是数据请求方法支持`Suspense`特性。
## Suspense vs 传统实现方法
数据请求与渲染之间的控制有三种方案。分别为：`fetch-on-render`、`fetch-then-render`和`render as you fetch`。
### fetch-on-render
先渲染组件，在`useEffect`或生命周期函数中请求数据，收到数据后触发更新。

#### 不足
该方式会引发“瀑布问题”。如同一组件树中外层组件A和内层组件B需要数据请求。而在渲染过程中，`A`组件的数据请求发送后需要一直等待响应。收到响应后`B`组件才能请求数据。本应并行发送的请求，变成了串行发送。

而数据请求常常伴随着组件更新，触发连锁的“瀑布问题”，影响性能。
### fetch-then-render
先尽可能获取下一屏所需数据，数据完全拿到之后，再渲染。（如不使用`Suspense`的`Relay`）。

具体做法可以是：
- 将组件树中请求提取出来，在渲染之前通过`promise`进行请求。
- 在组件内部，根据请求组件依赖数据的`promise`的状态更新组件内部状态状态。
#### 不足
- 在数据请求失败或者数据过期时，很难写出健壮可靠的组件。
- 随着数据和组件的复杂度的增加，不利于维护。

fetch-on-render是屈服于现实的一种选择，更加实际。

### render as you fetch(使用suspense)
- 尽可能早的发送下一屏的数据请求，发送完后会维护该请求的对象-`resource`（包含请求是否完成、响应数据等）。
- 发送完请求后，立即开始渲染组件。不需数据请求的组件可直接渲染。
- 需要响应数据的组件需读取`resource`对象，检测到该请求尚未完成时，会将该组件状态标记为挂起，暂时跳过渲染。继续渲染其他组件。
- 当`Suspense`中包含有挂机状态组件，就会渲染`fallback`内容。
- 当数据请求陆续完成，会依次渲染出更加完成的组件树。直至全部完成，渲染到屏幕上。
## 总结
通过`Suspense`，可以更加精细的控制加载状态的粒度，而无需过多的模板代码。同时解决了“瀑布问题”，且未引入可维护性和健壮性方面的问题。