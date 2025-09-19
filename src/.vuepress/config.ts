import { defineUserConfig } from "vuepress";


import theme from "./theme.js";
import { shikiPlugin } from "@vuepress/plugin-shiki";
// 尝试直接导入需要的语言定义
try {
  // 对于shiki v3，语言定义需要从特定路径导入
  const gradle = require('@shikijs/langs/gradle');
  const jinja2 = require('@shikijs/langs/jinja2');
  global.shikiLanguages = { gradle, jinja2 };
} catch (e) {
  console.warn('Failed to load language definitions:', e);
}

export default defineUserConfig({
  // 对于用户/组织页面 (username.github.io)，base 应该设置为 "/"
  base: "/",
  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,
  plugins: [
    shikiPlugin({
      // 配置默认的高亮主题
      theme: "github-dark",
      // 尝试从全局变量获取语言定义
      langs: global.shikiLanguages ? [global.shikiLanguages.gradle, global.shikiLanguages.jinja2] : undefined
    })
  ],

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