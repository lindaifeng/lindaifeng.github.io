---
title: Linux k8s在线｜离线部署
categories: 
  - Docker
tags: 
  - k8s
order: 5
---
适用于政务内网，完全无外网的情况

## 一、安装前须知

>  kubesphere官方文档: https://v3-1.docs.kubesphere.io/zh/docs/
>
>  多节点安装文档: https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/introduction/multioverview/
>
>  离线安装官方文档: https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/introduction/air-gapped-installation/

### 前提环境

安装顺序

- 系统设置调整

- docker
- docker-compose
- harbor （可选）

- socat、conntrack、ebtables、ipset（k8s所需差件）
- k8s和kubeshere

- reids （可选）
- mysql （可选）
- java8、nacos、xxl-job （可选）
- 项目打包、上传私服 （可选）
- 启动相关 （可选）
- elk集成 （可选）

**在足够安全的外部防护下，可以永久关闭selinux**

```bash
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
systemctl stop firewalld && systemctl disable firewalld
swapoff -a
sed -i 's/.*swap.*/#&/' /etc/fstab 
```

**一些必要的系统设置（建议调整）**

```
cat >> /etc/sysctl.conf <<eof
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
vm.max_map_count=262144
vm.swappiness=0
eof

sysctl -p

modprobe br_netfilter

cat >> /etc/sysctl.conf <<eof
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
vm.swappiness=0
eof

sysctl -p

vim /etc/security/limits.conf
* soft nofile 65536
* hard nofile 65536
* soft nproc 32000
* hard nproc 32000
* hard memlock unlimited
* soft memlock unlimited

vim /etc/systemd/system.conf
DefaultLimitNOFILE=65536
DefaultLimitNPROC=32000
DefaultLimitMEMLOCK=infinity
```

**指定主机名称**

```
#命名指令：每个机器设置自己的名称，master为机器名称
hostnamectl set-hostname master
```



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

## 三、离线安装Docker

### 下载安装包

- Docker版本必须大于`19.03.8+`
- Docker下载地址：https://download.docker.com/linux/static/stable/x86_64/ 

> 选择合适的docker版本
>
> 不同架构
>
> 下载地址：https://download.docker.com/linux/static/stable/

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

Docker-Compose下载路径：https://github.com/docker/compose/releases/download/1.24.1/docker-compose-Linux-x86_64

> 选择合适的docker版本

### 配置

~~~bash
#依次执行一下命令
#重命名
mv docker-compose-Linux-x86_64 docker-compose
或有的是
mv docker-compose-Linux-x86_64.64 docker-compose
#修改权限
chmod +x docker-compose
#将docker-compose文件移动到了/usr/local/bin 
mv docker-compose /usr/local/bin
#打开/etc/profile文件
vi /etc/profile
#添加内容到文件末尾即可,然后保存退出
#export PATH=$JAVA_HOME:/usr/local/bin:$PATH
#重新加载配置文件,让其生效
#source /etc/profile
#测试
docker-compose -version
~~~



## 五、安装harbor（在线｜离线）

### 1、下载安装包拷贝到linux中

> 在线安装包下载
>
> https://mirror.rancher.cn/#harbor/

> 离线安装包下载
>
> https://github.com/goharbor/harbor/releases
>

```
# 切换至/data/目录下
cd /data/  
# 创建目录harbor
mkdir harbor 
# 将下载好的harbor-offline-installer-v1.10.1.tgz解压
tar -xcvf harbor-offline-installer-v1.10.1.tgz
# 切换至/data/目录下
cd /data/  
# 创建目录harbor
mkdir harbor 
# 将下载好的harbor-online-installer-v1.10.10.tgz解压
tar -zxvf harbor-online-installer-v1.10.10.tgz
```

### 2、修改配置文件

```
#有的harbor的配置文件叫harbor.yml.tmpl,可以复制一份改名
cp harbor.yml.tmpl harbor.yml 
vi harbor.yml  
```



![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085605.png)

### 3、执行安装脚本

```
./install.sh  # 安装
```

![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085620.png)

### 4、查看镜像

因为harbor本身自带docker 私有仓库，可以通过docker ps查看

![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085629.png)

### 5、访问harbor

ip+端口

![image-20220426140408316](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085636.png)



```
扩展：
在harbor目录中执行
#启动harbor
docker-compose start
#停止harbor
docker-compose stop
```



> harbor修改端口：
>
> 1、停止harbor
>
> docker-compose stop
>
> 2、修改配置文件harbor.yml 
>
> prot：端口号
>
> 3、重启安装脚本
>
> ./install.sh

## 六、Kubesphere及k8s安装

### 在线安装

https://kubesphere.com.cn/

**适用于能访问互联网的环境**

**温馨提示**

> - 自行安装docker。在未安装docker时，kk会自动安装docker，但建议docker自行安装，并且进行相应配置的设置。
>
> - 在机器硬盘不够大时，建议挂载外部存储。docker默认挂载目录是/var/lib/docker，绝大多数下本机硬盘不可能有这么大，必须要将docker容器的存储挂载到外置存储上去。
> - 设置好镜像私服。由于后续拉各类包都要依赖私仓，如果现在不设置，在k8s安装完成后发现无法拉镜像，这时再去改daemon.json需要重启docker，这是一个比较危险的行为。
> - 在安装前可以先启用部分插件，但是尽量在安装后再去启用，以免超过k8安装的超时时间（简单来说就是config-sample.yaml中的参数，除了私仓、机器配置，其他的一概不要动）
> - 安装完成后会提示访问地址是多少，按照控制台提示去登录即可，账号密码都在控制台上，安装过程大概要20分钟左右
> - K8S集群的关闭是比较危险的行为，存在掉电风险的客户现场，不是很建议使用本方案，虽然掉电后无法启动集群是小概率事件，但是一旦出现就要卸载集群重装，虽然只是一句命令的事，但是会有几十分钟的空窗时间。如果一定要部署，请一定要有备用的逻辑部署方案可以随时切换。



#### 1、下载安装脚本

~~~bash
#找一个合适的目录
export KKZONE=cn;
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.1 sh -
chmod +x kk
./kk create config --with-kubernetes v1.20.4 --with-kubesphere v3.1.1 -f config-sample.yaml
#编辑yaml
vim config-sample.yaml

#添加私服地址 registry.insecureRegistries
#指定要纳入集群的机器 spec.hosts
#指定主节点 spec.roleGroups.etcd spec.roleGroups.master
#指定工作节点 spec.roleGroups.worker 

#执行
./kk create cluster -f config-sample.yaml
~~~

#### 2、安装失败回滚

```
如果安装过程出现意外需要回滚，执行以下代码后可以重新安装：
./kk delete cluster -f config-sample.yaml
modprobe -r ipip
lsmod
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd
```

**扩展**

```
#查看pod创建进度
kubectl get pods -A
#查看pod描述
kubectl describe pods/pod名称 -n 命名空间
```



### 离线安装

**适用于无法访问互联网的环境**

> 您可以根据自己的需求变更下载的 Kubernetes 版本。安装 KubeSphere v3.1.1 的建议 Kubernetes 版本：v1.17.9，v1.18.8，v1.19.8 以及 v1.20.4。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.19.8。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](https://v3-1.docs.kubesphere.io/zh/docs/installing-on-linux/introduction/kubekey/#支持矩阵)。
>
> 运行脚本后，会自动创建一个文件夹 `kubekey`。请注意，您稍后创建集群时，该文件和 `kk` 必须放在同一个目录下。
>
> 参考：
> #下载镜像清单：
> curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/images-list.txt
> #下载 offline-installation-tool.sh
> curl -L -O https://github.com/kubesphere/ks-installer/releases/download/v3.1.1/offline-installation-tool.sh

#### 1、安装k8s插件

离线下载好安装k8s的插件包（socat、conntrack、ebtables、ipset）（提供的包内有k8s-plugins）

```
如有zip文件，解压命令：
unzip -o k8s.zip
没有unzip命令需要下载离线插件（提供的包内有unzip）
1）unzip和zip包下载地址：
http://www.rpmfind.net/linux/rpm2html/search.php
2）输入zip和centos搜索，选择el7下载
3）输入unzip和centos搜索，选择el7下载

安装rpm的执行命令：
rpm -Uvh *.rpm --nodeps --force;
```

```
服务器登录harbor,获取认证
docker login ip+port -u admin
```

#### 2、安装k8s

~~~bash
#文件可执行。
chmod +x offline-installation-tool.sh
export KKZONE=cn;
./offline-installation-tool.sh -b -v v1.20.4 
#推送镜像文件到仓库 IP:8088改成私服仓库的ip+端口（8G等待30分钟左右，几分钟就推完了可能是网络中断，需要再次推送）
./offline-installation-tool.sh -l images-list.txt -d ./kubesphere-images -r 私服ip:8088/library
#解压进入目录：
chmod +x kk
#指定对应版本
./kk create config --with-kubernetes v1.20.6 --with-kubesphere v3.1.1 -f config-sample.yaml

#编辑，yaml文件放在后（提前将每台服务器命名）
vim config-sample.yaml
#指定要纳入集群的机器 spec.hosts
#指定主节点 spec.roleGroups.etcd spec.roleGroups.master
#指定工作节点 spec.roleGroups.worker 
#添加私服地址：镜像仓库ip和端口（私服ip:端口改成自己的）
registry:
    registryMirrors: []
    insecureRegistries: [私服ip:端口]
    privateRegistry: 私服ip:端口/library


#执行安装k8s（出现每个节点镜像下载不到错误是镜像没推送上去，需要再次推送｜镜像版本找不到看推送的是哪一版的config-sample.yaml配置又是哪一版的）
./kk create cluster -f config-sample.yaml
~~~

#### 3、安装失败回滚

```
如果安装过程出现意外需要回滚，执行以下代码后可以重新安装：
./kk delete cluster -f config-sample.yaml

modprobe -r ipip
lsmod
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd
```

参考：config-sample.yaml

~~~yaml
apiVersion: kubekey.kubesphere.io/v1alpha1
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master14, address: 192.168.x.x, internalAddress: 192.168.x.x, port: 22, user: root, password: 123456}
  - {name: node22, address: 192.168.x.x, internalAddress: 192.168.x.x, port: 22, user: root, password: 123456}
  - {name: node23, address: 192.168.x.x, internalAddress: 192.168.x.x, port: 22, user: root, password: 123456}
  roleGroups:
    etcd:
    - master14
    master:
    - master14
    worker:
    - node22
    - node23
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.19.8
    imageRepo: kubesphere
    clusterName: cluster.local
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
  registry:
    registryMirrors: []
    insecureRegistries: ["192.168.239.24:8088"]
    privateRegistry: 192.168.239.24:8088/library
  addons: []


---
apiVersion: installer.kubesphere.io/v1alpha1
kind: ClusterConfiguration
metadata:
  name: ks-installer
  namespace: kubesphere-system
  labels:
    version: v3.1.1
spec:
  persistence:
    storageClass: ""       
  authentication:
    jwtSecret: ""
  zone: ""
  local_registry: ""        
  etcd:
    monitoring: false      
    endpointIps: localhost  
    port: 2379             
    tlsEnable: true
  common:
    redis:
      enabled: false
    redisVolumSize: 2Gi 
    openldap:
      enabled: false
    openldapVolumeSize: 2Gi  
    minioVolumeSize: 20Gi
    monitoring:
      endpoint: http://prometheus-operated.kubesphere-monitoring-system.svc:9090
    es:  
      elasticsearchMasterVolumeSize: 4Gi   
      elasticsearchDataVolumeSize: 20Gi   
      logMaxAge: 7          
      elkPrefix: logstash
      basicAuth:
        enabled: false
        username: ""
        password: ""
      externalElasticsearchUrl: ""
      externalElasticsearchPort: ""  
  console:
    enableMultiLogin: true 
    port: 30880
  alerting:       
    enabled: false
    # thanosruler:
    #   replicas: 1
    #   resources: {}
  auditing:    
    enabled: false
  devops:           
    enabled: true
    jenkinsMemoryLim: 2Gi     
    jenkinsMemoryReq: 1500Mi 
    jenkinsVolumeSize: 8Gi   
    jenkinsJavaOpts_Xms: 512m  
    jenkinsJavaOpts_Xmx: 512m
    jenkinsJavaOpts_MaxRAM: 2g
  events:          
    enabled: false
    ruler:
      enabled: true
      replicas: 2
  logging:         
    enabled: false
    logsidecar:
      enabled: true
      replicas: 2
  metrics_server:             
    enabled: false
  monitoring:
    storageClass: ""
    prometheusMemoryRequest: 400Mi  
    prometheusVolumeSize: 20Gi  
  multicluster:
    clusterRole: none 
  network:
    networkpolicy:
      enabled: false
    ippool:
      type: none
    topology:
      type: none
  openpitrix:
    store:
      enabled: false
  servicemesh:    
    enabled: false  
  kubeedge:
    enabled: false
    cloudCore:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      cloudhubPort: "10000"
      cloudhubQuicPort: "10001"
      cloudhubHttpsPort: "10002"
      cloudstreamPort: "10003"
      tunnelPort: "10004"
      cloudHub:
        advertiseAddress: 
          - ""           
        nodeLimit: "100"
      service:
        cloudhubNodePort: "30000"
        cloudhubQuicNodePort: "30001"
        cloudhubHttpsNodePort: "30002"
        cloudstreamNodePort: "30003"
        tunnelNodePort: "30004"
    edgeWatcher:
      nodeSelector: {"node-role.kubernetes.io/worker": ""}
      tolerations: []
      edgeWatcherAgent:
        nodeSelector: {"node-role.kubernetes.io/worker": ""}
        tolerations: []
~~~



## 七、离线安装中间件与项目

### 1、sql文件导入

将mysql、nacos、xxl-job所需的sql文件导入数据库

```shell
#创建数据库
CREATE DATABASE IF NOT EXISTS 库名 DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE   utf8mb4_general_ci;
#使用指定库
use 库名
#导入sql文件
source sql文件路径
```

### 2、java8、nacos、xxl-job、pdf镜像打包

> 离线环境没有这些镜像需要自己去下
>
> 思路：
>
> 1）到公司私仓下载镜像，在将镜像打包导出到本地
>
> 2）将打包好的镜像导入到政务云服务器docker中
>
> 3）将政务云服务器docker中的镜像上传至政务云harbor中

```docker
#公司私仓下载镜像
docker pull 192.168.x.x:8080/common/nacos-server:2.0.2
docker pull 192.168.x.x:8080/common/pdfjdk:latest
docker pull 192.168.x.x:8080/common/xxl-job-admin:latest
#公网下
docker pull java:8

#文件会保存到当前的 docker终端目录（当前文件夹下）
#1）导出镜像（推荐用容器名而不用id）
docker tag nacos-server:2.0.2 192.168.x.x:8080/common/nacos-server:2.0.2
docker save 192.168.x.x:8080/common/nacos-server:2.0.2 > nacos-server:2.0.2.tar
#2）导入镜像
docker load < nacos-server:2.0.2.tar

#推送（1、改成仓库地址+仓库名+镜像名+版本号 2、推送）
docker tag SOURCE_IMAGE[:TAG] 192.168.x.x:8080/trade-dev2/IMAGE[:TAG]
docker push 192.168.x.x:8080/trade-dev2/IMAGE[:TAG]
```



### 3、创建harbor仓库名

镜像推送至harbor时需要创建仓库名，而无内网无法访问面板

通过命令行创建harbor镜像库（无内网访问下进行）

https://blog.csdn.net/weixin_45019350/article/details/125021305

```
先看链接中的指引
添加第一个common项目仓库
insert into project(project_id,owner_id,name) values('2','1','common');
insert into project_metadata(id,project_id,name,value) values('2','2','public','true');
insert into project_member(id,project_id,entity_id,entity_type,role) values('2','2','1','u','1');
insert into quota(id,reference,reference_id,hard) values('2','project','2','{"storage": -1}');
insert into quota_usage(id,reference,reference_id,used) values('2','project','2','{"storage": 0}');      

添加第二个prod项目仓库
insert into project(project_id,owner_id,name) values('3','1','prod');
insert into project_metadata(id,project_id,name,value) values('3','3','public','true');
insert into project_member(id,project_id,entity_id,entity_type,role) values('3','3','1','u','1');
insert into quota(id,reference,reference_id,hard) values('3','project','3','{"storage": -1}');
insert into quota_usage(id,reference,reference_id,used) values('3','project','3','{"storage": 0}');
```

### 4、docker启动nacos

```
docker run -d \
-e MODE=standalone \ 
-e SPRING_DATASOURCE_PLATFORM=mysql \ 
-e MYSQL_SERVICE_HOST=10.84.x.x \ 
-e MYSQL_SERVICE_USER=root \ 
-e MYSQL_SERVICE_PASSWORD=1qazxsw@3edc \ 
-e MYSQL_SERVICE_DB_NAME=nacos_config \ 
-e JVM_XMS=256m \
-e JVM_XMX=256m \
-e JVM_XMN=256m \
-p 8848:8848 \
-p 9848:9848 \
--network 10.84.x.x \ 
--name nacos-sa-mysql \ 
--restart=always \
nacos/nacos-server
```

### 5、docker启动xxl-job

```
docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://10.84.x.x:3306/xxl-job?Unicode=true&characterEncoding=UTF-8 \
--spring.datasource.username=root \
--spring.datasource.password=1qazxsw@3edc \
--spring.mail.host=smtp.qq.com \
--spring.mail.port=25 \
--spring.mail.from=1305366530@qq.com \
--spring.mail.username=1305366530@qq.com \
--spring.mail.password=123456 \
--spring.mail.properties.mail.smtp.auth=true \
--spring.mail.properties.mail.smtp.starttls.enable=true \
--spring.mail.properties.mail.smtp.starttls.required=true \
--spring.mail.properties.mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory \
--xxl.job.accessToken=xdsl3ewi3al1oehxmo68pqxer" \
-p 8094:8094  -v /data/root/xxl-job-data:/data/applogs \
--name xxl-job-admin --restart=always  -d 10.84.x.x:8088/common/xxl-job-admin:latest
```

```
docker run -d \
-e PARAMS="--spring.datasource.url=jdbc:mysql://127.0.0.1:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=UTC \
--spring.datasource.username=root \
--spring.datasource.password=123456 \
--spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver" \
-p  8094:8080 \
-v /Users/ldf/app/dockerVolume/xxl-job:/data/applogs \
--name xxl-job-admin-arm64  \
-d xxl-job-admin-arm64:latest

```



### 6、项目文件打包

修改pom.xml中私仓的地址以及nacos配置

idea将项目打成jar包（maven需要选中激活哪个profile配置）

将每个服务的jar文件放入脚本文件夹中(jar放在公司提供的脚本package文件夹下)

### 7、打包上传

修改脚本文件java8的仓库地址，start.sh脚本中的仓库推送地址

脚本文件夹打包上传至政务云服务器中

解压运行脚本文件构建项目镜像

```
#启动项目调试
docker run -p 10001:10001 -it -d 镜像id
#查看启动日志
docker logs -f 容器id
```

## 八、Kubesphere自制应用（yaml形式）

> 本文采用的是yml的方式进行自制应用的构建，不同的项目只需要修改企业空间、镜像仓库以及数据库即可。温馨提示：本文是基于已有数据库以及项目上传到镜像仓库的前提下进行操作~

#### （1）nacos

~~~yaml
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: nacos
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: nacos
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  selector:
    matchLabels:
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: nacos
  addOwnerRef: true
  componentKinds:
    - group: ''
      kind: Service
    - group: apps
      kind: Deployment
    - group: apps
      kind: StatefulSet
    - group: extensions
      kind: Ingress
    - group: servicemesh.kubesphere.io
      kind: Strategy
    - group: servicemesh.kubesphere.io
      kind: ServicePolicy
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: nacos
  name: nacos-ingress-i52okm
spec:
  rules: []
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: nacos
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: nacos
  name: nacos-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: nacos
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: nacos
  template:
    metadata:
      labels:
        version: v1
        app: nacos
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: nacos
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-iy6dn0
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/common/nacos-server:2.0.2'
          ports:
            - name: tcp-8848
              protocol: TCP
              containerPort: 8848
              servicePort: 8848
            - name: tcp-9848
              protocol: TCP
              containerPort: 9848
              servicePort: 9848
          env:
            - name: MYSQL_SERVICE_DB_NAME
              value: nacos
            - name: MYSQL_SERVICE_DB_PARAM
              value: >-
                useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai
            - name: MYSQL_SERVICE_HOST
              value: IP
            - name: MYSQL_SERVICE_PASSWORD
              value: 数据库密码
            - name: MYSQL_SERVICE_PORT
              value: '3306'
            - name: MYSQL_SERVICE_USER
              value: root
            - name: SPRING_DATASOURCE_PLATFORM
              value: mysql
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: nacos
              readOnly: false
              mountPath: /home/nacos/data
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: nacos
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: nacos
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: nacos
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: nacos
spec:
  sessionAffinity: None
  selector:
    app: nacos
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: nacos
  template:
    metadata:
      labels:
        version: v1
        app: nacos
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: nacos
  ports:
    - name: tcp-8848
      protocol: TCP
      port: 8848
      targetPort: 8848
    - name: tcp-9848
      protocol: TCP
      port: 9848
      targetPort: 9848
  type: NodePort
~~~



#### （2）xxl-job

~~~yaml
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: xxl-job
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: xxl-job
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  selector:
    matchLabels:
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: xxl-job
  addOwnerRef: true
  componentKinds:
    - group: ''
      kind: Service
    - group: apps
      kind: Deployment
    - group: apps
      kind: StatefulSet
    - group: extensions
      kind: Ingress
    - group: servicemesh.kubesphere.io
      kind: Strategy
    - group: servicemesh.kubesphere.io
      kind: ServicePolicy
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: xxl-job
  name: xxl-job-ingress-j6ldh4
spec:
  rules: []
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: xxl-job
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: xxl-job
  name: xxl-job-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: xxl-job
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: xxl-job
  template:
    metadata:
      labels:
        version: v1
        app: xxl-job
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: xxl-job
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-7qspzi
          imagePullPolicy: IfNotPresent
          pullSecret: harbor
          image: 'IP:8088/common/xxl-job-admin'
          ports:
            - name: http-8094
              protocol: TCP
              containerPort: 8094
              servicePort: 8094
          env:
            - name: MYSQL_SERVICE_DB_NAME
              value: xxl-job
            - name: MYSQL_SERVICE_HOST
              value: IP
            - name: MYSQL_SERVICE_PORT
              value: '3306'
            - name: MYSQL_SERVICE_PASSWORD
              value: 数据库密码
            - name: MYSQL_SERVICE_USER
              value: root
            - name: SPRING_MAIL_HOST
              value: imap.163.com
            - name: SPRING_MAIL_PORT
              value: '143'
            - name: SPRING_MAIL_USERNAME
              value: xk_admin@163.com
            - name: SPRING_MAIL_FROM
              value: xk_admin@163.com
            - name: SPRING_MAIL_PASSWORD
              value: MDBSBUJZFYASSOUS
          volumeMounts:
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: xxl-job
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: xxl-job
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: xxl-job
spec:
  sessionAffinity: None
  selector:
    app: xxl-job
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: xxl-job
  template:
    metadata:
      labels:
        version: v1
        app: xxl-job
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: xxl-job
  ports:
    - name: http-8094
      protocol: TCP
      port: 8094
      targetPort: 8094
  type: NodePort
~~~



#### （3）devops-cloud-cluster

~~~yaml
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: devops-cloud-cluster
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  selector:
    matchLabels:
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  addOwnerRef: true
  componentKinds:
    - group: ''
      kind: Service
    - group: apps
      kind: Deployment
    - group: apps
      kind: StatefulSet
    - group: extensions
      kind: Ingress
    - group: servicemesh.kubesphere.io
      kind: Strategy
    - group: servicemesh.kubesphere.io
      kind: ServicePolicy
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  namespace: devops-cloud
  labels:
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-cloud-cluster-ingress-dydnej
spec:
  rules: []
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-cloud-gateway
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-cloud-gateway-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 4
  selector:
    matchLabels:
      version: v1
      app: devops-cloud-gateway
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-cloud-gateway
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-n68t1b
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-cloud-gateway:latest'
          ports:
            - name: tcp-10001
              protocol: TCP
              containerPort: 10001
              servicePort: 10001
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-cloud-gateway
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-cloud-gateway
spec:
  sessionAffinity: None
  selector:
    app: devops-cloud-gateway
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-cloud-gateway
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10001
      protocol: TCP
      port: 10001
      targetPort: 10001
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-system
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-system-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-system
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-system
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-bejgi2
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-system'
          ports:
            - name: tcp-10003
              protocol: TCP
              containerPort: 10003
              servicePort: 10003
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-system
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-system
spec:
  sessionAffinity: None
  selector:
    app: devops-system
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-system
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10003
      protocol: TCP
      port: 10003
      targetPort: 10003
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-aggregate
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-aggregate-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 4
  selector:
    matchLabels:
      version: v1
      app: devops-trade-aggregate
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-aggregate
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-v6eeyv
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-trade-aggregate'
          ports:
            - name: tcp-10005
              protocol: TCP
              containerPort: 10005
              servicePort: 10005
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-aggregate
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-trade-aggregate
spec:
  sessionAffinity: None
  selector:
    app: devops-trade-aggregate
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-aggregate
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10005
      protocol: TCP
      port: 10005
      targetPort: 10005
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-main
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-main-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 4
  selector:
    matchLabels:
      version: v1
      app: devops-trade-main
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-main
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-omhakh
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-trade-main'
          ports:
            - name: tcp-10006
              protocol: TCP
              containerPort: 10006
              servicePort: 10006
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-main
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-trade-main
spec:
  sessionAffinity: None
  selector:
    app: devops-trade-main
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-main
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10006
      protocol: TCP
      port: 10006
      targetPort: 10006
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-object
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-object-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 4
  selector:
    matchLabels:
      version: v1
      app: devops-trade-object
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-object
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-rsvqcf
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-trade-object'
          ports:
            - name: tcp-10007
              protocol: TCP
              containerPort: 10007
              servicePort: 10007
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-object
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-trade-object
spec:
  sessionAffinity: None
  selector:
    app: devops-trade-object
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-object
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10007
      protocol: TCP
      port: 10007
      targetPort: 10007
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-pay
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-pay-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-trade-pay
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-pay
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-7xq5cc
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-trade-pay'
          ports:
            - name: tcp-10008
              protocol: TCP
              containerPort: 10008
              servicePort: 10008
            - name: tcp-8201
              protocol: TCP
              containerPort: 8201
              servicePort: 8201
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-pay
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-trade-pay
spec:
  sessionAffinity: None
  selector:
    app: devops-trade-pay
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-pay
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10008
      protocol: TCP
      port: 10008
      targetPort: 10008
    - name: tcp-8201
      protocol: TCP
      port: 8201
      targetPort: 8201
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-process
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-process-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-trade-process
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-process
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-7e9lc8
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-trade-process'
          ports:
            - name: tcp-10009
              protocol: TCP
              containerPort: 10009
              servicePort: 10009
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-trade-process
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-trade-process
spec:
  sessionAffinity: None
  selector:
    app: devops-trade-process
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-trade-process
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10009
      protocol: TCP
      port: 10009
      targetPort: 10009
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-websocket
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-websocket-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-websocket
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-websocket
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-1vn5nf
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-websocket'
          ports:
            - name: tcp-10004
              protocol: TCP
              containerPort: 10004
              servicePort: 10004
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-websocket
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-websocket
spec:
  sessionAffinity: None
  selector:
    app: devops-websocket
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-websocket
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10004
      protocol: TCP
      port: 10004
      targetPort: 10004
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-workflow-core
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-workflow-core-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-workflow-core
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-workflow-core
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-u985hw
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-workflow-core'
          ports:
            - name: tcp-10010
              protocol: TCP
              containerPort: 10010
              servicePort: 10010
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-workflow-core
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-workflow-core
spec:
  sessionAffinity: None
  selector:
    app: devops-workflow-core
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-workflow-core
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10010
      protocol: TCP
      port: 10010
      targetPort: 10010
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-sign
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-sign-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-sign
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-sign
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-u985hw
          imagePullPolicy: Always
          pullSecret: harbor
          image: 'IP:8088/prod/devops-sign'
          ports:
            - name: tcp-10013
              protocol: TCP
              containerPort: 10013
              servicePort: 10013
          volumeMounts:
            - name: host-time
              mountPath: /etc/localtime
              readOnly: true
            - name: app
              readOnly: false
              mountPath: /app
      serviceAccount: default
      affinity: {}
      initContainers: []
      volumes:
        - hostPath:
            path: /etc/localtime
            type: ''
          name: host-time
        - name: app
          emptyDir: {}
      imagePullSecrets:
        - name: harbor
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: devops-cloud
  labels:
    version: v1
    app: devops-sign
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-sign
spec:
  sessionAffinity: None
  selector:
    app: devops-sign
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-sign
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10013
      protocol: TCP
      port: 10013
      targetPort: 10013
~~~



## 九、拉通流水线

#### 创建流水线工程 devops-cloud-auto

#### 创建所需凭证

- 新建镜像仓库凭证

![image-20220420222126737](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085725.png)

- 新建kubeconfig

默认生成

![image-20220420222210612](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085734.png)



#### 创建流水线 

- 代码检出

- 集成测试环境构建制品

- 清理部署

- 发布测试环境

![image-20220421164903217](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085743.png)

![image-20220420221640323](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085752.png)

> 注意：在构建制品时项目pom文件中镜像源地址仓库名是否在harbor中有创建，没有的话，运行流水线会报错，需要自己创建仓库

#### 可视化界面创建

- 代理环境 maven

![image-20220420221757461](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085810.png)

- 代码检出

> 凭证是项目代码仓库地址

- 集成测试环境制品构建

- 清理部署

![image-20220420223120319](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085818.png)

- 发布测试环境

![image-20220420223342778](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085825.png)

- 运行部署

失败，点击活动，查看日志。分析报错

![image-20220420223815150](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085831.png)

成功，等启动完，查看服务下所有容器的的日志，是否启动完成无报错

![image-20220420224253239](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085837.png)

#### 配置文件形式构建

**注意**

> - environment环境变量需要调整
>
> - 凭证需要调整



```
pipeline {
  agent {
    node {
      label 'maven'
    }

  }
  stages {
    stage('代码检出') {
      agent none
      steps {
        git(branch: 'dev-yanCheng20220512', url: 'http://IP/devops-studio/devops-cloud.git', credentialsId: 'github-id', changelog: true, poll: false)
      }
    }

    stage('集成测试环境制品构建') {
      agent none
      steps {
        container('maven') {
          withCredentials([usernamePassword(credentialsId : 'dockerhub-id' ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,)]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
          }

          sh 'mvn clean package  -P test5 -T 1C -Dmaven.test.skip=true  -Dmaven.compile.fork=true dockerfile:build dockerfile:push'
        }

      }
    }

    stage('清理部署') {
      agent none
      steps {
        kubernetesDeploy(enableConfigSubstitution: true, deleteResource: true, kubeconfigId: 'kubeconfig-id', configs: 'test5/**')
      }
    }

    stage('发布测试环境') {
      agent none
      steps {
        container('maven') {
          withCredentials([
                                                                                                                                                  kubeconfigFile(
                                                                                                                                                                          credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                                                                                                                                                                          variable: 'KUBECONFIG')
                                                                                                                                                                          ]) {
                sh 'envsubst < test5/deployment-aggregate.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-bank.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-file.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-gateway.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-main.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-object.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-process.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-system.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-websocket.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-workflow.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-analysis.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-sign.yaml | kubectl apply -f -'
                sh 'envsubst < test5/deployment-message.yaml | kubectl apply -f -'
              }

            }

          }
        }

      }
      environment {
        DOCKER_CREDENTIAL_ID = 'dockerhub-id'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-id'
        REGISTRY = 'IP:8088'
      }
    }
```









## 十、扩展

### *kubeshpere添加新节点

1、主节点上修改kk配置文件，加入新节点node2配置

![image-20220531171121778](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085847.png)

2、执行添加命令

```
./kk add nodes -f 配置文件
./kk add nodes -f sample.yaml
```

3、查看节点

```
kubectl get node
```

### *删除节点

```
./kk delete node <nodeName> -f config-sample.yaml
```

### *指定pod运行在固定ip上

标签选择器

1、打标签

```
#查看当前node
$ kubectl get node -o wide

NAME                STATUS   ROLES                  AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE         KERNEL-VERSION                 CONTAINER-RUNTIME
k8s-elasticsearch   Ready    <none>                 16h   v1.21.0   172.16.66.167   <none>        CentOS Linux 8   4.18.0-305.19.1.el8_4.x86_64   docker://20.10.9
k8s-master          Ready    control-plane,master   43h   v1.21.0   172.16.66.169   <none>        CentOS Linux 8   4.18.0-305.19.1.el8_4.x86_64   docker://20.10.9
k8s-node1           Ready    <none>                 43h   v1.21.0   172.16.66.168   <none>        CentOS Linux 8   4.18.0-305.19.1.el8_4.x86_64   docker://20.10.9
k8s-node2           Ready    <none>                 43h   v1.21.0   172.16.66.170   <none>        CentOS Linux 8   4.18.0-305.19.1.el8_4.x86_64   docker://20.10.9

#给k8s-node1 k8s-node2打上标签sign
$ kubectl label nodes k8s-node1 k8s-node2 type=sign

#查看type=websvr标签的node
$ kubectl get node -l type=websvr


NAME        STATUS   ROLES    AGE   VERSION
k8s-node1   Ready    <none>   43h   v1.21.0
k8s-node2   Ready    <none>   43h   v1.21.0

#以下附带标签的其他操作：
#修改标签
$ kubectl label nodes k8s-node1 k8s-node2 type=webtest --overwrite

#查看node标签
$ kubectl get nodes k8s-node1 k8s-node2 --show-labels

#删除标签
$ kubectl label nodes k8s-node1 k8s-node2 type-
```



2、插入选择器

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: websvr1-deployment
spec:
  selector:
    matchLabels:
      app: websvr1
  replicas: 3
  template:
    metadata:
      labels:
        app: websvr1
    spec:
      nodeSelector:                 #选择标签为type:websvr的node部署
        type: websvr
      containers:
      - name: websvr1
        image: websvr:v1
        ports:
        - containerPort: 3000
```

![image-20220630095812994](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085855.png)

**扩展（固定在节点上）**

```
      nodeSelector:
        kubernetes.io/hostname: node187
```

集群中的每个节点默认已经附带了多个标签，如kubernetes.io/hostname、 beta.kubernetes.io/os 和beta.kubernetes.io/arch 等。这些标签也可以直接由nodeSelector使用，尤其是希望将Pod调度至某特定节点时，可以使用kubernetes.io/hostname 直接绑定至相应的主机即可。不过，这种绑定至特定主机的需求还有一种更为简单的实现方式，即使用spec.nodeName字段直接指定目标节点。

### *数据挂载

kubesphere的存储卷是属于分布式存储，不用关心存储底层做了啥。但我们需要将数据存在当前服务器的文件目录下，可使用volume配置形式挂载

```
#直白的说, 就是挂载在磁盘上.
apiVersion: v1
kind: Pod
spec: 
  containers: 
    - name: test
      image: nginx
      # 定义进行挂载的数据卷
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes: 
    - name: config-volume
      hostPath: 
        path: /usr/etc/nginx/config
```

上面将（服务器宿主机）本地的目录 `/usr/etc/nginx/config` 挂在到的容器的 `/etc/config` 上.

```
kind: Deployment
apiVersion: apps/v1
metadata:
  name: devops-file-v1
  namespace: devops
  labels:
    app: devops-file
    app.kubernetes.io/name: devops-cloud-cluster
    app.kubernetes.io/version: v1
    version: v1
  annotations:
    deployment.kubernetes.io/revision: '34'
    kubesphere.io/creator: admin
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devops-file
      app.kubernetes.io/name: devops-cloud-cluster
      app.kubernetes.io/version: v1
      version: v1
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: devops-file
        app.kubernetes.io/name: devops-cloud-cluster
        app.kubernetes.io/version: v1
        version: v1
      annotations:
        kubesphere.io/restartedAt: '2022-10-31T03:18:27.126Z'
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      volumes:
        - name: host-time
          hostPath:
            path: /etc/localtime
            type: ''
        - name: app
          emptyDir: {}
        - name: filedata
          hostPath:
            path: /home/filedata
            type: ''
      containers:
        - name: container-5qxqpy
          image: '10.84.x.x:8088/prod/devops-file'
          ports:
            - name: tcp-10002
              containerPort: 10002
              protocol: TCP
          env:
            - name: JVM
              value: '-Xms2g -Xmx2g'
            - name: BOOTSTRAP_SERVER
              value: '10.84.x.x:9092,10.84.x.x:9092,10.84.x.x:9092'
          resources: {}
          volumeMounts:
            - name: host-time
              readOnly: true
              mountPath: /etc/localtime
            - name: app
              mountPath: /app
            - name: filedata
              mountPath: /home/filedata
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      nodeSelector:
        type: file
      serviceAccountName: default
      serviceAccount: default
      securityContext: {}
      imagePullSecrets:
        - name: harbor
      affinity: {}
      schedulerName: default-scheduler
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600

```



### *允许访问网络

移动网络

```
      dnsConfig:
        nameservers:
          - 114.114.114.114
        options:
          - name: ndots
            value: '2'
          - name: edns0
```

![image-20220630095724658](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107085904.png)

## 十一、常见问题



### https参数未设置( The protocol is https but attribute ssl_cert is not set)



> 原因分析：顾名思义，一看就知道，https参数未设置，而本就不需要用https
>
> 解决方案：配置文件中的https注释掉，注释掉即可



### 启动harbor报( Failed to Setup IP tables: Unable to enable SKIP DNAT rule）



> 原因分析：之前关闭防火墙之后docker没有重启，
>
> 解决方案：执行以下命令重启docker即可
>
> service docker restart



### 连接私服报(http: server gave HTTP response to HTTPS client)



> 原因分析：Docker Registry 交互默认使用的是 HTTPS，但是搭建私有镜像默认使用的是 HTTP 服务，所以与私有镜像交互时出现以下错误。
>
> 解决方案：docker系统服务添加安全进程

vi /etc/docker/daemon.json填入`insecure-registries`：

```yml
{
  "registry-mirrors": [
    "https://sq9p56f6.mirror.aliyuncs.com"
  ],
  "insecure-registries": ["192.168.x.x:8088"],
  "exec-opts":["native.cgroupdriver=systemd"]
}
```



### docker磁盘空间不足（ERROR：cannot  create temporary directory）（fatal error: runtime: out of memory）

> 原因分析：通过`du -h --max-depth=1 /` 逐级目录排查，发现/var/lib/docker目录文件过大
>
> 解决方案：转移数据修改docker默认存储位置 或者 搞一个外部存储

（1）转移数据修改docker默认存储位置

~~~bash
#停止docker服务
systemctl stop docker
#创建新的docker目录，执行命令df -h,找一个大的磁盘
 mkdir -p /app/docker/lib
#迁移/var/lib/docker目录下面的文件到/app/docker/lib
rsync -avz /var/lib/docker/ /app/docker/lib/
#配置 /usr/lib/systemd/system/docker.service
vi /usr/lib/systemd/system/docker.service
#重启docker
systemctl daemon-reload
systemctl restart docker
systemctl enable docker
~~~

（2）确认Docker Root Dir修改是否已经生效

~~~bash
[root@node24 docker]# docker info
...
Docker Root Dir: /app/docker/lib/docker
Debug Mode (client): false
Debug Mode (server): false
Registry: https://index.docker.io/v1/
...
~~~

（3）确认之前的镜像是否还在

~~~bash
[root@master24 kk]# docker images
REPOSITORY                                                                TAG                            IMAGE ID            CREATED             SIZE
perl                                                                      latest                         f9596eddf06f        5 months ago        890MB
hello-world                                                               latest                         feb5d9fea6a5        8 months ago        13.3kB
192.168.x.x:8088/library/nginxdemos/hello                              plain-text                     21dd11c8fb7a        8 months ago        22.9MB
nginxdemos/hello                                                          plain-text                     21dd11c8fb7a        8 months ago        22.9MB
192.168.x.x:8088/library/kubesphere/edge-watcher                       v0.1.0                         f3c1c017ccd5        8 months ago        47.8MB
kubesphere/edge-watcher                                                   v0.1.0                         f3c1c017ccd5        8 months ago        47.8MB
~~~

（4） 确定容器没问题后删除/var/lib/docker/目录中的文件

~~~bash
rm -rf /var/lib/docker
~~~



### 镜像不存在(No such image: perl:latest)

> docker里没有该镜像，pull一个然后给个标记推送至私服即可

### 连接超过重试次数(connection reset by peer. See 'docker run --help'.)

（1）情况一

> docker默认的源为国外官方源，下载速度较慢，改成国内镜像源

vi /etc/docker/daemon.json填入`registry-mirrors`：

```yml
{
  "registry-mirrors": [
    "https://sq9p56f6.mirror.aliyuncs.com"  #这是我自个阿里云的镜像加速器，你可去阿里弄个自己的
  ],
  "insecure-registries": ["192.168.x.x:8088"],
  "exec-opts":["native.cgroupdriver=systemd"]
}
```

（2）情况二

> harbor出问题了，导致私服连接不上

（3）情况三

> config-sample.yaml中配置的私服有问题，导致找不到对应的镜像