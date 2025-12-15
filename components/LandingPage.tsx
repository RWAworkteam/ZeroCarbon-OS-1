import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ChevronRight, Activity, Cpu, Server, ShieldCheck, 
  Coins, Zap, Wallet, BarChart3, Globe, Layers, Lock, Database 
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onEnter}>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
                <div className="w-5 h-5 border-2 border-emerald-400 rounded-full border-t-transparent animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">零碳园区</h1>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">资产数字化平台</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#architecture" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">技术架构</a>
              <a href="#scenarios" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">核心场景</a>
              <a href="#roadmap" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">建设路径</a>
            </div>

            <button
              onClick={onEnter}
              className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 flex items-center gap-2"
            >
              进入管理平台
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                零碳园区 · 数字化试点
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pb-2">
                  碳资产全流程
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  数字化闭环管理
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                基于“区块链+碳资产+绿色金融”模式，打造可信、可审计的园区碳资产总账本。实现从发电、用电到碳交易的一站式智能管理。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onEnter}
                  className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  启动演示系统
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                  <Activity size={18} className="text-emerald-500" />
                  查看实施方案
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-500">通过第三方核证</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={20} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-500">银行级数据安全</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-500">符合国际减排标准</span>
                </div>
              </div>
            </div>

            {/* Hero Visual - CSS 3D Mockup */}
            <div className="flex-1 w-full max-w-[600px] lg:max-w-none perspective-1000">
              <div className="relative transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                {/* Floating Elements */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl opacity-20 blur-2xl animate-pulse"></div>
                
                {/* Main Dashboard Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
                  {/* Fake Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="ml-4 h-2 w-32 bg-slate-200 rounded-full"></div>
                  </div>
                  
                  {/* Dashboard Content Mock */}
                  <div className="p-6 grid grid-cols-2 gap-4">
                     {/* Card 1 */}
                     <div className="col-span-2 bg-slate-900 rounded-xl p-5 text-white relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Activity size={80} />
                        </div>
                        <div className="text-slate-400 text-xs font-medium mb-1">今日累计减排量</div>
                        <div className="text-3xl font-bold flex items-end gap-2">
                           850.2 <span className="text-sm font-normal text-emerald-400 mb-1">+12%</span>
                        </div>
                        <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[70%]"></div>
                        </div>
                     </div>
                     {/* Card 2 */}
                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                           <Zap size={18} />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">1,245 <span className="text-xs text-slate-500 font-normal">MWh</span></div>
                        <div className="text-xs text-emerald-700 font-medium mt-1">绿电消纳总额</div>
                     </div>
                     {/* Card 3 */}
                     <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-3">
                           <Coins size={18} />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">¥ 45W <span className="text-xs text-slate-500 font-normal">e-CNY</span></div>
                        <div className="text-xs text-indigo-700 font-medium mt-1">碳资产收益</div>
                     </div>
                     {/* Chart Area */}
                     <div className="col-span-2 mt-2 pt-4 border-t border-slate-100">
                        <div className="flex items-end justify-between h-24 gap-2">
                           {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                             <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group cursor-pointer">
                                <div 
                                  className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-400"
                                  style={{ height: `${h}%` }}
                                ></div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -left-6 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 animate-bounce-slow">
                   <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <div className="text-xs text-slate-500 font-semibold">区块高度</div>
                      <div className="text-sm font-bold text-slate-900">#12,054</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section - Bento Grid */}
      <section id="architecture" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Technical Architecture</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">“四层一链” 架构设计</h3>
            <p className="text-slate-500 text-lg">
              采用分层模块化设计，确保从底层硬件到上层金融应用的合规性与可扩展性。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* Main Feature - Large */}
            <div className="md:col-span-2 row-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Database size={24} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">3. 碳资产与区块链层 (Core)</h4>
                <p className="text-slate-600 mb-6 max-w-md">
                  部署园区级联盟链（业务链），将项目审定、资产生成、冻结注销等关键事件上链存证，形成不可篡改的共同账本。
                  支持碳资产通证化、碳普惠交易对接、碳资产质押管理等核心功能。智能合约自动执行碳资产发行、交易结算、积分兑付等逻辑。
                </p>
                <div className="space-y-3">
                   <div className="flex items-center text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
                      <ShieldCheck size={16} className="text-emerald-500 mr-2" />
                      <span>FISCO BCOS / 长安链底层支持</span>
                   </div>
                   <div className="flex items-center text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
                      <Lock size={16} className="text-emerald-500 mr-2" />
                      <span>多节点共识机制 (PBFT)</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Cpu size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">1. 感知与接入层</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                IoT网关直连光伏逆变器、充电桩与电表。兼容 Modbus / IEC104 协议。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Server size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">2. 数据与核算层</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                内置标准碳排放因子库。时序数据库处理高频电力数据，实时计算减排量。
              </p>
            </div>

            {/* Feature 4 - Wide */}
            <div className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
               <div className="absolute right-0 bottom-0 opacity-10">
                 <Coins size={150} />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-white/10 rounded-lg">
                          <Layers size={24} className="text-emerald-400" />
                       </div>
                       <h4 className="text-2xl font-bold">4. 业务应用与金融层</h4>
                    </div>
                    <p className="text-slate-300 max-w-xl">
                       面向企业提供碳账户门户，面向银行提供绿色金融数据接口。支持数字人民币 (e-CNY) 结算电费与碳交易，实现资金流与信息流的“双流合一”。
                    </p>
                  </div>
                  <button 
                    onClick={onEnter}
                    className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    体验金融场景
                    <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section id="scenarios" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16">
             <div>
                <h2 className="text-sm font-bold text-emerald-600 tracking-widest uppercase mb-3">Core Scenarios</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">两大核心示范场景</h3>
             </div>
             <p className="text-slate-500 max-w-md text-right mt-4 md:mt-0">
               业务驱动，金融化导向。<br/>不仅仅是能耗看板，更是资产变现工具。
             </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Scenario 1 */}
              <div className="group relative rounded-3xl border border-slate-200 bg-slate-50/50 p-10 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Zap size={32} />
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 mb-4">场景1：光伏 + 绿电 + 碳资产记账</h4>
                 <p className="text-slate-600 mb-8 leading-relaxed">
                   光伏全量电量 → 按负荷侧分配绿电消费 → 计算减排量；在园区/企业碳账户中形成对应碳资产凭证。
                   用于零碳园区考核、对外公示与后续资产打包。对分布式光伏发电进行可信计量，自动核算减排量并生成预审定的碳资产凭证。
                   资产数据实时上链，作为银行绿色信贷的增信依据。
                 </p>
                 <div className="space-y-4">
                   {['实时消纳计算', '资产自动确权', '绿色信贷增信'].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <ArrowRight size={12} />
                        </div>
                        {item}
                     </div>
                   ))}
                 </div>
              </div>

              {/* Scenario 2 */}
              <div className="group relative rounded-3xl border border-slate-200 bg-slate-50/50 p-10 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                 <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Wallet size={32} />
                 </div>
                 <h4 className="text-2xl font-bold text-slate-900 mb-4">充电桩 + 数币支付 + 碳积分</h4>
                 <p className="text-slate-600 mb-8 leading-relaxed">
                   车主使用数字人民币支付充电费，系统基于充电量自动发放“碳积分”。积分可在园区内兑换服务或抵扣电费，构建“碳普惠”闭环。
                 </p>
                 <div className="space-y-4">
                   {['数币智能合约支付', '个人碳账户激励', '积分抵扣场景'].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <ArrowRight size={12} />
                        </div>
                        {item}
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-24 bg-slate-900 text-white relative overflow-hidden">
         {/* Decorative Background */}
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Activity size={400} />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-4">实施路径与里程碑</h3>
            <p className="text-slate-400">分阶段推进，确保项目按时交付与价值落地</p>
          </div>

          <div className="relative border-l border-slate-700 ml-4 space-y-12">
            
            {/* Phase 1 */}
            <div className="relative pl-12 group">
               <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-150 transition-transform"></div>
               <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-emerald-400">一期：基础建设与示范</h4>
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded mt-2 sm:mt-0 w-fit">0-9 个月</span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <li className="flex items-center text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        完成数据采集与碳核算引擎搭建
                     </li>
                     <li className="flex items-center text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        部署园区联盟链，形成碳资产底账
                     </li>
                     <li className="flex items-center text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        落地“光伏+绿电”与“充电桩+数币”场景
                     </li>
                     <li className="flex items-center text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                        打通首家合作银行数币接口
                     </li>
                  </ul>
               </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-12 group">
               <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-slate-600 rounded-full group-hover:scale-150 transition-transform"></div>
               <div className="bg-slate-800/20 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-slate-200">二期：扩展与复制推广</h4>
                     <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded mt-2 sm:mt-0 w-fit">10-24 个月</span>
                  </div>
                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <li className="flex items-center text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2"></span>
                        扩展节能改造、柔性负荷等更多项目
                     </li>
                     <li className="flex items-center text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2"></span>
                        对接江苏碳普惠平台与绿色金融产品
                     </li>
                     <li className="flex items-center text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2"></span>
                        输出标准化解决方案，向其他园区复制
                     </li>
                  </ul>
               </div>
            </div>

          </div>

          <div className="mt-20 text-center">
            <button 
              onClick={onEnter}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-emerald-500 font-lg rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-1"
            >
              <span className="mr-2">进入系统演示</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40"></div>
            </button>
            <p className="mt-4 text-sm text-slate-500">
              * 演示版本数据为模拟数据，不代表实时运行状态
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-emerald-400 rounded-full border-t-transparent animate-spin-slow" />
             </div>
             <span className="font-bold text-slate-900">零碳园区 · 资产数字化平台</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">服务条款</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">技术支持</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 ZeroCarbon OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;