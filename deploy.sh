#!/bin/bash

# 零碳园区平台部署脚本

echo "🚀 开始部署零碳园区平台..."
echo ""

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "📦 正在构建项目..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败，请检查错误信息"
        exit 1
    fi
    echo "✅ 构建完成"
    echo ""
fi

# 检查 Vercel CLI
echo "🔍 检查 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

# 部署到 Vercel
echo ""
echo "🌐 开始部署到 Vercel..."
echo "提示：如果是第一次部署，需要在浏览器中登录 Vercel"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo "📝 你的网站已经上线，访问 URL 请查看上方输出"
else
    echo ""
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
