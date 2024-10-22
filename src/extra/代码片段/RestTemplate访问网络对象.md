---
title: RestTemplate访问网络对象
---
RestTemplate访问网络对象

1、创建RestTemplate对象
2、调用exchange方法，给定参数
3、封装entity对象，给定请求头请求体参数
4、封装请求头信息new Hearder()
5、封装请求体信息（看需要什么格式的请求体Json，map）
6、获取响应对象，获取响应

1、Get方法远程调用

```java
RestTemplate restTemplate=new RestTemplate();
String url="http://127.0.0.1:80/rest/gateway/immovables/queryWarrant?ZJH="+ZJH+"&BDCDYH="+BDCDYH+"&BDCQZH="+BDCQZH;
HttpHeaders headers=new HttpHeaders();
headers.set("systemid","market01");
headers.set("identitytoken",identitytoken);
headers.set("Content-Type","application/json;charset=UTF-8");
HttpEntity entity=new HttpEntity(null,headers);

ResponseEntity<String> responseEntity=restTemplate.exchange(url,HttpMethod.GET,entity,String.class);

if(responseEntity.getStatusCodeValue()==200){
String body=responseEntity.getBody();
}
```

2、Post方法远程调用

```java
RestTemplate restTemplate=new RestTemplate();
//2、设置url路径
String url="http://127.0.0.1:80/rest/gateway/immovables/queryWarrant";
//4、封装请求头
HttpHeaders headers=new HttpHeaders();
headers.set("systemid","market01");
headers.set("identitytoken",identitytoken);
headers.set("Content-Type","application/json;charset=UTF-8");
//5、封装请求体
HashMap<String, String> map=new HashMap<>();
map.put("key","value");
String s=JSON.toJSONString(map);
//3、封装请求参数
HttpEntity entity=new HttpEntity(reqBody,headers);

//1、远程调用
ResponseEntity<String> responseEntity=restTemplate.exchange(url,HttpMethod.GET,entity,String.class);

//6、获取响应体
if(responseEntity.getStatusCodeValue()==200){
String body=responseEntity.getBody();
}
```
