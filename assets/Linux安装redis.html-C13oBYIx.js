import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as e,f as a}from"./app-BbMnQDRy.js";const n={},t=a(`<h1 id="redis安装步骤" tabindex="-1"><a class="header-anchor" href="#redis安装步骤"><span>Redis安装步骤</span></a></h1><blockquote><p>以下是所需软件和服务器版本： Redis版本 5.0.4 服务器版本 Linux CentOS 7.6 64位</p><p>1、查看redis是否在运行： ps aux | grep redis</p><p>2、启动redis： redis-server redis-conf</p><p>3、重启redis：systemctl restart redis.service</p><p>4、关闭redis： redis-cli shutdown</p><p>5、当设置密码后，上面的关闭命令无效：带密码输入： redis-cli -a [password]<br> 回车后输入：shutdown</p><p>即可关闭redis，输入exit 退出。</p><p>6、查看redis密码；可查看 redis 安装根目录下的配置文件：redis-conf 中SECURITY下面的 requirepass 后面的内容</p></blockquote><h2 id="一、下载redis软件" tabindex="-1"><a class="header-anchor" href="#一、下载redis软件"><span>一、下载redis软件</span></a></h2><p>先进入官网找到下载地址下载redis安装包： <a href="https://redis.io/download" target="_blank" rel="noopener noreferrer">https://redis.io/download</a> 通过xshell软件连接到远程服务器输入rz命令把安装包上传到linux服务器 <img src="https://img-blog.csdnimg.cn/20201015133833544.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" loading="lazy"> 或者服务器自动下载：进入到Xshell控制台(默认当前是root根目录)，输入wget 将上面复制的下载链接粘贴上，如下命令:</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">wget</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> http://download.redis.io/releases/redis-5.0.7.tar.gz</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="https://img-blog.csdnimg.cn/2020101513400512.png#pic_center" alt="在这里插入图片描述" loading="lazy"> 等待下载完成。</p><h2 id="二、解压并安装redis" tabindex="-1"><a class="header-anchor" href="#二、解压并安装redis"><span>二、解压并安装Redis</span></a></h2><p>下载完成后需要将压缩文件解压，输入以下命令解压到当前目录</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">tar</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -zvxf</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis-5.0.7.tar.gz</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>解压后在根目录上输入ls 列出所有目录会发现与下载redis之前多了一个redis-5.0.7.tar.gz文件和 redis-5.0.7的目录。</p><figure><img src="https://img-blog.csdnimg.cn/20201015134252170.png#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><h2 id="三、移动redis目录" tabindex="-1"><a class="header-anchor" href="#三、移动redis目录"><span>三、移动redis目录</span></a></h2><p>一般都会将redis目录放置到 /usr/local/redis目录，所以这里输入下面命令将目前在/root目录下的redis-5.0.7文件夹更改目录，同时更改文件夹名称为redis。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mv</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /root/redis-5.0.7</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>cd 到/usr/local目录下输入ls命令可以查询到当前目录已经多了一个redis子目录，同时/root目录下已经没有redis-5.0.7文件夹</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://img-blog.csdnimg.cn/20201015134423999.png#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><h2 id="四、编译" tabindex="-1"><a class="header-anchor" href="#四、编译"><span>四、编译</span></a></h2><p>cd到/usr/local/redis目录，输入命令make执行编译命令，接下来控制台会输出各种编译过程中输出的内容。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">make</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://img-blog.csdnimg.cn/20201015134554481.png#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><h2 id="五、安装" tabindex="-1"><a class="header-anchor" href="#五、安装"><span>五、安装</span></a></h2><p>输入以下命令</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">make</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> PREFIX=/usr/local/redis</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>这里多了一个关键字 PREFIX= 这个关键字的作用是编译的时候用于指定程序存放的路径。比如我们现在就是指定了redis必须存放在/usr/local/redis目录。</p><p>假设不添加该关键字Linux会将可执行文件存放在/usr/local/bin目录，库文件会存放在/usr/local/lib目录。配置文件会存放在/usr/local/etc目录。其他的资源文件会存放在usr/local/share目录。这里指定号目录也方便后续的卸载，后续直接rm -rf /usr/local/redis 即可删除redis。</p></blockquote><figure><img src="https://img-blog.csdnimg.cn/2020101513464696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><h2 id="六、启动redis" tabindex="-1"><a class="header-anchor" href="#六、启动redis"><span>六、启动redis</span></a></h2><p>根据上面的操作已经将redis安装完成了。在目录/usr/local/redis 输入下面命令启动redis</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">./bin/redis-server</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&amp; </span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">./redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="https://img-blog.csdnimg.cn/20201015134723379.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" loading="lazy"><strong>Redis到这里已经启动完毕。</strong> 我们可以ctrl+c退出后，查看进程redis检查后台进程是否正在运行有两种方式：</p><p>1.1 采取查看进程方式</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ps</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -ef</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><img src="https://img-blog.csdnimg.cn/20201015135259717.png#pic_center" alt="在这里插入图片描述" loading="lazy"> 1.2 采取端口监听查看方式（redis默认端口是6379）</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">netstat</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -lanp</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | </span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 6379</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://img-blog.csdnimg.cn/20201015155426260.png#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><p>检查到redis服务正在运行，我们就可以启动redis客户端进入redis了 使用<code>redis-cli</code>客户端检测连接是否正常（注意redis-cli在redis/bin目录下，需要切换到该目录下才能启动，注意自己所处的目录）</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">./bin/redis-cli</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://img-blog.csdnimg.cn/20201015155639458.png#pic_center" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><p>2、如果检查到我们redis服务没有开启我们可以设置守护进程后台运行的方式将配置文件中的daemonize设置为yes，将protected-mode设置为no。</p><blockquote><p>这里我要将daemonize改为yes，不然我每次启动都得在redis-server命令后面加符号&amp;，不这样操作则只要回到Linux控制台则redis服务会自动关闭， 同时也将bind注释，将protected-mode设置为no。 这样启动后我就可以在外网访问了。</p></blockquote><p>修改方式（进入配置文件）</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /usr/local/redis/redis.conf</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://img-blog.csdnimg.cn/080dcc104b814108bfa2a01e397b3616.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA44CG5riF5bOw44Sf,size_20,color_FFFFFF,t_70,g_se,x_16" alt="在这里插入图片描述" tabindex="0" loading="lazy"><figcaption>在这里插入图片描述</figcaption></figure><h2 id="七、redis-conf配置文件讲解" tabindex="-1"><a class="header-anchor" href="#七、redis-conf配置文件讲解"><span>七、redis.conf配置文件讲解</span></a></h2><p>在目录/usr/local/redis下有一个redis.conf的配置文件。我们上面启动方式就是执行了该配置文件的配置运行的。我么可以通过cat、vim、less等Linux内置的读取命令读取该文件。 <img src="https://img-blog.csdnimg.cn/20201015155227964.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" loading="lazy"></p><p><strong>设置Redis密码：</strong> 1、打开redis.conf，</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>查找requirepass foobared（Esc ：/requirepass foobared）,</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>把前面的；去掉，</p><p>2、将foobared改成自己的密码，</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>例如：requirepass 1234546</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>3、重启后，进入cli</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>redis-cli</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>4、进入后输入ping测试，会提示未认证</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ping</span></span>
<span class="line"><span>NOAUTH Authentication required</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>退出后</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span> ./bin/redis-cli -h 127.0.0.1 -p 6379 -a 123456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>认证进入</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ping</span></span>
<span class="line"><span>ok！</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>方法二： 查看当前redis有没有设置密码： 127.0.0.1:6379&gt; config get requirepass</p><p>无显示说明没有密码</p><p>那么现在来设置密码：</p><p>127.0.0.1:6379&gt; config set requirepass abcdefg</p><p>OK 再次查看当前redis就提示需要密码： 127.0.0.1:6379&gt; config get requirepass</p><p>(error) NOAUTH Authentication required.</p></blockquote><h2 id="八、常见问题" tabindex="-1"><a class="header-anchor" href="#八、常见问题"><span>八、常见问题</span></a></h2><p><strong>1、远程连接问题</strong><strong>Java程序连接redis时报错：JedisConnectionException: Failed connecting to host xx.xx.xx.xx:6379</strong> 原因： 1）机器之间网络无法联通 进入redis输入ping命令如果返回pong则网络通畅，反之则是网络不通 <img src="https://img-blog.csdnimg.cn/20201012113135804.png#pic_center" alt="在这里插入图片描述" loading="lazy"></p><p>2）ip和端口号不正确 检查redis.conf配置文件中的ip和端口是否一致</p><p>3）虚拟机中防火墙的原因（可能性较大）</p><blockquote><p>1）连接不上可能是防火墙拒绝了本地连接请求，关闭防火墙即可，可以但不安全当然开发时可以这样关（unbantu系统指令，其他系统指令不同） 1、查看防火墙状态： sudo ufw status 2、关闭防火墙： sudo ufw disable 3、开启防火墙： sudo ufw enable</p><p>2）安全一点的方法就是修改防火墙规则，如需远程连接redis，需配置redis端口6379在linux防火墙中开放，代码如下： 1编辑防火强配置文件 vim /etc/sysconfig/iptables 2 添加一行: -A INPUT -m state --state NEW -m tcp -p tcp --dport 6379 -j ACCEPT 3 重启服务: service iptable</p></blockquote><p>4）服务器端的redis.config配置问题 1.redis.conf 中bind 127.0.0.1 未用#注释掉（未注释默认只接收本机访问） 2.protected-mode no 守护进程设置no 3.daemonize yes 作为守护进程运行yes</p><p>5）服务器的防火墙问题（没有放开redis端口） 如：阿里云服务器配置实例安全组 <img src="https://img-blog.csdnimg.cn/20201011224233245.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" loading="lazy"></p><p><strong>2、持久化问题</strong><strong>Java程序连接redis时报错：MISCONF Redis is configured to save RDB snapshots, but is currently not able to persist on disk. Commands that may modify the data set are disabled. Please check Redis logs for details about the error</strong></p><p>意思是说redis配置了RDB存储快照，但是当前不能持久化到磁盘disk。即：强制关闭Redis快照导致不能持久化！！！！究其原因是因为强制把redis快照关闭了导致不能持久化的问题，在网上查了一些相关解决方案，通过stop-writes-on-bgsave-error值设置为no即可避免这种问题。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">有两种修改方法，一种是通过redis命令行修改，另一种是直接修改redis.conf配置文件</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">1、命令行修改方式示例：</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">127.0.0.1:6379</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt; </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">config</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> set</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> stop-writes-on-bgsave-error</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> no</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2、修改redis.conf文件：vi打开redis-server配置的redis.conf文件，然后使用快捷匹配模式：/stop-writes-on-bgsave-error定位到stop-writes-on-bgsave-error字符串所在位置，接着把后面的yes设置为no即可。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">修改完后需要重启redis服务</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">重启redis：systemctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis.service</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>但上方的方法治标不治本，下面采用直接修改内核参数的方式 配置优化，添加以下配置项到/etc/sysctl.conf配置文件：</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">cat</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/sysctl.conf</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> //查看配置文件信息</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/sysctl.conf</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">	//编辑配置信息</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">vm.overcommit_memory</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> //加入该行代码</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sysctl</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> vm.overcommit_memory=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> //执行该命令使其实时生效</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,72),r=[t];function l(d,p){return e(),s("div",null,r)}const o=i(n,[["render",l],["__file","Linux安装redis.html.vue"]]),g=JSON.parse('{"path":"/deploy/Linux%E9%83%A8%E7%BD%B2%E6%96%87%E6%A1%A3/%E8%BD%AF%E4%BB%B6%E5%AE%89%E8%A3%85/Linux%E5%AE%89%E8%A3%85redis.html","title":"Linux安装redis","lang":"zh-CN","frontmatter":{"title":"Linux安装redis","categories":["Linux"],"tags":["Redis"],"order":13,"description":"Redis安装步骤 以下是所需软件和服务器版本： Redis版本 5.0.4 服务器版本 Linux CentOS 7.6 64位 1、查看redis是否在运行： ps aux | grep redis 2、启动redis： redis-server redis-conf 3、重启redis：systemctl restart redis.servic...","head":[["meta",{"property":"og:url","content":"http://blog.lindaifeng.vip/deploy/Linux%E9%83%A8%E7%BD%B2%E6%96%87%E6%A1%A3/%E8%BD%AF%E4%BB%B6%E5%AE%89%E8%A3%85/Linux%E5%AE%89%E8%A3%85redis.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"Linux安装redis"}],["meta",{"property":"og:description","content":"Redis安装步骤 以下是所需软件和服务器版本： Redis版本 5.0.4 服务器版本 Linux CentOS 7.6 64位 1、查看redis是否在运行： ps aux | grep redis 2、启动redis： redis-server redis-conf 3、重启redis：systemctl restart redis.servic..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://img-blog.csdnimg.cn/20201015133833544.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-11T03:57:59.000Z"}],["meta",{"property":"article:author","content":"清峰"}],["meta",{"property":"article:tag","content":"Redis"}],["meta",{"property":"article:modified_time","content":"2024-09-11T03:57:59.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux安装redis\\",\\"image\\":[\\"https://img-blog.csdnimg.cn/20201015133833544.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center\\",\\"https://img-blog.csdnimg.cn/2020101513400512.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015134252170.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015134423999.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015134554481.png#pic_center\\",\\"https://img-blog.csdnimg.cn/2020101513464696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015134723379.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015135259717.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015155426260.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201015155639458.png#pic_center\\",\\"https://img-blog.csdnimg.cn/080dcc104b814108bfa2a01e397b3616.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA44CG5riF5bOw44Sf,size_20,color_FFFFFF,t_70,g_se,x_16\\",\\"https://img-blog.csdnimg.cn/20201015155227964.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center\\",\\"https://img-blog.csdnimg.cn/20201012113135804.png#pic_center\\",\\"https://img-blog.csdnimg.cn/20201011224233245.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80NTAxOTM1MA==,size_16,color_FFFFFF,t_70#pic_center\\"],\\"dateModified\\":\\"2024-09-11T03:57:59.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清峰\\",\\"url\\":\\"http://blog.lindaifeng.vip/\\"}]}"]]},"headers":[{"level":2,"title":"一、下载redis软件","slug":"一、下载redis软件","link":"#一、下载redis软件","children":[]},{"level":2,"title":"二、解压并安装Redis","slug":"二、解压并安装redis","link":"#二、解压并安装redis","children":[]},{"level":2,"title":"三、移动redis目录","slug":"三、移动redis目录","link":"#三、移动redis目录","children":[]},{"level":2,"title":"四、编译","slug":"四、编译","link":"#四、编译","children":[]},{"level":2,"title":"五、安装","slug":"五、安装","link":"#五、安装","children":[]},{"level":2,"title":"六、启动redis","slug":"六、启动redis","link":"#六、启动redis","children":[]},{"level":2,"title":"七、redis.conf配置文件讲解","slug":"七、redis-conf配置文件讲解","link":"#七、redis-conf配置文件讲解","children":[]},{"level":2,"title":"八、常见问题","slug":"八、常见问题","link":"#八、常见问题","children":[]}],"git":{"createdTime":1726027079000,"updatedTime":1726027079000,"contributors":[{"name":"ldf","email":"1305366530@qq.com","commits":1}]},"readingTime":{"minutes":7.25,"words":2175},"filePathRelative":"deploy/Linux部署文档/软件安装/Linux安装redis.md","localizedDate":"2024年9月11日","autoDesc":true,"excerpt":"\\n<blockquote>\\n<p>以下是所需软件和服务器版本：\\nRedis版本 5.0.4\\n服务器版本 Linux CentOS 7.6 64位</p>\\n<p>1、查看redis是否在运行： ps aux | grep redis</p>\\n<p>2、启动redis：    redis-server redis-conf</p>\\n<p>3、重启redis：systemctl restart redis.service</p>\\n<p>4、关闭redis：    redis-cli shutdown</p>\\n<p>5、当设置密码后，上面的关闭命令无效：带密码输入：    redis-cli -a [password]<br>\\n回车后输入：shutdown</p>\\n<p>即可关闭redis，输入exit 退出。</p>\\n<p>6、查看redis密码；可查看 redis 安装根目录下的配置文件：redis-conf 中SECURITY下面的 requirepass 后面的内容</p>\\n</blockquote>"}');export{o as comp,g as data};
