---
title: 组件通信
date: 2020-11-09
tags: 
    - vue
---

## 父 => 子 
1. props
```
//父组件中
<template>
    <child message="message"></child>
</template>
import child;
<script>
    export defalut{
        components{child}
    }
</script>
```
```
//子组件中
<template>
    <div>{{message}}</div>
</template>
<script>
    export defult {
        props:{
            message:String
        }
    }
</script>
```
2.this.$parent直接访问到父组件实例，访问属性。
```
//父组件中
<template>
    <child></child>
</template>
import child;
<script>
    export defalut{
        data(){
            return {
                status:0
            }
        }
        components{child}
    }
</script>
```
```
//子组件中
<template>
    <div>{{this.$parent.status}}</div>
</template>
<script>
    export defult {

    }
</script>
```
## 子 => 父
1.父组件向自组件添加自定义事件，设定事件的回调。子组件通过$emit触发自定义事件，并通过$emit传递参数。
```
//父组件中
<template>
    <child @event=eventProcess></child>
</template>
import child;
<script>
    export defalut{
        methods:{
            function eventProcess(arg){
                console.log(arg);
            }
        }
        components{child}
    }
</script>
```
```
//子组件中
<template>
    <div>child</div>
</template>
<script>
    export defult {
        methods:{
            function handleOnClick(arg){
                this.$emit("event",arg);
            }
        }
    }
</script>
```
2.通过this.$children获取到子组件实例，再获取属性。

3.通过ref引用，设置ref指向子组件，通过`this.$ref`获取到组件实例，再获取到属性。
```
//父组件中
<template>
    <child ref="childRef"></child>
</template>
import child;
<script>
    export defalut{
        methods:{
            getRef(){
                console.log(this.$ref.childRef.count)
            }
        }
        components{child}
    }
</script>
```
```
//子组件中
<template>
    <div>{{this.$parent.status}}</div>
</template>
<script>
    export defult {
        data(){
            return {
                count:0
            }
        }
    }
</script>
```
## 兄弟组件
1.bus事件总线，在vue根实例上添加中间vue实例（原型链或者data)，在兄弟组件中获取到实例的引用，发送方触发bus实例的自定义事件并传递参数，接收方组件监听自定义事件，在事件处理回调中获取到参数。
```
//A组件中
<template>
    
</template>
<script>
    Vue.prototype.$bus = new Vue();
    export defalut{
        methods:{
            emit(arg){
                this.$bus.$emit("event",arg);
            }
        }
    }
</script>
```
```
//B组件中
<template>
    
</template>
<script>
    export defult {
        methods:{
            watch(){
                this.$bus.$on("event",arg => {
                console.log(arg);
            }
        }
    }
</script>
```
## 跨层级组件
1.$attrs、$listeners，两个组件间直接通信。

2.provider、reject，类似于`React`中的`context`,在组件`provider`中配置需要共享的数据，该组件树下的元素都可通过`inject`获取到数据，直接使用。
```
//root
<template>
    <comp></comp>
</template>
<scirpt>
    export default {
        provider:{
            key:"value"
        }
    }
<\script>
```
```
//comp
<template>
</template>
<script>
    export default {
        inject:["key"],
        methods:{
            func(){
                console.log(this.key);
            }
        }
    }
</script>