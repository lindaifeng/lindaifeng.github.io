---
title: SpringBoot底层原理实现
order: 1
---
## SpringBoot底层原理实现

**思考：bean是如何被创建的？**
## 一、自动装配原理一bean的创建：

**condition**：条件判断

用于bean的创建中，当满足条件时则返回ture，不满足则返回false，根据返回值判断是否要执行创建bean的方法。true创建bean

```java
@Conditional(OnBeanCondition.class)
下面的注解都被@Conditional修饰执行()中不同类的条件判断方法
@ConditionalOnClass		//存在类则为满足条件创建bean
@ConditionalOnMissingBean	//不存在则满足条件创建bean
```

**思考：SpringBoot是如何知道要创建哪个bean的？**(难道所有的bean都创建，IOC容器能装下？)

1、思路：导入依赖坐标后会加载jar包导入相应的字节码文件，编译时也会加载相应的字节码文件，可以根据判断加载对应的字节码创建对应的bean。

而springboot给我们提供的一个接口condition就用来判断bean的创建条件。该接口通过注解@Conditional(条件类)配合使用。
**具体实现**：

案例：需要导入redis依赖才将user对象注入bean中！

1、springboot项目启动时会进行初始化，@Configuration加载@bean，如果被@ConditionalOnClass标记则会先进行判断，是否满足条件(有这个类或者是他的字节码文件)

如图：如果有加载该全路径类名(有类)则满足条件。

![image-20210114211907733](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114211907733.png)

2、@ConditionalOnClass注解被@Conditional标识用于存储值给MyIfBean类(自定义条件类)使用

![image-20210114212748351](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114212748351.png)

3、@Conditional注解用于初始化器实现类对标记的值进行判断是否满足条件

> 1、先获取@ConditionalOnClass注解
>
> 2、再获取被@ConditionalOnClass注解标识的value值(存有字节码文件.class)
>
> 3、遍历value数组加载字节码对象，加载成功则返回true顺利创建bean，其中有加载失败则表明没有该字节码文件，返回falsebean1创建失败报错

![image-20210114213006730](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114213006730.png)

4、满足条件则后续进行创建bean，不满足则报错无法加载bean

![image-20210114211335030](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114211335030.png)



![image-20210114221244630](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114221244630.png)

## 二、自动装配原理二内置服务器的切换

springboot内置了四种服务器当导入不同的依赖时，会自动装配不同的服务器（当导入web依赖时会加载tomcat字节码文件，自动装配tomcat服务器注入到bean中）

![image-20210114223141212](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114223141212.png)

**切换服务器只需要排除原有的，添加新的依赖即可**

![image-20210114223646834](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114223646834.png)

![image-20210114224028196](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210114224028196.png)

## 三、自动装配原理三Enable注解原理



**思考：一个springboot项目能够直接加载jar包中的bean吗？**

不能！

分析启动类上的注解@SpringBootApplication

```
@SpringBootConfiguration //表明是一个配置类
@EnableAutoConfiguration //导入其他类，实现其中类的功能
@ComponentScan()	//包扫描（扫描当前包和其子包）
```

1、主要是@ComponentScan这个注解只会扫描当前包和其子包，并不会扫描其他包，所以不会加载其他类中的bean。

![image-20210115163920227](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115163920227.png)



**思考：如何加载其他类中的bean**

1、ComponentScan(其他包路径)

2、@Import(其他类)

![image-20210115163043778](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115163043778.png)

SpringBoot提供了@Eable*注解用于动态加载bean，原理就是在在注解上加入了@Import注解并导入了一些配置类，使得该注解可以动态加载自己特有的bean，实现某功能。

![image-20210115165051510](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115165051510.png)

## 四、自动装配原理四@Import原理

@Import()：导入的类会被Spring加载到IOC容器中

![image-20210115170016721](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115170016721.png)

1、导入一个bean类对象直接加载到中IOC容器中

![image-20210115180721908](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115180721908.png)

2、导入一个配置类，加载配置类文件加载bean

![image-20210115180701704](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115180701704.png)



3、导入一个ImportSelector自定义实现类，根据全路径类名加载多个bean到IOC容器中，通过将全路径类名写入配置文件中，可实现动态加载bean。（springboot初始化配置就是用到该接口实现加载多个配置文件，实现批量动态加载bean）

![image-20210115181157737](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115181157737.png)

4、导入一个ImportBeanDefinitionRegistrar自定义实现类，加载指定类注册到IOC容器中。

![image-20210115181038711](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115181038711.png)

## 五、自动装配原理五@EnableAutoConfiguration注解

![image-20210115183651159](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115183651159.png)

1、在启动类上@SpringBootApplication中有标识@EnableAutoConfiguration注解表示自动配置。

2、当启动项目时，会加载这个注解内部中的@Import(AutoConfigurationImportSelector.class)装载的类。

3、该类AutoConfigurationImportSelector.class主要是会去加载配置文件META-INF/spring.factories，该配置文件中定义了大量的配置类

4、但不会所有配置都会加载而是有条件的加载，满足@Conditional()的配置文件会被加载

![image-20210115184613356](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210115184613356.png)

# 总结：SpringBoot自动装配原理

1、启动springboot启动类时，项目会执行main方法构建项目并加载IOC容器。

2、启动类标识了@SpringBootApplication注解，该注解被

```
@SpringBootConfiguration //标识这个一个配置类
@EnableAutoConfiguration //开启自动配置
@ComponentScan //扫描包以及子包
```

三个注解所修饰，加载这个配置类，扫描包以及子包，并自动加载配置类将所需bean注入到IOC容器中

3、其中@EnableAutoConfiguration又被@Import(AutoConfigurationImportSelector.class)修饰，他会加载其配置类到IOC容器中，主要执行的方法是加载扫描到的包中查找一个/WEAT-INF/spring.factories文件，该文件配置了很多类的全路径类名，加载后进行bean的创建

4、并·不是所有的bean都会创建，满足各自配置类中符合@Conditional注解的条件则创建，不满足则不会创建。



![image-20210116194252647](http://img.lindaifeng.vip/typora-picgo-tuchaung/image-20210116194252647.png)

> 核心简化：SpringBoot自动装配原理
>
> 1、启动引导类上标识了@SpringBootApplication该引导类中有一个核心注解@EnableAutoConfiguration (开启自动配置)
>
> 2、@EnableAutoConfiguration (开启自动配置)注解被@Import(AutoConfigurationImportSelector.class)标识，会加载其配置类，该类会加载/MEAT-INF/spring.profactories文件。
>
> 3、该配置文件配置了所有springboot官方整合的其他依赖的全路径类名，通过加载各配置类生成bean注入IOC容器中
>
> 4、并不会将所有配置文件中的bean都会加载，再各配置类中加入了@Conditional注解进行条件判断，满足条件(大多是加载有无该对象字节码文件)才加载该bean。这样在导入相关依赖后才有对应字节码文件，在会满足相应@Conditional条件加载相应的bean