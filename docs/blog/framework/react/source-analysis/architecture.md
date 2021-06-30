---
title: React架构
date: 2020-12-25
---

## 工作阶段总览
react 有三个工作阶段。
- schedule 阶段，由 **Scheduler** 完成。
- render 阶段，由 **Reconciler** 完成。
- commit 阶段，由 **Renderer** 完成。
## render阶段
### 简述
render 阶段开始于`performSyncWorkOnRoot`函数或`performConcurrentWorkOnRoot`函数的调用，前者为同步更新，后者为异步更新。

上述两个函数都会调用`performUnitOfWork`根据传入的`wrokInProgress`参数（**workInPorgress Fiber Tree** 中的节点），构建出下一个 **Fiber Node**，赋值给 **workInProgress**，再将 **workInProgress** 与上一个 **Fiber Node** 连接构成 **Fiber Tree**，继续在while循环中调用`performUnitOfWork`，遍历完所有节点。对于异步更新，在while循环中还需判断当前帧是否有剩余时间。
### performUnitOfWork
**render** 阶段从 **rootFiber** 开始递归的调用`performUnitOfWork`对 **Fiber Tree** 进行深度遍历，构建新树。

对于每个遍历到的节点，都会先执行 `beginWork` 方法，根据传入**Fiber Node** 构建 **child Fiber Node**，并将这两个节点连接起来。遍历到叶子节点时，开始回退，对之前执行过 `beginWork` 的节点再去执行 `completeWork`。如果该节点存在 **sibling Fiber** 时，再从兄弟节点开始向下进行 `beginWork` 的处理，没由兄弟节点时，继续向上回退对父节点进行 `completeWork` 的处理。直至执行完 **rootFiber** 的 `completeWork`，render阶段任务完成。

### beginWork
**workInProgress Fiber** 的 `alternate` 属性指向 **current Fiber** 中对应的节点（称为 **current**），可根据 **current**存在情况判断当前为 **mount** 还是 **update**。
#### update
当更新前后 `props` 和 `type` 不变，可直接复用 **current** 的 **child Fiber**，否则需要新建 **Fiber Node**。
#### mount
**mount** 时，除了 **rootFiber** 之外没有节点可以复用。需要根据 `Fiber.tag` 进入不同的创建逻辑，创建 **childFiber**。
#### 节点的创建
对于常见的 tag（**Function Component**、**Class Component**、**Host Component**），会进入 `reconcileChildren` 逻辑。对于 **mount** 任务，调用 `mountChildFibers` 创建子节点；对于 **update** 任务，调用 `reconcileChildrenFibers` 根据 `current.child` 和 **Diff** 算法，创建子节点，并将所需的 Dom操作加入 **effect Tag**。
最终创建出的子节点会赋值给 `workInProgress.child`，并作为之后 `performUnitOfWork` 中 `workInProgress` 的参数值。
### completeWork
`completeWork` 也会根据 `tag` 的值执行不同的处理逻辑。
#### Host Component
对于 **Host Component**，会对 **mount** 任务和 **update** 任务区别处理。
##### update
主要是对 **props** 进行处理，包含事件处理函数、样式和 **children** 的 **props**，处理的 **props** 会保存在 `workInProgress.updateQueue` 中，在 **commit** 进行渲染。
#### mount
**mount** 阶段，**Host Component** 所对应的 **Dom** 还没有创建。需要先创建对应真实 **Dom**，再将子孙 **Dom** 插入新建好的 **Dom** 中，以上操作都是在内存中进行。然后再对 **props** 进行处理。
### effectList
在执行完 `completeWork` 后，带有 **effectTag** 的 **Fiber** 会被追加到 **effectList** 中。**effectList** 为一条单向链表，`rootFiber.firstEffect` 指向它的头部，`rootFiber.lastEffect` 指向它的尾部。在 **commit** 阶段，直接遍历 **effectList**。