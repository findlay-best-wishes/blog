---
title: 代码分割
date: 2021-04-01
tags: 
    - react
---

## Suspense + React.lazy + 动态import
- 在promise中进行组件的import。
- 通过React.lazy定义引入的组件为懒加载组件。
- 在Suspense中使用懒加载组件。

如：
``` jsx
//ComponentA.js和ComponentB.js默认导出组件
const CompA = React.lazy(() => import("./ComponentA.js"));
const CompB = Reac.lazy(() => import("./ComponentB.js"));

const App = () => {
    <React.Suspense fallback = {<div>loading...</div>}>
        <CompA />
        <CompB />
    </React.Suspense>
}
```
以上`import("../CompA.js")`需要返回Promise。需在webpack中配置，以解析动态import语法。
## 基于路由的代码分割
同样可利用上述原理根据路由进行代码分割：
``` jsx
const HomePage = React.lazy(() => import("./homePage.js"));
const LoginPage = React.lazy(() => import("./loginPage.js")):

const App = () => (
    <Router>
        <React.Suspense>
            <Switch>
                <Route path = "/" component = {HomePage} />
                <Route path = "/login" component = {LoginPage} />
            </Switch>
        </React.Suspense>
    <Router>
)
```