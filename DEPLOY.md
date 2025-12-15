# 部署指南

项目已成功构建，构建产物位于 `dist` 目录。以下是几种部署方式：

## 🚀 方式一：Vercel 部署（推荐，最简单）

### 步骤：

1. **安装 Vercel CLI**（如果还没有安装）：
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **在项目目录中部署**：
   ```bash
   cd "zerocarbon-os 1"
   vercel
   ```

4. **按照提示操作**：
   - 选择项目设置（直接回车使用默认值）
   - 确认部署目录为 `dist`
   - 等待部署完成

5. **访问网站**：
   部署完成后，Vercel 会提供一个 URL，例如：`https://your-project.vercel.app`

### 或者通过网页部署：

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "New Project"
4. 导入你的项目仓库
5. 设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

---

## 🌐 方式二：Netlify 部署

### 步骤：

1. **安装 Netlify CLI**：
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**：
   ```bash
   netlify login
   ```

3. **部署**：
   ```bash
   cd "zerocarbon-os 1"
   netlify deploy --prod --dir=dist
   ```

### 或者通过网页部署：

1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录账号
3. 拖拽 `dist` 文件夹到 Netlify 的部署区域
4. 网站会自动部署并提供 URL

---

## 📦 方式三：GitHub Pages 部署

### 步骤：

1. **安装 gh-pages**：
   ```bash
   npm install --save-dev gh-pages
   ```

2. **在 package.json 中添加部署脚本**：
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **部署**：
   ```bash
   npm run deploy
   ```

4. **在 GitHub 仓库设置中启用 Pages**：
   - 进入仓库 Settings > Pages
   - Source 选择 `gh-pages` 分支
   - 保存后访问：`https://your-username.github.io/repo-name`

---

## ☁️ 方式四：Cloudflare Pages 部署

### 步骤：

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
2. 连接你的 Git 仓库
3. 设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. 点击 "Save and Deploy"

---

## 🖥️ 方式五：传统服务器部署（Nginx）

### 步骤：

1. **将 dist 目录上传到服务器**：
   ```bash
   scp -r dist/* user@your-server:/var/www/zerocarbon-os/
   ```

2. **配置 Nginx**：
   创建 `/etc/nginx/sites-available/zerocarbon-os`：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/zerocarbon-os;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 启用 gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

3. **启用站点**：
   ```bash
   sudo ln -s /etc/nginx/sites-available/zerocarbon-os /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **配置 HTTPS（推荐）**：
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 📝 部署前检查清单

- [x] ✅ 项目已成功构建（`npm run build`）
- [x] ✅ 构建产物在 `dist` 目录
- [ ] 检查环境变量（如有需要）
- [ ] 测试生产构建（`npm run preview`）
- [ ] 配置自定义域名（可选）

---

## 🔧 环境变量配置

如果项目需要环境变量（如 API 密钥），在部署平台设置：

- **Vercel**: Project Settings > Environment Variables
- **Netlify**: Site Settings > Environment Variables
- **Cloudflare Pages**: Settings > Environment Variables

---

## 📊 性能优化建议

构建时已提示某些 chunk 较大（>500KB），建议：

1. **代码分割**：使用动态导入
   ```typescript
   const Component = lazy(() => import('./Component'));
   ```

2. **配置 Vite 手动分块**：
   在 `vite.config.ts` 中添加：
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           charts: ['recharts']
         }
       }
     }
   }
   ```

---

## 🆘 常见问题

### 问题：部署后页面空白
**解决**：检查路由配置，确保服务器支持 SPA 路由（所有路由都返回 `index.html`）

### 问题：资源加载失败（404）
**解决**：检查 `vite.config.ts` 中的 `base` 配置，确保与部署路径匹配

### 问题：API 请求失败
**解决**：配置 CORS 或使用代理服务器

---

## 🎉 快速开始（推荐 Vercel）

最简单的部署方式：

```bash
cd "zerocarbon-os 1"
npm install -g vercel
vercel
```

按照提示操作即可，几分钟内完成部署！
