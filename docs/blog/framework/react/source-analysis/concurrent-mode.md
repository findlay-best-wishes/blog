---
title: concurrent mode
date: 2021-01-21
next: false
---

## 组成概览
Concurrent Mode 是 React 的三种模式之一，是 React 未来发展的方向。Concurrent Mode 组成部分：
- 底层架构 - Fiber 架构，Fiber 架构意义在于，将单个组件作为工作单元，实现了以组件作为粒度的更新。
- 架构的驱动 - Scheduler。
- 架构的运行策略 - lane 模型。

基于 Concurrent Mode，上层可实现一些新功能：batchedUpdates、Suspense、useDeferredValue 等。
