---
title: redux toolkit
date: 2021-05-27
next: false
tags: 
    - redux
    - aimer
    - rtk
---

## 概述
之前所用的redux架构所用的模板代码过多，比如：
- 需要定义`actionCreator`
- 在`reducer`中需要通过`switch`语句条件处理。
- 不可变数据流的模板代码

redux toolkit是对redux的进一步封装，内部原理相同，用于减少模板代码，便于开发。
## 初步使用
### slice
像之前架构中`reducer`可分为多个子reducer维护各自状态，`state`可分为多个子`state`。

rtk(redux toolkit)中将store分为多个slice，slice对象中保存`action`、`reducer`、`extraReducer`。

#### 创建slice
``` js
import {createSlice} from "@reduxjs/toolkit";

const initialState = {username: "", isLogin: false};
const userSlice = createSlice({
    name:"user",
    initialState,
    reducers: {
        changeUsername: (state, action) => {
            state.username = action.payload;
        },
        changeLoginStatus: (state, action) => {
            state.isLogin = action.payload;
        }
    }
})
```

以上代码即创建了一个`slice`，设置了命名空间-`user`、`initialState`、`reducer`。可通过`userSlice[reducer]`、`userSlice[actions]`获取到reducer和action。

与之前的架构有所区别：
- 摒弃了`switch`语句，思想类似于依据每个`action.type`都创建一个只有`default`处理的`reducer`。
- 以直接修改`state`的方式实现不可变数据流。得益于底层引入`immer`对state的进一步处理。但最终没有违背`redux`的不可变数据流。
### store配置
``` js
import {configStore, combineReducers} from "@reduxjs/toolkit"
import {lanuageSlice} from "./language/languageSlice.ts";
import {usernameSlice} from "./user/userSlice.ts";
import {actionLog} from "./middleware.ts"

const rootReducer = combineReducers({
    lanuage: lanuageSlice.reducer,
    user: usernameSlice.reducer,
})

const store = configStore({
    reducer: rootReducer,       
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(),actionLog]
})
```
### dispatch
创建`slice`时其实已经创建好了`actionCreator`。可通过`slice.actions[action1](arg)`创建`action`并`dispatch`。如：
``` js
import {userSlice} from "./userSlice.ts";
import {store} form "./store.ts";

store.dispatch(userSlice.actions.changeUsername("liMing"))
```
## thunk action
`rtk`默认集成了`redux-thunk`。可用于创建函数action用于进行异步操作。如:
``` js
import {createAsync} from "@reduxjs/toolkit"

const fetchData = createAync(
    "user/fetchData",     //只在user slice下可用
    async(userId) => {
        dispatch(userSlice.actions.fetchStart());
        try {
            const {data} = await axios.get("");
            dispatch(userSlice.actions.fetchSuccess());
        } catch(e){
            dispatch(userSlice.action.fetchFail(e));
        }
    }
)

const userSlice = createSlice({
    name: user,
    initialState,
    reducers: {
        fetchStart : () => {},
        fetchSuccess : () => {},
        fetchFail : () => {},
    }
})
```
以上过程为根据`userId`获取`username`的过程，其中三个`action creator`需在`slice[actions]`中预定义。
## extraReducers
上述例子中，获取数据时会返回`promise`，我们根据`promise`的状态手动处理，分发了三种情况下对应的`action`。可通过`extraReducers`自动根据返回`promise`的状态处理。之前案例可改写为：
``` js
const fetchData = createAsync(
    "user/fetchData",
    async (userId) => {
        const {data} = await axios.get("");
        return data;
    }
)

const userSlice = createSlice({
    name: user,
    initialState,
    extraReducers: {
        [fetchData.pending.type] : () => {},
        [fetchData.fulfilled.type] : () => {},
        [fetchData.rejected.type] : () => {},
    }
})
```
可根据promise的状态自动处理。
