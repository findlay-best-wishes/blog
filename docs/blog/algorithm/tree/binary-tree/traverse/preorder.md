---
title: 前序遍历
date: 2021-02-20
tags:
    - 树
    - tree
    - 二叉树
---

## 特点及应用
遍历顺序：root --> root.left --> root.right。可用于打印结构化数据，查看文件夹目录。
## 递归
``` js
function preorderTraverse(root){
    if(root){
        console.log(root.val);
        preorderTraverse(root.left);
        preorderTraverse(root.right);
    }
}
``` 
## 迭代（辅助栈中保存root）
``` js
function preorderTraverse(root){
    if(!root) return;
    const stack = [];
    let cur = root;
    while(cur || stack.length){
        while(cur){
            console.log(cur.val);
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        cur = cur.right;
    }
}
```
## 迭代（辅助栈中可另保存右子节点）
``` js
function preorderTraverse(root){
    if(!root) return;
    const stack = [root];
    let cur = root;
    while(cur || stack.length){
        console.log(cur.val);
        if(cur.right) stack.push(cur.right);
        if(cur.left) stack.push(cur.left);
        cur = stack.pop();
    }
}
```
