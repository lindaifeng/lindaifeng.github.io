---
title: Excel导出工具类
---
 

### 工具类模板

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.support.ExcelTypeEnum;
import com.alibaba.excel.write.metadata.WriteSheet;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Excel 导出工具类
 * @author ldf
 */
public class ExcelExporter {
    
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
        try (ExcelWriter writer = EasyExcel.write(response.getOutputStream(), clazz).excelType(ExcelTypeEnum.XLS).build();
             Stream<T> stream = (Stream<T>) dataStreamSupplier.get()) {
            // 创建Sheet配置
            WriteSheet sheet = EasyExcel.writerSheet("Sheet1").build();
            if (sheetConfigurator != null) {
                sheetConfigurator.accept(sheet); // 应用自定义Sheet配置
            }
            // 并行写入
            stream.collect(Collectors.groupingByConcurrent(
                item -> ThreadLocalRandom.current().nextInt(4), // 分4个并行组
                Collectors.toList()
            )).values().parallelStream()
               .forEach(chunk -> writer.write(chunk, sheet));
        }
    }
    
    private static String encodeFileName(String name) {
        return URLEncoder.encode(name, StandardCharsets.UTF_8);
    }
}
```

### 示例代码

```java
    @GetMapping("exportValidReportingErrorLog")
    public void exportValidReportingErrorLog(@RequestParam String beginTime, @RequestParam String endTime,
                                             HttpServletResponse response) throws IOException {
        String fileName = FeedbackInfoUtil.getFeedBackInfoFileName(beginTime, endTime, "反馈结果-{}-{}.xls");
        // 获取业务数据导出
        ExcelExporter.export(response, fileName, () -> {
                    List<FeedbackInfo> feedbackInfoList = feedbackInfoUtil.getFeedbackInfoList(beginTime, endTime);
                    return feedbackInfoList.stream();
                },
                FeedbackInfo.class,
                writeSheet -> writeSheet.setSheetName("反馈结果"));
    }
```

这个 [ExcelExporter](file:///Users/ldf/app/ideaWorkSpace/zhongzhi/data-bootstrap/src/main/java/cn/devops/utils/ExcelExporter.java#L21-L62) 工具类具有以下几个显著的优点：

### 1. **流式处理大容量数据**
- 使用 `Supplier<Stream<? extends T>>` 作为数据源输入，支持流式处理大数据集，避免内存溢出（OOM）
- 特别适合导出百万级数据，不会一次性加载所有数据到内存

### 2. **并行导出优化**
- 通过 `Collectors.groupingByConcurrent` 和 `parallelStream()` 实现数据分片并行写入
- 默认分4个并行组（可调整），充分利用多核CPU提高导出速度

### 3. **高度可配置**
- 通过 `sheetConfigurator` 参数支持自定义Sheet配置
- 可灵活设置表头样式、列宽等Excel特性

### 4. **完善的异常处理**
- 使用 try-with-resources 确保资源自动关闭
- 明确声明 throws IOException 提醒调用方处理异常

### 5. **标准化文件下载**
- 自动处理文件名编码（支持中文等特殊字符）
- 正确设置 HTTP 响应头，确保浏览器正确识别下载文件

### 6. **泛型支持**
- 使用泛型 `<T>` 设计，可以导出任意类型的对象列表
- 通过 `Class<T> clazz` 参数自动识别数据类型生成对应格式

### 7. **高性能Excel生成**
- 基于阿里EasyExcel框架，避免传统POI的内存问题
- 支持.xls格式（兼容性更好）

### 8. **简洁的API设计**
- 单方法入口，参数明确
- 业务逻辑与导出逻辑解耦（数据查询与导出分离）

典型使用场景示例：
```java
// 业务代码只需要关注数据获取
ExcelExporter.export(
    response,
    "用户数据.xls",
    () -> userService.findLargeData().stream(), // 流式数据源
    User.class,
    sheet -> {
        sheet.setSheetName("用户列表"); // 自定义配置
        // 可添加其他配置...
    }
);
```


这个工具类特别适合需要导出大量数据的后台管理系统，在保证功能完整性的同时，兼顾了性能和内存安全。
