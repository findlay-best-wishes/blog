---
title: 后序遍历
date: 2021-05-26
tags:
    - 树
    - tree
    - 二叉树
---

## 特点及应用
遍历顺序：root.left --> root.right --> root.val。可用于先得到子节点再对父节点求值的场景，比如：计算文件夹大小。
## 递归
``` js
function backOrderTraverse(root){
    if(root){
        backOrderTraverse(root.left);
        backOrderTraverse(root.right);
        console.log(root.val);
    }
}
```
## 迭代（较复杂）
``` js
var postorderTraversal = function(root) {
    if(!root) return [];
    const stack = [];
    const ans = [];
    let cur = root;
    let visited = null;

    while(cur || stack.length){
        //处理cur指向节点
        //只有当cur的左右子节点都不存在或者已被访问时，才能访问根节点。
        //在这之前需要做点准备

        //从cur找到最左叶子子节点
        while(cur){
            stack.push(cur);
            cur = cur.left;
        }

        //从栈中取出节点处理，此时该节点一定无左子节点或左子节点已访问，则只需根据右子节点判断是否可范文
        cur = stack.pop();
        
        if(!cur.right || cur.right === visited){
            //当该节点右子节点不存在或者已访问，则该节点可访问，将其值加入结果数组
            //并更新visited指向此节点，为父节点的访问提供条件。
            ans.push(cur.val);
            visited = cur;
            cur = null;
        } else {                
            //当右子节点存在时，应优先沿着右子节点继续向下遍历，
            //不过在此之前，应将当前节点cur存入栈中，因为对该节点的处理被它的右子节点打断了。
            //然后cur指向右子节点，进入下一轮循环，向下遍历
            stack.push(cur);
            cur = cur.right;
        }
    }
    return ans;
};
```