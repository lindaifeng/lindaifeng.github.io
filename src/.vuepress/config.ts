import { defineUserConfig } from "vuepress";


import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,

  head:[
      // google统计分析 https://analytics.google.com/
      // ['script', { src: "https://www.googletagmanager.com/gtag/js?id=G-Y1LWB9B9G4",async: true}],
      // ['script', {},
      //   " window.dataLayer = window.dataLayer || [];\
      //   function gtag(){dataLayer.push(arguments);}\
      //   gtag('js', new Date());\
      //   gtag('config', 'G-Y1LWB9B9G4');"],

    //baidu统计分析 https://tongji.baidu.com/
    ['script',{},"var _hmt = _hmt || [];\n" +
      "(function() {\n" +
      "  var hm = document.createElement(\"script\");\n" +
      "  hm.src = \"https://hm.baidu.com/hm.js?ca85d6fd16ae8614cd8d5d4e94c5765d\";\n" +
      "  var s = document.getElementsByTagName(\"script\")[0]; \n" +
      "  s.parentNode.insertBefore(hm, s);\n" +
      "})();"]
    ]

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
