# ECS 部署详细步骤

## 🔑 密钥对问题

如果 SSH 连接失败，可能是密钥对还没有绑定到 ECS 实例。有两种解决方案：

---

## 方式一：通过阿里云控制台 Web 终端部署（最简单）

### 步骤：

1. **登录阿里云控制台**
   - 进入 ECS 实例页面
   - 找到实例 `i-bp1idp9k5n0ox7irrdgh`
   - 点击右侧的 **"远程连接"** 或 **"Workbench远程连接"**

2. **在 Web 终端中执行以下命令**：

```bash
# 1. 安装 Nginx
sudo dnf install -y nginx

# 2. 创建网站目录
sudo mkdir -p /var/www/zerocarbon-os

# 3. 创建测试页面（先验证 Nginx 是否正常）
sudo bash -c 'cat > /var/www/zerocarbon-os/index.html << "EOF"
<!DOCTYPE html>
<html>
<head>
    <title>零碳园区平台</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>部署中...</h1>
    <p>Nginx 配置正常，等待上传文件</p>
</body>
</html>
EOF'

# 4. 配置 Nginx
sudo bash -c 'cat > /etc/nginx/conf.d/zerocarbon-os.conf << "EOF"
server {
    listen       80;
    server_name  _;
    root   /var/www/zerocarbon-os;
    index  index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
EOF'

# 5. 设置权限
sudo chmod -R 755 /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os

# 6. 测试配置
sudo nginx -t

# 7. 启动 Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# 8. 检查状态
sudo systemctl status nginx
```

3. **上传文件到服务器**

   在 Web 终端中，点击 **"文件上传"** 或使用以下方法：

   **方法 A：通过 Web 终端上传**
   - 在 Web 终端界面找到文件上传功能
   - 上传 `zerocarbon-os-dist.tgz` 文件到 `/tmp/` 目录

   **方法 B：通过本地终端上传（如果 SSH 已配置）**
   ```bash
   cd "/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"
   scp -i chaozhe.pem zerocarbon-os-dist.tgz root@120.26.19.79:/tmp/
   ```

4. **在 Web 终端中解压并部署**：

```bash
# 解压文件
cd /tmp
sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1

# 设置权限
sudo chmod -R 755 /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os

# 重启 Nginx
sudo systemctl restart nginx

# 验证文件
ls -la /var/www/zerocarbon-os/
```

5. **访问网站**：`http://120.26.19.79`

---

## 方式二：先绑定密钥对，再 SSH 部署

### 步骤：

1. **在阿里云控制台绑定密钥对**
   - 进入 ECS 实例页面
   - 点击 **"更多"** → **"网络和安全组"** → **"绑定密钥对"**
   - 选择密钥对 `chaozhe`
   - 确认绑定（可能需要重启实例）

2. **等待实例重启完成后，在本地执行**：

```bash
cd "/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"

# 上传文件
scp -i chaozhe.pem zerocarbon-os-dist.tgz root@120.26.19.79:/tmp/
scp -i chaozhe.pem fix-ecs.sh root@120.26.19.79:/tmp/

# 登录并执行部署
ssh -i chaozhe.pem root@120.26.19.79
# 然后在服务器上执行：
chmod +x /tmp/fix-ecs.sh
sudo bash /tmp/fix-ecs.sh
```

---

## 📋 快速检查清单

部署完成后，检查以下内容：

```bash
# 1. 检查 Nginx 状态
sudo systemctl status nginx

# 2. 检查文件是否存在
ls -la /var/www/zerocarbon-os/index.html
ls -la /var/www/zerocarbon-os/assets/

# 3. 检查本地访问
curl -I http://127.0.0.1

# 4. 查看错误日志（如果有问题）
sudo tail -20 /var/log/nginx/error.log
```

---

## 🆘 如果遇到问题

### 502 Bad Gateway
```bash
sudo systemctl restart nginx
sudo nginx -t
```

### 403 Forbidden
```bash
sudo chmod -R 755 /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os
```

### 页面空白
```bash
# 检查文件是否正确解压
ls -la /var/www/zerocarbon-os/
# 应该看到 index.html 和 assets 目录
```
