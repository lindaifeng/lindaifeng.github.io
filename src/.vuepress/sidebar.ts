import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  //添加左侧侧边栏目录树 structure关键字:自动根据标题生成
  "/java/": [
    {
      text: "开发规范",
      icon: "fas fa-book",
      prefix: "1、开发规范/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Java基础",
      icon: "fas fa-code",
      prefix: "2、Java基础/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Java新特性",
      icon: "fas fa-star",
      prefix: "3、Java新特性/",
      children: "structure",
      collapsible: true
    },
    {
      text: "并发编程艺术",
      icon: "fas fa-tasks",
      prefix: "4、并发编程艺术/",
      children: "structure",
      collapsible: true
    },
    {
      text: "设计模式",
      icon: "fas fa-project-diagram",
      prefix: "5、设计模式/",
      children: "structure",
      collapsible: true
    },
    {
      text: "JVM原理",
      icon: "fas fa-microchip",
      prefix: "6、JVM原理/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Maven仓库管理",
      icon: "fas fa-box",
      prefix: "7、Maven仓库管理/",
      children: "structure",
      collapsible: true
    },
    {
      text: "面试专题",
      icon: "fas fa-user-tie",
      prefix: "面试专题/",
      children: "structure",
      collapsible: true
    }
  ],
  "/database/": [
    {
      text: "Mongo数据库",
      icon: "fas fa-leaf",
      prefix: "Mongo数据库/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Mysql数据库",
      icon: "fas fa-database",
      prefix: "Mysql数据库/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Redis数据库",
      icon: "fas fa-bolt",
      prefix: "Redis数据库/",
      children: "structure",
      collapsible: true
    }
  ],
  "/frame/": [
    {
      text: "JWT",
      icon: "fas fa-key",
      prefix: "jwt/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Spring",
      icon: "fas fa-leaf",
      prefix: "spring/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Spring Boot",
      icon: "fas fa-rocket",
      prefix: "springboot/",
      children: "structure",
      collapsible: true
    }
  ],
  "/middleware/": [
    {
      text: "ELK日志收集技术",
      icon: "fas fa-file-alt",
      prefix: "ELK日志收集技术/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Nginx技术",
      icon: "fas fa-server",
      prefix: "Nginx技术/",
      children: "structure",
      collapsible: true
    },
    {
      text: "容器化技术",
      icon: "fas fa-cubes",
      prefix: "容器化技术/",
      children: "structure",
      collapsible: true
    }
  ],
  "/deploy/": [
    {
      text: "IOS部署文档",
      icon: "fas fa-mobile-alt",
      prefix: "IOS部署文档/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Linux部署文档",
      icon: "fas fa-terminal",
      prefix: "Linux部署文档/",
      children: "structure",
      collapsible: true
    }
  ],
  "/web/": [
    {
      text: "HTML",
      icon: "fas fa-code",
      prefix: "html/",
      children: "structure",
      collapsible: true
    },
    {
      text: "JavaScript",
      icon: "fab fa-js",
      prefix: "js/",
      children: "structure",
      collapsible: true
    }
  ],
  "/extra/插件/": "structure",
  "/extra/代码片段/": "structure",
  "/extra/常用命令/": [
    {
      text: "操作系统命令",
      icon: "fas fa-computer",
      prefix: "操作系统命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Docker命令",
      icon: "fab fa-docker",
      prefix: "Docker命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "数据库命令",
      icon: "fas fa-database",
      prefix: "Mysql命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Mongo命令",
      icon: "fas fa-leaf",
      prefix: "Mongo命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "Oracle命令",
      icon: "fas fa-database",
      prefix: "Oracle命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "RocketMQ命令",
      icon: "fas fa-envelope",
      prefix: "Rocketmq命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "网络命令",
      icon: "fas fa-network-wired",
      prefix: "网络命令/",
      children: "structure",
      collapsible: true
    },
    {
      text: "防火墙命令",
      icon: "fas fa-shield-alt",
      prefix: "防火墙命令/",
      children: "structure",
      collapsible: true
    }
  ]
});