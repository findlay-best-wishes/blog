---
title: commit阶段
date: 2020-12-27
---

commit 阶段会根据 render 阶段得出的 effectList 和 fiber 节点的 updateQueue 进行实际的 DOM操作 层面的更新，并执行相应的 lifecycle 函数。

## 三个阶段
commit 阶段进行具体的 DOM操作，可根据 DOM 操作是否完成话分为三个小阶段。
- before mutation，执行DOM操作前。
- mutation，执行 DOM 操作。
- layout，DOM 操作完成后。

## before mutation
before mutation 阶段要为后续阶段做准备，该阶段主函数为 `commitBeforeMutationEffects`，执行三个任务。
- 处理 autofocus 和 blur 的相关逻辑。
- 执行 getSnapshotBeforeUpdate 函数，在  `commitBeforeMutationLifecycles` 中进行调用。
- 进行 useEffect 的异步调度，在 `scheduleCallback` 中通过 `flushPassiveEffects` 根据 rootWithPendingPassiveEffects （相当于 effectList 的全局变量，以链表的形式保存具有 passiveEffect 的 Fiber Node）执行 effect 回调函数。但此时进行调用，rootWithPendingPassiveEffects还未被赋值，赋值在其他阶段进行，从而形成了 useEffect 的异步调度。

### useEffect的异步调度
1.before mutation 阶段在 `scheduleCallback` 中调度 `flushPassiveEffects`。

2.layout 阶段对 rootWithPendingPassiveEffects` 进行赋值。

3.触发 `scheduleCallback` 调度 `flushPassiveEffects` 对 rootWithPendingPassiveEffects 进行遍历，完成 useEffect 的调度。
#### 异步调度的原因
防止同步执行 useEffect 时阻塞页面渲染。
## mutation 阶段。
mutation 阶段进行 DOM 操作。在主函数 `commitMutationEffect` 内遍历 effectList。会对遍历到的节点做三件事。
- 根据 contentReset 标志决定是否重置文本节点。
- 更新 Ref。
- 根据 effectTag 分别处理，进行相应的 DOM操作，接下来对具体的处理方式做一探究。

### Placement effect
节点含有 Placemeng effectTag 时意味着需要进行插入操作，在 `commitPlacement` 函数内执行，分为多步。

1.获取到 parent node。

2.获取到 sibling node，获取sibing node十分耗时，因为Fiber Tree 和 DOM Tree在层级上不是一一对应的。

3.sibing node存在时执行 `insertBefore`，否则执行 `appendChild`。

### update effect
节点含有 Update effectTag时意味着需要更新。会在 `commitWork` 函数中根据 tag 进行处理。

#### Function Componennt
对于函数组件，会执行 useLayoutEffect 的销毁函数。
#### Host Component
会在 `commitUpdate` 中通过`updateDOMProperties` 根据 render 阶段中生成的 updateQueue，进行 props 的更新。
### deletion effect
这种情况下意味着节点需要在 Fiber Tree 和 DOM Tree 中被移除。在 `commitDeletion` 中进行，会完成三个任务。
- 递归的调用当前组件及其子孙组件中 class component 的 componentWillUnmount 生命周期钩子，从 Fiber Tree 和 DOM Tree 中移除当前节点。
- 解绑 Ref。
- 调度 useEffect 的销毁函数。

## layout 阶段
layout 阶段时 DOM操作已经完成，可访问到更新后的 DOM节点。在阶段一开始就会将 FiberRoot 的 current 属性指向新的 Fiber Tree。

本阶段通过 `commitLayoutEffect` 对 effectList 进行遍历。对遍历到的节点做两件事。
- 调用生命周期钩子，处理 hook。在 `commitLifecycles` 中执行。
- 赋值 Ref，在 `commitAttachRef` 中执行。

### commitLifecycles
- 对于 Class Component，在 mount 阶段会执行     `componentDidMount`，在 update 阶段会执行 `componentDidUpdate`。
- 对于 Function Component，会执行 useLayoutEffect 的销毁函数，调度 useEffect 的销毁与回调函数。从此可看出 useEffect 和 useLayoutEffect 在执行时机上的区别。useLayoutEffect 在 mutation 阶段执行销毁函数，在更新完成后执行回调函数，同步执行。而 useEffect 在before mutation阶段开始调度，但要等到 layout阶段再执行，以异步的方式执行。 



