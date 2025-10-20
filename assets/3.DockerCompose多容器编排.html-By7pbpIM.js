import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as a,f as l}from"./app-DOXsNbB_.js";const e={},p=l(`<h1 id="docker-compose多容器编排" tabindex="-1"><a class="header-anchor" href="#docker-compose多容器编排"><span>Docker Compose多容器编排</span></a></h1><h2 id="什么是docker-compose" tabindex="-1"><a class="header-anchor" href="#什么是docker-compose"><span>什么是Docker Compose</span></a></h2><p>Docker Compose是Docker官方编排（Orchestration）项目之一，负责快速在集群中部署分布式应用。它允许用户通过一个单独的YAML文件来定义和运行多个Docker容器应用，简化了多容器应用的管理。</p><h2 id="docker-compose的优势" tabindex="-1"><a class="header-anchor" href="#docker-compose的优势"><span>Docker Compose的优势</span></a></h2><ol><li><strong>简化配置</strong>：通过YAML文件定义服务，避免重复的命令行参数</li><li><strong>批量管理</strong>：可以一次性启动、停止、重建多个服务</li><li><strong>环境隔离</strong>：不同的项目可以在不同的环境中运行</li><li><strong>可扩展性</strong>：支持服务的水平扩展</li><li><strong>版本控制</strong>：YAML文件可以纳入版本控制</li></ol><h2 id="docker-compose安装" tabindex="-1"><a class="header-anchor" href="#docker-compose安装"><span>Docker Compose安装</span></a></h2><h3 id="linux系统安装" tabindex="-1"><a class="header-anchor" href="#linux系统安装"><span>Linux系统安装</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 下载Docker Compose</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#9ECBFF;"> curl</span><span style="color:#79B8FF;"> -L</span><span style="color:#9ECBFF;"> &quot;https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(</span><span style="color:#B392F0;">uname</span><span style="color:#79B8FF;"> -s</span><span style="color:#9ECBFF;">)-$(</span><span style="color:#B392F0;">uname</span><span style="color:#79B8FF;"> -m</span><span style="color:#9ECBFF;">)&quot;</span><span style="color:#79B8FF;"> -o</span><span style="color:#9ECBFF;"> /usr/local/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 添加执行权限</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#9ECBFF;"> chmod</span><span style="color:#9ECBFF;"> +x</span><span style="color:#9ECBFF;"> /usr/local/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 创建软链接</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#9ECBFF;"> ln</span><span style="color:#79B8FF;"> -s</span><span style="color:#9ECBFF;"> /usr/local/bin/docker-compose</span><span style="color:#9ECBFF;"> /usr/bin/docker-compose</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 验证安装</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#79B8FF;"> --version</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="windows和mac系统" tabindex="-1"><a class="header-anchor" href="#windows和mac系统"><span>Windows和Mac系统</span></a></h3><p>Docker Desktop已经内置了Docker Compose，无需单独安装。</p><h2 id="docker-compose核心概念" tabindex="-1"><a class="header-anchor" href="#docker-compose核心概念"><span>Docker Compose核心概念</span></a></h2><h3 id="_1-服务-service" tabindex="-1"><a class="header-anchor" href="#_1-服务-service"><span>1. 服务（Service）</span></a></h3><p>服务是运行相同镜像的一个或多个容器实例。在docker-compose.yml文件中定义服务的配置。</p><h3 id="_2-项目-project" tabindex="-1"><a class="header-anchor" href="#_2-项目-project"><span>2. 项目（Project）</span></a></h3><p>项目是所有服务的集合，通常对应一个完整的应用。项目名称默认为当前目录名称。</p><h3 id="_3-卷-volume" tabindex="-1"><a class="header-anchor" href="#_3-卷-volume"><span>3. 卷（Volume）</span></a></h3><p>用于持久化数据和在服务之间共享数据。</p><h3 id="_4-网络-network" tabindex="-1"><a class="header-anchor" href="#_4-网络-network"><span>4. 网络（Network）</span></a></h3><p>用于服务之间的通信。</p><h2 id="docker-compose配置文件" tabindex="-1"><a class="header-anchor" href="#docker-compose配置文件"><span>Docker Compose配置文件</span></a></h2><h3 id="基本结构" tabindex="-1"><a class="header-anchor" href="#基本结构"><span>基本结构</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  service1</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">    # 服务配置</span></span>
<span class="line"><span style="color:#85E89D;">  service2</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">    # 服务配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">  # 卷配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">  # 网络配置</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="服务配置详解" tabindex="-1"><a class="header-anchor" href="#服务配置详解"><span>服务配置详解</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">    # 镜像</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 构建配置（与image二选一）</span></span>
<span class="line"><span style="color:#85E89D;">    build</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      context</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">.</span></span>
<span class="line"><span style="color:#85E89D;">      dockerfile</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">Dockerfile</span></span>
<span class="line"><span style="color:#85E89D;">      args</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">        - </span><span style="color:#9ECBFF;">BUILD_ARG=value</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 端口映射</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;8080:80&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 环境变量</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">ENV_VAR=value</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DATABASE_URL=postgresql://user:pass@db:5432/mydb</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 依赖服务</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">redis</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 数据卷</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./html:/usr/share/nginx/html</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">web-data:/var/www</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 网络配置</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">frontend</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 重启策略</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">unless-stopped</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 健康检查</span></span>
<span class="line"><span style="color:#85E89D;">    healthcheck</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      test</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;CMD&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;curl&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;-f&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;http://localhost&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#85E89D;">      interval</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">30s</span></span>
<span class="line"><span style="color:#85E89D;">      timeout</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">10s</span></span>
<span class="line"><span style="color:#85E89D;">      retries</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">3</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 资源限制</span></span>
<span class="line"><span style="color:#85E89D;">    deploy</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      resources</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">        limits</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">          cpus</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;0.5&#39;</span></span>
<span class="line"><span style="color:#85E89D;">          memory</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">512M</span></span>
<span class="line"><span style="color:#85E89D;">        reservations</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">          cpus</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;0.25&#39;</span></span>
<span class="line"><span style="color:#85E89D;">          memory</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">256M</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_DB</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">myapp</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">user</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">unless-stopped</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web-data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  db-data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  frontend</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  backend</span><span style="color:#E1E4E8;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose常用命令" tabindex="-1"><a class="header-anchor" href="#docker-compose常用命令"><span>Docker Compose常用命令</span></a></h2><h3 id="_1-启动和停止服务" tabindex="-1"><a class="header-anchor" href="#_1-启动和停止服务"><span>1. 启动和停止服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 启动所有服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 后台启动所有服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span><span style="color:#79B8FF;"> -d</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 启动指定服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span><span style="color:#9ECBFF;"> service1</span><span style="color:#9ECBFF;"> service2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 停止所有服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 停止并删除卷</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> down</span><span style="color:#79B8FF;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 停止并删除镜像</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> down</span><span style="color:#79B8FF;"> --rmi</span><span style="color:#9ECBFF;"> all</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-服务管理" tabindex="-1"><a class="header-anchor" href="#_2-服务管理"><span>2. 服务管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 查看服务状态</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看服务日志</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> logs</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 实时查看服务日志</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> logs</span><span style="color:#79B8FF;"> -f</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看特定服务日志</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> logs</span><span style="color:#9ECBFF;"> service_name</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 重启服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> restart</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 重启特定服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> restart</span><span style="color:#9ECBFF;"> service_name</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 停止服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> stop</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 启动已停止的服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> start</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-构建和镜像管理" tabindex="-1"><a class="header-anchor" href="#_3-构建和镜像管理"><span>3. 构建和镜像管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 构建服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 构建特定服务</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> build</span><span style="color:#9ECBFF;"> service_name</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 拉取服务镜像</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> pull</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 推送服务镜像</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> push</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-执行命令" tabindex="-1"><a class="header-anchor" href="#_4-执行命令"><span>4. 执行命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 在服务中执行命令</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> exec</span><span style="color:#9ECBFF;"> service_name</span><span style="color:#9ECBFF;"> command</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 进入服务容器</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> exec</span><span style="color:#9ECBFF;"> service_name</span><span style="color:#9ECBFF;"> /bin/bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 运行一次性命令</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> run</span><span style="color:#9ECBFF;"> service_name</span><span style="color:#9ECBFF;"> command</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-扩展服务" tabindex="-1"><a class="header-anchor" href="#_5-扩展服务"><span>5. 扩展服务</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 扩展服务实例数量</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span><span style="color:#79B8FF;"> --scale</span><span style="color:#9ECBFF;"> web=</span><span style="color:#79B8FF;">3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实际应用示例" tabindex="-1"><a class="header-anchor" href="#实际应用示例"><span>实际应用示例</span></a></h2><h3 id="_1-web应用-数据库" tabindex="-1"><a class="header-anchor" href="#_1-web应用-数据库"><span>1. Web应用+数据库</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./nginx.conf:/etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./html:/usr/share/nginx/html</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">app</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">frontend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  app</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    build</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">./app</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DATABASE_URL=postgresql://user:pass@db:5432/mydb</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">frontend</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_DB</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">myapp</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">user</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  db-data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  frontend</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  backend</span><span style="color:#E1E4E8;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-微服务架构" tabindex="-1"><a class="header-anchor" href="#_2-微服务架构"><span>2. 微服务架构</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  gateway</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./nginx.conf:/etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">frontend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  user-service</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    build</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">./user-service</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DB_HOST=user-db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DB_PORT=5432</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">user-db</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  user-db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_DB</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">userdb</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">user</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">user-db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  order-service</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    build</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">./order-service</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DB_HOST=order-db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">DB_PORT=5432</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">order-db</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  order-db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_DB</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">orderdb</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">user</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">order-db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  user-db-data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  order-db-data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  frontend</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  backend</span><span style="color:#E1E4E8;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-开发环境配置" tabindex="-1"><a class="header-anchor" href="#_3-开发环境配置"><span>3. 开发环境配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  app</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    build</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">.</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;3000:3000&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">.:/app</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">/app/node_modules</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">NODE_ENV=development</span></span>
<span class="line"><span style="color:#85E89D;">    command</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">npm run dev</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_DB</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">development</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_USER</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">user</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;5432:5432&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  redis</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">redis:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;6379:6379&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  db-data</span><span style="color:#E1E4E8;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose高级功能" tabindex="-1"><a class="header-anchor" href="#docker-compose高级功能"><span>Docker Compose高级功能</span></a></h2><h3 id="_1-多环境配置" tabindex="-1"><a class="header-anchor" href="#_1-多环境配置"><span>1. 多环境配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:\${NGINX_VERSION:-alpine}</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;\${WEB_PORT:-80}:80&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># docker-compose.override.yml (开发环境)</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">.:/usr/share/nginx/html</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">NODE_ENV=development</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># docker-compose.prod.yml (生产环境)</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">unless-stopped</span></span>
<span class="line"><span style="color:#85E89D;">    deploy</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      replicas</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">3</span></span>
<span class="line"><span style="color:#85E89D;">      resources</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">        limits</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">          cpus</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;0.5&#39;</span></span>
<span class="line"><span style="color:#85E89D;">          memory</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">512M</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用不同环境配置：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 开发环境</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 生产环境</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#79B8FF;"> -f</span><span style="color:#9ECBFF;"> docker-compose.yml</span><span style="color:#79B8FF;"> -f</span><span style="color:#9ECBFF;"> docker-compose.prod.yml</span><span style="color:#9ECBFF;"> up</span><span style="color:#79B8FF;"> -d</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-服务扩展" tabindex="-1"><a class="header-anchor" href="#_2-服务扩展"><span>2. 服务扩展</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    deploy</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      replicas</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">1</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;80:80&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>扩展服务：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 扩展到3个实例</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> up</span><span style="color:#79B8FF;"> --scale</span><span style="color:#9ECBFF;"> web=</span><span style="color:#79B8FF;">3</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-自定义网络" tabindex="-1"><a class="header-anchor" href="#_3-自定义网络"><span>3. 自定义网络</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">frontend</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  app</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">node:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">backend</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">database</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">database</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  frontend</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">bridge</span></span>
<span class="line"><span style="color:#85E89D;">  backend</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">bridge</span></span>
<span class="line"><span style="color:#85E89D;">  database</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose最佳实践" tabindex="-1"><a class="header-anchor" href="#docker-compose最佳实践"><span>Docker Compose最佳实践</span></a></h2><h3 id="_1-配置文件组织" tabindex="-1"><a class="header-anchor" href="#_1-配置文件组织"><span>1. 配置文件组织</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span>project/</span></span>
<span class="line"><span>├── docker-compose.yml          # 基础配置</span></span>
<span class="line"><span>├── docker-compose.override.yml # 开发环境覆盖</span></span>
<span class="line"><span>├── docker-compose.prod.yml     # 生产环境配置</span></span>
<span class="line"><span>├── .env                        # 环境变量</span></span>
<span class="line"><span>└── services/</span></span>
<span class="line"><span>    ├── web/</span></span>
<span class="line"><span>    │   └── Dockerfile</span></span>
<span class="line"><span>    └── app/</span></span>
<span class="line"><span>        └── Dockerfile</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-环境变量管理" tabindex="-1"><a class="header-anchor" href="#_2-环境变量管理"><span>2. 环境变量管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># .env文件</span></span>
<span class="line"><span style="color:#E1E4E8;">WEB_PORT</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">8080</span></span>
<span class="line"><span style="color:#E1E4E8;">DB_PASSWORD</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">secretpassword</span></span>
<span class="line"><span style="color:#E1E4E8;">REDIS_URL</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">redis://redis:6379</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;\${WEB_PORT}:80&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">REDIS_URL=\${REDIS_URL}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据持久化" tabindex="-1"><a class="header-anchor" href="#_3-数据持久化"><span>3. 数据持久化</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#6A737D;">      # 命名卷（推荐）</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">db-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#6A737D;">      # 绑定挂载（开发环境）</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">\${DB_PASSWORD}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  db-data</span><span style="color:#E1E4E8;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-健康检查和依赖" tabindex="-1"><a class="header-anchor" href="#_4-健康检查和依赖"><span>4. 健康检查和依赖</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3.8&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  web</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nginx:alpine</span></span>
<span class="line"><span style="color:#85E89D;">    depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">        condition</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">service_healthy</span></span>
<span class="line"><span style="color:#85E89D;">    healthcheck</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      test</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;CMD&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;curl&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;-f&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;http://localhost&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#85E89D;">      interval</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">30s</span></span>
<span class="line"><span style="color:#85E89D;">      timeout</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">10s</span></span>
<span class="line"><span style="color:#85E89D;">      retries</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres:13</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      POSTGRES_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">\${DB_PASSWORD}</span></span>
<span class="line"><span style="color:#85E89D;">    healthcheck</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      test</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&quot;CMD-SHELL&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;pg_isready -U postgres&quot;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#85E89D;">      interval</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">10s</span></span>
<span class="line"><span style="color:#85E89D;">      timeout</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">5s</span></span>
<span class="line"><span style="color:#85E89D;">      retries</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常用docker-compose命令总结" tabindex="-1"><a class="header-anchor" href="#常用docker-compose命令总结"><span>常用Docker Compose命令总结</span></a></h2><table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody><tr><td><code>docker-compose up</code></td><td>启动所有服务</td></tr><tr><td><code>docker-compose up -d</code></td><td>后台启动所有服务</td></tr><tr><td><code>docker-compose down</code></td><td>停止并删除所有服务</td></tr><tr><td><code>docker-compose ps</code></td><td>查看服务状态</td></tr><tr><td><code>docker-compose logs</code></td><td>查看服务日志</td></tr><tr><td><code>docker-compose exec</code></td><td>在服务中执行命令</td></tr><tr><td><code>docker-compose build</code></td><td>构建服务镜像</td></tr><tr><td><code>docker-compose pull</code></td><td>拉取服务镜像</td></tr><tr><td><code>docker-compose restart</code></td><td>重启服务</td></tr><tr><td><code>docker-compose stop</code></td><td>停止服务</td></tr><tr><td><code>docker-compose start</code></td><td>启动已停止的服务</td></tr></tbody></table><h2 id="故障排查技巧" tabindex="-1"><a class="header-anchor" href="#故障排查技巧"><span>故障排查技巧</span></a></h2><h3 id="_1-服务启动失败" tabindex="-1"><a class="header-anchor" href="#_1-服务启动失败"><span>1. 服务启动失败</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 查看服务日志</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> logs</span><span style="color:#9ECBFF;"> service_name</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看服务详细信息</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> ps</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查配置文件语法</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> config</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-网络连接问题" tabindex="-1"><a class="header-anchor" href="#_2-网络连接问题"><span>2. 网络连接问题</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 测试容器间网络连接</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> exec</span><span style="color:#9ECBFF;"> service1</span><span style="color:#9ECBFF;"> ping</span><span style="color:#9ECBFF;"> service2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 查看网络配置</span></span>
<span class="line"><span style="color:#B392F0;">docker-compose</span><span style="color:#9ECBFF;"> exec</span><span style="color:#9ECBFF;"> service1</span><span style="color:#9ECBFF;"> cat</span><span style="color:#9ECBFF;"> /etc/hosts</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-数据卷问题" tabindex="-1"><a class="header-anchor" href="#_3-数据卷问题"><span>3. 数据卷问题</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 查看数据卷</span></span>
<span class="line"><span style="color:#B392F0;">docker</span><span style="color:#9ECBFF;"> volume</span><span style="color:#9ECBFF;"> ls</span><span style="color:#F97583;"> |</span><span style="color:#B392F0;"> grep</span><span style="color:#9ECBFF;"> project_name</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查数据卷内容</span></span>
<span class="line"><span style="color:#B392F0;">docker</span><span style="color:#9ECBFF;"> run</span><span style="color:#79B8FF;"> --rm</span><span style="color:#79B8FF;"> -v</span><span style="color:#9ECBFF;"> project_name_volume:/data</span><span style="color:#9ECBFF;"> alpine</span><span style="color:#9ECBFF;"> ls</span><span style="color:#9ECBFF;"> /data</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>Docker Compose是管理多容器Docker应用的强大工具。通过YAML配置文件，可以轻松定义和运行复杂的多服务应用。掌握Docker Compose的使用方法，可以大大提高开发和部署效率，确保应用环境的一致性。</p>`,74),o=[p];function i(c,r){return a(),n("div",null,o)}const E=s(e,[["render",i],["__file","3.DockerCompose多容器编排.html.vue"]]),v=JSON.parse('{"path":"/middleware/%E5%AE%B9%E5%99%A8%E5%8C%96%E6%8A%80%E6%9C%AF/Docker%E6%8A%80%E6%9C%AF/2.%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD/3.DockerCompose%E5%A4%9A%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92.html","title":"Docker Compose多容器编排","lang":"zh-CN","frontmatter":{"title":"Docker Compose多容器编排","category":["Docker指南"],"tag":["Docker","Docker Compose"],"order":3,"description":"Docker Compose多容器编排 什么是Docker Compose Docker Compose是Docker官方编排（Orchestration）项目之一，负责快速在集群中部署分布式应用。它允许用户通过一个单独的YAML文件来定义和运行多个Docker容器应用，简化了多容器应用的管理。 Docker Compose的优势 简化配置：通过YAM...","head":[["meta",{"property":"og:url","content":"https://lindaifeng.github.io/middleware/%E5%AE%B9%E5%99%A8%E5%8C%96%E6%8A%80%E6%9C%AF/Docker%E6%8A%80%E6%9C%AF/2.%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD/3.DockerCompose%E5%A4%9A%E5%AE%B9%E5%99%A8%E7%BC%96%E6%8E%92.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"Docker Compose多容器编排"}],["meta",{"property":"og:description","content":"Docker Compose多容器编排 什么是Docker Compose Docker Compose是Docker官方编排（Orchestration）项目之一，负责快速在集群中部署分布式应用。它允许用户通过一个单独的YAML文件来定义和运行多个Docker容器应用，简化了多容器应用的管理。 Docker Compose的优势 简化配置：通过YAM..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-09-17T08:59:33.000Z"}],["meta",{"property":"article:author","content":"清峰"}],["meta",{"property":"article:tag","content":"Docker"}],["meta",{"property":"article:tag","content":"Docker Compose"}],["meta",{"property":"article:modified_time","content":"2025-09-17T08:59:33.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Docker Compose多容器编排\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-09-17T08:59:33.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清峰\\",\\"url\\":\\"https://lindaifeng.github.io\\"}]}"]]},"headers":[{"level":2,"title":"什么是Docker Compose","slug":"什么是docker-compose","link":"#什么是docker-compose","children":[]},{"level":2,"title":"Docker Compose的优势","slug":"docker-compose的优势","link":"#docker-compose的优势","children":[]},{"level":2,"title":"Docker Compose安装","slug":"docker-compose安装","link":"#docker-compose安装","children":[{"level":3,"title":"Linux系统安装","slug":"linux系统安装","link":"#linux系统安装","children":[]},{"level":3,"title":"Windows和Mac系统","slug":"windows和mac系统","link":"#windows和mac系统","children":[]}]},{"level":2,"title":"Docker Compose核心概念","slug":"docker-compose核心概念","link":"#docker-compose核心概念","children":[{"level":3,"title":"1. 服务（Service）","slug":"_1-服务-service","link":"#_1-服务-service","children":[]},{"level":3,"title":"2. 项目（Project）","slug":"_2-项目-project","link":"#_2-项目-project","children":[]},{"level":3,"title":"3. 卷（Volume）","slug":"_3-卷-volume","link":"#_3-卷-volume","children":[]},{"level":3,"title":"4. 网络（Network）","slug":"_4-网络-network","link":"#_4-网络-network","children":[]}]},{"level":2,"title":"Docker Compose配置文件","slug":"docker-compose配置文件","link":"#docker-compose配置文件","children":[{"level":3,"title":"基本结构","slug":"基本结构","link":"#基本结构","children":[]},{"level":3,"title":"服务配置详解","slug":"服务配置详解","link":"#服务配置详解","children":[]}]},{"level":2,"title":"Docker Compose常用命令","slug":"docker-compose常用命令","link":"#docker-compose常用命令","children":[{"level":3,"title":"1. 启动和停止服务","slug":"_1-启动和停止服务","link":"#_1-启动和停止服务","children":[]},{"level":3,"title":"2. 服务管理","slug":"_2-服务管理","link":"#_2-服务管理","children":[]},{"level":3,"title":"3. 构建和镜像管理","slug":"_3-构建和镜像管理","link":"#_3-构建和镜像管理","children":[]},{"level":3,"title":"4. 执行命令","slug":"_4-执行命令","link":"#_4-执行命令","children":[]},{"level":3,"title":"5. 扩展服务","slug":"_5-扩展服务","link":"#_5-扩展服务","children":[]}]},{"level":2,"title":"实际应用示例","slug":"实际应用示例","link":"#实际应用示例","children":[{"level":3,"title":"1. Web应用+数据库","slug":"_1-web应用-数据库","link":"#_1-web应用-数据库","children":[]},{"level":3,"title":"2. 微服务架构","slug":"_2-微服务架构","link":"#_2-微服务架构","children":[]},{"level":3,"title":"3. 开发环境配置","slug":"_3-开发环境配置","link":"#_3-开发环境配置","children":[]}]},{"level":2,"title":"Docker Compose高级功能","slug":"docker-compose高级功能","link":"#docker-compose高级功能","children":[{"level":3,"title":"1. 多环境配置","slug":"_1-多环境配置","link":"#_1-多环境配置","children":[]},{"level":3,"title":"2. 服务扩展","slug":"_2-服务扩展","link":"#_2-服务扩展","children":[]},{"level":3,"title":"3. 自定义网络","slug":"_3-自定义网络","link":"#_3-自定义网络","children":[]}]},{"level":2,"title":"Docker Compose最佳实践","slug":"docker-compose最佳实践","link":"#docker-compose最佳实践","children":[{"level":3,"title":"1. 配置文件组织","slug":"_1-配置文件组织","link":"#_1-配置文件组织","children":[]},{"level":3,"title":"2. 环境变量管理","slug":"_2-环境变量管理","link":"#_2-环境变量管理","children":[]},{"level":3,"title":"3. 数据持久化","slug":"_3-数据持久化","link":"#_3-数据持久化","children":[]},{"level":3,"title":"4. 健康检查和依赖","slug":"_4-健康检查和依赖","link":"#_4-健康检查和依赖","children":[]}]},{"level":2,"title":"常用Docker Compose命令总结","slug":"常用docker-compose命令总结","link":"#常用docker-compose命令总结","children":[]},{"level":2,"title":"故障排查技巧","slug":"故障排查技巧","link":"#故障排查技巧","children":[{"level":3,"title":"1. 服务启动失败","slug":"_1-服务启动失败","link":"#_1-服务启动失败","children":[]},{"level":3,"title":"2. 网络连接问题","slug":"_2-网络连接问题","link":"#_2-网络连接问题","children":[]},{"level":3,"title":"3. 数据卷问题","slug":"_3-数据卷问题","link":"#_3-数据卷问题","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1758099573000,"updatedTime":1758099573000,"contributors":[{"name":"ldf","email":"1305366530@qq.com","commits":1}]},"readingTime":{"minutes":5.7,"words":1710},"filePathRelative":"middleware/容器化技术/Docker技术/2.核心功能/3.DockerCompose多容器编排.md","localizedDate":"2025年9月17日","autoDesc":true,"excerpt":"\\n<h2>什么是Docker Compose</h2>\\n<p>Docker Compose是Docker官方编排（Orchestration）项目之一，负责快速在集群中部署分布式应用。它允许用户通过一个单独的YAML文件来定义和运行多个Docker容器应用，简化了多容器应用的管理。</p>\\n<h2>Docker Compose的优势</h2>\\n<ol>\\n<li><strong>简化配置</strong>：通过YAML文件定义服务，避免重复的命令行参数</li>\\n<li><strong>批量管理</strong>：可以一次性启动、停止、重建多个服务</li>\\n<li><strong>环境隔离</strong>：不同的项目可以在不同的环境中运行</li>\\n<li><strong>可扩展性</strong>：支持服务的水平扩展</li>\\n<li><strong>版本控制</strong>：YAML文件可以纳入版本控制</li>\\n</ol>"}');export{E as comp,v as data};
