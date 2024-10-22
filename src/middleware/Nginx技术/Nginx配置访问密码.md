---
title: Nginx配置访问密码
categories: 
  - Nginx
tags: 
  - https
---



# Nginx配置访问密码(在线｜离线安装)

> 实现效果：
>
> 1、通过nignx访问的站点或目录，需要让用户输入用户名密码才能访问
>
> 2、在nginx下，提供了ngx_http_auth_basic_module模块实现让用户只有输入正常的用户名密码才允许访问web内容。默认情况下，
> nginx已经安装了该模块，所以整体的一个过程就是先用第三方工具设置用户名、密码（其中密码已经加过密）让后保存到文件中，
> 接着在nginx配置文件中根据之前事先保存的文件开启访问验证：



> 对网站通过密码进行访问 有两种方法
>
> 一种是 通过 htpasswd
>
>  一种是 通过 openssl
>
> 「nginx密码访问所需离线包」https://www.aliyundrive.com/s/1aJ3dAZ3JiB 提取码: q3u8 点击链接保存，或者复制本段内容，打开「阿里云盘」APP 

## 以htpasswd为例：

httpd-tools-2.4.6-88.el7.centos.x86_64.rpm

### 一、安装生成密码工具

```
在线安装
安装htpasswd工具：
(yum安装)：
yum -y install httpd-tools

离线安装
rpm -ivh httpd-tools-2.4.6-88.el7.centos.x86_64.rpm
依赖于：
apr-1.4.8-7.el7.x86_64.rpm
apr-util-1.5.2-6.el7.x86_64.rpm
```

### 二、生成密码文件

```
设置用户名和密码，并把用户名和密码保存到指定文件中：
htpasswd -c 密码文件保存路径 用户名
htpasswd -c /etc/nginx/conf.d/passwd.db hbhs
若该命令成功则会让其输入两遍密码。
```

### 三、查看密码文件

```
cat /etc/nginx/conf.d/passwd.db
显示hbhs:$apr1$/ToVEbrO$vejTUiS6UTDVIVGZBMDhJ/
其中hbhs是用户名，分号后面就是密码（密码已经加过密）
```

### 四、修改配置文件拦截站点或请求

```
找到nginx配置文件所在位置文件中server中location添加：
密码提示语｜密码文件路径
auth_basic "Username and Password are required";
auth_basic_user_file /etc/nginx/conf.d/passwd.db;

需要对server限制访问也可加在server模块
```

### 五、重启nginx并验证是否访问受限

```
验证配置文件是否正确
nginx -t
重启服务
nginx -s reload
```



## 以openssl为例：

nginx服务器上一般自带了 openssl

### 一、新建 passwd文件

```
在nignx的conf目录,通过以下命令新建 passwd密码文件
用户名为 test，密码为 abcd123456

echo -n "test:" > passwd
openssl passwd abcd123456 >> passwd
```

### 二、修改nginx配置文件

```
找到nginx配置文件所在位置文件中server中location添加：
密码提示语｜密码文件路径
auth_basic "Username and Password are required";
auth_basic_user_file /nginx-1.12.2/conf/passwd;

需要对server限制访问也可加在server模块
```

### 三、重启nginx并验证是否访问受限

```
验证配置文件是否正确
nginx -t
重启服务
nginx -s reload
```

