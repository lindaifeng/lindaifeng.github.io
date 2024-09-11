---
title: Linux安装mysql
categories: 
  - Linux
tags: 
  - mysql
order: 11
---

# 

# 安装mysql步骤

> 如果系统之前⾃带 Mariadb ，可以先卸载之。
>
> ⾸先查询已安装的 Mariadb 安装包：
>
> rpm -qa|grep mariadb
>
> 将其均卸载之：
>
> yum -y remove mariadb-server-5.5.56-2.el7.x86_64
>
> yum -y remove mariadb-5.5.56-2.el7.x86_64
>
> yum -y remove mariadb-devel-5.5.56-2.el7.x86_64
>
> yum -y remove mariadb-libs-5.5.56-2.el7.x86_64

## 1、下载安装包

## 2、上传安装包

```
 alt + p -------> put d:/setup/mysql-5.7.27-1.el7.x86_64.rpm-bundle.tar
```

## 3、解压 mysql 的安装包

```
mkdir mysql
    
tar -xvf mysql-5.7.27-1.el7.x86_64.rpm-bundle.tar -C mysql/
```

## 4、安装客户端

```
cd mysql/
#强制安装
rpm -ivh mysql-community-client-5.7.27-1.el7.x86_64.rpm --force --nodeps
```

## 5、安装服务端

	rpm -ivh mysql-community-server-5.7.27-1.el7.x86_64.rpm --force --nodeps

## 6、修改mysql默认字符集

​	vi /etc/my.cnf

```
	1、添加如下内容：
	[mysqld]
	character-set-server=utf8
	collation-server=utf8_general_ci

	#忽略大小写可加
	lower_case_table_names=1
 
	2、在文件最下方添加
	[client]
	default-character-set=utf8
```

## 7、 启动mysql服务

	service mysqld start

## 8、登录mysql

```
初始密码查看：cat /var/log/mysqld.log | grep password
	
	mysql -u root -p  敲回车，输入密码
	mysql -uroot -proot    

	在root@localhost:   后面的就是初始密码
```

## 9、修改mysql登录密码

```
	set global validate_password_policy=0;
    
	set global validate_password_length=1;
    
	set password=password('root');
```

## 10、授予远程连接权限

> 可能是你的帐号不允许从远程登陆，只能在localhost。这个时候只要在localhost的那台电脑，登入mysql后，更改 "mysql" 数据库里的 "user" 表里的 "host" 项，从"localhost"改称"%"
>
> ```
> mysql -u root -p
> 
> mysql>use mysql;
> mysql>update user set host = '%' where user = 'root';
> mysql>select host, user from user;
> ```



```
	//授权
	grant all privileges on *.* to 'root' @'%' identified by 'root';  
    
	//刷新
	flush privileges;
```

## 11、关闭Linux系统防火墙

```
systemctl stop firewalld
```

## 12、重启mysql服务

```
service mysqld restart
```

## 13、卸载：mysql

```
1、使用yum卸载安装的mysql：yum remove mysql mysql-server mysql-libs mysql-server
2、查询剩余的安装包rpm -qa|grep mysql
3、移除掉这些安装包rpm -ev mysql-community-common-5.7.29-1.el7.x86_64
4、有包删除包 rpm -e -nodeps 包名
5、查找之前老版本mysql的目录、并且删除老版本mysql的文件和库
find / -name mysql
rm -rf /var/lib/mysql
6、卸载后/etc/my.cnf不会删除，需要进行手工删除
rm -rf /etc/my.cnf
7、再次查找机器是否安装mysql
rpm -qa|grep -i mysql
```

