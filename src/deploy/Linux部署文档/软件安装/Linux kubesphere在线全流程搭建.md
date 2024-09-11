---
title: Linux kubesphere在线全流程搭建
categories: 
  - Docker
tags: 
  - k8s
order: 6
---



**本文以centos，自定义项目devops-clod为例**

# 一、Docker安装

## 一、移除以前docker相关包

```
systemctl stop docker

sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

```
或者
systemctl status docker

查询docker安装过的包
yum list installed | grep docker
删除安装包
yum remove docker-ce.x86_64 ddocker-ce-cli.x86_64 -y
删除镜像/容器等
rm -rf /var/lib/docker
```

## 二、配置相关yum源

```
sudo yum install -y yum-utils
sudo yum-config-manager \
--add-repo \
http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

在足够安全的外部防护下，可以永久关闭selinux

```
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
systemctl stop firewalld && systemctl disable firewalld
swapoff -a
sed -i 's/.*swap.*/#&/' /etc/fstab 
```



## 三、安装docker

```
#以下是在安装k8s的时候使用
yum install -y docker-ce-20.10.7 docker-ce-cli-20.10.7  containerd.io-1.4.6
或
#安装最新版docker
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

## 四、启动docker

```
systemctl enable docker --now
```

## 五、配置加速

```
#这里额外添加了docker的生产环境核心配置cgroup
sudo mkdir -p /etc/docker
#镜像仓库地址，按需修改
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

#配置文件生效
sudo systemctl daemon-reload
#重启docker
sudo systemctl restart docker
```



# 二、kubesphere及k8s安装

移除k8s命令（可选）

```
kubeadm reset -f
modprobe -r ipip
rm -rf ~/.kube/
rm -rf /etc/kubernetes/
rm -rf /etc/systemd/system/kubelet.service.d
rm -rf /etc/systemd/system/kubelet.service
rm -rf /usr/bin/kube*
rm -rf /etc/cni
rm -rf /opt/cni
rm -rf /var/lib/etcd
rm -rf /var/etcd
yum clean all
yum remove kube*
```

```
卸载 KubeSphere 和 Kubernetes 意味着将其从您的机器上移除。该操作不可逆，且不会进行任何备份。请谨慎操作
./kk delete cluster -f config-sample.yaml
```

## 一、通过KubeKey安装工具安装

```
#各个机器设置自己的名称
hostnamectl set-hostname xxxx
```

## 二、在线安装：

主节点点安装

```
##找一个合适的目录，执行命令
export KKZONE=cn;
#下载kk
curl -sfL https://get-kk.kubesphere.io | VERSION=v1.1.1 sh -
#给定权限
chmod +x kk
./kk create config --with-kubernetes v1.20.4 --with-kubesphere v3.1.1 -f config-sample.yaml
##编辑config-sample.yaml
vim config-sample.yaml
##给spec.hosts下把所有的要纳入集群的机器登录方式进行指定
##给spec.roleGroups.etcd填入主节点
##给spec.roleGroups.master填入主节点
##给spec.roleGroups.worker填入其他所有要参与到编排部署应用的机器
##执行：./kk create cluster -f config-sample.yaml
```

```
错误提示：
1、安装前可提前安装好所需插件
yum install -y socat conntrack ebtables ipset
2、一直有报错：The connection to the server localhost:8080 was refused - did you specify the right host or port?: Process exited with status 1
可以尝试下面的命令，清除集群，重新创建集群
./kk delete cluster -f config-sample.yaml
3、需要安装插件master: conntrack is required.
yum install -y conntrack
4、ssl密钥文件在从节点不存在
ERRO[14:57:06 CST] Failed to exec command: sudo -E /bin/sh -c "/usr/local/bin/kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs --from-file=etcd-client-ca.crt=/etc/ssl/etcd/ssl/ca.pem --from-file=etcd-client.crt=/etc/ssl/etcd/ssl/node-master.pem --from-file=etcd-client.key=/etc/ssl/etcd/ssl/node-master-key.pem" 
error: error reading /etc/ssl/etcd/ssl/node-master.pem: no such file or directory: Process exited with status 1  node=192.168.179.159
WARN[14:57:06 CST] Task failed ...                              
WARN[14:57:06 CST] error: interrupted by error   
解决：
在从节点复制member-xxx.pem改成对应的名称即可
cp /etc/ssl/etcd/ssl/member-master-key.pem /etc/ssl/etcd/ssl/node-master-key.pem
cp /etc/ssl/etcd/ssl/member-master.pem /etc/ssl/etcd/ssl/node-master.pem
```

出现访问地址和用户名密码及安装成功

![image-20220421150627306](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090024.png)

# 三、流水线搭建

devops流水线默认是关闭的，需要开启devops流水线

![image-20220421151322852](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090032.png)

> 遇到相关容器阻塞导致devops迟迟无法安装，在kubesphere上删除对应阻塞的容器重新安装

## 一、前期准备

项目所需中间件

**nacos，mysql，redis，xxl-job**

#### 1、创建企业空间

![image-20220420212119330](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090039.png)

#### 2、创建项目管理

> KubeSphere 中的项目对应的是 Kubernetes 的 namespace

![image-20220420212159720](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090045.png)

#### 3、项目管理中配置镜像仓库密钥

![image-20220420212425461](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090052.png)

#### 4、安装好相关环境

需要用到的容器

1、nacos

2、xxl-job

3、redis

4、mysql（外部安装）



### 1、nacos部署

#### 1）相关数据库配置

1、创建nacos需连接的数据库

2、执行nacos初始化sql

```
/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info   */
/******************************************/
CREATE TABLE `config_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  `c_desc` varchar(256) DEFAULT NULL,
  `c_use` varchar(64) DEFAULT NULL,
  `effect` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `c_schema` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_aggr   */
/******************************************/
CREATE TABLE `config_info_aggr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) NOT NULL COMMENT 'group_id',
  `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
  `content` longtext NOT NULL COMMENT '内容',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='增加租户字段';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_beta   */
/******************************************/
CREATE TABLE `config_info_beta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_tag   */
/******************************************/
CREATE TABLE `config_info_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_tags_relation   */
/******************************************/
CREATE TABLE `config_tags_relation` (
  `id` bigint(20) NOT NULL COMMENT 'id',
  `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
  `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `nid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = group_capacity   */
/******************************************/
CREATE TABLE `group_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID，空字符表示整个集群',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数，，0表示使用默认值',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='集群、各Group容量信息表';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = his_config_info   */
/******************************************/
CREATE TABLE `his_config_info` (
  `id` bigint(64) unsigned NOT NULL,
  `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data_id` varchar(255) NOT NULL,
  `group_id` varchar(128) NOT NULL,
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL,
  `md5` varchar(32) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
  `src_user` text,
  `src_ip` varchar(20) DEFAULT NULL,
  `op_type` char(10) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`nid`),
  KEY `idx_gmt_create` (`gmt_create`),
  KEY `idx_gmt_modified` (`gmt_modified`),
  KEY `idx_did` (`data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='多租户改造';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = tenant_capacity   */
/******************************************/
CREATE TABLE `tenant_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='租户容量信息表';


CREATE TABLE `tenant_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `kp` varchar(128) NOT NULL COMMENT 'kp',
  `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
  `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
  `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
  `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
  `gmt_create` bigint(20) NOT NULL COMMENT '创建时间',
  `gmt_modified` bigint(20) NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';

CREATE TABLE users (
	username varchar(50) NOT NULL PRIMARY KEY,
	password varchar(500) NOT NULL,
	enabled boolean NOT NULL
);

CREATE TABLE roles (
	username varchar(50) NOT NULL,
	role varchar(50) NOT NULL,
	constraint uk_username_role UNIQUE (username,role)
);

CREATE TABLE permissions (
    role varchar(50) NOT NULL,
    resource varchar(512) NOT NULL,
    action varchar(8) NOT NULL,
    constraint uk_role_permission UNIQUE (role,resource,action)
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');

```

#### 2、自制应用创建nacos（yml形式）

> 注意修改 工作空间namespace，镜像源地址image，数据源地址

```
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: nacos
  namespace: dev2
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
  namespace: dev2
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
          image: '192.168.179.188:8080/common/nacos-server:2.0.2'
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
              value: nacos-dev2
            - name: MYSQL_SERVICE_DB_PARAM
              value: >-
                useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&useSSL=false&zeroDateTimeBehavior=convertToNull&serverTimezone=Asia/Shanghai
            - name: MYSQL_SERVICE_HOST
              value: 192.168.179.215
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
  namespace: dev2
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
```

3、容器组中查看日志启动成功

![image-20220420213711495](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090104.png)

4、服务中可查看Dns（应用名称+命名空间）

dns用于集群内应用访问使用（连接nacos通过该dns连接）

![image-20220420213813756](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090112.png)



### 二、xxl-job部署

https://gitee.com/xuxueli0323/xxl-job

#### 1）新建xxl-job数据库

```
#
# XXL-JOB v2.3.1-SNAPSHOT
# Copyright (c) 2015-present, xuxueli.

SET NAMES utf8mb4;

CREATE TABLE `xxl_job_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_group` int(11) NOT NULL COMMENT '执行器主键ID',
  `job_desc` varchar(255) NOT NULL,
  `add_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `author` varchar(64) DEFAULT NULL COMMENT '作者',
  `alarm_email` varchar(255) DEFAULT NULL COMMENT '报警邮件',
  `schedule_type` varchar(50) NOT NULL DEFAULT 'NONE' COMMENT '调度类型',
  `schedule_conf` varchar(128) DEFAULT NULL COMMENT '调度配置，值含义取决于调度类型',
  `misfire_strategy` varchar(50) NOT NULL DEFAULT 'DO_NOTHING' COMMENT '调度过期策略',
  `executor_route_strategy` varchar(50) DEFAULT NULL COMMENT '执行器路由策略',
  `executor_handler` varchar(255) DEFAULT NULL COMMENT '执行器任务handler',
  `executor_param` varchar(512) DEFAULT NULL COMMENT '执行器任务参数',
  `executor_block_strategy` varchar(50) DEFAULT NULL COMMENT '阻塞处理策略',
  `executor_timeout` int(11) NOT NULL DEFAULT '0' COMMENT '任务执行超时时间，单位秒',
  `executor_fail_retry_count` int(11) NOT NULL DEFAULT '0' COMMENT '失败重试次数',
  `glue_type` varchar(50) NOT NULL COMMENT 'GLUE类型',
  `glue_source` mediumtext COMMENT 'GLUE源代码',
  `glue_remark` varchar(128) DEFAULT NULL COMMENT 'GLUE备注',
  `glue_updatetime` datetime DEFAULT NULL COMMENT 'GLUE更新时间',
  `child_jobid` varchar(255) DEFAULT NULL COMMENT '子任务ID，多个逗号分隔',
  `trigger_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '调度状态：0-停止，1-运行',
  `trigger_last_time` bigint(13) NOT NULL DEFAULT '0' COMMENT '上次调度时间',
  `trigger_next_time` bigint(13) NOT NULL DEFAULT '0' COMMENT '下次调度时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `job_group` int(11) NOT NULL COMMENT '执行器主键ID',
  `job_id` int(11) NOT NULL COMMENT '任务，主键ID',
  `executor_address` varchar(255) DEFAULT NULL COMMENT '执行器地址，本次执行的地址',
  `executor_handler` varchar(255) DEFAULT NULL COMMENT '执行器任务handler',
  `executor_param` varchar(512) DEFAULT NULL COMMENT '执行器任务参数',
  `executor_sharding_param` varchar(20) DEFAULT NULL COMMENT '执行器任务分片参数，格式如 1/2',
  `executor_fail_retry_count` int(11) NOT NULL DEFAULT '0' COMMENT '失败重试次数',
  `trigger_time` datetime DEFAULT NULL COMMENT '调度-时间',
  `trigger_code` int(11) NOT NULL COMMENT '调度-结果',
  `trigger_msg` text COMMENT '调度-日志',
  `handle_time` datetime DEFAULT NULL COMMENT '执行-时间',
  `handle_code` int(11) NOT NULL COMMENT '执行-状态',
  `handle_msg` text COMMENT '执行-日志',
  `alarm_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '告警状态：0-默认、1-无需告警、2-告警成功、3-告警失败',
  PRIMARY KEY (`id`),
  KEY `I_trigger_time` (`trigger_time`),
  KEY `I_handle_code` (`handle_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_log_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trigger_day` datetime DEFAULT NULL COMMENT '调度-时间',
  `running_count` int(11) NOT NULL DEFAULT '0' COMMENT '运行中-日志数量',
  `suc_count` int(11) NOT NULL DEFAULT '0' COMMENT '执行成功-日志数量',
  `fail_count` int(11) NOT NULL DEFAULT '0' COMMENT '执行失败-日志数量',
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_trigger_day` (`trigger_day`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_logglue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL COMMENT '任务，主键ID',
  `glue_type` varchar(50) DEFAULT NULL COMMENT 'GLUE类型',
  `glue_source` mediumtext COMMENT 'GLUE源代码',
  `glue_remark` varchar(128) NOT NULL COMMENT 'GLUE备注',
  `add_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_registry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registry_group` varchar(50) NOT NULL,
  `registry_key` varchar(255) NOT NULL,
  `registry_value` varchar(255) NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `i_g_k_v` (`registry_group`,`registry_key`,`registry_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(64) NOT NULL COMMENT '执行器AppName',
  `title` varchar(12) NOT NULL COMMENT '执行器名称',
  `address_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '执行器地址类型：0=自动注册、1=手动录入',
  `address_list` text COMMENT '执行器地址列表，多地址逗号分隔',
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '账号',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `role` tinyint(4) NOT NULL COMMENT '角色：0-普通用户、1-管理员',
  `permission` varchar(255) DEFAULT NULL COMMENT '权限：执行器ID列表，多个逗号分割',
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_job_lock` (
  `lock_name` varchar(50) NOT NULL COMMENT '锁名称',
  PRIMARY KEY (`lock_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `xxl_job_group`(`id`, `app_name`, `title`, `address_type`, `address_list`, `update_time`) VALUES (1, 'xxl-job-executor-sample', '示例执行器', 0, NULL, '2018-11-03 22:21:31' );
INSERT INTO `xxl_job_info`(`id`, `job_group`, `job_desc`, `add_time`, `update_time`, `author`, `alarm_email`, `schedule_type`, `schedule_conf`, `misfire_strategy`, `executor_route_strategy`, `executor_handler`, `executor_param`, `executor_block_strategy`, `executor_timeout`, `executor_fail_retry_count`, `glue_type`, `glue_source`, `glue_remark`, `glue_updatetime`, `child_jobid`) VALUES (1, 1, '测试任务1', '2018-11-03 22:21:31', '2018-11-03 22:21:31', 'XXL', '', 'CRON', '0 0 0 * * ? *', 'DO_NOTHING', 'FIRST', 'demoJobHandler', '', 'SERIAL_EXECUTION', 0, 0, 'BEAN', '', 'GLUE代码初始化', '2018-11-03 22:21:31', '');
INSERT INTO `xxl_job_user`(`id`, `username`, `password`, `role`, `permission`) VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 1, NULL);
INSERT INTO `xxl_job_lock` ( `lock_name`) VALUES ( 'schedule_lock');

commit;
```



#### 2）自制应用创建xxl-job

> 注意修改 命名空间namespace，镜像源地址images，数据库连接方式，
>

yml中数据库名称要于自建应用数据库连接对应

```
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: xxl-job
  namespace: dev3
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
  namespace: dev3
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
  namespace: dev3
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
          image: '192.168.179.188:8080/common/xxl-job-admin'
          ports:
            - name: http-8094
              protocol: TCP
              containerPort: 8094
              servicePort: 8094
          env:
            - name: MYSQL_SERVICE_DB_NAME
              value: xxl-job-dev3
            - name: MYSQL_SERVICE_HOST
              value: 192.168.179.215
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
  namespace: dev3
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
```

- 查看容器组日志，启动成功

  ![image-20220420214945237](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090122.png)

  - 服务中查看nds

    ![image-20220420215058926](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090128.png)

    

### 三、redis部署

#### 1）配置中心创建配置

![image-20220421160057253](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090136.png)

#### 2）创建存储卷

![image-20220421154812227](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090143.png)

#### 3）创建容器

> 有状态服务不能对外暴露端口，只有无状态服务才可以；当然如果上线部署的话还是要选择有状态服务

- 设置启动命令

  > 此处启动并加载/etc/redis/redis.conf的配置文件，下文中配置文件路径一致

  ![image-20220421160335556](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090151.png)

#### 4）添加存储卷

目录为`/data`

![image-20220421155236818](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090157.png)

#### 5）挂载配置文件

挂在配置文件，这里我们选择上面配置的配置文件，路径和上面一致为`/etc/redis/redis.conf`，意思就是上面启动命令是启动`/etc/redis/redis.conf`配置文件，这里将`redis-conf`中的配置信息关联给`/etc/redis/redis.conf`(这里redis.conf不写的话需要跟配置中的键保持一致)

![image-20220421160454198](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090203.png)





## 二、项目代码配置

### 一、pom文件

修改pom连接配置

1、检查nacos的dns是否一致

2、配置文件名称，组名是否一致

![image-20220420220429122](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090212.png)

项目采用的是nacos

> 在kubesphere面板服务里查看nacos的外放访问端口，处于哪台服务器，ip+端口/nacos访问nacos

登录nacos添加项目配置文件(跟项目中pom所写保持一致)

![image-20220421163229765](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090218.png)

### 二、配置Dockerfile构建构建文件（每个服务都要）

> 注意：每个服务端口不一致，jar包名称不一致

```
#设置镜像基础，jdk8
FROM java:8
#维护人员信息
MAINTAINER hetao
#设置镜像对外暴露端口
EXPOSE 10014
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#将当前 target 目录下的 jar 放置在根目录下，命名为 app.jar，推荐使用绝对路径。
ADD target/devops-validator.jar /devops-validator.jar
#执行启动命令
ENTRYPOINT java ${JVM:=-Xms2048m -Xmx2048m} -Djava.security.egd=file:/dev/./urandom -jar /devops-validator.jar
```

### 三、项目中流水线构建Deployment容器所需的配置文件（每个服务都要）

> 每个服务配置不一样，主要修改其中的 名称name，命名空间namespace，应用名称app，镜像源地址images，端口tcp
>
> ![image-20220421163617011](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090227.png)

```
kind: Deployment
apiVersion: apps/v1
metadata:
  name: devops-validator-v1
  namespace: dev2
  labels:
    app: devops-validator
    app.kubernetes.io/name: devops-cloud-cluster
    app.kubernetes.io/version: v1
    version: v1
  annotations:
    deployment.kubernetes.io/revision: '2'
    kubesphere.io/creator: admin
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      app: devops-validator
      app.kubernetes.io/name: devops-cloud-cluster
      app.kubernetes.io/version: v1
      version: v1
  template:
    metadata:
      labels:
        app: devops-validator
        app.kubernetes.io/name: devops-cloud-cluster
        app.kubernetes.io/version: v1
        version: v1
      annotations:
        kubesphere.io/restartedAt: '2021-12-02T05:13:43.487Z'
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
      containers:
        - name: container-bejgi2
          image: '192.168.x.x:8080/trade-dev2/devops-validator'
          ports:
            - name: tcp-10014
              containerPort: 10014
              protocol: TCP
          env:
            - name: JVM
              value: '-Xms256m -Xmx256m'
          resources:
            limits:
              cpu: '1'
              memory: 1000Mi
            requests:
              cpu: 500m
              memory: 500Mi
          volumeMounts:
            - name: host-time
              readOnly: true
              mountPath: /etc/localtime
            - name: app
              mountPath: /app
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: Always
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      serviceAccountName: default
      serviceAccount: default
      securityContext: {}
      imagePullSecrets:
        - name: harbor
      affinity: {}
      schedulerName: default-scheduler
  strategy:
    type: Recreate
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
```

## 三、拉通流水线

### 一、创建流水线工程 devops-cloud-auto

### 二、创建所需凭证

#### 1、新建镜像仓库凭证

![image-20220420222126737](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090236.png)

#### 2、新建kubeconfig

默认生成

![image-20220420222210612](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090243.png)



### 三、创建流水线 

> 主要4步：
>
> 代码检出
>
> 集成测试环境构建制品
>
> 清理部署
>
> 发布测试环境
>
> 注意：在构建制品时项目pom文件中镜像源地址仓库名是否在harbor中有创建，没有的话，运行流水线会报错，需要自己创建仓库
>
> ![image-20220421164903217](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090250.png)

![image-20220420221640323](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090258.png)

#### 1)代理环境 maven

#### 2）代码检出

> 凭证是项目代码仓库地址

![image-20220420222438920](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090304.png)

![image-20220421173225644](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090311.png)

#### 3）集成测试环境制品构建

注意环境变量需要自己在保存后的面板上，编辑jekins，添加相关配置（当然也可写死不配置在环境变量中，不建议）

![image-20220420223545289](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090317.png)

![image-20220420222922754](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090324.png)

#### 4）清理部署

![image-20220420223120319](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090331.png)

#### 5）发布测试环境

![image-20220420223342778](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090337.png)

#### 6）运行部署

失败，点击活动，查看日志。分析报错

![image-20220420223815150](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090344.png)

成功，等启动完，查看服务下所有容器的的日志，是否启动完成无报错

![image-20220420224253239](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090351.png)

#### 7）（可选）使用配置文件形式构建流水线

> 1、environment环境变量要改一下
>
> 2、编辑流水线每一个环节的凭证也改成自己定义的
>
> ![image-20220421164309958](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090401.png)

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
        git(branch: 'dev-checkService-ldf', url: 'http://47.x.x.x/devops-studio/devops-cloud.git', credentialsId: 'zhao-huang', changelog: true, poll: false)
      }
    }

    stage('集成测试环境制品构建') {
      agent none
      steps {
        container('maven') {
          withCredentials([usernamePassword(credentialsId : 'zhaohuanh-docker' ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME')]) {
            sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
          }

          sh 'mvn clean package  -P dev2 -T 1C -Dmaven.test.skip=true  -Dmaven.compile.fork=true dockerfile:build dockerfile:push'
        }

      }
    }

    stage('清理部署') {
      agent none
      steps {
        kubernetesDeploy(enableConfigSubstitution: true, deleteResource: true, kubeconfigId: 'kubeconfig', configs: 'dev/dev2/*')
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
                sh 'envsubst < dev/dev2/deployment-aggregate.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-bank.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-file.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-gateway.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-main.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-object.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-process.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-system.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-websocket.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-workflow.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-analysis.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-sign.yaml | kubectl apply -f -'
                        sh 'envsubst < dev/dev2/deployment-validator.yaml | kubectl apply -f -'
              }

            }

          }
        }

      }
      environment {
        DOCKER_CREDENTIAL_ID = 'zhaohuanh-docker'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
        REGISTRY = '192.168.x.x:8080'
        DOCKERHUB_NAMESPACE = 'zhongzhi'
        APP_NAME = 'dev-estate'
        BRANCH_NAME = 'dev'
        DOCKER_USERNAME = 'admin'
        DOCKER_PASSWORD = '镜像仓库密码'
      }
    }
```

#### 8)问题：

私有仓库依赖下不下来（配置自己的仓库地址）

集群管理 -> 配置 -> 配置字典 -> 搜索ks-devops-agent -> 右边三个点 -> 编辑配置 -> **MavenSetting -> 编辑 -> 把值改成自己通用的maven settings配置就好。**

## 四、自制服务应用

由于在代码中构建容器的配置文件是构建工作负载的yml，

所以只能看到工作负载中有容器，而无法通过服务关联资源和开放外网。

当然通过面板服务关联资源可以实现，但通过自制应用统一管理各服务应用更方便管理

> 注意修改 自制应用名称name，命名空间namespace，镜像源地址images，

```
apiVersion: app.k8s.io/v1beta1
kind: Application
metadata:
  name: devops-cloud-cluster
  namespace: dev2
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
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-cloud-gateway
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-cloud-gateway-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
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
          image: '192.168.x.x:8080/trade-dev2/devops-cloud-gateway:latest'
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
      nodeSelector:
        kubernetes.io/hostname: node187
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
---
apiVersion: v1
kind: Service
metadata:
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-file
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-file-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-file
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-file
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
      annotations:
        logging.kubesphere.io/logsidecar-config: '{}'
        sidecar.istio.io/inject: 'false'
    spec:
      containers:
        - name: container-5qxqpy
          imagePullPolicy: Always
          pullSecret: harbor
          image: '192.168.x.x:8080/trade-dev2/devops-file'
          ports:
            - name: tcp-10002
              protocol: TCP
              containerPort: 10002
              servicePort: 10002
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
  namespace: dev2
  labels:
    version: v1
    app: devops-file
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-file
spec:
  sessionAffinity: None
  selector:
    app: devops-file
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-file
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10002
      protocol: TCP
      port: 10002
      targetPort: 10002
---
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: dev2
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
          image: '192.168.x.x:8080/trade-dev2/devops-system'
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
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-trade-aggregate
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-aggregate-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
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
          image: '192.168.x.x:8080/trade-dev2/devops-trade-aggregate'
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
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-trade-main
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-main-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
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
          image: '192.168.x.x:8080/trade-dev2/devops-trade-main'
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
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-trade-object
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-trade-object-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
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
          image: '192.168.x.x:8080/trade-dev2/devops-trade-object'
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
  namespace: dev2
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
  namespace: dev2
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
          image: '192.168.x.x:8080/trade-dev2/devops-trade-pay'
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
  namespace: dev2
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
  namespace: dev2
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
          image: '192.168.x.x:8080/trade-dev2/devops-trade-process'
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
  namespace: dev2
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
  namespace: dev2
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
          image: '192.168.x.x:8080/trade-dev2/devops-websocket'
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
  namespace: dev2
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
  namespace: dev2
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
          image: '192.168.x.x:8080/trade-dev2/devops-workflow-core'
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
  namespace: dev2
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
  namespace: dev2
  labels:
    version: v1
    app: devops-validator
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  name: devops-validator-v1
  annotations:
    servicemesh.kubesphere.io/enabled: 'false'
spec:
  replicas: 1
  selector:
    matchLabels:
      version: v1
      app: devops-validator
      app.kubernetes.io/version: v1
      app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-validator
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
          image: '192.168.x.x:8080/trade-dev2/devops-validator'
          ports:
            - name: tcp-10014
              protocol: TCP
              containerPort: 10014
              servicePort: 10014
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
  namespace: dev2
  labels:
    version: v1
    app: devops-validator
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  annotations:
    kubesphere.io/serviceType: statelessservice
    servicemesh.kubesphere.io/enabled: 'false'
  name: devops-validator
spec:
  sessionAffinity: None
  selector:
    app: devops-validator
    app.kubernetes.io/version: v1
    app.kubernetes.io/name: devops-cloud-cluster
  template:
    metadata:
      labels:
        version: v1
        app: devops-validator
        app.kubernetes.io/version: v1
        app.kubernetes.io/name: devops-cloud-cluster
  ports:
    - name: tcp-10014
      protocol: TCP
      port: 10014
      targetPort: 10014
```



## 五、安装Harbor

私有镜像仓库

安装前先安装好docker、docker-compase

> 1. mac和windows客户端下安装完docker之后,docker-compose是带着的
> 2. linux系统下,需要先安装docker,然后再安装docker-compose

Docker-compose安装

```
curl -L "https://github.com/docker/compose/releases/download/1.28.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

或者

```
# 下载docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# 添加可执行权限
sudo chmod +x /usr/local/bin/docker-compose
# 将文件copy到 /usr/bin/目录下
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
# 查看版本
docker-compose --version
```

### 1、下载安装包拷贝到linux中

离线安装

离线安装包下载

https://github.com/goharbor/harbor/releases

```
cd /data/  # 切换至/data/目录下
mkdir harbor # 创建目录harbor
# 将下载好的harbor-offline-installer-v1.10.1.tgz解压
tar -xcvf harbor-offline-installer-v1.10.1.tgz #解压
```

在线安装

在线安装包下载

https://mirror.rancher.cn/#harbor/

```
cd /data/  # 切换至/data/目录下
mkdir harbor # 创建目录harbor
# 将下载好的harbor-online-installer-v1.10.10.tgz解压
tar -zxvf harbor-online-installer-v1.10.10.tgz #解压
```

### 2、修改配置文件

```
vim harbor.yml  
```

![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090418.png)

### 3、执行安装脚本

```
./install.sh  # 安装
```

![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090426.png)

### 4、查看镜像

因为harbor本身自带docker 私有仓库，可以通过docker ps查看

![图片](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090432.png)

### 5、访问harbor

ip+端口

![image-20220426140408316](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090438.png)



```
#启动harbor
docker-compose start
#停止harbor
docker-compose stop
```

