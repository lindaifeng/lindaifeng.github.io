---
order: 1
title: M1 Docker各应用安装（汇总）
categories: 
  - Mac
tags: 
  - docker
---

## Docker安装Nginx

### 1、安装Nginx镜像

```
docker pull nginx
```

### 2、创建Nginx容器

```
docker run -it -d \
--name nginx \
-p 80:80 \
-v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/www:/home/nginx/www \
-v /home/nginx/logs:/var/log/nginx \
--privileged --net=host nginx
```

> 配置文件要先在宿主机创建好
>
> 其中 **/home/nginx/www** 表示存放的打包的资源根目录

```
#nginx.conf配置
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       9999;
        server_name  localhost;

        # Vue路由模式为history需添加的配置
        location / {
            if (!-e $request_filename) {
                rewrite ^(.*)$ /index.html?s=$1 last;
                break;
            }
            root   /home/nginx/www;
            index  index.html;
        }

        # 获取真实IP以及Websocket需添加的配置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 客户端Body大小限制（文件上传大小限制配置）
        client_max_body_size 5m;

        error_page   500 502 503 504 404  /50x.html;
        location = /50x.html {
            root   html;
        }

    }
}
```



## Docker安装Redis

### 1、安装 Redis 镜像

```
docker pull redis:latest
```

### 2、运行容器

```
docker run -itd --name redis-test -p 6379:6379 redis

#挂载方式
docker run --restart=always --log-opt max-size=100m --log-opt max-file=2 -p 6379:6379 --name myredis -v /Users/ldf/app/dockerVolume/redis/config/redis.conf:/etc/redis/redis.conf -v /Users/ldf/app/dockerVolume/redis/config/data:/data -d redis redis-server /etc/redis/redis.conf  --appendonly yes  --requirepass 123456
```

3、进入容器

```
docker exec -it redis-test /bin/bash

#设置密码
cd /usr/local/bin
./redis-cli

#查看密码
config get requirepass
#设置密码
config set requirepass 123456
#验证
auth 123456
```

4、命令行设置的密码在服务重启后失效，所以一般不使用这种方式。

在redis根目录下找到redis.windows.conf配置文件，搜索requirepass，找到注释密码行，添加密码如下：

```
# requirepass foobared
requirepass tenny     //注意，行前不能有空格

#设置不生效，知道配置文件启动
redis-server.exe redis.windows.conf
```



## Docker安装Mongo

### 1、安装MongoDB 镜像

```
docker pull mongo:latest
```

### 2、运行 mongo 容器：

```
docker run -itd --name mongo -p 27017:27017 mongo --auth
```

### 3、进入容器创建密码

```
docker exec -it mongo mongo admin
# 创建一个名为 admin，密码为 123456 的用户。
>  db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},"readWriteAnyDatabase"]});
# 尝试使用上面创建的用户信息进行连接。
> db.auth('admin', '123456')
```



## Docker安装Mysql

M1芯片是arm64架构，也称作aarch64架构，只能运行arm64/aarch64架构的程序

### 1、拉取镜像

```
docker pull mysql/mysql-server:latest
```

### 2、创建并启动MySQL服务容器

```
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql/mysql-server
```

### 3、修改mysql访问权限

这时使用宿主机连接没有授权访问，需要进入mysql修改mysql访问权限。

```
docker exec -it mysql bash

mysql -u root -p 123456
```

### 4、授权

```
CREATE USER 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL ON *.* TO 'root'@'%';
```

### 5、修改root用户密码

```
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```

### 6、刷新权限

```
flush privileges;
```

## Docker安装Nacos

### 1、下载官方nacos2.0.3提取[SQL](https://so.csdn.net/so/search?q=SQL&spm=1001.2101.3001.7020)脚本

将脚本写入mysql库中

```sql
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `src_user` text,
  `src_ip` varchar(50) DEFAULT NULL,
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
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
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

CREATE TABLE `users` (
	`username` varchar(50) NOT NULL PRIMARY KEY,
	`password` varchar(500) NOT NULL,
	`enabled` boolean NOT NULL
);

CREATE TABLE `roles` (
	`username` varchar(50) NOT NULL,
	`role` varchar(50) NOT NULL,
	UNIQUE INDEX `idx_user_role` (`username` ASC, `role` ASC) USING BTREE
);

CREATE TABLE `permissions` (
    `role` varchar(50) NOT NULL,
    `resource` varchar(255) NOT NULL,
    `action` varchar(8) NOT NULL,
    UNIQUE INDEX `uk_role_permission` (`role`,`resource`,`action`) USING BTREE
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
```



### 2.拉取支持M1芯片的镜像

这里选择zhusaidong/[nacos](https://so.csdn.net/so/search?q=nacos&spm=1001.2101.3001.7020)-server-m1的镜像，官方的版本同样也是不支持M1芯片的

```
docker pull zhusaidong/nacos-server-m1:2.0.3   #要带上版本号，默认latest拉取不下来
```

### 3、启动容器

这里以单点的模式为例,Docker启动需要暴露8848 9848 9849三个端口

```
docker run --env MODE=standalone --name nacos2.0.3 -d -p 8848:8848 -p 9848:9848 -p 9849:9849  zhusaidong/nacos-server-m1:2.0.3

#建议挂载配置文件和日志信息，方便直接在宿主机修改配置信息
docker  run --name nacos -p 8848:8848   \
--privileged=true \
--restart=always \
-e JVM_XMS=256m \
-e JVM_XMX=256m \
-e MODE=standalone \
-e PREFER_HOST_MODE=hostname \
-v /Users/ldf/app/dockerVolume/nacos/logs:/home/nacos/logs \
-v  /Users/ldf/app/dockerVolume/nacos/conf/application.properties:/home/nacos/conf/application.properties \
-d zhusaidong/nacos-server-m1:2.0.3
```

### 4、进入容器修改yml文件

```
cd /conf
vim application.properties
```

```properties
#修改数据源配置
# spring
server.servlet.contextPath=${SERVER_SERVLET_CONTEXTPATH:/nacos}
server.contextPath=/nacos
server.port=${NACOS_APPLICATION_PORT:8848}
spring.datasource.platform=mysql
nacos.cmdb.dumpTaskInterval=3600
nacos.cmdb.eventTaskInterval=10
nacos.cmdb.labelTaskInterval=300
nacos.cmdb.loadDataAtStart=false
db.num=${MYSQL_DATABASE_NUM:1}
db.url.0=jdbc:mysql://host.docker.internal:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
#db.url.1=jdbc:mysql://${MYSQL_SERVICE_HOST}:${MYSQL_SERVICE_PORT:3306}/${MYSQL_SERVICE_DB_NAME}?${MYSQL_SERVICE_DB_PARAM:characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false}
db.user=root
db.password=123456
### The auth system to use, currently only 'nacos' is supported:
nacos.core.auth.system.type=${NACOS_AUTH_SYSTEM_TYPE:nacos}
```

### 5、重新启动容器，登录控制台

http://127.0.0.1:8848/nacos 初始账密nacos/nacos

## Docker安装Seata

[seata](https://so.csdn.net/so/search?q=seata&spm=1001.2101.3001.7020)启动成功但是没日志，也一直注册不到nacos注册中心

原因：用的镜像不对，得用适配m1芯片的seata镜像

下载适配m1芯片的seata镜像，地址如下：https://hub.docker.com/r/fancyfong/seata/tags

### 1、拉取镜像

```
docker pull fancyfong/seata:1.4.1_arm64
```

### 2、运行

```
docker run --name seata-server -p 8091:8091 -d fancyfong/seata:1.4.1_arm64
```

### 3、将容器的文件同步到宿主机

```
docker cp seata-server:/seata-server  /home/dockerdata/seata
```

### 4、停止并删除[seata](https://so.csdn.net/so/search?q=seata&spm=1001.2101.3001.7020) 容器

```
docker stop seata-server
docker rm seata-server
```

### 5、重新生成新seata 容器

```
docker run -d --restart always  --name  seata-server -p 8091:8091  -v /home/dockerdata/seata/seata-server:/seata-server -e SEATA_IP=127.0.0.1 -e SEATA_PORT=8091 fancyfong/seata:1.4.1_arm64
```

> -d --restart always 开机自启；
> --name seata-server 容器名
> -p 8091:8091 端口映射
> -v /home/dockerdata/seata/seata-server:/seata-server 宿主机 目录/home/dockerdata/seata/seata-server与seata容器目录/seata-server形成docker容器数据卷，数据互通
> -e SEATA_IP=127.0.0.1 可选, 指定seata-server启动的IP
> -e SEATA_PORT=8091 可选, 指定seata-server启动的端口, 默认为 8091

### 6、进入数据卷

/home/dockerdata/seata/seata-[server](https://so.csdn.net/so/search?q=server&spm=1001.2101.3001.7020)/resources修改文件registry.conf

```
cd /home/dockerdata/seata/seata-server/resources
vim registry.conf
```

### 7、重启

```
docker restart seata-server
```

### 8、验证

​	查看日志

```
docker logs seata-server
```

## Docker安装RocketMQ

> - 基础环境：mac M1
> - 本地docker版本：20.10.6 

### 下载官方Dockerfile

```
git clone https://github.com/apache/rocketmq-docker.git
```

### 1、选择M1适合的版本

```
cd image-build
sh build-image.sh RMQ-VERSION BASE-IMAGE
(我执行的:sh build-image.sh 4.8.0 alpine )
sh build-image.sh 4.8.0 alpine
```

**这里由于下载速度慢,需要等好一会**

### 2、编写broker.conf

```
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH

namesrvAddr=127.0.0.1:9876
# 本机局域网IP(自己的局域网ip，非localhost)
brokerIP1= 192.168.31.73
```

### 3、进行Docker编排

修改自定义好的broker.conf路径

```
version: '3'
services:
	# rocketmq
  namesrv:
    image: apacherocketmq/rocketmq:4.8.0-alpine
    container_name: rmqnamesrv
    restart: on-failure
    ports:
      - 9876:9876
    environment:
      JAVA_OPT: -server -Xms256m -Xmx256m
    command: sh mqnamesrv
  broker:
    image: apacherocketmq/rocketmq:4.8.0-alpine
    container_name: rmqbroker
    restart: on-failure
    ports:
      - 10909:10909
      - 10911:10911
      - 10912:10912
    volumes:
    # 自定义的编写broker.conf路径
      - ./rocketmq/broker/conf/broker.conf:/home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    command: sh mqbroker -n namesrv:9876 -c /home/rocketmq/rocketmq-4.8.0/conf/broker.conf
    depends_on:
      - namesrv
  rocketmq-console:
    image: candice0630/rocketmq-console-ng:2.0
    container_name: rmqconsole
    restart: on-failure
    ports:
      - 19876:8080
    environment:
      JAVA_OPTS: -Drocketmq.config.namesrvAddr=namesrv:9876 -Drocketmq.config.isVIPChannel=false
    depends_on:
      - namesrv

```

运行文件

```
docker-compose -f rocketmq.yml -p rocketMQ up -d
```

![image-20220926154916024](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090514.png)

### 4、访问console

**http://localhost:19876**

![image-20220926154944976](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090520.png)



## Docker安装RabbitMq

### 1.查找镜像

```
docker search rabbitMq
```

### 2.拉取镜像

```text
docker pull rabbitmq
```

### 3.查看镜像、启动并配置映射

```text
docker images

docker run \
-e RABBITMQ_DEFAULT_USER=guest \
-e RABBITMQ_DEFAULT_PASS=guest \
--name mq \
--hostname localhost \
-p 15672:15672 \
-p 5672:5672 \
-d \
rabbitmq
```

### 5.开启页面访问

```text
docker ps
docker exec -it 2da0 bash
rabbitmq-plugins enable rabbitmq_management
```

### 6、访问页面端

[http://localhost:15672](https://link.zhihu.com/?target=http%3A//localhost%3A15672/%23/)

```
username:guest
password:guest
```

![image-20220926155229138](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090527.png)