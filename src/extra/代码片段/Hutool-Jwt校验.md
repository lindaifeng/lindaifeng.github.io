---
title: Hutool-Jwt校验
---

```java
package cn.rock.util;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.util.SystemPropsUtil;
import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import cn.rock.domain.constant.RockConstant;

import java.util.Map;

/**
 * @author ldf
 */
public class JwtUtil {

    /**
     * 密钥
     */
    private static final String TOKEN_KEY = SystemPropsUtil.get("TOKEN_KEY", "6ed86be5f96fd2d5aa0adb4bc35d064d");


    /**
     * 创建token
     *
     * @param o 参数Map或者Bean对象 id+name
     * @return token
     */
    public static String create(Object o) {
        DateTime now = DateTime.now();
        Map<String, Object> params = BeanUtil.beanToMap(o);
        params.put(JWT.EXPIRES_AT, now.offsetNew(DateField.SECOND, RockConstant.TOKEN_TIMEOUT));// 过期时间
        params.put(JWT.NOT_BEFORE, now);// 生效时间
        params.put(JWT.ISSUED_AT, now);// 签发时间
        return JWTUtil.createToken(params, TOKEN_KEY.getBytes());
    }

    /**
     * 验证token
     *
     * @param token token
     * @return 结果集
     */
    public static boolean verify(String token) {
        JWT jwt = parse(token);
        jwt.setKey(TOKEN_KEY.getBytes());
        return jwt.verify() && jwt.validate(RockConstant.TOKEN_TIMEOUT);
    }

    /**
     * 获取参数bean
     *
     * @param token    token
     * @param <T>clazz
     * @return 结果集
     */
    public static <T> T getPayload(String token, Class<T> clazz) {
        return BeanUtil.toBean(parse(token).getPayload(), clazz);
    }

    /**
     * 获取参数值
     *
     * @param name lambda获取Bean属性名称
     * @return 结果集
     */
    public static Object getValue(String token, String name) {
        return parse(token).getPayload(name);
    }

    /**
     * 解析token
     *
     * @param token token
     * @return 结果集
     */
    public static JWT parse(String token) {
        return JWTUtil.parseToken(token);
    }

}
```

