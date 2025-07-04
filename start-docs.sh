#!/bin/bash

# 加载nvm环境变量
source ~/.nvm/nvm.sh

echo "正在检查Node.js版本..."
required_version="v18.12.0"
current_version=$(node -v 2>/dev/null || true)

# 检查Node.js是否安装
if [ -z "$current_version" ]; then
  echo "未检测到Node.js，尝试通过nvm安装..."
  nvm install 20.9.0
  nvm use 20.9.0
elif [ "$(printf "%s\n" "$required_version" "$current_version" | sort -V | head -n1)" != "$required_version" ]; then
  echo "当前Node.js版本$current_version低于要求的$required_version"
  if nvm use 20.9.0; then
    echo "已切换到Node.js $(node -v)"
  else
    echo "无法切换到Node.js 20.9.0，请手动安装"
    exit 1
  fi
fi

# 启动文档服务
pnpm docs:dev