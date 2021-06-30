---
title: concurrent UI
date: 2021-04-22
tags: 
    - react
next: false
---


通常在更新**state**时，我们期望页面变化立刻反映到屏幕上。而如果下一页面的代码和数据还未加载，就会显示白屏。通俗的说就是：下一页的渲染结果还没准备好，就早早的退出了当前页面。

这种情况，我们可能更希望在当前页面停留更久一点。可通过**Concurrent Mode**实现。
## useTransition
### 用法
``` jsx
function App(){
    const [page, setPage] = useState(1);
    const [startTransition, isPending] = useTransition({
        timeoutMs: 3000,
    })
    ...
}
```
- **startTransition**为延迟转换函数，接收函数作为参数，可对其中的**state**更新做延迟处理。可通过**timeoutMs**配置。
- **isPending**表示当前是否处于延迟处理阶段，可用于决定是否展示loading。

### 例子
``` jsx
const initialData = fetch("xxx");
function App(){
    const [data, setdata] = useState(initialData);
    const [startTransition, isPending] = useTransition({
        timeoutMs: 3000,
    })
    const onChange = () => {
        startTransition(() => {
            setData(fetch("xxx"));
        })
    }
    return (
        <>
            <button 
                onClick = {onClick} 
                disabled = {isPending}
            >click</button>
            {isPending ? <p>loading<p> : null}
            <p>{data.read()}</p>
        </>
    )
}
```
这样子，点击button后，仍会停留在当前页面，直至获取到data后渲染为新页面。

### Suspense+Transition：
``` jsx
const initialData = fetch("xxx");
function App(){
    const [data, setdata] = useState(initialData);
    const [startTransition, isPending] = useTransition({
        timeoutMs: 3000,
    })
    const onChange = () => {
        startTransition(() => {
            setData(fetch("xxx"));
        })
    }
    return (
        <>
            <button 
                onClick = {onClick} 
                disabled = {isPending}
            >click</button>
            {isPending ? <p>loading<p> : null}
            <Suspense fallback = {<p>loading data...</p>}>
                <p>{data.read()}</p>
            </Suspense>
        </>
    )
}
```
对于会引起组件**suspense**的**setState**最好用**transition**包裹。
## Suspense的惰性加载
**Suspense**组件加载方式为惰性加载，加载未完成时也不会影响兄弟组件以及外层组件的加载。

因此，对于一些耗时的组件，可用**Suspense**包裹，让父组件先忽略耗时组件，渲染准备就绪的组件。如：
``` jsx
function Article({resource}){
    return (
        <>
            <p>文章详情页</p>
            <Suspense fallbakc = {<p>loading content}>
                <Content resource = {resource} />
            </Suspense>
            <Suspense fallbakc = {<p>loading comments}>
                <Comments resource = {resource} />
            </Suspense>
        </>
    )
}
```
**Content**组件和**Comments**组件都需要获取数据。当进入该页面时，两组件的数据还未到达，处于挂起状态。但这不影响**Article**组件的渲染。**Article**组件会先渲染准备好的p标签以及两个降级p标签。当数据到来后，**Suspense**中组件会替代降级标签。实现了惰性加载。
## useDeferredValue
### 用法
可对指定值延时。
``` jsx
const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
});
```
比如resource正在更新，而这个更新需要消耗较长时间。如果不是很注重一致性，为了页面能尽早显示，可先使用之前的数据（即使面临数据过期的风险），新数据获取到后再更新组件。

所以，useDeferredValue可简单理解为：延长数据的有效期。 
## SuspenseList
当同时有多个`Suspense`并且组件内部的数据到达时间不确定时，会出现组件的挤压。

如：
``` jsx
function Article({resource}){
    return (
        <>
            <p>文章详情页</p>
            <Suspense fallbakc = {<p>loading content}>
                <Content resource = {resource} />
            </Suspense>
            <Suspense fallbakc = {<p>loading comments}>
                <Comments resource = {resource} />
            </Suspense>
        </>
    )
}
```
如果**Comment**数据到达时间早于**Content**数据。则**Comment**组件会出现在**Content**预期的位置。而**Content**数据到达后，**Content**组件会将**Comment**组件挤下去。

为了解决渲染的随机性，可通过**SuspenseList**解决该问题。
如：
``` jsx
function Article({resource}){
    return (
        <SuspenseList revealOrder="forwards">
            <p>文章详情页</p>
            <Suspense fallbakc = {<p>loading content}>
                <Content resource = {resource} />
            </Suspense>
            <Suspense fallbakc = {<p>loading comments}>
                <Comments resource = {resource} />
            </Suspense>
        </SuspenseList>
    )
}
```
SuspenseList中的`revealOrder="forwards"`配置表示列表中的Suspense按照树中顺序展开，而与请求到达的时间无关。其他的可选属性值有："backwards"和"together"。

如果指定`tail="collapsed"`。则最多只会看到一个降级界面。