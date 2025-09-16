# Oracle常用命令

本文档整理了Oracle数据库日常使用中最常用和实用的命令，按照功能分类，方便学习和查阅。
## 一、Oracle连接与基础操作

### 1. 连接Oracle数据库

```shell
# 连接Oracle数据库
sqlplus 用户名/密码@主机:端口/服务名

# 以管理员身份连接
sqlplus / as sysdba

# 连接后切换用户
conn 用户名/密码
```

### 2. 数据库基础操作

```shell
# 查看数据库实例状态
select instance_name, status from v$instance;

# 查看当前用户
show user;

# 查看数据库版本
select * from v$version;

# 查看数据库名称
select name from v$database;
```

## 二、Oracle用户与权限管理

### 1. 用户管理

```shell
# 创建用户
create user 用户名 identified by 密码;

# 修改用户密码
alter user 用户名 identified by 新密码;

# 删除用户
drop user 用户名 cascade;

# 锁定用户
alter user 用户名 account lock;

# 解锁用户
alter user 用户名 account unlock;
```

### 2. 权限管理

```shell
# 授予用户连接数据库权限
grant create session to 用户名;

# 授予用户基本权限
grant connect, resource to 用户名;

# 授予用户DBA权限
grant dba to 用户名;

# 授予用户表操作权限
grant select, insert, update, delete on 表名 to 用户名;

# 授予用户所有表操作权限
grant select any table to 用户名;

# 撤销用户权限
revoke create session from 用户名;

# 查看用户权限
select * from dba_sys_privs where grantee='用户名';
```

### 3. 角色管理

```shell
# 创建角色
create role 角色名;

# 授予角色权限
grant 权限 to 角色名;

# 授予用户角色
grant 角色名 to 用户名;

# 查看用户角色
select * from dba_role_privs where grantee='用户名';
```

## 三、Oracle表空间管理

### 1. 表空间信息查看

```shell
# 查看表空间信息
SELECT TOTAL.TABLESPACE_NAME AS 表空间名,
       ROUND(TOTAL.MB - FREE.MB, 2) || ' MB' AS 当前已使用的空间,
       ROUND(TOTAL.MB, 2) || ' MB' AS 当前可使用总空间,
       ROUND(FREE.MB, 2) || ' MB' AS 当前剩余可使用空间,
       ROUND((1 - FREE.MB / TOTAL.MB) * 100, 2) || '%' AS 当前使用百分比,
       ROUND(TOTAL.MAX_MB, 2) || ' MB' AS 可扩展到的最大空间,
       DECODE(TOTAL.MAX_MB, 0, 0, ROUND(TOTAL.MAX_MB - TOTAL.MB, 2)) ||
       ' MB' AS 剩余可扩展的空间,
       DECODE(TOTAL.MAX_MB,
              0,
              0,
              ROUND((1 - TOTAL.MB / TOTAL.MAX_MB) * 100, 2)) || '%' AS 剩余可扩展的百分比
  FROM (SELECT TABLESPACE_NAME, SUM(BYTES) / 1024 / 1024 AS MB
          FROM DBA_FREE_SPACE
         GROUP BY TABLESPACE_NAME) FREE,
       (SELECT TABLESPACE_NAME,
               SUM(BYTES) / 1024 / 1024 AS MB,
               SUM(MAXBYTES) / 1024 / 1024 AS MAX_MB
          FROM DBA_DATA_FILES
         GROUP BY TABLESPACE_NAME) TOTAL
 WHERE FREE.TABLESPACE_NAME = TOTAL.TABLESPACE_NAME
 ORDER BY TOTAL.TABLESPACE_NAME;
```

### 2. 表空间存储位置查看

```shell
# 查看表空间存储位置
select tablespace_name,
       file_id,
       file_name,
       round(bytes / (1024 * 1024), 0) total_space
  from sys.dba_data_files
 order by tablespace_name;
```

### 3. 表空间操作

```shell
# 创建表空间
create tablespace 表空间名
datafile '文件路径' size 初始大小
autoextend on next 扩展大小 maxsize 最大大小;

# 示例
create tablespace mytablespace
datafile '/u01/app/oracle/oradata/mytablespace.dbf' size 100M
autoextend on next 10M maxsize 200M;

# 删除表空间
drop tablespace 表空间名 including contents and datafiles;

# 扩容指定表空间
alter database datafile '数据文件路径' resize 新大小;

# 示例
alter database datafile 'C:\APP\ORADATA\ORCL\SYSTEM01.DBF' resize 20000M;
```

## 四、Oracle数据操作

### 1. 表操作

```shell
# 查看当前用户下的所有表
select table_name from user_tables;

# 查看所有表（需要DBA权限）
select owner, table_name from dba_tables;

# 创建表
create table 表名 (
  字段1 类型,
  字段2 类型
);

# 删除表
drop table 表名;

# 清空表数据
truncate table 表名;
```

### 2. 数据查询

```shell
# 查询所有数据
select * from 表名;

# 条件查询
select * from 表名 where 条件;

# 排序查询
select * from 表名 order by 字段 asc/desc;

# 分组查询
select 字段, count(*) from 表名 group by 字段;
```

### 3. 数据插入

```shell
# 插入数据
insert into 表名 (字段1, 字段2) values (值1, 值2);

# 批量插入
insert into 表名 (字段1, 字段2) select 字段1, 字段2 from 参考表;
```

### 4. 数据更新

```shell
# 更新数据
update 表名 set 字段=新值 where 条件;
```

### 5. 数据删除

```shell
# 删除数据
delete from 表名 where 条件;
```

## 五、Oracle索引管理

### 1. 索引操作

```shell
# 创建索引
create index 索引名 on 表名(字段名);

# 创建唯一索引
create unique index 索引名 on 表名(字段名);

# 删除索引
drop index 索引名;

# 查看索引信息
select index_name, table_name, column_name from user_ind_columns where table_name='表名';
```

## 六、Oracle序列管理

### 1. 序列操作

```shell
# 创建序列
create sequence 序列名
start with 1
increment by 1
nomaxvalue
nocache;

# 使用序列
select 序列名.nextval from dual;

# 查看序列当前值
select 序列名.currval from dual;

# 删除序列
drop sequence 序列名;
```

## 七、Oracle导入导出

### 1. 数据泵导出

```shell
# 导出整个数据库
expdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp full=y

# 导出指定用户
expdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp schemas=用户名

# 导出指定表
expdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp tables=表名
```

### 2. 数据泵导入

```shell
# 导入整个数据库
impdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp full=y

# 导入指定用户
impdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp schemas=用户名

# 导入指定表
impdp 用户名/密码@服务名 directory=目录名 dumpfile=文件名.dmp tables=表名
```

## 八、Oracle性能监控

### 1. 性能查询

```shell
# 查看会话信息
select sid, serial#, username, status, machine, program from v$session;

# 查看锁信息
select * from v$lock;

# 查看等待事件
select * from v$session_wait;

# 查看SQL执行计划
explain plan for select 语句;
select * from table(dbms_xplan.display);
```

## 九、Oracle备份与恢复

### 1. RMAN备份

```shell
# 连接RMAN
rman target /

# 全库备份
backup database;

# 备份表空间
backup tablespace 表空间名;

# 备份归档日志
backup archivelog all;
```

### 2. RMAN恢复

```shell
# 恢复数据库
restore database;
recover database;
```