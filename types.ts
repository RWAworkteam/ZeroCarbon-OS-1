
export enum AssetStatus {
  AUDITED = '已审定',
  PENDING = '审核中',
  FROZEN = '冻结中',
  RETIRED = '已注销',
  TOKENIZED = '已铸造/上链',
  PLEDGED = '已抵押',
  LISTED = '挂牌交易中',
}

export enum TransactionType {
  MINT = '资产铸造',
  TRANSFER = '转让',
  RETIRE = '注销',
  PAYMENT = '数币支付',
  PLEDGE = '抵押融资',
  TRADE = '挂牌交易',
}

export interface CarbonAsset {
  id: string;
  projectName: string; // name
  category: string; // New: category (Solar, Storage, etc.)
  location: string; // New: location
  deviceId: string; // New: IoT Device ID
  baselineEmission: number; // New: Baseline
  amount: number; // expectedReduction / volume in tCO2e
  unit: string;
  status: AssetStatus;
  owner: string;
  creationDate: string;
  estimatedValue?: number; // Estimated value in e-CNY
  tokenId?: string; // Blockchain Token ID
  digitalMeterLinked: boolean;
  // Enhanced blockchain fields
  blockHash?: string; // Block hash where token was minted
  blockHeight?: number; // Block height
  contractAddress?: string; // Smart contract address
  tokenStandard?: string; // ERC-721, ERC-1155, etc.
  metadataURI?: string; // IPFS or metadata URI
  verificationStatus?: 'verified' | 'pending' | 'failed'; // Verification status
  auditReport?: string; // Audit report link
}

export interface BlockData {
  height: number;
  hash: string;
  timestamp: string;
  transactions: number;
  validator: string;
}

export interface ActiveLoan {
  id: string;
  tokenId: string;
  tokenName: string;
  principal: number;
  currency: string;
  rate: number;
  tenor: number; // months
  ltvPercent: number;
  status: string;
  settlementChannel: string;
  createDate: string;
}

export interface TradeRecord {
  id: string;
  time: string;
  tokenName: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  venue: string;
  settlementChannel: string;
  status: string;
}

export interface SmartContractLog {
  id: string;
  contractName: string; // scenario
  event: string;
  status: 'Success' | 'Processing' | 'Failed';
  timestamp: string;
  hash: string;
  amount?: string;
  description?: string; // New: detailed description
  from?: string; // Transaction from address
  to?: string; // Transaction to address
  gasUsed?: number; // Gas used
  blockNumber?: number; // Block number
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  method: 'auto' | 'manual';
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

export interface TradingPlatform {
  id: string;
  name: string;
  type: 'carbon_exchange' | 'digital_rmb_platform';
  status: 'connected' | 'disconnected' | 'pending';
  apiEndpoint?: string;
  lastSync?: string;
}

export interface MarketOrder {
  id: string;
  assetName: string;
  amount: number;
  pricePerUnit: number;
  totalPrice: number;
  seller: string;
  time: string;
  type: 'ask' | 'bid';
}

export enum ComplianceStatus {
  COMPLIANT = '合规',
  WARNING = '预警',
  NON_COMPLIANT = '不合规'
}

export interface Enterprise {
  id: string;
  name: string;
  complianceStatus: ComplianceStatus;
  totalElectricityConsumption: number; // KWH
  greenElectricityRatio: number; // percentage
  holdingQuota: number; // 持有限额度
  registrationDate: string;
  contactPerson?: string;
  contactPhone?: string;
  logo?: string; // 企业logo图片URL
  industry?: string; // 行业类型
  address?: string; // 企业地址
  employeeCount?: number; // 员工数量
  annualRevenue?: number; // 年营收（万元）
  carbonEmission?: number; // 碳排放量 (tCO2e)
  carbonReduction?: number; // 碳减排量 (tCO2e)
  energyEfficiency?: number; // 能效等级 (1-5)
}

// 碳积分相关类型
export interface CarbonPointsAccount {
  id: string;
  ownerId: string; // 企业ID或个人ID
  ownerType: 'enterprise' | 'individual';
  ownerName: string;
  totalPoints: number; // 总积分
  availablePoints: number; // 可用积分
  usedPoints: number; // 已使用积分
  lastUpdated: string;
}

export interface CarbonPointsTransaction {
  id: string;
  accountId: string;
  type: 'earn' | 'redeem' | 'expire' | 'transfer';
  points: number;
  description: string;
  source: string; // 来源：充电、绿电消费、节能项目等
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string; // 区块链交易哈希
}

export interface PointsReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  rewardType: 'digital_rmb' | 'coupon' | 'discount' | 'service';
  rewardValue: number; // 奖励价值（数字人民币金额或其他）
  rewardUnit: string; // 单位：元、券、折扣等
  available: boolean;
  image?: string;
}

export interface CarbonPledge {
  id: string;
  assetId: string;
  assetName: string;
  tokenId: string;
  amount: number; // 质押的碳资产数量 (tCO2e)
  loanId: string;
  lender: string; // 贷款机构
  borrower: string; // 借款人
  startDate: string;
  endDate?: string;
  status: 'active' | 'released' | 'defaulted';
  txHash: string;
}

export interface TradePool {
  id: string;
  name: string;
  assetIds: string[]; // 打包的资产ID列表
  totalAmount: number; // 总减排量 (tCO2e)
  estimatedValue: number; // 预估价值
  status: 'draft' | 'submitted' | 'listed' | 'traded' | 'cancelled';
  platform: string; // 目标交易平台
  submitDate?: string;
  listDate?: string;
  tradeDate?: string;
  tradePrice?: number;
  tradeAmount?: number;
}
