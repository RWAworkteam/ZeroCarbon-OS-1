
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Zap, Leaf, Wallet, Factory, TrendingUp, TrendingDown, Table2, Sparkles } from 'lucide-react';
import { ENERGY_DATA as INITIAL_ENERGY_DATA, EMISSION_DATA } from '../constants';

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

const MetricCard = ({ title, value, unit, change, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 tabular-nums">{value} <span className="text-sm font-normal text-slate-500">{unit}</span></h3>
      <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        <span>环比 {change >= 0 ? '+' : ''}{change}%</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Live Data State
  const [energyData, setEnergyData] = useState(INITIAL_ENERGY_DATA);
  const [liveGen, setLiveGen] = useState(1245.8);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Chart Data
      setEnergyData(prevData => {
        const lastItem = prevData[prevData.length - 1];
        // Parse time, add 1 hour
        const [hour] = lastItem.time.split(':').map(Number);
        const nextHour = (hour + 1) % 24;
        const nextTime = `${nextHour.toString().padStart(2, '0')}:00`;

        const newGen = Math.max(0, 1000 + Math.random() * 500 - 250); // Simulate random variance
        const newCon = Math.max(0, 900 + Math.random() * 400 - 200);

        const newItem = {
          time: nextTime,
          generation: Math.round(newGen),
          consumption: Math.round(newCon)
        };
        
        // Keep array size fixed
        return [...prevData.slice(1), newItem];
      });

      // Update Metric
      setLiveGen(prev => prev + (Math.random() * 0.5));

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="blue" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">总览页面说明</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              总览页面提供零碳园区的核心数据概览，包括实时能耗监测、碳减排统计、碳资产储备等关键指标。
              平台采用"四层一链"架构，实现从感知接入、数据核算、碳资产管理到业务应用的全流程数字化管理。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>核心能力：</strong>碳资产登记确权上链、碳普惠交易对接、数字人民币支付结算、碳资产质押融资、碳积分激励发放、
              碳收益权融资、碳挂钩贷款/债券、碳资产证券化等全链条绿色金融服务。
              所有数据实时更新，通过区块链形成可信、可审计的碳资产总账本，帮助您快速了解园区的整体运营状况和碳中和进展。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="绿电总发电量" 
          value={liveGen.toFixed(1)} 
          unit="MWh" 
          change={12.5} 
          icon={Zap} 
          color="bg-amber-500" 
        />
        <MetricCard 
          title="累计碳减排量" 
          value="850.2" 
          unit="tCO2e" 
          change={8.2} 
          icon={Leaf} 
          color="bg-emerald-500" 
        />
        <MetricCard 
          title="碳资产储备" 
          value="3,420" 
          unit="Credits" 
          change={-2.4} 
          icon={Wallet} 
          color="bg-blue-500" 
        />
        <MetricCard 
          title="入园企业总数" 
          value="24" 
          unit="家" 
          change={4.0} 
          icon={Factory} 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Generation vs Consumption */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">园区实时能耗监测 <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2"></span></h3>
              <p className="text-xs text-slate-500">实时监测园区光伏发电与用电负荷，帮助优化能源调度</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div> 光伏发电</span>
              <span className="flex items-center text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div> 电网负荷</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="generation" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorGen)" name="发电 (kW)" animationDuration={1000} />
                <Area type="monotone" dataKey="consumption" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCon)" name="用电 (kW)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart: Emission vs Offset */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">碳中和趋势</h3>
            <p className="text-xs text-slate-500">展示月度碳排放与减排对比，追踪碳中和进展</p>
          </div>
          <div className="h-[300px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMISSION_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" />
                <Bar dataKey="emitted" name="碳排放量" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offset" name="抵消/减排" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Carbon Neutrality Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1 flex items-center">
              <Table2 size={20} className="mr-2 text-indigo-600" />
              碳中和数据明细表
            </h3>
            <p className="text-xs text-slate-500">详细展示各月度的碳排放、减排、绿电使用等多维度数据</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left font-semibold text-slate-700">月份</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">碳排放量 (tCO2e)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">抵消/减排 (tCO2e)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">减排措施 (tCO2e)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">绿电占比 (%)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">碳配额 (单位)</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">净排放量 (tCO2e)</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EMISSION_DATA.map((item, index) => {
                const netEmission = item.emitted - item.offset;
                const isNeutral = netEmission <= 0;
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-semibold">{item.emitted.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{item.offset.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{item.reduction?.toLocaleString() || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-semibold text-slate-900">{item.greenPower || '-'}%</span>
                        {item.greenPower && (
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${item.greenPower}%` }}></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{item.quota?.toLocaleString() || '-'}</td>
                    <td className={`px-4 py-3 text-right font-bold ${isNeutral ? 'text-emerald-600' : 'text-red-600'}`}>
                      {netEmission.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isNeutral 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {isNeutral ? '已中和' : '未中和'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={12} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">数据说明：</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>碳排放量：</strong>企业生产运营产生的二氧化碳当量</li>
                <li><strong>抵消/减排：</strong>通过绿电、节能等措施实现的减排量</li>
                <li><strong>净排放量：</strong>碳排放量减去抵消/减排量，≤0表示已实现碳中和</li>
                <li><strong>绿电占比：</strong>绿色电力在总用电量中的比例</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions / Alerts */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div>
          <h4 className="text-lg font-bold mb-1">第二季度碳盘查进行中</h4>
          <p className="text-slate-300 text-sm">请各企业在6月30日前提交月度用能报告与减排证明。</p>
        </div>
        <button className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          上传数据
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
