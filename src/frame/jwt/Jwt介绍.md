---
title: Jwt介绍
---

## JWT 介绍

> JWT 是 JSON Web Token 的缩写，JWT 本身没有定义任何技术实现，它只是定义了一种基于 Token 的会话管理的规则，涵盖 Token
> 需要包含的标准内容和 Token 的生成过程。

首先，俺们先来看看一个 JWT Token 长这样。

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDQ1MTE3NDMsImp0aSI6IjYxYmVmNjkyLTE4M2ItNGYxYy1hZjE1LWUwMDM0MTczNzkxOSJ9.CZzB2-JI1oPRFxNMaoFz9-9cKGTYVXkOC2INMoEYNNA
```

仔细辨别会发现它由 `A.B.C` 三部分组成，这三部分依次是头部（Header）、负载（Payload）、签名（Signature），头部和负载以 JSON
形式存在，这就是 JWT 中的 JSON，三部分的内容都分别单独经过了 Base64 编码，以 `.` 拼接成一个 JWT Token。

- 头部（Header）

  JWT 的 Header 中存储了所使用的加密算法和 Token 类型。

  ```java
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```

- 负载（Payload）

  Payload 是负载，JWT 规范规定了一些字段，并推荐使用，开发者也可以自己指定字段和内容，例如下面的内容。

  ```java
  {
    id: 1024
    username: 'admin',
    exp: 1544602234
  }
  ```

  需要注意的是，Payload的内容只经过了 Base64 编码，对客户端来说当于明文存储，所以不要放置敏感信息。

- 签名（Signature）

  Signature 部分用来验证 JWT Token 是否被篡改，所以这部分会使用一个 Secret 将前两部分加密，逻辑如下。

  ```java
  HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
  ```

## JWT 优势 & 问题

**思考一下：**

为什么要用JWT？

互联网服务离不开用户认证，传统的认证方式是通过cookie和session的方式进行认证，但是分布式web应用的普及，通过[session](https://so.csdn.net/so/search?q=session&spm=1001.2101.3001.7020)
管理用户登录状态成本越来越高，你想想看，当业务服务分布在多台服务器时，该怎么进行session认证呢。

有人会说，每个业务服务都保持session同步不就好了，你细想，是不是要维护每台session，每台服务器都要读取
session，还有串session的风险，代价是不是很大。

有人还会说，像sso一样，所有请求先经过认证服务，session只在认证服务上保存不就好了。其实这种方式也为尝不可，只是每个用户都会产生一个session进行维护，客户端还需维护cookie，session量大起来了的话复杂度也随之提高了，session的存取都会占用服务器资源，用户量很大的情况下，会产生各种问题，性能比较低下。

**优势**

​ JWT 拥有基于 Token 的会话管理方式所拥有的一切优势，不依赖 Cookie，使得其可以防止 CSRF 攻击，也能在禁用 Cookie
的浏览器环境中正常运行。

**问题**

​ 而 JWT 的最大优势是服务端不再需要存储 Session，使得服务端认证鉴权业务可以方便扩展，避免存储 Session 所需要引入的 Redis
等组件，降低了系统架构复杂度。但这也是 JWT 最大的劣势，由于有效期存储在 Token 中，JWT Token
一旦签发，就会在有效期内一直可用，无法在服务端废止，当用户进行登出操作，只能依赖客户端删除掉本地存储的 JWT
Token，如果需要禁用用户，单纯使用 JWT 就无法做到了。

## JWT 的几个特点

（1）JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。

（2）JWT 不加密的情况下，不能将秘密数据写入 JWT。

（3）JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。

（4）JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦
JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。

（5）JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT
的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

（6）为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。

## 基于 JWT 的实践

> 既然 JWT 依然存在诸多问题，甚至无法满足一些业务上的需求，但是我们依然可以基于 JWT 在实践中进行一些改进，来形成一个折中的方案
>
> **Token续期**
>
> 对于了解jwt的同学来说,jwt有个弊端,jwt不允许续签时间,时间到期,token就过期。以下实践方案也是续签的一直思路。

**在 JWT 的实践中，引入 Refresh Token，将会话管理流程改进如下。**

- 客户端使用用户名密码进行认证
- 服务端生成有效时间较短的 Access Token（例如 10 分钟），和有效时间较长的 Refresh Token（例如 7 天）
- 客户端访问需要认证的接口时，携带 Access Token
- 如果 Access Token 没有过期，服务端鉴权后返回给客户端需要的数据
- 如果携带 Access Token 访问需要认证的接口时鉴权失败（例如返回 401 错误），则客户端使用 Refresh Token 向刷新接口申请新的
  Access Token
- 如果 Refresh Token 没有过期，服务端向客户端下发新的 Access Token（也可下发新的Refresh Token以达到未退出浏览器未关闭一直登录的状态）
- 客户端使用新的 Access Token 访问需要认证的接口
- 如果 Refresh Token 过期，则重新使用用户名密码进行认证

![img](http://img.lindaifeng.vip/typora-picgo-tuchaung/20230414143607.jpeg)

​ 将生成的 Refresh Token 以及过期时间存储在服务端的数据库中，由于 Refresh Token 不会在客户端请求业务接口时验证，只有在申请新的
Access Token 时才会验证，所以将 Refresh Token 存储在数据库中，不会对业务接口的响应时间造成影响，也不需要像 Session
一样一直保持在内存中以应对大量的请求。

​ 上述的架构，提供了服务端禁用用户 Token 的方式，当用户需要登出或禁用用户时，只需要将服务端的 Refresh Token 禁用或删除，用户就会在
Access Token 过期后，由于无法获取到新的 Access Token 而再也无法访问需要认证的接口。这样的方式虽然会有一定的窗口期（取决于
Access Token 的失效时间），但是结合用户登出时客户端删除 Access Token 的操作，基本上可以适应常规情况下对用户认证鉴权的精度要求。

------

**我习惯的实现方式：**

1. 用户注册/登录时，服务端会分配给该用户一个token，有效期30天，入库后下发给客户端。

2. 客户端可以将该token放在header里，也可以放在请求json中。放在cookie中自然也可以的，取决于具体业务场景和实现约定。

3. 服务端的权限系统对用户鉴权，若鉴权通过则执行业务逻辑；否则提示用户重新登录。

   **优点：**

    - 同样不依赖Cookie。

    - 用户登录后会生成新token，老token自动失效。即只允许用户登录一个设备。

    - 服务端可以随时踢掉用户当前的登录状态，服务端只需要重置token即可。随后的客户端请求所携带的token都会被服务端判定失效，把客户端打回登录界面。

    - 用户登出，则只需要客户端删除存储的token即可，服务端不必理会。下次用户登录时，服务端自会重新给该用户分配一个新的token。

## **java-Jwt实现案例**

**1、倒入依赖**

```
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.10.3</version>
</dependency>
```

**2、创建token**

```java
 	/**
     * 创建token
     * @param user
     * @return
     */
    public static String createToken(Users user){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE,TIME_OUT_DAY);
        String token = JWT.create()
                .withClaim("id", user.getId())
                .withClaim("key", DigestUtils.md5DigestAsHex(user.getPassword().getBytes()))
                .withExpiresAt(calendar.getTime())
                .sign(Algorithm.HMAC256(SECRET));
        return token;
    }

```

**3、生成token**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDQ1MTE3NDMsImp0aSI6IjYxYmVmNjkyLTE4M2ItNGYxYy1hZjE1LWUwMDM0MTczNzkxOSJ9.CZzB2-JI1oPRFxNMaoFz9-9cKGTYVXkOC2INMoEYNNA
```

**4、校验token是否过期**

```
 /**
     * 校验token是否过期
     * @param decodedJWT
     * @return
     */
    public static boolean needCreate(DecodedJWT decodedJWT){
        Date timeoutDate = decodedJWT.getExpiresAt();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE,TIME_OUT_DAY - NEED_CREATE_DAY);
        if(timeoutDate.before(calendar.getTime())){
            return true;
        }
        return false;
    }
```

