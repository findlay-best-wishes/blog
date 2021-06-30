---
title: 层序遍历
date: 2021-05-26
tags:
    - 树
    - tree
    - 二叉树
---

按层进行遍历。
## 迭代 + bfs
``` js
var levelOrder = (root) => {
    if(root) return;
    const stack = [root];
    while(stack.length){
        const len = stack.length;
        for(let i = 0; i < len; i++){
            const temp = stack.pop();
            console.log(temp.val);
            if(temp.left) stack.push(temp.left);
            if(temp.right) stack.push(temp.right);
        }
    }
}
```
## 递归 + dfs
此方式遍历方式仍为前序遍历，只是最终输出结果ans为层序结果。
``` js
var levelOrder = function(root) {
    const ans = [];

    function dfs(root, index){
        if(root){
            if(!ans[index]) ans[index] = [];
            ans[index].push(root.val);
            dfs(root.left, index + 1);
            dfs(root.right, index + 1);
        }
    }

    dfs(root, 0);
    return ans;
};
```