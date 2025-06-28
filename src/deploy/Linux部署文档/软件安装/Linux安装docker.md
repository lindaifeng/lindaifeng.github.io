---
title: Linux 安装docker
categories: 
  - Docker
tags: 
  - docker
order: 1
---

## 一、安装前须知

（可选）卸载之前的docker

```
方法一： 
查询docker状态
systemctl status docker
停止docker状态
systemctl stop docker
卸载docker
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
方法二： 
查询docker状态
systemctl status docker
查询docker安装过的包
yum list installed | grep docker
删除安装包
yum remove docker-ce.x86_64 ddocker-ce-cli.x86_64 -y
删除镜像/容器等
rm -rf /var/lib/docker
```



## 二、在线安装Docker

### 配置相关yum源

```
sudo yum install -y yum-utils
sudo yum-config-manager \
--add-repo \
http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

### 安装docker

```
#以下是在安装k8s的时候使用
yum install -y docker-ce-20.10.7 docker-ce-cli-20.10.7  containerd.io-1.4.6
或
#安装最新版docker
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### 启动docker

```
systemctl enable docker --now
```

### 配置加速

```
#这里额外添加了docker的生产环境核心配置cgroup
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://82m9ar63.mirror.aliyuncs.com"],
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

sudo systemctl daemon-reload

sudo systemctl restart docker
```

### 在线安装docker-compose

```bash
-- 这个命令会下载最新版本的 Docker Compose 并保存到 /usr/local/bin/docker-compose。

curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```

赋予执行权限：

```bash
chmod +x /usr/local/bin/docker-compose
```

安装完成后，可以运行以下命令来验证 Docker Compose 是否成功安装：

```bash
docker-compose --version
```

## 三、离线安装Docker

### 下载安装包

- Docker版本必须大于`19.03.8+`
- Docker下载地址：https://download.docker.com/linux/static/stable/x86_64/ 

> 选择合适的docker版本

### 解压缩

~~~shell
 tar -zxvf docker-19.03.9.tgz
~~~

### 移动文件

> 解压的docker文件夹全部移动至/usr/bin目录

~~~shell
cp docker/* /usr/bin/
~~~

### 将Docker注册为系统服务

```
vi /etc/systemd/system/docker.service
```

~~~sh
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target
[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s
[Install]
WantedBy=multi-user.target
~~~



~~~shell
#依次执行以下脚本
chmod +x /etc/systemd/system/docker.service
#刷新配置&&启动服务&&开启自启
systemctl daemon-reload && systemctl start docker && systemctl enable docker.service
#查看版本
docker -v
~~~

### 配置dcker仓库路径

vi /etc/docker/daemon.json填入以下内容：（私仓IP改成自己的，也可事先预留装好harbor后再修改）

```shell
#镜像加速（可不配）：registry-mirrors
#仓库地址：insecure-registries
#额外参数：exec-opts
{
  "registry-mirrors": [
    "https://sq9p56f6.mirror.aliyuncs.com"
  ],
  "insecure-registries": ["私服ip:8088"],
  "exec-opts":["native.cgroupdriver=systemd"]
}

#刷新配置&&启动服务&&开启自启
systemctl daemon-reload && systemctl restart docker
```



## 四、离线安装Docker-compose

### 下载安装包

所有版本下载路径： https://github.com/docker/compose/releases

Docker-Compose下载路径：https://github.com/docker/compose/releases/download/1.24.1/docker-compose-Linux-x86_64

> 选择合适的docker版本

### 配置

~~~bash
mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
~~~

### 验证

```bash
docker-compose version
```

