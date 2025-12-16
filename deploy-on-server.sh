#!/bin/bash

# 在阿里云 ECS 服务器上直接执行的部署脚本
# 使用方法：在阿里云控制台 Web 终端中，复制粘贴以下所有内容执行

set -e

echo "🚀 开始部署零碳园区平台..."
echo ""

# 1. 安装 Nginx
echo "📦 步骤 1/6: 安装 Nginx..."
if ! command -v nginx &> /dev/null; then
    if command -v dnf &> /dev/null; then
        sudo dnf install -y nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y nginx
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y nginx
    else
        echo "❌ 无法找到包管理器"
        exit 1
    fi
    echo "✅ Nginx 安装完成"
else
    echo "✅ Nginx 已安装"
fi
echo ""

# 2. 创建网站目录
echo "📁 步骤 2/6: 创建网站目录..."
sudo mkdir -p /var/www/zerocarbon-os
echo "✅ 目录创建完成"
echo ""

# 3. 检查是否有上传的文件
echo "📦 步骤 3/6: 检查上传的文件..."
if [ -f "/tmp/zerocarbon-os-dist.tgz" ]; then
    echo "   找到上传的文件，开始解压..."
    cd /tmp
    sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
    echo "✅ 文件解压完成"
elif [ -f "/root/zerocarbon-os-dist.tgz" ]; then
    echo "   在 /root 目录找到文件，开始解压..."
    cd /root
    sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
    echo "✅ 文件解压完成"
else
    echo "⚠️  未找到上传的文件"
    echo "   请先上传 zerocarbon-os-dist.tgz 到 /tmp 或 /root 目录"
    echo "   或者手动创建测试页面..."
    sudo bash -c 'cat > /var/www/zerocarbon-os/index.html << "EOF"
<!DOCTYPE html>
<html>
<head>
    <title>零碳园区平台 - 等待上传文件</title>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial; text-align: center; padding: 50px;">
    <h1>🚀 部署中...</h1>
    <p>Nginx 配置正常，请上传 zerocarbon-os-dist.tgz 文件到 /tmp 目录后重新执行此脚本</p>
</body>
</html>
EOF'
fi
echo ""

# 4. 设置权限
echo "🔐 步骤 4/6: 设置文件权限..."
sudo chmod -R 755 /var/www/zerocarbon-os
if id "nginx" &>/dev/null; then
    sudo chown -R nginx:nginx /var/www/zerocarbon-os
elif id "www-data" &>/dev/null; then
    sudo chown -R www-data:www-data /var/www/zerocarbon-os
fi
echo "✅ 权限设置完成"
echo ""

# 5. 配置 Nginx
echo "⚙️  步骤 5/6: 配置 Nginx..."
sudo bash -c 'cat > /etc/nginx/conf.d/zerocarbon-os.conf << "NGINXEOF"
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
NGINXEOF'
echo "✅ Nginx 配置完成"
echo ""

# 6. 测试并启动 Nginx
echo "🧪 步骤 6/6: 测试并启动 Nginx..."
if sudo nginx -t; then
    echo "✅ Nginx 配置测试通过"
    sudo systemctl enable nginx
    sudo systemctl restart nginx
    echo "✅ Nginx 已启动"
else
    echo "❌ Nginx 配置有误，请检查错误信息"
    exit 1
fi
echo ""

# 7. 检查防火墙
echo "🔥 检查防火墙..."
if command -v firewall-cmd &> /dev/null; then
    if sudo firewall-cmd --list-ports | grep -q "80/tcp"; then
        echo "✅ 防火墙已开放 80 端口"
    else
        echo "   正在开放 80 端口..."
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --reload
        echo "✅ 防火墙已配置"
    fi
fi
echo ""

# 8. 验证部署
echo "📊 部署验证..."
echo ""
echo "Nginx 状态:"
sudo systemctl status nginx --no-pager | head -5
echo ""
echo "文件列表:"
ls -lh /var/www/zerocarbon-os/ | head -10
echo ""
echo "本地访问测试:"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" http://127.0.0.1 || echo "本地访问测试失败"
echo ""

echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: http://120.26.19.79"
echo ""
echo "如果无法访问，请检查："
echo "1. 安全组是否开放 80 端口（已确认）"
echo "2. 查看错误日志: sudo tail -20 /var/log/nginx/zerocarbon-os-error.log"
echo "3. 查看访问日志: sudo tail -20 /var/log/nginx/zerocarbon-os-access.log"
