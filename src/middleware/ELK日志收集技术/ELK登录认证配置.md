---
title: ELK登录认证配置
categories: 
  - ELK
tags: 
  - elk
order: 1
---



## ELK登录认证

> 当我们安装好ELK后，默认是可以直接访问到kibana的，可以直接查看收集到的信息，这样很不安全。
>
> 很多人采用的是Nginx代理来做登录验证功能，这也是一种实现方式，但是我们还有另一种更加优雅的方式，kibana其实有为我们提供认证登录的方式。
>
> 

下面我将介绍通过kibana认证登录的方式访问elk

实现步骤

1、ES设置密码

2、Kibana设置连接方式

3、Logstash设置连接方式

### 一、ElasticSearch安全认证

给es加上用户名和密码（docker启动方法一致）

#### 1、编辑 Elasticsearch 配置文件

```
#编辑 Elasticsearch 配置文件elasticsearch.yml
vim /etc/elasticsearch/elasticsearch.yml
```

#### 2、加上开启验证功能配置

```
# 开启密码
xpack.security.transport.ssl.enabled: true
xpack.security.enabled: true
```

#### 3、保存重启 Elasticsearch 服务

```
systemctl restart elasticsearch
或者
docker restart xxx
```

#### 4、设置密码

```
1、linux版
sudo /usr/share/elasticsearch/bin/elasticsearch-setup-passwords interactive
2、docker版
# 进入docker 
docker exec -it elk /bin/bash
cd /opt/elasticsearch/bin
# 手动设置密码
./elasticsearch-setup-passwords interactive
```

在后面的提示中配置密码，配置密码即可, 会有很多个密码， 建议都配一样的

#### 5、验证是否生效

```
 1、直接访问浏览器是否提示需要输入认证信息
127.0.0.1：9200
 或者
 2、命令提示是否未认证报错
 curl 127.0.0.1:9200
```

### 二、Kibana安全认证

此处有两种方法：

#### 1、方法一

在 `kibana.yml` 文件中填写连接ES的用户凭证，

```
# elk体系有很多的用户组，elastic是默认的用户组之一，可以使用默认的用户，也可以自定义用户
elasticsearch.username: "elastic" 
elasticsearch.password: "1qaz@WSX3edc"
```

#### 2、方法二

如果你不想将用户ID和密码放在kibana.yml文件中明文配置，可以将它们存储在密钥库中。运行以下命令以创建Kibana密钥库并添加配置

```
./bin/kibana-keystore create
./bin/kibana-keystore add elasticsearch.username
【输入elasticsearch用户名】
./bin/kibana-keystore add elasticsearch.password
【输入elasticsearch的密码】
```

#### 3、重启服务

```
systemctl restart kibana
或者
docker restart xxx
```

#### 4、、验证是否生效

浏览器中输入kibana的地址，如http://127.0.0.1:5601/，进入页面

### 三、Logstash安全认证

#### 1、修改Logstash配置文件

```
vim /etc/logstash/conf.d/30-elasticsearch-output.conf 
#有的不叫这个，具体叫啥根据事实而定
vim /etc/logstash/conf.d/xxx.com
```

#### 2、添加es账号和密码

```
output {
  elasticsearch {
    hosts => ["localhost:9200"]
    user  => "elastic"
    password  => "123456"
    manage_template => false
    index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
  }
}
```

#### 3、重启服务

```
systemctl restart logstash
或者
docker restart xxx
```

**ELK的密码认证方式到此成功设置完毕**

### 四、修改用户密码（可选）

在 “管理” 里面可以看见多了个“安全性”

可以修改“用户/角色”的密码以及创建“新用户/角色”。
