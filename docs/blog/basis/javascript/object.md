## 属性枚举
对象属性枚举有多种方式，总结如下：
### for/in循环
对于每个可枚举属性都会执行一次循环体，会忽略Symbol属性，将属性名赋值给循环变量。因此，原型链上的可枚举属性也会获取到。为防止这种情况，可以对属性进一步判断。如：
``` js
let obj1 = {c: 3};
let obj2 = Object.create(obj1);
let symbol = Symbol("d");
obj2.a = 1;
obj2.b = 2;
obj2[symbol] = 4;
for(let key in obj2){
    if(obj2.hasOwnProperty(key))    //判断属性是否为对象Obj2的自有属性
    console.log(key);               //依次打印ab，不会打印c和symbol(d)
}
```
### Object.keys()
返回包含对象可枚举的自有属性的数组。不包含继承属性、不可枚举属性和Symbol属性。
``` js
let obj1 = {c: 3};
let obj2 = Object.create(obj1);
let symbol = Symbol("d");
obj2.a = 1;
obj2.b = 2;
obj2[symbol] = 4;
for(let key of Object.keys(obj2)){
    console.log(key);               //依次打印ab，不会打印c和symbol(d)
}
```
### Object.getOwnPropertyName()
类似于`Object.keys`，但会返回所有字符串自有属性，因此不可枚举属性也会在其中。如：
``` js
let obj1 = {c: 3};

let obj2 = Object.create(obj1);     // 继承自obj1，obj2具有可枚举字符串继承属性c
obj2.a = 1;     // 定义可枚举自有字符串属性a
Object.defineProperty(obj2, "b", {
    value: 2,
    enumerable: false,
})              // 定义不可枚举自有字符串属性b
let symbol = Symbol("d");   
obj2[symbol] = 4;       // 定义Symbol属性symbol
for(let key of Object.getOwnPropertyNames(obj2)){
    console.log(key);               //依次打印ab，不会打印c和symbol
}
```
### Object.getOwnPropertySymbols
返回对象自有的所有Symbol属性，无论是否可以枚举。如：
``` js
let obj1 = {[Symbol("c")]: 3};

let obj2 = Object.create(obj1);     // 继承自obj1，obj2具有可枚举Symbol继承属性Symbol("c")
obj2.a = 1;     // 定义可枚举自有字符串属性a
Object.defineProperty(obj2, Symbol("b"), {
    value: 2,
    enumerable: false,
})              // 定义不可枚举自有Symbol属性
let symbol = Symbol("d");   
obj2[symbol] = 4;       // 定义Symbol属性symbol
for(let key of Object.getOwnPropertySymbols(obj2)){
    console.log(key);               //依次打印Symbol(b)和Symbol(d)
}
```
### Reflect.ownKeys
返回对象所有自有属性，包含字符串属性、Symbol属性、可枚举和不可枚举属性。如：
```
let obj1 = {[Symbol("c")]: 3};

let obj2 = Object.create(obj1);     // 继承自obj1，obj2具有可枚举Symbol继承属性Symbol("c")
obj2.a = 1;     // 定义可枚举自有字符串属性a
Object.defineProperty(obj2, Symbol("b"), {
    value: 2,
    enumerable: false,
})              // 定义不可枚举自有Symbol属性
let symbol = Symbol("d");   
obj2[symbol] = 4;       // 定义Symbol属性symbol
for(let key of Reflect.ownKeys(obj2)){
    console.log(key);               //依次打印a、Symbol(b)和Symbol(d)
}
```
