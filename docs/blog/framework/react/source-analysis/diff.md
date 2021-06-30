---
title: diff算法
date: 2021-01-19
---

## 概览
#### Diff场景
当元素处于 update 阶段，并且元素的 props、type 和更新前的不完全一致，子 Fiber 节点就不可以直接复用，需要重新构造子 Fiber 节点。

Diff 算法的本质是对比当前的 Fiber 节点（Current Fiber）和 ReactElement，然后生成新的 Fiber 节点（WorkInprogress Fiber）。

#### Diff原则
对一个 Fiber Tree 进行完全的 Diff 所需的时间复杂度为n³，当 Fiber Tree 中节点稍多时，性能就很差。React 依据三个 Diff 对比原则，将时间复杂度从 n³ 降至 n。

- 只对同一层级节点进行 对比，不考虑跨层级复用。
- 不同类型元素创建不同的树。
- 可通过 key 属性使子元素在更新中进行稳定的复用。
## 实现
Diff 的入口函数为 `reconcileChildFiberss`，该函数会根据 ReactElement 的类型调用不同的处理函数。类型为 `string`、`number`、`object`之一时同级只有一个节点，类型为`array`时同级有多个节点。
### 单节点Diff
即子节点只有一个，判断是否可复用之前存在的 DOM 节点。
1. 判断 ReactElment 和 当前 Fiber 节点的 `key` 是否相同。不同则删除该 Fiber 节点，继续 与 Fiber 节点的 Sibling Node 进行新一轮 Diff，一直遍历直到跳出循环；相同则继续对比 它们的`type`。
2. `type`相同时，可直接复用，直接返回复用节点；不同时，删除该 Fiber 节点及其所有 Sibling Node，去创建新的 Fiber Node 并返回。
### 多节点Diff
多节点 Diff 是对 Children（Array 形式）和 Current Fiber（LinkedList 形式）进行遍历对比。对于Children，通过改变下标进行遍历，对于Current Fiber 通过 `sibling` 指针进行遍历。

多节点 Diff 在策略上进行两轮遍历。
1. 处理更新的节点。（相对于新增和删除，更新组件频率更高）。
2. 处理剩下的（不属于更新的）节点。
#### 第一轮遍历
1.比较 `Children[0]` 和 Current Fiber，判断 DOM 节点，是否可复用。

2.可复用时，`i++; current = current.sibling`，继续遍历比较后面节点。

3.不可复用时，分两种情况：
- key 不同导致的不可复用，立即跳出整个遍历，第一轮遍历直接结束。
- key 相同但 type 不同导致的不可复用，会将 Current Fiber 标记为 Deletion，继续向后遍历。

4.当 Children 和 Current Fiber 有一方遍历完时，跳出整个遍历，第一轮遍历结束。

第二轮遍历根据第一轮遍历的结果，处理非更新的情况。
#### 第二轮遍历
第二轮遍历有多种情况。
#####  Children 和 Current Fiber 同时遍历完
这种情况，无需进一步处理，Diff 直接结束。
##### Children 遍历完，Current Fiber 未遍历完
这种情况，Current Fiber 有多余节点，之前未遍历到的须标记为 Deletion。
##### Current Fiber 遍历完，Children 未遍历完。
这种情况，Chilren 中未遍历到元素，之前都不存在，须标记为 Placement。

##### 两者都未遍历完
这种情况，必定存在同一层级中位置移动的情况。

位置移动的准则：节点只可按照在Children中出现的顺序依次向右移动。
###### 实现思路
- 在 Children 和 Current Fiber 中的节点都有自己的 key、index。
- 以 Current Fiber 中的 `key` 作为 key，Current Fiber 作为 value，存储到 Map 中。
- 维护好 lastPlacementIndex（上一个可复用节点在 Children 中的 index，初始值为 0），继续遍历未遍历到的 Children，根据 Children 的 key，在 Map 中查找到 Current Fiber，再查找到 Fiber 的 index（`Fiber.index`)。
- 比较 lastPlacementIndex 和 `Fiber.index`，若 lastPlacementIndex <= `Fiber.index`，则该节点不需移动，并维护 lastPlacementIndex 的为 `Fiber.index`，继续遍历下一个 Children。
- 若 lastPlacementIndex > `Fiber.index`，则该节点需要移动到右边。
- 不断比较，遍历完整个 Children。
