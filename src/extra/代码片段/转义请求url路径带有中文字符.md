---
title: 转义请求url路径带有中文字符
---
```java
http://127.0.0.1:9997/file/地震应急预案（二级）.docx

//对中文路径进行截取转义
int lastIndexOf = downloadUrl.lastIndexOf('/');
String fileName = downloadUrl.substring(lastIndexOf + 1);
// 转义关键代码
String newFileName = URLEncoder.encode(fileName, "utf-8");
String subUrl = downloadUrl.substring(0,lastIndexOf + 1);
String newUrl = subUrl + newFileName;

URL url = new URL(newUrl);
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
```

