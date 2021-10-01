// 侧边栏js博客目录
const sidebar_javascript = {
    title: "javascript",
    path: "/blog/basis/javascript/",
    children: [
        "/blog/basis/javascript/",
        "/blog/basis/javascript/operator",
        "/blog/basis/javascript/context",
        "/blog/basis/javascript/generator",
        "/blog/basis/javascript/promise",
        "/blog/basis/javascript/async-await",
        "/blog/basis/javascript/regexp"
    ]
}

// 侧边栏html博客目录
const sidebar_html = {
    title: "html",
    path: "/blog/basis/html/",
    children: [
        "/blog/basis/html/",
    ]
}

// 侧边栏css博客目录
const sidebar_css = {
    title: "css",
    path: "/blog/basis/css/",
    children: [
        "/blog/basis/css/",
    ]
}

// 侧边栏react源码剖析目录
const sidebar_react_source_analysis = {
    title: "React源码剖析",
    path: "/blog/framework/react/source-analysis/",
    children: [
        "/blog/framework/react/source-analysis/",
        "/blog/framework/react/source-analysis/architecture",
        "/blog/framework/react/source-analysis/render-stage",
        "/blog/framework/react/source-analysis/commit-stage",
        "/blog/framework/react/source-analysis/update",
        "/blog/framework/react/source-analysis/diff",
        "/blog/framework/react/source-analysis/hooks",
        "/blog/framework/react/source-analysis/concurrent-mode",
    ]

}

// 侧边栏redux博客目录
const sidebar_redux = {
    title: "redux",
    path: "/blog/framework/react/redux/",
    children: [
        "/blog/framework/react/redux/",
        "/blog/framework/react/redux/reducer-design",
        "/blog/framework/react/redux/subscribe-dispatch",
        "/blog/framework/react/redux/middleware-async",
        "/blog/framework/react/redux/redux-toolkit",
    ]
}

// 侧边栏react博客目录
const sidebar_react = {
    title: "react",
    path: "/blog/framework/react/",
    children: [
        "/blog/framework/react/", 
        "/blog/framework/react/lifecycle", 
        "/blog/framework/react/setState", 
        "/blog/framework/react/hoc", 
        "/blog/framework/react/hooks", 
        "/blog/framework/react/code-splitting", 
        "/blog/framework/react/suspense", 
        "/blog/framework/react/concurrentUI", 
        sidebar_react_source_analysis,
        sidebar_redux,
    ]
}

// 侧边栏vue博客目录
const sidebar_vue = {
    title: "vue",
    path: "/blog/framework/vue/",
    children: [
        "/blog/framework/vue/",
        "/blog/framework/vue/lifecycle",
        "/blog/framework/vue/responsive",
        "/blog/framework/vue/data-binding",
        "/blog/framework/vue/communication",
        "/blog/framework/vue/vue-router",
    ]
}

// 侧边栏webpack博客目录
const sidebar_webpack = {
    title: "webpack",
    path: "/blog/enginerring/webpack/",
    children: [
        "/blog/enginerring/webpack/",
        "/blog/enginerring/webpack/workflow",
    ]
}

// 侧边栏babel博客目录
const sidebar_babel = {
    title: "babel",
    path: "/blog/enginerring/babel/",
    children: [
        "/blog/enginerring/babel/",
        "/blog/enginerring/babel/workflow",
    ]
}

// 侧边栏npm博客目录
const sidebar_npm = {
    title: "npm",
    path: "/blog/enginerring/npm/",
    children: []
}

// 侧边栏node博客目录
const sidebar_node = {
    title: "Node",
    path: "/blog/node/",
    children: [
        "/blog/node/",
        "/blog/node/koa",
    ],
}

// 侧边栏计算机网络博客目录
const sidebar_cs_network = {
    title: "计算机网络",
    path: "/blog/cs-network/",
    children: [
        "/blog/cs-network/",
        "/blog/cs-network/functions-of-the-transport-layer",
        "/blog/cs-network/udp",
        "/blog/cs-network/tcp",
        {
            title: "Http",
            path: "/blog/cs-network/http/",
            children: [
                "/blog/cs-network/http/",
                "/blog/cs-network/http/http-version",
                "/blog/cs-network/http/response-status-code",
                "/blog/cs-network/http/fileds",
                "/blog/cs-network/http/connection-control",
                "/blog/cs-network/http/cookies",
                "/blog/cs-network/http/large-file-transfer",
                "/blog/cs-network/http/cache-control",
                "/blog/cs-network/http/proxy",
            ]
        },
        {
            title: "TLS",
            path: "/blog/cs-network/TLS/",
            children: [
                "/blog/cs-network/TLS/",
                "/blog/cs-network/TLS/TLS-connection",
            ]
        }
    ],
}

// 侧边栏算法-stack博客目录
const sidebar_stack = {
    title: "数据结构-栈",
    path: "/blog/algorithm/stack",
    children: []
}

// 侧边栏算法-queue博客目录
const sidebar_queue = {
    title: "数据结构-队列",
    path: "/queue",
    children: []
}

// 侧边栏算法-链表博客目录
const sidebar_linkedList = {
    title: "数据结构-链表",
    path: "/blog/algorithm/linkedList",
    children: []
}

// 侧边栏算法-tree博客目录
const sidebar_tree = {
    title: "数据结构-Tree",
    path: "/blog/algorithm/tree/",
    children: [
        "/blog/algorithm/tree/",
        {
            title: "二叉树",
            path: "/blog/algorithm/tree/binary-tree/",
            children: [
                "/blog/algorithm/tree/binary-tree/",
                {
                    title: "遍历方式",
                    children: [
                        "/blog/algorithm/tree/binary-tree/traverse/preorder",
                        "/blog/algorithm/tree/binary-tree/traverse/inorder",
                        "/blog/algorithm/tree/binary-tree/traverse/backorder",
                        "/blog/algorithm/tree/binary-tree/traverse/layer",
                    ]
                }
            ]
        }
    ]
}

// 侧边栏算法-sort博客目录
const sidebar_sort = {
    title: "排序算法",
    path: "/blog/algorithm/sort",
    children: []
}

// 侧边栏浏览器原理博客目录
const sidebar_browser = {
    title: "浏览器原理",
    path: "/blog/browser",
    children: [],
}

// 侧边栏设计模式博客目录
const sidebar_design_patterns = {
    title: "设计模式",
    path: "/blog/design-patterns/",
    children: [
        "/blog/design-patterns/",
        "/blog/design-patterns/singleton",
        "/blog/design-patterns/strategies",
        "/blog/design-patterns/proxy",
        "/blog/design-patterns/iterator",
        "/blog/design-patterns/observer",
    ]
}
//侧边栏目录
const sidebar_blog =  [
    {
        title: "前端基础",
        path: "/blog/basis/",
        children: ["/blog/basis/", sidebar_javascript, sidebar_html, sidebar_css],
    },
    {
        title: "前端框架",
        path: "/blog/framework/",
        children: ["/blog/framework/", sidebar_react, sidebar_vue],
    },
    {
        title: "前端工程化",
        path: "/blog/enginerring/",
        children: ["/blog/enginerring/", sidebar_webpack, sidebar_babel],
    },
    sidebar_node,
    sidebar_cs_network,
    {
        title: "算法",
        path: "/blog/algorithm/",
        children: ["/blog/algorithm/", sidebar_tree],
    },
    sidebar_design_patterns

   // sidebar_browser,
];

module.exports = sidebar_blog;