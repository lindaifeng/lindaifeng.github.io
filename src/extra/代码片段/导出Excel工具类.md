# 导出Excel工具类

本文介绍一个基于EasyExcel的通用Excel导出工具类，支持大文件导出、自定义Sheet配置和并行写入，适用于各类Java Web应用场景。

## 知识要点

### 1. 工具类介绍

该工具类提供了以下核心功能：
- 支持大文件流式导出，避免内存溢出
- 支持自定义Sheet配置（名称、样式等）
- 支持数据并行写入，提高导出效率
- 自动处理文件名编码，支持中文文件名

### 2. 完整工具类实现

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.ExcelTypeEnum;
import com.alibaba.excel.write.metadata.WriteSheet;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Excel导出工具类
 * 支持大文件导出、自定义Sheet配置和并行写入
 */
public class ExcelExportUtils {

    /**
     * 导出Excel文件
     * @param <T> 数据类型
     * @param response HttpServletResponse对象
     * @param fileName 文件名
     * @param dataStreamSupplier 数据流提供者(业务数据查询逻辑,流式输出)
     * @param clazz 数据类型Class
     * @param sheetConfigurator Sheet配置器
     * @throws IOException IO异常
     */
    public static <T> void export(
            HttpServletResponse response,
            String fileName,
            Supplier<Stream<? extends T>> dataStreamSupplier,
            Class<T> clazz,
            Consumer<WriteSheet> sheetConfigurator) throws IOException {
        // 设置响应编码
        response.setCharacterEncoding("utf-8");
        // 设置文件下载头
        response.setHeader("Content-Disposition", "attachment;filename=" + encodeFileName(fileName));
        // 设置内容类型
        response.setContentType("application/vnd.ms-excel");

        try (ExcelWriter writer = EasyExcel.write(response.getOutputStream(), clazz).excelType(ExcelTypeEnum.XLS).build();
             Stream<T> stream = (Stream<T>) dataStreamSupplier.get()) {
            // 创建Sheet配置
            WriteSheet sheet = EasyExcel.writerSheet("Sheet1").build();
            if (sheetConfigurator != null) {
                sheetConfigurator.accept(sheet); // 应用自定义Sheet配置
            }
            // 并行写入 - 分成4个并行组提高效率
            stream.collect(Collectors.groupingByConcurrent(
                item -> ThreadLocalRandom.current().nextInt(4),
                Collectors.toList()
            )).values().parallelStream()
               .forEach(chunk -> writer.write(chunk, sheet));
        }
    }

    /**
     * 导出Excel文件(简化版)
     * @param <T> 数据类型
     * @param response HttpServletResponse对象
     * @param fileName 文件名
     * @param dataList 数据列表
     * @param clazz 数据类型Class
     * @throws IOException IO异常
     */
    public static <T> void export(
            HttpServletResponse response,
            String fileName,
            List<T> dataList,
            Class<T> clazz) throws IOException {
        export(response, fileName, () -> dataList.stream(), clazz, null);
    }

    /**
     * 编码文件名，解决中文乱码问题
     * @param fileName 原始文件名
     * @return 编码后的文件名
     */
    private static String encodeFileName(String fileName) {
        if (StringUtils.isEmpty(fileName)) {
            return "export.xls";
        }
        // 确保文件扩展名正确
        if (!fileName.endsWith(".xls") && !fileName.endsWith(".xlsx")) {
            fileName += ".xls";
        }
        try {
            return URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return fileName;
        }
    }
}
```

### 3. 依赖配置

```java
    <easyexcel.version>3.3.4</easyexcel.version>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>easyexcel</artifactId>
        <version>${easyexcel.version}</version>
    </dependency>
    <!-- 如需使用Spring相关功能，还需导入Spring核心依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.20</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>5.3.20</version>
    </dependency>
```

### 4. 使用示例

#### 4.1 基础使用示例

```java
import com.example.dto.UserDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
public class ExcelController {

    @GetMapping("/export/users")
    public void exportUsers(HttpServletResponse response) throws IOException {
        // 1. 查询数据
        List<UserDTO> userList = userService.queryAllUsers();

        // 2. 导出Excel
        ExcelExportUtils.export(response, "用户列表.xls", userList, UserDTO.class);
    }
}
```

#### 4.2 自定义Sheet配置示例

```java
@GetMapping("/export/users/custom")
public void exportUsersWithCustomSheet(HttpServletResponse response) throws IOException {
    // 1. 查询数据（使用流式查询）
    Supplier<Stream<UserDTO>> dataStreamSupplier = () -> userService.queryUsersStream();

    // 2. 导出Excel，自定义Sheet名称和样式
    ExcelExportUtils.export(
        response,
        "用户列表-自定义.xls",
        dataStreamSupplier,
        UserDTO.class,
        sheet -> {
            // 设置Sheet名称
            sheet.setSheetName("用户数据");
            // 可以在这里设置更多Sheet属性，如样式等
        }
    );
}
```

#### 4.3 数据模型示例

```java
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class UserDTO {
    @ExcelProperty("用户ID")
    private Long id;

    @ExcelProperty("用户名")
    private String username;

    @ExcelProperty("邮箱")
    private String email;

    @ExcelProperty("创建时间")
    private String createTime;

    // 省略getter和setter方法
}
```

## 知识扩展

### 1. 设计思想

- **流式处理**：使用Java 8 Stream API处理大数据集，避免一次性加载全部数据到内存
- **并行处理**：利用groupingByConcurrent和parallelStream提高写入效率
- **函数式编程**：通过Supplier和Consumer接口提供灵活的扩展点
- **资源管理**：使用try-with-resources确保资源正确关闭

### 2. 避坑指南

- **内存溢出风险**：对于超大数据集，建议使用分页查询或流式查询，避免一次性加载全部数据
- **并发安全**：确保dataStreamSupplier提供的流是线程安全的
- **文件名编码**：工具类已处理文件名编码，但仍需注意不同浏览器的兼容性问题
- **Excel版本**：当前示例使用XLS格式，如需使用XLSX格式，修改ExcelTypeEnum即可
- **异常处理**：建议在Controller层添加全局异常处理，捕获导出过程中可能出现的异常

### 3. 深度思考题

**思考题**：如何进一步优化该导出工具，以支持更复杂的导出场景（如多Sheet导出、动态表头、数据格式化等）？

**思考题回答**：
1. 多Sheet导出：可以扩展export方法，支持传入多个数据提供者和Sheet配置器
2. 动态表头：结合EasyExcel的HeadGenerator接口，实现动态生成表头
3. 数据格式化：使用EasyExcel的@ExcelProperty注解的converter属性，自定义数据转换器
4. 性能优化：对于超大数据集，可以实现分片导出，或使用异步导出方式
5. 导出进度监控：添加进度监听接口，实时反馈导出进度

通过这些扩展，可以使工具类支持更复杂的业务场景，同时保持代码的可维护性和扩展性。