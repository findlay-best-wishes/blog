const sidebar_blog =  require("./sidebar.blog.config");

module.exports = {
    title: "findlay blog",
    description: "爱前端、爱分享",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    port: 8080,
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Blog', link: "/blog/"},
            { text: '掘金', link: 'https://juejin.cn' },
            { text: 'Github', link: 'https://github.com/ByteJitter/' },
        ],
        sidebar: {
            "/blog/": sidebar_blog
        },
        searchMaxSuggestions: 10,
    },
    plugins: {
        '@vuepress/back-to-top': true,
        //"@vuepress/shared-utils": true,
        '@vuepress/active-header-links': {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        },
        'vuepress-plugin-comment': {
            choosen: 'valine',
            options: {
                el: '#valine-vuepress-comment',
                appId: 'qwUTpxoUzqb9DFmpUf8XvpcN-gzGzoHsz',
                appKey: 'H8sMQEbctcTzX4zu1zEwtTvz',
                path: '<%- window.location.pathname %>',
                visitor: true ,// 阅读量统计
                placeholder: '支持markdown语法',
                highlight: true,
                recordeIP: true,
                enableQQ: true,
            }
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@blogImg': '/docs/.vuepress/public/blogImg/'
            },
        }
      }
}

