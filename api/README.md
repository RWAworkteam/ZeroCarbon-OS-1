# API 服务使用说明

## 概述

本项目提供了完整的 API 服务层，用于与后端服务进行交互。

## 配置

API 基础 URL 可以通过环境变量 `VITE_API_BASE_URL` 配置，默认值为 `http://localhost:8080/api`。

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 使用方式

### 1. 导入 API

```typescript
import { api } from './api';
// 或者
import api from './api';
```

### 2. 认证 API

```typescript
// 登录
const response = await api.auth.login({
  username: 'admin',
  password: 'password123'
});

if (response.code === 200) {
  // Token 会自动保存到 localStorage
  console.log('登录成功', response.data.user);
}

// 获取当前用户信息
const user = await api.auth.getCurrentUser();

// 登出
await api.auth.logout();
```

### 3. 碳资产 API

```typescript
// 获取所有资产
const assets = await api.carbonAssets.getAll({
  status: '已铸造/上链',
  page: 1,
  limit: 10
});

// 获取单个资产
const asset = await api.carbonAssets.getById('A-001');

// 创建新资产
const newAsset = await api.carbonAssets.create({
  projectName: '新光伏项目',
  category: '光伏发电',
  location: '园区A区',
  deviceId: 'PV-001',
  baselineEmission: 10000,
  amount: 8000,
  unit: 'tCO2e/年',
  owner: '园区运营主体'
});

// 更新资产
await api.carbonAssets.update('A-001', {
  status: '已铸造/上链'
});

// 资产上链
await api.carbonAssets.tokenize('A-001');
```

### 4. 企业 API

```typescript
// 获取所有企业
const enterprises = await api.enterprises.getAll({
  complianceStatus: '合规',
  page: 1,
  limit: 10
});

// 创建新企业
const enterprise = await api.enterprises.create({
  name: '新企业',
  contactPerson: '张三',
  contactPhone: '13800138000',
  industry: '制造业'
});
```

### 5. 区块链 API

```typescript
// 获取区块列表
const blocks = await api.blockchain.getBlocks({
  page: 1,
  limit: 20
});

// 获取智能合约日志
const logs = await api.blockchain.getContractLogs({
  contractName: 'CarbonAsset',
  status: 'Success'
});
```

### 6. 绿色金融 API

```typescript
// 获取所有贷款
const loans = await api.greenFinance.getActiveLoans();

// 创建新贷款
const loan = await api.greenFinance.createLoan({
  tokenId: 'T-001',
  principal: 1000000,
  currency: 'e-CNY',
  rate: 0.05,
  tenor: 12,
  ltvPercent: 70,
  settlementChannel: '数字人民币'
});
```

### 7. 交易市场 API

```typescript
// 获取交易记录
const trades = await api.tradingMarket.getTradeRecords({
  side: 'buy',
  page: 1,
  limit: 10
});

// 创建交易
const trade = await api.tradingMarket.createTrade({
  tokenName: '碳资产T-001',
  side: 'buy',
  quantity: 100,
  price: 60,
  venue: '碳交易平台',
  settlementChannel: '数字人民币'
});
```

### 8. 碳积分 API

```typescript
// 获取积分账户
const accounts = await api.carbonPoints.getAccounts();

// 获取积分交易记录
const transactions = await api.carbonPoints.getTransactions({
  accountId: 'account-001'
});

// 获取可用奖励
const rewards = await api.carbonPoints.getRewards({
  available: true
});

// 赚取积分
await api.carbonPoints.earnPoints(
  'account-001',
  100,
  '充电',
  '使用充电桩充电获得积分'
);

// 兑换奖励
await api.carbonPoints.redeemPoints('account-001', 'reward-001');
```

### 9. 仪表板 API

```typescript
// 获取统计数据
const stats = await api.dashboard.getStats();

// 获取最近活动
const activities = await api.dashboard.getRecentActivities(10);
```

## 错误处理

所有 API 调用都可能抛出错误，建议使用 try-catch 处理：

```typescript
try {
  const response = await api.carbonAssets.getAll();
  console.log('成功', response.data);
} catch (error: any) {
  console.error('错误', error.message);
  // error.code: HTTP 状态码
  // error.message: 错误消息
  // error.details: 详细错误信息
}
```

## Token 管理

Token 会自动从 localStorage 读取并在请求头中添加。如果需要手动管理：

```typescript
import { setAuthToken, removeAuthToken } from './api';

// 设置 token
setAuthToken('your-token-here');

// 移除 token
removeAuthToken();
```

## 响应格式

所有 API 响应都遵循统一格式：

```typescript
{
  code: number;        // HTTP 状态码
  message: string;     // 响应消息
  data: T;            // 响应数据
  timestamp?: number; // 时间戳（可选）
}
```

列表响应格式：

```typescript
{
  code: 200,
  message: 'Success',
  data: {
    items: T[],        // 数据列表
    total: number,     // 总数
    page: number,      // 当前页
    limit: number      // 每页数量
  }
}
```

