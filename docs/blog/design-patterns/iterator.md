---
title: 迭代器
tags: 
 - 迭代器
 - iterator
---
使用迭代器方式，可以在不关心聚合对象内部构造情况下，按顺序访问其中每个元素。
## 自行实现each迭代器函数
```
function each(array, func) {
    for(let i = 0; i < array.length; i++) {
        func(i, array[i]);
    }
};

each([1, 2, 3], (i, n) => {
    console.log(`第${i}个元素为${n}`);
})
```
## 外部迭代器
迭代器可分为内部迭代器和外部迭代器，前者指迭代规则在迭代器中是完全规定好的，外部只需一次调用。如上述实现方式，内部定义了迭代规则为索引从0开始累加1进行迭代。外部迭代器在迭代到一个元素后，需要再次显示调用才能迭代到下一个元素。调用时更加复杂，但可手动控制迭代进度。如：
```
function Iterator(array) {
    let current = 0;
    const next = () => {
        current++;
    }
    const isDone = () => current >= array.length;
    const getItem = () => array[current];
    return {
        next,
        isDone,
        getItem,
    }
}

const myIterator = Iterator([5, 6, 7, 8]);
let i = 0;
while(!myIterator.isDone()) {
    const item = myIterator.getItem();
    console.log(`第${i++}个元素为${item}`);
    myIterator.next();
}
```
## 可迭代对象
迭代数组时，我们根据数组的下标和length按顺序进行迭代。因此，只要待迭代对象满足这两个要求，都可以像数组一样被迭代，上面的迭代器方法也适用于类数组对象。

对于其他的对象可以通过`for in`进行迭代，顺序为属性值加入对象的先后顺序。

手动实现的迭代器，我们可以自定义它所使用的对象类型，也可自定义它的迭代规则，比如从后往前迭代、可终止迭代等。
## ES6迭代器
实际上，ES6已经支持迭代器模式了。我们通过`for of`遍历数组时，实际访问的就是js原生实现的迭代器。实现原理也和我们上述实现方法类似。

es6中可迭代对象具有迭代器方法，迭代器方法返回迭代器对象，迭代器对象具有类似上述功能的next方法，只不过这个next方法，不但能推进下一次迭代，还具有返回值。返回值为包含value、done两个属性的对象。用于表示当前迭代到的元素及是否已迭代完成。js中规定，迭代器方法同一命名为`Symbol.iterator`，如：
```
const iterator = [1, 2, 3, 4, 5][Symbol.iterator](); // 调用可迭代对象的迭代器方法得到迭代器对象。
let item = iterator.next(); // => {value: 1, done: false}
let j = 0;
while(!item.done) {
    console.log(`第${j++}个元素为${item.value}`);
    item = iterator.next(); // 向后迭代
}
```
因此，通过设置对象的`Symbol.iterator`属性可实现一个可迭代对象。迭代规则可自行实现。最基本的规则都是每次调用`next`返回`value`和`done`，有没有发现有点像生成器的特性。没错，可以通过生成器方便的创建迭代器对象。如：
```
const generateFunc = function* () {
    yield 0;
    yield 1;
    yield 2;
    yield 3;
}
const iterator1 = generateFunc();
let item1 = iterator1.next();
let z = 0;
while(!item1.done) {
    console.log(`第${z++}个元素为${item1.value}`);
    item1 = iterator1.next();
}
```
从而进一步创建具有特定迭代规则的可迭代对象，如：
```
const generateFunc = function* () {
    yield 0;
    yield 1;
    yield 2;
    yield 3;
}
const arr = [7];
arr[Symbol.iterator] = generateFunc;
for(let value of arr) {
    console.log(value)
}
// 依次打印0, 1, 2, 3
```

