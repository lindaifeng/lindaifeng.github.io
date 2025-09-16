import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  //添加左侧侧边栏目录树 structure关键字:自动根据标题生成
  "/java/": "structure",
  "/database/": "structure",
  "/frame/": "structure",
  "/middleware/": "structure",
  "/deploy/": "structure",
  "/web/": "structure",
  "/extra/常用命令/": [
    {
      text: "操作系统命令",
      icon: "computer",
      prefix: "操作系统命令/",
      children: "structure"
    },
    {
      text: "Docker命令",
      icon: "fa-solid fa-paper-plane",
      prefix: "Docker命令/",
      children: "structure"
    },
    {
      text: "数据库命令",
      icon: "database",
      prefix: "Mysql命令/",
      children: "structure"
    },
    {
      text: "Mongo命令",
      icon: "leaf",
      prefix: "Mongo命令/",
      children: "structure"
    },
    {
      text: "Oracle命令",
      icon: "database",
      prefix: "Oracle命令/",
      children: "structure"
    },
    {
      text: "RocketMQ命令",
      icon: "envelope",
      prefix: "Rocketmq命令/",
      children: "structure"
    },
    {
      text: "网络命令",
      icon: "network-wired",
      prefix: "网络命令/",
      children: "structure"
    },
    {
      text: "防火墙命令",
      icon: "shield-alt",
      prefix: "防火墙命令/",
      children: "structure"
    }
  ]
});
