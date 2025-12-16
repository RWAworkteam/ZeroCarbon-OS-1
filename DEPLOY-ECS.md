# ECS 部署指南

## 📦 文件已准备好

打包文件位置：`zerocarbon-os-dist.tgz`

## 🚀 方式一：自动化部署（推荐）

### 步骤：

1. **修改部署脚本中的密钥路径**

   编辑 `deploy-ecs.sh`，找到这一行：
   ```bash
   SSH_KEY_PATH="${HOME}/.ssh/user.pem"  # 请修改为你的密钥路径
   ```
   
   改成你的密钥文件实际路径，例如：
   ```bash
   SSH_KEY_PATH="/Users/zhangchaozhe/Downloads/user.pem"
   ```

2. **执行部署脚本**

   ```bash
   cd "/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"
   ./deploy-ecs.sh
   ```

   脚本会自动：
   - 构建项目
   - 打包文件
   - 上传到服务器
   - 配置 Nginx
   - 启动服务

---

## 🔧 方式二：手动部署

### 步骤 1：上传文件到服务器

在你的 Mac 上执行（替换密钥路径）：

```bash
cd "/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"

# 上传打包文件
scp -i /path/to/your/key.pem zerocarbon-os-dist.tgz root@120.26.19.79:/tmp/

# 上传修复脚本
scp -i /path/to/your/key.pem fix-ecs.sh root@120.26.19.79:/tmp/
```

### 步骤 2：登录服务器并执行修复

```bash
# 登录服务器
ssh -i /path/to/your/key.pem root@120.26.19.79

# 执行修复脚本
chmod +x /tmp/fix-ecs.sh
sudo /tmp/fix-ecs.sh
```

### 步骤 3：如果修复脚本无法执行，手动操作

在服务器上依次执行：

```bash
# 1. 安装 Nginx
sudo dnf install -y nginx

# 2. 创建网站目录
sudo mkdir -p /var/www/zerocarbon-os

# 3. 解压文件
cd /tmp
sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
sudo chmod -R 755 /var/www/zerocarbon-os

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

# 5. 测试配置
sudo nginx -t

# 6. 启动 Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# 7. 检查状态
sudo systemctl status nginx
```

---

## ✅ 验证部署

1. **在浏览器访问**：`http://120.26.19.79`

2. **如果还是 502，检查日志**：

   ```bash
   # 在服务器上执行
   sudo tail -20 /var/log/nginx/zerocarbon-os-error.log
   sudo tail -20 /var/log/nginx/error.log
   ```

3. **检查文件是否存在**：

   ```bash
   ls -la /var/www/zerocarbon-os/
   ```

4. **检查 Nginx 是否运行**：

   ```bash
   sudo systemctl status nginx
   ```

---

## 🔍 常见问题

### 问题 1：502 Bad Gateway

**原因**：Nginx 未运行或配置错误

**解决**：
```bash
sudo systemctl restart nginx
sudo nginx -t  # 检查配置
```

### 问题 2：403 Forbidden

**原因**：文件权限问题

**解决**：
```bash
sudo chmod -R 755 /var/www/zerocarbon-os
sudo chown -R nginx:nginx /var/www/zerocarbon-os
```

### 问题 3：页面空白或找不到资源

**原因**：文件路径不对

**解决**：
```bash
# 确认 index.html 存在
ls -la /var/www/zerocarbon-os/index.html

# 确认 assets 目录存在
ls -la /var/www/zerocarbon-os/assets/
```

---

## 📝 后续更新

以后更新网站，只需要：

```bash
cd "/Users/zhangchaozhe/Documents/hk/RWA/project2/zerocarbon-os 1"
npm run build
tar czf zerocarbon-os-dist.tgz dist/
scp -i /path/to/key.pem zerocarbon-os-dist.tgz root@120.26.19.79:/tmp/

# 登录服务器
ssh -i /path/to/key.pem root@120.26.19.79
cd /tmp
sudo tar xzf zerocarbon-os-dist.tgz -C /var/www/zerocarbon-os --strip-components=1
sudo systemctl restart nginx
```
