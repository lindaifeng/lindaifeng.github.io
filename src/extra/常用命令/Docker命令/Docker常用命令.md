# Docker常用命令

本文档整理了Docker日常使用中最常用和实用的命令，按照功能分类，方便学习和查阅。

## 一、Docker基础操作命令

### 1. Docker容器基本操作

```shell
# 查看正在运行的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 启动已停止的容器
docker start 容器名或容器ID

# 停止运行中的容器
docker stop 容器名或容器ID

# 重启容器
docker restart 容器名或容器ID

# 删除容器
docker rm 容器名或容器ID

# 强制删除正在运行的容器
docker rm -f 容器名或容器ID

# 删除所有已停止的容器
docker container prune
```

### 2. Docker镜像基本操作

```shell
# 查看本地镜像
docker images

# 拉取镜像
docker pull 镜像名:标签

# 删除镜像
docker rmi 镜像名:标签

# 查看镜像详细信息
docker inspect 镜像名或镜像ID
```

### 3. Docker容器内软件安装

```shell
# Ubuntu/Debian系统
apt-get update 
apt-get install vim

# CentOS/RHEL系统
yum install vim

# Alpine系统
apk update
apk add vim
```

## 二、Docker日志和数据管理

### 1. 查看Docker容器日志

```shell
# 查看容器日志
docker logs 容器ID或容器名

# 实时查看容器日志
docker logs -f 容器ID或容器名

# 查看最近的100条日志
docker logs --tail 100 容器ID或容器名

# 查看最近1小时的日志
docker logs --since 1h 容器ID或容器名
```

### 2. 容器间数据相互拷贝

```shell
# 从宿主机拷贝文件到容器
docker cp 宿主机文件路径 容器ID:容器内路径

# 从容器拷贝文件到宿主机
docker cp 容器ID:容器内路径 宿主机文件路径
```

## 三、Docker镜像构建与管理

### 1. 容器构建

```bash
# 使用Dockerfile构建镜像
docker build -f Dockerfile -t 镜像名:标签 .

# 指定构建上下文路径
docker build -f Dockerfile -t 镜像名:标签 /path/to/build/context

# 使用增强型构建工具构建多平台架构（需要 Docker Engine 版本号大于等于 19.03）
docker buildx build --platform=linux/arm64 -f Dockerfile -t 镜像名:标签 .
```

### 2. 容器打包成镜像

```shell
# 将容器当前状态保存为新镜像
docker commit -m="描述信息" -a="作者" 容器ID 目标镜像名:标签

# 示例
docker commit -a="开发者" -m"添加geoserver" 39f5b723d1b8 tomcatwithgeoserver:1.0
```

### 3. 镜像重命名与标签管理

```bash
# 为镜像添加新标签
docker tag 原始镜像名:标签 新的镜像名:新标签

# 示例
docker tag centos:latest centos:v1

# Docker Hub镜像标签
docker tag 镜像ID 用户名/镜像仓库名:标签名

# 私有仓库镜像标签
docker tag 镜像ID 仓库地址:端口/仓库名/镜像名:版本
```

### 4. Docker镜像导入导出

```shell
# 导出镜像为tar文件
docker save 镜像ID或镜像名:标签 > 镜像文件名.tar

# 示例
docker save 0fdf2b4c26d3 > hangge_server.tar

# 从tar文件导入镜像
docker load < 镜像文件名.tar

# 示例
docker load < hangge_server.tar

# 导出容器文件系统为tar文件
docker export 容器ID > 容器文件名.tar

# 示例
docker export f299f501774c > hangger_server.tar

# 从tar文件导入为镜像
docker import 容器文件名.tar 新镜像名:标签

# 示例
docker import hangger_server.tar new_hangger_server:latest
```

## 四、Docker镜像仓库操作

### 1. Docker登录与认证

```shell
# 登录Docker Hub
docker login

# 登录私有仓库
docker login 仓库地址:端口 -u 用户名 -p 密码

# 示例
docker login 192.168.179.188:8080 -u admin
```

### 2. Docker镜像拉取与推送

```shell
# 拉取镜像
docker pull 镜像地址:端口/仓库名/镜像名:标签

# 示例
docker pull 192.168.179.188:8080/common/nacos-server:2.0.2

# 推送镜像到仓库
# 1. 先为镜像打标签
docker tag 源镜像名:标签 仓库地址:端口/仓库名/镜像名:标签

# 2. 推送镜像
docker push 仓库地址:端口/仓库名/镜像名:标签

# 示例
docker tag myapp:latest 192.168.179.188:8080/trade-dev2/myapp:latest
docker push 192.168.179.188:8080/trade-dev2/myapp:latest
```

## 五、Docker系统信息与资源管理

### 1. 查看Docker系统信息

```shell
# 查看Docker版本信息
docker version

# 查看Docker系统信息
docker info

# 查看镜像架构
docker inspect 镜像ID

# 查看系统架构
uname -a

# 指定下载镜像架构(x86用amd64，m1用arm64)
docker pull --platform=amd64/arm64 镜像名:标签
```

### 2. Docker资源清理

```shell
# 删除所有未使用的镜像
docker image prune -a

# 删除所有未使用的容器
docker container prune

# 删除所有未使用的网络
docker network prune

# 删除所有未使用的数据卷
docker volume prune

# 清理所有未使用的资源
docker system prune

# 清理所有未使用的资源（包括未使用的镜像）
docker system prune -a
```

### 3. Docker服务管理

```shell
# 重新加载daemon.json配置
systemctl daemon-reload

# 重启docker服务 
systemctl restart docker

# 查看docker服务状态 
systemctl status docker

# 设置docker开机自启
systemctl enable docker
```

### 4. Docker容器网络管理

```shell
# 查看容器IP信息
docker inspect 容器ID

# 创建自定义网络
docker network create 网络名

# 示例
docker network create mynetwork

# 查看所有网络
docker network ls

# 查看网络详细信息
docker network inspect 网络名

# 连接容器到指定网络
docker network connect 网络名 容器名

# 断开容器与网络的连接
docker network disconnect 网络名 容器名
```

### 5. Docker容器资源监控

```shell
# 查看Docker在Linux中占用的内存
docker stats --no-stream

# 该命令将显示所有正在运行的容器的内存使用情况，包括以下信息：
# CONTAINER: 容器的 ID。
# CPU %: 容器使用的 CPU 百分比。
# MEM USAGE / LIMIT: 容器当前使用的内存量和内存限制。
# MEM %: 容器当前使用的内存占总内存的百分比。
# NET I/O: 容器的网络 I/O。
# BLOCK I/O: 容器的块 I/O。
# PIDS: 容器中的进程数量。

# 实时查看容器的资源使用情况
docker stats

# 查看指定容器的资源使用情况
docker stats 容器名或容器ID

# 显示Docker容器和物理主机挂载目录信息
# 方法一
docker inspect -f "{{.Mounts}}" 容器ID

# 方法二
docker inspect 容器ID | grep Mounts -A 50
```

## 六、Docker容器运行管理

### 1. 容器运行参数

```shell
# 后台运行容器
docker run -d 镜像名

# 指定容器名称
docker run --name 容器名 镜像名

# 端口映射
docker run -p 宿主机端口:容器端口 镜像名

# 挂载数据卷
docker run -v 宿主机路径:容器路径 镜像名

# 设置环境变量
docker run -e 环境变量名=值 镜像名

# 交互式运行容器
docker run -it 镜像名 /bin/bash
```

### 2. 容器自动重启管理

```shell
# 设置容器自动重启策略
docker update --restart=策略 容器名

# 策略选项：
# no: 不自动重启（默认）
# on-failure[:max-retries]: 非正常退出时重启，可指定最大重试次数
# always: 总是重启
# unless-stopped: 总是重启，除非手动停止

# 示例：设置总是重启
docker update --restart=always 容器名

# 禁用所有自动重启（守护程序）容器
docker update --restart=no $(docker ps -a -q)
```

## 七、Kubernetes相关命令

### 1. 查看K8s详细信息

```shell
# 查看Pod详细信息
kubectl describe pods/pod名称 --namespace 命名空间

# 示例
kubectl describe pods/devops-validator-v1-5f8f5b6f9f-vl9p4 --namespace test12
```