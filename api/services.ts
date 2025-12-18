import { get, post, put, del, patch } from './client';
import type {
  CarbonAsset,
  Enterprise,
  BlockData,
  ActiveLoan,
  TradeRecord,
  SmartContractLog,
  CarbonPointsAccount,
  CarbonPointsTransaction,
  PointsReward,
  MarketOrder,
  AssetStatus,
} from '../types';

// ==================== Auth API ====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    department?: string;
  };
}

export const authApi = {
  // Login
  login: (credentials: LoginRequest) => {
    return post<LoginResponse>('/auth/login', credentials);
  },

  // Logout
  logout: () => {
    return post('/auth/logout');
  },

  // Get current user info
  getCurrentUser: () => {
    return get<LoginResponse['user']>('/auth/me');
  },

  // Refresh token
  refreshToken: () => {
    return post<{ token: string }>('/auth/refresh');
  },
};

// ==================== Carbon Assets API ====================
export interface CreateAssetRequest {
  projectName: string;
  category: string;
  location: string;
  deviceId: string;
  baselineEmission: number;
  amount: number;
  unit: string;
  owner: string;
  estimatedValue?: number;
}

export interface UpdateAssetRequest extends Partial<CreateAssetRequest> {
  status?: AssetStatus;
}

export const carbonAssetsApi = {
  // Get all assets
  getAll: (params?: { status?: AssetStatus; owner?: string; page?: number; limit?: number }) => {
    return get<{ items: CarbonAsset[]; total: number; page: number; limit: number }>('/carbon-assets', params);
  },

  // Get asset by ID
  getById: (id: string) => {
    return get<CarbonAsset>(`/carbon-assets/${id}`);
  },

  // Create new asset
  create: (data: CreateAssetRequest) => {
    return post<CarbonAsset>('/carbon-assets', data);
  },

  // Update asset
  update: (id: string, data: UpdateAssetRequest) => {
    return put<CarbonAsset>(`/carbon-assets/${id}`, data);
  },

  // Delete asset
  delete: (id: string) => {
    return del(`/carbon-assets/${id}`);
  },

  // Tokenize asset (mint to blockchain)
  tokenize: (id: string) => {
    return post<CarbonAsset>(`/carbon-assets/${id}/tokenize`);
  },

  // Retire asset
  retire: (id: string) => {
    return post<CarbonAsset>(`/carbon-assets/${id}/retire`);
  },
};

// ==================== Enterprises API ====================
export interface CreateEnterpriseRequest {
  name: string;
  contactPerson?: string;
  contactPhone?: string;
  industry?: string;
  address?: string;
  employeeCount?: number;
  annualRevenue?: number;
}

export const enterprisesApi = {
  // Get all enterprises
  getAll: (params?: { complianceStatus?: string; page?: number; limit?: number }) => {
    return get<{ items: Enterprise[]; total: number; page: number; limit: number }>('/enterprises', params);
  },

  // Get enterprise by ID
  getById: (id: string) => {
    return get<Enterprise>(`/enterprises/${id}`);
  },

  // Create new enterprise
  create: (data: CreateEnterpriseRequest) => {
    return post<Enterprise>('/enterprises', data);
  },

  // Update enterprise
  update: (id: string, data: Partial<CreateEnterpriseRequest>) => {
    return put<Enterprise>(`/enterprises/${id}`, data);
  },

  // Delete enterprise
  delete: (id: string) => {
    return del(`/enterprises/${id}`);
  },

  // Get enterprise compliance status
  getComplianceStatus: (id: string) => {
    return get<{ status: string; details: any }>(`/enterprises/${id}/compliance`);
  },
};

// ==================== Blockchain API ====================
export const blockchainApi = {
  // Get all blocks
  getBlocks: (params?: { page?: number; limit?: number }) => {
    return get<{ items: BlockData[]; total: number; page: number; limit: number }>('/blockchain/blocks', params);
  },

  // Get block by height
  getBlockByHeight: (height: number) => {
    return get<BlockData>(`/blockchain/blocks/${height}`);
  },

  // Get block by hash
  getBlockByHash: (hash: string) => {
    return get<BlockData>(`/blockchain/blocks/hash/${hash}`);
  },

  // Get smart contract logs
  getContractLogs: (params?: { contractName?: string; status?: string; page?: number; limit?: number }) => {
    return get<{ items: SmartContractLog[]; total: number; page: number; limit: number }>('/blockchain/contracts/logs', params);
  },

  // Get contract log by ID
  getContractLogById: (id: string) => {
    return get<SmartContractLog>(`/blockchain/contracts/logs/${id}`);
  },
};

// ==================== Green Finance API ====================
export interface CreateLoanRequest {
  tokenId: string;
  principal: number;
  currency: string;
  rate: number;
  tenor: number;
  ltvPercent: number;
  settlementChannel: string;
}

export const greenFinanceApi = {
  // Get all active loans
  getActiveLoans: (params?: { status?: string; page?: number; limit?: number }) => {
    return get<{ items: ActiveLoan[]; total: number; page: number; limit: number }>('/finance/loans', params);
  },

  // Get loan by ID
  getLoanById: (id: string) => {
    return get<ActiveLoan>(`/finance/loans/${id}`);
  },

  // Create new loan
  createLoan: (data: CreateLoanRequest) => {
    return post<ActiveLoan>('/finance/loans', data);
  },

  // Repay loan
  repayLoan: (id: string, amount: number) => {
    return post<ActiveLoan>(`/finance/loans/${id}/repay`, { amount });
  },
};

// ==================== Trading Market API ====================
export interface CreateTradeRequest {
  tokenName: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  venue: string;
  settlementChannel: string;
}

export const tradingMarketApi = {
  // Get all trade records
  getTradeRecords: (params?: { side?: string; venue?: string; page?: number; limit?: number }) => {
    return get<{ items: TradeRecord[]; total: number; page: number; limit: number }>('/trading/records', params);
  },

  // Get trade record by ID
  getTradeRecordById: (id: string) => {
    return get<TradeRecord>(`/trading/records/${id}`);
  },

  // Create new trade
  createTrade: (data: CreateTradeRequest) => {
    return post<TradeRecord>('/trading/records', data);
  },

  // Get market orders
  getMarketOrders: (params?: { type?: 'ask' | 'bid'; page?: number; limit?: number }) => {
    return get<{ items: MarketOrder[]; total: number; page: number; limit: number }>('/trading/orders', params);
  },

  // Create market order
  createMarketOrder: (data: Omit<MarketOrder, 'id' | 'time'>) => {
    return post<MarketOrder>('/trading/orders', data);
  },
};

// ==================== Carbon Points API ====================
export const carbonPointsApi = {
  // Get all points accounts
  getAccounts: (params?: { ownerType?: 'enterprise' | 'individual'; page?: number; limit?: number }) => {
    return get<{ items: CarbonPointsAccount[]; total: number; page: number; limit: number }>('/carbon-points/accounts', params);
  },

  // Get account by ID
  getAccountById: (id: string) => {
    return get<CarbonPointsAccount>(`/carbon-points/accounts/${id}`);
  },

  // Get account by owner
  getAccountByOwner: (ownerId: string) => {
    return get<CarbonPointsAccount>(`/carbon-points/accounts/owner/${ownerId}`);
  },

  // Get points transactions
  getTransactions: (params?: { accountId?: string; type?: string; page?: number; limit?: number }) => {
    return get<{ items: CarbonPointsTransaction[]; total: number; page: number; limit: number }>('/carbon-points/transactions', params);
  },

  // Get transaction by ID
  getTransactionById: (id: string) => {
    return get<CarbonPointsTransaction>(`/carbon-points/transactions/${id}`);
  },

  // Earn points
  earnPoints: (accountId: string, points: number, source: string, description: string) => {
    return post<CarbonPointsTransaction>('/carbon-points/earn', {
      accountId,
      points,
      source,
      description,
    });
  },

  // Redeem points
  redeemPoints: (accountId: string, rewardId: string) => {
    return post<CarbonPointsTransaction>('/carbon-points/redeem', {
      accountId,
      rewardId,
    });
  },

  // Get available rewards
  getRewards: (params?: { available?: boolean; page?: number; limit?: number }) => {
    return get<{ items: PointsReward[]; total: number; page: number; limit: number }>('/carbon-points/rewards', params);
  },

  // Get reward by ID
  getRewardById: (id: string) => {
    return get<PointsReward>(`/carbon-points/rewards/${id}`);
  },
};

// ==================== Dashboard API ====================
export interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  totalEnterprises: number;
  totalTransactions: number;
  recentActivities: any[];
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => {
    return get<DashboardStats>('/dashboard/stats');
  },

  // Get recent activities
  getRecentActivities: (limit?: number) => {
    return get<any[]>('/dashboard/activities', { limit });
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  carbonAssets: carbonAssetsApi,
  enterprises: enterprisesApi,
  blockchain: blockchainApi,
  greenFinance: greenFinanceApi,
  tradingMarket: tradingMarketApi,
  carbonPoints: carbonPointsApi,
  dashboard: dashboardApi,
};

export default api;

