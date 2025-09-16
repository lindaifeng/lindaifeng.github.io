# RocketMQ常用命令

本文档整理了RocketMQ消息队列日常使用中最常用和实用的命令，按照功能分类，方便学习和查阅。
## 一、RocketMQ服务管理

### 1. 启动RocketMQ服务

```shell
# 启动NameServer
nohup sh mqnamesrv &

# 启动Broker
nohup sh mqbroker -n localhost:9876 &

# 启动Broker并指定配置文件
nohup sh mqbroker -n localhost:9876 -c ../conf/broker.conf &

# 启动Broker并自动创建Topic
nohup sh mqbroker -n localhost:9876 autoCreateTopicEnable=true &
```

### 2. 停止RocketMQ服务

```shell
# 停止Broker
sh mqshutdown broker

# 停止NameServer
sh mqshutdown namesrv

# 查看RocketMQ进程
ps -ef | grep mq

# 强制杀死RocketMQ进程
kill -9 进程ID
```

## 二、RocketMQ集群管理

### 1. 集群信息查看

```shell
# 查看集群信息
sh mqadmin clusterList -n localhost:9876

# 查看Broker信息
sh mqadmin brokerStatus -n localhost:9876

# 查看Topic信息
sh mqadmin topicList -n localhost:9876

# 查看消费者组信息
sh mqadmin consumerProgress -n localhost:9876
```

### 2. Topic管理

```shell
# 创建Topic
sh mqadmin updateTopic -n localhost:9876 -t Topic名称 -c 集群名称

# 删除Topic
sh mqadmin deleteTopic -n localhost:9876 -t Topic名称

# 查看Topic详细信息
sh mqadmin topicStatus -n localhost:9876 -t Topic名称
```

### 3. 消费者组管理

```shell
# 查看消费者组详细信息
sh mqadmin consumerProgress -n localhost:9876 -g 消费者组名称

# 删除消费者组
sh mqadmin deleteSubGroup -n localhost:9876 -g 消费者组名称 -b Broker地址
```

## 三、RocketMQ消息管理

### 1. 消息发送与消费

```shell
# 发送测试消息
sh mqadmin sendMessage -n localhost:9876 -t Topic名称 -p "测试消息内容"

# 消费消息
sh mqadmin consumeMessage -n localhost:9876 -t Topic名称 -g 消费者组名称
```

### 2. 消息查询

```shell
# 根据消息ID查询消息
sh mqadmin queryMsgById -n localhost:9876 -i 消息ID

# 根据Topic和时间范围查询消息
sh mqadmin queryMsgByOffset -n localhost:9876 -t Topic名称 -b Broker地址 -i 队列ID -o 偏移量
```

## 四、RocketMQ配置管理

### 1. Broker配置

```shell
# 查看Broker配置
sh mqadmin getBrokerConfig -n localhost:9876 -b Broker地址

# 更新Broker配置
sh mqadmin updateBrokerConfig -n localhost:9876 -b Broker地址 -k 配置项 -v 配置值
```

### 2. 集群配置

```shell
# 查看集群配置
sh mqadmin getClusterConfig -n localhost:9876

# 更新集群配置
sh mqadmin updateClusterConfig -n localhost:9876 -k 配置项 -v 配置值
```

## 五、RocketMQ监控与统计

### 1. 性能监控

```shell
# 查看Broker统计信息
sh mqadmin statsAll -n localhost:9876

# 查看Topic统计信息
sh mqadmin statsTopic -n localhost:9876 -t Topic名称
```

### 2. 日志查看

```shell
# 查看NameServer日志
tail -f ~/logs/rocketmqlogs/namesrv.log

# 查看Broker日志
tail -f ~/logs/rocketmqlogs/broker.log

# 查看特定错误日志
grep "ERROR" ~/logs/rocketmqlogs/broker.log
```

## 六、RocketMQ高级功能

### 1. 消息轨迹

```shell
# 启用消息轨迹
sh mqadmin updateTopic -n localhost:9876 -t Topic名称 -c 集群名称 -e true

# 查询消息轨迹
sh mqadmin queryMsgTrace -n localhost:9876 -i 消息ID
```

### 2. 访问控制

```shell
# 创建访问控制配置
sh mqadmin updateAclConfig -n localhost:9876 -c 集群名称 -a 访问密钥 -s 密钥密文

# 删除访问控制配置
sh mqadmin deleteAccessConfig -n localhost:9876 -c 集群名称 -a 访问密钥
```

## 七、RocketMQ故障排查

### 1. 常见问题诊断

```shell
# 检查NameServer是否正常运行
netstat -tlnp | grep 9876

# 检查Broker是否正常运行
netstat -tlnp | grep 10911

# 查看JVM内存使用情况
jstat -gc 进程ID

# 查看线程信息
jstack 进程ID
```

### 2. 性能调优

```shell
# 调整Broker JVM参数
export JAVA_OPT=" -server -Xms512m -Xmx512m -Xmn256m"

# 调整NameServer JVM参数
export NAMESRV_JAVA_OPT=" -server -Xms256m -Xmx256m"
```