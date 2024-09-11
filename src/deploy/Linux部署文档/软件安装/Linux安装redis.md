---
title: Linux安装redis
categories: 
  - Linux
tags: 
  - Redis
order: 13
---

# Redis安装步骤

> 以下是所需软件和服务器版本：
> Redis版本 5.0.4
> 服务器版本 Linux CentOS 7.6 64位
>
> 
>
> 1、查看redis是否在运行： ps aux | grep redis
>
> 2、启动redis：    redis-server redis-conf
>
> 3、重启redis：systemctl restart redis.service
>
> 4、关闭redis：    redis-cli shutdown
>
> 5、当设置密码后，上面的关闭命令无效：带密码输入：    redis-cli -a [password]    
> 回车后输入：shutdown
>
> 即可关闭redis，输入exit 退出。
>
> 6、查看redis密码；可查看 redis 安装根目录下的配置文件：redis-conf 中SECURITY下面的 requirepass 后面的内容

## 一、下载redis软件
先进入官网找到下载地址下载redis安装包： [https://redis.io/download](https://redis.io/download)
通过xshell软件连接到远程服务器输入rz命令把安装包上传到linux服务器
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015133833544.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center)
或者服务器自动下载：进入到Xshell控制台(默认当前是root根目录)，输入wget 将上面复制的下载链接粘贴上，如下命令:

```bash
wget http://download.redis.io/releases/redis-5.0.7.tar.gz
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020101513400512.png#pic_center)
等待下载完成。

## 二、解压并安装Redis
 下载完成后需要将压缩文件解压，输入以下命令解压到当前目录
```bash
tar -zvxf redis-5.0.7.tar.gz
```
解压后在根目录上输入ls 列出所有目录会发现与下载redis之前多了一个redis-5.0.7.tar.gz文件和 redis-5.0.7的目录。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015134252170.png#pic_center)

## 三、移动redis目录
一般都会将redis目录放置到 /usr/local/redis目录，所以这里输入下面命令将目前在/root目录下的redis-5.0.7文件夹更改目录，同时更改文件夹名称为redis。

```bash
mv /root/redis-5.0.7 /usr/local/redis
```

cd 到/usr/local目录下输入ls命令可以查询到当前目录已经多了一个redis子目录，同时/root目录下已经没有redis-5.0.7文件夹

```bash
cd /usr/local/
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015134423999.png#pic_center)

## 四、编译
cd到/usr/local/redis目录，输入命令make执行编译命令，接下来控制台会输出各种编译过程中输出的内容。

```bash
cd /usr/local/redis
```
```bash
make
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015134554481.png#pic_center)

## 五、安装
输入以下命令

```bash
make PREFIX=/usr/local/redis install
```

> 这里多了一个关键字 PREFIX= 这个关键字的作用是编译的时候用于指定程序存放的路径。比如我们现在就是指定了redis必须存放在/usr/local/redis目录。
>
> 假设不添加该关键字Linux会将可执行文件存放在/usr/local/bin目录，库文件会存放在/usr/local/lib目录。配置文件会存放在/usr/local/etc目录。其他的资源文件会存放在usr/local/share目录。这里指定号目录也方便后续的卸载，后续直接rm -rf /usr/local/redis 即可删除redis。


![在这里插入图片描述](https://img-blog.csdnimg.cn/2020101513464696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center)

## 六、启动redis
根据上面的操作已经将redis安装完成了。在目录/usr/local/redis 输入下面命令启动redis

```bash
./bin/redis-server& ./redis.conf
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015134723379.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center)
**Redis到这里已经启动完毕。**
我们可以ctrl+c退出后，查看进程redis检查后台进程是否正在运行有两种方式：

1.1 采取查看进程方式
```bash
ps -ef |grep redis
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015135259717.png#pic_center)
1.2 采取端口监听查看方式（redis默认端口是6379）

```bash
netstat -lanp | grep 6379
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015155426260.png#pic_center)

检查到redis服务正在运行，我们就可以启动redis客户端进入redis了
使用`redis-cli`客户端检测连接是否正常（注意redis-cli在redis/bin目录下，需要切换到该目录下才能启动，注意自己所处的目录）
```bash
./bin/redis-cli
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015155639458.png#pic_center)

2、如果检查到我们redis服务没有开启我们可以设置守护进程后台运行的方式将配置文件中的daemonize设置为yes，将protected-mode设置为no。

> 这里我要将daemonize改为yes，不然我每次启动都得在redis-server命令后面加符号&，不这样操作则只要回到Linux控制台则redis服务会自动关闭，
> 同时也将bind注释，将protected-mode设置为no。
> 这样启动后我就可以在外网访问了。


修改方式（进入配置文件）
```bash
vim /usr/local/redis/redis.conf
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/080dcc104b814108bfa2a01e397b3616.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA44CG5riF5bOw44Sf,size_20,color_FFFFFF,t_70,g_se,x_16)


## 七、redis.conf配置文件讲解

在目录/usr/local/redis下有一个redis.conf的配置文件。我们上面启动方式就是执行了该配置文件的配置运行的。我么可以通过cat、vim、less等Linux内置的读取命令读取该文件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015155227964.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center)



**设置Redis密码：**
1、打开redis.conf，

```
查找requirepass foobared（Esc ：/requirepass foobared）,
```

把前面的；去掉，

2、将foobared改成自己的密码，

```
例如：requirepass 1234546
```

3、重启后，进入cli

```
redis-cli
```

4、进入后输入ping测试，会提示未认证

```
ping
NOAUTH Authentication required
```

 退出后

```
 ./bin/redis-cli -h 127.0.0.1 -p 6379 -a 123456
```
认证进入

```
ping
ok！
```

> 方法二： 查看当前redis有没有设置密码：
> 127.0.0.1:6379> config get requirepass 
>
> 无显示说明没有密码
>
> 那么现在来设置密码：
>
> 127.0.0.1:6379> config set requirepass abcdefg 
>
> OK
> 再次查看当前redis就提示需要密码：
> 127.0.0.1:6379> config get requirepass 
>
> (error) NOAUTH Authentication required.

## 八、常见问题
**1、远程连接问题**
**Java程序连接redis时报错：JedisConnectionException: Failed connecting to host xx.xx.xx.xx:6379**
原因：
1）机器之间网络无法联通
进入redis输入ping命令如果返回pong则网络通畅，反之则是网络不通
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201012113135804.png#pic_center)

2）ip和端口号不正确
检查redis.conf配置文件中的ip和端口是否一致

3）虚拟机中防火墙的原因（可能性较大）

> 1）连接不上可能是防火墙拒绝了本地连接请求，关闭防火墙即可，可以但不安全当然开发时可以这样关（unbantu系统指令，其他系统指令不同）
> 1、查看防火墙状态：
> sudo ufw status
> 2、关闭防火墙：
> sudo ufw disable
> 3、开启防火墙：
> sudo ufw enable
>
> 2）安全一点的方法就是修改防火墙规则，如需远程连接redis，需配置redis端口6379在linux防火墙中开放，代码如下：
> 1编辑防火强配置文件 
> vim /etc/sysconfig/iptables
> 2 添加一行:
> -A INPUT -m state --state NEW -m tcp -p tcp --dport 6379 -j ACCEPT
> 3 重启服务:
> service iptable

4）服务器端的redis.config配置问题
1.redis.conf 中bind 127.0.0.1 未用#注释掉（未注释默认只接收本机访问）
2.protected-mode no 守护进程设置no
3.daemonize yes 作为守护进程运行yes

5）服务器的防火墙问题（没有放开redis端口）
如：阿里云服务器配置实例安全组
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201011224233245.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center)

**2、持久化问题**
**Java程序连接redis时报错：MISCONF Redis is configured to save RDB snapshots, but is currently not able to persist on disk. Commands that may modify the data set are disabled. Please check Redis logs for details about the error**

意思是说redis配置了RDB存储快照，但是当前不能持久化到磁盘disk。即：强制关闭Redis快照导致不能持久化！！！！究其原因是因为强制把redis快照关闭了导致不能持久化的问题，在网上查了一些相关解决方案，通过stop-writes-on-bgsave-error值设置为no即可避免这种问题。

```bash
有两种修改方法，一种是通过redis命令行修改，另一种是直接修改redis.conf配置文件
1、命令行修改方式示例：
127.0.0.1:6379> config set stop-writes-on-bgsave-error no

2、修改redis.conf文件：vi打开redis-server配置的redis.conf文件，然后使用快捷匹配模式：/stop-writes-on-bgsave-error定位到stop-writes-on-bgsave-error字符串所在位置，接着把后面的yes设置为no即可。

修改完后需要重启redis服务
重启redis：systemctl restart redis.service
```

**但上方的方法治标不治本，下面采用直接修改内核参数的方式
配置优化，添加以下配置项到/etc/sysctl.conf配置文件：**
```bash
cat /etc/sysctl.conf //查看配置文件信息
vim /etc/sysctl.conf	//编辑配置信息
vm.overcommit_memory = 1 //加入该行代码
sysctl vm.overcommit_memory=1 //执行该命令使其实时生效
```