---
title: Linux安装mongo主从模式
categories: 
  - Linux
tags: 
  - mongodb
order: 8
---



# Linux-Mongo集群模式之主从+副本集

## 一、知识沉淀：

**Mongodb的replication主要有两种：主从和副本集（replica set）。现在mongodb官方建议用副本集替代主从复制。**

**什么是oplog：**

　　MongoDB 的Replication是通过一个日志来存储写操作的，这个日志就叫做oplog。 在默认情况下,oplog分配的是5%的空闲磁盘空间。通常而言,这是一种合理的设置。可以通过mongod --oplogSize来改变oplog的日志大小。

#### 主从复制：

主从的原理和mysql类似，主节点记录在其上的所有操作oplog，从节点定期轮询主节点获取这些操作，然后对自己的数据副本执行这些操作，从而保证从节点的数据与主节点一致。 
 主服务器数据库的每次操作都会记录在其二进制文件mysql-bin.xxx（该文件可以在mysql目录下的data目录中看到）中，从服务器的I/O线程使用专用账号登录到主服务器中读取该二进制文件，并将文件内容写入到自己本地的中继日志relay-log文件中，然后从服务器的SQL线程会根据中继日志中的内容执行SQL语句

![img](https://gitee.com/lindaifeng/my-images/raw/master/img/7236980-ec85513460bb5cd6.jpg)

MySQL主从同步的作用

1、可以作为备份机制，相当于热备份
2、可以用来做读写分离，均衡数据库负载



#### **副本集：**

![MongoDB复制结构图](https://gitee.com/lindaifeng/my-images/raw/master/img/replication.png)

## 二、实战操作：

### 1、Mongo主从模式

主从模式是MongoDB最早的部署架构。从节点备份数据，在主节点挂了后，可以让从节点接替主节点；也可以做到读写分离，减轻主库压力。

主节点：

```
mongod --dbpath=E:\mongodb\3.2.9\mongodb\db --logpath=E:\mongodb\3.2.9\mongodb\log\log.txt --logappend --port=27017 --master
```

从节点

```
mongod --dbpath=E:\mongodb\3.2.9\slaveA\db --logpath=E:\mongodb\3.2.9\slaveA\log\log_slaveA.txt --logappend --port=27018 --slave --source=127.0.0.1:27017

或者，再主节点启动后，手动添加从节点
use local; -- local库的sources集合
db.sources.insert({"host":"127.0.0.1:27017"}); -- 在子节点，指定主节点
```

但是，主从有它很大的局限性，比如:主节点挂了不能自动切换连接，需要手动切换，这时候怎么办呢？



### 2、Mongo副本集

复制集：由多个数据节点和选举节点组成，相连的数据节点只有一个是主节点，主节点负责接收写的操作，从节点是通过复制主节点来实现数据的同步。简单来说就是：从节点是通过数据的冗余来提高数据的可靠性。

从节点通过主节点的oplog文件，异步复制主节点的数据。

复制集基本角色：

1、标准节点：参与主节点primary的选举，自身宕机让出primary，复制读写操作。

2、从节点：从节点second不参与选举，只能被设置为被动节点。

3、仲裁节点：只参与投票，不负责存放数据。确保标准节点投票数不相同。

**mongo无认证的情况：**

配置文件如下【配置路径时需要确保  路径存在】

```
logpath=/var/lib/mongo/mongodb.log

logappend=true

dbpath=/var/lib/mongo/

port = 27017

journal=true

quiet=true

fork=true

bind_ip=0.0.0.0
```

\# 集群配置

```
replSet=replSet
```

确保两边的防火墙关闭成功

复制集配置

将配置文件都修修改完之后

其中 replSet  是副本集名称，和conf文件中要保持一致

在mongod 控制台内输入

```
rs.conf();
```

提示找不到相关配置

\##第一步：设置副本集内容

```
config = {

_id: 'replSet', 

members: [

{_id: 0, host: '192.168.179.3:27017',priority:1},

{_id: 1, host: '192.168.179.4:27017',priority:2},

{_id: 2, host: '192.168.179.5:27017',priority:3}

]

}
```

\##第一步：初始化副本集

```
rs.initiate(config) 
```

\##第三步：查看副本集状态，找到private节点的IP 

```
rs.status()
```

各个节点需要执行

```
rs.secondaryOk()
```

主节点启动监听

```
db.enableFreeMonitoring()
```

**mongo有认证的情况**

```
1、yml配置文件启动 
processManagement:
   fork: true
net:
   bindIp: 0.0.0.0
   port: 27017
storage:
   dbPath: /usr/local/mongodb/data/db
systemLog:
   destination: file
   path: /usr/local/mongodb/logs/mongodb.log
   logAppend: true
storage:
   journal:
      enabled: true
# 改动
security:
  # 开启认证
  authorization: enabled
  # 认证文件的路径
  keyFile: "/usr/local/mongodb/mongodb-keyfile"
  clusterAuthMode: keyFile

# 改动
replication:
  oplogSizeMB: 10240
  # 副本集名称
  replSetName: replSet
```

配置文件启动：

```
./bin/mongod --config mongodb.yml
```

生成 keyFile(认证文件)及配置-上传到到每个服务器上

```javascript
openssl rand -base64 756> /root/keyfile
```

修改读写权限为 600    mongodb-keyfile

```javascript
chmod 600 /mongo/mongodb-keyfile
```

进入mongo输入：

```
rs.conf();
查看配置信息，无任何配置信息
2021-09-11T17:32:30.840+0800 E QUERY    [thread1] Error: Could not retrieve replica set config: {
	"info" : "run rs.initiate(...) if not yet done for the set",
	"ok" : 0,
	"errmsg" : "no replset config has been received",
	"code" : 94,
	"codeName" : "NotYetInitialized"
} :

```

第一步：设置副本集内容

```
config = {
_id: 'replSet', 
members: [
{_id: 0, host: '主机ip:端口',priority:1}, //权重
{_id: 1, host: '主机ip:27017',priority:2}, //权重（salve）
{_id: 2, host: '主机ip:27017',priority:3} //权重高（master）
]
}

config = {
_id: 'replSet', 
members: [
{_id: 0, host: '192.168.179.3:27017',priority:1},
{_id: 1, host: '192.168.179.4:27017',priority:2},
{_id: 2, host: '192.168.179.5:27017',priority:3}
]
}
```

\##第一步：初始化副本集

```
rs.initiate(config) 

返回{ "ok" : 1 }成功

返回错误信息
{
	"operationTime" : Timestamp(1631352818, 2),
	"ok" : 0,
	"errmsg" : "there are no users authenticated",
	"code" : 13,
	"codeName" : "Unauthorized",
	"$clusterTime" : {
		"clusterTime" : Timestamp(1631352818, 2),
		"signature" : {
			"hash" : BinData(0,"7qIwiTKM1e6QGQ5FpA23DSjUYTA="),
			"keyId" : NumberLong("7006606872698421250")
		}
	}
}

则需要认证
use admin;
db.auth('root','123456');
返回1认证成功

在执行配置命令
rs.initiate(config) 
```



##第三步：查看副本集状态，找到private节点的IP 

```
rs.status()
```

![image-20210911174818855](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210911174818855.png)

这样配相当于主从，权重高的为主节点，权重低的为从节点。

```
//查看副本集主节点
db.isMaster();
//查看节点状态
rs.status()
//添加一个服务器为仲裁节点
rs.addArb(ip:端口);

//移除所有节点
db.shutdownServer()
//移除单个节点
rs.remove('192.168.56.105:27017')
```

主节点能操作，从节点同步数据，但从节点不能操作。

至此，mongo的集群搭建完毕。