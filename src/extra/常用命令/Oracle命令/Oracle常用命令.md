---
order: 1
title: Oracle常用命令

---
### 查看表空间信息

```shell
1、查看表空间信息
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
 ORDER BY TOTAL.TABLESPACE_NAME

2、查看表空间存储位置
select tablespace_name,
       file_id,
       file_name,
       round(bytes / (1024 * 1024), 0) total_space
  from sys.dba_data_files
 order by tablespace_name;

2、扩容指定表空间：
alter database datafile 'C:\APP\ORADATA\ORCL\SYSTEM01.DBF' resize 20000M;xxxxxxxxxx 更新数组中的元素   db.P_Land.update({},  {$push:{"字段名":数组}},{multi:true});
```

