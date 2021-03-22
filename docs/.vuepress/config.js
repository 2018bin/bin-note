const path = require("path");

module.exports = {
    title: 'bin-blog', // 设置网站标题
    description: '个人博客', //描述
    dest: './dist', // 设置输出目录
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '/logo.jpeg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    serviceWorker: true, //支持PWA配置
    patterns: ['**/*.md', '!**/node_modules'],
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    port: 8181, //端口
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'public', 'assets'),
                // '@': path.join(__dirname, '../../', 'src'),
            }
        }
    },
    themeConfig: { //主题配置
        logo: '/logo.jpeg',
        nav: [
            { text: '首页', link: '/' },
            { text: 'github', link: 'https://github.com/youzan/vant' },
            // { text: '前端基础', link: '/base/base' },
            // { text: '算法', link: '/algorithm/algorithm' },
        ],

        // 为以下路由添加侧边栏
        sidebar: [
            {
                title: '前端基础',
                collapsable: false,
                children: [
                    ["/base/base", '前端基础'],
                    ["/base/network", '计算机网络基础'],
                    ["/base/optimize", '性能优化']

                ]
            },
            {
                title: 'JavaScript',
                collapsable: false,
                children: [
                    ["/js/object", '对象'],
                    ["/js/function", '方法']

                ]
            },
            {
                title: 'CSS',
                collapsable: false,
                children: [
                    ["/css/base", '基础'],
            
                ]
            },
            {
                title: 'vue',
                collapsable: false,
                children: [
                    ["/vue/vue2", 'vue2'],
                    ["/vue/vue3", 'vue3']
                ]
            },


        ],
        sidebarDepth: 2, // 侧边栏显示2级

    }
}
