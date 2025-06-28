---
title: Linux安装nginx
categories: 
  - Linux
tags: 
  - nginx
order: 12
---

# Linux安装nginx

> Nginx的安装可分为两种：
>
> 1、通过Nginx源码安装
>
> 2、通过yum安装

一、下面通过源码安装：

通过源码安装需要提前安装好GCC编译器、PCRE兼容正则表达式库、zlib压缩库、OpenSSL安全通信的软件库包，然后才能进行Nginx的安装

1、通过一条指令全部安装：

```
yum install -y gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel
```

2、下载好安装包

```
wget http://nginx.org/download/nginx-1.16.1.tar.gz
```

3、建议大家将下载的资源进行包管理（将安装包放入core文件夹中管理）

```
mkdir -p nginx/core 
mv nginx-1.16.1.tar.gz nginx/core
```

4、解压

```
tar -xzf nginx-1.16.1.tar.gz
```

5、进入解压后的nginx，会看到configure

```
./configure
如果要安装其他模块支持执行（事先安装好软件包）
./configure \
--prefix=/usr/local/nginx \
--with-http_ssl_module \
--with-http_v2_module \
--with-http_gzip_static_module \
--with-http_stub_status_module \
--with-http_realip_module \
--with-http_sub_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_mp4_module \
--with-http_gunzip_module
```

6、编译

```
make
```

7、安装

```
make install
```

8、查看安装的位置（默认在/usr/local/nginx）

```
whereis nginx
```

9、进入安装的ngin文件夹中可查看到conf、html、sbin等文件夹

> conf   配置文件
>
> html  静态资源文件
>
> sbin  可执行程序文件

10、进入sbin文件夹,查看版本信息

```
./nginx -V
```

![image-20210523175503891](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523175503891.png)

11、可通过tree指令查看nignx的目录结构

```
yum install -y tree  //安装tree指令
tree /usr/local/nginx //执行tree指令 + 安装软件的路径
```

![image-20210523180911420](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523180911420.png)