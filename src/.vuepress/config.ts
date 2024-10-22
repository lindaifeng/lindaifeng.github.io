import { defineUserConfig } from "vuepress";


import theme from "./theme.js";

export default defineUserConfig({
  base: "/docs/",
  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,
  head:[
      ['script', { src: "https://www.googletagmanager.com/gtag/js?id=G-Y1LWB9B9G4",async: true}],
      ['script', {},
        " window.dataLayer = window.dataLayer || [];\
        function gtag(){dataLayer.push(arguments);}\
        gtag('js', new Date());\
        gtag('config', 'G-Y1LWB9B9G4');"],
      ]
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
