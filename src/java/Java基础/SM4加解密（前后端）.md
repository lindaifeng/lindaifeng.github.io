---
title: SM4加解密
categories: 
  - Java
tags: 
  - sm4
order: 2
---



# SM4加解密（前后端）



java与js前后端加解密（亲测有效）

## 1、Sm4工具类

```java
import java.security.SecureRandom;
import java.security.Security;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.SecretKeySpec;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

/**
 * 国密SM4分组密码算法工具类（对称加密）
 *<p>GB/T 32907-2016 信息安全技术 SM4分组密码算法</p>
*<p>SM4-ECB-PKCS5Padding</p>
*/
public class Sm4Util {
  // <!-- 轻量级加密API -->
  //  <dependency>
  //    <groupId>org.bouncycastle</groupId>
  //    <artifactId>bcprov-jdk15on</artifactId>
  //<version>1.68</version>
  //  </dependency>

  private static final StringALGORITHM_NAME= "SM4";
  private static final StringALGORITHM_ECB_PKCS5PADDING= "SM4/ECB/PKCS5Padding";

  //密钥
  private static final StringKEY_STR= "FA171555405706F73D7B973DB89F0B47";
  private static final byte[]KEY;

  //初始化密钥（十六进制字符串转字节数组）
  static {
KEY= StrUtil.hexToBin(KEY_STR);
  }

/**
   * SM4算法目前只支持128位（即密钥16字节）
   */
private static final intDEFAULT_KEY_SIZE= 128;

  static {
    // 防止内存中出现多次BouncyCastleProvider的实例
    if (null == Security.getProvider(BouncyCastleProvider.PROVIDER_NAME)) {
      Security.addProvider(new BouncyCastleProvider());
    }
  }

  private Sm4Util() {
  }

  public static void main(String[] args) throws Exception {
    //加密
    String txt = "sm4对称加密<pkcs5>演示←←";
    byte[] output = Sm4Util.encrypt(StrUtil.strToBin(txt),KEY); //密文
    String hex = StrUtil.binToHex(output); //字节数组转十六进制字符串
    System.out.printf("SM4-ECB-PKCS5Padding，加密输出HEX = %s \\n", hex);
    // 解密
    byte[] input = StrUtil.hexToBin(hex); //密文转字节
    output = Sm4Util.decrypt(input,KEY); //字节解密
    String s = StrUtil.binToStr(output); //原文字节数组转UTF8字符串
    System.out.printf("SM4-ECB-PKCS5Padding，解密输出 = %s \\n", s);
    System.out.printf("SM4-ECB-PKCS5Padding，key = %s", StrUtil.binToHex(KEY));
  }

/**
   * 生成密钥
   *<p>建议使用DigestUtil.binToHex将二进制转成HEX</p>
*
   *@return密钥16位
   *@throwsException 生成密钥异常
   */
public static byte[] generateKey() throws Exception {
    KeyGenerator kg = KeyGenerator.getInstance(ALGORITHM_NAME, BouncyCastleProvider.PROVIDER_NAME);
    kg.init(DEFAULT_KEY_SIZE, new SecureRandom());
    return kg.generateKey().getEncoded();
  }

/**
   * 加密，SM4-ECB-PKCS5Padding
   *
   *@paramdata要加密的明文
   *@paramkey密钥16字节，使用Sm4Util.generateKey()生成
   *@return加密后的密文
   *@throwsException 加密异常
   */
public static byte[] encrypt(byte[] data, byte[] key) throws Exception {
    returnsm4(data, key, Cipher.ENCRYPT_MODE);
  }

/**
   * 解密，SM4-ECB-PKCS5Padding
   *
   *@paramdata要解密的密文
   *@paramkey密钥16字节，使用Sm4Util.generateKey()生成
   *@return解密后的明文
   *@throwsException 解密异常
   */
public static byte[] decrypt(byte[] data, byte[] key) throws Exception {
    returnsm4(data, key, Cipher.DECRYPT_MODE);
  }

/**
   * SM4对称加解密
   *
   *@paraminput明文（加密模式）或密文（解密模式）
   *@paramkey密钥
   *@parammodeCipher.ENCRYPT_MODE - 加密；Cipher.DECRYPT_MODE - 解密
   *@return密文（加密模式）或明文（解密模式）
   *@throwsException 加解密异常
   */
private static byte[] sm4(byte[] input, byte[] key, int mode)
      throws Exception {
    SecretKeySpec sm4Key = new SecretKeySpec(key,ALGORITHM_NAME);
    Cipher cipher = Cipher
        .getInstance(ALGORITHM_ECB_PKCS5PADDING, BouncyCastleProvider.PROVIDER_NAME);
    cipher.init(mode, sm4Key);
    return cipher.doFinal(input);
  }
}
```

## 2、字符串工具类

```java
import java.nio.charset.StandardCharsets;
import org.bouncycastle.util.Strings;
import org.bouncycastle.util.encoders.Hex;

/**
 * 字符串工具类
 *
 *@authorBBF
 */
public class StrUtil {

/**
   * 字节数组转十六进制字符串
   *
   *@parambytes字节数组
   *@return十六进制字符串
   */
public static String binToHex(byte[] bytes) {
    return Hex.toHexString(bytes).toUpperCase();
  }

/**
   * 十六进制字符串转字节数组
   *
   *@paramhex字节数组
   *@return十六进制字符串
   */
public static byte[] hexToBin(String hex) {
    return Hex.decode(hex);
  }

/**
   * 字节数组转UTF8字符串
   *
   *@parambytes字节数组
   *@returnUTF8字符串
   */
public static String binToStr(byte[] bytes) {
    return new String(bytes, StandardCharsets.UTF_8);
  }

/**
   * UTF8字符串转字节数组
   *
   *@paramstrUTF8字符串
   *@return字节数组
   */
public static byte[] strToBin(String str) {
    return Strings.toUTF8ByteArray(str);
  }
}
```

## 3、sm.js

```java
window.sm4=function(r){function n(e){if(t[e])return t[e].exports;var o=t[e]={i:e,l:!1,exports:{}};return r[e].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};return n.m=r,n.c=t,n.d=function(r,t,e){n.o(r,t)||Object.defineProperty(r,t,{configurable:!1,enumerable:!0,get:e})},n.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return n.d(t,"a",t),t},n.o=function(r,n){return Object.prototype.hasOwnProperty.call(r,n)},n.p="",n(n.s=8)}({8:function(r,n,t){"use strict";function e(r){if(Array.isArray(r)){for(var n=0,t=Array(r.length);n<r.length;n++)t[n]=r[n];return t}return Array.from(r)}function o(r){for(var n=[],t=0,e=r.length;t<e;t+=2)n.push(parseInt(r.substr(t,2),16));return n}function u(r){return r.map(function(r){return r=r.toString(16),1===r.length?"0"+r:r}).join("")}function i(r){for(var n=[],t=0,e=r.length;t<e;t++){var o=r.charCodeAt(t);o<=127?n.push(o):o<=2047?(n.push(192|o>>>6),n.push(128|63&o)):(n.push(224|o>>>12),n.push(128|o>>>6&63),n.push(128|63&o))}return n}function f(r){for(var n=[],t=0,e=r.length;t<e;t++)r[t]>=224&&r[t]<=239?(n.push(String.fromCharCode(((15&r[t])<<12)+((63&r[t+1])<<6)+(63&r[t+2]))),t+=2):r[t]>=192&&r[t]<=223?(n.push(String.fromCharCode(((31&r[t])<<6)+(63&r[t+1]))),t++):n.push(String.fromCharCode(r[t]));return n.join("")}function a(r,n){return r<<n|r>>>32-n}function c(r){return(255&w[r>>>24&255])<<24|(255&w[r>>>16&255])<<16|(255&w[r>>>8&255])<<8|255&w[255&r]}function s(r){return r^a(r,2)^a(r,10)^a(r,18)^a(r,24)}function p(r){return r^a(r,13)^a(r,23)}function h(r,n,t){for(var e=new Array(4),o=new Array(4),u=0;u<4;u++)o[0]=255&r[0+4*u],o[1]=255&r[1+4*u],o[2]=255&r[2+4*u],o[3]=255&r[3+4*u],e[u]=o[0]<<24|o[1]<<16|o[2]<<8|o[3];for(var i,f=0;f<32;f+=4)i=e[1]^e[2]^e[3]^t[f+0],e[0]^=s(c(i)),i=e[2]^e[3]^e[0]^t[f+1],e[1]^=s(c(i)),i=e[3]^e[0]^e[1]^t[f+2],e[2]^=s(c(i)),i=e[0]^e[1]^e[2]^t[f+3],e[3]^=s(c(i));for(var a=0;a<16;a+=4)n[a]=e[3-a/4]>>>24&255,n[a+1]=e[3-a/4]>>>16&255,n[a+2]=e[3-a/4]>>>8&255,n[a+3]=255&e[3-a/4]}function v(r,n,t){for(var e=new Array(4),o=new Array(4),u=0;u<4;u++)o[0]=255&r[0+4*u],o[1]=255&r[1+4*u],o[2]=255&r[2+4*u],o[3]=255&r[3+4*u],e[u]=o[0]<<24|o[1]<<16|o[2]<<8|o[3];e[0]^=2746333894,e[1]^=1453994832,e[2]^=1736282519,e[3]^=2993693404;for(var i,f=0;f<32;f+=4)i=e[1]^e[2]^e[3]^A[f+0],n[f+0]=e[0]^=p(c(i)),i=e[2]^e[3]^e[0]^A[f+1],n[f+1]=e[1]^=p(c(i)),i=e[3]^e[0]^e[1]^A[f+2],n[f+2]=e[2]^=p(c(i)),i=e[0]^e[1]^e[2]^A[f+3],n[f+3]=e[3]^=p(c(i));if(t===g)for(var a,s=0;s<16;s++)a=n[s],n[s]=n[31-s],n[31-s]=a}function l(r,n,t){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},c=a.padding,s=void 0===c?"pkcs#5":c,p=(a.mode,a.output),l=void 0===p?"string":p;if("string"==typeof n&&(n=o(n)),16!==n.length)throw new Error("key is invalid");if(r="string"==typeof r?t!==g?i(r):o(r):[].concat(e(r)),"pkcs#5"===s&&t!==g)for(var w=d-r.length%d,A=0;A<w;A++)r.push(w);var m=new Array(y);v(n,m,t);for(var C=[],x=r.length,b=0;x>=d;){var j=r.slice(b,b+16),k=new Array(16);h(j,k,m);for(var S=0;S<d;S++)C[b+S]=k[S];x-=d,b+=d}if("pkcs#5"===s&&t===g){var O=C[C.length-1];C.splice(C.length-O,O)}return"array"!==l?t!==g?u(C):f(C):C}var g=0,y=32,d=16,w=[214,144,233,254,204,225,61,183,22,182,20,194,40,251,44,5,43,103,154,118,42,190,4,195,170,68,19,38,73,134,6,153,156,66,80,244,145,239,152,122,51,84,11,67,237,207,172,98,228,179,28,169,201,8,232,149,128,223,148,250,117,143,63,166,71,7,167,252,243,115,23,186,131,89,60,25,230,133,79,168,104,107,129,178,113,100,218,139,248,235,15,75,112,86,157,53,30,36,14,94,99,88,209,162,37,34,124,59,1,33,120,135,212,0,70,87,159,211,39,82,76,54,2,231,160,196,200,158,234,191,138,210,64,199,56,181,163,247,242,206,249,97,21,161,224,174,93,164,155,52,26,85,173,147,50,48,245,140,177,227,29,246,226,46,130,102,202,96,192,41,35,171,13,83,78,111,213,219,55,69,222,253,142,47,3,255,106,114,109,108,91,81,141,27,175,146,187,221,188,127,17,217,92,65,31,16,90,216,10,193,49,136,165,205,123,189,45,116,208,18,184,229,180,176,137,105,151,74,12,150,119,126,101,185,241,9,197,110,198,132,24,240,125,236,58,220,77,32,121,238,95,62,215,203,57,72],A=[462357,472066609,943670861,1415275113,1886879365,2358483617,2830087869,3301692121,3773296373,4228057617,404694573,876298825,1347903077,1819507329,2291111581,2762715833,3234320085,3705924337,4177462797,337322537,808926789,1280531041,1752135293,2223739545,2695343797,3166948049,3638552301,4110090761,269950501,741554753,1213159005,1684763257];r.exports={encrypt:function(r,n,t){return l(r,n,1,t)},decrypt:function(r,n,t){return l(r,n,0,t)}}}});
```

## 4、sm.html

```java
<!doctype html>
<html lang="zh-cmn-Hans">
<head>
  <meta charset="UTF-8"/>
  <title>SM4加解密</title>
</head>
<body>
<strong>打开控制台，查看结果</strong>
<br>脚本来自：<https://github.com/JuneAndGreen/sm-crypto>
<script src="sm4.js"></script>
<script>
  /**
   * SM4-ECB-PKCS5Padding对称加密
   * @param text {string} 要加密的明文
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 加密后的密文，Base64格式
   */
  function SM4_ECB_ENCRYPT(text, secretKey) {
	return sm4.encrypt(text, secretKey).toUpperCase();
  }

  /**
   * SM4-ECB-PKCS5Padding对称解密
   * @param textBase64 {string} 要解密的密文，Base64格式
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 解密后的明文
   */
  function SM4_ECB_DECRYPT(textBase64, secretKey) {
	return sm4.decrypt(textBase64, secretKey);
  }

</script>
<script>
  var message = "sm4对称加密<pkcs5>演示←←";
  var key = "FA171555405706F73D7B973DB89F0B47";

  var ecbEncrypt = SM4_ECB_ENCRYPT(message, key);
  console.log("ecb加密", ecbEncrypt);
  var ecbDecrypt = SM4_ECB_DECRYPT(ecbEncrypt, key);
  console.log("ecb解密", ecbDecrypt);
  console.log("明文与解密结果比较---", message === ecbDecrypt)
</script>
</body>
</html>
```