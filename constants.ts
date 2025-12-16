
import { AssetStatus, CarbonAsset, BlockData, ActiveLoan, TradeRecord, SmartContractLog, MarketOrder, Enterprise, ComplianceStatus, CarbonPointsAccount, CarbonPointsTransaction, PointsReward } from './types';

// 模拟碳资产数据
export const MOCK_ASSETS: CarbonAsset[] = [
  { 
    id: 'A-001', 
    projectName: '一期屋顶光伏电站', 
    category: '光伏发电',
    location: 'XXX零碳园区 1#厂房屋顶',
    deviceId: 'PV-INV-001',
    baselineEmission: 12000,
    amount: 9500, 
    unit: 'tCO2e/年',
    status: AssetStatus.TOKENIZED, 
    owner: '园区运营主体', 
    creationDate: '2024-01-15', 
    estimatedValue: 570000, 
    tokenId: 'T-882910',
    digitalMeterLinked: true,
    blockHash: '0x7f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
    blockHeight: 12054,
    contractAddress: '0x7f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    tokenStandard: 'ERC-721',
    metadataURI: 'ipfs://QmXx2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
    verificationStatus: 'verified',
    auditReport: 'https://audit.example.com/report-001.pdf'
  },
  { 
    id: 'A-002', 
    projectName: '园区集中式储能站', 
    category: '储能',
    location: 'XXX零碳园区 西侧变电站',
    deviceId: 'ESS-PCS-01',
    baselineEmission: 6800,
    amount: 5200, 
    unit: 'tCO2e/年',
    status: AssetStatus.AUDITED, 
    owner: '园区运营主体', 
    creationDate: '2024-02-20', 
    estimatedValue: 312000,
    digitalMeterLinked: true
  },
  { 
    id: 'A-003', 
    projectName: '老厂房节能改造项目', 
    category: '用能侧节能',
    location: 'XXX零碳园区 老厂区',
    deviceId: 'EMS-LOAD-01',
    baselineEmission: 4300,
    amount: 2600, 
    unit: 'tCO2e/年',
    status: AssetStatus.PENDING, 
    owner: '阿尔法精密制造', 
    creationDate: '2024-03-10', 
    estimatedValue: 156000,
    digitalMeterLinked: true
  },
];

// 模拟区块链区块数据
export const MOCK_BLOCKS: BlockData[] = [
  { height: 12054, hash: '0x7f...3a2b', timestamp: '2秒前', transactions: 4, validator: '节点-零碳园区运营' },
  { height: 12053, hash: '0x4c...9d1e', timestamp: '15秒前', transactions: 12, validator: '节点-工商银行' },
  { height: 12052, hash: '0x1a...8f4c', timestamp: '45秒前', transactions: 8, validator: '节点-监管审计' },
];

// 初始贷款数据
export const MOCK_ACTIVE_LOANS: ActiveLoan[] = [
  {
    id: 'L-998102',
    tokenId: 'T-882910',
    tokenName: '一期屋顶光伏电站 碳资产数证',
    principal: 300000,
    currency: 'CNY',
    rate: 3.85,
    tenor: 12,
    ltvPercent: 65,
    status: '正常',
    settlementChannel: 'e-CNY（上海数币国际平台）',
    createDate: '2024-04-01',
    park: '零碳园区A区',
    project: '一期屋顶光伏电站'
  },
  {
    id: 'L-495996',
    tokenId: 'T-882911',
    tokenName: '一期屋顶光伏电站 碳资产数证',
    principal: 80000,
    currency: 'CNY',
    rate: 3.85,
    tenor: 12,
    ltvPercent: 14,
    status: '正常',
    settlementChannel: 'e-CNY（上海数币国际平台）',
    createDate: '2025-12-16',
    park: '零碳园区A区',
    project: '一期屋顶光伏电站'
  }
];

// 初始交易记录
export const MOCK_TRADES: TradeRecord[] = [
  {
    id: 'TR-102938',
    time: '2024-05-20 10:30:00',
    tokenName: '一期屋顶光伏电站 碳资产数证',
    side: 'sell',
    quantity: 1000,
    price: 60.5,
    venue: '碳资产交易中心',
    settlementChannel: 'e-CNY（上海数币国际平台）',
    status: '已结算'
  }
];

// 市场挂单数据
export const MARKET_ORDERS: MarketOrder[] = [
  { id: 'ORD-001', assetName: '零碳园区-光伏减排量 2024Q1', amount: 100, pricePerUnit: 52.5, totalPrice: 5250, seller: '园区运营', time: '10:23:45', type: 'ask' },
  { id: 'ORD-002', assetName: 'B厂房节能改造碳汇', amount: 200, pricePerUnit: 50.0, totalPrice: 10000, seller: '阿尔法精密', time: '10:21:12', type: 'ask' },
  { id: 'ORD-003', assetName: '求购：光伏类碳资产', amount: 500, pricePerUnit: 51.0, totalPrice: 25500, seller: '上海某出口企业', time: '10:15:30', type: 'bid' },
];

// 智能合约日志
export const SMART_CONTRACT_LOGS: SmartContractLog[] = [
  { 
    id: 'LOG-001', 
    contractName: 'SC_Payment_Auto', 
    event: 'PaymentRelease', 
    status: 'Success', 
    timestamp: '10:45:12', 
    hash: '0xab...cd12', 
    amount: '¥ 450.00',
    description: '电费自动支付' 
  },
];

// 图表数据
export const ENERGY_DATA = [
  { time: '00:00', generation: 0, consumption: 200 },
  { time: '08:00', generation: 300, consumption: 800 },
  { time: '12:00', generation: 1200, consumption: 1100 },
  { time: '16:00', generation: 900, consumption: 1000 },
  { time: '20:00', generation: 50, consumption: 600 },
];

export const EMISSION_DATA = [
  { name: '1月', emitted: 400, offset: 100, reduction: 80, greenPower: 35, quota: 1200, netEmission: 300 },
  { name: '2月', emitted: 380, offset: 120, reduction: 95, greenPower: 42, quota: 1250, netEmission: 260 },
  { name: '3月', emitted: 350, offset: 150, reduction: 110, greenPower: 48, quota: 1300, netEmission: 200 },
  { name: '4月', emitted: 320, offset: 180, reduction: 125, greenPower: 55, quota: 1350, netEmission: 140 },
  { name: '5月', emitted: 300, offset: 200, reduction: 140, greenPower: 62, quota: 1400, netEmission: 100 },
  { name: '6月', emitted: 280, offset: 220, reduction: 155, greenPower: 68, quota: 1450, netEmission: 60 },
];

// 模拟企业数据
export const MOCK_ENTERPRISES: Enterprise[] = [
  {
    id: 'E-001',
    name: '阿尔法精密制造有限公司',
    complianceStatus: ComplianceStatus.COMPLIANT,
    totalElectricityConsumption: 45000,
    greenElectricityRatio: 35,
    holdingQuota: 1250,
    registrationDate: '2023-06-15',
    contactPerson: '张经理',
    contactPhone: '138****5678',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    industry: '精密制造',
    address: '零碳园区A区1号',
    employeeCount: 320,
    annualRevenue: 8500,
    carbonEmission: 2800,
    carbonReduction: 1250
  },
  {
    id: 'E-002',
    name: '贝塔物流有限公司',
    complianceStatus: ComplianceStatus.WARNING,
    totalElectricityConsumption: 12000,
    greenElectricityRatio: 15,
    holdingQuota: 400,
    registrationDate: '2023-08-20',
    contactPerson: '李经理',
    contactPhone: '139****9012',
    logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop',
    industry: '物流运输',
    address: '零碳园区B区3号',
    employeeCount: 150,
    annualRevenue: 3200,
    carbonEmission: 1800,
    carbonReduction: 400
  },
  {
    id: 'E-003',
    name: '伽马数据中心',
    complianceStatus: ComplianceStatus.COMPLIANT,
    totalElectricityConsumption: 120000,
    greenElectricityRatio: 80,
    holdingQuota: 8500,
    registrationDate: '2023-05-10',
    contactPerson: '王经理',
    contactPhone: '137****3456',
    logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=200&fit=crop',
    industry: '数据中心',
    address: '零碳园区C区5号',
    employeeCount: 85,
    annualRevenue: 12000,
    carbonEmission: 5200,
    carbonReduction: 8500
  }
];

// 碳积分账户数据
export const MOCK_POINTS_ACCOUNTS: CarbonPointsAccount[] = [
  {
    id: 'PA-001',
    ownerId: 'E-001',
    ownerType: 'enterprise',
    ownerName: '阿尔法精密制造有限公司',
    totalPoints: 12500,
    availablePoints: 8500,
    usedPoints: 4000,
    lastUpdated: '2024-05-20 10:30:00'
  },
  {
    id: 'PA-002',
    ownerId: 'IND-001',
    ownerType: 'individual',
    ownerName: '张三',
    totalPoints: 3200,
    availablePoints: 2800,
    usedPoints: 400,
    lastUpdated: '2024-05-20 09:15:00'
  }
];

// 碳积分交易记录
export const MOCK_POINTS_TRANSACTIONS: CarbonPointsTransaction[] = [
  {
    id: 'PT-001',
    accountId: 'PA-001',
    type: 'earn',
    points: 500,
    description: '充电桩充电获得积分',
    source: '充电桩-园区A区',
    timestamp: '2024-05-20 10:30:00',
    status: 'completed',
    txHash: '0xab12cd34ef56...'
  },
  {
    id: 'PT-002',
    accountId: 'PA-001',
    type: 'earn',
    points: 1200,
    description: '绿电消费获得积分',
    source: '光伏发电-1#厂房',
    timestamp: '2024-05-19 14:20:00',
    status: 'completed',
    txHash: '0xcd34ef56ab12...'
  },
  {
    id: 'PT-003',
    accountId: 'PA-001',
    type: 'redeem',
    points: 2000,
    description: '兑换数字人民币红包',
    source: '积分商城',
    timestamp: '2024-05-18 16:45:00',
    status: 'completed',
    txHash: '0xef56ab12cd34...'
  },
  {
    id: 'PT-004',
    accountId: 'PA-002',
    type: 'earn',
    points: 150,
    description: '公共交通出行获得积分',
    source: '地铁出行',
    timestamp: '2024-05-20 08:30:00',
    status: 'completed',
    txHash: '0x1234abcd5678...'
  },
  {
    id: 'PT-005',
    accountId: 'PA-002',
    type: 'earn',
    points: 80,
    description: '骑行获得积分',
    source: '共享单车',
    timestamp: '2024-05-19 18:20:00',
    status: 'completed',
    txHash: '0x5678abcd1234...'
  },
  {
    id: 'PT-006',
    accountId: 'PA-002',
    type: 'redeem',
    points: 400,
    description: '兑换停车优惠券',
    source: '积分商城',
    timestamp: '2024-05-17 12:10:00',
    status: 'completed',
    txHash: '0xabcd12345678...'
  }
];

// 积分奖励商品
export const MOCK_POINTS_REWARDS: PointsReward[] = [
  {
    id: 'RW-001',
    name: '数字人民币红包',
    description: '兑换后自动发放到数字人民币钱包，可用于园区内消费',
    pointsRequired: 1000,
    rewardType: 'digital_rmb',
    rewardValue: 50,
    rewardUnit: '元',
    available: true
  },
  {
    id: 'RW-002',
    name: '停车优惠券',
    description: '园区内停车费用减免，有效期30天',
    pointsRequired: 500,
    rewardType: 'coupon',
    rewardValue: 1,
    rewardUnit: '张',
    available: true
  },
  {
    id: 'RW-003',
    name: '物业费折扣券',
    description: '当月物业费享受9折优惠',
    pointsRequired: 2000,
    rewardType: 'discount',
    rewardValue: 10,
    rewardUnit: '%',
    available: true
  },
  {
    id: 'RW-004',
    name: '数字人民币红包（大额）',
    description: '兑换后自动发放到数字人民币钱包',
    pointsRequired: 5000,
    rewardType: 'digital_rmb',
    rewardValue: 300,
    rewardUnit: '元',
    available: true
  },
  {
    id: 'RW-005',
    name: '园区服务优惠包',
    description: '包含多项园区服务优惠，有效期60天',
    pointsRequired: 3000,
    rewardType: 'service',
    rewardValue: 1,
    rewardUnit: '套',
    available: true
  }
];
