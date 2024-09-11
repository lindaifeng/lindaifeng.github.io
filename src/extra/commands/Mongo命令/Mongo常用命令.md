---
order: 1
title: Mongo常用命令

---
### 1、mongo数据备份与恢复

```shell
mongodump --host 124.71.2.157 --port 27017 -d qjsqb --username admin --password pass -o /root/a
mongorestore --host <dbhost> --port <dbport> -d <dbname> --drop <path>
```

### 2、mongo 更新多条 要加multi:true

```shell
	db.表名.update({"字段":null},
		{$set:{"字段":"true"}},{multi:true}
	);
	
更新数组中的元素
   db.P_Land.update({},
	{$push:{"字段名":数组}},{multi:true}
);
```
