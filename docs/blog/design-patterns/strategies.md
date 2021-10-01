---
title: 策略模式
date: 2021-08-01
tags:
    - 设计模式
    - 策略模式
---
策略模式，将多种彼此可相互替换的算法或业务规则封装起来，方便外层进行可替换的调用。js中策略模式已经在潜移默化的使用，对象中封装多种算法、高阶函数等都是策略模式的实践，只要封装元素之间可相互替换。
## 实例
### 计算奖金
``` javascript
const strategies = {
    S(salary){
        return salary * 4;
    },
    A(salary){
        return salary * 2;
    },
    B(salary){
        return salary;
    }
}

const getBonus = (level, salary) =>{
    return strategies[level](salary);
}

console.log(getBonus('S', 100));    // => 400
console.log(getBonus('B', 50));     // => 50
```
### 表单校验
表单校验通常会同时有多个规则，也可将其多个规则封装起来，无差别替换使用。
假定校验方式如下：
``` html
<form action="http://submit.com/post" id="myForm" method="POST">
    用户名：<input type="text" name="username" />
    手机号码：<input type="text" name="mobileNumber" />
    <button>提交</button>
</form>
```
``` javascript
const formDom = document.querySelector('#myForm');
const validataFunc = () => {
    // 创建校验器对象
    const validator = new Validator();
    // 添加校验规则
    validator.add(formDom.username.value, [
        {
            rule: 'noEmpty',
            errorMsg: "用户名不能为空",
        },
        {
            rule: 'minLength:10',
            errorMsg: '用户名长度不能少于10位'
        }
    ]);
    validator.add(formDom.mobileNumber.value, [
        {
            rule: 'mobile',
            errorMsg: "手机号码格式有误"
        }
    ])
    const valiError = validator.start();
    return valiError;
}

// 表单提交后进行校验
formDom.onsubmit = function(){
    const valiError = validataFunc();
    if(valiError){
        alert(valiError);
        return false;
    } else {
        alert("success")
    }
}
```
则可设计出相应的校验器。
首先对校验规则进行封装：
``` javascript
const valiRules = {
    noEmpty(value, errorMsg){
        return value === '' ? errorMsg : undefined;
    },
    minLength(value, minLen, errorMsg){
        return value.length < minLen ? errorMsg : undefined;
    },
    mobile(value, errorMsg){
        return /^1[0-9]{10}$/.test(value) ? undefined : errorMsg;
    }
}
```
校验器对象实现如下：
```
const Validator = function(){
    this.rulesCache = [];
}
Validator.prototype.add = function(value, rules){
    const that = this;
    for(let ruleOpt of rules){
        const ruleArr = ruleOpt.rule.split(':');
        const rule = ruleArr.shift();
        ruleArr.unshift(value);
        ruleArr.push(ruleOpt.errorMsg);
        this.rulesCache.push(() => valiRules[rule].apply(that, ruleArr));
    }
}
Validator.prototype.start = function(){
    for(let validatorFunc of this.rulesCache){
        const errorMsg = validatorFunc();
        if(errorMsg){
            return errorMsg;
        }
    }
}
```
从上面实例中也可体会到，策略模式也常与组合、委托相结合，支持开放-封闭原则。

