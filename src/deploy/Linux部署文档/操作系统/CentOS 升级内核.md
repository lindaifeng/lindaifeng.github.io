---
title: CentOS 升级内核
categories: 
  - Linux
tags: 
  - centos
order: 1
---



# CentOS 升级内核的三种方式(yum/rpm/源码)

> 在 CentOS 使用过程中，难免需要升级内核，但有时候因为源码编译依赖问题，不一定所有程序都支持最新内核版本，所以以下将介绍三种升级内核方式。

### 注意事项

```
关于内核种类:
kernel-ml 中的ml是英文【 mainline stable 】的缩写，elrepo-kernel中罗列出来的是最新的稳定主线版本。
kernel-lt 中的lt是英文【 long term support 】的缩写，elrepo-kernel中罗列出来的长期支持版本。
```


```bash
# 检查内核版本
uname -r
```

## 一、yum安装

### 1、导入仓库源

```
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org

rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
```

### 2、查看可安装的软件包

```
yum --enablerepo="elrepo-kernel" list --showduplicates | sort -r | grep kernel-ml.x86_64
```

### 3、选择 ML 或 LT 版本安装

无指定版本默认安装最新

```
# 安装 ML 版本
yum --enablerepo=elrepo-kernel install  kernel-ml-devel kernel-ml -y   

# 安装 LT 版本，K8S全部选这个
yum --enablerepo=elrepo-kernel install kernel-lt-devel kernel-lt -y
```

### 4、查看现有内核启动顺序

```
awk -F\' '$1=="menuentry " {print $2}' /etc/grub2.cfg
```

### 5、修改默认启动项

xxx 为序号数字，以指定启动列表中第x项为启动项，x从0开始计数

```
grub2-set-default xxxx
```

**例如设置以4.4内核启动**

则直接输入“grub2-set-default 0”，下次启动即可从4.4启动

```
# 查看内核启动序号
[root@localhost ~] awk -F\' '$1=="menuentry " {print $2}' /etc/grub2.cfg

CentOS Linux (4.4.179-1.el7.elrepo.x86_64) 7 (Core)

CentOS Linux (3.10.0-693.el7.x86_64) 7 (Core)

CentOS Linux (0-rescue-6d4c599606814867814f1a8eec7bfd1e) 7 (Core)


# 设置启动序号
[root@localhost ~] grub2-set-default 0

# 重启
reboot

# 检查内核版本
uname -r
```



## 二、RPM安装

检查内核版本

```
uname -r
```



### 1、查找版本

因 ELRepo 源都是最新版本，所以旧版本内核只能手动下载。

查找 kernel rpm 历史版：

http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/

### 2、共需要下载三个类型 rpm

```
wget http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-devel-4.4.215-1.el7.elrepo.x86_64.rpm
wget http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-headers-4.4.215-1.el7.elrepo.x86_64.rpm
wget http://mirrors.coreix.net/elrepo-archive-archive/kernel/el7/x86_64/RPMS/kernel-lt-4.4.215-1.el7.elrepo.x86_64.rpm
```

### 3、安装内核 

```
rpm -ivh kernel-lt-4.4.215-1.el7.elrepo.x86_64.rpm
rpm -ivh kernel-lt-devel-4.4.215-1.el7.elrepo.x86_64.rpm
或者
#一键安装所有
rpm -Uvh *.rpm
```

### 4、确认已安装内核版本

```
[root@localhost ~]# rpm -qa | grep kernel
kernel-headers-3.10.0-1160.15.2.el7.x86_64
kernel-devel-3.10.0-1160.49.1.el7.x86_64
kernel-tools-libs-3.10.0-957.el7.x86_64
kernel-3.10.0-957.el7.x86_64
kernel-ml-4.9.9-1.el7.elrepo.x86_64
kernel-lt-4.4.215-1.el7.elrepo.x86_64
kernel-tools-3.10.0-957.el7.x86_64
kernel-lt-devel-4.4.215-1.el7.elrepo.x86_64
```

### 5、设置启动

```
# 查看启动顺序
[root@localhost ~]# awk -F\' '$1=="menuentry " {print $2}' /etc/grub2.cfg
CentOS Linux (4.4.215-1.el7.elrepo.x86_64) 7 (Core)
CentOS Linux (4.9.9-1.el7.elrepo.x86_64) 7 (Core)
CentOS Linux (3.10.0-957.el7.x86_64) 7 (Core)
CentOS Linux (0-rescue-b91f945269084aa98e8257311ee713c5) 7 (Core)

# 设置启动顺序
[root@localhost ~]# grub2-set-default 0

# 重启生效
[root@localhost ~]# reboot
```

## 三、源码安装

### 1、安装核心软件包

```
yum install -y gcc make git ctags ncurses-devel openssl-devel
yum install -y bison flex elfutils-libelf-devel bc
```

### 2、创建内核编译目录

使用 `home` 下的 `kernelbuild` 目录

```
mkdir ~/kernelbuild
```

### 3、获取内核源码

> 清华大学镜像站：https://mirror.tuna.tsinghua.edu.cn/kernel/v4.x/?C=M&O=D
>
> 其他源码安装包下载地址：https://mirrors.edge.kernel.org/pub/linux/kernel/
>
> - `linux-4.xx.xx.tar.xz`
> - `linux-4.xx.xx.tar.gz`
> - 这两个格式都可以的，tar.xz压缩率更高，文件更小。

```
在线下载：wget https://mirror.tuna.tsinghua.edu.cn/kernel/v4.x/linux-4.17.11.tar.xz
```

### 4、解压内核代码

将其解压后进入源码目录:

```
tar -xvJf linux-4.17.11.tar.xz
```

为确保内核树绝对干净，进入内核目录并执行 make mrproper 命令:

```
cd linux-4.17.11
make clean && make mrproper
```

### 5、内核配置

复制当前的内核配置文件

`config-3.10.0-862.el7.x86_64`是我当前环境的内核配置文件，根据实际情况修改

```
cp /boot/config-3.10.0-862.el7.x86_64 .config
```

> #### 高级配置
>
> y 是启用, n 是禁用, m 是需要时启用.
> `make menuconfig`: 老的 ncurses 界面，被 nconfig 取代
> `make nconfig`: 新的命令行 ncurses 界面

### 6、编译和安装

#### 编译内核

```
如果你是四核的机器，x可以是8
make -j x
```

#### 安装内核

编译完内核后安装:**Warning: 从这里开始，需要 root 权限执行命令，否则会失败.**

```
make modules_install install
```

### 7、设置启动

```
# 查看启动顺序
[root@localhost ~]# awk -F\' '$1=="menuentry " {print $2}' /etc/grub2.cfg
CentOS Linux (4.17.11-1.el7.elrepo.x86_64) 7 (Core)
CentOS Linux (4.9.9-1.el7.elrepo.x86_64) 7 (Core)
CentOS Linux (3.10.0-957.el7.x86_64) 7 (Core)
CentOS Linux (0-rescue-b91f945269084aa98e8257311ee713c5) 7 (Core)

# 设置启动顺序
[root@localhost ~]# grub2-set-default 0

# 重启生效
[root@localhost ~]# reboot
```

## 四、卸载 / 降级 内核

> 例如:
>
> 当系统已存在 LT 内核的 5.4.103 版本时，继续安装 LT 内核的 4.4.215 版本则会提示: `package kernel-lt-5.4.103-1.el7.elrepo.x86_64 (which is newer than kernel-lt-4.4.215-1.el7.elrepo.x86_64) is already installed`
>
> 这时就需要进行内核降级，卸载最新版的内核。

### 1、查看系统当前内核版本

```
[root@localhost ~]# uname -r
5.4.103-1.el7.elrepo.x86_64
```

### 2、查看系统中全部内核

```
[root@localhost ~]# rpm -qa | grep kernel
kernel-headers-3.10.0-1160.15.2.el7.x86_64
kernel-devel-3.10.0-1160.49.1.el7.x86_64
kernel-tools-libs-3.10.0-957.el7.x86_64
kernel-3.10.0-957.el7.x86_64
kernel-ml-4.9.9-1.el7.elrepo.x86_64
kernel-lt-5.4.103-1.el7.elrepo.x86_64
kernel-tools-3.10.0-957.el7.x86_64
kernel-lt-devel-5.4.103-1.el7.elrepo.x86_64
```

### 3、删除指定内核

此处以删除 LT 内核的 5.4.103 版本为例

**注意：**无法卸载当前在用的内核版本。卸载完后不一定需要重启

```
yum remove -y kernel-lt-devel-5.4.103-1.el7.elrepo.x86_64

yum remove -y kernel-lt-5.4.103-1.el7.elrepo.x86_64
```

检查卸载后内核版本

```
[root@localhost ~]# rpm -qa | grep kernel
kernel-headers-3.10.0-1160.15.2.el7.x86_64
kernel-devel-3.10.0-1160.49.1.el7.x86_64
kernel-tools-libs-3.10.0-957.el7.x86_64
kernel-3.10.0-957.el7.x86_64
kernel-ml-4.9.9-1.el7.elrepo.x86_64
kernel-tools-3.10.0-957.el7.x86_64
```