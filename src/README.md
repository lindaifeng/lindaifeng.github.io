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
tagline: 我的知识库总结指南。
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
        link: /database/Redis数据库/Redis基础.md

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
&nbsp 知识只有被系统性的归纳起来，才能建立起知识体系，碎片化、零散化地去学习，否则会让自己陷入一种自我麻痹且极度自信的状态，会让你产生一种所有知识都懂假象，随便提起来一些知识点也都能说上两嘴，但是不能深究，一旦深入一点，就好像缓存穿透一般，所有的刨根问底都将造成真实伤害。
<br>


<!-- #include-env-start: /home/runner/work/vuepress-theme-hope/vuepress-theme-hope/docs/md-enhance/src/echarts -->
::: echarts 清峰小栈访问趋势图

```js
// const oneDay = 86400000;
// const data = [];
// let now = new Date(1997, 9, 3);
// let value = Math.random() * 1000;
let currentDate = new Date();
let xData = [];
let year = currentDate.getFullYear();
for (let i = 1; i <= 12; i++) {
  xData.push(`${year}/${i.toString().padStart(2, '0')}`);
}
// const randomData = () => {
//   now = new Date(+now + oneDay);
//   value = value + Math.random() * 21 - 10;
//   return {
//     name: now.toString(),
//     value: [
//       [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
//       Math.round(value),
//     ],
//   };
// };

// for (let i = 0; i < 1000; i++) data.push(randomData());
// const Http = new XMLHttpRequest();
// const url='https://jsonplaceholder.typicode.com/posts';
// Http.open("GET", url);
// Http.send();

// Http.onreadystatechange = (e) => {
//   console.log(Http.responseText)
// }
let data = [];
const option = {
  tooltip: {
    trigger: "axis",
    // formatter: function (params) {
    //   params = params[0];
    //   var date = new Date(params.name);
    //   return (
    //     date.getDate() +
    //     "/" +
    //     (date.getMonth() + 1) +
    //     "/" +
    //     date.getFullYear() +
    //     " : " +
    //     params.value[1]
    //   );
    // },
    axisPointer: {
      animation: false,
    },
  },
  xAxis: {
    type: "category",
    data: xData,
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
      name: "访客量",
      type: "line",
      showSymbol: false,
      data: data,
    },
  ],
};
// 随机生成10-100的数字并填充到data数组中
for (let i = 0; i < xData.length; i++) {
  data.push(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
}
// 更新图表
myChart.setOption(option);

// 当前月份进行5-10区间的叠加，每5秒更新一次
const run = () => {
  // 确保月份在data数组范围内
  let month = currentDate.getMonth();
  if (month < data.length) {
    data[month] += Math.floor(Math.random() * (10 - 5 + 1)) + 10;
    // 更新图表
    myChart.setOption(option);
  }
};

// 设置定时器
const timeId = setInterval(run, 5000);

// 假设这里是图表的销毁钩子，例如Vue的beforeDestroy生命周期钩子
// 需要在实际环境中替换为合适的销毁逻辑
// beforeDestroy() {
//   if (timeId) {
//     clearInterval(timeId);
//   }
//   if (myChart && !myChart._disposed) {
//     myChart.dispose();
//   }
// }
```

:::

<!-- #include-env-end -->