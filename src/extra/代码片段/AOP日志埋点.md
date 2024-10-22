---
title: AOP日志埋点
---

一、Spring AOP切面方法的执行顺序

@Around 通知方法将目标方法封装起来
@Before 通知方法会在目标方法调用之前执行
@After 通知方法会在目标方法返回或者异常后执行
@AfterReturning 通知方法会在目标方法返回时执行
@Afterthrowing 通知方法会在目标方法抛出异常时执行
这里以一个返回正常的情况为例：（异常替换最后一步即可）

1、自定义注解做打点标记

```java
@documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface ControllerMethodLog {
}
```

2、AOP实现注解标记方法做切面，打印日志信息
注意要在启动类扫描这个class，并且添加 @EnableAspectJAutoProxy(proxyTargetClass = true)

```java
@Slf4j
@Component
@Aspect
public class ControllerMethodLogAspect {
    @Pointcut("@annotation(com.xiyuan.demo.annotation.ControllerMethodLog)")
    public void pointCut() {
    }

    @Before("pointCut()")
    public void doBefore(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        ControllerMethodLog annotation = method.getAnnotation(ControllerMethodLog.class);
        if (Objects.isNull(annotation)) {
            return;
        }
        String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();
        log.info("start {}：入参：{}", methodName, JSON.toJSonString(joinPoint.getArgs()));
    }

    @AfterReturning(value = "pointCut()", returning = "result")
    public void afterReturn(JoinPoint joinPoint, Object result) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        ControllerMethodLog annotation = method.getAnnotation(ControllerMethodLog.class);
        if (Objects.isNull(annotation)) {
            return;
        }
        String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();
        log.info("end {}：响应：{}", methodName, JSON.toJSonString(result));
    }
}
```
