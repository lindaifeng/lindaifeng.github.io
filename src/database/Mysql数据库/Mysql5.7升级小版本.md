---
title: Mysql5.7升级小版本
order: 2
---



## mysql5.7升级小版本-windows

> 在centos7环境中从5.7.26升级到5.7.37请看：密码：qot9
>
> https://zrzyjyb.yuque.com/docs/share/eba5d4c6-b5bf-4e1b-ac46-b75e3be1f18b

应用场景：mysql 5.7.20升级到当前最新的5.7.31 ，Windows环境

官网下载链接：https://dev.mysql.com/downloads/mysql/5.7.html

**注意：操作前mysql数据一定一定先备份，以免安装过程中出问题能够补救**

## 一、关闭并删除mysql服务

先记录一下mysql的安装路径

```
//查看mysql安装路径
select @@basedir as basePath from dual;
//查看mysql data数据存放路径
show global variables like '%datadir%';
```

再服务窗口关闭mysql服务

```
//cmd切换盘符e:
//cd到安装路径bin目录下
E:/MySQL/mysql>cd bin
//移除mysql服务
E:/MySQL/mysql/bin>mysqld —remove
Service successfully removed.

E:/MySQL/mysql/bin>cd ..

E:/MySQL/mysql>cd ..
```

## 二、替换mysql 相关文件

将mysql文件夹改名，然后将新版本解压命名为mysql将原来的my.ini和data目录拷贝到mysql文件夹中

```
E:/MySQL>cd mysql
E:/MySQL>cd bin
//安装mysql服务
E:/MySQL/mysql>mysqld —install
Service successfully installed.
```

## 三、启动mysql服务

重新打开服务窗口，启动mysql服务

```
E:/MySQL/mysql>cd bin
E:/MySQL/mysql/bin>mysql -u root -p
输入原先的密码

//查看mysql版本
mysql> select version();
+—————-+
| version() |
+—————-+
| 5.7.37 |
+—————-+
1 row in set (0.00 sec)

mysql> exit
Bye
```

**第三步操作能正常启动可直接跳到第四步。**

> 注意：我在本机上测试，一，二步操作完后，第三步服务能够启动。但在生产环境下却启动不起来。
>
> 我在cmd输入启动命令：net start msql的时候提示“服务报告没有任何错误”。
>
> 原因：安装完mysql服务后迫不及待的开启mysql服务，在mysql5.7以上版本中默认没有一个data目录，即没有初始化服务。需要先初始化mysql才可以启动服务mysqld  --initialize-insecure，否则会报 “服务没有报告任何错误”，启动失败。
>
> 1）我这里是因为生产上的mysql数据存放目录data在其他文件夹中，我替换了mysql安装目录后，配置文件my.ini中直接将数据存放目录引导至data所在路径，结果报错。
>
> 2）将data路径放置mysql安装目录下，修改配置文件数据存放路径datadir即可，即可启动成功。
>
> 3）还是启动不成功就执行mysqld  --initialize-insecure将数据库初始化，然后在启动，注意初始化后你的数据库相当于重置了，是一个全新的数据库，需要重新设置密码，导库操作。



## 四、执行升级操作

```
E:/MySQL/mysql/bin>mysql_upgrade.exe -uroot -p 密码
提示：
mysql_upgrade: [Warning] Using a password on the command line interface can be i
nsecure.
Checking if update is needed.
Checking server version.
Running queries to upgrade MySQL server.
Checking system database.
mysql.columns_priv OK
mysql.db OK
mysql.engine_cost OK
mysql.event OK
mysql.func OK
mysql.general_log OK
mysql.gtid_executed OK
mysql.help_category OK
mysql.help_keyword OK
mysql.help_relation OK
mysql.help_topic OK
mysql.innodb_index_stats OK
mysql.innodb_table_stats OK
mysql.ndb_binlog_index OK
mysql.plugin OK
mysql.proc OK
mysql.procs_priv OK
mysql.proxies_priv OK
mysql.server_cost OK
mysql.servers OK
mysql.slave_master_info OK
mysql.slave_relay_log_info OK
mysql.slave_worker_info OK
mysql.slow_log OK
mysql.tables_priv OK
mysql.time_zone OK
mysql.time_zone_leap_second OK
mysql.time_zone_name OK
mysql.time_zone_transition OK
mysql.time_zone_transition_type OK
mysql.user OK
Found outdated sys schema version 1.5.1.
Upgrading the sys schema.
Checking databases.
ejabberd.archive OK
ejabberd.archive_prefs OK
ejabberd.archive_search_result OK
ejabberd.archive_search_task OK
ejabberd.bosh OK
ejabberd.caps_features OK
ejabberd.carboncopy OK
ejabberd.im_muc_room_member OK
ejabberd.im_muc_room_stat OK
ejabberd.im_sys_config OK
ejabberd.im_unread_message OK
ejabberd.irc_custom OK
ejabberd.last OK
ejabberd.motd OK
ejabberd.msg_item OK
ejabberd.muc_online_room OK
ejabberd.muc_online_users OK
ejabberd.muc_registered OK
ejabberd.muc_room OK
ejabberd.muc_room_dissolved OK
ejabberd.oauth_token OK
ejabberd.privacy_default_list OK
ejabberd.privacy_list OK
ejabberd.privacy_list_data OK
ejabberd.private_storage OK
ejabberd.proxy65 OK
ejabberd.pubsub_item OK
ejabberd.pubsub_node OK
ejabberd.pubsub_node_option OK
ejabberd.pubsub_node_owner OK
ejabberd.pubsub_state OK
ejabberd.pubsub_subscription_opt OK
ejabberd.roster_version OK
ejabberd.rostergroups OK
ejabberd.rosterusers OK
ejabberd.route OK
ejabberd.sm OK
ejabberd.spool OK
ejabberd.sr_group OK
ejabberd.sr_user OK
ejabberd.user_favorite_contact OK
ejabberd.user_favorite_group_def OK
ejabberd.user_mc_room OK
ejabberd.user_sign OK
ejabberd.users OK
ejabberd.vcard OK
ejabberd.vcard_search OK
sys.sys_config OK
Upgrade process completed successfully.
Checking if update is needed.
```

## 五、重启mysql服务并验证版本

重启mysql服务

```
//进入mysql
E:/MySQL/mysql/bin>mysql -u root -p
密码：

//查看版本
mysql> select version();
//查看数据库
mysql> show databases;
```

完毕