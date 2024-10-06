---
order: 1
title: Docker常用命令

---
### docker容器内下载vim

```shell
1）apt-get update 
apt-get install vim

2）yum install vim

3）apk update
apk add vim
```

### 查看docker容器日志

```shell
docker logs id
docker logs -f id
```

### 容器间数据相互拷贝

```shell
docker cp 目录数据  容器id:目录数据
docker cp 容器id:目录数据	目录数据
```

### 容器构建

```bash
docker build -f 文件名 -t 容器名 .
或者使用增强型构建工具构建多平台架构（要安装并使用 buildx, 需要 Docker Engine 版本号大于等于 19.03）
docker buildx build --platform=linux/arm64 -f 文件名 -t 容器名 .
```

### 容器打包成一个镜像

```shell
docker commit -m="描述信息" -a="作者" 容器id 目标镜像名:[TAG]
docker commit -a="badaodechengxvyuan" -m"addgeoserver" 39f5b723d1b8 tomcatwithgeoserver:1.0
```

### 镜像重命名

```bash
docker tag 原始镜像名 新的镜像名:版本
docker tag centos centos:v1

Docker hub：docker tag 镜像id 你的账户名/镜像仓库名:tag名
harbor: docker tag 镜像id ip+端口+仓库名+镜像名：版本
```

### 关闭自动重启

```shell
docker update --restart=no 容器名
禁用所有自动重启（守护程序）容器
docker update --restart=no $(docker ps -a -q)
```

### docker登录

```shell
docker login ip+port -u admin
```

### docker镜像导入导出

```shell
文件会保存到当前的 docker 终端目录（当前文件夹下）
docker save 0fdf2b4c26d3 > hangge_server.tar
docker load < hangge_server.tar
或者
docker export f299f501774c > hangger_server.tar
docker import - new_hangger_server < hangger_server.tar
```

### docker镜像拉取与推送

```shell
拉取
docker pull 192.168.179.188:8080/common/nacos-server:2.0.2
推送（1、改成仓库地址+仓库名+镜像名+版本号 2、推送）
docker tag SOURCE_IMAGE[:TAG] 192.168.179.188:8080/trade-dev2/IMAGE[:TAG]
docker push 192.168.179.188:8080/trade-dev2/IMAGE[:TAG]
```

### 查看镜像架构

```
docker inspect 镜像id
查看系统架构 uname -a
指定下载镜像架构(x86用amd64，m1用arm64) --platform=amd64/arm64
```

### 磁盘镜像满了，删除镜像

```
docker rmi -f $(docker images -qa)
```

### 清理所有无用镜像	

```
docker system prune -a
```

### 重新加载daemon.json配置

```shell
systemctl daemon-reload
```

### 重启docker服务 

```shell
systemctl restart docker
```

### 查看docker服务状态 

```shell
systemctl status docker
```

### 查看容器ip信息

```shell
查看容器的 ip 信息
docker inspect 容器id	
```

### 创建网桥

```shell
docker network create  MYname
```

### 查看k8s详细信息

```shell
kubectl describe pods/pod_name --namespace pod namespace
kubectl describe pods/devops-validator-v1-5f8f5b6f9f-vl9p4 --namespace test12
```

### 查看 Docker 在 Linux 中占用了多少内存

```shell
docker stats --no-stream

该命令将显示所有正在运行的容器的内存使用情况，包括以下信息：
CONTAINER: 容器的 ID。
CPU %: 容器使用的 CPU 百分比。
MEM USAGE / LIMIT: 容器当前使用的内存量和内存限制。
MEM %: 容器当前使用的内存占总内存的百分比。
NET I/O: 容器的网络 I/O。
BLOCK I/O: 容器的块 I/O。
PIDS: 容器中的进程数量。
```

### 实时查看容器的资源使用情况

```shell
docker stats
```

### 显示Docker容器和物理主机挂载目录信息

```shell
方法一
docker inspect -f "{{.Mounts}}" 369a1376f78c
方法二
docker inspect 369a1376f78c | grep Mounts -A 50
```

