---
title: Linux docker安装skywalking
categories: 
  - Docker
tags: 
  - skywalking
order: 4
---



# Skywalking + ES + Docker

> 搭建 elasticsearch集群 及 kibana
>
> https://blog.csdn.net/qq_43692950/article/details/122834930

Skywalking详细解读参考：[Skywalking应用实战 Agent探针、Rocketbot以及告警](https://www.cnblogs.com/jiagooushi/p/16381838.html)

https://www.cnblogs.com/jiagooushi/archive/2022/06/16/16381838.html

> Skywalking跟ES版本需要适配
>
> 比如目前我用的版本是：
>
> **版本对应关系**
>
> apache/skywalking-ui:8.6.0
>
> apache/skywalking-oap-server:8.6.0
>
> #agent:8.6.0不能用没有字体库，某些业务场景下会报错
>
> apache/skywalking-java-agent:8.6.0
>
> **方案一：**
>
> #升级版本
>
> apache/skywalking-java-agent:8.9.0-java8
>
> **方案二：**
>
> #自定义镜像，源码编译agent:8.6.0将orecleJDK打进去





# skywalking 组件关系及部署

### 1、skywalking由三个部分组成

```shell
skywalking-collector:链路数据归集器，数据可以落地ElasticSearch/H2
skywalking-ui:web可视化平台，用来展示落地的数据
skywalking-agent:探针，用来收集和发送数据到归集器
```

### 2、配置关系

```shell
1, skywalking-oap 有两个端口暴露
2, 11800 ：grpc协议  用于agent上传数据
3, 12800 ：rset协议  用于与skywalking-ui通信，skywalking-ui配置SW_OAP_ADDRESS时 要注意填写12800端口
```

### 一、kubesphere创建oap

创建无状态服务

#### 1、填写镜像路径

#### 2、使用默认端口

![image-20220826100411131](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090552.png)

#### 3、填写环境变量,设置数据源

选择es数据源（不设置收集的数据源默认保存至h2数据库）

```
env:
- name: JVM
value: '-Xms256m -Xmx256m'
- name: SW_STORAGE
value: elasticsearch7
- name: SW_STORAGE_ES_CLUSTER_NODES
value: 'xxx.xxx.xxx:9200'
```

![image-20220902173454914](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090558.png)



### 二、kubesphere创建UI

#### 1、填写镜像路径

#### 2、使用默认端口

#### 3、填写环境变量,连接oap

oap的dns地址

```
//oap连接服务端口：12800
SW_OAP_ADDRESS:skywalking-oap-server.test5:12800
```

![image-20220826154758399](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090606.png)

![image-20220826140418379](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090613.png)

#### 4、访问页面：

```
ip+端口8080
```

skywalking懒加载，初次访问时，看不到监控数据，需要访问服务接口后，skywalking才会加载数据



### 三、项目配置

dockfile文件基础镜像使用skywalking-jdk

```
#设置镜像基础，jdk8
#FROM java:8
FROM xxx.xxx.xxx.xxx:8080/common/skywalking-java-agent:8.6.0-jdk8-me
#维护人员信息
MAINTAINER hetao
#设置镜像对外暴露端口
EXPOSE 10013
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#将当前 target 目录下的 jar 放置在根目录下，命名为 app.jar，推荐使用绝对路径。
ADD target/devops-sign.jar /devops-sign.jar
#执行启动命令
ENTRYPOINT java ${JVM:=-Xms2048m -Xmx2048m} -Djava.security.egd=file:/dev/./urandom -jar /devops-sign.jar
```

项目yml文件中配置oap环境变量-连接skywalking

```shell
# 配置oap连接地址
- name: SW_AGENT_COLLECTOR_BACKEND_SERVICES
value: 'skywalking-oap-server.test5:11800'
# 配置服务名称
- name: SW_AGENT_NAME
value: devops-cloud-gateway
```

![image-20220826163627042](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090621.png)



### 四、自定义镜像

在项目接入中遇到问题二，抛弃官方提供的镜像，选择自定义skywalking-agent镜像

#### **1、下载对应版本skywalking-agent**

#### **2.、编写Dockerfile**

**方法一：通过源码编译agent**

```dockerfile
//Dockerfile
#OracleJDK1.8基础镜像
FROM java:8
#将编译构建得到的jar文件复制到镜像空间中
COPY agent/ /skywalking/agent/
#执行工作目录
WORKDIR /
#skywalking-agent环境变量,指定jar路径
ENV JAVA_TOOL_OPTIONS=-javaagent:/skywalking/agent/skywalking-agent.jar
```

**方法二：通过基础镜像base引用agent目录**(项目中用workflow有点问题)

```dockerfile
#定义skywalking-base基础镜像版本
ARG version='8.6.0'
#定义jdk基础镜像版本
ARG BASE_IMAGE='java:8'
#skywalking-base基础镜像引用
FROM apache/skywalking-base:${version}-es7 AS build
#jdk基础镜像引用
FROM $BASE_IMAGE
#作者
LABEL maintainer="ldf"
#skywalking-agent环境变量,指定jar路径
ENV JAVA_TOOL_OPTIONS=-javaagent:/skywalking/agent/skywalking-agent.jar
#指定工作目录
WORKDIR /skywalking
#添加文件,添加引用镜像中的agent目录到自定义镜像工作空间中
COPY --from=build /skywalking/agent /skywalking/agent
```

#### **3、构建自定义镜像**

```shell
#打包镜像文件
docker build -t skywalking-java-agent:8.6.0-java8-me -f Dockerfile .
```

**启动项目后出现下图中找到agent.config配置文件即接入成功。**

![image-20220902145433470](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090629.png)

### 五、问题说明：

##### **问题一**

> [docker](https://so.csdn.net/so/search?q=docker&spm=1001.2101.3001.7020) 部署skywalking时，一直报错：`no provider found for module storage`
>
> ###### **原因分析：**
>
> 1. skywalking 8.8之前不能自动感知存储源是什么，需要手动指定是es6还是7；
> 2. 8.8之后可以自动感知存储源的版本，不需要手动指定es6还是7，直接写es即可；
>
> **解决方案：**
>
> 将环境变量指定数据源：SW_STORAGE=elasticsearch7`改为`SW_STORAGE=elasticsearch`

##### **问题二**

> ##### JDK字体类初始化异常问题：java.lang.NoClassDefFoundError: Could not initialize class sun.font.SunFontManager
>
> **原因分析：**
>
> skywalking官方提供的agent镜像中jdk采用的是OpenJDK，而OpenJDK在1.7之后不包含字体库，在poi导出业务中存在报这种错误
>
> OpenJDK比OracleJDK简化了一些功能，openjdk不包含字体库
>
> **解决方案：**
>
> 方法1、有网的环境下把OpenJDK打包成包含fontconfig和字体 ttf-dejavu的镜像
>
> 方法2、升级jdk版本，jdk “1.8.0_332” 请升级成 jdk “1.8.0_333” 或更高的版本
>
> 以上方法由互联网提供，以下是我自己的实践的方案
>
> 1、通过源码编译agent，将OracleJDK打入agent镜像中
>
> 或者
>
> 2、通过基础镜像base引用agent目录，将OracleJDK打入agent镜像中



##### **问题三**

> **超出了GC开销限制：**java.lang.OutOfMemoryError: GC overhead limit exceeded｜ java.lang.OutOfMemoryError: Java heap space
>
> **原因分析：**
>
> 这个是JDK6新添的错误类型。是发生在GC占用大量时间为释放很小空间的时候发生的，是一种保护机制。一般是因为堆太小，导致异常的原因：没有足够的[内存](https://so.csdn.net/so/search?q=内存&spm=1001.2101.3001.7020)。 
>
> Sun 官方对此的定义：超过98%的时间用来做GC并且回收了不到2%的堆内存时会抛出此异常。
>
> **解决方案**：
>
> 方法1，查看项目中是否有大量的死循环或有使用大内存的代码，优化代码。
>
> 方法2，JVM给出这样一个参数：-XX:-UseGCOverheadLimit  禁用这个检查，其实这个参数解决不了内存问题，只是把错误的信息延后，替换成 java.lang.OutOfMemoryError: Java heap space。
>
> 方法3，增大堆内存 set JAVA_OPTS=-server -Xms512m -Xmx1024m -XX:MaxNewSize=1024m -XX:MaxPermSize=1024m
>
> 我采用 增大堆内存的方式将原来的内存增加到了512
>
> env:
>
> name: JVM
> value: '-Xms512m -Xmx512m'



##### **问题四**

> 1、agent的plugins目录是已启用的插件，optional-plugins目录中是可选的插件。
>
> plugins中默认没有springcloud getway插件，不支持监控springcloud gateway网关服务。
>
> 如果当前要部署的服务是springcloud getway网关服务，需要把optional-plugins中的apm-spring-cloud-gateway-2.1.x-plugin-8.2.0.jar拷贝到plugins中。



##### **kubesphere安装|es配置文件**

```shell
 #es配置文件
 #集群名称配置
  cluster.name: my-es
  #节点角色配置
  #node.roles: [ data, master ]
  #网络配置
  network.host: 0.0.0.0
  #集群节点配置
  discovery.type: single-node
  #discovery.seed_hosts: [ "app-es-v1-0.app-es.app.svc.cluster.local:9300" ]
  #集群初始化节点
  #cluster.initial_master_nodes: [ "app-es-v1-0"]
  #绑定客户端访问端口
  http.port: 9200
  #绑定集群间通信端口
  transport.port: 9300
  #安全访问
  xpack.security.enabled: false
  xpack.security.transport.ssl.enabled: false
  #认证
  http.cors.allow-origin: "*"
  http.cors.enabled: true
  http.max_content_length: 200mb
```





## Skywalking操作说明

SkyWalking 逻辑上分为四部分: 探针, 平台后端, 存储和用户界面。

> 探针skywalking-agent收集数据上报给平台后端
>
> 平台后端skywalking-oap存储相关数据
>
> 用户界面skywalking-ui连接平台后端查询数据展示

**操作说明：**

## 1、访问skywalking-ui面板

skywalking属于懒加载，第一次访问不会有数据视图，访问接口后产生相应的数据视图

目前启动了三个服务，可选择相应服务查看对应系统图

**仪表盘：查看服务系统性能**

![image-20220804123724252](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090644.png)

**拓扑图**：系统关联关系结构

![image-20220804124051725](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090650.png)

**链路追踪：接口生命周期跟踪**

![image-20220804124349974](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090657.png)

## 2、访问演示接口

POST 192.168.x.x:31368/system/sysLogin
{
    "userName": "admin",
    "password": "ZZ2022!!",
    "date": 1651146995000
}

GET  192.168.x.x:31368/system/user/listPage

访问后等一小会待数据加载完毕，视图出现，

按时间范围查询接口



接入skywalking

1、下载包

2、编辑配置文件设置存储方式

3、运行访问ui控制台

4、导入jar到项目中（本地可直接引用下载包中的jar）

![image-20220804124637278](http://img.lindaifeng.vip/typora-picgo-tuchaung/20221107090703.png)

## 日志接入

导入依赖

```
<!-- skywalking-->
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-logback-1.x</artifactId>
    <version>8.12.0</version>
</dependency>
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-logback-1.x</artifactId>
    <version>8.12.0</version>
</dependency>
```

创建日志文件 logback.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <jmxConfigurator/>
    <!--    日志打印格式-->
    <property name="log_pattern"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS Z} [%tid] [%thread] %-5level %logger{36}:%line - %msg%n"/>
    <!--    控制台日志-->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout">
                <pattern>${log_pattern}</pattern>
            </layout>
        </encoder>
    </appender>
    <!--    文件日志-->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>./logs/application/server.%d{yyyy-MM-dd}.%i.log.zip</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>15</maxHistory>
            <totalSizeCap>5GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.TraceIdPatternLogbackLayout">
                <pattern>${log_pattern}</pattern>
            </layout>
        </encoder>
    </appender>

    <!-- skywalking grpc 日志收集 8.4.0版本开始支持 -->
    <appender name="grpc-log" class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.log.GRPCLogClientAppender">
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.mdc.TraceIdMDCPatternLogbackLayout">
                <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%tid] [%thread] %-5level %logger{36} -%msg%n</Pattern>
            </layout>
        </encoder>
    </appender>

    <logger name="org.springframework" additivity="false">
        <level value="info"/>
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="FILE"/>
        <appender-ref ref="grpc-log"/>
    </logger>

    <root level="INFO">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

启动项目可看到[TID:xxxxx]即接入成功

访问控制台日中管理中可看到

