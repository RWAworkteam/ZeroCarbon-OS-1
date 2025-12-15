
import React, { useState } from 'react';
import { 
  Gift, Coins, TrendingUp, History, ShoppingCart, Wallet, 
  Zap, Leaf, Car, Building2, CheckCircle2, Clock, X, 
  Sparkles, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';
import { CarbonPointsAccount, CarbonPointsTransaction, PointsReward } from '../types';

// 高级说明图标组件
const InfoIcon = ({ color = 'emerald' }: { color?: 'indigo' | 'blue' | 'emerald' }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 via-purple-500 to-purple-600 shadow-indigo-500/40',
    blue: 'from-blue-500 via-cyan-500 to-blue-600 shadow-blue-500/40',
    emerald: 'from-emerald-500 via-teal-500 to-emerald-600 shadow-emerald-500/40'
  };
  
  return (
    <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-xl flex-shrink-0 ring-2 ring-white/50`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
      <Sparkles size={22} className="text-white relative z-10 drop-shadow-sm" strokeWidth={2.5} />
    </div>
  );
};

interface CarbonPointsProps {
  accounts: CarbonPointsAccount[];
  transactions: CarbonPointsTransaction[];
  rewards: PointsReward[];
  onRedeem: (rewardId: string, accountId: string) => void;
  onRefreshPoints: (accountId: string) => void;
}

const CarbonPoints: React.FC<CarbonPointsProps> = ({ 
  accounts, 
  transactions, 
  rewards, 
  onRedeem,
  onRefreshPoints 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'redeem' | 'history'>('overview');
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || '');
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<PointsReward | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentAccount = accounts.find(a => a.id === selectedAccount) || accounts[0];
  const accountTransactions = transactions.filter(t => t.accountId === selectedAccount);
  const availableRewards = rewards.filter(r => r.available);

  const handleRedeemClick = (reward: PointsReward) => {
    if (!currentAccount || currentAccount.availablePoints < reward.pointsRequired) {
      alert('积分不足，无法兑换');
      return;
    }
    setSelectedReward(reward);
    setRedeemModalOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward || !currentAccount) return;
    setIsProcessing(true);
    setTimeout(() => {
      onRedeem(selectedReward.id, currentAccount.id);
      setIsProcessing(false);
      setRedeemModalOpen(false);
      setSelectedReward(null);
    }, 1500);
  };

  const getSourceIcon = (source: string) => {
    if (source.includes('充电')) return <Car size={16} className="text-blue-500" />;
    if (source.includes('绿电') || source.includes('光伏')) return <Zap size={16} className="text-amber-500" />;
    if (source.includes('节能') || source.includes('减排')) return <Leaf size={16} className="text-emerald-500" />;
    return <Building2 size={16} className="text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="emerald" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">碳积分与激励模块说明</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳积分获取：</strong>园区为个人和企业开设碳账户，接入各种碳减排行为数据源。
              例如，个人低碳出行数据（公交/地铁乘车、骑行里程）、办公节能数据，或企业的节能改造项目数据等均自动上传至平台。
              平台依据预先设定的碳减排核算方法将行为转化为碳减排量，并按照一定比例授予碳积分（每减排1克CO₂可获得1个碳积分）。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>积分兑换与数字人民币发放：</strong>当用户选择兑换数字人民币时，平台按照预设比例将其碳积分对应的减排量进行回购。
              智能合约自动把相应数额的数字人民币发送到用户的钱包中完成兑换，保证兑换过程透明、高效。
              用户可以将积分在平台碳积分商城中兑换各种权益，如数字人民币红包、商品优惠券、停车减免券等。
            </p>
          </div>
        </div>
      </div>

      {/* Account Selector */}
      {accounts.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <label className="text-sm font-medium text-slate-700 mb-2 block">选择账户</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.ownerName} ({account.ownerType === 'enterprise' ? '企业' : '个人'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Points Overview Card */}
      {currentAccount && (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Coins size={140} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-emerald-100 text-sm mb-2">碳积分账户</p>
                <h2 className="text-3xl font-bold mb-1">{currentAccount.ownerName}</h2>
                <p className="text-emerald-100 text-sm">{currentAccount.ownerType === 'enterprise' ? '企业账户' : '个人账户'}</p>
              </div>
              <button
                onClick={() => onRefreshPoints(currentAccount.id)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-emerald-100 text-sm mb-1">总积分</p>
                <p className="text-3xl font-bold">{currentAccount.totalPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">可用积分</p>
                <p className="text-3xl font-bold">{currentAccount.availablePoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-sm mb-1">已使用</p>
                <p className="text-3xl font-bold">{currentAccount.usedPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'overview' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          积分概览
        </button>
        <button
          onClick={() => setActiveTab('earn')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'earn' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          获取记录
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'redeem' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          积分商城
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'history' 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          兑换历史
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <History size={20} className="mr-2 text-indigo-600" />
              最近交易
            </h3>
            <div className="space-y-3">
              {accountTransactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSourceIcon(tx.source)}
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                      <p className="text-xs text-slate-500">{tx.source} • {tx.timestamp}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.points}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-emerald-600" />
              积分统计
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-700">本月获得</span>
                <span className="font-bold text-blue-600">
                  +{accountTransactions.filter(t => t.type === 'earn' && new Date(t.timestamp).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.points, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-slate-700">本月兑换</span>
                <span className="font-bold text-purple-600">
                  -{accountTransactions.filter(t => t.type === 'redeem' && new Date(t.timestamp).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.points, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm text-slate-700">累计获得</span>
                <span className="font-bold text-emerald-600">
                  {accountTransactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earn' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Zap size={20} className="mr-2 text-amber-600" />
            积分获取记录
          </h3>
          <div className="space-y-3">
            {accountTransactions.filter(t => t.type === 'earn').map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    {getSourceIcon(tx.source)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{tx.description}</p>
                    <p className="text-sm text-slate-500">{tx.source}</p>
                    <p className="text-xs text-slate-400 mt-1">{tx.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">+{tx.points}</p>
                  <p className="text-xs text-slate-500">
                    {tx.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={12} /> 已完成
                      </span>
                    ) : tx.status === 'pending' ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock size={12} /> 处理中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <X size={12} /> 失败
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'redeem' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg flex items-center">
              <ShoppingCart size={20} className="mr-2 text-purple-600" />
              积分商城
            </h3>
            {currentAccount && (
              <p className="text-sm text-slate-500">
                可用积分: <span className="font-bold text-emerald-600">{currentAccount.availablePoints}</span>
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.map(reward => (
              <div
                key={reward.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {reward.image && (
                  <div className="h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Gift size={48} className="text-emerald-500" />
                  </div>
                )}
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 mb-2">{reward.name}</h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{reward.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500">需要积分</p>
                      <p className="text-lg font-bold text-emerald-600">{reward.pointsRequired}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">奖励价值</p>
                      <p className="text-lg font-bold text-slate-900">
                        {reward.rewardType === 'digital_rmb' && '¥'}
                        {reward.rewardValue}
                        {reward.rewardUnit}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={!currentAccount || currentAccount.availablePoints < reward.pointsRequired}
                    className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      currentAccount && currentAccount.availablePoints >= reward.pointsRequired
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Gift size={16} />
                    立即兑换
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <History size={20} className="mr-2 text-indigo-600" />
            兑换历史
          </h3>
          <div className="space-y-3">
            {accountTransactions.filter(t => t.type === 'redeem').map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gift size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{tx.description}</p>
                    <p className="text-sm text-slate-500">{tx.source}</p>
                    <p className="text-xs text-slate-400 mt-1">{tx.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">-{tx.points}</p>
                  <p className="text-xs text-slate-500">
                    {tx.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={12} /> 已发放
                      </span>
                    ) : tx.status === 'pending' ? (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Clock size={12} /> 处理中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <X size={12} /> 失败
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redeem Modal */}
      {redeemModalOpen && selectedReward && currentAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center">
                <Gift size={20} className="mr-2" />
                确认兑换
              </h3>
              <button onClick={() => setRedeemModalOpen(false)}>
                <X size={20} className="text-white/80 hover:text-white" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-2">{selectedReward.name}</h4>
                <p className="text-sm text-slate-600 mb-4">{selectedReward.description}</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">需要积分</span>
                    <span className="font-bold text-slate-900">{selectedReward.pointsRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">当前可用</span>
                    <span className="font-bold text-emerald-600">{currentAccount.availablePoints}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-600">兑换后剩余</span>
                    <span className="font-bold text-slate-900">
                      {currentAccount.availablePoints - selectedReward.pointsRequired}
                    </span>
                  </div>
                </div>
              </div>
              {selectedReward.rewardType === 'digital_rmb' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-emerald-700 flex items-center gap-2">
                    <Wallet size={16} />
                    数字人民币将自动发放到您的钱包
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setRedeemModalOpen(false)}
                  className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  disabled={isProcessing}
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  disabled={isProcessing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Gift size={16} />
                      确认兑换
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonPoints;
