---
order: 1
title: Mysql常用命令

---
### 1、查看用户连接权限

```shell
select user,host from user;
```

### 2、查看MySQL某个用户的权限：

```shell
show grants for root;
```

### 3、查看相关连接参数

```shell
show variables like "%connection_control%";
```

### 4、修改密码

```shell
alter user’root’@’%’ IDENTIFIED BY 'test123 ';
设置密码(8.0该方式远程连不上)
SET PASSWORD FOR 'root'@'%' = 'Zz@2020';
以这种方式连接
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY "FZZXnet1@3";
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY "FZZXnet1@3";
```

### 5、刷新权限

```shell
flush privileges;
```

### 6、赋予任何主机访问权限

```shell
mysql5.7版本
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;
8.0版本
update user set host='%' where user='root';

刷新权限
flush privileges;
```

### 7、修改密码过期时间

```shell
show variables like 'default_password_lifetime';
SET GLOBAL default_password_lifetime = 90;
```

### 8、命令行导出文件

```shell
Mysql8.0命令行导出文件
mysqldump --column-statistics=0 -h ip -uroot -p --max_allowed_packet=512M dbname > 路径
Mysql5.7命令行导出文件
mysqldump  -h ip -uroot -p --max_allowed_packet=512M dbname > 路径
```

### 9、重启服务

```
service mysqld restart
```

### 10.sql导库

```shell
CREATE DATABASE IF NOT EXISTS 库名 DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;

CREATE DATABASE `wangzy_table` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE DATABASE `filling` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

use 库名
source sql文件路径
```

### 11、# 查看最大连接数

```shell
show variables like '%max_connection%'; 

重新设置最大连接数
set global max_connections=1000;        
```

### 12、更新数据到另一张表

```shell
方式一：update 更新表 set 字段 = (select 参考数据 from 参考表 where  更新表.id = 参考表.id)

例如：update a set aaa = (select aaa from b where a.id = b.id),bbb = (select bbb from b where a.id = b.id)

方式二：update 更新表,参考表 set 更新表数据 = 参考表数据 where 更新表.id = 参考表.id

例如：update a,b set a.aaa = b.aaa,a.bbb = b.bbb where a.id = b.id;
```

### 13、重置自增序列

```shell
ALTER TABLE cloud_connector_data_push_record AUTO_INCREMENT =1
```

### 14、Mysql修改表名

```shell
alter Table titles_test rename to titles_2017;
```

### 15、查看是否开启binglog日志 on开启

```shell
show VARIABLES LIKE 'log_%';
```

