
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  WalletCards, 
  Link2, 
  CircleDollarSign, 
  Menu, 
  UserCircle,
  Bell,
  LogOut,
  CandlestickChart,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  Gift
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import CarbonAccounts from './components/CarbonAccounts';
import BlockchainView from './components/BlockchainView';
import GreenFinance from './components/GreenFinance';
import TradingMarket from './components/TradingMarket';
import LandingPage from './components/LandingPage';
import UserProfile from './components/UserProfile';
import CarbonPoints from './components/CarbonPoints';
import { MOCK_ASSETS, MOCK_BLOCKS, SMART_CONTRACT_LOGS, MOCK_ACTIVE_LOANS, MOCK_TRADES, MOCK_ENTERPRISES, MOCK_POINTS_ACCOUNTS, MOCK_POINTS_TRANSACTIONS, MOCK_POINTS_REWARDS } from './constants';
import { AssetStatus, BlockData, CarbonAsset, SmartContractLog, ActiveLoan, TradeRecord, Enterprise, ComplianceStatus, CarbonPointsAccount, CarbonPointsTransaction, PointsReward } from './types';

type View = 'dashboard' | 'assets' | 'blockchain' | 'finance' | 'trading' | 'points';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications
  const [notifications] = useState([
    { id: 1, title: '新企业注册', message: '阿尔法精密制造有限公司已完成注册', time: '2分钟前', type: 'info', read: false },
    { id: 2, title: '碳资产上链成功', message: '一期屋顶光伏电站资产已成功上链', time: '1小时前', type: 'success', read: false },
    { id: 3, title: '贷款申请待审核', message: 'L-998102贷款申请需要人工复核', time: '3小时前', type: 'warning', read: true },
    { id: 4, title: '交易完成', message: '碳资产交易已成功结算', time: '1天前', type: 'success', read: true },
  ]);
  
  // Global State
  const [assets, setAssets] = useState<CarbonAsset[]>(MOCK_ASSETS);
  const [enterprises, setEnterprises] = useState<Enterprise[]>(MOCK_ENTERPRISES);
  const [walletBalance, setWalletBalance] = useState<number>(1240500.00);
  const [blocks, setBlocks] = useState<BlockData[]>(MOCK_BLOCKS);
  const [contractLogs, setContractLogs] = useState<SmartContractLog[]>(SMART_CONTRACT_LOGS);
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>(MOCK_ACTIVE_LOANS);
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>(MOCK_TRADES);
  
  // Carbon Points State
  const [pointsAccounts, setPointsAccounts] = useState<CarbonPointsAccount[]>(MOCK_POINTS_ACCOUNTS);
  const [pointsTransactions, setPointsTransactions] = useState<CarbonPointsTransaction[]>(MOCK_POINTS_TRANSACTIONS);
  const [pointsRewards] = useState<PointsReward[]>(MOCK_POINTS_REWARDS);
  
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Helper: Add Block
  const addBlock = (transactions: number, validator: string = '节点-零碳园区运营') => {
    const newBlock: BlockData = {
      height: blocks[0].height + 1,
      hash: '0x' + Math.random().toString(16).substr(2, 10) + '...',
      timestamp: '刚刚',
      transactions,
      validator
    };
    setBlocks(prev => [newBlock, ...prev]);
  };

  // Handler: Add New Asset (Project Initiation)
  const handleAddAsset = (newAsset: Partial<CarbonAsset>) => {
    const asset: CarbonAsset = {
      id: `A-${Date.now().toString().substr(-6)}`,
      projectName: newAsset.projectName || '未命名资产',
      category: newAsset.category || '其他',
      location: newAsset.location || '园区',
      deviceId: newAsset.deviceId || '',
      baselineEmission: newAsset.baselineEmission || 0,
      amount: newAsset.amount || 0,
      unit: 'tCO2e/年',
      status: AssetStatus.PENDING,
      owner: '园区运营主体',
      creationDate: new Date().toISOString().split('T')[0],
      estimatedValue: (newAsset.amount || 0) * 60, // approx val
      digitalMeterLinked: true,
    };
    setAssets(prev => [asset, ...prev]);
    showToast(`新资产 "${asset.projectName}" 立项成功，等待审核`, 'success');
  };

  // Handler: Add New Enterprise
  const handleAddEnterprise = (newEnterprise: Partial<Enterprise>) => {
    const enterprise: Enterprise = {
      id: `E-${Date.now().toString().substr(-6)}`,
      name: newEnterprise.name || '未命名企业',
      complianceStatus: newEnterprise.complianceStatus || ComplianceStatus.WARNING,
      totalElectricityConsumption: newEnterprise.totalElectricityConsumption || 0,
      greenElectricityRatio: newEnterprise.greenElectricityRatio || 0,
      holdingQuota: newEnterprise.holdingQuota || 0,
      registrationDate: new Date().toISOString().split('T')[0],
      contactPerson: newEnterprise.contactPerson,
      contactPhone: newEnterprise.contactPhone,
      logo: newEnterprise.logo,
      industry: newEnterprise.industry,
      address: newEnterprise.address,
      employeeCount: newEnterprise.employeeCount,
      carbonEmission: newEnterprise.carbonEmission,
      carbonReduction: newEnterprise.carbonReduction,
    };
    setEnterprises(prev => [enterprise, ...prev]);
    showToast(`新企业 "${enterprise.name}" 注册成功`, 'success');
  };

  // Handler: Mint/Tokenize Asset
  const handleMintAsset = (id: string, volume: number) => {
    const blockHeight = blocks[0].height + 1;
    const blockHash = '0x' + Math.random().toString(16).substr(2, 64);
    const tokenId = `T-${Math.floor(Math.random() * 1000000)}`;
    
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return { 
          ...a, 
          status: AssetStatus.TOKENIZED, 
          tokenId: tokenId,
          amount: volume, // Update volume if changed
          estimatedValue: volume * 60,
          blockHash: blockHash,
          blockHeight: blockHeight,
          contractAddress: '0x7f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
          tokenStandard: 'ERC-721',
          metadataURI: `ipfs://QmXx${Math.random().toString(16).substr(2, 10)}...`,
          verificationStatus: 'verified',
          auditReport: 'https://audit.example.com/report.pdf'
        };
      }
      return a;
    }));
    addBlock(1, '节点-第三方核证');
    showToast(`资产 ${id} 上链数证化成功！NFT 已生成`, 'success');
  };

  // Handler: Create Loan (Pledge)
  const handleCreateLoan = (loanDetails: any) => {
    const { assetId, principal, rate, tenor, settlementChannel } = loanDetails;
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Calculate LTV
    const ltv = asset.estimatedValue ? (principal / asset.estimatedValue) : 0;
    
    const newLoan: ActiveLoan = {
      id: `L-${Date.now().toString().substr(-6)}`,
      tokenId: asset.tokenId || '',
      tokenName: asset.projectName + ' 碳资产数证',
      principal,
      currency: 'CNY',
      rate,
      tenor,
      ltvPercent: Math.round(ltv * 100),
      status: ltv > 0.7 ? '待人工复核' : '正常',
      settlementChannel,
      createDate: new Date().toISOString().split('T')[0]
    };

    setActiveLoans(prev => [newLoan, ...prev]);
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: AssetStatus.PLEDGED } : a));
    
    if (newLoan.status === '正常') {
      setWalletBalance(prev => prev + principal);
      addBlock(1, '节点-金融机构');
      
      // Contract Log
      const log: SmartContractLog = {
        id: `LOG-${Date.now()}`,
        contractName: 'SC_DeFi_Lending',
        event: 'LoanDisbursed',
        status: 'Success',
        timestamp: new Date().toLocaleTimeString(),
        hash: '0x' + Math.random().toString(16).substr(2, 8),
        amount: `¥ ${principal.toLocaleString()}`,
        description: `放款通道：${settlementChannel}`
      };
      setContractLogs(prev => [log, ...prev]);
      
      showToast(`抵押融资成功！${principal.toLocaleString()} 已放款`, 'success');
    } else {
      showToast(`贷款申请已提交，因 LTV 较高需人工复核`, 'info');
    }
  };

  // Handler: Create Trade
  const handleCreateTrade = (tradeDetails: any) => {
    const { assetId, side, quantity, price, venue, settlementChannel } = tradeDetails;
    const asset = assets.find(a => a.id === assetId);
    
    const total = quantity * price;
    
    const newTrade: TradeRecord = {
      id: `TR-${Date.now().toString().substr(-6)}`,
      time: new Date().toLocaleString(),
      tokenName: asset ? asset.projectName : 'Unknown Asset',
      side,
      quantity,
      price,
      venue,
      settlementChannel,
      status: '已结算'
    };
    
    setTradeHistory(prev => [newTrade, ...prev]);
    
    if (side === 'sell') {
       setWalletBalance(prev => prev + total);
    } else {
       setWalletBalance(prev => prev - total);
    }

    addBlock(1, '节点-交易中心');
    showToast(`交易成功！${venue} 撮合完成，资金已通过 ${settlementChannel} 结算`, 'success');
  };

  // Handler: Simulate Contract Scenario
  const handleSimulateContract = (scenario: string) => {
    let log: Partial<SmartContractLog> = {
      id: `SC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      hash: '0x' + Math.random().toString(16).substr(2, 8),
      status: 'Success',
      blockNumber: blocks[0].height + 1
    };

    if (scenario === 'autoRepay') {
      log = { 
        ...log, 
        contractName: 'SC_Loan_Repay', 
        event: 'AutoRepayment', 
        amount: '¥ 350,000', 
        description: '新能源电站碳收益自动还贷',
        from: '0x园区碳资产收益账户',
        to: '0x金融机构还款账户'
      };
      setWalletBalance(prev => prev - 350000);
    } else if (scenario === 'revenueSharing') {
      log = { 
        ...log, 
        contractName: 'SC_Revenue_Share', 
        event: 'SplitTransfer', 
        amount: '¥ 500,000', 
        description: '碳收益自动分账 (园区/ESCO/基金)',
        from: '0x碳资产收益池',
        to: '0x多方分账合约'
      };
      // Balance doesn't change for the platform per se, but log shows activity
    } else if (scenario === 'complianceCheck') {
       log = { 
         ...log, 
         contractName: 'SC_Compliance', 
         event: 'QuotaPurchase', 
         amount: '¥ 120,000', 
         description: '碳配额合规校验+自动补缴',
         from: '0x园区运营账户',
         to: '0x碳配额交易中心'
       };
       setWalletBalance(prev => prev - 120000);
    } else if (scenario === 'subsidyPayment') {
       log = { 
         ...log, 
         contractName: 'SC_Subsidy_Distribution', 
         event: 'SubsidyTransfer', 
         amount: '¥ 200,000', 
         description: '政府零碳园区补贴通过数币智能合约自动发放',
         from: '0x政府补贴账户',
         to: '0x园区运营账户'
       };
       setWalletBalance(prev => prev + 200000);
    }

    setContractLogs(prev => [log as SmartContractLog, ...prev]);
    addBlock(1, '节点-智能合约');
    showToast(`智能合约 "${log.description}" 执行成功`, 'success');
  };

  // Handler: Redeem Points Reward
  const handleRedeemPoints = (rewardId: string, accountId: string) => {
    const reward = pointsRewards.find(r => r.id === rewardId);
    const account = pointsAccounts.find(a => a.id === accountId);
    
    if (!reward || !account || account.availablePoints < reward.pointsRequired) {
      showToast('积分不足，无法兑换', 'error');
      return;
    }

    // Create transaction
    const newTransaction: CarbonPointsTransaction = {
      id: `PT-${Date.now()}`,
      accountId: accountId,
      type: 'redeem',
      points: reward.pointsRequired,
      description: `兑换${reward.name}`,
      source: '积分商城',
      timestamp: new Date().toLocaleString(),
      status: 'completed',
      txHash: '0x' + Math.random().toString(16).substr(2, 16)
    };

    // Update account
    setPointsAccounts(prev => prev.map(a => {
      if (a.id === accountId) {
        return {
          ...a,
          availablePoints: a.availablePoints - reward.pointsRequired,
          usedPoints: a.usedPoints + reward.pointsRequired,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return a;
    }));

    setPointsTransactions(prev => [newTransaction, ...prev]);
    
    // If digital RMB reward, update wallet balance
    if (reward.rewardType === 'digital_rmb') {
      setWalletBalance(prev => prev + reward.rewardValue);
      addBlock(1, '节点-智能合约');
      
      const log: SmartContractLog = {
        id: `LOG-${Date.now()}`,
        contractName: 'SC_Points_Redeem',
        event: 'PointsRedeemed',
        status: 'Success',
        timestamp: new Date().toLocaleTimeString(),
        hash: newTransaction.txHash,
        amount: `¥ ${reward.rewardValue}`,
        description: `碳积分兑换数字人民币红包：${reward.name}`
      };
      setContractLogs(prev => [log, ...prev]);
    }

    showToast(`成功兑换${reward.name}，${reward.rewardType === 'digital_rmb' ? '数字人民币已发放到钱包' : '请查收'}`, 'success');
  };

  // Handler: Refresh Points
  const handleRefreshPoints = (accountId: string) => {
    // Simulate fetching latest points from blockchain
    showToast('积分数据已更新', 'info');
  };

  const navItems = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'assets', label: '碳资产管理', icon: WalletCards },
    { id: 'points', label: '碳积分与激励', icon: Gift },
    { id: 'trading', label: '交易中心对接', icon: CandlestickChart },
    { id: 'finance', label: '绿色金融与数币合约', icon: CircleDollarSign },
    { id: 'blockchain', label: '区块链底账', icon: Link2 },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': 
        return <Dashboard />;
      case 'assets': 
        return <CarbonAccounts 
          assets={assets}
          enterprises={enterprises}
          onAddAsset={handleAddAsset} 
          onMint={handleMintAsset}
          onAddEnterprise={handleAddEnterprise}
        />;
      case 'trading': 
        return <TradingMarket 
          assets={assets} 
          trades={tradeHistory}
          onCreateTrade={handleCreateTrade} 
        />;
      case 'blockchain': 
        return <BlockchainView blocks={blocks} />;
      case 'finance': 
        return <GreenFinance 
          assets={assets} 
          balance={walletBalance} 
          logs={contractLogs} 
          loans={activeLoans}
          onPledge={handleCreateLoan}
          onSimulateScenario={handleSimulateContract}
        />;
      case 'points':
        return <CarbonPoints
          accounts={pointsAccounts}
          transactions={pointsTransactions}
          rewards={pointsRewards}
          onRedeem={handleRedeemPoints}
          onRefreshPoints={handleRefreshPoints}
        />;
      default: return <Dashboard />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => {
      console.log('Entering management system...');
      setShowLanding(false);
    }} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 animate-fade-in font-sans">
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border animate-fade-in-up
            ${toast.type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-white border-blue-500 text-slate-800'}
          `}>
             <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
               {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
             </div>
             <span className="font-medium text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-slate-800 cursor-pointer" onClick={() => setShowLanding(true)}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 leading-tight">
                零碳园区 资产数字化平台
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
           <button 
             onClick={() => setShowLanding(true)}
             className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mb-2"
           >
              <LogOut size={20} />
              <span className="font-medium">退出系统</span>
           </button>
          <div className="flex items-center gap-3 text-slate-400 text-sm px-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>系统运行中</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 px-4">v3.0.1 • 演示版</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 flex justify-between items-center ml-4 lg:ml-0">
            <h1 className="text-xl font-bold text-slate-800">
              {navItems.find(n => n.id === currentView)?.label}
            </h1>

            <div className="flex items-center space-x-4">
              <div className="relative z-50">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-[60] max-h-96 overflow-hidden flex flex-col animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                      <h3 className="font-bold text-slate-900">通知中心</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X size={16} className="text-slate-500" />
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell size={32} className="mx-auto mb-2 opacity-50" />
                          <p>暂无通知</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 flex-shrink-0 ${
                                notification.type === 'success' ? 'text-emerald-600' :
                                notification.type === 'warning' ? 'text-amber-600' :
                                'text-blue-600'
                              }`}>
                                {notification.type === 'success' ? <CheckCircle2 size={18} /> :
                                 notification.type === 'warning' ? <AlertCircle size={18} /> :
                                 <Info size={18} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm mb-1">{notification.title}</p>
                                <p className="text-xs text-slate-600 mb-1">{notification.message}</p>
                                <p className="text-xs text-slate-400">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        查看全部通知
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowUserProfile(true)}
                className="flex items-center space-x-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">管理员</p>
                  <p className="text-xs text-slate-500">园区运营部</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold hover:bg-indigo-200 transition-colors">
                  ZH
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </div>
  );
};

export default App;
