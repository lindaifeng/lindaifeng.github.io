# Linux常用命令大全

本文档整理了Linux系统中最常用和实用的命令，按照功能分类，方便学习和查阅。命令示例简洁明了，并附有必要的注释说明。

## 一、系统信息查看命令

### 1. 基本系统信息
```bash
# 查看系统内核信息
uname -a

# 查看系统版本
lsb_release -a
# 或
cat /etc/redhat-release  # RedHat/CentOS
cat /etc/centos-release  # CentOS

# 查看系统架构（32位/64位）
getconf LONG_BIT

# 查看当前用户环境变量
env

# 查看历史命令
history
```

### 2. CPU和内存信息
```bash
# 查看CPU信息
cat /proc/cpuinfo

# 查看内存使用情况
free -m

# 查看系统整体信息
cat /proc/version
```

### 3. 系统日志查看
```bash
# 查看系统日志
dmesg

# 查看系统操作日志
tail -200f /var/log/messages
```

## 二、文件和目录操作命令

### 1. 基本文件操作
```bash
# 查看当前目录文件
ls -al

# 查看当前目录大小
du -sh *

# 查看目录及子目录大小
du -H -h

# 查看磁盘使用情况
df -h

# 查看磁盘挂载情况
mount
```

### 2. 文件创建、复制、移动
```bash
# 创建目录（级联创建）
mkdir -p /path/to/directory

# 批量创建目录结构
mkdir -p src/{test,main}/{java,resources}

# 复制文件
cp source_file target_file

# 复制并强制覆盖
cp -f source_file target_file

# 复制目录
cp -r source_dir target_dir

# 移动/重命名文件
mv old_name new_name
```

### 3. 文件查找
```bash
# 查找文件
find /path -name "filename"

# 查找后缀为.mysql的文件
find /home/user -name '*.mysql' -print

# 查找最近3天内访问的文件
find /usr -atime 3 -print

# 查找最近5天内修改的文件
find /usr -ctime 5 -print
```

### 4. 文件权限管理
```bash
# 修改文件权限
chmod 755 filename

# 递归修改目录权限
chmod -R 777 directory/

# 修改文件所有者
chown user:user filename
```

### 5. 文件内容查看和处理
```bash
# 查看文件内容
cat filename

# 分页查看文件
less filename

# 实时查看文件末尾内容
tail -f filename

# 查看文件前10行
head filename

# 查看文件后20行
tail -n 20 filename
```

### 6. 文件比较
```bash
# 比较两个文件差异
diff file1 file2

# 去除文件中的特殊字符
sed -i 's/^M//g' filename
```

## 三、压缩和解压缩命令

### 1. tar命令
```bash
# 压缩目录
tar czvf archive.tar.gz directory/

# 解压缩
tar zxvf archive.tar.gz

# 解压到指定目录
tar zxvf archive.tar.gz -C /target/directory/
```

### 2. zip命令
```bash
# 压缩目录
zip -r archive.zip directory/

# 解压缩
unzip archive.zip
```

## 四、进程管理命令

### 1. 查看进程
```bash
# 查看所有进程
ps aux

# 查看进程树
ps auwxf

# 实时查看进程状态
top

# 按CPU使用率排序
top -o %CPU

# 按内存使用率排序
top -o %MEM
```

### 2. 进程控制
```bash
# 查看进程详细信息
ps eww -p PID

# 查看进程启动路径
cd /proc/PID && ls -all

# 强制杀死进程
kill -9 PID

# 根据进程名杀死进程
pkill process_name

# 强制关闭进程名包含xxx的所有进程
ps aux|grep xxx | grep -v grep | awk '{print $2}' | xargs kill -9
```

### 3. 后台运行
```bash
# 后台运行并输出日志
nohup command &

# 后台运行不输出日志
nohup command > /dev/null &

# 后台运行并将错误输出到标准输出
nohup command >out.log 2>&1 &
```

## 五、网络相关命令

### 1. 网络连接查看
```bash
# 查看网络连接
netstat -an

# 查看TCP连接状态
ss -t -a

# 查看UDP连接
ss -u -a

# 查看端口占用情况
lsof -i:port

# 查看什么进程使用了指定端口
netstat -tunlp | grep port
```

### 2. 网络测试
```bash
# 测试网络连通性
ping hostname

# 测试端口连通性
telnet hostname port

# 跟踪网络路由路径
traceroute hostname

# DNS查询
nslookup domain.com
```

### 3. 网络数据传输
```bash
# 远程复制文件
scp file user@host:/path/

# 远程复制目录
scp -r directory/ user@host:/path/

# 从远程下载文件
scp user@host:/path/file ./local_path/
```

### 4. 网络调试
```bash
# 抓包分析
tcpdump -i interface tcp port port_number -s 1500 -w capture.pcap

# 网络连接测试工具
nc -lk port  # 监听端口
nc host port < data.txt  # 发送数据
```

## 六、用户和权限管理

### 1. 用户管理
```bash
# 添加用户
useradd username

# 设置用户密码
passwd username

# 删除用户
userdel username

# 查看当前登录用户
whoami

# 查看登录用户信息
who
```

### 2. 权限配置
```bash
# 配置sudo权限
vim /etc/sudoers

# 强制活动用户退出
pkill -kill -t [TTY]
```

## 七、系统服务管理

### 1. 服务控制
```bash
# 查看服务状态
systemctl status service_name

# 启动服务
systemctl start service_name

# 停止服务
systemctl stop service_name

# 重启服务
systemctl restart service_name

# 设置开机自启
systemctl enable service_name

# 禁止开机自启
systemctl disable service_name
```

### 2. 网络服务
```bash
# 重启网络服务
systemctl restart network

# 或者
/etc/init.d/network restart
```

## 八、定时任务

### 1. crontab命令
```bash
# 编辑定时任务
crontab -e

# 查看定时任务
crontab -l

# 删除定时任务
crontab -r

# 启动crond服务
systemctl start crond

# 设置crond开机自启
systemctl enable crond
```

## 九、系统时间管理

### 1. 时间同步
```bash
# 安装时间同步工具
yum install -y ntpdate

# 同步时间
ntpdate -u ntp.api.bz

# 或者同步阿里云时间
ntpdate -u ntp.aliyun.com
```

## 十、VIM编辑器常用操作

### 1. 基本操作
```bash
# 光标移动
0        # 移到行首
$        # 移到行尾
gg       # 移到文件头
G        # 移到文件尾

# 显示/隐藏行号
:set nu      # 显示行号
:set nonu    # 隐藏行号
```

### 2. 查找和替换
```bash
# 查找内容
/keyword     # 向下查找
?keyword     # 向上查找

# 全局替换
:%s/old/new/g

# 保存只读文件
:w !sudo tee %
```

## 十一、性能监控命令

### 1. 系统性能监控
```bash
# 实时监控系统性能
top

# 查看CPU、内存、磁盘IO统计信息
vmstat 2 1

# 查看磁盘IO情况
iostat -xz 1

# 查看网络吞吐状态
sar -n DEV 1
```

### 2. 内存监控
```bash
# 查看内存使用情况详细信息
free -m

# 查看进程内存使用情况
ps aux | sort -rnk 4 | head -10
```

## 十二、防火墙命令

### 1. firewalld防火墙
```bash
# 启动防火墙
systemctl start firewalld

# 停止防火墙
systemctl stop firewalld

# 查看防火墙状态
systemctl status firewalld
# 或
firewall-cmd --state

# 重新加载配置
firewall-cmd --reload

# 添加端口
firewall-cmd --zone=public --add-port=80/tcp --permanent

# 移除端口
firewall-cmd --zone=public --remove-port=80/tcp --permanent

# 查看开放的端口
firewall-cmd --zone=public --list-ports
```

## 十三、其他实用命令

### 1. 统计命令
```bash
# 统计文件行数
wc -l filename

# 统计文件单词数
wc -w filename

# 统计文件字节数
wc -c filename

# 统计文件最长行字符数
wc -L filename
```

### 2. 管道和重定向
```bash
# 管道操作
command1 | command2

# 重定向输出到文件
command > file

# 追加输出到文件
command >> file

# 重定向的同时输出到屏幕
command | tee file
```

### 3. 系统关机和重启
```bash
# 关机
shutdown -h now

# 重启
shutdown -r now

# 立即重启
reboot
```

## 十四、SSH相关命令

### 1. SSH密钥管理
```bash
# 生成SSH密钥
ssh-keygen -t rsa -C "your_email@example.com"

# 复制公钥到远程服务器
ssh-copy-id user@host
```

### 2. SSH连接
```bash
# SSH连接远程服务器
ssh user@host

# 指定端口连接
ssh -p port user@host
```

以上命令涵盖了Linux系统日常使用中最常用的操作，按照分类整理便于查找和学习。在实际使用中，可以根据具体需求组合使用这些命令。