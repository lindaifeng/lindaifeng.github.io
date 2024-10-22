import { defineUserConfig } from "vuepress";


import theme from "./theme.js";

export default defineUserConfig({
  base: "/docs/",
  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,
  head:[
      // google统计分析
      // ['script', { src: "https://www.googletagmanager.com/gtag/js?id=G-Y1LWB9B9G4",async: true}],
      // ['script', {},
      //   " window.dataLayer = window.dataLayer || [];\
      //   function gtag(){dataLayer.push(arguments);}\
      //   gtag('js', new Date());\
      //   gtag('config', 'G-Y1LWB9B9G4');"],
    //baidu统计
    ['script',{},"var _hmt = _hmt || [];\n" +
    "(function() {\n" +
    "  var hm = document.createElement(\"script\");\n" +
    "  hm.src = \"https://hm.baidu.com/hm.js?5fd4bcd39197e8c4bf406d1b2add643c\";\n" +
    "  var s = document.getElementsByTagName(\"script\")[0]; \n" +
    "  s.parentNode.insertBefore(hm, s);\n" +
    "})();"]
  ]
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
