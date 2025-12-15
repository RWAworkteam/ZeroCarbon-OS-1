
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, ArrowUpRight, Activity, TrendingUp, CheckCircle2, XCircle, RefreshCw, Link2, Server, Sparkles, Plus, FileText, Info, X } from 'lucide-react';

// 高级说明图标组件 - 使用更优雅的设计
const InfoIcon = ({ color = 'blue' }: { color?: 'indigo' | 'blue' | 'emerald' }) => {
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
import { CarbonAsset, TradeRecord, TradingPlatform } from '../types';

interface TradingMarketProps {
  assets: CarbonAsset[];
  trades: TradeRecord[];
  onCreateTrade: (tradeDetails: any) => void;
}

// Mock Chart Data
const DATA = Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, price: 50 + Math.random() * 5 }));

const TradingMarket: React.FC<TradingMarketProps> = ({ assets, trades, onCreateTrade }) => {
  const [form, setForm] = useState({
     assetId: '',
     side: 'sell',
     quantity: '',
     price: '',
     venue: '碳资产交易中心',
     settlementChannel: 'e-CNY（上海数币国际平台）'
  });
  // 碳普惠资产池（示例数据）
  const [pools, setPools] = useState([
    {
      id: 'TP-001',
      name: '光伏项目资产池 #001',
      totalAmount: 1200,
      estimatedValue: 72000,
      status: 'listed',
      platform: '江苏碳普惠平台',
      date: '2024-05-18',
      desc: '包含3个光伏项目，总减排量: 1,200 tCO₂e'
    },
    {
      id: 'TP-002',
      name: '节能改造资产池 #002',
      totalAmount: 850,
      estimatedValue: 51000,
      status: 'traded',
      platform: '江苏碳普惠平台',
      date: '2024-05-15',
      desc: '包含2个节能项目，总减排量: 850 tCO₂e'
    }
  ]);
  const [poolModalOpen, setPoolModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<typeof pools[0] | null>(null);
  const [newPool, setNewPool] = useState({
    name: '',
    totalAmount: '',
    platform: '江苏碳普惠平台',
    desc: ''
  });

  // Trading platforms status
  const [platforms] = useState<TradingPlatform[]>([
    {
      id: '1',
      name: '上海数字人民币国际运营平台',
      type: 'digital_rmb_platform',
      status: 'connected',
      apiEndpoint: 'https://api.dcep.sh.cn/v1',
      lastSync: new Date().toLocaleTimeString()
    },
    {
      id: '2',
      name: '全国碳资产交易中心',
      type: 'carbon_exchange',
      status: 'connected',
      apiEndpoint: 'https://api.carbon-exchange.cn/v1',
      lastSync: new Date().toLocaleTimeString()
    },
    {
      id: '3',
      name: '江苏碳普惠平台',
      type: 'carbon_exchange',
      status: 'connected',
      apiEndpoint: 'https://api.js-carbon.cn/v1',
      lastSync: new Date().toLocaleTimeString()
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onCreateTrade({
        ...form,
        quantity: parseFloat(form.quantity),
        price: parseFloat(form.price)
     });
     // Reset key fields
     setForm({...form, quantity: '', price: ''});
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    const pool = {
      id: `TP-${Date.now().toString().slice(-4)}`,
      name: newPool.name || '未命名资产池',
      totalAmount: parseFloat(newPool.totalAmount) || 0,
      estimatedValue: Math.round((parseFloat(newPool.totalAmount) || 0) * 60),
      status: 'draft',
      platform: newPool.platform,
      date: new Date().toLocaleDateString(),
      desc: newPool.desc || '园区减排资产打包'
    };
    setPools(prev => [pool, ...prev]);
    setNewPool({ name: '', totalAmount: '', platform: '江苏碳普惠平台', desc: '' });
    setPoolModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="blue" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">碳普惠交易对接说明</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>核心功能：</strong>将园区内部碳资产池中的部分资产，转换为可在省市碳普惠平台上挂牌和交易的"碳普惠资产"。
              平台支持资产打包、估值、挂牌申请、成交结果回写和内部收益分配的全流程管理。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>交易流程：</strong>①选择符合条件的项目减排量打包纳入"碳普惠资产池" → ②通过对接省/市碳普惠平台接口完成挂牌与交易 → 
              ③成交收益回流至园区/企业，内部按预设规则进行收益分配 → ④全流程在链上记录，方便审计与复盘。
              所有交易通过数字人民币进行结算，实现资金与资产的同步交割（DVP），确保资金安全和交易透明。
            </p>
          </div>
        </div>
      </div>

      {/* Header Status */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="bg-white/10 p-2 rounded-lg"><Globe className="text-emerald-400 animate-pulse" size={24} /></div>
          <div>
            <h2 className="text-lg font-bold">上海数字人民币国际运营平台 · 碳资产交易专区</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              已连接至主网节点 • 延迟 24ms
            </div>
          </div>
        </div>
      </div>

      {/* Trading Platforms Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
          <Server size={20} className="mr-2 text-indigo-600" />
          交易平台对接状态
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map(platform => (
            <div key={platform.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">{platform.name}</h4>
                <div className={`flex items-center gap-1 ${platform.status === 'connected' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {platform.status === 'connected' ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span className="text-xs">已连接</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      <span className="text-xs">未连接</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1">
                  <Link2 size={12} />
                  <span className="font-mono">{platform.apiEndpoint}</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw size={12} />
                  <span>最后同步: {platform.lastSync}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <div className="font-bold text-xl text-slate-900">SHE:PV-2024 (光伏碳汇)</div>
                 <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center bg-emerald-100 text-emerald-700`}>
                    +2.45% <TrendingUp size={12} className="ml-1" />
                 </span>
              </div>
              <div className="text-2xl font-mono font-bold text-slate-800">¥ 52.50</div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA}>
                    <defs>
                       <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 10}} />
                    <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Trade Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
           <h3 className="font-bold text-slate-800 mb-4">资产交易下单</h3>
           <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                 <label className="text-xs text-slate-500">交易资产</label>
                 <select required className="w-full border p-2 rounded bg-slate-50" value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})}>
                    <option value="">选择资产...</option>
                    {assets.filter(a => a.status === '已铸造/上链').map(a => (
                       <option key={a.id} value={a.id}>{a.projectName}</option>
                    ))}
                 </select>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="text-xs text-slate-500">方向</label>
                    <select className="w-full border p-2 rounded bg-slate-50" value={form.side} onChange={e => setForm({...form, side: e.target.value as any})}>
                       <option value="sell">卖出</option>
                       <option value="buy">买入</option>
                    </select>
                 </div>
                 <div className="flex-1">
                    <label className="text-xs text-slate-500">数量 (t)</label>
                    <input required type="number" className="w-full border p-2 rounded bg-slate-50" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                 </div>
              </div>
              <div>
                 <label className="text-xs text-slate-500">单价 (¥)</label>
                 <input required type="number" className="w-full border p-2 rounded bg-slate-50" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div>
                 <label className="text-xs text-slate-500">交易场所</label>
                 <select className="w-full border p-2 rounded bg-slate-50" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}>
                    <option value="碳资产交易中心">全国碳资产交易中心</option>
                    <option value="上海数币国际平台">上海数字人民币国际运营平台</option>
                    <option value="江苏碳普惠平台">江苏碳普惠平台</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs text-slate-500">结算通道</label>
                 <select className="w-full border p-2 rounded bg-slate-50" value={form.settlementChannel} onChange={e => setForm({...form, settlementChannel: e.target.value})}>
                    <option value="e-CNY（上海数币国际平台）">e-CNY（上海数币国际平台）</option>
                    <option value="银行转账">银行转账</option>
                 </select>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold mt-2 hover:bg-slate-800">
                 确认下单
              </button>
           </form>
        </div>
      </div>
      
      {/* 碳普惠资产池管理 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg">碳普惠资产池管理</h3>
              <p className="text-xs text-slate-500">打包园区减排量，提交至省/市碳普惠平台挂牌</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedPool(null);
                setPoolModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              创建资产池
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-slate-600 mb-1">资产池数量</p>
            <p className="text-2xl font-bold text-emerald-600">{pools.length}</p>
            <p className="text-xs text-slate-500 mt-1">总减排量: {pools.reduce((sum, p) => sum + p.totalAmount, 0)} tCO₂e</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-slate-600 mb-1">已挂牌</p>
            <p className="text-2xl font-bold text-blue-600">{pools.filter(p => p.status === 'listed').length}</p>
            <p className="text-xs text-slate-500 mt-1">预估价值: ¥ {pools.filter(p => p.status === 'listed').reduce((sum, p) => sum + p.estimatedValue, 0).toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <p className="text-sm text-slate-600 mb-1">已成交</p>
            <p className="text-2xl font-bold text-purple-600">{pools.filter(p => p.status === 'traded').length}</p>
            <p className="text-xs text-slate-500 mt-1">成交金额: ¥ {pools.filter(p => p.status === 'traded').reduce((sum, p) => sum + p.estimatedValue, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-3">
          {pools.map(pool => (
            <div key={pool.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    {pool.name}
                    <button
                      onClick={() => {
                        setSelectedPool(pool);
                        setPoolModalOpen(true);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <FileText size={12} />
                      查看详情
                    </button>
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">{pool.desc}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pool.status === 'listed' ? 'bg-emerald-100 text-emerald-700' :
                  pool.status === 'traded' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {pool.status === 'listed' ? '已挂牌' : pool.status === 'traded' ? '已成交' : '草稿'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 mt-3">
                <span>预估价值: <strong className="text-slate-900">¥ {pool.estimatedValue.toLocaleString()}</strong></span>
                <span>目标平台: <strong className="text-slate-900">{pool.platform}</strong></span>
                <span>{pool.status === 'traded' ? '成交时间' : '创建时间'}: <strong className="text-slate-900">{pool.date}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-700">交易流水 (模拟)</div>
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="px-6 py-3">时间</th>
                  <th className="px-6 py-3">资产</th>
                  <th className="px-6 py-3">方向</th>
                  <th className="px-6 py-3 text-right">数量/价格</th>
                  <th className="px-6 py-3">场所/通道</th>
                  <th className="px-6 py-3">状态</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {trades.map(t => (
                  <tr key={t.id}>
                     <td className="px-6 py-3 text-slate-500 text-xs">{t.time}</td>
                     <td className="px-6 py-3 font-medium">{t.tokenName}</td>
                     <td className={`px-6 py-3 font-bold ${t.side === 'buy' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.side === 'buy' ? '买入' : '卖出'}
                     </td>
                     <td className="px-6 py-3 text-right">
                        <div>{t.quantity} t</div>
                        <div className="text-xs text-slate-400">@ ¥{t.price}</div>
                     </td>
                     <td className="px-6 py-3 text-xs text-slate-500">
                        <div>{t.venue}</div>
                        <div>{t.settlementChannel}</div>
                     </td>
                     <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{t.status}</span></td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* 资产池详情 / 创建弹窗 */}
      {poolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Info size={18} className="text-indigo-600" />
                {selectedPool ? '资产池详情' : '新建资产池'}
              </h3>
              <button onClick={() => { setPoolModalOpen(false); setSelectedPool(null); }}>
                <X size={20} className="text-slate-500 hover:text-slate-700" />
              </button>
            </div>
            {selectedPool ? (
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">名称</span>
                  <span className="font-semibold text-slate-900">{selectedPool.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">总减排量</span>
                  <span className="font-semibold text-slate-900">{selectedPool.totalAmount} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">预估价值</span>
                  <span className="font-semibold text-slate-900">¥ {selectedPool.estimatedValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">目标平台</span>
                  <span className="font-semibold text-slate-900">{selectedPool.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">状态</span>
                  <span className="font-semibold text-slate-900">{selectedPool.status}</span>
                </div>
                <div>
                  <p className="text-slate-500 text-sm mb-1">描述</p>
                  <p className="text-sm text-slate-800">{selectedPool.desc}</p>
                </div>
              </div>
            ) : (
              <form className="p-6 space-y-4" onSubmit={handleCreatePool}>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">资产池名称 *</label>
                  <input
                    required
                    value={newPool.name}
                    onChange={e => setNewPool({...newPool, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="例如：光伏资产池 2024Q2"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">总减排量 (tCO₂e)</label>
                  <input
                    type="number"
                    value={newPool.totalAmount}
                    onChange={e => setNewPool({...newPool, totalAmount: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="如：1200"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">目标平台</label>
                  <select
                    value={newPool.platform}
                    onChange={e => setNewPool({...newPool, platform: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="江苏碳普惠平台">江苏碳普惠平台</option>
                    <option value="全国碳资产交易中心">全国碳资产交易中心</option>
                    <option value="上海数字人民币国际平台">上海数字人民币国际平台</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">描述</label>
                  <textarea
                    value={newPool.desc}
                    onChange={e => setNewPool({...newPool, desc: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    rows={3}
                    placeholder="资产池说明，如包含项目、预估价值等"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setPoolModalOpen(false); setSelectedPool(null); }}
                    className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    保存资产池
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingMarket;
