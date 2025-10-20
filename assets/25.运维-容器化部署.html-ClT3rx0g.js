import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as l,b as e,d as s,f as p,o as i,r as o}from"./app-DOXsNbB_.js";const c={},r=s("h1",{id:"运维-容器化部署",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#运维-容器化部署"},[s("span",null,"运维-容器化部署")])],-1),t=s("h2",{id:"概述",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#概述"},[s("span",null,"概述")])],-1),d=s("p",null,"随着云原生技术的发展，容器化部署已成为现代应用的标准实践。MongoDB在容器环境中的部署需要考虑数据持久化、高可用性、监控管理、网络配置等多个方面。本章将详细介绍MongoDB在Docker和Kubernetes环境中的最佳实践。",-1),v=s("p",null,"想象一个微服务架构的电商平台，需要在Kubernetes集群中部署MongoDB来支持订单、用户、商品等多个服务的数据存储需求。通过合理的容器化部署策略，包括StatefulSet、PVC存储、服务发现、自动扩缩容等技术，实现了数据库的弹性伸缩和高可用部署。",-1),E=p(`<h2 id="知识要点" tabindex="-1"><a class="header-anchor" href="#知识要点"><span>知识要点</span></a></h2><h3 id="_1-docker容器化部署" tabindex="-1"><a class="header-anchor" href="#_1-docker容器化部署"><span>1. Docker容器化部署</span></a></h3><h4 id="_1-1-单节点docker部署" tabindex="-1"><a class="header-anchor" href="#_1-1-单节点docker部署"><span>1.1 单节点Docker部署</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongodb</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo:6.0</span></span>
<span class="line"><span style="color:#85E89D;">    container_name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongodb</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_INITDB_ROOT_USERNAME</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">admin</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_INITDB_ROOT_PASSWORD</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">password123</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_INITDB_DATABASE</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">myapp</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;27017:27017&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongodb_data:/data/db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongodb_config:/data/configdb</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./init-scripts:/docker-entrypoint-initdb.d</span></span>
<span class="line"><span style="color:#85E89D;">    command</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">--replSet rs0 --bind_ip_all --keyFile /opt/keyfile/mongo-keyfile</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongodb_data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">local</span></span>
<span class="line"><span style="color:#85E89D;">  mongodb_config</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">local</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo-network</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-2-docker复制集部署" tabindex="-1"><a class="header-anchor" href="#_1-2-docker复制集部署"><span>1.2 Docker复制集部署</span></a></h4><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" data-title="yaml" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># docker-compose-replica.yml</span></span>
<span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo1</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo:6.0</span></span>
<span class="line"><span style="color:#85E89D;">    container_name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo1</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;27017:27017&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_REPLICA_SET_NAME</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">rs0</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo1_data:/data/db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./keyfile:/opt/keyfile</span></span>
<span class="line"><span style="color:#85E89D;">    command</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">      bash -c &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chmod 400 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chown 999:999 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        exec docker-entrypoint.sh mongod --replSet rs0 --keyFile /opt/keyfile/mongo-keyfile --bind_ip_all</span></span>
<span class="line"><span style="color:#9ECBFF;">      &quot;</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo-cluster</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  mongo2</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo:6.0</span></span>
<span class="line"><span style="color:#85E89D;">    container_name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo2</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;27018:27017&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_REPLICA_SET_NAME</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">rs0</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo2_data:/data/db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./keyfile:/opt/keyfile</span></span>
<span class="line"><span style="color:#85E89D;">    command</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">      bash -c &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chmod 400 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chown 999:999 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        exec docker-entrypoint.sh mongod --replSet rs0 --keyFile /opt/keyfile/mongo-keyfile --bind_ip_all</span></span>
<span class="line"><span style="color:#9ECBFF;">      &quot;</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo-cluster</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">  mongo3</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo:6.0</span></span>
<span class="line"><span style="color:#85E89D;">    container_name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">mongo3</span></span>
<span class="line"><span style="color:#85E89D;">    restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#85E89D;">    ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;27019:27017&quot;</span></span>
<span class="line"><span style="color:#85E89D;">    environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">      MONGO_REPLICA_SET_NAME</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">rs0</span></span>
<span class="line"><span style="color:#85E89D;">    volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo3_data:/data/db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">./keyfile:/opt/keyfile</span></span>
<span class="line"><span style="color:#85E89D;">    command</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">      bash -c &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chmod 400 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        chown 999:999 /opt/keyfile/mongo-keyfile &amp;&amp;</span></span>
<span class="line"><span style="color:#9ECBFF;">        exec docker-entrypoint.sh mongod --replSet rs0 --keyFile /opt/keyfile/mongo-keyfile --bind_ip_all</span></span>
<span class="line"><span style="color:#9ECBFF;">      &quot;</span></span>
<span class="line"><span style="color:#85E89D;">    networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">mongo-cluster</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo1_data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo2_data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo3_data</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">networks</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">  mongo-cluster</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#85E89D;">    driver</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-kubernetes部署" tabindex="-1"><a class="header-anchor" href="#_2-kubernetes部署"><span>2. Kubernetes部署</span></a></h3><h4 id="_2-1-statefulset部署配置" tabindex="-1"><a class="header-anchor" href="#_2-1-statefulset部署配置"><span>2.1 StatefulSet部署配置</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Component</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> MongoKubernetesDeployment</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 生成MongoDB StatefulSet配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateStatefulSetConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String statefulSetYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: apps/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: StatefulSet</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              serviceName: mongodb-headless</span></span>
<span class="line"><span style="color:#9ECBFF;">              replicas: 3</span></span>
<span class="line"><span style="color:#9ECBFF;">              selector:</span></span>
<span class="line"><span style="color:#9ECBFF;">                matchLabels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              template:</span></span>
<span class="line"><span style="color:#9ECBFF;">                metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  labels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">                spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  terminationGracePeriodSeconds: 30</span></span>
<span class="line"><span style="color:#9ECBFF;">                  containers:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">                    image: mongo:6.0</span></span>
<span class="line"><span style="color:#9ECBFF;">                    command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - mongod</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - --replSet=rs0</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - --bind_ip_all</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - --keyFile=/etc/secrets-volume/mongo-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">                    ports:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - containerPort: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                      name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">                    env:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: MONGO_INITDB_ROOT_USERNAME</span></span>
<span class="line"><span style="color:#9ECBFF;">                      valueFrom:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        secretKeyRef:</span></span>
<span class="line"><span style="color:#9ECBFF;">                          name: mongodb-secret</span></span>
<span class="line"><span style="color:#9ECBFF;">                          key: username</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: MONGO_INITDB_ROOT_PASSWORD</span></span>
<span class="line"><span style="color:#9ECBFF;">                      valueFrom:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        secretKeyRef:</span></span>
<span class="line"><span style="color:#9ECBFF;">                          name: mongodb-secret</span></span>
<span class="line"><span style="color:#9ECBFF;">                          key: password</span></span>
<span class="line"><span style="color:#9ECBFF;">                    volumeMounts:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: mongodb-data</span></span>
<span class="line"><span style="color:#9ECBFF;">                      mountPath: /data/db</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: mongodb-config</span></span>
<span class="line"><span style="color:#9ECBFF;">                      mountPath: /data/configdb</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: mongo-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">                      mountPath: /etc/secrets-volume</span></span>
<span class="line"><span style="color:#9ECBFF;">                      readOnly: true</span></span>
<span class="line"><span style="color:#9ECBFF;">                    resources:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      requests:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        memory: &quot;1Gi&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        cpu: &quot;500m&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      limits:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        memory: &quot;2Gi&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        cpu: &quot;1000m&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                    livenessProbe:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      exec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - mongo</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - --eval</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - &quot;db.adminCommand(&#39;ping&#39;)&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      initialDelaySeconds: 30</span></span>
<span class="line"><span style="color:#9ECBFF;">                      periodSeconds: 10</span></span>
<span class="line"><span style="color:#9ECBFF;">                      timeoutSeconds: 5</span></span>
<span class="line"><span style="color:#9ECBFF;">                    readinessProbe:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      exec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - mongo</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - --eval</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - &quot;db.adminCommand(&#39;ping&#39;)&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      initialDelaySeconds: 5</span></span>
<span class="line"><span style="color:#9ECBFF;">                      periodSeconds: 10</span></span>
<span class="line"><span style="color:#9ECBFF;">                      timeoutSeconds: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">                  volumes:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - name: mongo-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">                    secret:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      secretName: mongodb-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">                      defaultMode: 0400</span></span>
<span class="line"><span style="color:#9ECBFF;">              volumeClaimTemplates:</span></span>
<span class="line"><span style="color:#9ECBFF;">              - metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  name: mongodb-data</span></span>
<span class="line"><span style="color:#9ECBFF;">                spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  accessModes: [&quot;ReadWriteOnce&quot;]</span></span>
<span class="line"><span style="color:#9ECBFF;">                  storageClassName: &quot;fast-ssd&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  resources:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    requests:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      storage: 20Gi</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB StatefulSet配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(statefulSetYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 生成服务发现配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateServiceConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String headlessServiceYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Service</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-headless</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">              labels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              clusterIP: None</span></span>
<span class="line"><span style="color:#9ECBFF;">              selector:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              ports:</span></span>
<span class="line"><span style="color:#9ECBFF;">              - port: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                targetPort: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">            ---</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Service</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-external</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">              labels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              selector:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">                statefulset.kubernetes.io/pod-name: mongodb-0</span></span>
<span class="line"><span style="color:#9ECBFF;">              ports:</span></span>
<span class="line"><span style="color:#9ECBFF;">              - port: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                targetPort: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              type: ClusterIP</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB服务配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(headlessServiceYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 生成Secret配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateSecretConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String secretYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Secret</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-secret</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            type: Opaque</span></span>
<span class="line"><span style="color:#9ECBFF;">            data:</span></span>
<span class="line"><span style="color:#9ECBFF;">              username: YWRtaW4=  # admin</span></span>
<span class="line"><span style="color:#9ECBFF;">              password: cGFzc3dvcmQxMjM=  # password123</span></span>
<span class="line"><span style="color:#9ECBFF;">            ---</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Secret</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            type: Opaque</span></span>
<span class="line"><span style="color:#9ECBFF;">            data:</span></span>
<span class="line"><span style="color:#9ECBFF;">              mongo-keyfile: |</span></span>
<span class="line"><span style="color:#9ECBFF;">                T1BFTlNTTCBHRU5FUkFURUQgS0VZRklMRQo=</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB Secret配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(secretYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-初始化和配置管理" tabindex="-1"><a class="header-anchor" href="#_2-2-初始化和配置管理"><span>2.2 初始化和配置管理</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Service</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> MongoKubernetesInitService</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 复制集初始化作业</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateInitJob</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String initJobYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: batch/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Job</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-init</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              template:</span></span>
<span class="line"><span style="color:#9ECBFF;">                spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  restartPolicy: OnFailure</span></span>
<span class="line"><span style="color:#9ECBFF;">                  containers:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - name: mongodb-init</span></span>
<span class="line"><span style="color:#9ECBFF;">                    image: mongo:6.0</span></span>
<span class="line"><span style="color:#9ECBFF;">                    command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - /bin/bash</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - -c</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - |</span></span>
<span class="line"><span style="color:#9ECBFF;">                      set -e</span></span>
<span class="line"><span style="color:#9ECBFF;">                      echo &quot;等待MongoDB启动...&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      until mongo --host mongodb-0.mongodb-headless:27017 --eval &quot;print(&#39;MongoDB连接成功&#39;)&quot; &gt; /dev/null 2&gt;&amp;1; do</span></span>
<span class="line"><span style="color:#9ECBFF;">                        echo &quot;等待中...&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        sleep 2</span></span>
<span class="line"><span style="color:#9ECBFF;">                      done</span></span>
<span class="line"><span style="color:#9ECBFF;">                      </span></span>
<span class="line"><span style="color:#9ECBFF;">                      echo &quot;初始化复制集...&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      mongo --host mongodb-0.mongodb-headless:27017 --eval &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        rs.initiate({</span></span>
<span class="line"><span style="color:#9ECBFF;">                          _id: &#39;rs0&#39;,</span></span>
<span class="line"><span style="color:#9ECBFF;">                          members: [</span></span>
<span class="line"><span style="color:#9ECBFF;">                            { _id: 0, host: &#39;mongodb-0.mongodb-headless:27017&#39;, priority: 2 },</span></span>
<span class="line"><span style="color:#9ECBFF;">                            { _id: 1, host: &#39;mongodb-1.mongodb-headless:27017&#39;, priority: 1 },</span></span>
<span class="line"><span style="color:#9ECBFF;">                            { _id: 2, host: &#39;mongodb-2.mongodb-headless:27017&#39;, priority: 1 }</span></span>
<span class="line"><span style="color:#9ECBFF;">                          ]</span></span>
<span class="line"><span style="color:#9ECBFF;">                        })</span></span>
<span class="line"><span style="color:#9ECBFF;">                      &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      </span></span>
<span class="line"><span style="color:#9ECBFF;">                      echo &quot;等待复制集选举...&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      sleep 10</span></span>
<span class="line"><span style="color:#9ECBFF;">                      </span></span>
<span class="line"><span style="color:#9ECBFF;">                      echo &quot;创建管理员用户...&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      mongo --host mongodb-0.mongodb-headless:27017 --eval &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        db.getSiblingDB(&#39;admin&#39;).createUser({</span></span>
<span class="line"><span style="color:#9ECBFF;">                          user: &#39;admin&#39;,</span></span>
<span class="line"><span style="color:#9ECBFF;">                          pwd: &#39;password123&#39;,</span></span>
<span class="line"><span style="color:#9ECBFF;">                          roles: [&#39;root&#39;]</span></span>
<span class="line"><span style="color:#9ECBFF;">                        })</span></span>
<span class="line"><span style="color:#9ECBFF;">                      &quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      </span></span>
<span class="line"><span style="color:#9ECBFF;">                      echo &quot;初始化完成&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB初始化作业配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(initJobYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * ConfigMap配置管理</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateConfigMap</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String configMapYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: ConfigMap</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-config</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            data:</span></span>
<span class="line"><span style="color:#9ECBFF;">              mongod.conf: |</span></span>
<span class="line"><span style="color:#9ECBFF;">                storage:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  dbPath: /data/db</span></span>
<span class="line"><span style="color:#9ECBFF;">                  journal:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    enabled: true</span></span>
<span class="line"><span style="color:#9ECBFF;">                  wiredTiger:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    engineConfig:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      cacheSizeGB: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">                systemLog:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  destination: file</span></span>
<span class="line"><span style="color:#9ECBFF;">                  logAppend: true</span></span>
<span class="line"><span style="color:#9ECBFF;">                  path: /var/log/mongodb/mongod.log</span></span>
<span class="line"><span style="color:#9ECBFF;">                  verbosity: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">                net:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  port: 27017</span></span>
<span class="line"><span style="color:#9ECBFF;">                  bindIp: 0.0.0.0</span></span>
<span class="line"><span style="color:#9ECBFF;">                replication:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  replSetName: rs0</span></span>
<span class="line"><span style="color:#9ECBFF;">                security:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  keyFile: /etc/secrets-volume/mongo-keyfile</span></span>
<span class="line"><span style="color:#9ECBFF;">                  authorization: enabled</span></span>
<span class="line"><span style="color:#9ECBFF;">                operationProfiling:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  slowOpThresholdMs: 100</span></span>
<span class="line"><span style="color:#9ECBFF;">                  mode: slowOp</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB ConfigMap配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(configMapYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-容器监控与管理" tabindex="-1"><a class="header-anchor" href="#_3-容器监控与管理"><span>3. 容器监控与管理</span></a></h3><h4 id="_3-1-监控配置" tabindex="-1"><a class="header-anchor" href="#_3-1-监控配置"><span>3.1 监控配置</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Service</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> MongoContainerMonitoringService</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * Prometheus监控配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generatePrometheusConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String monitoringYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Service</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">              labels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              ports:</span></span>
<span class="line"><span style="color:#9ECBFF;">              - port: 9216</span></span>
<span class="line"><span style="color:#9ECBFF;">                targetPort: 9216</span></span>
<span class="line"><span style="color:#9ECBFF;">                name: metrics</span></span>
<span class="line"><span style="color:#9ECBFF;">              selector:</span></span>
<span class="line"><span style="color:#9ECBFF;">                app: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">            ---</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: apps/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: Deployment</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              replicas: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">              selector:</span></span>
<span class="line"><span style="color:#9ECBFF;">                matchLabels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  app: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">              template:</span></span>
<span class="line"><span style="color:#9ECBFF;">                metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  labels:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    app: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">                spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  containers:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - name: mongodb-exporter</span></span>
<span class="line"><span style="color:#9ECBFF;">                    image: percona/mongodb_exporter:0.35</span></span>
<span class="line"><span style="color:#9ECBFF;">                    ports:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - containerPort: 9216</span></span>
<span class="line"><span style="color:#9ECBFF;">                      name: metrics</span></span>
<span class="line"><span style="color:#9ECBFF;">                    env:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: MONGODB_URI</span></span>
<span class="line"><span style="color:#9ECBFF;">                      value: &quot;mongodb://admin:password123@mongodb-external:27017/admin&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: MONGODB_DIRECT_CONNECT</span></span>
<span class="line"><span style="color:#9ECBFF;">                      value: &quot;true&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                    - name: MONGODB_COLLECT_ALL</span></span>
<span class="line"><span style="color:#9ECBFF;">                      value: &quot;true&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                    resources:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      requests:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        memory: &quot;128Mi&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        cpu: &quot;100m&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                      limits:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        memory: &quot;256Mi&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">                        cpu: &quot;200m&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB Prometheus监控配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(monitoringYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 健康检查配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> configureHealthChecks</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;=== MongoDB容器健康检查配置 ===&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String livenessProbe </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            livenessProbe:</span></span>
<span class="line"><span style="color:#9ECBFF;">              exec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                - mongo</span></span>
<span class="line"><span style="color:#9ECBFF;">                - --eval</span></span>
<span class="line"><span style="color:#9ECBFF;">                - &quot;db.adminCommand(&#39;ping&#39;)&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">              initialDelaySeconds: 30</span></span>
<span class="line"><span style="color:#9ECBFF;">              periodSeconds: 10</span></span>
<span class="line"><span style="color:#9ECBFF;">              timeoutSeconds: 5</span></span>
<span class="line"><span style="color:#9ECBFF;">              failureThreshold: 3</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String readinessProbe </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            readinessProbe:</span></span>
<span class="line"><span style="color:#9ECBFF;">              exec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                - mongo</span></span>
<span class="line"><span style="color:#9ECBFF;">                - --eval</span></span>
<span class="line"><span style="color:#9ECBFF;">                - &quot;db.adminCommand(&#39;ismaster&#39;)&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">              initialDelaySeconds: 5</span></span>
<span class="line"><span style="color:#9ECBFF;">              periodSeconds: 10</span></span>
<span class="line"><span style="color:#9ECBFF;">              timeoutSeconds: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">              successThreshold: 1</span></span>
<span class="line"><span style="color:#9ECBFF;">              failureThreshold: 3</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;存活性探针配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(livenessProbe);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;就绪性探针配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(readinessProbe);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 日志收集配置</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateLoggingConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String fluentdConfigYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: ConfigMap</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: fluentd-mongodb-config</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            data:</span></span>
<span class="line"><span style="color:#9ECBFF;">              fluent.conf: |</span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;source&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  @type tail</span></span>
<span class="line"><span style="color:#9ECBFF;">                  path /var/log/mongodb/mongod.log</span></span>
<span class="line"><span style="color:#9ECBFF;">                  pos_file /var/log/fluentd-mongodb.log.pos</span></span>
<span class="line"><span style="color:#9ECBFF;">                  tag mongodb.log</span></span>
<span class="line"><span style="color:#9ECBFF;">                  format json</span></span>
<span class="line"><span style="color:#9ECBFF;">                  time_format %Y-%m-%dT%H:%M:%S.%L%z</span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;/source&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                </span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;filter mongodb.log&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  @type parser</span></span>
<span class="line"><span style="color:#9ECBFF;">                  key_name message</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &lt;parse&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                    @type json</span></span>
<span class="line"><span style="color:#9ECBFF;">                    time_format %Y-%m-%dT%H:%M:%S.%L%z</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &lt;/parse&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;/filter&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                </span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;match mongodb.log&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  @type elasticsearch</span></span>
<span class="line"><span style="color:#9ECBFF;">                  host elasticsearch-service</span></span>
<span class="line"><span style="color:#9ECBFF;">                  port 9200</span></span>
<span class="line"><span style="color:#9ECBFF;">                  index_name mongodb-logs</span></span>
<span class="line"><span style="color:#9ECBFF;">                  type_name _doc</span></span>
<span class="line"><span style="color:#9ECBFF;">                &lt;/match&gt;</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB日志收集配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(fluentdConfigYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-自动化运维" tabindex="-1"><a class="header-anchor" href="#_4-自动化运维"><span>4. 自动化运维</span></a></h3><h4 id="_4-1-自动扩缩容" tabindex="-1"><a class="header-anchor" href="#_4-1-自动扩缩容"><span>4.1 自动扩缩容</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#E1E4E8;">@</span><span style="color:#F97583;">Service</span></span>
<span class="line"><span style="color:#F97583;">public</span><span style="color:#F97583;"> class</span><span style="color:#B392F0;"> MongoAutoScalingService</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * HPA配置（基于CPU和内存）</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateHPAConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String hpaYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: autoscaling/v2</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: HorizontalPodAutoscaler</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-hpa</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              scaleTargetRef:</span></span>
<span class="line"><span style="color:#9ECBFF;">                apiVersion: apps/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">                kind: StatefulSet</span></span>
<span class="line"><span style="color:#9ECBFF;">                name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              minReplicas: 3</span></span>
<span class="line"><span style="color:#9ECBFF;">              maxReplicas: 7</span></span>
<span class="line"><span style="color:#9ECBFF;">              metrics:</span></span>
<span class="line"><span style="color:#9ECBFF;">              - type: Resource</span></span>
<span class="line"><span style="color:#9ECBFF;">                resource:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  name: cpu</span></span>
<span class="line"><span style="color:#9ECBFF;">                  target:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    type: Utilization</span></span>
<span class="line"><span style="color:#9ECBFF;">                    averageUtilization: 70</span></span>
<span class="line"><span style="color:#9ECBFF;">              - type: Resource</span></span>
<span class="line"><span style="color:#9ECBFF;">                resource:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  name: memory</span></span>
<span class="line"><span style="color:#9ECBFF;">                  target:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    type: Utilization</span></span>
<span class="line"><span style="color:#9ECBFF;">                    averageUtilization: 80</span></span>
<span class="line"><span style="color:#9ECBFF;">              behavior:</span></span>
<span class="line"><span style="color:#9ECBFF;">                scaleUp:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  stabilizationWindowSeconds: 300</span></span>
<span class="line"><span style="color:#9ECBFF;">                  policies:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - type: Percent</span></span>
<span class="line"><span style="color:#9ECBFF;">                    value: 50</span></span>
<span class="line"><span style="color:#9ECBFF;">                    periodSeconds: 60</span></span>
<span class="line"><span style="color:#9ECBFF;">                scaleDown:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  stabilizationWindowSeconds: 600</span></span>
<span class="line"><span style="color:#9ECBFF;">                  policies:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  - type: Percent</span></span>
<span class="line"><span style="color:#9ECBFF;">                    value: 25</span></span>
<span class="line"><span style="color:#9ECBFF;">                    periodSeconds: 60</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB HPA配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(hpaYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * VPA配置（垂直扩缩容）</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateVPAConfig</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String vpaYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: autoscaling.k8s.io/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: VerticalPodAutoscaler</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-vpa</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              targetRef:</span></span>
<span class="line"><span style="color:#9ECBFF;">                apiVersion: apps/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">                kind: StatefulSet</span></span>
<span class="line"><span style="color:#9ECBFF;">                name: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">              updatePolicy:</span></span>
<span class="line"><span style="color:#9ECBFF;">                updateMode: &quot;Auto&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">              resourcePolicy:</span></span>
<span class="line"><span style="color:#9ECBFF;">                containerPolicies:</span></span>
<span class="line"><span style="color:#9ECBFF;">                - containerName: mongodb</span></span>
<span class="line"><span style="color:#9ECBFF;">                  minAllowed:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    cpu: 100m</span></span>
<span class="line"><span style="color:#9ECBFF;">                    memory: 500Mi</span></span>
<span class="line"><span style="color:#9ECBFF;">                  maxAllowed:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    cpu: 2</span></span>
<span class="line"><span style="color:#9ECBFF;">                    memory: 4Gi</span></span>
<span class="line"><span style="color:#9ECBFF;">                  controlledResources: [&quot;cpu&quot;, &quot;memory&quot;]</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB VPA配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(vpaYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    /**</span></span>
<span class="line"><span style="color:#6A737D;">     * 自动备份CronJob</span></span>
<span class="line"><span style="color:#6A737D;">     */</span></span>
<span class="line"><span style="color:#F97583;">    public</span><span style="color:#F97583;"> void</span><span style="color:#B392F0;"> generateBackupCronJob</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        String backupCronJobYaml </span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;"> &quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#9ECBFF;">            apiVersion: batch/v1</span></span>
<span class="line"><span style="color:#9ECBFF;">            kind: CronJob</span></span>
<span class="line"><span style="color:#9ECBFF;">            metadata:</span></span>
<span class="line"><span style="color:#9ECBFF;">              name: mongodb-backup</span></span>
<span class="line"><span style="color:#9ECBFF;">              namespace: database</span></span>
<span class="line"><span style="color:#9ECBFF;">            spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">              schedule: &quot;0 2 * * *&quot;  # 每天凌晨2点</span></span>
<span class="line"><span style="color:#9ECBFF;">              jobTemplate:</span></span>
<span class="line"><span style="color:#9ECBFF;">                spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                  template:</span></span>
<span class="line"><span style="color:#9ECBFF;">                    spec:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      restartPolicy: OnFailure</span></span>
<span class="line"><span style="color:#9ECBFF;">                      containers:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      - name: mongodb-backup</span></span>
<span class="line"><span style="color:#9ECBFF;">                        image: mongo:6.0</span></span>
<span class="line"><span style="color:#9ECBFF;">                        command:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - /bin/bash</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - -c</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - |</span></span>
<span class="line"><span style="color:#9ECBFF;">                          DATE=$(date +%Y%m%d_%H%M%S)</span></span>
<span class="line"><span style="color:#9ECBFF;">                          mongodump --host mongodb-external:27017 </span><span style="color:#79B8FF;">\\\\</span></span>
<span class="line"><span style="color:#9ECBFF;">                                   --username admin </span><span style="color:#79B8FF;">\\\\</span></span>
<span class="line"><span style="color:#9ECBFF;">                                   --password password123 </span><span style="color:#79B8FF;">\\\\</span></span>
<span class="line"><span style="color:#9ECBFF;">                                   --authenticationDatabase admin </span><span style="color:#79B8FF;">\\\\</span></span>
<span class="line"><span style="color:#9ECBFF;">                                   --out /backup/mongodb_backup_$DATE</span></span>
<span class="line"><span style="color:#9ECBFF;">                          </span></span>
<span class="line"><span style="color:#9ECBFF;">                          # 压缩备份文件</span></span>
<span class="line"><span style="color:#9ECBFF;">                          tar -czf /backup/mongodb_backup_$DATE.tar.gz /backup/mongodb_backup_$DATE</span></span>
<span class="line"><span style="color:#9ECBFF;">                          rm -rf /backup/mongodb_backup_$DATE</span></span>
<span class="line"><span style="color:#9ECBFF;">                          </span></span>
<span class="line"><span style="color:#9ECBFF;">                          # 清理7天前的备份</span></span>
<span class="line"><span style="color:#9ECBFF;">                          find /backup -name &quot;mongodb_backup_*.tar.gz&quot; -mtime +7 -delete</span></span>
<span class="line"><span style="color:#9ECBFF;">                        volumeMounts:</span></span>
<span class="line"><span style="color:#9ECBFF;">                        - name: backup-storage</span></span>
<span class="line"><span style="color:#9ECBFF;">                          mountPath: /backup</span></span>
<span class="line"><span style="color:#9ECBFF;">                      volumes:</span></span>
<span class="line"><span style="color:#9ECBFF;">                      - name: backup-storage</span></span>
<span class="line"><span style="color:#9ECBFF;">                        persistentVolumeClaim:</span></span>
<span class="line"><span style="color:#9ECBFF;">                          claimName: mongodb-backup-pvc</span></span>
<span class="line"><span style="color:#9ECBFF;">            &quot;&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;MongoDB自动备份CronJob配置:&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        System.out.</span><span style="color:#B392F0;">println</span><span style="color:#E1E4E8;">(backupCronJobYaml);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="知识扩展" tabindex="-1"><a class="header-anchor" href="#知识扩展"><span>知识扩展</span></a></h2><h3 id="_1-设计思想" tabindex="-1"><a class="header-anchor" href="#_1-设计思想"><span>1. 设计思想</span></a></h3><p>MongoDB容器化部署基于以下核心原则：</p><ol><li><strong>数据持久化</strong>：使用PV/PVC确保数据在容器重启后不丢失</li><li><strong>服务发现</strong>：通过Headless Service实现复制集内部通信</li><li><strong>高可用性</strong>：利用StatefulSet保证Pod的有序部署和稳定网络标识</li><li><strong>可观测性</strong>：集成监控、日志、健康检查等运维能力</li></ol><h3 id="_2-避坑指南" tabindex="-1"><a class="header-anchor" href="#_2-避坑指南"><span>2. 避坑指南</span></a></h3><ol><li><p><strong>存储配置</strong>：</p><ul><li>务必使用持久化存储，避免数据丢失</li><li>选择高性能存储类型（如SSD）提升I/O性能</li><li>合理设置存储容量和备份策略</li></ul></li><li><p><strong>网络配置</strong>：</p><ul><li>使用StatefulSet确保Pod名称稳定</li><li>配置Headless Service支持集群内部发现</li><li>注意防火墙和网络策略配置</li></ul></li><li><p><strong>资源管理</strong>：</p><ul><li>设置合理的CPU和内存限制</li><li>配置健康检查避免服务不可用</li><li>实施监控和告警机制</li></ul></li></ol><h3 id="_3-深度思考题" tabindex="-1"><a class="header-anchor" href="#_3-深度思考题"><span>3. 深度思考题</span></a></h3><ol><li><p><strong>数据迁移</strong>：如何在不停机的情况下将传统部署的MongoDB迁移到容器化环境？</p></li><li><p><strong>灾难恢复</strong>：容器化MongoDB的灾难恢复策略应该如何设计？</p></li><li><p><strong>性能优化</strong>：容器化部署对MongoDB性能有什么影响，如何优化？</p></li></ol><p><strong>深度思考题解答：</strong></p><ol><li><p><strong>无停机数据迁移策略</strong>：</p><ul><li>建立新的容器化复制集作为从节点</li><li>等待数据同步完成后进行主从切换</li><li>逐步迁移应用连接到新环境</li><li>验证数据一致性后下线旧环境</li></ul></li><li><p><strong>容器化灾难恢复设计</strong>：</p><ul><li>跨可用区部署复制集节点</li><li>定期备份到对象存储（如S3）</li><li>实施数据恢复演练和验证</li><li>建立完整的故障转移预案</li></ul></li><li><p><strong>容器化性能优化</strong>：</p><ul><li>使用专用节点运行数据库Pod</li><li>优化存储I/O性能（使用本地SSD）</li><li>调整容器资源限制和Kubernetes调度策略</li><li>监控和调优网络性能</li></ul></li></ol><p>MongoDB容器化部署为现代云原生应用提供了强大的数据存储支撑，需要综合考虑存储、网络、监控、安全等多个维度来构建生产级的部署方案。</p>`,28);function m(F,u){const n=o("Mermaid");return i(),l("div",null,[r,t,d,v,e(n,{id:"mermaid-12",code:"eJxLL0osyFAIceJSAILi0iQIX8m7NCm1KC+1JLX45ey25/uWKIHlUdX45uel57s4PV3S+7RjG1AZQg0IOEbnguR1DWySivTtAooycxOLKmNRlDhBlRiClQSnJufnpWAocoYqMsKlKDUvBc7G4sqna2c8bVrxdGMTqvNcogPCnKGOe9bT+GRn69Pe7ag2u4KVQByHQ4kbWAnEaViUEHDa870Tn++eg+E092iP1MSUnNTiYoXg1KKyzORUVEs9ol0rSoCxk5iDKU8oMHZNeT4FMzA8o1+sW/S0d+qzOb1Puxai2uYVDdTxrGM7Njnv6KdT255ObkSXg7kCRoMJRwVdXV0FFzDbCcx2BbOdwWw3MNsdzHZEYkMSJoTtDGZ7IKnxBLLtFDzAbC8ktjeUDQDC09Iq"}),E])}const B=a(c,[["render",m],["__file","25.运维-容器化部署.html.vue"]]),C=JSON.parse('{"path":"/database/Mongo%E6%95%B0%E6%8D%AE%E5%BA%93/25.%E8%BF%90%E7%BB%B4-%E5%AE%B9%E5%99%A8%E5%8C%96%E9%83%A8%E7%BD%B2.html","title":"运维-容器化部署","lang":"zh-CN","frontmatter":{"order":250,"description":"运维-容器化部署 概述 随着云原生技术的发展，容器化部署已成为现代应用的标准实践。MongoDB在容器环境中的部署需要考虑数据持久化、高可用性、监控管理、网络配置等多个方面。本章将详细介绍MongoDB在Docker和Kubernetes环境中的最佳实践。 想象一个微服务架构的电商平台，需要在Kubernetes集群中部署MongoDB来支持订单、用户...","head":[["meta",{"property":"og:url","content":"https://lindaifeng.github.io/database/Mongo%E6%95%B0%E6%8D%AE%E5%BA%93/25.%E8%BF%90%E7%BB%B4-%E5%AE%B9%E5%99%A8%E5%8C%96%E9%83%A8%E7%BD%B2.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"运维-容器化部署"}],["meta",{"property":"og:description","content":"运维-容器化部署 概述 随着云原生技术的发展，容器化部署已成为现代应用的标准实践。MongoDB在容器环境中的部署需要考虑数据持久化、高可用性、监控管理、网络配置等多个方面。本章将详细介绍MongoDB在Docker和Kubernetes环境中的最佳实践。 想象一个微服务架构的电商平台，需要在Kubernetes集群中部署MongoDB来支持订单、用户..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-09-18T02:54:27.000Z"}],["meta",{"property":"article:author","content":"清峰"}],["meta",{"property":"article:modified_time","content":"2025-09-18T02:54:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"运维-容器化部署\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-09-18T02:54:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清峰\\",\\"url\\":\\"https://lindaifeng.github.io\\"}]}"]]},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"知识要点","slug":"知识要点","link":"#知识要点","children":[{"level":3,"title":"1. Docker容器化部署","slug":"_1-docker容器化部署","link":"#_1-docker容器化部署","children":[]},{"level":3,"title":"2. Kubernetes部署","slug":"_2-kubernetes部署","link":"#_2-kubernetes部署","children":[]},{"level":3,"title":"3. 容器监控与管理","slug":"_3-容器监控与管理","link":"#_3-容器监控与管理","children":[]},{"level":3,"title":"4. 自动化运维","slug":"_4-自动化运维","link":"#_4-自动化运维","children":[]}]},{"level":2,"title":"知识扩展","slug":"知识扩展","link":"#知识扩展","children":[{"level":3,"title":"1. 设计思想","slug":"_1-设计思想","link":"#_1-设计思想","children":[]},{"level":3,"title":"2. 避坑指南","slug":"_2-避坑指南","link":"#_2-避坑指南","children":[]},{"level":3,"title":"3. 深度思考题","slug":"_3-深度思考题","link":"#_3-深度思考题","children":[]}]}],"git":{"createdTime":1757499384000,"updatedTime":1758164067000,"contributors":[{"name":"ldf","email":"1305366530@qq.com","commits":2}]},"readingTime":{"minutes":7.47,"words":2241},"filePathRelative":"database/Mongo数据库/25.运维-容器化部署.md","localizedDate":"2025年9月10日","autoDesc":true,"excerpt":"\\n<h2>概述</h2>\\n<p>随着云原生技术的发展，容器化部署已成为现代应用的标准实践。MongoDB在容器环境中的部署需要考虑数据持久化、高可用性、监控管理、网络配置等多个方面。本章将详细介绍MongoDB在Docker和Kubernetes环境中的最佳实践。</p>\\n<p>想象一个微服务架构的电商平台，需要在Kubernetes集群中部署MongoDB来支持订单、用户、商品等多个服务的数据存储需求。通过合理的容器化部署策略，包括StatefulSet、PVC存储、服务发现、自动扩缩容等技术，实现了数据库的弹性伸缩和高可用部署。</p>\\n<h2>知识要点</h2>\\n<h3>1. Docker容器化部署</h3>"}');export{B as comp,C as data};
