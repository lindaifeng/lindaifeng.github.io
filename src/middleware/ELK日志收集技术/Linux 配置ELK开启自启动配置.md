---
title: Linux 配置ELK开启自启动配置
categories: 
  - ELK
tags: 
  - elk
order: 2
---



# Linux 配置ELK开启自启动配置

## 各中间件默认端口：

```
nignx:8089、8090

nacos:8848

kibana端口：5601

elasticsearch端口：9200

logstash端口：5044

kafka端口：9092

redis端口：6379

mysql端口：3306
```

## 设置开启自启动

> #chkconfig: - 21 87
>
> 开启模式：
>
> - `- 代表所有运行模式不开启`，可以修改开启模式为2345
>
> 开启顺序：
>
> - 值越小，优先权越高
> - 如果A服务需要依赖B服务启动，那A的开启顺序值比B服务小，代表A服务先启动
>
> 关闭顺序：
>
> - 值越小，优先权越高
> - 与开启顺序相反，先将B服务关闭再将A服务关闭，

### Zookpeeper

```
cd /etc/init.d
touch zookeeper
chmod +x zookeeper
vi zookeeper
```



```shell
#!/bin/bash

#chkconfig:2345 20 86
#description:zookeeper
#processname:zookeeper
export JAVA_HOME=/usr/local/java/jdk1.8.0_271
case $1 in
        start) /home/soft/kafka/bin/zookeeper-server-start.sh -daemon /home/soft/kafka/config/zookeeper.properties;;
        *) echo "require start zookeeper" ;;
esac
```

```shell
#!/bin/bash
#chkconfig:2345 20 86
#description:zookeeper
#processname:zookeeper
export JAVA_HOME=/usr/local/java/jdk1.8.0_271
case $1 in
        start) /home/soft/zookeeper/bin/zkServer.sh start;;
        *) echo "require start zookeeper" ;;
esac
```

脚本启动

```
./zkServer.sh start
```



### Kafka

```
cd /etc/init.d
touch kafka
chmod +x kafka
vi kafka 
```

```shell
#!/bin/bash

#chkconfig:2345 21 87
#description:kafka
#processname:kafka
case $1 in
        start) /home/soft/kafka/bin/kafka-server-start.sh -daemon /home/soft/kafka/config/server.properties;;
        *) echo "require start kafka";;
esac
```

```
在线启动
/bin/kafka-server-start.sh /home/soft/kafka/config/server.properties
```



### Elasticsearch

```
cd /etc/init.d
touch elasticsearch
chmod +x elasticsearch
```

  vi elasticsearch并输入以下内容:

```shell
#!bin/bash
 
# chkconfig:   2345 22  88
# description:  elasticsearch
 
# JAVA_HOME=/usr/local/java/jdk1.8.0_271
ES_HOME=/home/soft/elasticsearch-7.15.0
case $1 in
          start) sudo -iu elasticsearch $ES_HOME/bin/elasticsearch &;;
          *)  echo "require start elasticsearch";;
esac
```



### logstash

```
cd /etc/init.d
touch logstash
chmod +x logstash
vi logstash
```

  并输入以下内容:

```shell
#!/bin/bash
 
# chkconfig:   2345 23  89
# description:  logstash
# JAVA_HOME=/usr/local/java/jdk1.8.0_271
LS_HOME=/home/soft/logstash-7.15.0
case $1 in
        start)sudo -iu logstash $LS_HOME/bin/logstash -f $LS_HOME/config &;;
        *) echo "require start logstash";;
esac
```



```
./bin/logstash -f config/logstash.conf //前台启动
nohup ./bin/logstash -f config/logstash.conf & nohup.out //后台启动
```



### Kibana

```
cd /etc/init.d
touch kibana
chmod +x kibana
```

  vi kibana并输入以下内容:

```shell
#!/bin/bash
 
# chkconfig:   2345 24  90
# description:  kibana
 
KIBANA_HOME=/home/soft/kibana-7.15.0-linux-x86_64
case $1 in
        start) $KIBANA_HOME/bin/kibana > kibana.log &;;
        *) echo "require start kibana";;
esac
```



## 扩展指令

```
#启动服务
service zookeeper start
#添加到开机自启动
chkconfig --add zookeeper
#验证一下
chkconfig --list
#设置开机自启动
chkconfig zookeeper on
#查看zookeeper状态
service zookeeper status
```

