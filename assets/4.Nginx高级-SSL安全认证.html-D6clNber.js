import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as e,f as s,o as p,r as i}from"./app-DOXsNbB_.js";const o={},c=s('<h1 id="nginx高级-ssl安全认证" tabindex="-1"><a class="header-anchor" href="#nginx高级-ssl安全认证"><span>Nginx高级-SSL安全认证</span></a></h1><h2 id="业务场景引入" tabindex="-1"><a class="header-anchor" href="#业务场景引入"><span>业务场景引入</span></a></h2><p>在构建金融支付平台时，安全是最重要的考虑因素。平台需要满足以下安全要求：</p><ol><li><strong>数据传输加密</strong>：所有用户敏感信息（如银行卡号、身份证号、交易密码）必须在传输过程中加密</li><li><strong>身份认证</strong>：确保用户访问的是真实的银行网站，防止钓鱼攻击</li><li><strong>合规要求</strong>：满足PCI DSS、GDPR等安全标准和法规要求</li><li><strong>性能保障</strong>：在保证安全的前提下，不能显著影响系统性能</li><li><strong>证书管理</strong>：需要支持多域名证书、通配符证书，并能平滑更新证书</li></ol><p>这些需求正是Nginx SSL/TLS安全认证功能的核心应用场景。通过合理配置SSL/TLS，Nginx可以为Web应用提供强大的安全保护。</p><h2 id="ssl-tls基础概念" tabindex="-1"><a class="header-anchor" href="#ssl-tls基础概念"><span>SSL/TLS基础概念</span></a></h2><h3 id="什么是ssl-tls" tabindex="-1"><a class="header-anchor" href="#什么是ssl-tls"><span>什么是SSL/TLS？</span></a></h3><p>SSL（Secure Sockets Layer）和TLS（Transport Layer Security）是用于在互联网上提供通信安全的加密协议。TLS是SSL的继任者，目前广泛使用的是TLS 1.2和TLS 1.3版本。</p><h3 id="ssl-tls工作原理" tabindex="-1"><a class="header-anchor" href="#ssl-tls工作原理"><span>SSL/TLS工作原理</span></a></h3>',9),r=s(`<h3 id="证书类型" tabindex="-1"><a class="header-anchor" href="#证书类型"><span>证书类型</span></a></h3><ol><li><strong>域名验证证书（DV）</strong>：仅验证域名所有权</li><li><strong>组织验证证书（OV）</strong>：验证域名所有权和组织信息</li><li><strong>扩展验证证书（EV）</strong>：最高级别的验证，显示绿色地址栏</li></ol><h2 id="ssl证书配置" tabindex="-1"><a class="header-anchor" href="#ssl证书配置"><span>SSL证书配置</span></a></h2><h3 id="基础ssl配置" tabindex="-1"><a class="header-anchor" href="#基础ssl配置"><span>基础SSL配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL证书配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL协议和加密套件</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_prefer_server_ciphers </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL会话优化</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_cache </span><span style="color:#E1E4E8;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_timeout </span><span style="color:#79B8FF;">10m</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_tickets </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # OCSP stapling</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling_verify </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    resolver </span><span style="color:#79B8FF;">8.8.8.8</span><span style="color:#79B8FF;"> 8.8.4.4</span><span style="color:#E1E4E8;"> valid=300s;</span></span>
<span class="line"><span style="color:#F97583;">    resolver_timeout </span><span style="color:#79B8FF;">5s</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 安全头设置</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=31536000; includeSubDomains&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options </span><span style="color:#9ECBFF;">&quot;nosniff&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">    index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="http到https重定向" tabindex="-1"><a class="header-anchor" href="#http到https重定向"><span>HTTP到HTTPS重定向</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 强制HTTPS重定向</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">80</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 301永久重定向到HTTPS</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#79B8FF;"> 301</span><span style="color:#E1E4E8;"> https://$server_name$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># HTTPS服务器配置</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # ... 其他SSL配置</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多域名证书配置" tabindex="-1"><a class="header-anchor" href="#多域名证书配置"><span>多域名证书配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com api.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 多域名证书</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/wildcard.example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/wildcard.example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SNI支持（默认启用）</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="通配符证书配置" tabindex="-1"><a class="header-anchor" href="#通配符证书配置"><span>通配符证书配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">*.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 通配符证书</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/wildcard.example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/wildcard.example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="高级ssl配置" tabindex="-1"><a class="header-anchor" href="#高级ssl配置"><span>高级SSL配置</span></a></h2><h3 id="tls-1-3优化配置" tabindex="-1"><a class="header-anchor" href="#tls-1-3优化配置"><span>TLS 1.3优化配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # TLS 1.3优化配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">ECDHE+AES256:ECDHE+CHACHA20:!DSS;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # TLS 1.3特定配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_conf_command </span><span style="color:#E1E4E8;">Options PrioritizeChaCha;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_conf_command </span><span style="color:#E1E4E8;">Ciphersuites TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 会话恢复优化</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_cache </span><span style="color:#E1E4E8;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_timeout </span><span style="color:#79B8FF;">10m</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_tickets </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;  </span><span style="color:#6A737D;"># TLS 1.3推荐启用</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 证书配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="客户端证书认证" tabindex="-1"><a class="header-anchor" href="#客户端证书认证"><span>客户端证书认证</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">secure.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 服务器证书</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/server.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/server.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 客户端证书认证</span></span>
<span class="line"><span style="color:#F97583;">    ssl_client_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/ca.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_verify_client </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_verify_depth </span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 客户端证书CRL检查</span></span>
<span class="line"><span style="color:#F97583;">    ssl_crl </span><span style="color:#E1E4E8;">/etc/nginx/ssl/ca.crl;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#6A737D;">        # 传递客户端证书信息</span></span>
<span class="line"><span style="color:#F97583;">        proxy_set_header </span><span style="color:#E1E4E8;">X-SSL-Client-Cert $ssl_client_cert;</span></span>
<span class="line"><span style="color:#F97583;">        proxy_set_header </span><span style="color:#E1E4E8;">X-SSL-Client-Verify $ssl_client_verify;</span></span>
<span class="line"><span style="color:#F97583;">        proxy_set_header </span><span style="color:#E1E4E8;">X-SSL-Client-S-DN $ssl_client_s_dn;</span></span>
<span class="line"><span style="color:#F97583;">        proxy_set_header </span><span style="color:#E1E4E8;">X-SSL-Client-I-DN $ssl_client_i_dn;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#F97583;">        proxy_pass </span><span style="color:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ocsp-stapling配置" tabindex="-1"><a class="header-anchor" href="#ocsp-stapling配置"><span>OCSP Stapling配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # OCSP Stapling配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling_verify </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # OCSP响应缓存</span></span>
<span class="line"><span style="color:#F97583;">    ssl_trusted_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/chain.crt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # DNS解析器</span></span>
<span class="line"><span style="color:#F97583;">    resolver </span><span style="color:#79B8FF;">8.8.8.8</span><span style="color:#79B8FF;"> 8.8.4.4</span><span style="color:#E1E4E8;"> valid=300s;</span></span>
<span class="line"><span style="color:#F97583;">    resolver_timeout </span><span style="color:#79B8FF;">5s</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # OCSP stapling缓存</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling_file </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.ocsp;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="证书管理与更新" tabindex="-1"><a class="header-anchor" href="#证书管理与更新"><span>证书管理与更新</span></a></h2><h3 id="let-s-encrypt自动化配置" tabindex="-1"><a class="header-anchor" href="#let-s-encrypt自动化配置"><span>Let&#39;s Encrypt自动化配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 使用Certbot自动化证书管理</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">80</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # Let&#39;s Encrypt验证路径</span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> /.well-known/acme-challenge/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/certbot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 其他请求重定向到HTTPS</span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> 301</span><span style="color:#E1E4E8;"> https://$server_name$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # Let&#39;s Encrypt证书路径</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/example.com/fullchain.pem;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/example.com/privkey.pem;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 证书更新后自动重载</span></span>
<span class="line"><span style="color:#F97583;">    ssl_trusted_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/example.com/chain.pem;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # ... 其他SSL配置</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="证书更新脚本" tabindex="-1"><a class="header-anchor" href="#证书更新脚本"><span>证书更新脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="color:#6A737D;"># SSL证书自动更新脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 设置变量</span></span>
<span class="line"><span style="color:#E1E4E8;">DOMAINS</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;example.com www.example.com api.example.com&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">EMAIL</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;admin@example.com&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">WEBROOT</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/var/www/certbot&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 更新证书</span></span>
<span class="line"><span style="color:#B392F0;">certbot</span><span style="color:#9ECBFF;"> certonly</span><span style="color:#79B8FF;"> --webroot</span><span style="color:#79B8FF;"> -w</span><span style="color:#E1E4E8;"> $WEBROOT </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> $DOMAINS </span><span style="color:#79B8FF;">--email</span><span style="color:#E1E4E8;"> $EMAIL </span><span style="color:#79B8FF;">--agree-tos</span><span style="color:#79B8FF;"> --non-interactive</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查更新结果</span></span>
<span class="line"><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> [ </span><span style="color:#79B8FF;">$?</span><span style="color:#F97583;"> -eq</span><span style="color:#79B8FF;"> 0</span><span style="color:#E1E4E8;"> ]; </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#79B8FF;">    echo</span><span style="color:#9ECBFF;"> &quot;Certificate updated successfully&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 测试Nginx配置</span></span>
<span class="line"><span style="color:#B392F0;">    nginx</span><span style="color:#79B8FF;"> -t</span></span>
<span class="line"><span style="color:#F97583;">    if</span><span style="color:#E1E4E8;"> [ </span><span style="color:#79B8FF;">$?</span><span style="color:#F97583;"> -eq</span><span style="color:#79B8FF;"> 0</span><span style="color:#E1E4E8;"> ]; </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#6A737D;">        # 重新加载Nginx配置</span></span>
<span class="line"><span style="color:#B392F0;">        systemctl</span><span style="color:#9ECBFF;"> reload</span><span style="color:#9ECBFF;"> nginx</span></span>
<span class="line"><span style="color:#79B8FF;">        echo</span><span style="color:#9ECBFF;"> &quot;Nginx reloaded successfully&quot;</span></span>
<span class="line"><span style="color:#F97583;">    else</span></span>
<span class="line"><span style="color:#79B8FF;">        echo</span><span style="color:#9ECBFF;"> &quot;Nginx configuration test failed&quot;</span></span>
<span class="line"><span style="color:#79B8FF;">        exit</span><span style="color:#79B8FF;"> 1</span></span>
<span class="line"><span style="color:#F97583;">    fi</span></span>
<span class="line"><span style="color:#F97583;">else</span></span>
<span class="line"><span style="color:#79B8FF;">    echo</span><span style="color:#9ECBFF;"> &quot;Certificate update failed&quot;</span></span>
<span class="line"><span style="color:#79B8FF;">    exit</span><span style="color:#79B8FF;"> 1</span></span>
<span class="line"><span style="color:#F97583;">fi</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="证书监控脚本" tabindex="-1"><a class="header-anchor" href="#证书监控脚本"><span>证书监控脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="color:#6A737D;"># SSL证书过期监控脚本</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 设置变量</span></span>
<span class="line"><span style="color:#E1E4E8;">CERT_PATH</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;/etc/letsencrypt/live&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">WARNING_DAYS</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查证书过期时间</span></span>
<span class="line"><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> domain_dir </span><span style="color:#F97583;">in</span><span style="color:#E1E4E8;"> $CERT_PATH</span><span style="color:#9ECBFF;">/*/</span><span style="color:#E1E4E8;">; </span><span style="color:#F97583;">do</span></span>
<span class="line"><span style="color:#F97583;">    if</span><span style="color:#E1E4E8;"> [ </span><span style="color:#F97583;">-d</span><span style="color:#9ECBFF;"> &quot;</span><span style="color:#E1E4E8;">$domain_dir</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;"> ]; </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#E1E4E8;">        domain</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">$(</span><span style="color:#B392F0;">basename</span><span style="color:#E1E4E8;"> $domain_dir)</span></span>
<span class="line"><span style="color:#E1E4E8;">        cert_file</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$domain_dir</span><span style="color:#9ECBFF;">/fullchain.pem&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#F97583;">        if</span><span style="color:#E1E4E8;"> [ </span><span style="color:#F97583;">-f</span><span style="color:#9ECBFF;"> &quot;</span><span style="color:#E1E4E8;">$cert_file</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;"> ]; </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#6A737D;">            # 获取证书过期时间</span></span>
<span class="line"><span style="color:#E1E4E8;">            expire_date</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">$(</span><span style="color:#B392F0;">openssl</span><span style="color:#9ECBFF;"> x509</span><span style="color:#79B8FF;"> -in</span><span style="color:#E1E4E8;"> $cert_file </span><span style="color:#79B8FF;">-noout</span><span style="color:#79B8FF;"> -enddate</span><span style="color:#F97583;"> |</span><span style="color:#B392F0;"> cut</span><span style="color:#79B8FF;"> -d=</span><span style="color:#79B8FF;"> -f2</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">            expire_timestamp</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">$(</span><span style="color:#B392F0;">date</span><span style="color:#79B8FF;"> -d</span><span style="color:#9ECBFF;"> &quot;</span><span style="color:#E1E4E8;">$expire_date</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#9ECBFF;"> +%s</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">            current_timestamp</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">$(</span><span style="color:#B392F0;">date</span><span style="color:#9ECBFF;"> +%s</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span></span>
<span class="line"><span style="color:#6A737D;">            # 计算剩余天数</span></span>
<span class="line"><span style="color:#E1E4E8;">            days_left</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">$(( (</span><span style="color:#B392F0;">expire_timestamp</span><span style="color:#9ECBFF;"> -</span><span style="color:#9ECBFF;"> current_timestamp</span><span style="color:#E1E4E8;">) </span><span style="color:#B392F0;">/</span><span style="color:#79B8FF;"> 86400</span><span style="color:#E1E4E8;"> ))</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span></span>
<span class="line"><span style="color:#6A737D;">            # 检查是否需要警告</span></span>
<span class="line"><span style="color:#F97583;">            if</span><span style="color:#E1E4E8;"> [ $days_left </span><span style="color:#F97583;">-lt</span><span style="color:#E1E4E8;"> $WARNING_DAYS ]; </span><span style="color:#F97583;">then</span></span>
<span class="line"><span style="color:#79B8FF;">                echo</span><span style="color:#9ECBFF;"> &quot;WARNING: Certificate for </span><span style="color:#E1E4E8;">$domain</span><span style="color:#9ECBFF;"> expires in </span><span style="color:#E1E4E8;">$days_left</span><span style="color:#9ECBFF;"> days&quot;</span></span>
<span class="line"><span style="color:#6A737D;">                # 发送告警邮件或通知</span></span>
<span class="line"><span style="color:#F97583;">            else</span></span>
<span class="line"><span style="color:#79B8FF;">                echo</span><span style="color:#9ECBFF;"> &quot;Certificate for </span><span style="color:#E1E4E8;">$domain</span><span style="color:#9ECBFF;"> is valid for </span><span style="color:#E1E4E8;">$days_left</span><span style="color:#9ECBFF;"> days&quot;</span></span>
<span class="line"><span style="color:#F97583;">            fi</span></span>
<span class="line"><span style="color:#F97583;">        fi</span></span>
<span class="line"><span style="color:#F97583;">    fi</span></span>
<span class="line"><span style="color:#F97583;">done</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安全加固配置" tabindex="-1"><a class="header-anchor" href="#安全加固配置"><span>安全加固配置</span></a></h2><h3 id="完整安全配置示例" tabindex="-1"><a class="header-anchor" href="#完整安全配置示例"><span>完整安全配置示例</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 基础SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_trusted_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/chain.crt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 协议和加密套件</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_prefer_server_ciphers </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 会话优化</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_cache </span><span style="color:#E1E4E8;">shared:SSL:10m;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_timeout </span><span style="color:#79B8FF;">10m</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_tickets </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # OCSP Stapling</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_stapling_verify </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    resolver </span><span style="color:#79B8FF;">8.8.8.8</span><span style="color:#79B8FF;"> 8.8.4.4</span><span style="color:#E1E4E8;"> valid=300s;</span></span>
<span class="line"><span style="color:#F97583;">    resolver_timeout </span><span style="color:#79B8FF;">5s</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # Diffie-Hellman参数</span></span>
<span class="line"><span style="color:#F97583;">    ssl_dhparam </span><span style="color:#E1E4E8;">/etc/nginx/ssl/dhparam.pem;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 安全头设置</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options </span><span style="color:#9ECBFF;">&quot;nosniff&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-XSS-Protection </span><span style="color:#9ECBFF;">&quot;1; mode=block&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Referrer-Policy </span><span style="color:#9ECBFF;">&quot;no-referrer-when-downgrade&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Content-Security-Policy </span><span style="color:#9ECBFF;">&quot;default-src &#39;self&#39;; script-src &#39;self&#39; &#39;unsafe-inline&#39; &#39;unsafe-eval&#39;; style-src &#39;self&#39; &#39;unsafe-inline&#39;;&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 特定安全配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ecdh_curve </span><span style="color:#E1E4E8;">secp384r1;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_buffer_size </span><span style="color:#79B8FF;">1400</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="防止降级攻击" tabindex="-1"><a class="header-anchor" href="#防止降级攻击"><span>防止降级攻击</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 强制使用安全协议</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 禁用不安全的加密套件</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4:!kRSA;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 防止协议降级</span></span>
<span class="line"><span style="color:#F97583;">    ssl_prefer_server_ciphers </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 启用HSTS</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 证书配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="完整的http重定向配置" tabindex="-1"><a class="header-anchor" href="#完整的http重定向配置"><span>完整的HTTP重定向配置</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># HTTP重定向到HTTPS</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">80</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#E1E4E8;">[::]:80;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 添加安全头</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options </span><span style="color:#9ECBFF;">&quot;nosniff&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">X-XSS-Protection </span><span style="color:#9ECBFF;">&quot;1; mode=block&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 重定向到HTTPS</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#79B8FF;"> 301</span><span style="color:#E1E4E8;"> https://$server_name$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># HTTPS服务器</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#E1E4E8;">[::]:443 ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com www.example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 安全配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_protocols </span><span style="color:#E1E4E8;">TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_ciphers </span><span style="color:#E1E4E8;">ECDHE+AES256:ECDHE+CHACHA20:!DSS;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_prefer_server_ciphers </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # HSTS</span></span>
<span class="line"><span style="color:#F97583;">    add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能优化配置" tabindex="-1"><a class="header-anchor" href="#性能优化配置"><span>性能优化配置</span></a></h2><h3 id="ssl会话优化" tabindex="-1"><a class="header-anchor" href="#ssl会话优化"><span>SSL会话优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 全局SSL会话配置</span></span>
<span class="line"><span style="color:#F97583;">http</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#6A737D;">    # SSL会话缓存</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_cache </span><span style="color:#E1E4E8;">shared:SSL:50m;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_timeout </span><span style="color:#79B8FF;">10m</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_session_tickets </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL缓冲区优化</span></span>
<span class="line"><span style="color:#F97583;">    ssl_buffer_size </span><span style="color:#79B8FF;">1400</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # Diffie-Hellman参数</span></span>
<span class="line"><span style="color:#F97583;">    ssl_dhparam </span><span style="color:#E1E4E8;">/etc/nginx/ssl/dhparam.pem;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">        server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#6A737D;">        # 服务器特定配置</span></span>
<span class="line"><span style="color:#F97583;">        ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">        ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#6A737D;">        # 启用Early Data (TLS 1.3)</span></span>
<span class="line"><span style="color:#F97583;">        ssl_early_data </span><span style="color:#79B8FF;">on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span></span>
<span class="line"><span style="color:#F97583;">        location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">            proxy_pass </span><span style="color:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="color:#F97583;">            proxy_set_header </span><span style="color:#E1E4E8;">Host $host;</span></span>
<span class="line"><span style="color:#F97583;">            proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#F97583;">            proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#F97583;">            proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="http-2优化" tabindex="-1"><a class="header-anchor" href="#http-2优化"><span>HTTP/2优化</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # HTTP/2优化</span></span>
<span class="line"><span style="color:#F97583;">    http2_max_field_size </span><span style="color:#79B8FF;">16k</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    http2_max_header_size </span><span style="color:#79B8FF;">32k</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    http2_body_preread_size </span><span style="color:#79B8FF;">32k</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 连接优化</span></span>
<span class="line"><span style="color:#F97583;">    keepalive_timeout </span><span style="color:#79B8FF;">75s</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    keepalive_requests </span><span style="color:#79B8FF;">1000</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="监控与日志配置" tabindex="-1"><a class="header-anchor" href="#监控与日志配置"><span>监控与日志配置</span></a></h2><h3 id="ssl访问日志" tabindex="-1"><a class="header-anchor" href="#ssl访问日志"><span>SSL访问日志</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 自定义SSL日志格式</span></span>
<span class="line"><span style="color:#F97583;">log_format </span><span style="color:#E1E4E8;">ssl_log </span><span style="color:#9ECBFF;">&#39;$</span><span style="color:#E1E4E8;">remote_addr</span><span style="color:#9ECBFF;"> - $</span><span style="color:#E1E4E8;">remote_user</span><span style="color:#9ECBFF;"> [$</span><span style="color:#E1E4E8;">time_local</span><span style="color:#9ECBFF;">] &quot;$</span><span style="color:#E1E4E8;">request</span><span style="color:#9ECBFF;">&quot; &#39;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &#39;$</span><span style="color:#E1E4E8;">status</span><span style="color:#9ECBFF;"> $</span><span style="color:#E1E4E8;">body_bytes_sent</span><span style="color:#9ECBFF;"> &quot;$</span><span style="color:#E1E4E8;">http_referer</span><span style="color:#9ECBFF;">&quot; &#39;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &#39;&quot;$</span><span style="color:#E1E4E8;">http_user_agent</span><span style="color:#9ECBFF;">&quot; &quot;$</span><span style="color:#E1E4E8;">http_x_forwarded_for</span><span style="color:#9ECBFF;">&quot; &#39;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &#39;ssl_protocol=$</span><span style="color:#E1E4E8;">ssl_protocol</span><span style="color:#9ECBFF;"> ssl_cipher=$</span><span style="color:#E1E4E8;">ssl_cipher</span><span style="color:#9ECBFF;"> &#39;</span></span>
<span class="line"><span style="color:#9ECBFF;">                  &#39;request_time=$</span><span style="color:#E1E4E8;">request_time</span><span style="color:#9ECBFF;">&#39;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 使用自定义日志格式</span></span>
<span class="line"><span style="color:#F97583;">    access_log </span><span style="color:#E1E4E8;">/var/log/nginx/ssl_access.log ssl_log;</span></span>
<span class="line"><span style="color:#F97583;">    error_log </span><span style="color:#E1E4E8;">/var/log/nginx/ssl_error.log;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ssl状态监控" tabindex="-1"><a class="header-anchor" href="#ssl状态监控"><span>SSL状态监控</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 启用SSL状态页面</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">8443</span><span style="color:#E1E4E8;"> ssl;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">localhost;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # SSL配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/localhost.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/localhost.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 访问控制</span></span>
<span class="line"><span style="color:#F97583;">    allow </span><span style="color:#79B8FF;">127.0.0.1</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">    deny </span><span style="color:#79B8FF;">all</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> /nginx_status </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        stub_status</span><span style="color:#E1E4E8;"> on;</span></span>
<span class="line"><span style="color:#F97583;">        access_log </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> /ssl_status </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#6A737D;">        # 自定义SSL状态信息</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> 200</span><span style="color:#9ECBFF;"> &quot;SSL Protocol: $</span><span style="color:#E1E4E8;">ssl_protocol</span><span style="color:#79B8FF;">\\n</span><span style="color:#9ECBFF;">SSL Cipher: $</span><span style="color:#E1E4E8;">ssl_cipher</span><span style="color:#79B8FF;">\\n</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">        add_header </span><span style="color:#E1E4E8;">Content-Type text/plain;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="故障排除与调试" tabindex="-1"><a class="header-anchor" href="#故障排除与调试"><span>故障排除与调试</span></a></h2><h3 id="常见ssl错误处理" tabindex="-1"><a class="header-anchor" href="#常见ssl错误处理"><span>常见SSL错误处理</span></a></h3><div class="language-nginx line-numbers-mode" data-highlighter="shiki" data-ext="nginx" data-title="nginx" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># SSL错误日志配置</span></span>
<span class="line"><span style="color:#F97583;">error_log </span><span style="color:#E1E4E8;">/var/log/nginx/ssl_error.log </span><span style="color:#79B8FF;">debug</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 常见问题解决配置</span></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">    listen </span><span style="color:#79B8FF;">443</span><span style="color:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="color:#F97583;">    server_name </span><span style="color:#E1E4E8;">example.com;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 证书配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.crt;</span></span>
<span class="line"><span style="color:#F97583;">    ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/nginx/ssl/example.com.key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 调试配置</span></span>
<span class="line"><span style="color:#F97583;">    ssl_verify_client </span><span style="color:#79B8FF;">off</span><span style="color:#E1E4E8;">;  </span><span style="color:#6A737D;"># 临时关闭客户端验证用于调试</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#6A737D;">    # 错误页面</span></span>
<span class="line"><span style="color:#F97583;">    error_page </span><span style="color:#79B8FF;">495</span><span style="color:#79B8FF;"> 496</span><span style="color:#79B8FF;"> 497</span><span style="color:#E1E4E8;"> /ssl_error.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#F97583;"> =</span><span style="color:#DBEDFF;"> /ssl_error.html </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/error;</span></span>
<span class="line"><span style="color:#F97583;">        internal</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#F97583;">    location</span><span style="color:#B392F0;"> / </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#F97583;">        root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#F97583;">        index </span><span style="color:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ssl调试命令" tabindex="-1"><a class="header-anchor" href="#ssl调试命令"><span>SSL调试命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="background-color:#24292e;color:#e1e4e8;"><pre class="shiki github-dark vp-code"><code><span class="line"><span style="color:#6A737D;"># 检查证书信息</span></span>
<span class="line"><span style="color:#B392F0;">openssl</span><span style="color:#9ECBFF;"> x509</span><span style="color:#79B8FF;"> -in</span><span style="color:#9ECBFF;"> /etc/nginx/ssl/example.com.crt</span><span style="color:#79B8FF;"> -text</span><span style="color:#79B8FF;"> -noout</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 测试SSL连接</span></span>
<span class="line"><span style="color:#B392F0;">openssl</span><span style="color:#9ECBFF;"> s_client</span><span style="color:#79B8FF;"> -connect</span><span style="color:#9ECBFF;"> example.com:443</span><span style="color:#79B8FF;"> -servername</span><span style="color:#9ECBFF;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查支持的协议和加密套件</span></span>
<span class="line"><span style="color:#B392F0;">nmap</span><span style="color:#79B8FF;"> --script</span><span style="color:#9ECBFF;"> ssl-enum-ciphers</span><span style="color:#79B8FF;"> -p</span><span style="color:#79B8FF;"> 443</span><span style="color:#9ECBFF;"> example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 测试HTTP/2支持</span></span>
<span class="line"><span style="color:#B392F0;">curl</span><span style="color:#79B8FF;"> -I</span><span style="color:#79B8FF;"> --http2</span><span style="color:#9ECBFF;"> https://example.com</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># 检查HSTS头</span></span>
<span class="line"><span style="color:#B392F0;">curl</span><span style="color:#79B8FF;"> -I</span><span style="color:#9ECBFF;"> https://example.com</span><span style="color:#F97583;"> |</span><span style="color:#B392F0;"> grep</span><span style="color:#79B8FF;"> -i</span><span style="color:#9ECBFF;"> strict</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践总结" tabindex="-1"><a class="header-anchor" href="#最佳实践总结"><span>最佳实践总结</span></a></h2><h3 id="安全配置建议" tabindex="-1"><a class="header-anchor" href="#安全配置建议"><span>安全配置建议</span></a></h3><ol><li><p><strong>使用强加密算法</strong></p><ul><li>启用TLS 1.2和TLS 1.3</li><li>使用ECDHE密钥交换算法</li><li>禁用弱加密套件</li></ul></li><li><p><strong>证书管理</strong></p><ul><li>定期更新证书</li><li>使用自动化工具管理证书</li><li>监控证书过期时间</li></ul></li><li><p><strong>安全头设置</strong></p><ul><li>启用HSTS</li><li>设置适当的Content-Security-Policy</li><li>防止点击劫持攻击</li></ul></li><li><p><strong>性能优化</strong></p><ul><li>启用SSL会话缓存</li><li>使用HTTP/2</li><li>优化SSL缓冲区大小</li></ul></li></ol><h3 id="常见问题避免" tabindex="-1"><a class="header-anchor" href="#常见问题避免"><span>常见问题避免</span></a></h3><ul><li>❌ 使用过期或自签名证书</li><li>❌ 启用不安全的SSL协议版本</li><li>❌ 忽略证书链配置</li><li>❌ 不监控证书过期时间</li><li>❌ 缺少安全头配置</li></ul><p>通过合理配置Nginx的SSL/TLS功能，可以为Web应用提供强大的安全保护，同时保持良好的性能表现。在实际应用中，需要根据具体的安全要求和性能需求，选择合适的配置方案，并定期进行安全审计和性能优化。</p>`,53);function t(d,E){const n=i("Mermaid");return p(),a("div",null,[c,e(n,{id:"mermaid-51",code:"eJxlkM1Kw0AUhfd9ivsCBvyXLAohLlyJkL5AKKFkYahtBZeNiNRqFE27EENoilWxkOhCgqmYl8ncTN7C6YwtgQ7D3ZyP7x5u2zg5Nay6sW/qjZZ+XAH2mnqrY9bNpm51QAW9DSQcYy/Op9FKrM3jw4ZpnaHnkH5AHt9WFcocopGdfb8UY5vc3aOXoH/BQT7UtWpVk2FdAhbSr/igVjvSaOrj7YRGMX6ec0pjlCrDBqeKrr3cKNRLk6rIsClB8X7DApGhd4XDHnZfBaQI05YENB2QJ1+g+cxF3ysX2l6sIv0RiS7ZLx4mWRqgLS7x32hHgjwIafgsKpNZkk+vy55d5uEGHH6gE2Y/I/rrlg17C4C4DkkGolXlD0cJvGE="}),r])}const m=l(o,[["render",t],["__file","4.Nginx高级-SSL安全认证.html.vue"]]),u=JSON.parse(`{"path":"/middleware/Nginx%E6%8A%80%E6%9C%AF/4.Nginx%E9%AB%98%E7%BA%A7-SSL%E5%AE%89%E5%85%A8%E8%AE%A4%E8%AF%81.html","title":"Nginx高级-SSL安全认证","lang":"zh-CN","frontmatter":{"order":4,"description":"Nginx高级-SSL安全认证 业务场景引入 在构建金融支付平台时，安全是最重要的考虑因素。平台需要满足以下安全要求： 数据传输加密：所有用户敏感信息（如银行卡号、身份证号、交易密码）必须在传输过程中加密 身份认证：确保用户访问的是真实的银行网站，防止钓鱼攻击 合规要求：满足PCI DSS、GDPR等安全标准和法规要求 性能保障：在保证安全的前提下，不...","head":[["meta",{"property":"og:url","content":"https://lindaifeng.github.io/middleware/Nginx%E6%8A%80%E6%9C%AF/4.Nginx%E9%AB%98%E7%BA%A7-SSL%E5%AE%89%E5%85%A8%E8%AE%A4%E8%AF%81.html"}],["meta",{"property":"og:site_name","content":"文档演示"}],["meta",{"property":"og:title","content":"Nginx高级-SSL安全认证"}],["meta",{"property":"og:description","content":"Nginx高级-SSL安全认证 业务场景引入 在构建金融支付平台时，安全是最重要的考虑因素。平台需要满足以下安全要求： 数据传输加密：所有用户敏感信息（如银行卡号、身份证号、交易密码）必须在传输过程中加密 身份认证：确保用户访问的是真实的银行网站，防止钓鱼攻击 合规要求：满足PCI DSS、GDPR等安全标准和法规要求 性能保障：在保证安全的前提下，不..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-09-19T03:15:10.000Z"}],["meta",{"property":"article:author","content":"清峰"}],["meta",{"property":"article:modified_time","content":"2025-09-19T03:15:10.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Nginx高级-SSL安全认证\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-09-19T03:15:10.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清峰\\",\\"url\\":\\"https://lindaifeng.github.io\\"}]}"]]},"headers":[{"level":2,"title":"业务场景引入","slug":"业务场景引入","link":"#业务场景引入","children":[]},{"level":2,"title":"SSL/TLS基础概念","slug":"ssl-tls基础概念","link":"#ssl-tls基础概念","children":[{"level":3,"title":"什么是SSL/TLS？","slug":"什么是ssl-tls","link":"#什么是ssl-tls","children":[]},{"level":3,"title":"SSL/TLS工作原理","slug":"ssl-tls工作原理","link":"#ssl-tls工作原理","children":[]},{"level":3,"title":"证书类型","slug":"证书类型","link":"#证书类型","children":[]}]},{"level":2,"title":"SSL证书配置","slug":"ssl证书配置","link":"#ssl证书配置","children":[{"level":3,"title":"基础SSL配置","slug":"基础ssl配置","link":"#基础ssl配置","children":[]},{"level":3,"title":"HTTP到HTTPS重定向","slug":"http到https重定向","link":"#http到https重定向","children":[]},{"level":3,"title":"多域名证书配置","slug":"多域名证书配置","link":"#多域名证书配置","children":[]},{"level":3,"title":"通配符证书配置","slug":"通配符证书配置","link":"#通配符证书配置","children":[]}]},{"level":2,"title":"高级SSL配置","slug":"高级ssl配置","link":"#高级ssl配置","children":[{"level":3,"title":"TLS 1.3优化配置","slug":"tls-1-3优化配置","link":"#tls-1-3优化配置","children":[]},{"level":3,"title":"客户端证书认证","slug":"客户端证书认证","link":"#客户端证书认证","children":[]},{"level":3,"title":"OCSP Stapling配置","slug":"ocsp-stapling配置","link":"#ocsp-stapling配置","children":[]}]},{"level":2,"title":"证书管理与更新","slug":"证书管理与更新","link":"#证书管理与更新","children":[{"level":3,"title":"Let's Encrypt自动化配置","slug":"let-s-encrypt自动化配置","link":"#let-s-encrypt自动化配置","children":[]},{"level":3,"title":"证书更新脚本","slug":"证书更新脚本","link":"#证书更新脚本","children":[]},{"level":3,"title":"证书监控脚本","slug":"证书监控脚本","link":"#证书监控脚本","children":[]}]},{"level":2,"title":"安全加固配置","slug":"安全加固配置","link":"#安全加固配置","children":[{"level":3,"title":"完整安全配置示例","slug":"完整安全配置示例","link":"#完整安全配置示例","children":[]},{"level":3,"title":"防止降级攻击","slug":"防止降级攻击","link":"#防止降级攻击","children":[]},{"level":3,"title":"完整的HTTP重定向配置","slug":"完整的http重定向配置","link":"#完整的http重定向配置","children":[]}]},{"level":2,"title":"性能优化配置","slug":"性能优化配置","link":"#性能优化配置","children":[{"level":3,"title":"SSL会话优化","slug":"ssl会话优化","link":"#ssl会话优化","children":[]},{"level":3,"title":"HTTP/2优化","slug":"http-2优化","link":"#http-2优化","children":[]}]},{"level":2,"title":"监控与日志配置","slug":"监控与日志配置","link":"#监控与日志配置","children":[{"level":3,"title":"SSL访问日志","slug":"ssl访问日志","link":"#ssl访问日志","children":[]},{"level":3,"title":"SSL状态监控","slug":"ssl状态监控","link":"#ssl状态监控","children":[]}]},{"level":2,"title":"故障排除与调试","slug":"故障排除与调试","link":"#故障排除与调试","children":[{"level":3,"title":"常见SSL错误处理","slug":"常见ssl错误处理","link":"#常见ssl错误处理","children":[]},{"level":3,"title":"SSL调试命令","slug":"ssl调试命令","link":"#ssl调试命令","children":[]}]},{"level":2,"title":"最佳实践总结","slug":"最佳实践总结","link":"#最佳实践总结","children":[{"level":3,"title":"安全配置建议","slug":"安全配置建议","link":"#安全配置建议","children":[]},{"level":3,"title":"常见问题避免","slug":"常见问题避免","link":"#常见问题避免","children":[]}]}],"git":{"createdTime":1757928579000,"updatedTime":1758251710000,"contributors":[{"name":"ldf","email":"1305366530@qq.com","commits":3}]},"readingTime":{"minutes":7.75,"words":2324},"filePathRelative":"middleware/Nginx技术/4.Nginx高级-SSL安全认证.md","localizedDate":"2025年9月15日","autoDesc":true,"excerpt":"\\n<h2>业务场景引入</h2>\\n<p>在构建金融支付平台时，安全是最重要的考虑因素。平台需要满足以下安全要求：</p>\\n<ol>\\n<li><strong>数据传输加密</strong>：所有用户敏感信息（如银行卡号、身份证号、交易密码）必须在传输过程中加密</li>\\n<li><strong>身份认证</strong>：确保用户访问的是真实的银行网站，防止钓鱼攻击</li>\\n<li><strong>合规要求</strong>：满足PCI DSS、GDPR等安全标准和法规要求</li>\\n<li><strong>性能保障</strong>：在保证安全的前提下，不能显著影响系统性能</li>\\n<li><strong>证书管理</strong>：需要支持多域名证书、通配符证书，并能平滑更新证书</li>\\n</ol>"}`);export{m as comp,u as data};
