---
title: 状态更新
date: 2020-01-19
---

## 流程概览
### 触发状态更新的方式
- ReactDOM.render
- this.setState
- this.forceUpdate
- useState
- useReducer

这些方式所触发的状态更新都会接入同一套状态更新机制。

每次状态更新都会创建一个保存状态更新相关信息的对象，称为 Update，Update 相关信息保存在 updateQueue中。在 render 阶段，会根据 Update 计算新的 state。
### 流程
1.触发状态更新

2.创建 Update 对象

3.从触发状态更新的 Fiber 节点，向上遍历找到 rootFiber 并返回（render 阶段从上往下遍历）

4.通知 scheduler 根据本次更新的优先级，决定以同步还是异步的方式调度 Update。

5.render阶段

6.commit阶段
## Update 对象
上文中提到，触发状态更新后首先会创建 Update 对象，不同的触发方式触发不同的 Update。
### 分类
根据触发的来源可分为：
- 第一类：ClassComponent 和 HostRoot 所创建的。
- 第二类：FunctionComponent 所创建的。
### 对于ClassComponent 和 HostRoot
ClassComponent 和 HostRoot 所创建的 Update 结构如下：
```
const Update = {
    eventTime,
    lane,
    suspenseConfig,
    tag,
    payload,
    callback,
    next
}
```
- `eventTime` 为任务时间。
- `lane` 为优先级字段。
- `suspenseConfig` 为和 suspense 相关的配置。
- `tag` 为更新的类型，包括：`UpdateState`、`ReplaceState`、`ForceUpdate`、`CaptureUpdate`。
- `payload` 为本次更新挂载的数据，对于 ClassComponent，`payload` 为 `this.setState` 的第一个参数；对于 HostRoot，`payload` 为 `ReactDOM.render` 的第一个参数。
- `callBack` 为更新的回调函数。
- `next` 指向下一个 Update，与其他 Update 相连构成链表。
### UpdateQueue
和 Update 相似，UpdateQueue 也有多种结构，之前的 HostComponent 中的 UpdateQueue 以数组的形式存储 `props`。

除次之外还有两种结构的 UpdateQueue 和 两种 Update 分别对应。
#### 对于ClassComponent 和 HostRoot
##### Update 不止一个
Update 的 `next` 属性可连接其他 Update，当一个 Fiber 节点中触发多个状态更新（比如多次的`this.setState`调用，这时会创建多个 Update，这时 多个 Update 可根据顺序通过 `next` 存储为链表。

##### 结构
UpdateQueue的结构如下：
```
const UpdateQueue = {
    baseState,
    firstBaseUpdate,
    lastBaseUpdate,
    shared:{
        pending,
    },
    effects,
}
```
- `baseState`：为本次更新前 Fiber 节点的 state，之后根据该 state 计算更新后的 state。
- `firstBaseUpdate` 和 `lastBaseUpdate`：为本次更新前该 Fiber 节点保存的 Update。以链表的形式存储，以 `firstBaseUpdate` 为链表头，以 `lastBaseUpdate` 为链表尾。存在的原因为在之前的更新中，由于这些 Update 的优先级较低，在 render 阶段有 Update 计算 state 时被跳过。
- `shared.pending`：触发更新时，新产生的 Update 以环状链表的方式存储到 `shard.pending`，当由 Update 计算 state 时，解环并连接到 `lastBaseUpdate` 后面。
- `effects`：以数组的形式存储 `callback` 属性不为空的 Update。
## 优先级
状态更新由用户交互产生，有多个状态更新需要处理时，需要根据任务的紧急程度，优先处理高优先级的任务，不能让用户久等了，之后再处理较低优先级任务。
### 分类
优先级有如下几种：
- 生命周期方法：同步执行。
- 受控的用户输入：如输入框输入文字，同步执行。
- 用户交互：如动画，高优先级。
- 其他：如数据请求，低优先级。
### 基于优先级的调度
#### 调度开始后
- 需要调度时，调用 Scheduler的 `runWithPriority` 方法。
- 该方法接收一个 **优先级常量** 和 一个 **回调函数**作为参数。会根据优先级将回调函数放到定时器中，在合适的时间触发。
- 上一步的回调函数也就是 render 阶段的入口，即 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`。
#### 进入 render 阶段后
render 阶段需要处理一系列的任务，可中断，可恢复。存在两个机制。
##### 高优先级更新任务插队
当某次更新在 render 阶段还未结束，又出现了较高优先级任务。React 会将本次更新的信息存储到 UpdateQueue 中（Current Fiber 和 WorkInProgress Fiber 的 UpdateQueue 都会存储），暂时中断本次更新，直接处理更高优先级的更新）。

在处理完高优先级任务后会完成 Fiber Tree 的替换，之前低优先级任务的 UpdateQueue 也保存到了更新之后的 Current Fiber 中，继续执行中断任务时，就可根据 UpdateQueue 继续执行。
##### 低优先级 Update 被跳过。
- 在计算 Fiber 节点的新 state 时，需要根据 `baseState` 遍历 `firstBaseUpdate` 计算新 state。
- 会先根据较高优先级 Update 计算，跳过较低优先级 Update。
- 较低优先级 Update 及后面的 Update 会作为 下一次更新时 UpdateQueue 的 `firstBaseUpdate`，继续遍历。
- `shared.pendings` 以优先级从高到低的顺序链式存储当前更新任务产生的 Update，计算 state 时破环并将链表尾部连接到 `lastBaseUpdate`。

以上两个机制使得任务中断后 Update 不丢失 以及 跳过低优先级的同时保证状态依赖的连续性。
## React的模式及入口函数
React 提供三个入口函数，分别可开启相应的模式。
- `ReactDOM.render`，开启 legacy 模式，也是目前默认使用的模式。
- `React.createBlockingRoot`，开启 blocking 模式，将作为 legacy 和 concurrent 模式的过渡模式。
- `React.createRoot`，开启 concurrent 模式，面向未来的开发模式。







