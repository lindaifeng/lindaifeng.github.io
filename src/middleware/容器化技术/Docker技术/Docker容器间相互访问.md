---
title: Docker容器间相互访问
categories: 
  - Docker
tags: 
  - docker
order: 2
---



# Docker容器间相互访问

## 三种通讯方式

## 一、通过容器ip访问（不推荐）

**每次重启容器ip会变化**

```
#查看容器ip
docker inspect 容器 | grep  IPAddress
```

## 二、通过主机ip访问（不推荐）

端口映射 直接暴露IP端口，直接写死我们本机的ip加上映射端口

**当连的无线网，网络变化时，主机ip也会变化**

> 扩展：
>
> 1、Mac环境下，容器访问主机ip `host.docker.internal`
> 我想要从容器连接主机的一个服务
> 当主机需要变化IP地址（或者它根本就没有网络）。在18.03 之后的版本中我们建议使用一个专门的DNS名称host.docker.internal，这个DNS名称将被解析到主机的内部IP。 这只是为了开发目的，不要用于非Mac版Docker的生产环境。
>
> 2、host.docker.internal宿主机访问无效的解决方法
>
> 在 Docker 20.10 及以上版本中，Docker 访问宿主机的方式有所变化：
>
> `host.docker.internal:host-gateway`

## 三、建立容器链接（推荐）

启动容器的时候，给要通信的目标容器使用link指定一个“链接名”,在容器中就可以使用“链接名”和目标容器通信。格式： `--link 目标容器:别名`

```
#启动一个mysql容器名称叫mysql5，别名叫mysql
docker run -it --restart=always --name=mysql5 --link mysql5:mysql hub.c.163.com/library/mysql:latest 
#通过访问别名即可访问到容器ip
ping mysql
```
