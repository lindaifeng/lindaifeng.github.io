---
title: Rsync定时同步+异地备份
categories: 
  - Linux
tags: 
  - rsync
order: 5
---



# Rsync定时同步+异地备份

​	**简介：Rsync是unix系统下的一个数据备份工具。可实现本地文件的拷贝，与远程文件的同步传输。**

> 特点：
>
> 1、Rsync安装便捷，使用方便。
>
> 2、传输过程中以压缩解压形式，减少带宽占用。
>
> 3、能更新整个文件数。
>
> 4、安全，能用 rsh、ssh 或直接端口做为传输端口，或者 socket 连接。
>
> 5、亮点是免费。

​	简单来讲Rcync的目的是实现两台主机上的文件同步。（包括本机推送远程文件，远程拉取本机文件两种方式）

​	嗯哼，两台主机的文件同步这就涉及到了，源服务器和目标服务器了。

以你要同步的文件为基准，要同步的文件在A服务器，A服务器就作为源服务器。B服务器就是目标服务器。

​	**理解了主次，需求就来了：我们需要将A服务器上的某个文件，同步到B服务器上的某个文件夹下，如何实现？**

​	

​	以Centos为例：

1、输入rsync，查看系统是否安装了该工具。

2、没有安装则手动安装。

```
yum install rsync -y
```

**扩展**

rsync具有本地文件拷贝功能。

本地文件同步类似拷贝命令cp，将a文件夹同步到b文件夹

```
rsync -源文件夹 源路径  目标路径
rsync -a /tmp/a/  /tmp/b
```

参数：-a存档  -av存档并去重



### 一、以ssh ip直连的方式实现文件同步。

![image-20210817163014388](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817163014388.png)

以ssh方式连接需要密码：

```
rsync -av -e "ssh -p 端口号" 源文件夹  目标用户@目标ip:目标文件夹（将a文件夹的文件同步到c文件夹下）
rsync -av -e "ssh -p 22" /tmp/a/  root@192.168.241:/tmp/c
```

### 二、以模块组件方式实现文件同步。

Rsync可以作为一个服务器，同其他Rsync组件进行远程连接

在源服务器上安装好Rsync后，启动

```
yum -y install rsync xinetd
两种启动方式：
(1)独立启动 /usr/bin/rsync –-daemon
(2)用xinetd超级进程启动/etc/rc.d/init.d/xinetd reload

扩展：
rsync默认端口：837
/usr/bin/rsync --daemon  --config=/etc/rsyncd/rsyncd.conf 　#--config用于指定rsyncd.conf的位置,如果在/etc下可以不写
```

**1、不受密码保护的方式**

1）写入配置文件：

```
#创建 rsyncd.conf，这是 rsync 服务器的配置文件
vi /etc/rsyncd.conf 

#模块名
[mag_sync]
#源文件路径
path = /usr/local/mongodb/data/auditLog
是否允许客户端可以查看可用模块列表，默认为可以
list = yes
#是否只读
read only = no
#忽略错误
ignore errors

```

2）查看模块  rsync 124.71.8.140::

3）查看模块下绑定文件夹中的文件 rsync 124.71.8.140::mag_sync

4）拉取模块下绑定的文件夹到目标文件夹下  rsync -av 124.71.8.140::mag_sync  /root/data/mongologs/

![image-20210817100515149](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817100515149.png)

可以看到文件同步完毕

**2、受密码保护的方式**

1）修改配置文件

```
#用户
uid = root 
#用户组
gid = root
#日志文件路径
log file = /var/log/rsyncd.log
secrets file = /etc/rsyncd/rsyncd.secrets
#模块名
[mag_sync]
#源文件路径
path = /usr/local/mongodb/data/auditLog
是否允许客户端可以查看可用模块列表，默认为可以
list = yes
#是否只读
read only = no
#忽略错误
ignore errors
#认证用户
auth users =root
```

2）添加密码：vi /etc/rsyncd/rsyncd.secrets

用户名:密码

![image-20210817170139997](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817170139997.png)

3）给权限

```
chmod 600 /etc/rsyncd/rsyncd.secrets
```

4）测试（目标服务器连接时需要密码输入）

rsync root@124.71.8.140::mag_sync

![image-20210817102358753](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817102358753.png)

3、目标服务器调用源服务器拉取文件，自动获取密码配置

1）在目标服务器保存密码

```
vi /etc/rsync.password

Zz@1qaz2wsx
```

2）给权限:

```
chmod 600 /etc/rsync.password
```

3）拉取源文件

```
远程调用：rsync --password-file=密码存放路径 用户名@源服务器ip::模块名 要保存在哪个文件夹路径下
rsync -av --password-file=/etc/rsync.password root@124.71.8.140::mag_sync /root/data/mongologs/
```



### 三、定期实现文件同步

​	**需求：让rsync 客户端自动与服务器同步数据**

​	思路：

​	1、编写一个拉取源文件的脚本。（rsync）

​	2、开一个定时任务，定期执行该脚本。（cron 系统调度进程）

​	**crontab命令用于设置周期性被执行的指令**。该命令从标准输入设备读取指令，并将其存放于“crontab”文件中，以供之后读取和执行。

​	1、检查是否安装了crontab，如果提示未安装请自行安装

```
rpm -qa | grep crontab

#vixie-cron软件包是cron的主程序； 
#crontabs软件包是用来安装、卸装、或列举用来驱动 cron 守护进程的表格的程序。
yum install  vixie-cron
yum install  crontabs  (centos安装指令)

#安装完以后开启crontab服务
service crond start
```

> service crond start //启动服务 
> service crond stop //关闭服务 
> service crond restart //重启服务 
> service crond reload //重新载入配置
>
> 查看crontab服务状态：service crond status 



​	2、新增调度任务可用两种方法： 

​	先新建一个脚本文件：

```
vi /root/data/pulllog.sh
rsync -av --password-file=/etc/rsync.password root@124.71.8.140::mag_sync /root/data/mongologs/

默认创建的这个sh问件是没有执行权限的，修改权限
chmod 777 pulllog.sh
```



```
分  时 天 月 星期  以root用户身份来运行  执行的脚本路径
*   *  *  *  *     root              /root/data/pulllog.sh
```

​	1)、在命令行输入: crontab -e 然后添加相应的任务，wq存盘退出。

![image-20210817171925808](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817171925808.png) 

​	2)、直接编辑/etc/crontab 文件，即vi /etc/crontab，添加相应的任务。 

![image-20210817172033045](https://gitee.com/lindaifeng/my-images/raw/master/img/image-20210817172033045.png)

> crontab -e配置是针对某个用户的，而编辑/etc/crontab是针对系统的任务 
> 查看调度任务 
> crontab -l //列出当前的所有调度任务 
> crontab -l -u jp //列出用户jp的所有调度任务 
>
> crontab -r //删除所有任务调度工作 

​	3）查看调度任务 

```
crontab -l
```

​	没有的话重启服务

```
service crond restart
```

​	如果有错，Linux会在执行的时候发送一份邮件给你

```
cat /var/spool/mail/root
```



至此文件定期执行脚本拉取源文件同步到新文件夹中就实现了