---
title: 中序遍历
date: 2021-05-26
tags:
    - 树
    - tree
    - 二叉树
---

## 特点及应用
遍历顺序：root.left --> root.val --> root.right。对于二叉搜索树可用此方式排序。
## 递归
``` js
var inorderTraversal = function(root) {
    const res = [];
    function inorderNode(root){
        if(root){
            inorderNode(root.left);
            res.push(root.val);
            inorderNode(root.right);
        }
    }
    inorderNode(root);
    return res;
};
```
## 迭代
``` js
var inorderTraversal = function(root) {
    const res = [];
    const stack = [];
    let cur = root;
    while(cur || stack.length){
        while(cur){
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        res.push(cur.val);
        cur = cur.right;
    }
    return res;
};
```