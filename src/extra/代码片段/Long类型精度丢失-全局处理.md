---
title: Long类型精度丢失-全局处理
---
1、全局处理方式

```java
@Configuration
public class JacksonConfig {
/**

* Jackson全局转化long类型为String，解决jackson序列化时long类型缺失精度问题
* @return Jackson2ObjectMapperBuilderCustomizer 注入的对象
  */
  @Bean
  public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
  return jacksonObjectMapperBuilder -> jacksonObjectMapperBuilder
  .serializerByType(Long.class, ToStringSerializer.instance)
  .serializerByType(Long.TYPE, ToStringSerializer.instance);
  }
  }

//2、局部处理方式
@JsonSerialize(using = ToStringSerializer.class)
```

