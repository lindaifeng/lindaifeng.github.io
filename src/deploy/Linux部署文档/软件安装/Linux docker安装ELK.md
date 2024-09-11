---
title: Linux docker安装ELK
categories: 
  - Docker
tags: 
  - elk
order: 3
---

# Linux docker安装ELK

**实现目标：**

**从kafka收集消息 --> Logstash清洗消息 --> Elastcsearch存储消息--> Kibana展示消息全流程**

## 一、安装ElasticSearch

### **ELK简介**

ELK主要由ElasticSearch、Logstash和Kibana三个开源工具组成，还有其他专门由于收集数据的轻量型数据采集器Beats

> Elasticsearch：分布式搜索引擎。具有高可伸缩、高可靠、易管理等特点。可以用于全文检索、结构化检索和分析，并能将这三者结合起来
>Elasticsearch：
> 是用Java 基于 Lucene 开发，现在使用最广的开源搜索引擎之一，Wikipedia 、StackOverflow、Github等都基于它来构建自己的搜索引擎。在elasticsearch中，所有节点的数据是均等的。
> 
> Logstash ：
>数据收集处理引擎。支持动态的从各种数据源搜集数据，并对数据进行过滤、分析、丰富、统一格式等操作，然后存储以供后续使用。
> 
> Kibana ：
>可视化化平台。它能够搜索、展示存储在 Elasticsearch
> 中索引数据。使用它可以很方便的用图表、表格、地图展示和分析数据。
> 
> 版本说明：
>Elasticsearch、Logstash、Kibana、Filebeat安装的版本号必须全部一致,不然会出现kibana无法显示web页面。

> 需要注意的是，如果操作系统版本不是很新不要安装最新版本docker，比如我centos7.2安装docker最新版，后面出现 linux 与 docker 版本的兼容性问题，报错”container init exited prematurely“，卸载docker安装较早版本即可。


离线安装与在线基本相同（离线需要自行打包好镜像）

> 离线思路：
> 1、在有网环境下下载镜像
> 2、通过docker save 打包好镜像，拷入u盘
> 3、将打包好的镜像上传至离线服务器
> 4、通过docker load 将打包好的镜像导入docker

### 1、拉取镜像
```
docker search elasticsearch
docker pull elasticsearch:7.7.1
```

### 2、创建挂载目录

```
mkdir -p /data/elk/es/{config,data,logs}
```

### 3、赋予权限

```
chmod -R 777 /data/elk/es
chmod -R 777 /data/elk/es/config
chmod -R 777 /data/elk/es/data
chmod -R 777 /data/elk/es/logs
#报错挂载目录没权限
"Caused by: java.nio.file.AccessDeniedException: /usr/share/elasticsearch/data/nodes",
```

### 4、创建挂载es配置

```
cd /data/elk/es/config
touch elasticsearch.yml
-----------------------配置内容----------------------------------
cluster.name: "my-es"
network.host: 0.0.0.0
http.port: 9200
```

### 5、运行elasticsearch

> 通过镜像，启动一个容器，并将9200和9300端口映射到本机（elasticsearch的默认端口是9200，我们把宿主环境9200端口映射到Docker容器中的9200端口）。此处建议给容器设置固定ip，我这里没设置。

```
docker run -it  -d -p 9200:9200 -p 9300:9300 --name es -e ES_JAVA_OPTS="-Xms1g -Xmx1g" -e "discovery.type=single-node" --restart=always -v /data/elk/es/config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v /data/elk/es/data:/usr/share/elasticsearch/data -v /data/elk/es/logs:/usr/share/elasticsearch/logs elasticsearch:7.7.1
```

### 6、验证安装是否成功

```
[root@elasticsearch home]# curl http://localhost:9200
{
  "name" : "0adf1765ac08",
  "cluster_name" : "my-es",
  "cluster_uuid" : "MpKqrEKySnSdwux0m7AlEA",
  "version" : {
    "number" : "7.7.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "ad56dce891c901a492bb1ee393f12dfff473a423",
    "build_date" : "2020-05-28T16:30:01.040088Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}

查看索引
GET /_cat/indices?v
```

[elasticsearch](https://so.csdn.net/so/search?q=elasticsearch&spm=1001.2101.3001.7020)启动时遇到的错误

es最大虚拟内存至少262144

max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]

```
1、vim /etc/sysctl.conf (需要是root账户)
文件最后添加一行: vm.max_map_count=262144
2、sysctl -p 重启生效
```

## 二、**安装Kibana**

### 1、下载镜像

```
docker pull kibana:7.7.1
```

### 2、获取elasticsearch容器ip

```
[root@elasticsearch home]# docker inspect --format '{{ .NetworkSettings.IPAddress }}' es
172.17.0.2
```

### 3、新建配置文件

用于docker文件映射。所使用目录需对应新增。（172.17.0.2改成自己的）

vi /data/elk/kibana/kibana.yml

```
#Default Kibana configuration for docker target
server.name: kibana
server.host: "0"
i18n.locale: "zh-CN"
elasticsearch.hosts: ["http://172.17.0.2:9200"]
xpack.monitoring.ui.container.elasticsearch.enabled: true
```

### 4、运行kibana	

```
docker run -d --restart=always --log-driver json-file --log-opt max-size=100m --log-opt max-file=2 --name kibana -p 5601:5601 -v /data/elk/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml kibana:7.7.1
```







### 5、访问

浏览器上输入：http://ip:5601，如无法访问进容器检查配置是否生效

### 6、检查kibana容器配置文件

将配置文件中elasticsearch.hosts地址修改为elasticsearch容器地址。

```
docker exec -it kibana /bin/bash
```

vi config/kibana.yml，修改后的配置如下：
（（172.17.0.2改成自己的））
```
#Default Kibana configuration for docker target
server.name: kibana
server.host: "0"
elasticsearch.hosts: ["http://172.17.0.2:9200"]
xpack.monitoring.ui.container.elasticsearch.enabled: true
```

重启kibana：docker restart kibana

> 在kibana6.7之后就开始支持中文了，开启也很简单，只需要在kibana.yml配置文件中添加上如下配置，然后重启kibana即可
>
> i18n.locale: "zh-CN"

## 三、安装**Logstash**

### 1、获取logstash镜像

```
docker pull logstash:7.7.1
```

### 2、编辑logstash.yml配置文件

vi /data/elk/logstash/logstash.yml （es-docker内网地址）
（172.17.0.2改成自己的）

```
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://172.17.0.2:9200" ]
xpack.monitoring.elasticsearch.username: elastic
xpack.monitoring.elasticsearch.password: changeme
#path.config: /data/elk/logstash/conf.d/*.conf
path.config: /data/docker/logstash/conf.d/*.conf
path.logs: /var/log/logstash
```

### 3、编辑logstash.conf文件

此处先配置logstash直接采集本地数据发送至es

vi /data/elk/logstash/conf.d/syslog.conf   （外网地址）
（192.168.200.94改成自己的）

```
input {
  syslog {
    type => "system-syslog"
    port => 5044
  }
}
output {
  elasticsearch {
    hosts => ["192.168.x.x:9200"]  # 定义es服务器的ip
    index => "system-syslog-%{+YYYY.MM}" # 定义索引
  }
}
```



### 4、配置修改后重启服务

```
systemctl restart rsyslog
```

### 5、运行logstash

```
docker run -d --restart=always --log-driver json-file --log-opt max-size=100m --log-opt max-file=2 -p 5044:5044 -p 9600:9600 --name logstash -v /data/elk/logstash/logstash.yml:/usr/share/logstash/config/logstash.yml -v /data/elk/logstash/conf.d/:/data/docker/logstash/conf.d/ logstash:7.7.1


docker run -d --privileged=true -p 5044:5044 -p 9600:9600 --name logstash -v /data/elk/logstash/logstash.yml:/usr/share/logstash/config/logstash.yml -v /data/elk/logstash/conf.d/:/data/docker/logstash/conf.d/ docker.elastic.co/logstash/logstash:7.13.0-arm64
```

### 6、测试es接收logstash数据

```
[root@elk logstash]# curl http://localhost:9200/_cat/indices?v
health status index                    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .apm-custom-link         WBgbpphkQCS73sfjjIG0-Q   1   0          0            0       208b           208b
green  open   .kibana_task_manager_1   xmBASGi9QheR-r8hG2XLZA   1   0          5            0       28kb           28kb
green  open   .apm-agent-configuration MsvsgveHSCOhBQRCgTnsRg   1   0          0            0       208b           208b
yellow open   system-syslog-2022.02    1Vcjw7Q-TTqVscpknyK7HA   1   1          6            0     20.7kb         20.7kb
green  open   .kibana_1                vJ-B5wakRSmOrwM6ri-xgw   1   0         84            2      115kb          115kb
```

获取到system-syslog-相关日志，则es已能获取来自logstash的数据，kibana中也同步显示数据。

## 四、安装kafka

> 注意：
>
> 出现/docker-entrypoint.sh: line 43: /conf/zoo.cfg: Permission denied
>
> 一般都是目录没权限，给对应目录添加权限即可
>
> chmod 777 xxx

### 1、启动zookeeper容器

```
docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper

docker run -d -p 2181:2181 -p 2888:2888 -p 3888:3888 --privileged=true \
--restart=always --name=zkNode-1 \
-v /data/elk/zookeeper/conf:/conf \
-v /data/elk/zookeeper/data:/data \
-v /data/elk/zookeeper/datalog:/datalog zookeeper:latest

```

### 2、启动kafka容器

```
#修改自己的zookeeper主机地址
docker run  -d --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=0 -e KAFKA_ZOOKEEPER_CONNECT=192.168.x.x:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.x.x:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -e ALLOW_PLAINTEXT_LISTENER=yes -t wurstmeister/kafka 

#docker 启动参数说明: -d:后台启动,--restart=always:如果挂了总是会重启,--name:设置容器名
#-p: 设置宿主机与容器之间的端口映射,例如:9902:9092,表示将容器中9092端口映射到宿主机的9902端口,当有请求访问宿主机的9902端口时,会被转发到容器内部的9092端口.
#-v:设置宿主机与容器之间的路径或文件映射,例如:/home/kafka/logs:/opt/kafka/logs,表示将容器内部的路径/opt/kafka/logs目录映射到宿主机的/home/kafka/logs目录,可以方便的从宿主机/home/kafka/logs/就能访问到容器内的目录,一般数据文件夹,配置文件均可如此配置,便于管理和数据持久化
#-e 设置环境变量参数,例如-e KAFKA_BROKER_ID=1,表示将该环境变量设置到容器的环境变量中,容器在启动时会读取该环境变量,并替换掉容器中配置文件的对应默认配置(server.properties文件中的 broker.id=1)
# kafka:latest 表示使用docker镜像名称为kafka,并且版本为latest的镜像来启动
docker run -d --restart=always --name kafka \
-p 9092:9092 \
-v /data/elk/kafka/logs:/opt/kafka/logs \
-v /data/elk/kafka/data:/kafka/kafka-logs \
-v /data/elk/kafka/conf:/opt/kafka/config \
-e KAFKA_BROKER_ID=1 \
-e KAFKA_LOG_DIRS="/kafka/kafka-logs" \
-e KAFKA_ZOOKEEPER_CONNECT=10.84.x.x:2181 \
-e KAFKA_DEFAULT_REPLICATION_FACTOR=1 \
-e KAFKA_LOG_RETENTION_HOURS=72 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.84.x.x:9092 \
-e ALLOW_PLAINTEXT_LISTENER=yes \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -t kafka:latest
```

### 3、测试kafka

进入kafka容器的命令行

```
docker exec -ti kafka /bin/bash
```

进入kafka所在目录

```
cd opt/kafka_2.13-2.8.1/
#没有找到就用这个命令搜索
find / -name kafka-topics.sh
```

### 4、创建topic

```
./bin/kafka-topics.sh --create --bootstrap-server 10.84.x.x:2181 --partitions 1 --replication-factor 1 --topic cloud-log


./bin/kafka-topics.sh --create --bootstrap-server 127.0.0.1:9092 --partitions 1 --replication-factor 1 --topic cloud-log

```
### 5、查看topic list
```bash
bin/kafka-topics.sh --zookeeper 10.84.x.x:2181 --list

./bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --list
```

### 6、发送消息

```
./bin/kafka-console-producer.sh --broker-list 10.84.x.x:9092 --topic cloud-log

./kafka-console-producer.sh --broker-list 10.32.22.51:9092 --topic cloud-log
```

### 7、接收消息

```
./bin/kafka-console-consumer.sh --bootstrap-server 10.84.x.x:9092 --topic cloud-log --from-beginning

./bin/kafka-console-consumer.sh --bootstrap-server 10.32.22.51:9092 --topic cloud-log --from-beginning
```

由于上面并未和kafka产生关联，所以修改logstash安装目录下的配置文件logstash/confg/conf.d/syslog.conf

```
input {
  #获取kafka信息
  kafka {
  		#自定义话题
        topics_pattern  => "cloud-log"
        #kafka ip+端口
        bootstrap_servers => "10.84.x.x:9092"
        auto_offset_reset => "earliest"
        consumer_threads => 5
        decorate_events => "true"
  }
}
#文本格式过滤
filter {
    date {
      timezone => "Asia/Shanghai"
      match => ["logtime", "yyyy-MM-dd HH:mm:ss,SSS"]
      target => "@timestamp"
      remove_field => [ "logtime" ]
    }
}

output {
  #输出至es
  elasticsearch {
    hosts => ["http://10.84.x.x:9200"]
    index => "%{[@metadata][kafka][topic]}-%{+YYYY-MM-dd}"
  }
  #本地生产文件日志(目录自行创建)
  file {
        path => "/home/logs/%{+yyyy-MM-dd-HH}.log"
   }
}
```

**修改完之后重新启动docker-elk，即完成从kafka收集消息 --> Logstash清洗消息 --> Elastcsearch存储消息--> Kibana展示消息全流程。**



在arm运行时上述kafka方式运行正常但无法连接至es

以下采用docker-compose的方式部署

```yml
version: '3.2'
services:
  zookeeper:
    image: zookeeper
    ports:
      - "2181:2181"
    privileged: true
    volumes:
      - /data/elk/zookeeper/conf:/conf
      - /data/elk/zookeeper/data:/data
      - /data/elk/zookeeper/datalog:/datalog 
      - /etc/localtime:/etc/localtime
    container_name: "zookeeper"
    restart: always
  kafka:
    image: wyh1791/kafka-arm64v8
    container_name: "kafka"
    ports:
      - "9092:9092"
    privileged: true
    environment:
      - TZ=Asia/Shanghai
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_AUTO_CREATE_TOPICS_ENABLE=true
      - KAFKA_ADVERTISED_HOST_NAME=10.32.22.52
      - KAFKA_ADVERTISED_PORT=9092
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.32.22.52:9092
      - KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092
      - KAFKA_LOG_RETENTION_HOURS=168
    volumes:
      - /data/elk/kafka/data:/kafka
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/localtime:/etc/localtime
    restart: always

```

