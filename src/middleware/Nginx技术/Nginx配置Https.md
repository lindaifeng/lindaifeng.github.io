---
title: Nginx配置Https
categories: 
  - Nginx
tags: 
  - https
order: 2
---



# Nginx配置Https（安全认证）

## 1、Http与Https的区别

HTTP：是互联网上应用最为广泛的一种网络协议，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。

HTTPS：是以安全为目标的HTTP通道，简单讲是HTTP的安全版，即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。HTTPS协议的主要作用可以分为两种：一种是建立一个信息安全通道，来保证数据传输的安全；另一种就是确认网站的真实性。

**HTTPS和HTTP的区别主要如下：**

>
> 1、https协议需要到ca申请证书，一般免费证书较少，因而需要一定费用。
> 2、http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
> 3、http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。
> 4、http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

1）http访问：未认证在部分浏览器上访问是会提示不安全的，有安全隐患



![image-20210523181111096](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523181111096.png)



2）https访问：认证后



![image-20210523181224421](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523181224421.png)



## Nginx配置Https

### **一、安装nginx的SSL模块**

1、配置ssl证书前，要确保你的nginx安装了ssl模块，一般情况下自己安装的nginx都是不存在ssl模块的。

检查自己的nginx是否安装了ssl模块

cd nginx的安装目录sbin下输入

```
./nginx -V
```



![image-20210523181704656](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523181704656.png)



如果有出现红框中的信息，证明有安装。

2、没有安装ssl模块的情况

进入你的nginx解压后的目录（不是nginx安装目录），输入

```
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
```

接下来执行

```
make  #切记不要执行make install 否则会重新安装nginx
```

3、进入objs文件夹，文件夹中存在nginx文件，替换掉sbin下的nginx

```
#如果开启了nginx先进入sbin中停掉nginx服务
./nginx -s stop #停止nginx服务
# cp 压缩后的nginx路径(你自己的)  安装的nginx路径(你自己的) 
cp /root/nginx/objs/nginx /usr/local/ngin/sbin
```

4、成功之后，进入nginx安装目录，查看ssl是否安装成功

```
./nginx -V
#权限不足可执行给nginx权限
chmod 111 nginx
```

### 二、配置SSL证书

阿里云可申请免费的ssl证书，具体可百度（证书一般是pem和key文件）

1、将证书上传到一个文件夹中(自定义)

```
mkdir -p /nginx/card-key-pem 
```



![image-20210523184201035](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523184201035.png)



2、配置ssl，进入nginx安装目录中的conf文件中

```
cd /usr/local/nginx/conf
vim nginx.conf
```

```java
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    
server {
        listen       443;  #监听443端口
        server_name  www.qingfenginn.top; 	#你的域名

        ssl on;		#开启ssl
        ssl_certificate /root/nginx/card-key-pem/5386933_www.qingfenginn.top.pem;	#你上传的ssl证书的pem文件路径
        ssl_certificate_key /root/nginx/card-key-pem/5386933_www.qingfenginn.top.key; 	#你上传的ssl证书的key文件路径

        location / {	#访问路径
           #反向代理到你的项目 http://公网地址：端口
           proxy_pass http://www.qingfenginn.top:81; 
        }
 }


server {
        listen 80;	#监听80端口
        server_name www.qingfenginn.top;
		#将请求转成https
        rewrite ^(.*)$ https://$host$1 permanent; 
    }
}

```

> 注意：配置完后，nginx会同时监听443端口和80端口，443端口需要在安全组开发端口

3、重启nginx，使配置生效

进入sbin目录

先校验一下配置文件是否正确

```
./nginx -t
```



![image-20210523185524664](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210523185524664.png)



在启动nginx

```
./nginx -s reload //重启
./nginx -s stop  //停止
./nginx			//启动
```

之后就可以用你的域名访问了