# Mongo常用命令

本文档整理了MongoDB日常使用中最常用和实用的命令，按照功能分类，方便学习和查阅。

## 一、MongoDB基础操作命令

### 1. 数据库操作

```shell
# 连接MongoDB
mongo

# 显示所有数据库
show dbs

# 切换/创建数据库
use 数据库名

# 显示当前数据库
db

# 删除当前数据库
db.dropDatabase()
```

### 2. 集合操作

```shell
# 显示当前数据库中的所有集合
show collections

# 创建集合
db.createCollection("集合名")

# 删除集合
db.集合名.drop()
```

### 3. 文档操作

```shell
# 插入单个文档
db.集合名.insert({字段1: 值1, 字段2: 值2})

# 插入多个文档
db.集合名.insert([{字段1: 值1}, {字段1: 值2}])

# 查询所有文档
db.集合名.find()

# 查询单个文档
db.集合名.findOne()

# 条件查询
db.集合名.find({字段: 值})

# 更新文档
db.集合名.update({条件}, {$set: {字段: 新值}})

# 删除文档
db.集合名.remove({条件})
```

## 二、MongoDB数据备份与恢复

### 1. 数据备份

```shell
# 备份整个MongoDB实例
mongodump --host 主机名 --port 端口号 -u 用户名 -p 密码 -o 备份目录

# 示例
mongodump --host 124.71.2.157 --port 27017 -d qjsqb --username admin --password pass -o /root/a

# 备份指定数据库
mongodump --host 主机名 --port 端口号 -d 数据库名 -u 用户名 -p 密码 -o 备份目录

# 备份指定集合
mongodump --host 主机名 --port 端口号 -d 数据库名 -c 集合名 -u 用户名 -p 密码 -o 备份目录
```

### 2. 数据恢复

```shell
# 恢复整个MongoDB实例
mongorestore --host 主机名 --port 端口号 -u 用户名 -p 密码 备份目录

# 恢复指定数据库
mongorestore --host 主机名 --port 端口号 -d 数据库名 --drop 备份目录

# 示例
mongorestore --host <dbhost> --port <dbport> -d <dbname> --drop <path>
```

## 三、MongoDB数据更新操作

### 1. 更新单条数据

```shell
# 更新匹配到的第一条数据
db.集合名.update({查询条件}, {$set: {字段: 新值}})
```

### 2. 更新多条数据

```shell
# 更新所有匹配的数据（MongoDB 3.2+版本）
db.集合名.updateMany({查询条件}, {$set: {字段: 新值}})

# 或者在旧版本中使用multi参数
db.集合名.update({查询条件}, {$set: {字段: 新值}}, {multi: true})

# 示例
db.表名.update({"字段":null}, {$set:{"字段":"true"}}, {multi:true})
```

### 3. 数组操作

```shell
# 向数组中添加元素
db.集合名.update({查询条件}, {$push: {数组字段: 元素值}})

# 向数组中添加多个元素
db.集合名.update({查询条件}, {$push: {数组字段: {$each: [元素1, 元素2]}}})

# 示例：更新数组中的元素
db.P_Land.update({}, {$push:{"字段名":数组}}, {multi:true})
```

## 四、MongoDB查询进阶

### 1. 条件查询

```shell
# 大于查询
db.集合名.find({字段: {$gt: 值}})

# 小于查询
db.集合名.find({字段: {$lt: 值}})

# 范围查询
db.集合名.find({字段: {$gte: 最小值, $lte: 最大值}})

# 不等于查询
db.集合名.find({字段: {$ne: 值}})

# 包含查询（数组）
db.集合名.find({字段: {$in: [值1, 值2]}})

# 不包含查询（数组）
db.集合名.find({字段: {$nin: [值1, 值2]}})
```

### 2. 排序和分页

```shell
# 升序排序
db.集合名.find().sort({字段: 1})

# 降序排序
db.集合名.find().sort({字段: -1})

# 限制返回结果数量
db.集合名.find().limit(数量)

# 跳过指定数量的结果
db.集合名.find().skip(数量)

# 分页查询
db.集合名.find().skip(页码*每页数量).limit(每页数量)
```

## 五、MongoDB索引操作

### 1. 索引管理

```shell
# 创建单字段索引
db.集合名.createIndex({字段: 1})

# 创建复合索引
db.集合名.createIndex({字段1: 1, 字段2: -1})

# 查看集合索引
db.集合名.getIndexes()

# 删除索引
db.集合名.dropIndex({字段: 1})

# 删除所有索引
db.集合名.dropIndexes()
```

## 六、MongoDB聚合操作

### 1. 基本聚合

```shell
# 聚合管道操作
db.集合名.aggregate([
  {$match: {条件}},
  {$group: {_id: "$字段", 计数: {$sum: 1}}},
  {$sort: {计数: -1}}
])
```

## 七、MongoDB性能监控

### 1. 性能分析

```shell
# 开启数据库性能监控
db.setProfilingLevel(2)

# 查看慢查询日志
db.system.profile.find().pretty()

# 关闭性能监控
db.setProfilingLevel(0)
```