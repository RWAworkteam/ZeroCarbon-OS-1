#!/bin/bash

# 零碳园区平台 ECS 部署脚本
# 使用方法：在本地执行此脚本，会自动打包、上传并配置服务器

set -e

# 配置信息（请根据实际情况修改）
SERVER_IP="120.26.19.79"
SERVER_USER="root"
SSH_KEY_PATH="${HOME}/.ssh/user.pem"  # 请修改为你的密钥路径
PROJECT_DIR="/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"

echo "🚀 开始部署零碳园区平台到 ECS..."
echo ""

# 检查密钥文件
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ 密钥文件不存在: $SSH_KEY_PATH"
    echo "请修改脚本中的 SSH_KEY_PATH 变量为你的密钥路径"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_DIR" || exit 1

# 1. 构建项目
echo "📦 步骤 1/5: 构建项目..."
if [ ! -d "node_modules" ]; then
    echo "   安装依赖..."
    npm install
fi

npm run build

if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi
echo "✅ 构建完成"
echo ""

# 2. 打包
echo "📦 步骤 2/5: 打包文件..."
tar czf zerocarbon-os-dist.tgz dist/
echo "✅ 打包完成"
echo ""

# 3. 上传到服务器
echo "📤 步骤 3/5: 上传文件到服务器..."
scp -i "$SSH_KEY_PATH" zerocarbon-os-dist.tgz ${SERVER_USER}@${SERVER_IP}:/tmp/
echo "✅ 上传完成"
echo ""

# 4. 在服务器上部署
echo "🔧 步骤 4/5: 在服务器上配置..."
ssh -i "$SSH_KEY_PATH" ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "   检查并安装 Nginx..."
if ! command -v nginx &> /dev/null; then
    if command -v dnf &> /dev/null; then
        sudo dnf install -y nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y nginx
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y nginx
    else
        echo "❌ 无法找到包管理器，请手动安装 Nginx"
        exit 1
    fi
fi

echo "   创建网站目录..."
sudo mkdir -p /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os || sudo chown -R www-data:www-data /var/www/zerocarbon-os

echo "   解压文件..."
cd /tmp
sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
sudo chmod -R 755 /var/www/zerocarbon-os

echo "   配置 Nginx..."
sudo bash -c 'cat > /etc/nginx/conf.d/zerocarbon-os.conf << "EOF"
server {
    listen       80;
    server_name  _;

    root   /var/www/zerocarbon-os;
    index  index.html;

    # 日志
    access_log  /var/log/nginx/zerocarbon-os-access.log;
    error_log   /var/log/nginx/zerocarbon-os-error.log;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF'

echo "   测试 Nginx 配置..."
sudo nginx -t

echo "   启动并启用 Nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "   检查 Nginx 状态..."
sudo systemctl status nginx --no-pager | head -5

echo ""
echo "✅ 服务器配置完成！"
ENDSSH

echo ""
echo "🧹 清理临时文件..."
rm -f zerocarbon-os-dist.tgz

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: http://${SERVER_IP}"
echo ""
echo "如果无法访问，请检查："
echo "1. 安全组是否开放 80 端口"
echo "2. 服务器防火墙: sudo firewall-cmd --list-ports (如果使用 firewalld)"
echo "3. Nginx 日志: sudo tail -f /var/log/nginx/zerocarbon-os-error.log"
