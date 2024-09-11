---
title: harbor版本升级方案
categories: 
  - Docker
tags: 
  - harbor
order: 1
---



## harbor升级方案

### 环境检查

1. **harbor安装位置以及镜像存储位置**

   ```
   find / -name harbor
   ```

   ![img](https://img.slcp.top/DF5459D11E394FFAC3AF954B335EE05B.png)

2. 版本查看

   **1）界面查看**

   > 界面版本更为准确！！！

   ![D32702B0FD38EF3A2C66575A381989AB](https://img.slcp.top/D32702B0FD38EF3A2C66575A381989AB.png)

   ![B8E0E1036A32364285C732F71EF18665](https://img.slcp.top/B8E0E1036A32364285C732F71EF18665.jpg)

    

   **2）配置查看**

   ```
   /_version
   ```

    

   ![3459425649BBD5C5E379085EC8A009EA](https://img.slcp.top/3459425649BBD5C5E379085EC8A009EA.png)

### 获取最新镜像

1. **查看版本**

   官网：https://goharbor.io/

   ![image-20230129100035153](%20http://img.lindaifeng.vip/typora-picgo-tuchaung/20230130170406.png)

2. **下载最新版本**

   github项目：https://github.com/goharbor/harbor

   ![image-20230129100318918](https://img.slcp.top/image-20230129100318918.png)

   ![image-20230129100419274](https://img.slcp.top/image-20230129100419274.png)

 

### 删除原harbor

> 温馨提示：
>
> ​	2.7.0为版本好，具体位置根据磁盘大小而定！！！

1. **备份数据**

   ```
   mkdir /2.7.0
   ```

   ```
   mkdir /data/2.7
   ```

   ```
   mv harbor /2.7.0/
   ```

   ```
   cp -r /data/* /data/2.7/
   ```

2. **删除镜像**

```
#在原harbor安装目录下执行(即与docker-compose.yml同级目录)
docker-compose down
```

 

### 安装新harbor

1. **上传**

   > 将tar包上传到指定位置

2. **解压**

   ```
   tar -zxvf harbor-offline-installer-v2.7.0.tgz
   ```

3. **编辑yml文件**

   ```
   cp harbor.yml.tmpl harbor.yml
   ```

4. **修改配置**

   > 注释掉htps的配置内容，配置htp相关的参数，主要是**hostname**，**port**，其他都可以不用动。

   > 温馨提示：`密码`和`数据存储位置`必须修改
   >
   > data_volume: /data/2.7（仅供参考！！！）

   ![image-20220410115849673](https://img.slcp.top/image-20220410115849673.png)

5. **启动**

   ```
   ./install.sh
   ```

   ![1FFBEB6B89353FFB72B329BCCB56F3B9](https://img.slcp.top/1FFBEB6B89353FFB72B329BCCB56F3B9.png)

6. **检查**

![B1AC620EC7189F47265243BC1A28E91E](https://img.slcp.top/B1AC620EC7189F47265243BC1A28E91E.jpg)