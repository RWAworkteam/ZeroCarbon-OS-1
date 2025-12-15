
import React, { useState, useEffect } from 'react';
import { Landmark, Banknote, FileCode, CheckCircle2, RefreshCw, ArrowDownLeft, Zap, Split, ShieldAlert, Loader2, AlertTriangle, Wallet, CreditCard, Gift, Receipt, Clock, TrendingDown, X, Sparkles, Info } from 'lucide-react';

// 高级说明图标组件 - 使用更优雅的设计
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
import { AssetStatus, CarbonAsset, SmartContractLog, ActiveLoan, LoanRepayment } from '../types';

interface GreenFinanceProps {
  assets: CarbonAsset[];
  balance: number;
  logs: SmartContractLog[];
  loans: ActiveLoan[];
  onPledge: (loanDetails: any) => void;
  onSimulateScenario: (scenario: string) => void;
}

const GreenFinance: React.FC<GreenFinanceProps> = ({ assets, balance, logs, loans, onPledge, onSimulateScenario }) => {
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [repaymentModalOpen, setRepaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ActiveLoan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock repayment history
  const [repayments] = useState<LoanRepayment[]>([
    {
      id: 'R-001',
      loanId: 'L-998102',
      amount: 50000,
      date: '2024-04-15',
      method: 'auto',
      status: 'completed',
      txHash: '0xab12...cd34'
    }
  ]);
  
  const [pledgeForm, setPledgeForm] = useState({
     assetId: '',
     principal: '',
     rate: '3.85',
     tenor: '12',
     settlementChannel: 'e-CNY（上海数币国际平台）'
  });
  
  // Animation state for balance
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    let start = displayBalance;
    const end = balance;
    if (start === end) return;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayBalance(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [balance]);

  const availableAssets = assets.filter(a => a.status === AssetStatus.TOKENIZED);

  // Derived state for LTV calculation
  const selectedAsset = availableAssets.find(a => a.id === pledgeForm.assetId);
  const currentPrincipal = parseFloat(pledgeForm.principal) || 0;
  const estimatedValue = selectedAsset?.estimatedValue || 0;
  const ltvPercent = estimatedValue > 0 ? (currentPrincipal / estimatedValue) * 100 : 0;
  const isHighRisk = ltvPercent > 70;

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pledgeForm.assetId && pledgeForm.principal) {
       setIsSubmitting(true);
       
       // Simulate network/blockchain delay
       setTimeout(() => {
           onPledge({
             ...pledgeForm,
             principal: parseFloat(pledgeForm.principal),
             rate: parseFloat(pledgeForm.rate),
             tenor: parseInt(pledgeForm.tenor)
           });
           setIsSubmitting(false);
           setPledgeModalOpen(false);
           setPledgeForm({...pledgeForm, assetId: '', principal: ''});
       }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="emerald" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">绿色金融与碳资产质押融资说明</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳资产质押融资：</strong>企业可以将持有的碳资产通证作为质押品，向入驻平台的银行申请贷款。
              智能合约将相应碳通证从企业账户暂时锁定在质押合约账户中，银行则发放贷款额度的数字人民币到企业钱包。
              若企业按期还款，智能合约释放质押通证回归企业账户；若逾期违约，银行有权通过合约获得质押通证处置权。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳挂钩贷款/债券：</strong>银行可基于企业碳绩效数据，提供碳挂钩的优惠贷款或企业发行碳中和债券等产品。
              智能合约持续监测企业碳排放数据：若企业在贷款期内未达到约定的减排目标，合约可触发上调贷款利率或要求提前部分还款的条款；
              反之若超额完成减排，则给予利率减免激励。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>数字人民币智能合约：</strong>通过智能合约实现自动还贷、收益分账、合规支付、补贴发放等多种场景，
              实现资金流与碳资产流的同步结算和条件支付，保证交易高效安全。所有金融操作均通过数字人民币进行，确保资金安全和可追溯。
            </p>
          </div>
        </div>
      </div>
      
      {/* Top: Wallet & Smart Contract Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* e-CNY Wallet */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-[300px]">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Banknote size={140} /></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full"><span className="font-bold text-lg">¥</span></div>
                  <span className="font-semibold tracking-wider">数字人民币 (e-CNY)</span>
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs border border-white/10">对公钱包一类户</span>
            </div>
            <p className="text-red-100 text-sm mb-1">可用余额</p>
            <h2 className="text-4xl font-bold tracking-tight mb-2 tabular-nums">
                ¥ {displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 text-xs text-red-100 bg-red-800/30 w-fit px-2 py-1 rounded">
               <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
               链上状态同步正常
            </div>
          </div>
        </div>

        {/* Smart Contract Simulator */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[300px]">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center text-lg">
                 <FileCode className="mr-2 text-indigo-600" size={24} />
                 智能合约应用场景模拟
              </h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">点击按钮触发合约执行</span>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button onClick={() => onSimulateScenario('autoRepay')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                 <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                 </div>
                 <span className="font-bold text-slate-700 text-sm">自动还贷</span>
                 <span className="text-xs text-slate-500 text-center mt-1">碳收益自动划扣</span>
              </button>
              <button onClick={() => onSimulateScenario('revenueSharing')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Split size={20} />
                 </div>
                 <span className="font-bold text-slate-700 text-sm">自动分账</span>
                 <span className="text-xs text-slate-500 text-center mt-1">多方权益分配</span>
              </button>
              <button onClick={() => onSimulateScenario('complianceCheck')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group">
                 <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ShieldAlert size={20} />
                 </div>
                 <span className="font-bold text-slate-700 text-sm">合规支付</span>
                 <span className="text-xs text-slate-500 text-center mt-1">配额自动补缴</span>
              </button>
              <button onClick={() => onSimulateScenario('subsidyPayment')} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
                 <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Gift size={20} />
                 </div>
                 <span className="font-bold text-slate-700 text-sm">补贴发放</span>
                 <span className="text-xs text-slate-500 text-center mt-1">数币自动到账</span>
              </button>
           </div>

           {/* Live Logs Preview */}
           <div className="flex-1 bg-slate-900 rounded-lg p-3 overflow-hidden flex flex-col">
              <div className="text-xs text-slate-400 mb-2 font-mono border-b border-slate-700 pb-1">Console Output:</div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                 {logs.slice(0, 3).map(log => (
                    <div key={log.id} className="text-xs font-mono flex justify-between animate-fade-in-up">
                       <span className="text-emerald-400">[{log.timestamp}] {log.event}</span>
                       <span className="text-slate-500">{log.description}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Lending Section */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center mb-2">
              <Landmark className="mr-3 text-emerald-600" size={28} />
              绿色贷款台账
            </h3>
            <p className="text-slate-500">基于区块链碳资产的确权与质押，实现秒级授信与放款。</p>
          </div>
          <button 
             onClick={() => setPledgeModalOpen(true)}
             className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all flex items-center"
          >
             发起新贷款
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                 <tr>
                    <th className="p-4">贷款编号</th>
                    <th className="p-4">抵押资产</th>
                    <th className="p-4 text-right">金额</th>
                    <th className="p-4">利率 / 期限</th>
                    <th className="p-4">LTV (抵押率)</th>
                    <th className="p-4">结算通道</th>
                    <th className="p-4">状态</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {loans.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                       <td className="p-4 font-mono text-slate-600">{loan.id}</td>
                       <td className="p-4 font-medium text-slate-900">{loan.tokenName}</td>
                       <td className="p-4 text-right font-bold text-emerald-600">¥ {loan.principal.toLocaleString()}</td>
                       <td className="p-4">{loan.rate}% / {loan.tenor}月</td>
                       <td className="p-4">
                          <span className={`${loan.ltvPercent > 70 ? 'text-red-500 font-bold' : 'text-emerald-600'}`}>
                             {loan.ltvPercent}%
                          </span>
                       </td>
                       <td className="p-4 text-xs text-slate-500">{loan.settlementChannel}</td>
                       <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${loan.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                               {loan.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                                setRepaymentModalOpen(true);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <CreditCard size={14} />
                              还款
                            </button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {loans.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400">暂无贷款记录</td></tr>}
              </tbody>
           </table>
        </div>
      </div>

      {/* Pledge Management Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center text-lg">
          <ShieldAlert size={20} className="mr-2 text-indigo-600" />
          碳资产质押管理
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <p className="text-sm text-slate-600 mb-1">质押中资产</p>
            <p className="text-2xl font-bold text-indigo-600">
              {loans.filter(l => l.status === '正常' || l.status === '待人工复核').length}
            </p>
            <p className="text-xs text-slate-500 mt-1">总质押量: {loans.reduce((sum, l) => sum + l.principal, 0).toLocaleString()} 元</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-slate-600 mb-1">已释放资产</p>
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-xs text-slate-500 mt-1">正常还款释放</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-slate-600 mb-1">风险预警</p>
            <p className="text-2xl font-bold text-amber-600">
              {loans.filter(l => l.ltvPercent > 70).length}
            </p>
              <p className="text-xs text-slate-500 mt-1">LTV &gt; 70% 需关注</p>
          </div>
        </div>
        <div className="space-y-3">
          {loans.map(loan => {
            const asset = assets.find(a => a.tokenId === loan.tokenId);
            return (
              <div key={loan.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      {loan.tokenName}
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setRepaymentModalOpen(true);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Info size={12} />
                        详情/还款
                      </button>
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">贷款编号: {loan.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">¥ {loan.principal.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">LTV: {loan.ltvPercent}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">质押资产价值</p>
                    <p className="font-semibold text-slate-900">
                      {asset?.estimatedValue ? `¥ ${asset.estimatedValue.toLocaleString()}` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">利率 / 期限</p>
                    <p className="font-semibold text-slate-900">{loan.rate}% / {loan.tenor}月</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">创建日期</p>
                    <p className="font-semibold text-slate-900">{loan.createDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">状态</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      loan.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
                {loan.ltvPercent > 70 && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      风险提示：抵押率较高，建议关注资产价值波动
                    </p>
                  </div>
                )}
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedLoan(loan);
                      setRepaymentModalOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800 flex items-center gap-1"
                  >
                    <CreditCard size={14} />
                    还款
                  </button>
                  <button
                    onClick={() => {
                      alert('已向银行发起解押申请（示例功能）\n\n解押申请已提交，银行将在1-3个工作日内审核。');
                    }}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    发起解押申请
                  </button>
                </div>
              </div>
            );
          })}
          {loans.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <ShieldAlert size={32} className="mx-auto mb-2 opacity-50" />
              <p>暂无质押记录</p>
            </div>
          )}
        </div>
      </div>

      {/* Pledge Modal */}
      {pledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                 <Landmark size={20} className="mr-2 text-indigo-600" />
                 资产抵押融资申请
              </h3>
              <button onClick={() => setPledgeModalOpen(false)}><ArrowDownLeft className="rotate-45 text-slate-400" size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handlePledgeSubmit} className="space-y-5">
                {/* Asset Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">抵押数证 *</label>
                  <select 
                    required
                    className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={pledgeForm.assetId}
                    onChange={(e) => setPledgeForm({...pledgeForm, assetId: e.target.value})}
                  >
                    <option value="">请选择已上链资产...</option>
                    {availableAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.projectName} (数证: {asset.tokenId})</option>
                    ))}
                  </select>
                  {selectedAsset && (
                     <div className="mt-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
                        <div className="text-xs text-indigo-800">
                           <div className="font-bold">{selectedAsset.projectName}</div>
                           <div>评估价值: ¥{selectedAsset.estimatedValue?.toLocaleString()}</div>
                        </div>
                        <div className="text-right text-xs">
                           <div className="text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                              Max LTV: 70%
                           </div>
                        </div>
                     </div>
                  )}
                </div>

                {/* Loan Amount & LTV Viz */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">贷款金额 (CNY) *</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                     <input 
                        required 
                        type="number" 
                        className="w-full border p-3 pl-8 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        placeholder="请输入金额" 
                        value={pledgeForm.principal}
                        onChange={e => setPledgeForm({...pledgeForm, principal: e.target.value})} 
                     />
                  </div>
                  
                  {/* Real-time LTV Calculation */}
                  {selectedAsset && currentPrincipal > 0 && (
                     <div className="mt-2 animate-fade-in-up">
                        <div className="flex justify-between items-end mb-1">
                           <span className="text-xs text-slate-500">当前抵押率 (LTV)</span>
                           <span className={`text-sm font-bold ${isHighRisk ? 'text-red-500' : 'text-emerald-600'}`}>
                              {ltvPercent.toFixed(1)}%
                           </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                              className={`h-full rounded-full transition-all duration-500 ${isHighRisk ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(ltvPercent, 100)}%` }}
                           ></div>
                        </div>
                        {isHighRisk ? (
                           <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                              <span>抵押率过高 (&gt;70%)，提交后将转入人工风控复核流程，放款可能延迟。</span>
                           </div>
                        ) : (
                           <div className="flex items-start gap-1.5 mt-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                              <span>抵押率健康，预计可实时触发智能合约放款。</span>
                           </div>
                        )}
                     </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">年化利率 (%)</label>
                      <input type="number" className="w-full border p-3 rounded-lg bg-slate-50" defaultValue="3.85" readOnly onChange={e => setPledgeForm({...pledgeForm, rate: e.target.value})} />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">期限 (月)</label>
                      <input type="number" className="w-full border p-3 rounded-lg" defaultValue="12" onChange={e => setPledgeForm({...pledgeForm, tenor: e.target.value})} />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">结算通道</label>
                   <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                         className="w-full border p-3 pl-10 rounded-lg bg-white appearance-none" 
                         value={pledgeForm.settlementChannel} 
                         onChange={e => setPledgeForm({...pledgeForm, settlementChannel: e.target.value})}
                      >
                         <option value="e-CNY（上海数币国际平台）">e-CNY（上海数币国际平台）</option>
                         <option value="银行转账">银行转账</option>
                      </select>
                   </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100 mt-4">
                   <button 
                      type="button" 
                      onClick={() => setPledgeModalOpen(false)} 
                      className="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                      disabled={isSubmitting}
                   >
                      取消
                   </button>
                   <button 
                      type="submit" 
                      className={`flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center
                         ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:bg-slate-800 hover:scale-[1.02]'}
                      `}
                      disabled={isSubmitting}
                   >
                      {isSubmitting ? (
                         <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            处理中...
                         </>
                      ) : (
                         '提交申请'
                      )}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Repayment Modal */}
      {repaymentModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-indigo-900 flex items-center">
                <CreditCard size={20} className="mr-2" />
                贷款还款
              </h3>
              <button onClick={() => setRepaymentModalOpen(false)}>
                <X size={20} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">贷款编号</span>
                  <span className="font-mono text-sm font-semibold">{selectedLoan.id}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">贷款本金</span>
                  <span className="font-bold text-lg text-slate-900">¥ {selectedLoan.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">年化利率</span>
                  <span className="font-semibold text-slate-900">{selectedLoan.rate}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">还款金额 (CNY)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                  <input 
                    type="number" 
                    className="w-full border p-3 pl-8 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="请输入还款金额"
                    defaultValue={Math.round(selectedLoan.principal / selectedLoan.tenor)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">还款方式</label>
                <select className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="auto">自动还款（智能合约）</option>
                  <option value="manual">手动还款（数币钱包）</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={10} className="text-white" />
                  </div>
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">智能合约自动还款说明：</p>
                    <p>系统将自动从碳资产收益中划扣还款金额，通过数字人民币智能合约执行，无需人工操作。</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setRepaymentModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    onSimulateScenario('autoRepay');
                    setRepaymentModalOpen(false);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                >
                  确认还款
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repayment History */}
      {repayments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700 flex items-center">
            <Receipt size={20} className="mr-2 text-indigo-600" />
            还款记录
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="p-4">还款编号</th>
                <th className="p-4">贷款编号</th>
                <th className="p-4 text-right">金额</th>
                <th className="p-4">方式</th>
                <th className="p-4">日期</th>
                <th className="p-4">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {repayments.map(repayment => (
                <tr key={repayment.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-600">{repayment.id}</td>
                  <td className="p-4 font-mono text-slate-600">{repayment.loanId}</td>
                  <td className="p-4 text-right font-bold text-emerald-600">¥ {repayment.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${repayment.method === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {repayment.method === 'auto' ? '自动' : '手动'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{repayment.date}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={14} />
                      <span className="text-xs">已完成</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GreenFinance;
