---
title: Centos7挂载硬盘
categories: 
  - Linux
tags: 
  - centos
order: 2
---

# Centos7挂载硬盘

新添加的一块硬盘，怎么加入到文件系统呢？其实简单几步就可以实现。

1、进入系统后使用命令fdisk -l或者lsblk，查看到的/dev/sdb就是新增加的磁盘

![centos7下怎样挂载硬盘](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230424091628.jpg)

2、使用命令mkfs.ext4 /dev/sdb格式化新添加的磁盘

![centos7下怎样挂载硬盘](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230424091729.jpg)

3、使用命令mkdir /mydata创建一个目录，然后使用命令mount /dev/sdb /mydata把磁盘挂载到这个目录就可以使用了，可以通过命令lsblk查看使用信息。

![centos7下怎样挂载硬盘](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230424091739.jpg)