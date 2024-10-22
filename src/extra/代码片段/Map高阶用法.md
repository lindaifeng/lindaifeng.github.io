---
title: Map高阶用法
---
1、初始化建值对（无键或值则执行value方法，有值则返回）
`computeIfAbsent(K,V)；`

**示例：**
1.1、首先会判断map中是否有对应的Key；
1.2、如果没有对应的Key，则会创建一个满足Value类型的数据结构放入到Key对应的Value中，随后执行value中的操作；
1.3、如果有对应的Key且value有值，则会直接返回值，不会执行value中的操作.

```java
HashMap<String, List<Integer>> map = new HashMap<>();
/**
 * 首先，Map中没有 "hadoop" 这个Key，所以会创建一个满足Value类型的数据结构放入到Key对应的Value中
 * 随后对该Value对应的值进行操作，如下代码是：value赋值为18，
 * 下一下再执行，则直接返回value值，不再执行value中的方法。
 */
map.computeIfAbsent("hadoop", key -> 18);
System.out.println(map);
```

-------------------------------------------------------------------------------------------
2、有key则执行value中的操作（新值换旧值）
`computeIfPresent(K,V)；`

**示例：**

```java
HashMap<String, List<Integer>> map = new HashMap<>();
/**
  * Map中没有 "hadoop" 这个Key，则不执行
  * Map中有   "hadoop" 这个Key，则执行Value对应的值进行操作，如下代码是：value赋值为18，
  */
map.computeIfPresent("hadoop", key -> 18);
System.out.println(map);
```

-------------------------------------------------------------------------------------------

**缓存工具类**

```java

/**
 * 缓存工具类
 *
 * @author ldf
 * @code May there be no bugs in the world!
 */
@SuppressWarnings("unchecked")
public class CacheUtil {

    // 线程安全（分段锁）
    private static final Map<Object, Object> CACHE_MAP = new ConcurrentHashMap<>();

    /**
     * 从缓存中获取指定键对应的值，如果不存在，则通过给定的Supplier获取值，并将其放入缓存中。
     *
     * @param key      缓存中的键
     * @param supplier 当缓存中不存在指定键时，用于生成新值的Supplier
     * @param <T>      缓存中值的类型
     * @return 缓存中指定键对应的值，如果不存在，则通过Supplier生成新值并返回
     * @throws RuntimeException 如果在通过Supplier生成新值时发生异常，则抛出RuntimeException
     */
    public static <T> T getCacheMap(Object key, Supplier<T> supplier) {
        // 如果不存在，则调用supplier来获取值，并将其放入缓存中
        return (T) CACHE_MAP.computeIfAbsent(key, k -> {
            try {
                return supplier.get();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    /**
     * 根据给定的键从缓存映射中移除对应的键值对。
     *
     * @param key 要移除的键，类型为Object。
     */
    public static void removeCacheMapByKey(Object key) {
        CACHE_MAP.remove(key);
    }

    /**
     * 根据前缀键移除缓存映射中的条目
     *
     * @param prefixKey 前缀键，用于匹配缓存映射中的键
     *                  如果此参数为null，则直接返回，不做任何操作，防止空指针异常
     *                  该方法通过遍历缓存映射（CACHE_MAP）中的条目，
     *                  移除所有键（Key）以给定前缀键（prefixKey）开头的条目。
     *                  此方法直接在迭代过程中移除符合条件的条目，
     *                  避免了在遍历过程中直接修改集合可能导致的并发修改异常。
     */
    public static void removeCacheMapByPrefixKey(Object prefixKey) {
        // 直接在迭代器中移除，避免并发修改异常
        CACHE_MAP.entrySet().removeIf(entry -> entry.getKey() != null && entry.getKey().toString().startsWith(prefixKey.toString()));
    }

    public static void main(String[] args) {
        CacheUtil.getCacheMap("key", () -> "function method");
    }


```

