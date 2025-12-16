
import React, { useState, useEffect } from 'react';
import { Landmark, Banknote, FileCode, CheckCircle2, RefreshCw, ArrowDownLeft, Zap, Split, ShieldAlert, Loader2, AlertTriangle, Wallet, CreditCard, Gift, Receipt, Clock, TrendingDown, TrendingUp, X, Sparkles, Info } from 'lucide-react';

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
  
  // 分类筛选状态
  const [filterPark, setFilterPark] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  
  // 金融产品申请模态框状态
  const [revenueRightsModalOpen, setRevenueRightsModalOpen] = useState(false);
  const [carbonLinkedLoanModalOpen, setCarbonLinkedLoanModalOpen] = useState(false);
  const [securitizationModalOpen, setSecuritizationModalOpen] = useState(false);
  
  // 碳收益权融资表单
  const [revenueRightsForm, setRevenueRightsForm] = useState({
    projectName: '',
    park: '',
    projectType: '',
    expectedReduction: '',
    financingYears: '',
    expectedCCER: '',
    financingAmount: ''
  });
  
  // 碳挂钩贷款表单
  const [carbonLinkedLoanForm, setCarbonLinkedLoanForm] = useState({
    enterpriseName: '',
    currentEmission: '',
    reductionTarget: '',
    loanAmount: '',
    loanTerm: '',
    baseRate: '3.85',
    performanceBonus: '0.5' // 超额完成减排的利率减免百分比
  });
  
  // 资产证券化表单
  const [securitizationForm, setSecuritizationForm] = useState({
    selectedAssets: [] as string[],
    securitySize: '',
    term: '',
    expectedYield: '',
    issuanceDate: ''
  });
  
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
  const [displayBalance, setDisplayBalance] = useState(balance || 0);

  useEffect(() => {
    const end = balance || 0;
    let start = displayBalance;
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
  }, [balance, displayBalance]);

  const availableAssets = assets.filter(a => a.status === AssetStatus.TOKENIZED);

  // 获取所有园区和项目列表
  const allParks = Array.from(new Set(loans.map(l => l.park).filter(Boolean))) as string[];
  const allProjects = Array.from(new Set(loans.map(l => l.project).filter(Boolean))) as string[];
  
  // 筛选后的贷款列表
  const filteredLoans = loans.filter(loan => {
    if (filterPark !== 'all' && loan.park !== filterPark) return false;
    if (filterProject !== 'all' && loan.project !== filterProject) return false;
    return true;
  });

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
              <strong>碳资产质押融资：</strong>企业可以将持有的碳资产数证作为质押品，向入驻平台的银行申请贷款。
              智能合约将相应碳数证从企业账户暂时锁定在质押合约账户中，银行则发放贷款额度的数字人民币到企业钱包。
              若企业按期还款，智能合约释放质押数证回归企业账户；若逾期违约，银行有权通过合约获得质押数证处置权。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳挂钩贷款/债券：</strong>银行可基于企业碳绩效数据，提供碳挂钩的优惠贷款或企业发行碳中和债券等产品。
              智能合约持续监测企业碳排放数据：若企业在贷款期内未达到约定的减排目标，合约可触发上调贷款利率或要求提前部分还款的条款；
              反之若超额完成减排，则给予利率减免激励。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳收益权融资：</strong>针对减碳项目未来的减排收益，支持收益权质押/转让融资。
              项目方将未来X年的减排收益权发行碳收益凭证（数证化的合约），由投资者认购提供现款资金支持项目实施。
              智能合约管理募集、收益分配等全流程，项目完成后每获得一批CCER，合约自动将其交付给投资者或在市场售出后分配收益。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳资产证券化：</strong>将园区内分散的碳资产打包，发行绿色资产支持证券（例如碳收益ABS）。
              平台汇聚各企业的碳资产数证作为基础资产池，信托给专项计划，再由投资者购买证券份额。
              智能合约负责底层碳资产现金流（例如碳配额/CCER出售所得）的定期归集和分配，确保投资者按期获得本息。
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

      {/* Advanced Financial Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 碳收益权融资 */}
        <div 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => {
            alert('碳收益权融资详情\n\n功能：未来减排收益权质押/转让融资\n\n流程：\n1. 项目方发行碳收益凭证\n2. 投资者认购提供资金\n3. 智能合约自动分配收益\n\n点击标题或图标可查看详细信息。');
          }}
        >
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              alert('碳收益权融资 - 点击了标题区域');
            }}
          >
            <div 
              className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                alert('碳收益权融资 - 点击了图标');
              }}
            >
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 
                className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('碳收益权融资 - 点击了标题');
                }}
              >
                碳收益权融资
              </h4>
              <p 
                className="text-xs text-slate-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('未来减排收益权质押/转让 - 点击了副标题');
                }}
              >
                未来减排收益权质押/转让
              </p>
            </div>
          </div>
          <p 
            className="text-sm text-slate-600 mb-4 cursor-pointer hover:text-slate-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              alert('点击了描述文字，可展开查看详细说明');
            }}
          >
            针对减碳项目未来的减排收益，支持收益权质押/转让融资。项目方将未来X年的减排收益权发行碳收益凭证，由投资者认购提供资金支持。
          </p>
          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('提前变现未来碳资产：项目方可以提前获得资金，投资者分享未来收益');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>提前变现未来碳资产</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('智能合约自动分配收益：项目完成后，智能合约自动将CCER交付给投资者或分配收益');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>智能合约自动分配收益</span>
            </div>
          </div>
          <button 
            className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setRevenueRightsModalOpen(true);
            }}
          >
            申请收益权融资
          </button>
        </div>

        {/* 碳挂钩贷款/债券 */}
        <div 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => {
            alert('碳挂钩贷款/债券详情\n\n功能：基于碳绩效的动态利率贷款\n\n机制：\n1. 银行基于企业碳绩效数据提供优惠贷款\n2. 智能合约持续监测碳排放数据\n3. 动态调整利率\n\n点击标题或图标可查看详细信息。');
          }}
        >
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              alert('碳挂钩贷款/债券 - 点击了标题区域');
            }}
          >
            <div 
              className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                alert('碳挂钩贷款/债券 - 点击了图标');
              }}
            >
              <Landmark size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 
                className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('碳挂钩贷款/债券 - 点击了标题');
                }}
              >
                碳挂钩贷款/债券
              </h4>
              <p 
                className="text-xs text-slate-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('基于碳绩效的动态利率 - 点击了副标题');
                }}
              >
                基于碳绩效的动态利率
              </p>
            </div>
          </div>
          <p 
            className="text-sm text-slate-600 mb-4 cursor-pointer hover:text-slate-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              alert('点击了描述文字，可展开查看详细说明');
            }}
          >
            银行基于企业碳绩效数据，提供碳挂钩的优惠贷款或企业发行碳中和债券。智能合约持续监测碳排放数据，动态调整利率。
          </p>
          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('超额完成减排 → 利率减免：如果企业在贷款期内超额完成减排目标，智能合约自动给予利率减免激励');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>超额完成减排 → 利率减免</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('未达标 → 自动触发利率上浮：如果企业未达到约定的减排目标，智能合约自动触发利率上浮或要求提前部分还款');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>未达标 → 自动触发利率上浮</span>
            </div>
          </div>
          <button 
            className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setCarbonLinkedLoanModalOpen(true);
            }}
          >
            申请碳挂钩贷款
          </button>
        </div>

        {/* 碳资产证券化 */}
        <div 
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
          onClick={() => {
            alert('碳资产证券化详情\n\n功能：绿色资产支持证券（ABS）\n\n流程：\n1. 将园区内分散的碳资产打包\n2. 发行绿色资产支持证券\n3. 智能合约定期归集和分配现金流\n\n点击标题或图标可查看详细信息。');
          }}
        >
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              alert('碳资产证券化 - 点击了标题区域');
            }}
          >
            <div 
              className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                alert('碳资产证券化 - 点击了图标');
              }}
            >
              <FileCode size={24} className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 
                className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('碳资产证券化 - 点击了标题');
                }}
              >
                碳资产证券化
              </h4>
              <p 
                className="text-xs text-slate-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('绿色资产支持证券（ABS） - 点击了副标题');
                }}
              >
                绿色资产支持证券（ABS）
              </p>
            </div>
          </div>
          <p 
            className="text-sm text-slate-600 mb-4 cursor-pointer hover:text-slate-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              alert('点击了描述文字，可展开查看详细说明');
            }}
          >
            将园区内分散的碳资产打包，发行绿色资产支持证券。智能合约负责底层碳资产现金流的定期归集和分配，确保投资者按期获得本息。
          </p>
          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('底层资产区块链登记：所有底层碳资产均在区块链上登记，可供审计机构查验，提高资产质量透明度');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>底层资产区块链登记</span>
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert('吸引全球ESG资金：通过资产证券化，可以吸引全球ESG（环境、社会、治理）投资资金进入');
              }}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>吸引全球ESG资金</span>
            </div>
          </div>
          <button 
            className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSecuritizationModalOpen(true);
            }}
          >
            发起资产证券化
          </button>
        </div>
      </div>

      {/* Pledge Management Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center text-lg">
          <ShieldAlert size={20} className="mr-2 text-indigo-600" />
          碳资产质押管理
        </h3>
        
        {/* 分类筛选器 */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">园区筛选：</label>
            <select 
              value={filterPark}
              onChange={(e) => setFilterPark(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">全部园区</option>
              {allParks.map(park => (
                <option key={park} value={park}>{park}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">项目筛选：</label>
            <select 
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="all">全部项目</option>
              {allProjects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          {(filterPark !== 'all' || filterProject !== 'all') && (
            <button
              onClick={() => {
                setFilterPark('all');
                setFilterProject('all');
              }}
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => {
              setFilterPark('all');
              setFilterProject('all');
              alert('质押中资产：当前有 ' + filteredLoans.filter(l => l.status === '正常' || l.status === '待人工复核').length + ' 个资产正在质押中');
            }}
          >
            <p className="text-sm text-slate-600 mb-1">质押中资产</p>
            <p className="text-2xl font-bold text-indigo-600">
              {filteredLoans.filter(l => l.status === '正常' || l.status === '待人工复核').length}
            </p>
            <p className="text-xs text-slate-500 mt-1">总质押量: {filteredLoans.reduce((sum, l) => sum + l.principal, 0).toLocaleString()} 元</p>
          </div>
          <div 
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => {
              alert('已释放资产：正常还款后释放的质押资产');
            }}
          >
            <p className="text-sm text-slate-600 mb-1">已释放资产</p>
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <p className="text-xs text-slate-500 mt-1">正常还款释放</p>
          </div>
          <div 
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 cursor-pointer hover:shadow-md transition-all"
            onClick={() => {
              const highRiskLoans = filteredLoans.filter(l => l.ltvPercent > 70);
              if (highRiskLoans.length > 0) {
                alert('风险预警：当前有 ' + highRiskLoans.length + ' 个资产LTV超过70%，需要关注资产价值波动');
              } else {
                alert('风险预警：当前无高风险资产');
              }
            }}
          >
            <p className="text-sm text-slate-600 mb-1">风险预警</p>
            <p className="text-2xl font-bold text-amber-600">
              {filteredLoans.filter(l => l.ltvPercent > 70).length}
            </p>
              <p className="text-xs text-slate-500 mt-1">LTV &gt; 70% 需关注</p>
          </div>
        </div>
        <div className="space-y-3">
          {filteredLoans.map(loan => {
            const asset = assets.find(a => a.tokenId === loan.tokenId);
            return (
              <div key={loan.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-slate-900 flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        alert(`资产详情：${loan.tokenName}\n贷款编号：${loan.id}\n园区：${loan.park || '未分类'}\n项目：${loan.project || '未分类'}`);
                      }}
                    >
                      {loan.tokenName}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoan(loan);
                          setRepaymentModalOpen(true);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <Info size={12} />
                        详情/还款
                      </button>
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p 
                        className="text-sm text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => {
                          alert(`贷款编号：${loan.id}\n点击可查看贷款详细信息`);
                        }}
                      >
                        贷款编号: <span className="font-mono">{loan.id}</span>
                      </p>
                      {loan.park && (
                        <span 
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterPark(loan.park!);
                            setFilterProject('all');
                          }}
                        >
                          {loan.park}
                        </span>
                      )}
                      {loan.project && (
                        <span 
                          className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded cursor-pointer hover:bg-purple-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterProject(loan.project!);
                            setFilterPark('all');
                          }}
                        >
                          {loan.project}
                        </span>
                      )}
                    </div>
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
          {filteredLoans.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <ShieldAlert size={32} className="mx-auto mb-2 opacity-50" />
              <p>暂无质押记录</p>
              {(filterPark !== 'all' || filterProject !== 'all') && (
                <button
                  onClick={() => {
                    setFilterPark('all');
                    setFilterProject('all');
                  }}
                  className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  清除筛选条件
                </button>
              )}
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

      {/* 碳收益权融资申请模态框 */}
      {revenueRightsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">碳收益权融资申请</h3>
                  <p className="text-xs text-slate-500">未来减排收益权质押/转让融资</p>
                </div>
              </div>
              <button onClick={() => setRevenueRightsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>业务流程：</strong>项目方将未来X年的减排收益权发行碳收益凭证（数证化的合约），由投资者认购提供现款资金支持项目实施。
                  智能合约管理募集、收益分配等全流程，项目完成后每获得一批CCER，合约自动将其交付给投资者或在市场售出后分配收益。
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setTimeout(() => {
                  alert('申请已提交！\n\n系统将进行审核，审核通过后将发行碳收益凭证，投资者可认购提供资金支持。');
                  setIsSubmitting(false);
                  setRevenueRightsModalOpen(false);
                  setRevenueRightsForm({
                    projectName: '', park: '', projectType: '', expectedReduction: '',
                    financingYears: '', expectedCCER: '', financingAmount: ''
                  });
                }, 1500);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">项目名称 *</label>
                    <input
                      required
                      type="text"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.projectName}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, projectName: e.target.value})}
                      placeholder="如：二期屋顶光伏电站"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">所属园区 *</label>
                    <select
                      required
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.park}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, park: e.target.value})}
                    >
                      <option value="">请选择园区</option>
                      <option value="零碳园区A区">零碳园区A区</option>
                      <option value="零碳园区B区">零碳园区B区</option>
                      <option value="零碳园区C区">零碳园区C区</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">项目类型 *</label>
                  <select
                    required
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={revenueRightsForm.projectType}
                    onChange={(e) => setRevenueRightsForm({...revenueRightsForm, projectType: e.target.value})}
                  >
                    <option value="">请选择项目类型</option>
                    <option value="光伏发电">光伏发电</option>
                    <option value="储能">储能</option>
                    <option value="节能改造">节能改造</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">预期年减排量 (tCO₂e) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.expectedReduction}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, expectedReduction: e.target.value})}
                      placeholder="如：5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">融资年限 (年) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.financingYears}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, financingYears: e.target.value})}
                      placeholder="如：5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">预期CCER产出 (tCO₂e) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.expectedCCER}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, expectedCCER: e.target.value})}
                      placeholder="如：25000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">融资金额 (元) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={revenueRightsForm.financingAmount}
                      onChange={(e) => setRevenueRightsForm({...revenueRightsForm, financingAmount: e.target.value})}
                      placeholder="如：1500000"
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-600 mb-2"><strong>智能合约机制：</strong></p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>募集期内，投资者以数字人民币购买凭证，资金划转给项目方</li>
                    <li>项目完成后每获得一批CCER，合约自动将其交付给投资者或在市场售出后分配收益</li>
                    <li>所有收益分配过程在链上记录，确保透明可追溯</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setRevenueRightsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        提交中...
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

      {/* 碳挂钩贷款/债券申请模态框 */}
      {carbonLinkedLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Landmark size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">碳挂钩贷款/债券申请</h3>
                  <p className="text-xs text-slate-500">基于碳绩效的动态利率</p>
                </div>
              </div>
              <button onClick={() => setCarbonLinkedLoanModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800 leading-relaxed">
                  <strong>智能合约机制：</strong>智能合约持续监测企业碳排放数据。
                  若企业在贷款期内未达到约定的减排目标，合约可触发上调贷款利率或要求提前部分还款的条款；
                  反之若超额完成减排，则给予利率减免激励。实现"贷后管理"自动执行。
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setTimeout(() => {
                  alert('申请已提交！\n\n银行将基于企业碳绩效数据进行评估，智能合约将持续监测碳排放数据并动态调整利率。');
                  setIsSubmitting(false);
                  setCarbonLinkedLoanModalOpen(false);
                  setCarbonLinkedLoanForm({
                    enterpriseName: '', currentEmission: '', reductionTarget: '',
                    loanAmount: '', loanTerm: '', baseRate: '3.85', performanceBonus: '0.5'
                  });
                }, 1500);
              }}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">企业名称 *</label>
                  <input
                    required
                    type="text"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    value={carbonLinkedLoanForm.enterpriseName}
                    onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, enterpriseName: e.target.value})}
                    placeholder="如：阿尔法精密制造有限公司"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">当前年碳排放量 (tCO₂e) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.currentEmission}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, currentEmission: e.target.value})}
                      placeholder="如：2800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">减排目标 (%) *</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.reductionTarget}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, reductionTarget: e.target.value})}
                      placeholder="如：15"
                    />
                    <p className="text-xs text-slate-500 mt-1">贷款期内需达到的减排百分比</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">贷款金额 (元) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.loanAmount}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, loanAmount: e.target.value})}
                      placeholder="如：5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">贷款期限 (月) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.loanTerm}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, loanTerm: e.target.value})}
                      placeholder="如：36"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">基础利率 (%) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.baseRate}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, baseRate: e.target.value})}
                      placeholder="如：3.85"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">超额完成奖励 (%) *</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      value={carbonLinkedLoanForm.performanceBonus}
                      onChange={(e) => setCarbonLinkedLoanForm({...carbonLinkedLoanForm, performanceBonus: e.target.value})}
                      placeholder="如：0.5"
                    />
                    <p className="text-xs text-slate-500 mt-1">超额完成减排时的利率减免</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-600 mb-2"><strong>动态利率调整机制：</strong></p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>超额完成减排：</strong>智能合约自动执行利率减免（基础利率 - {carbonLinkedLoanForm.performanceBonus}%）</li>
                    <li><strong>未达标：</strong>智能合约自动触发利率上浮（基础利率 + 0.5%）或要求提前部分还款</li>
                    <li>平台负责监测企业碳排放数据并定期把结果传递给银行和链上合约</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setCarbonLinkedLoanModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        提交中...
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

      {/* 资产证券化申请模态框 */}
      {securitizationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileCode size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">碳资产证券化申请</h3>
                  <p className="text-xs text-slate-500">绿色资产支持证券（ABS）</p>
                </div>
              </div>
              <button onClick={() => setSecuritizationModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-800 leading-relaxed">
                  <strong>业务流程：</strong>将园区内分散的碳资产打包，发行绿色资产支持证券。
                  平台汇聚各企业的碳资产数证作为基础资产池，信托给专项计划，再由投资者购买证券份额。
                  智能合约负责底层碳资产现金流（例如碳配额/CCER出售所得）的定期归集和分配，确保投资者按期获得本息。
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                if (securitizationForm.selectedAssets.length === 0) {
                  alert('请至少选择一个碳资产');
                  return;
                }
                setIsSubmitting(true);
                setTimeout(() => {
                  alert('申请已提交！\n\n系统将进行审核，审核通过后将发行绿色资产支持证券，智能合约将负责底层碳资产现金流的定期归集和分配。');
                  setIsSubmitting(false);
                  setSecuritizationModalOpen(false);
                  setSecuritizationForm({
                    selectedAssets: [], securitySize: '', term: '', expectedYield: '', issuanceDate: ''
                  });
                }, 1500);
              }}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">选择底层碳资产 *</label>
                  <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {availableAssets.map(asset => (
                      <label key={asset.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={securitizationForm.selectedAssets.includes(asset.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSecuritizationForm({
                                ...securitizationForm,
                                selectedAssets: [...securitizationForm.selectedAssets, asset.id]
                              });
                            } else {
                              setSecuritizationForm({
                                ...securitizationForm,
                                selectedAssets: securitizationForm.selectedAssets.filter(id => id !== asset.id)
                              });
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-900">{asset.projectName}</span>
                          <span className="text-xs text-slate-500 ml-2">数证: {asset.tokenId || '未上链'}</span>
                          <span className="text-xs text-emerald-600 ml-2">¥ {asset.estimatedValue?.toLocaleString()}</span>
                        </div>
                      </label>
                    ))}
                    {availableAssets.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">暂无已上链的碳资产</p>
                    )}
                  </div>
                  {securitizationForm.selectedAssets.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">
                      已选择 {securitizationForm.selectedAssets.length} 个资产，总价值: ¥ {
                        availableAssets
                          .filter(a => securitizationForm.selectedAssets.includes(a.id))
                          .reduce((sum, a) => sum + (a.estimatedValue || 0), 0)
                          .toLocaleString()
                      }
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">证券规模 (元) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={securitizationForm.securitySize}
                      onChange={(e) => setSecuritizationForm({...securitizationForm, securitySize: e.target.value})}
                      placeholder="如：5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">证券期限 (年) *</label>
                    <input
                      required
                      type="number"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={securitizationForm.term}
                      onChange={(e) => setSecuritizationForm({...securitizationForm, term: e.target.value})}
                      placeholder="如：3"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">预期年化收益率 (%) *</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={securitizationForm.expectedYield}
                      onChange={(e) => setSecuritizationForm({...securitizationForm, expectedYield: e.target.value})}
                      placeholder="如：4.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">预计发行日期 *</label>
                    <input
                      required
                      type="date"
                      className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={securitizationForm.issuanceDate}
                      onChange={(e) => setSecuritizationForm({...securitizationForm, issuanceDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-600 mb-2"><strong>智能合约机制：</strong></p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>所有底层碳资产均在区块链上登记，可供审计机构查验，提高资产质量透明度</li>
                    <li>智能合约负责底层碳资产现金流（例如碳配额/CCER出售所得）的定期归集和分配</li>
                    <li>确保投资者按期获得本息，降低证券发行的信息不对称</li>
                    <li>可以吸引全球ESG（环境、社会、治理）投资资金进入</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSecuritizationModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        提交中...
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
    </div>
  );
};

export default GreenFinance;
