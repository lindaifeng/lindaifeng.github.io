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
    link: "/java/Java基础/Java基础.md",
  },
  {
    text: "数据库知识库",
    icon: "fa-solid fa-database",
    link: "/database/Mongo数据库/Mongo基础.md"
  },
  {
    text: "框架知识库",
    icon: "fa-solid fa-book",
    link: "/frame/"
  },
  {
    text: "部署文档",
    icon: "fa-solid fa-folder-open",
    link: "/deploy/"
  },
  //博客门户
  // "/portfolio",
  //演示文档
  "/demo/",
  //超链接引用
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
