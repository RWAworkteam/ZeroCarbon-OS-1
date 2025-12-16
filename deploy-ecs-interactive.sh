#!/bin/bash

# 交互式 ECS 部署脚本

set -e

PROJECT_DIR="/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"
SERVER_IP="120.26.19.79"
SERVER_USER="root"

echo "🚀 零碳园区平台 ECS 部署脚本"
echo "================================"
echo ""

# 1. 检查并构建
cd "$PROJECT_DIR" || exit 1

echo "📦 步骤 1/6: 检查项目..."
if [ ! -d "node_modules" ]; then
    echo "   安装依赖..."
    npm install
fi

if [ ! -d "dist" ] || [ "dist/index.html" -ot "package.json" ]; then
    echo "📦 步骤 2/6: 构建项目..."
    npm run build
else
    echo "✅ 构建文件已存在，跳过构建"
fi

# 2. 打包
echo ""
echo "📦 步骤 3/6: 打包文件..."
tar czf zerocarbon-os-dist.tgz dist/
echo "✅ 打包完成: zerocarbon-os-dist.tgz"
echo ""

# 3. 查找密钥文件
echo "🔑 步骤 4/6: 查找密钥文件..."
KEY_FOUND=false

# 常见位置
KEY_PATHS=(
    "$HOME/.ssh/user.pem"
    "$HOME/.ssh/user1.pem"
    "$HOME/Downloads/user.pem"
    "$HOME/Downloads/user1.pem"
    "$HOME/Desktop/user.pem"
    "$HOME/Desktop/user1.pem"
)

for key_path in "${KEY_PATHS[@]}"; do
    if [ -f "$key_path" ]; then
        echo "✅ 找到密钥文件: $key_path"
        SSH_KEY_PATH="$key_path"
        KEY_FOUND=true
        break
    fi
done

if [ "$KEY_FOUND" = false ]; then
    echo "⚠️  未找到密钥文件"
    echo ""
    echo "请提供密钥文件路径："
    echo "1. 如果密钥在阿里云控制台下载，通常在 Downloads 文件夹"
    echo "2. 密钥文件名可能是: user.pem 或 user1.pem"
    echo ""
    read -p "请输入密钥文件完整路径: " SSH_KEY_PATH
    
    if [ ! -f "$SSH_KEY_PATH" ]; then
        echo "❌ 密钥文件不存在: $SSH_KEY_PATH"
        exit 1
    fi
fi

# 4. 设置密钥权限
chmod 600 "$SSH_KEY_PATH"

# 5. 上传文件
echo ""
echo "📤 步骤 5/6: 上传文件到服务器..."
scp -i "$SSH_KEY_PATH" zerocarbon-os-dist.tgz ${SERVER_USER}@${SERVER_IP}:/tmp/
scp -i "$SSH_KEY_PATH" fix-ecs.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
echo "✅ 上传完成"
echo ""

# 6. 在服务器上执行部署
echo "🔧 步骤 6/6: 在服务器上配置..."
ssh -i "$SSH_KEY_PATH" ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "   执行修复脚本..."
chmod +x /tmp/fix-ecs.sh
sudo bash /tmp/fix-ecs.sh

echo ""
echo "✅ 服务器配置完成！"
ENDSSH

# 清理
echo ""
echo "🧹 清理临时文件..."
rm -f zerocarbon-os-dist.tgz

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: http://${SERVER_IP}"
echo ""
echo "如果无法访问，请检查："
echo "1. 安全组是否开放 80 端口（你已经配置好了）"
echo "2. 服务器防火墙: sudo firewall-cmd --list-ports"
echo "3. Nginx 日志: sudo tail -f /var/log/nginx/zerocarbon-os-error.log"
