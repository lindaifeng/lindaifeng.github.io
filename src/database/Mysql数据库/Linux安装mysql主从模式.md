---
title: Linux安装mysql主从模式
order: 1
---



## Mysql 双主从(已测试)

**前提：两个数据库数据一致，没有服务在做写入操作。**

### 一、添加配置文件

master1和master2二台服务器，分别到/etc/my.cnf配置文件， 在mysqld里添加一下属性

```
#master1上

[mysqld]

server-id=101

log-bin = mysql-bin

auto-increment-increment = 2

auto-increment-offset = 1000


#master2上

[mysqld]

server-id=103

log-bin = mysql-bin

auto-increment-increment = 2

auto-increment-offset = 1001
```

 

###  二、创建用户

进入Mysql，分别为二台master创建各种的用户供对方使用

```
#master1的机器上
mysql> CREATE USER 'master1'@'%' IDENTIFIED BY '123456';


#master2的机器上
mysql> CREATE USER 'master2'@'%' IDENTIFIED BY '123456';
```

 

 **(1819错误密码长度限制问题：set global validate_password_policy=0;)**

### 三、分别给用户授予复制权限

```
#master1的机器上
mysql> GRANT REPLICATION SLAVE  ON *.* TO 'master1'@'%' IDENTIFIED BY '123456';

刷新
Mysql>flush privileges;

#master2的机器上
mysql> GRANT REPLICATION SLAVE  ON *.* TO 'master2'@'%' IDENTIFIED BY '123456';

刷新
Mysql>flush privileges;

 
```

### 四、分别重启服务

登录mysql用户，通过show master status; 查看二进制文件名称还有pos位置，为slave配置复制位置

```
service mysqld restart;
```

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230504090436.png)

### 五、配置主从机

分别切换master，注意master_log_file还有master_log_pos mysql里面操作

```
#master1的机器上

mysql> change master to master_host='192.168.137.103',master_user='master2',master_password='123456',master_log_file='mysql-bin.000003',master_log_pos=951;


#master2的机器上

mysql> change master to master_host='192.168.137.101',master_user='master1',master_password='123456',master_log_file='mysql-bin.000004',master_log_pos=698;
```

 

### 七、分别利用命令启动slave

```
mysql> 	start slave;

关闭slave
stop slave
```



### 八、测试结果

在master1上创建数据库，master2是否能同步，然后再在master2上创建表写数据，看master1能否同步。

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230504090454.jpg)

## Mysql 单主从（步骤有问题）

### **一、添加配置文件**

master1和master2二台服务器，修改master1/etc/my.cnf配置文件， 在mysqld里添加一下属性

```
#master1上

[mysqld]

server-id=101

log-bin = mysql-bin

auto-increment-increment = 2

auto-increment-offset = 1000
```

 

 

### 二、创建用户

进入Mysql，创建用户供从库使用

```
#master1的机器上

mysql> CREATE USER 'master1'@'%' IDENTIFIED BY '123456';
 
```

 

### 三、分别给用户授予复制权限

```
#master1的机器上
mysql> GRANT REPLICATION SLAVE  ON *.* TO 'master1'@'%' IDENTIFIED BY '123456';

刷新
Mysql>flush privileges;
```

 

### 四、分别重启服务

登录mysql用户，通过show master status 查看二进制文件名称还有pos位置，为slave配置复制位置

```
service mysqld restart;

show master status;
```

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230504090635.png)

 

### 五、配置从机

切换master，注意master_log_file还有master_log_pos mysql里面操作

```
#master2的机器上

mysql> change master to master_host='192.168.232.54',master_user='master1',master_password='HNS@gtjy1.0',master_log_file='mysql-bin.000022',master_log_pos=154;
```

 

### 七、利用命令启动slave

```
mysql> start slave;
 
//关闭slave
stop slave;
```

 

### 八、测试结果

在master1上创建数据库，master2是否能同步。

```
查看slave状态：
show slave status；
```

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230504090806.jpg)  

安装完成之后，所有mysql重启就可以了 

***如果是Slave_SQL_Running：no***

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230504090816.jpg)

***\*解决办法如下：\****

```
MariaDB [(none)]> stop slave; 

MariaDB [(none)]> SET GLOBAL SQL_SLAVE_SKIP_COUNTER=1;

START SLAVE; 

MariaDB [(none)]> start slave; 

MariaDB [(none)]> show slave status;

show slave status\G;
```

## ***如果出现Slave_IO_Running: No的机器上操作：***

```
MariaDB [(none)]> stop slave; 
MariaDB [(none)]> CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000026',MASTER_LOG_POS=0; MariaDB [(none)]> slave start; 
MariaDB [(none)]> show slave status；
```

**删除savlue**

```
stop slave; 

Query OK, 0 rows affected (0.06 sec)

reset slave;
```

**删除5张表，并重新导入脚本**

```
use mysql

drop table slave_master_info;

drop table slave_relay_log_info;

drop table slave_worker_info;

drop table innodb_index_stats;

drop table innodb_table_stats;

source /usr/coolpad/mysql/share/mysql_system_tables.sql
```

(2)重新启动数据库

注：这一步是必须的，否则无法正常配置双主架构。

 

特别注意，数据库主从日志很大

(一般位置为/var/lib//mysql/或/usr/local/mysql/var/）

<2>设置只保留30天的binlog

(临时，重启mysql这个参数会失败)

set global expire_logs_days = 30;

(永久，my.cnf中添加，重启后生效)、

expire_logs_days = 30

查看当前的日志保存天数

show variables like ‘expire_logs_days’;

 数据库重启后，mysql主动配置也需要重启。

 