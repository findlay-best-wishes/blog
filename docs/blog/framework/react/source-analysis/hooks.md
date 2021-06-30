---
title: hooks
date: 2021-01-20
---


## 理念
Hooks 常常会和生命周期函数相比较，但两者相差甚远。生命周期函数是为了可在顶层参与到 React 的运行流程中，方便开发者上手。

而 Hooks 本身更加贴近于 React 内部运行的原理。
## 原理
状态更新时会创建 Update，类似于此，FunctionCOmponent 在调用 Hooks 时，也会提前准备好 Hooks 对象，

对于 FunctionComponent， Hooks 对象会以链表的形式存储在 `Fiber.memoized 中。

源码中，Hooks 对象具体为 dispatcher 对象。在应用中，Hooks 对象也区分时机，在 mount 和 update 两种场景会调用不同的 Hooks。所以有多种不同的 dispatcher。

在 FunctionComponent render前，React 会区分当前为 mount 还是 update，并将不同情况下相应的 dispatcher 赋值给 `ReactCurrentDispatcher.current`。在 render 阶段，从 ReactCurrentDispatcher.current` 里查找所需 dispatcher。
## 存储结构
hook 对象的结构如下：
```
const hook = {
    memoizedState,
    baseState,
    baseQueue,
    queue,
    next
}
```

`hook.memoizedState` 中存储单个具体 hook 相关信息。具体如下：
- useState：对于 `const [num, updateNum] = useState(0)`，`memoiezdState` 中存储 state 的值。
- useEffect：会存储 useEffect 回调函数、依赖项等其他信息。
- useRef：对于 `useRef(1)`，会存储`{current: 1}`。
...

有的 hook 没有 `memoizedState`，比如：useContext。
## useState 和 useReducer 的工作原理
useState 和 useReducer 非常相似。两个 Hook 的工作流程分为申明阶段和调用阶段。
### 申明阶段
申明阶段也就是useXXX的调用。如：
```
const [age, updateAge] = useState(0);
const [num, dispatchNum] = useReducer(reducer, {a: 1);
```
申明阶段在 mount 和 update 会区别处理。
#### mount
mount 阶段，useState 会调用 mountState，useReducer 会调用 mountReducer。这两个方法大体相同。执行流程如下：
- 创建并返回当前的 hook，需调用 `mountWorkInProgressHook`。
- 给 state 赋初值。
- 创建 queue，queue 的结构如下：
```
const queue = {
    pending,
    dispatch,
    lastRenderedReducer,
    lastRenderState
}
```
- 再创建 dispatch。
- 返回 state 和 dispatch，即：`return [hook.memoizedState, dispatch]`。

两个 hook 的区别只在于 `queue.lastRenderedReducer` 的值不同，useReducer 的取值为 传入 mountReducer 的 reducer 参数，useState 的取值为 内部预定的 basicStateReducer。
#### update
update 时，两个 hook 都调用 updateReducer。先获取到 hook，在根据 update 计算该 hook 的新 state 并返回。

update 与 mount 的一大区别在于，mount 阶段的 render 只会执行一次。而 update 的 render 过程中，可能会触发新一轮的更新，触发多次 render。

为了避免无意义 render，React 通过标记变量来判断此次更新是否为 render 阶段产生的更新。获取 hook 也会区别这两种情况。
### 调用阶段
调用阶段也就是 dispatch 的调用。如：上述申明中 `updateAge` 的调用。

调用阶段会调用 `dispatchActon`，需要将 `fiber`、`hook.queue` 作为参数传入，工作流程如下：
- 创建 update。
- 将 update 加入 `queue.pending`。
- 进行调度。

调度也分为多种情况，和申明阶段一样，同样会检测并单独处理 render 阶段产生的更新。

另外，调度中还有一条优化路径。当 fiber 中不存在 update 时，则调用阶段所产生的 update 为 hook 上第一个 update。则可在调用阶段根据此 update 先进行一次 state 计算。

若计算结果和之前的相同，就不需要进行多余调度。若结果不同，则该计算结果仍可用于下个申明阶段state计算的初始值。
## useEffect 工作原理
useEffect 工作流程在 commit 章节已总结过。工作原则大致为：
- useEffect销毁函数的执行、回调函数的执行都在layout 阶段完成布局后进行。
- 必须先完成所有的 销毁函数，才能执行回调函数。
## useRef
### ref的创建
和其他 hooks 一样，useRef 在 mount 和 update 阶段有不同的 dispatch。
#### mount
- 调用 `mountRef`。
- 获取当前的 useRef hook。
- 创建 ref 对象，即 `const ref = {current: initialValue};`。
- 将 ref 保存到 `hook.memoizedState`
- 返回 ref。
#### update
upate 阶段先获取到相关的 hook，直接返回 `hook.memoizedState` 即可。
### ref 工作流程
React 中，HostComponent、ClassComponent 和 ForwardRef 节点可赋值 ref 属性。本节只讨论 前两种组件中 ref 工作流程。

ref 工作流程分为两部分：
- render 阶段：为还有 ref 属性的 Fiber 添加 Ref ffectTag。
- commit 阶段：为包含有 Ref effectTag 的 Fiber 执行对应操作。
#### render 阶段
- beginWork 和 completeWOrk 中 都有 `markRef` 同名函数及其调用。
- 在 beginWork 中为 ClassComponent 添加 Ref effectTag。
- 在 completeWork 中为 HostComponent 添加 Ref effectTag。
- 添加 Ref effectTag 的条件：mount 时节点存在 ref 属性，update 时节点 ref 属性改变。
#### commit 阶段
commit 阶段根据 effectTag 进行 DOM 操作。
##### mutation 阶段
节点销毁、ref的改变，都需要先清除 ref。清除 ref 的操作在 mutation 阶段完成，需要调用 `commitDetachRef`。

对于 FunctionRef，通过 `ref(null)` 的方式清除。

对于 其他的，通过 `ref.current = null` 进行清除。
#### layout 阶段
layout 阶段可对 ref 进行赋值，调用 `commitAttchRef`。

通过`ref(instanceToUse)` 或者 `ref.current = instanceToUse` 进行赋值。
## useMemo 和 useCallback 工作原理
useMemo 和 useCallback 区别在于：在变化后，前者返回计算值，而后者返回计算的函数。

它们在 mount 和 update 也有区别。
### mount
- 获取当前 hook。
- 根据传入依赖值确定下一个依赖值。
- useMemo 内部需要执行传入函数，并将计算结果作为 value；useCallback直接将 传入函数作为 value。
- 将 value 和 依赖值存储到 `hook.memoizedState`，并返回 value。
### update
update 阶段和 mount 阶段区别在于：update 阶段需要比较当前的依赖值 和 之前的依赖值是否发生变化。

未发生改变时，则直接返回 value。
发生改变时，重新进行结算，重新将 value 和 依赖值进行存储，再返回。

