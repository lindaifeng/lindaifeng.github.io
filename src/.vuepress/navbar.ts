import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "门户首页",
    icon: "home",
    link: "/",
  },
  {
    text: "Java知识库",
    icon: "fa-brands fa-java",
    link: "/java/",
  },
  {
    text: "数据库知识库",
    icon: "fa-solid fa-database",
    link: "/database/Mongo数据库/Mongo数据库概述.md"
  },
  {
    text: "框架知识库",
    icon: "fa-solid fa-paper-plane",
    link: "/frame/spring/1. Spring框架概述.md"
  },
  {
    text: "中间件知识库",
    icon: "fa-solid fa-book",
    link: "/middleware/容器化技术/Docker技术/Docker介绍.md"
  },
  {
    text: "部署文档",
    icon: "fa-solid fa-folder-open",
    link: "/deploy/Linux部署文档/软件安装/Linux安装docker.md"
  },
  {
    text: "前端",
    icon: "fa-solid fa-folder-open",
    link: "/web/js/AJAX.md"
  },
  {
    text: "其他扩展",
    icon: "fa-solid fa-gears",
    children: [
      {
        text: "常用命令",
        icon: "fa-solid fa-gear",
        link: "/extra/常用命令/操作系统命令/A常用Linux命令大全.md"
      },
      {
        text: "常用插件",
        icon: "fa-solid fa-gear",
        link: "/extra/插件/IDEA常用插件.md"
      },
      {
        text: "代码片段",
        icon: "fa-solid fa-gear",
        link: "/extra/代码片段/AOP日志埋点.md"
      },
    ]
  },
  //博客门户
  // "/portfolio",
  //演示文档
  // "/demo/",
  //超链接引用
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
