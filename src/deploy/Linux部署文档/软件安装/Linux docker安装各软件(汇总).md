---
title: docker安装各软件（汇总）
categories: 
  - Docker
tags: 
  - docker
order: 2
---

## Docker安装各软件（汇总）

## 一、docker**安装oracle-12c**

### **1、拉取oracle-12c镜像**

启动**「Docker Desktop」**后在cmd窗口中执行`docker search oracle`命令，搜索Oracle相关的镜像，可以看到搜索结果中的**「truevoly/oracle-12c」**

```sql
# 拉取镜像(默认下载oracle-12c最新版本的镜像)
docker pull truevoly/oracle-12c
```

### **2、创建并启动容器**

cmd中执行以下命令，在docker中创建并启动一个oracle-12c容器，**「对物理机暴露2122、9090和1521三个端口分别映射到容器内的22、8080和1521端口」**，并且将容器内的oracle目录**「挂载」**到物理机的D盘中

```
#创建目录
mkdir -p /var/oracle/data/
#赋予权限
chmod -R 777 /var/oracle/data/
#启动容器
docker run -d -p 8080:8080 -p 1521:1521 -v /var/oracle/data/:/u01/app/oracle/ truevoly/oracle-12c

#推荐使用（限制内存上限，允许外部访问）
docker run --name oracle-12c -e ORACLE_ALLOW_REMOTE=true -p 8080:8080 -p 1521:1521 --memory=4g -v /var/oracle/data/:/u01/app/oracle/ -d truevoly/oracle-12c

```

查看容器启动日志（看到**「Import finished Database ready to use. Enjoy!」** 即容器创建并启动完成）

```sql
# 查看oracle-12c启动日志
docker logs -f oracle-12c
```

![image-20230425140406861](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230425140406.png)

![image-20230425140422986](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230425140423.png)

若日志中出现以下报错，是因为对外暴露的端口不可用访问权限已被禁止，只要更改创建容器时对外暴露的端口即可

```text
docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:1521 -> 0.0.0.0:0: listen tcp 0.0.0.0:1521: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

可在cmd中执行以下命令查看哪些端口被禁用TCP协议

```sql
# windows cmd命令查看哪些端口被禁用TCP协议
netsh interface ipv4 show excludedportrange protocol=tcp
```

### **3、修改oracle账号密码设置**

truevoly/oracle-12c镜像创建的容器**「默认有`sys`和`system`两个用户，密码都是`oracle`，默认的一个SID/服务名是xe」**，Oracle的用户密码默认有效期是180天，180天后用户会自动锁住，下面进入oracle-12c容器内将密码的有效期设置为永久！

```sql
# 进入oracle-12c容器内
docker exec -it oracle-12c /bin/bash
# 切换成oracle用户
su oracle
# 进入sqlplus
$ORACLE_HOME/bin/sqlplus / as sysdba
# 设置密码有效期为无限制
SQL> ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
# 解锁system用户
SQL> alter user SYSTEM account unlock;
```

### **4、物理机连接oracle-12c**

使用PL/SQL或Navicat等工具测试连接oracle-12c

![image-20230425140440589](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230425140440.png)

### **拓展**

### **Oracle创建表空间与用户**

以下创建一个`ling_mf3`数据表空间

```sql
-- 创建ling_mf3数据表空间
create tablespace ling_mf3 datafile '/u01/app/oracle/data/ling_mf3.dbf' size 50M;
```

创建表空间成功，同时也会在挂载的目录下生成相应数据文件



以下创建一个用户`ling`并授权，且设置`ling_mf3`为它的默认表空间

```sql
-- 创建ling用户密码为meet0and1#202302并设置ling_mf3为它的默认表空间
create user ling identified by "meet0and1#202302" default tablespace ling_mf3;
-- 给用户ling授权 dba：管理员的权限
grant connect,resource,dba to ling;
```



### **重启Oracle服务**

在**「Docker Desktop」**中可以一键重启，但实际开发中一般是在Linux环境中，我这里演示用命令重启Oracle服务

```sql
-- 查看监听状态
lsnrctl status
-- 停监听
lsnrctl stop
sqlplus / as sysdba
-- 停止oracle
SQL>shutdown immediate;
-- 启服务
SQL>startup;
SQL>exit
-- 启监听
lsnrctl start
```

### **更多常用...**

```sql
-- 删除表空间
drop tablespace ling_mf3;

-- 查询所有的表空间
select tablespace_name from dba_tablespaces;

-- 查看当前的用户和表空间
select username,default_tablespace from user_users;

-- 查看当前用户的角色
select * from user_role_privs;
-- 查询实例名/SID/服务名
select instance_name from v$instance;

-- 查看Oracle版本
select * from v$version;

-- 查看数据库允许的最大连接数
select value from v$parameter where name = 'processes';

-- 查看当前连接数
select count(*) from v$process;

-- 查看数据库当前会话的连接数
select count(*) from v$session;

-- 查看数据库当前的并发连接数
select count(*) from v$session where status = 'ACTIVE';
```



## 二、docker安装mysql

**思路：**
1、创建相应目录
2、创建配置文间
3、运行容器
4、进入容器内部修改root登录权限
5、测试连接（如果是云服务器，需要在防火墙开通相应端口）

**注意挂载的my.cnf映射路径，不同版本不一样，建议先不挂载启动一个容器查看**

**/etc/my.cnf**

### 创建第一台mysql-1

```
1、创建相应目录
mkdir -p /var/mysql-1/{data,logs,conf}
chmod 777 /var/mysql-1/logs -R
2、创建配置文件(文件内容已放最下面，直接复制即可)
vim /var/mysql-1/conf/mysql.cnf

[mysqld]

datadir=/var/mysql-1/mysql
 
socket=/var/mysql-1/mysql/mysql.sock
 
symbolic-links=0
 
lower_case_table_names=1
[client]
socket=/var/mysql-2/mysql/mysql.sock

3、运行容器
docker run -d --name="mysql-1" -p 3306:3306 -v /var/mysql-1/conf/my.cnf:/etc/mysql/conf.d/my.cnf -v /var/mysql-1/data:/var/lib/mysql -v /var/mysql-1/logs:/var/log -e MYSQL_ROOT_PASSWORD="Zz@2022" mysql:5.7

4、进入容器内部修改root登录权限
docker exec -it mysql bash
mysql -h 127.0.0.1 -P 3306 -u root -uroot -p'Zz@2022'
mysql> grant all privileges on *.* to 'root'@'%' identified by 'Zz@2022';
mysql> flush privileges;
```



### 创建第二台mysql-2

```
1、创建相应目录
mkdir -p /var/mysql-2/{data,logs,conf}
chmod 777 /var/mysql-2/logs -R
2、创建配置文件(文件内容已放最下面，直接复制即可)
vi /var/mysql-2/conf/mysql.cnf

[mysqld]

datadir=/var/mysql-2/mysql
 
socket=/var/mysql-2/mysql/mysql.sock
 
symbolic-links=0
 
lower_case_table_names=1

[client]
socket=/var/mysql-2/mysql/mysql.sock

3、运行容器
docker run -d --name="mysql-2" -p 3307:3306 -v /var/mysql-2/conf/my.cnf:/etc/mysql/conf.d/my.cnf -v /var/mysql-2/data:/var/lib/mysql -v /var/mysql-2/logs:/var/log -e MYSQL_ROOT_PASSWORD="Zz@2022" mysql:5.7

4、进入容器内部修改root登录权限
docker exec -it mysql bash
mysql -h 127.0.0.1 -P 3306 -u root -uroot -p'Zz@2022'
mysql> grant all privileges on *.* to 'root'@'%' identified by 'Zz@2022';
mysql> flush privileges;
```

![image-20230419200402414](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230419200402.png)

启动显示以下内容，为启动成功

> Version: '5.7.36'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)

参数说明：

- **-p 3306:3306**：将容器的 3306 端口映射到宿主机的 3306 端口。
- **-v $PWD/conf:/etc/mysql/conf.d**：将主机当前目录下的 conf/my.cnf 挂载到容器的 /etc/mysql/my.cnf。配置目录
- **-v $PWD/logs:/logs**：将主机当前目录下的 logs 目录挂载到容器的 /logs。日志目录
- **-v $PWD/data:/var/lib/mysql** ：将主机当前目录下的data目录挂载到容器的 /var/lib/mysql 。数据目录
- **-e MYSQL_ROOT_PASSWORD=123456：**初始化 root 用户的密码。



```
cd /home/dockerdata/mysql/conf/
vi my.cnf

# Copyright (c) 2014, 2016, Oracle and/or its affiliates. All rights reserved.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; version 2 of the License.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301 USA

#
# The MySQL  Server configuration file.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html

[mysqld]
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
datadir		= /var/lib/mysql
#log-error	= /var/log/mysql/error.log
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0


max_connections = 2000
max_user_connections = 1900
max_connect_errors = 100000
max_allowed_packet = 50M
lower_case_table_names=1
[mysqld]
skip-name-resolve

#保存后退出
```



**修改密码**：version8.0+

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY "ST1q@W3e4r";
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY "ST1q@W3e4r";
flush privileges;
```



## 二、ARM安装Mysql（裸机）

平台信息：

OS : ky10

CPU :KUNPENG.v920

MYSQL信息：

版本：8.0.25（Red Hat Enterprise Linux 7 / Oracle Linux 7 (ARM, 64-bit)） 

### 1、卸载

查询是否已安装mariadb

```
rpm -qa mariadb*  或 rpm -qa |grep mariadb
```

卸载mariadb与依赖关系的软件包

```
yum remove -y `rpm -qa mariadb*`
```

### 2、 下载

​        下载RPM Bundle，其中包含所有依赖的RPM安装包

(mysql-8.0.25-1.el7.aarch64.rpm-bundle.tar)

(compat-openssl10-1.0.2o-3.el8.aarch64.rpm)

下载地址：https://downloads.mysql.com/archives/community/

### 3、安装

​        2.1 上传至服务器，解压

        tar -zxvf mysql-8.0.26-1.el8.aarch64.rpm-bundle.tar

### 4、 按照以下顺序安装需要的包

```
    rpm -ivh mysql-community-client-plugins-8.0.26-1.el8.aarch64.rpm
    rpm -ivh mysql-community-common-8.0.26-1.el8.aarch64.rpm
    rpm -ivh mysql-community-libs-8.0.26-1.el8.aarch64.rpm
    rpm -ivh mysql-community-client-8.0.26-1.el8.aarch64.rpm
    rpm -ivh mysql-community-server-8.0.26-1.el8.aarch64.rpm
```

**有错误看常见错误**

### 5、 初始化

​        #用户可以随意，我用的root用户

        mysqld --initialize-insecure --user=root

### 6、 启动

   

```
     systemctl start mysqld
```

        补充命令：
        启动mysql服务：systemctl start mysqld.service
        停止mysql服务：systemctl stop mysqld.service
        重启mysql服务：systemctl restart mysqld.service
        查看mysql服务当前状态：    systemctl status mysqld.service
        设置mysql服务开机自启动： systemctl enable mysqld.service
        停止mysql服务开机自启动： systemctl disable mysqld.service

### 常见错误：

**错误提示：libLLVM-7.so不是符号连接**

```
sudo find / -name "libLLVM*"
/usr/lib64/libLLVM-10.so
/usr/lib64/libLLVM-7.0.0.so
/usr/lib64/libLLVM-7.so
/usr/lib64/libLLVM-10.0.1.so
然后查看
ls /usr/lib64/libLL* -la
lrwxrwxrwx. 1 root root       13 12月  8 14:35 /usr/lib64/libLLVM-10.0.1.so -> libLLVM-10.so
-rwxr-xr-x. 1 root root 84012704 12月  8 14:35 /usr/lib64/libLLVM-10.so
-rwxr-xr-x. 1 root root 55552296 10月  9 17:45 /usr/lib64/libLLVM-7.0.0.so
-rwxr-xr-x. 1 root root 55552296 10月  9 17:45 /usr/lib64/libLLVM-7.so
发现ibLLVM-7.so确实没有连接
手动建立连接
sudo ln -sf /usr/lib64/libLLVM-7.0.0.so /usr/lib64/libLLVM-7.so
错误提示消失。
 
sudo ldconfig
sudo ldconfig -v
会自动处理ld.so.conf和ld.so.conf.d 
文件默认放在/lib和/usr/lib
临时配置可使用命令
export LD_LIBRARY_PATH=/usr/lib/****:/usr/local/lib/****
```

**启动报错**

```
find / -name mysqld.log

首先检查了 mysqld.log 日志，得到了报错的日志信息
The innodb_system data file 'ibdata1' must be writable
根据日志信息知道了是 ‘ibdata1’ 数据文件必须是可写的
所以更改权限即可
输入
chmod -R 777 /var/lib/mysql
然后重新启动服务
service mysqld start
```




## 三、docker安装部署Tomcat

### 1、搜索tomcat镜像

```shell
docker search tomcat
```

### 2、拉取tomcat镜像

```shell
docker pull tomcat
```

### 3、创建容器，设置端口映射、目录映射

```shell
# 在/root目录下创建tomcat目录用于存储tomcat数据信息
mkdir ~/tomcat
cd ~/tomcat
```

```shell
docker run -id --name=c_tomcat \
-p 8080:8080 \
-v $PWD:/usr/local/tomcat/webapps \
tomcat 
```

- 参数说明：

  - **-p 8080:8080：**将容器的8080端口映射到主机的8080端口

    **-v $PWD:/usr/local/tomcat/webapps：**将主机中当前目录挂载到容器的webapps

### 4、测试

使用外部机器访问tomcat


## 三、docker安装部署Nginx

### 1、搜索nginx镜像

```shell
docker search nginx
```

### 2、拉取nginx镜像

```shell
docker pull nginx
```

### 3、创建容器，设置端口映射、目录映射


```shell
# 在/root目录下创建nginx目录用于存储nginx数据信息
mkdir ~/nginx
cd ~/nginx
mkdir conf
cd conf
# 在~/nginx/conf/下创建nginx.conf文件,粘贴下面内容
vim nginx.conf
```

```shell
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}


```




```shell
docker run -id --name=c_nginx \
-p 80:80 \
-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf \
-v $PWD/logs:/var/log/nginx \
-v $PWD/html:/usr/share/nginx/html \
nginx
```

- 参数说明：
  - **-p 80:80**：将容器的 80端口映射到宿主机的 80 端口。
  - **-v $PWD/conf/nginx.conf:/etc/nginx/nginx.conf**：将主机当前目录下的 /conf/nginx.conf 挂载到容器的 :/etc/nginx/nginx.conf。配置目录
  - **-v $PWD/logs:/var/log/nginx**：将主机当前目录下的 logs 目录挂载到容器的/var/log/nginx。日志目录

### 4、测试

使用外部机器访问nginx

## 四、docker安装部署Redis

### 1、搜索redis镜像

```shell
docker search redis
```

### 2、拉取redis镜像

```shell
docker pull redis:5.0
```

### 3、创建容器，设置端口映射

```shell
docker run -id --name=c_redis -p 6379:6379 redis:5.0
```

### 4、测试

使用外部机器连接redis

```shell
./redis-cli.exe -h 192.168.x.x -p 6379
```



## 五、docker安装部署postgreSQL

### 1、搜索postgres镜像

```shell
docker search postgres
```

### 2、拉取postgres镜像

```shell
docker pull postgres:14-alpine
```

### 3、创建挂载目录

```
mkdir -p /data/postgresql/data
```

### 4、创建容器，设置端口映射

```shell
docker run -d --name=postgresql -p 5432:5432  -v /data/postgresql/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=Zz@2020 postgres:14-alpine
```

### 5、修改密码（可选）

1.进入docker 容器 

```
docker exec -it postgres96 /bin/sh
```

2.连接数据库 

```
psql -U postgres
```

3.键入命令修改postgres用户密码：

```
 ALTER USER postgres WITH PASSWORD 'ST1q@W3e4r';
```



