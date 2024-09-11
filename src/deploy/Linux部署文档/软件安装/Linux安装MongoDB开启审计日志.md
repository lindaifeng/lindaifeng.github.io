---
title: MongoDB的安装配置与开启审计日志
categories: 
  - Linux
tags: 
  - mongodb
order: 9
---



# MongoDB的安装配置与开启审计日志

> 欢迎来到知道的越多，不知道的越多系列！

## 1、Mongo的安装教程（Linux）


**1、下载安装包**

https://www.mongodb.com/download-center/community
**2、上传安装包**
**3、解压，移动**

```
tar -zxvf mongodb-linux-x86_64-4.0.6.tgz
mv ./mongodb-linux-x86_64-4.0.6 /usr/local/mongodb
```
**4、进去mongodb文件夹**

```
cd /usr/local/mongodb/
```

**5、创建db的目录和日志文件夹**

```
mkdir -p ./data/db
mkdir -p ./logs
touch ./logs/mongodb.log
```

**6、创建mongo配置文件**

​	6.1、conf配置文件形式：

```
vim mongodb.conf
#端口号
port=27017
#数据目录
dbpath=/usr/local/mongodb/data/db
#日志目录
logpath=/usr/local/mongodb/logs/mongodb.log
#后台启动
fork=true
#追加日志输出
logappend=true
#允许远程IP连接（所有）
bind_ip=0.0.0.0
```

​	6.2、yml配置文件形式：

```
processManagement:
   fork: true
net:
   bindIp: 127.0.0.1
   port: 27017
storage:
   dbPath: 数据存放路径/data/db
systemLog:
   destination: file
   path: log/mongo27017.log
   logAppend: true
storage:
   journal:
      enabled: true
```

```
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

**7、配置文件启动**

​	7.1、conf配置文件启动：

```
./bin/mongod --config mongodb.conf
```

​	7.2、yml配置文件形式启动：

```
./bin/mongod --config mongodb.yml
```

**8、连接到mongo**

```
./bin/mongo
```

## **2、安装中遇到的问题：**

1、配置文件启动时报错

```
error while loading shared libraries: libcrypto.so.10: cannot open shared object file: No such file or directory
原因：没有装libcrypto.so.10库
解决方案：安装yum -y install compat-openssl10
```

2、配置文件启动时报错

```
error while loading shared libraries: libnetsnmpmibs.so.35:  cannot open shared object file: No such file or directory
原因：没有装net-snmp
解决方案：安装yum install net-snmp
```

## 3、创建mongo账户

```
1、Read：允许用户读取指定数据库
2、readWrite：允许用户读写指定数据库
3、dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
4、userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
5、clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
6、readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
7、readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
8、userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
9、dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
10、root：只在admin数据库中可用。超级账号，超级权限
```

创建管理员账户

- 切换到admin数据库 

  ```
  use admin
  ```

- 添加账户(root：最高权限任意操作，userAdminAnyDatabase:管理用户权限)

  ```
  db.createUser({ user: "root", pwd: "Zz@123456", roles: [{ role: "root", db: "admin" }] })
  ```

  

- 修改mongo.conf文件, 增加配置

  ```
  auth=true
  或者yml格式的加入这个配置
  security:
    authorization: enabled
  ```

- 重启MongoDB服务

  ```
  #停掉服务
  ps -ef|grep mongo
  kill -9 PID
  #根据配置文件启动服务
  ./bin/mongod --config mongodb.conf
  ```

- 连接mongo

  ```
  ./mongo
  ```

- 认证：（未认证查看或操作）

  ```
  use admin
  db.auth("root","Zz@123456")  #返回1，认证成功
  ```

  

  ### 2）创建普通用户

- 管理员账户认证

  ```
  use admin
  db.auth("root","Zz@123456")
  ```

- 切换到指定库

  ```
  use 指定库名
  ```

- 创建普通账户，给定权限

  ```
  db.createUser({ user: "user", pwd: "123456", roles: [{ role: "readWrite", db: "test数据库名称" }] })
  ```

注意：创建成功，无需重启

- 更新角色权限(root最高权限)

  ```
  db.updateUser("root",{roles : [{"role" : "root","db" : "admin"}]})
  ```



## 4、开启mongo审计功能

https://blog.csdn.net/zhaoyuqiang/article/details/105361948

**1、概述**

在数据库安全的生命周期中，包括：保护、检测、响应及补救。检测的核心就是审计（Audit）。

审计功能可以用来记录用户对数据库的所有相关操作。这些记录可以让系统管理员在需要的时候分析数据库在什么时段发生了什么事情。

mongodb分为社区版和企业版，只有企业版MongoDB Enterprise才有审计功能。

mongodb的企业版下载链接：

https://www.mongodb.com/try/download/enterprise
安装mongodb的rpm包时会提示缺少依赖包，可通过yum的方式安装所需的依赖包

```
yum install net-snmp cyrus-sasl cyrus-sasl-plain cyrus-sasl-gssapi
```



> 注意：配置文件采用yml格式

```
auditLog:
  destination: 审计展示类型（console窗口展示、syslog系统日志保存、file文件保存。）
  format: 在JSON文件或者BSON文件中
  path: 保存路径
  filter: 日志过滤条件
setParameter: { auditAuthorizationSuccess: true }

# 审计日志设置（此过滤能满足绝大部分的日志记录，减少记录无效日志）
auditLog:
  destination: file
  format: JSON
  path: /usr/local/mongodb/data/auditLog/audit.json
  filter: '{ atype:{ $in: ["authCheck","createCollection","createDatabase"] },"param.ns":{$nin:[  "admin.system.version"]},"param.command":{$nin:[  "isMaster","ismaster","saslStart","saslContinue","listCollections","listDatabases","listIndexes","collStats","find","getlasterror","buildinfo","getLastError","aggregate"]  }  }'
setParameter: { auditAuthorizationSuccess: true }
```

注意：日志则保存在audit.json中，可通过tail -f audit.json实时在线查看日志打印情况。



## 5、日志详情介绍

任何一种数据库都有各种各样的日志，MongoDB也不例外。MongoDB中有4种日志，分别是系统日志、Journal日志、oplog主从日志、慢查询日志等。这些日志记录着MongoDB数据库不同方面的踪迹。下面分别介绍这几种日志。

**1、系统日志**

系统日志在MongoDB数据库中很重要，它记录着MongoDB启动和停止的操作，以及服务器在运行过程中发生的任何异常信息。
配置系统日志的方法比较简单，在启动mongod时指定logpath参数即可

```
mongod -logpath=/data/log/mongodb/serverlog.log -logappend
```

系统日志会向logpath指定的文件持续追加。

**2、Journal日志**（一般配置文件中开启）

journaling(日记) 日志功能则是 MongoDB 里面非常重要的一个功能 ， 它保证了数据库服务器在意外断电 、 自然灾害等情况下数据的完整性。它通过预写式的redo日志为MongoDB增加了额外的可靠性保障。开启该功能时,MongoDB会在进行写入时建立一条Journal日志,其中包含了此次写入操作具体更改的磁盘地址和字节。因此一旦服务器突然停机，可在启动时对日志进行重放，从而重新执行那些停机前没能够刷新到磁盘的写入操作

**3、oplog主从日志**

Replica Sets复制集用于在多台服务器之间备份数据。MongoDB的复制功能是使用操作日志oplog实现的，操作日志包含了主节点的每一次写操作。

一个mongod实例中的所有数据库都使用同一个oplog，也就是所有数据库的操作日志(插入，删除，修改)都会记录到oplog中

**4、慢查询日志**

MongoDB中使用系统分析器(system profiler)来查找耗时过长的操作。系统分析器记录固定集合system.profile中的操作，并提供大量有关耗时过长的操作信息，但相应的mongod的整体性能也会有所下降。因此我们一般定期打开分析器来获取信息。

默认情况下，系统分析器处于关闭状态，不会进行任何记录。可以在shell中运行db.setProfilingLevel()开启分析器

```
db.setProfilingLevel(``level``,<slowms>) 0=``off` `1=slow 2=``all
```

第一个参数是指定级别，不同的级别代表不同的意义，0表示关闭，1表示默认记录耗时大于100毫秒的操作，2表示记录所有操作。第二个参数则是自定义“耗时过长"标准，比如记录所有耗时操作500ms的操作

```
db.setProfilingLevel(1,500);
```

如果开启了分析器而system.profile集合并不存在，MongoDB会为其建立一个大小为若干MB的固定集合(capped collection)。如希望分析器运行更长时间，可能需要更大的空间记录更多的操作。此时可以关闭分析器，删除并重新建立一个新的名为system.profile的固定集合，并令其容量符合要求。然后在数据库上重新启用分析器。

> 可以通过db.system.profile.stats()查看集合的最大容量.

**总结**

以上就是这篇文章的全部内容了，希望本文的内容对大家的学习或者工作具有一定的参考学习价值。