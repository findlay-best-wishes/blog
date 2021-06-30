---
title: hooks
date: 2021-04-05
tags: 
    - react
---

## 动机
- 组件之间复用状态逻辑。
- 将组价拆分为更小的粒度。将组件中相关关联的部分，拆分到一个函数中，而非按照生命周期函数拆分到各处。
- 在函数组件中使用类组件中的特性，如state、各种声明周期函数等。
## 规则
只能在React组件顶层中调用hook，不可在条件语句中调用hook。
## 常见hook
### useState
### useEffect
useEffect中可进行副作用操作。如数据订阅：
``` jsx
useEffect(() => {
    DataSource.subscribe();
})
```
传入函数的返回值可设置销毁函数，在组件卸载前调用，类似于生命周期函数`componentDidUnmount`。如：
``` jsx
useEffect(() => {
    DataSource.subscribe();
    return () => {
        DataSource.unsubscribe();
    }
})
```
useEffect还可接收数组作为第二个参数，当每次render时，当数组中元素发生变化时，才会执行useEffect。因此：

无第二个参数时，每次render都会执行useEffect。如上述例子。

第二个参数为空数组时，只会在第一次render时执行useEffect。行为类似于`componentDidMount`。

第二个参数为包含元素的数组时，数组元素全部无变化时会跳过useEffect的执行，可用来优化性能。
### useContext
useContext可在消费组件中直接获取到`provider`组件的`value`。
#### 类组件中ContextAPI
``` jsx
import someoneContext from "./context";
class CompA extends React.Component {
   render(){
        <someoneContext.Consumer>
            {value} => <p>{value}</p>
        </someoneContext.Consumer>
   }
}
```
或
``` jsx
import someoneContext from "./context";
class CompA extends React.Component {
   render(){
        <p>{this.context.value}</p>
   }
}
CompA.contextType = someonContext;
```
#### 使用useContext
``` jsx
import someoneContext from "./context";
import {useContext} from "react";
const CompA = () => {
    const value = useContext(someoneContext);
    return <div>{value}</div>
}
```
### useReducer
用法：

`const [state, dispatch] = useReducer(reducer, initialArg, init);`。

通过类似于reducer的方式管理state，适用于state层级较深或state更新依赖于prevState的情况。如计数器例子：
``` jsx
const initialState = {count: 0};
const reduer = (state, action) => {
  switch(action.type){
    case "incre":
      return {...state, count: state.count + 1};
    case "decre":
      return {...state, count: state.count - 1};
    default :
      return state;
  }
}

function App() {
  
  const [state, dispatch] = useReducer(reduer, initialState);
  return (
    <>
      <p>{state.count}</p>
      <button onClick = {() => dispatch({type: "incre"})}>+</button>
      <button onClick = {() => dispatch({type: "decre"})}>-</button>
    </>
  );
}
```

#### useReducer + useContext
userReducer返回的state和dispatch，可能需要用于多个组件。

可通过props传递state和dispatch。

组件层级较深时，可通过Context在组件树中传递state和dispatch。可实现简易版的redux。改写计数器例子：
``` jsx
const MyContext = React.createContext();

const initialState = {count: 0};
const reduer = (state, action) => {
  switch(action.type){
    case "incre":
      return {...state, count: state.count + 1};
    case "decre":
      return {...state, count: state.count - 1};
    default :
      return state;
  }
}

function App() {
  
  const [state, dispatch] = useReducer(reduer, initialState);
  return (
    <MyContext.Provider value = {{state, dispatch}}>
      <CountDisplay />
      <ButtonGroup />
    </MyContext.Provider>
  );
}

const CountDisplay = () => {
  const {state} = useContext(MyContext);
  return <p>{state.count}</p>
}

const ButtonGroup = () => {
  const {dispatch} = useContext(MyContext);
  return <>
    <button onClick = {() => dispatch({type: "incre"})}>+</button>
    <button onClick = {() => dispatch({type: "decre"})}>-</button>
  </>
}
```
### useMemo
用法：

`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

参数为用于计算的内联函数，以及包含计算依赖值的数组。返回值为计算结果。

计算结果会记忆化。只有依赖值变化时，才会重新计算。如：
``` jsx
function App (){
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(0);

  const sum = useMemo(() => {
      console.log("准备计算");
      return Number(num1) + Number(num2), [num1, num2];
    }, [num1, num2]
  )
  
  return <>
    <button onClick = {() => setNum1(num => num+1)}>num1-{num1}</button>
    <button onClick = {() => setNum2(num => num+1)}>num2-{num2}</button>
    <button onClick = {() => setNum3(num => num+1)}>num3-{num3}</button>
    <p>num1+num2-{sum}</p>
  </>
}
```
点击button页面会更新，在render时useMemon中依赖项变化时，才会重新计算。因此，点击button1和button2，会重新计算，而点击button3不会重新计算。
### useRef
用法：

`const refContainer = useRef(initialValue);`


`initialValue`为该ref指向的节点。`refContainer`本质是js对象`{current:initialValue}`。

`refContainer.current`可访问到DOM节点。如实现简单的双向绑定：
``` jsx
function App (){
  const [value, setValue] = useState("");
  const inputRef = useRef();
  const onChange = (val) => {
    setValue(inputRef.current.value)
  }
  return <input ref = {inputRef} value = {value} onChange = {onChange} />
}
```
`inputRef.current.value`获取到input节点的value属性。
## 自定义hook
自定义hook可用于提取可复用逻辑。自定义hook本质为一个函数，内部可调用其他hook。

苦于没有实战的机会，参照阿里hooks库，自己简要实现一下。

### 数据请求-useRequest
#### 使用演示
``` jsx
import { useRequest } from 'ahooks';
import Mock from 'mockjs';
import React from 'react';
function getUsername() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Mock.mock('@name'));
    }, 1000);
  });
}
export default () => {
  const { data, error, loading } = useRequest(getUsername);
  if (error) {
    return <div>failed to load</div>;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  return <div>Username: {data}</div>;
};
```
#### 自行实现
``` jsx
const useMyRequest = (asyncFunc) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(async() => {
        setLoading(true);
        try{
            const data = await asyncFunc();
            setData(data);
            setLoading(false);
            setError(null);
        } catch(e){
            setError(e.message);
        }
    }, [])
    return {data, error, loading}
}
```
### state节流-useThrottle
#### 使用演示
``` jsx
export default () => {
  const [value, setValue] = useState("");
  const throttledValue = useMyThrottle(value);
  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Typed value"
        style={{ width: 280 }}
      />
      <p style={{ marginTop: 16 }}>throttledValue: {throttledValue}</p>
    </div>
  );
};
```
对`value`的变化节流。随着输入框的输入，设定在一段时间内throttledValue的值只会更新一次。这段时间内的多余更新都会被忽略。

如：throttleValue第一次更新在0ms，值为""。第二次更新最早出现在wait ms。第三次出现在wait + wait ms。等待期间不会触发throttleValue的更新。
#### 自行实现
``` jsx
const useMyThrottle = (value, wait = 500) => {
    const [throttledValue, setThrottledValue] = useState(value);
    const [timestemp, setTimestemp] = useState(Date.now());
  
    useEffect(() => {
      if(Date.now() - timestemp >= wait){
          console.log("updateDe")
          setThrottledValue(value);
          setTimestemp(Date.now());
      }
    }, [value])
    return throttledValue;
}
```
### state消抖-useDebounce
#### 使用演示
``` jsx
export default () => {
  const [value, setValue] = useState();
  const debouncedValue = useDebounce(value, {
    wait: 500,
  });
  return (
    <div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Typed value"
        style={{
          width: 280,
        }}
      />
      <p
        style={{
          marginTop: 16,
        }}
      >
        DebouncedValue: {debouncedValue}
      </p>
    </div>
  );
};
```
区别于节流：事件在触发后过一段时间后才会执行。在这期间有新的触发，则会使用新的触发时间，作为起始时间。

如：debounceValue第一次更新在0ms，值为""。然后立即触发了第二次更新，但这次更新是滞后的，本应在wait ms执行。在wait ms到来之前，在preWait ms又触发了更新，则会将prewait ms作为新的基准。此次更新会在 prewait + wait ms执行。以此类推。
#### 自行实现
``` jsx
const useMyDebounce = (value, wait) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), wait);
        return () => {
            clearTimeout(timeout);
        }
    }, [value])
    return debouncedValue;
}
```
### 模拟mount生命周期-useMount
#### 自行实现
``` jsx
const useMyMount = (func, destroFunc) => {
    useEffect(() => {
        func();
        return () => {
            destroFunc ? destroFunc() : void(0);
        }
    }, [])
}
```
### 模拟unmount生命周期-useUnmount
#### 自行实现
``` jsx
const useMyUnmount = (func) => {
    useEffect(() => {
        return () => {
            func()
        }
    })
}
```
### 模拟update-useUpdate
#### 实现及用法
``` jsx
//调用后返回更新组件的方法
const useMyUpdate = () => {
    const [flag, setFlag] = useState(0);
    return () => setFlag(flag => flag + 1);
}

//使用
export default () => {
  const update = useMyUpdate();
  return (
    <>
      <div>Time: {Date.now()}</div>
      <button type="button" onClick={update} style={{ marginTop: 8 }}>
        update
      </button>
    </>
  );
};
```
### 管理boolean值-useBoolean
#### 实现及用法
``` jsx
//返回值为包含布尔值、toggle方法、setTrue方法和setFalse方法
const useMyBoolean = (value) => {
    const [state, setState] = useState(value ? true : false);
    return [
        state,
        {
            toggle: () => {setState(state => !state)},
            setTrue: () => {setState(true)},
            setFalse: () => {setState(false)},
        }
    ]
}

//使用
export default () => {
  const [state, { toggle, setTrue, setFalse }] = useMyBoolean(true);
  return (
    <div>
      <p>Effects：{JSON.stringify(state)}</p>
      <p>
        <button type="button" onClick={() => toggle()}>
          Toggle
        </button>
        <button type="button" onClick={setFalse} style={{ margin: '0 16px' }}>
          Set false
        </button>
        <button type="button" onClick={setTrue}>
          Set true
        </button>
      </p>
    </div>
  );
};
```
### useLocalStorageState
将state以localStorage的方式持久化。
#### 使用演示
``` jsx
export default function () {
  //message值为localStorage存储值，setMessage可用于更新存储值
  const [message, setMessage] = useLocalStorageState('user-message', 'Hello~');
  return (
    <>
      <input
        value={message || ''}
        placeholder="Please enter some words..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button style={{ margin: '0 8px' }} type="button" onClick={() => setMessage('Hello~')}>
        Reset
      </button>
      <button type="button" onClick={() => setMessage()}>
        Clear
      </button>
    </>
  );
}
```
#### 自行实现
``` jsx
const useMyLocalStorageState = (key, initialValue) => {
    const [state, setState] = useState(localStorage[key] !== undefined ? localStorage[key] : initialValue);
    useEffect(() => {
        if(state === undefined){
            localStorage.removeItem(key);
        } else {
            localStorage[key] = state;
        }
    })
    return[state, setState];
}
```


