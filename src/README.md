---
home: true
icon: home
title: 项目主页
# heroImage: https://avatars.githubusercontent.com/u/61862335?v=4
# heroImage: /assets/image/markdown.svg
heroImage: /assets/17262062038347.png
# heroImage: http://img.lindaifeng.vip/typora-picgo-tuchaung/1726206451406_1.png

# heroImage: https://theme-hope-assets.vuejs.press/logo.svg
# bgImage: https://theme-hope-assets.vuejs.press/bg/6-light.svg
# bgImageDark: https://theme-hope-assets.vuejs.press/bg/6-dark.svg
bgImageStyle:
  background-attachment: fixed
heroText: 清峰小栈
tagline: 学习知识库总结指南。
actions:
  - text: 开始阅读
    icon: lightbulb
    link: ./java/
    type: primary

  - text: 文档
    link: ./deploy/

highlights:
  # - header: 易于安装
  #   image: /assets/image/box.svg
  #   # bgImage: https://theme-hope-assets.vuejs.press/bg/3-light.svg
  #   # bgImageDark: https://theme-hope-assets.vuejs.press/bg/3-dark.svg
  #   highlights:
  #     - title: 运行 <code>pnpm create vuepress-theme-hope hope-project</code> 以创建一个新的主题项目。
  #     - title: 在已有项目根目录下运行 <code>pnpm create vuepress-theme-hope add .</code> 以在项目中添加主题。

  - header: 
    description: 
    # image: /assets/image/markdown.svg
    # bgImage: https://theme-hope-assets.vuejs.press/bg/2-light.svg
    # bgImageDark: https://theme-hope-assets.vuejs.press/bg/2-dark.svg
    bgImageStyle:
      background-repeat: repeat
      background-size: initial
    features:
      - title: Java知识库 <hr>
        icon: clipboard-check
        details: Java基础、进阶、高阶合集
        link: /java/Java基础/Java基础.md

      - title: 数据库知识库 <hr>
        icon: box-archive
        details: 数据库Mysql、Redis应用指南
        link: /database/Redis数据库/Redis高级.md

      - title: 框架知识库 <hr>
        icon: bell
        details: Spring、SpringBoot脚手架
        link: /frame/

      - title: 中间件知识库 <hr>
        icon: table-columns
        details: K8S容器化、ELK日志收集方案
        link: /middleware/容器化技术/Docker技术/Docker介绍.md

      - title: 部署文档 <hr>
        icon: code
        details: 各类系统应用开发部署文档
        link: /deploy/Linux部署文档/软件安装/Linux 安装docker.md

      - title: 常用命令 <hr>
        icon: align-center
        details: 汇集工作中常用Linux命令行
        link: /extra/commands/

      - title: 常用插件 <hr>
        icon: code
        details: 好用、实用的代码开发插件
        link: /extra/plugins/IDEA常用插件.md

      - title: 精选代码 <hr>
        icon: superscript
        details: 优质、便捷的精选代码合集
        link: /

copyright: false
footer:  MIT 协议 | 版权所有 © 2024-至今 清峰小栈
---

<h2>是什么？</h2>
<br>
&nbsp 自己写文的目的是为了记录自己对知识点的掌握程度，在未来的发展过程中不断的巩固，从而形成一个自己熟悉且较为完备的知识体系。
<br>

<h2>为什么？</h2>

::: tip Tip:
  盖好一栋大厦的关键在于打好地基，但后期的维护和补丁也不可或缺，做笔记并不是目的，目的是为了掌握知识点。
:::
<hr>
<br>
&nbsp 知识只有被系统性的归纳起来，才能建立起知识体系，碎片化、零散化地去学习，会让自己陷入一种自我麻痹且极度自信的状态，会让你产生一种所有知识都懂假象，随便提起来一些知识点也都能说上两嘴，但是不能深究，一旦深入一点，就好像缓存穿透一般，所有的刨根问底都造成了真实伤害。
<br>

<!-- #include-env-start: /home/runner/work/vuepress-theme-hope/vuepress-theme-hope/docs/md-enhance/src/echarts -->
::: echarts 清峰小栈访问趋势图

```js
const oneDay = 86400000;
const data = [];
let now = new Date(1997, 9, 3);
let value = Math.random() * 1000;

const randomData = () => {
  now = new Date(+now + oneDay);
  value = value + Math.random() * 21 - 10;
  return {
    name: now.toString(),
    value: [
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
      Math.round(value),
    ],
  };
};

for (let i = 0; i < 1000; i++) data.push(randomData());

const option = {
  tooltip: {
    trigger: "axis",
    formatter: function (params) {
      params = params[0];
      var date = new Date(params.name);
      return (
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " : " +
        params.value[1]
      );
    },
    axisPointer: {
      animation: false,
    },
  },
  xAxis: {
    type: "time",
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, "100%"],
    splitLine: {
      show: false,
    },
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true,
      },
      dataView: {
        show: true,
        readOnly: false,
      },
      restore: {
        show: true,
      },
      saveAsImage: {
        show: true,
      },
    },
  },
  series: [
    {
      name: "Fake Data",
      type: "line",
      showSymbol: false,
      data: data,
    },
  ],
};
const timeId = setInterval(() => {
  if (myChart._disposed) return clearInterval(timeId);

  for (let i = 0; i < 5; i++) {
    data.shift();
    data.push(randomData());
  }
  myChart.setOption({
    series: [
      {
        data: data,
      },
    ],
  });
}, 1000);
```

:::

<!-- #include-env-end -->
