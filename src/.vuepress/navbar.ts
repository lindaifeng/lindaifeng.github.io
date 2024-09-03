import { navbar } from "vuepress-theme-hope";

export default navbar([
  //门户首页
  "/",
  // java知识库
  "/1_java/",
  //数据库知识库
  "/2_database/",
  //框架知识库
  "/3_frame/",
  //部署文档
  "/4_deploy/",

  //博客门户
  // "/portfolio",
  //演示文档
  "/demo/",
  //指南（含下拉框）
  {
    text: "指南",
    icon: "lightbulb",
    prefix: "/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "ellipsis", link: "" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "ellipsis", link: "" }],
      },
    ],
  },
  //超链接引用
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
