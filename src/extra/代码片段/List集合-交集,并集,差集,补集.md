---
title: List集合-交集,并集,差集,补集
---
原文链接：https://blog.csdn.net/qq_46239275/article/details/121849257

```java
<dependency>
	<groupId>org.apache.commons</groupId>
	<artifactId>commons-collections4</artifactId>
	<version>4.1</version>
</dependency>
```



```java
//获取两个集合并集（自动去重）- 两集合加在一起，覆盖重复的部分
public static List<String> getUnion(List<String> list1, List<String> list2){
    List<String> union = (List<String>) CollectionUtils.union(list1, list2);
    return union;
}

//获取两个集合交集- 两集合相同的部分
public static List<String> getIntersection(List<String> list1,List<String> list2){
    List<String> intersection = (List<String>)CollectionUtils.intersection(list1, list2);
    return intersection;
}
//获取两个集合交集的补集 即（list1 + list2 - 交集）-两集和各不相同的部分
public static List<String> getDisjunction(List<String> list1,List<String> list2){
    List<String> disjunction = (List<String>)CollectionUtils.disjunction(list1, list2);
    return disjunction;
}

//获取两个集合的差集（list1 - 交集）->该集合与交集不同的部分
public static List<String> getSubtract(List<String> list1,List<String> list2){
    List<String> subtract = (List<String>)CollectionUtils.subtract(list1, list2);
    return subtract;
}
```

