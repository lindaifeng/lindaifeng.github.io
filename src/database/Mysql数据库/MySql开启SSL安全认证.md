---
title: MySql开启SSL安全认证
order: 4
---



# MySql之开启SSL安全认证

**【思考】：为什么要开启ssl认证？**

**SSL**（Secure Socket Layer：安全套接字层）利用数据加密、身份验证和消息完整性验证机制，为基于TCP等可靠连接的应用层协议提供安全性保证。

> SSL协议提供的功能主要有：
>
> 1、 数据传输的机密性：利用对称密钥算法对传输的数据进行加密。
>       2.、身份验证机制：基于证书利用数字签名方法对服务器和客户端进行身份验证，其中客户端的身份验证是可选的。
>       3、 消息完整性验证：消息传输过程中使用MAC算法来检验消息的完整性。
>
> 如果用户的传输不是通过SSL的方式，那么其在网络中数据都是以明文进行传输的，而这给别有用心的人带来了可乘之机。所以，现在很多大型网站都开启了SSL功能。同样地，在我们数据库方面，如果客户端连接服务器获取数据不是使用SSL连接，那么在传输过程中，数据就有可能被窃取。

**【测试方式】在MySQL服务器端通过tshark抓包的方式来模拟窃取数据。验证、对比，未使用SSL和使用SSL两者在安全性上有什么不同？**

1、未使用SSL和使用SSL安全性对比

1）未使用ssl：在客户端上对数据库做插入数据操作。服务端进行抓包

![img](https://gitee.com/lindaifeng/my-images/raw/master/img/818283-20170621182629820-1095511691.png)

![img](https://gitee.com/lindaifeng/my-images/raw/master/img/818283-20170621182714210-1420612562.png)

**【结论】未使用SSL情况下，在数据库服务器端可以通过抓包的方式获取数据，安全性不高。**

2）使用ssl：与上述同样的操作。

![img](https://gitee.com/lindaifeng/my-images/raw/master/img/818283-20170621183247554-1671875359.png)

![img](https://gitee.com/lindaifeng/my-images/raw/master/img/818283-20170621183434241-1944183268.png)

**【结论】没有抓到该语句，采用SSL加密后，tshark抓不到数据，安全性高。**

## 二、Mysql5.7 SSL的配置与启用

在MySQL5.7安装初始化阶段，我们发现比之前版本多了一步操作，而这个操作就是安装SSL的。

```
shell> bin/mysqld --initialize --user=mysql    # MySQL 5.7.6 and up
shell> bin/mysql_ssl_rsa_setup                 # MySQL 5.7.6 and up
```

当运行完这个命令后，默认会在data_dir目录下生成以下pem文件，这些文件就是用于启用SSL功能的：

```
[root mysql_data]# ll *.pem
-rw------- 1 mysql mysql 1675 Jun 12 17:22 ca-key.pem         #CA私钥
-rw-r--r-- 1 mysql mysql 1074 Jun 12 17:22 ca.pem             #自签的CA证书，客户端连接也需要提供
-rw-r--r-- 1 mysql mysql 1078 Jun 12 17:22 client-cert.pem    #客户端连接服务器端需要提供的证书文件
-rw------- 1 mysql mysql 1675 Jun 12 17:22 client-key.pem     #客户端连接服务器端需要提供的私钥文件-rw------- 1 mysql mysql 1675 Jun 12 17:22 private_key.pem    #私钥/公钥对的私有成员-rw-r--r-- 1 mysql mysql 451 Jun 12 17:22  public_key.pem     #私钥/公钥对的共有成员-rw-r--r-- 1 mysql mysql 1078 Jun 12 17:22 server-cert.pem    #服务器端证书文件-rw------- 1 mysql mysql 1675 Jun 12 17:22 server-key.pem     #服务器端私钥文件
```

这时从数据库服务器本地进入MySQL命令行，你可以看到如下变量值：

```
root> mysql -h 10.126.xxx.xxx -udba -p

###查看SSL开启情况
dba:(none)> show global variables like '%ssl%';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| have_openssl  | YES             |
| have_ssl      | YES             |    #已经开启了SSL
| ssl_ca        | ca.pem          |
| ssl_capath    |                 |
| ssl_cert      | server-cert.pem |
| ssl_cipher    |                 |
| ssl_crl       |                 |
| ssl_crlpath   |                 |
| ssl_key       | server-key.pem  |
+---------------+-----------------+
```

**【注意】：如果用户是采用本地localhost或者sock连接数据库，那么不会使用SSL方式了**



## 三、配置SSL安全认证

如果安装MySQL57时没有运行过mysql_ssl_rsa_setup，那么如何开启SSL呢？

```
1)、关闭MySQL服务
2)、运行mysql_ssl_rsa_setup 命令
3)、到data_dir目录下修改.pem文件的所属权限用户为mysql
    chown -R mysql.mysql *.pem
4)、启动MySQL服务
```

