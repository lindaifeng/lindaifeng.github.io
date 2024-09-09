---
order: 1
title: Linux常用命令

---


## 一、进程相关命令

### 1、查询文件位置：

```
find / -name devops
```

### 2、查看tomcat实时日志：

```
tail -f catalina.out
```

### 3、查看进程及端口(linux/win)：

```
Linux:
ps -ef |grep  进程号/名称 或者 lsof -i:80 
netstat -an | grep 端口号
netstat -tunlp |grep 80

Windows：
查看进程:
netstat -ano|findstr 8080 
杀进程:
taskkill -pid 9380 -f
```



## 二、jar包相关命令

### 1、解压jar包：

（默认解压到当前目录）

```
jar -xvf xxx.jar  
```

### 2、运行jar包

```
nohup java -jar DevOps-Land-Market-0.0.1-SNAPSHOT.jar > devops.log 2>&1 &

外置改端口：
java -jar xxx.jar --server.port=8081
实时监听：
tail -f xxx.log
```

### 3、windows后台运行jar脚本

```
@echo off
start javaw -jar xxxxxxxx-SNAPSHOT.jar
exit
```

### 4、打包上传

```
打包：tar cvf xxx.tar xxx 解压：tar xvf xxx.tar
put D:\Zhongzhi\devops-land-market\target\DevOps-Land-Market-0.0.1-SNAPSHOT.jar
```

### 5、打包下载

xftp 下载 get 文件路径+名称  

 下载到本地路径（默认D:\默认储存位置\NetSarang\Xshell\Sessions或C:\本机\本机\Documents\NetSarang\Xshell\Sessions\）

上传在xftp中put回车即可    

**文件夹下载** 

```
文件夹打包
tar -zcvf xxx.tar xxx  
下载到本地 （yum install lrzsz）
sz xxx.tar
解压：
tar zxvf FileName.tar.gz
压缩：
tar zcvf FileName.tar.gz DirName
```



### 6、查看日志

查看最后五十行日志：

```
tail -n 50 a.log   

 -f（实时监听）
```



## 三、权限相关命令

### 1、赋予所有权限：

```
chmod -R 777
```



## 四、系统相关命令

### 1、查看系统版本：

```
lsb_release -a 或 
cat /proc/version 或
cat /etc/centos-release 或
redhat版本的cat /etc/redhat-release 
查看32还是64：g
etconf LONG_BIT
```



### 2、安装rpm

```
单个安装：rpm -ivh xxx.rpm
一键安装：rpm -Uvh *.rpm --nodeps --force
```



### 3、重启网卡linux

```
systemctl restart network
```



### 4、查看已执行命令历史

```
history
```



### 5、linux同步网络时间

```
yum install -y ntpdate
时间同步命令：
ntpdata time.windows.com
或者
ntpdata ntp.aliyun.com
自动时间同步：
需要配置/etc/crontab文件，实现自动执行任务
让linux从time.windows.com自动同步时间
vi /etc/crontab
加上一句：
00 0 1 * * root ntpdate -s time.windows.com
time.nist.gov 是一个时间服务器.
```



### 6、查看文件大小

```
查看磁盘占用情况 df -h
查看当前文件总大小 du -sh
查看当前文件大小 du -sh * 或者 du -sh /home
```



### 7、linux新建定时任务

```
systemctl enable crond
systemctl start crond
service crond status
crontab -e
crontab -l
```



### 8、查看操作系统日志

```
鉴于上述几点都无法解决，就想到查看Linux系统操作日志(最后200行就可以排查)：
tail -200f /var/log/messages
```



### 9、检测硬盘大小

```
命令 fdisk -l 或 lsblk 
```



### 10、模拟启动一个监听端口

```
nc -lk 8080
```

