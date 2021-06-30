---
title: subscribe及diaptch
date: 2021-03-18
tags:
    - subscribe
    - dispatch
    - store
    - 订阅
    - acition
    - 分发
---

## class组件
在函数组件中获取并订阅具体`state`或者获取`dispatch`函数，可通过高阶组件的方式。

通过`connect`函数将`dispatch`函数和具体`state`通过`props`的方式传入组件中以供使用。

`connect`函数接收参数形式为`connect(mapStateToProps, mapDispatchToProps)`。两参数均为函数，函数执行后各自会返回包含最终`state`具体数据或最终`dispatch`方法的对象。如：
``` jsx
//引入connect函数，构造高阶组件
import {connect} from 'react-redux';

//在header组件中订阅state.username
//dispatch 更新用户名的 action

//两函数执行时redux内部会传入state及dispatch参数
const mapStateToProps = (state) => {
    return {
        username: state.usernmae,
    }
}

const mapDispatchToProps = (dispatch) => {
   return {
        changeUsername: (username) => {
            dispatch({
                type: "CHANGEUSERNAME",
                payload: username,   
            })
        }
   }
}

//组件props中可获取到state.username以及设置的dispatch方法
class Header extends React.Component {
    render(){
        const {username, changeUsername} = this.props;
        return (
            <div onClick = {() => changeUsername("findlay")}>{username}</div>
        )
    }
}

//调用connect方法生成高阶组件，此时响应state数据和dispatch方法会传入组件props中
export default connect(mapStateToProps, mapDispatchToProps)(Header);
```
## 函数组件
函数组件中可通过hooks的方式获取到state和dispatch方法。需要先引入`react-redux`npm module，从中引入`useSeletor`、`useDispatch`。如
``` jsx
import {useSeletor, useDispatch} from "react-redux";

const Header = () => {
    const username = useSeletor((state) => state.username)
    const dispatch = useDispatch();
    return (
        <div onClick = {() => dispatch({
            type: "CHANGEUSERNAME",
            payload: "findlay",
        })}>{username}</div>
    )
}

export default Header;
```
