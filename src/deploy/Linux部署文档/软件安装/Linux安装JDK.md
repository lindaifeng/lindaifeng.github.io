---
title: Linux安装JDK
categories: 
  - Linux
tags: 
  - jdk
order: 7
---

# Linux环境JDK安装

## 1，切换权限为root

```java
su root
```


## 2，查看版本

```java
java -version
```
[![http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220313.png](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220313.png "http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220313.png")](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220313.png "http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220313.png")
## 3，查看CentOS中自带的JDK

```
rpm -qa | grep java
```

[![http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220327.png](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220327.png "http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220327.png")](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220327.png "http://img.lindaifeng.vip/typora-picgo-tuchaung/20221113220327.png")

## 4，删除红色划线部分

```java
rpm -e --nodeps java-1.7.0-openjdk-1.7.0.191-2.6.15.5.el7.x86_64
rpm -e --nodeps java-1.7.0-openjdk-headless-1.7.0.191-2.6.15.5.el7.x86_64
rpm -e --nodeps java-1.8.0-openjdk-headless-1.8.0.181-7.b13.el7.x86_64
rpm -e --nodeps java-1.8.0-openjdk-1.8.0.181-7.b13.el7.x86_64
```

## 5，检查是否删除成功

```java
java -version 再次查看Java版本，没有任何信息就表示删除成功了
```

## 6，下载JDK

## 7，把JDK上传至CentOS中。

```shell
alt + p
输出上传路径
```

## 8，在根的usr文件夹里面新建一个java文件夹

```shell
mkdir /usr/java
```

## 9，把压缩包拷贝到/usr/java文件夹当中

```shell
cp jdk-8u261-linux-x64.tar.gz 	/usr/java
```

## 10，进入到/usr/java 去解压。

```shell
cd /usr/java
```

```shell
解压：tar -zxvf 压缩包
```

## 11，配置环境变量

```
vim /etc/profile
#到行首
gg
#到行尾
shift+g
```

```
#java environment
export JAVA_HOME=/usr/java/jdk1.8.0_261
export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin
```

## 12，让当前环境变量生效

```java
source /etc/profile
```