# 零碳园区碳资产数字化管理平台 (ZeroCarbon OS)

一个完整的零碳园区碳资产数字化管理平台，涵盖碳资产上链数字资产化、抵押借贷、交易中心对接、数字人民币智能合约等核心功能。

## 功能特性

### 1. 碳资产上链数字资产化
- 碳资产项目立项与管理
- 资产上链数证化（NFT铸造）
- 链上凭证详情查看（区块信息、合约地址、元数据等）
- 区块链验证与审计追踪

### 2. 抵押借贷功能
- 基于碳资产的抵押融资申请
- 实时LTV（抵押率）计算与风险控制
- 智能合约自动还款
- 还款记录管理

### 3. 交易中心对接
- 上海数字人民币国际运营平台对接
- 全国碳资产交易中心对接
- 江苏碳普惠平台对接
- 实时行情展示与交易下单
- 交易流水记录

### 4. 数字人民币智能合约场景
- 数字人民币钱包余额管理
- 自动还贷（碳收益自动划扣）
- 自动分账（多方权益分配）
- 合规支付（配额自动补缴）
- 补贴发放（政府补贴数币发放）

### 5. 区块链底账
- 联盟链区块浏览
- 交易记录查询
- 智能合约日志

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **UI库**: Tailwind CSS
- **图表库**: Recharts
- **图标库**: Lucide React

## 本地部署

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **安装依赖**

```bash
cd "zerocarbon-os 1"
npm install
```

2. **启动开发服务器**

```bash
npm run dev
```

3. **访问应用**

打开浏览器访问: `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
zerocarbon-os 1/
├── components/          # React组件
│   ├── Dashboard.tsx          # 总览仪表板
│   ├── CarbonAccounts.tsx      # 碳资产管理
│   ├── BlockchainView.tsx      # 区块链底账
│   ├── GreenFinance.tsx        # 绿色金融与数币合约
│   ├── TradingMarket.tsx      # 交易中心对接
│   └── LandingPage.tsx         # 登录页
├── App.tsx             # 主应用组件
├── types.ts            # TypeScript类型定义
├── constants.ts        # 常量与模拟数据
├── vite.config.ts     # Vite配置
├── tsconfig.json       # TypeScript配置
└── package.json        # 项目依赖
```

## 主要功能模块

### 碳资产管理 (CarbonAccounts)
- 企业碳账户与碳资产项目库
- 资产立项、审核、上链数证化
- 链上凭证详情查看

### 交易中心对接 (TradingMarket)
- 多平台对接状态监控
- 实时行情图表
- 交易下单与流水记录

### 绿色金融 (GreenFinance)
- 数字人民币钱包
- 抵押借贷申请与管理
- 智能合约场景模拟
- 还款记录

### 区块链底账 (BlockchainView)
- 联盟链状态监控
- 区块浏览与交易查询

## 开发说明

### 添加新的智能合约场景

在 `App.tsx` 的 `handleSimulateContract` 函数中添加新的场景：

```typescript
else if (scenario === 'yourScenario') {
  log = { 
    ...log, 
    contractName: 'SC_Your_Contract', 
    event: 'YourEvent', 
    amount: '¥ XXX', 
    description: '场景描述',
    from: '0x...',
    to: '0x...'
  };
}
```

### 添加新的交易平台

在 `TradingMarket.tsx` 的 `platforms` 数组中添加：

```typescript
{
  id: 'X',
  name: '平台名称',
  type: 'carbon_exchange' | 'digital_rmb_platform',
  status: 'connected',
  apiEndpoint: 'https://api.example.com/v1',
  lastSync: new Date().toLocaleTimeString()
}
```

## 注意事项

1. 本项目为演示版本，所有区块链和数字人民币功能均为模拟实现
2. 实际部署需要对接真实的区块链节点和数字人民币BaaS服务
3. 数据均为模拟数据，不涉及真实交易

## 许可证

