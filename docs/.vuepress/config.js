const path = require("path");

module.exports = {
  title: "bin-blog", // 设置网站标题
  description: "个人博客", //描述
  dest: "./dist", // 设置输出目录
  head: [
    // 注入到当前页面的 HTML <head> 中的标签
    ["link", { rel: "icon", href: "/logo.jpeg" }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: "/bin-note/", // 这是部署到github相关的配置
  serviceWorker: true, //支持PWA配置
  patterns: ["**/*.md", "!**/node_modules"],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  port: 8181, //端口
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "public", "assets"),
        // '@': path.join(__dirname, '../../', 'src'),
      },
    },
  },
  themeConfig: {
    //主题配置
    logo: "/logo.jpeg",
    subSidebar:'auto',
    nav: [
      { text: "首页", link: "/" },
      { text: "github", link: "https://github.com/youzan/vant" },
      // { text: '前端基础', link: '/base/base' },
      // { text: '算法', link: '/algorithm/algorithm' },
    ],

    // 为以下路由添加侧边栏
    sidebar: [
      {
        title: "前端基础",
        collapsable: false,
        path: '/base/base',
        children: [
          ["/base/base", "前端基础"],
          ["/base/network", "计算机网络基础"],
          ["/base/optimize", "性能优化"],
        ],
      },
      {
        title: "JavaScript",
        collapsable: false,
        path: '/js/object',
        children: [
          ["/js/object", "对象"],
          ["/js/function", "方法"],
          ["/js/array", "数组"],
        ],
      },
      {
        title: "TypeScript",
        collapsable: false,
        path: '/ts/base',
        children: [
          ["/ts/base", "基础"],
          ["/ts/decorators", "装饰器"],
        ],
      },
      {
        title: "CSS",
        collapsable: false,
        path: '/css/base',
        children: [["/css/base", "基础"]],
      },
      {
        title: "vue",
        collapsable: false,
        path: '/vue/vue2',
        children: [
          ["/vue/vue2", "vue2"],
          ["/vue/vue3", "vue3"],
        ],
      },
      {
        title: "数据结构",
        collapsable: false,
        path: '/dataStructure/twoTree',
        children: [
          ["/dataStructure/twoTree", "二叉树"],
          ["/dataStructure/suanfa", "算法"],
        ],
      },
      {
        title: "面试",
        collapsable: false,
        path: '/interview/jsbase',
        children: [
          ["/interview/jsbase", "JavaScript基础"],
          ["/interview/vue", "vue"],
          ["/interview/webpack", "webpack"],
          ["/interview/Babel", "Babel"],
        ],
      },
    ],
    sidebarDepth: 2, // 侧边栏显示2级
   
  },
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
};
