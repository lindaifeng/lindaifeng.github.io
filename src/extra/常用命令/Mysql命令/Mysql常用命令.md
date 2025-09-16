# MySQL常用命令

本文档整理了MySQL日常使用中最常用和实用的命令，按照功能分类，方便学习和查阅。

## 一、MySQL连接与基础操作

### 1. 连接MySQL

```shell
# 连接本地MySQL
mysql -u 用户名 -p

# 连接远程MySQL
mysql -h 主机地址 -u 用户名 -p

# 连接指定端口的MySQL
mysql -h 主机地址 -P 端口号 -u 用户名 -p

# 连接并选择数据库
mysql -u 用户名 -p -D 数据库名
```

### 2. 数据库操作

```shell
# 显示所有数据库
show databases;

# 创建数据库
create database 数据库名;

# 创建数据库并指定字符集
create database 数据库名 default character set utf8mb4 collate utf8mb4_unicode_ci;

# 使用数据库
use 数据库名;

# 删除数据库
drop database 数据库名;
```

### 3. 表操作

```shell
# 显示当前数据库中的所有表
show tables;

# 显示表结构
desc 表名;
# 或
describe 表名;
# 或
show columns from 表名;

# 显示表的创建语句
show create table 表名;

# 创建表
create table 表名 (字段1 类型, 字段2 类型);

# 删除表
drop table 表名;

# 清空表数据
truncate table 表名;
```

## 二、MySQL用户与权限管理

### 1. 用户管理

```shell
# 查看用户连接权限
select user,host from user;

# 查看当前用户
select user();

# 创建用户
create user '用户名'@'主机' identified by '密码';

# 删除用户
drop user '用户名'@'主机';

# 修改用户名
rename user '旧用户名'@'主机' to '新用户名'@'主机';
```

### 2. 权限管理

```shell
# 查看MySQL某个用户的权限
show grants for 用户名;

# 授予权限
grant 权限 on 数据库.表 to '用户名'@'主机';

# 授予所有权限
grant all privileges on 数据库.表 to '用户名'@'主机';

# 示例：授予查询权限
grant select on testdb.* to 'testuser'@'%';

# 示例：授予所有权限
grant all privileges on testdb.* to 'testuser'@'%';

# 刷新权限
flush privileges;

# 撤销权限
revoke 权限 on 数据库.表 from '用户名'@'主机';

# 示例：撤销查询权限
revoke select on testdb.* from 'testuser'@'%';
```

### 3. 远程访问配置

```shell
# MySQL 5.7版本 - 赋予任何主机访问权限
GRANT ALL PRIVILEGES ON *.* TO '用户名'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;

# MySQL 8.0版本 - 赋予任何主机访问权限
# 1. 更新用户host字段
update user set host='%' where user='用户名';

# 2. 刷新权限
flush privileges;
```

## 三、MySQL数据操作

### 1. 数据查询

```shell
# 查询所有数据
select * from 表名;

# 条件查询
select * from 表名 where 条件;

# 排序查询
select * from 表名 order by 字段 asc/desc;

# 限制查询结果数量
select * from 表名 limit 数量;

# 分页查询
select * from 表名 limit 起始位置, 数量;
```

### 2. 数据插入

```shell
# 插入单条数据
insert into 表名 (字段1, 字段2) values (值1, 值2);

# 插入多条数据
insert into 表名 (字段1, 字段2) values (值1, 值2), (值3, 值4);
```

### 3. 数据更新

```shell
# 更新数据
update 表名 set 字段=新值 where 条件;
```

### 4. 数据删除

```shell
# 删除数据
delete from 表名 where 条件;

# 删除所有数据
delete from 表名;
```

## 四、MySQL配置与参数管理

### 1. 连接参数管理

```shell
# 查看相关连接参数
show variables like "%connection_control%";

# 查看最大连接数
show variables like '%max_connection%';

# 重新设置最大连接数
set global max_connections=1000;
```

### 2. 密码管理

```shell
# 修改密码（MySQL 5.7及以下版本）
SET PASSWORD FOR '用户名'@'主机' = '新密码';

# 修改密码（MySQL 8.0版本）
alter user '用户名'@'主机' IDENTIFIED BY '新密码';

# 设置密码（8.0该方式远程连不上）
SET PASSWORD FOR '用户名'@'%' = 'Zz@2020';

# 以兼容方式连接（解决远程连接问题）
ALTER USER '用户名'@'localhost' IDENTIFIED WITH mysql_native_password BY "密码";
ALTER USER '用户名'@'%' IDENTIFIED WITH mysql_native_password BY "密码";
```

### 3. 密码过期策略

```shell
# 查看密码过期时间设置
show variables like 'default_password_lifetime';

# 设置全局密码过期时间（天）
SET GLOBAL default_password_lifetime = 90;

# 设置用户密码永不过期
ALTER USER '用户名'@'主机' PASSWORD EXPIRE NEVER;

# 设置用户密码在下次登录时过期
ALTER USER '用户名'@'主机' PASSWORD EXPIRE INTERVAL 30 DAY;
```

## 五、MySQL备份与恢复

### 1. 数据导出（备份）

```shell
# MySQL 8.0命令行导出文件
mysqldump --column-statistics=0 -h 主机地址 -u 用户名 -p --max_allowed_packet=512M 数据库名 > 文件路径

# MySQL 5.7命令行导出文件
mysqldump -h 主机地址 -u 用户名 -p --max_allowed_packet=512M 数据库名 > 文件路径

# 导出指定表
mysqldump -h 主机地址 -u 用户名 -p 数据库名 表名 > 文件路径

# 导出多个表
mysqldump -h 主机地址 -u 用户名 -p 数据库名 表1 表2 > 文件路径

# 导出结构不导出数据
mysqldump -h 主机地址 -u 用户名 -p -d 数据库名 > 文件路径
```

### 2. 数据导入（恢复）

```shell
# 创建数据库
CREATE DATABASE IF NOT EXISTS 数据库名 DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;

# 示例
CREATE DATABASE `wangzy_table` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE DATABASE `filling` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# 使用数据库
use 数据库名;

# 导入SQL文件
source SQL文件路径;
```

## 六、MySQL表结构操作

### 1. 表结构修改

```shell
# 添加字段
alter table 表名 add column 字段名 类型;

# 修改字段类型
alter table 表名 modify column 字段名 新类型;

# 修改字段名和类型
alter table 表名 change 原字段名 新字段名 新类型;

# 删除字段
alter table 表名 drop column 字段名;

# 添加索引
alter table 表名 add index 索引名 (字段名);

# 删除索引
alter table 表名 drop index 索引名;
```

### 2. 表重命名

```shell
# 修改表名
alter table 原表名 rename to 新表名;

# 示例
alter Table titles_test rename to titles_2017;
```

### 3. 表数据操作

```shell
# 更新数据到另一张表
# 方式一：使用子查询
update 更新表 set 字段 = (select 参考数据 from 参考表 where 更新表.id = 参考表.id);

# 示例
update a set aaa = (select aaa from b where a.id = b.id), bbb = (select bbb from b where a.id = b.id);

# 方式二：多表关联更新
update 更新表, 参考表 set 更新表字段 = 参考表字段 where 更新表.id = 参考表.id;

# 示例
update a,b set a.aaa = b.aaa, a.bbb = b.bbb where a.id = b.id;
```

### 4. 自增序列管理

```shell
# 重置自增序列
ALTER TABLE 表名 AUTO_INCREMENT = 1;

# 查看自增值
show create table 表名;
```

## 七、MySQL日志管理

### 1. 日志配置查看

```shell
# 查看是否开启binlog日志（on开启）
show VARIABLES LIKE 'log_bin';

# 查看所有日志相关变量
show VARIABLES LIKE 'log_%';
```

### 2. 服务管理

```shell
# 重启MySQL服务
service mysqld restart

# 或者
systemctl restart mysqld
```

## 八、MySQL字符集管理

### 1. 字符集查看

```shell
# 查看数据库字符集
show variables like 'character_set%';

# 查看表字符集
show create table 表名;

# 查看列字符集
show full columns from 表名;
```