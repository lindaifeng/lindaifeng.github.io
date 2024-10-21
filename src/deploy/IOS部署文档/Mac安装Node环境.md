---
order: 2
title: Mac安装Node环境
categories: 
  - Mac
tags: 
  - node
---
# 安装指定版本Node环境

## Mac或Windows安装Node环境

### 安装node环境

Node官网下载对应系统版本：[下载地址](https://url.nodejs.cn/download/)

验证是否安装成功：npm是一个NodeJS包管理和分发工具

```
查看安装版本
node -v
npm -v
```

### 更换镜像源

查看初始npm源(默认国外的镜像源地址比较慢改为国内的)

```
npm config get registry
```

更换镜像为淘宝镜像

```
npm config set registry https://registry.npm.taobao.org/
```

检查配置是否成功

```
npm config get registry
```

全局安装基于淘宝源的cnpm（可选）

```
npm install cnpm@6.1.1 -g
```

执行命令查看cnpm是否安装成功

```
cnpm -v
```

## 安装管理Node版本工具

> 管理Node版本可以使用`n`或`nvm`这两种工具

### Windows安装包管理器

Windows安装nvm包管理器(可选)

[安装包下载](https://github.com/coreybutler/nvm-windows/releases)

查看版本：

```
nvm -v
```

安装node版本：

```
nvm install 10.16.0
```

切换node 版本：

```
nvm use 8.14.1
```

### Mac安装包管理器

> mac一般都会安装包管理器Homebrew，可以使用 Homebrew 安装 `n`或`nvm`:
>
> ```
> brew install n
> brew install nvm
> ```
>
> 如果你还没有安装Homebrew，先在终端执行以下命令安装Homebrew：
>
> `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

**Mac安装n包管理器(可选)**

安装 node版本管理工具 n

```
sudo npm install -g n
```

检查安装成功：

```
n --version
```

安装你需要的版本的node

```
sudo n <node版本号>
如：
sudo n 11.0.0
```

**Mac安装nvm包管理器(可选)**

要安装或更新 `nvm`，需要手动下载并运行脚本，或使用以下 `cURL` 或 `Wget` 命令：

```cpp
cURL下载
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
Wget下载
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

⚠️在执行到这里的时候,可能会产生如下报错`fatal: unable to access 'https://github.com/nvm-sh/nvm.git/'`
执行以下命令，然后重新执行` cURL 或 Wget 命令

```
git config --global --unset http.proxy
git config --global --unset https.proxy
```

查看版本：

```
nvm -v
```





---------------

## 扩展命令

```
// 安装最新版本
sudo n latest
// 安装稳定版本
sudo n stable
// 删除某个版本
sudo n rm <版本号>
```



## 切换node版本

> 在macOS上切换Node.js版本，可以使用`n`或`nvm`这两种工具

如果你已经安装了`n`，切换版本的命令如下：

```
# 切换到Node.js 14.17.0版本
n 14.17.0  
```

如果你使用的是`nvm`（Node Version Manager），切换版本的命令如下

```
# 切换到Node.js 14.17.0版本
nvm use 14.17.0  
```

