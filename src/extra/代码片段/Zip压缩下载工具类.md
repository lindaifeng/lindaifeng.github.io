---
title: Zip压缩下载工具类
---
```java
/**
 * 文件下载，与多文件压缩包下载
 *  文件下载后缓存目录文件要删除，文件名可采用日期加随机数命名以防重名覆盖文件
 */
 
import java.io.*;
import java.net.URL;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
 
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 压缩下载工具类
 */

@Slf4j
public class CompressDownloadUtil {
	
	private CompressDownloadUtil() {}


	public static void main(String[] args) throws Exception {
		String str = "https://factormarket.obs.cn-south-1.myhuaweicloud.com:443/res/app/market/202104/606ef3f987837f030f1b35fe.png?AccessKeyId=6UIOQ9TM69G2AALRN2AH&Expires=1653884153&Signature=HTSuFPPpahYa5DfMjApUvPRjxKM%3D";
		String str1 = "https://factormarket.obs.cn-south-1.myhuaweicloud.com:443/res/app/market/202104/606ef3f987837f030f1b35fe.png?AccessKeyId=6UIOQ9TM69G2AALRN2AH&Expires=1653884153&Signature=HTSuFPPpahYa5DfMjApUvPRjxKM%3D";


		LinkedList<String> list = new LinkedList<>();
		list.add(str);
		list.add(str1);

		LinkedList<String> linkedList = new LinkedList<>();
		linkedList.add("竞得人");
		linkedList.add("营业执照");

		File[] files = new File[list.size()];
		for (int i = 0; i < list.size(); i++) {
			URL url = new URL(list.get(i));
			InputStream inputStream = url.openStream();
			files[i] =inputStreamToFile(inputStream, linkedList.get(i));
		}

		//File file = FileUtil.file("list.zip");
		//File zipFile = ZipUtil.zip(file, false, files);


		//ZipOutputStream zos = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(zipFile)));

		//HttpServletResponse response = AppContext.getResponse();
		//HttpServletResponse response = ServletContext.getResponse();

		//HttpServletResponse response = RequestUtil.getResponse();

		HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
		compressZip(Arrays.asList(files),response.getOutputStream());

		//file.renameTo()
	}

	/**
	 *   工具类
	 * inputStream 转 File
	 */
	public static File inputStreamToFile(InputStream ins, String name) throws Exception{
		//System.getProperty("java.io.tmpdir")获取操作系统的缓存临时目录
		String tmpPath = System.getProperty("java.io.tmpdir") + File.separator + name;
		File file = new File(tmpPath);
		if (file.exists()) {
			return file;
		}
		OutputStream os = new FileOutputStream(file);
		int bytesRead;
		int len = 8192;
		byte[] buffer = new byte[len];
		while ((bytesRead = ins.read(buffer, 0, len)) != -1) {
			os.write(buffer, 0, bytesRead);
		}
		os.close();
		ins.close();
		return file;
	}

	/**
	 * 设置下载响应头
	 *
	 * @param response
	 * @return 
	 * @author hongwei.lian
	 * @date 2018年9月7日 下午3:01:59
	 */
	public static HttpServletResponse setDownloadResponse(HttpServletResponse response, String downloadName) throws UnsupportedEncodingException {
		response.reset();
		response.setCharacterEncoding("utf-8");
		response.setContentType("application/octet-stream");
		//response.setHeader("Content-Disposition", "attachment;fileName*=UTF-8''"+ downloadName);
		response.setHeader("Content-Disposition", "attachment; filename=" + java.net.URLEncoder.encode(downloadName, "UTF-8")); //防止中文乱码
		return response;
	}
	
	/**
	 * 字符串转换为整型数组
	 *
	 * @param param
	 * @return 
	 * @author hongwei.lian
	 * @date 2018年9月6日 下午6:38:39
	 */
	public static Integer[] toIntegerArray(String param) {
		return Arrays.stream(param.split(","))
                              .map(Integer::valueOf)
                              .toArray(Integer[]::new);
	}
	
	/**
	 * 将多个文件压缩到指定输出流中
	 *
	 * @param files 需要压缩的文件列表
	 * @param outputStream  压缩到指定的输出流
	 * @author hongwei.lian
	 * @date 2018年9月7日 下午3:11:59
	 */
	public static void compressZip(List<File> files, OutputStream outputStream) {
		ZipOutputStream zipOutStream = null;
		try {
			//-- 包装成ZIP格式输出流
			zipOutStream = new ZipOutputStream(new BufferedOutputStream(outputStream));
			// -- 设置压缩方法
			zipOutStream.setMethod(ZipOutputStream.DEFLATED);
			//-- 将多文件循环写入压缩包
			for (int i = 0; i < files.size(); i++) {
				File file = files.get(i);
				FileInputStream filenputStream = new FileInputStream(file);
				byte[] data = new byte[(int) file.length()];
				filenputStream.read(data);
				//-- 添加ZipEntry，并ZipEntry中写入文件流，这里，加上i是防止要下载的文件有重名的导致下载失败
				zipOutStream.putNextEntry(new ZipEntry(i + file.getName()));
				zipOutStream.write(data);
				filenputStream.close();
				zipOutStream.closeEntry();
			}
		} catch (IOException e) {
			log.error(CompressDownloadUtil.class.getName(), "downloadallfiles", e);
		}  finally {
			try {
				if (Objects.nonNull(zipOutStream)) {
					zipOutStream.flush();
					zipOutStream.close();
				}
				if (Objects.nonNull(outputStream)) {
					outputStream.close();
				}
			} catch (IOException e) {
				log.error(CompressDownloadUtil.class.getName(), "downloadallfiles", e);
			}
		}
	}
	
	/**
	 * 下载文件
	 *
	 * @param outputStream 下载输出流
	 * @param zipFilePath 需要下载文件的路径
	 * @author hongwei.lian
	 * @date 2018年9月7日 下午3:27:08
	 */
	public static void downloadFile(OutputStream outputStream, String zipFilePath) {
		File zipFile = new File(zipFilePath);
		if (!zipFile.exists()) {
			//-- 需要下载压塑包文件不存在
			return ;
		}
		FileInputStream inputStream = null;
		try {
			inputStream = new FileInputStream(zipFile);
			byte[] data = new byte[(int) zipFile.length()];
			inputStream.read(data);
			outputStream.write(data);
			outputStream.flush();
		} catch (IOException e) {
			log.error(CompressDownloadUtil.class.getName(), "downloadZip", e);
		} finally {
			try {
				if (Objects.nonNull(inputStream)) {
					inputStream.close();
				}
				if (Objects.nonNull(outputStream)) {
					outputStream.close();
				}
			} catch (IOException e) {
				log.error(CompressDownloadUtil.class.getName(), "downloadZip", e);
			}
		}
	}
	
	/**
	 * 删除指定路径的文件
	 *
	 * @param filepath 
	 * @author hongwei.lian
	 * @date 2018年9月7日 下午3:44:53
	 */
	public static void deleteFile(String filepath) {
		File file = new File(filepath);
		deleteFile(file);
	}
	
	/**
	 * 删除指定文件
	 *
	 * @param file 
	 * @author hongwei.lian
	 * @date 2018年9月7日 下午3:45:58
	 */
	public static void deleteFile(File file) {
		//-- 路径为文件且不为空则进行删除  
	    if (file.isFile() && file.exists()) {  
	        file.delete();  
	    } 
	}
 
}
```

