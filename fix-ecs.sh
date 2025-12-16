#!/bin/bash

# ECS 服务器端快速修复脚本
# 在服务器上执行此脚本来修复 502 错误

set -e

echo "🔧 开始修复 ECS 部署问题..."
echo ""

# 1. 检查并安装 Nginx
echo "📦 检查 Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "   安装 Nginx..."
    if command -v dnf &> /dev/null; then
        sudo dnf install -y nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y nginx
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y nginx
    fi
fi

# 2. 创建网站目录
echo "📁 创建网站目录..."
sudo mkdir -p /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os 2>/dev/null || sudo chown -R www-data:www-data /var/www/zerocarbon-os 2>/dev/null || true

# 3. 检查是否有上传的文件
if [ -f "/tmp/zerocarbon-os-dist.tgz" ]; then
    echo "📦 解压上传的文件..."
    sudo tar xzf /tmp/zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
    sudo chmod -R 755 /var/www/zerocarbon-os
fi

# 4. 检查文件是否存在
if [ ! -f "/var/www/zerocarbon-os/index.html" ]; then
    echo "⚠️  警告: /var/www/zerocarbon-os/index.html 不存在"
    echo "   请先上传 dist 文件到服务器"
    echo "   或者手动创建测试文件..."
    sudo bash -c 'echo "<h1>测试页面</h1><p>如果你看到这个，说明 Nginx 配置正常</p>" > /var/www/zerocarbon-os/index.html'
fi

# 5. 配置 Nginx
echo "⚙️  配置 Nginx..."
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

# 6. 测试配置
echo "🧪 测试 Nginx 配置..."
if sudo nginx -t; then
    echo "✅ Nginx 配置正确"
else
    echo "❌ Nginx 配置有误，请检查错误信息"
    exit 1
fi

# 7. 启动 Nginx
echo "🚀 启动 Nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

# 8. 检查状态
echo ""
echo "📊 Nginx 状态:"
sudo systemctl status nginx --no-pager | head -10

# 9. 检查防火墙
echo ""
echo "🔥 检查防火墙..."
if command -v firewall-cmd &> /dev/null; then
    if sudo firewall-cmd --list-ports | grep -q "80/tcp"; then
        echo "✅ 防火墙已开放 80 端口"
    else
        echo "⚠️  防火墙未开放 80 端口，正在添加..."
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --reload
    fi
fi

# 10. 测试本地访问
echo ""
echo "🧪 测试本地访问..."
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1 | grep -q "200"; then
    echo "✅ 本地访问正常"
else
    echo "⚠️  本地访问异常，请检查 Nginx 日志"
    echo "   错误日志: sudo tail -20 /var/log/nginx/zerocarbon-os-error.log"
fi

echo ""
echo "✅ 修复完成！"
echo ""
echo "🌐 现在可以通过 http://120.26.19.79 访问网站"
echo ""
echo "如果仍有问题，请检查："
echo "1. 文件是否存在: ls -la /var/www/zerocarbon-os/"
echo "2. Nginx 错误日志: sudo tail -f /var/log/nginx/zerocarbon-os-error.log"
echo "3. Nginx 访问日志: sudo tail -f /var/log/nginx/zerocarbon-os-access.log"
