
import React, { useState } from 'react';
import { AssetStatus, CarbonAsset, Enterprise, ComplianceStatus } from '../types';
import { Search, Plus, FileCheck, ArrowRight, ShieldCheck, Gem, Loader2, Link, MapPin, Cpu, X, ExternalLink, CheckCircle2, Copy, QrCode, AlertTriangle, Users, Building2, Phone, Mail, TrendingUp, TrendingDown, Zap, Calendar, BarChart3, Sparkles } from 'lucide-react';

// 高级说明图标组件 - 使用更优雅的设计
const InfoIcon = ({ color = 'indigo' }: { color?: 'indigo' | 'blue' | 'emerald' }) => {
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

interface CarbonAccountsProps {
  assets: CarbonAsset[];
  enterprises: Enterprise[];
  onAddAsset: (asset: Partial<CarbonAsset>) => void;
  onMint: (id: string, volume: number) => void;
  onAddEnterprise: (enterprise: Partial<Enterprise>) => void;
}

const CarbonAccounts: React.FC<CarbonAccountsProps> = ({ assets, enterprises, onAddAsset, onMint, onAddEnterprise }) => {
  const [activeTab, setActiveTab] = useState<'enterprises' | 'assets'>('enterprises');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEnterpriseModalOpen, setIsAddEnterpriseModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTokenDetailModalOpen, setIsTokenDetailModalOpen] = useState(false);
  const [isEnterpriseDetailModalOpen, setIsEnterpriseDetailModalOpen] = useState(false);
  const [selectedAssetForMint, setSelectedAssetForMint] = useState<CarbonAsset | null>(null);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<CarbonAsset | null>(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [mintVolume, setMintVolume] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [newAsset, setNewAsset] = useState<Partial<CarbonAsset>>({});
  const [newEnterprise, setNewEnterprise] = useState<Partial<Enterprise>>({});

  const handleOpenMintModal = (asset: CarbonAsset) => {
    setSelectedAssetForMint(asset);
    setMintVolume(asset.amount);
    setIsMintModalOpen(true);
  };

  const confirmMint = () => {
    if (selectedAssetForMint) {
      setIsMintModalOpen(false);
      setProcessingId(selectedAssetForMint.id);
      setTimeout(() => {
        onMint(selectedAssetForMint.id, mintVolume);
        setProcessingId(null);
        setSelectedAssetForMint(null);
      }, 2000);
    }
  };

  const handleSubmitNewAsset = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAsset(newAsset);
    setIsAddModalOpen(false);
    setNewAsset({});
  };

  const handleSubmitNewEnterprise = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEnterprise(newEnterprise);
    setIsAddEnterpriseModalOpen(false);
    setNewEnterprise({});
  };

  // Filter enterprises based on search query
  const filteredEnterprises = enterprises.filter(enterprise =>
    enterprise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter assets based on search query
  const filteredAssets = assets.filter(asset =>
    asset.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getComplianceIcon = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case ComplianceStatus.WARNING:
        return <AlertTriangle size={16} className="text-amber-600" />;
      case ComplianceStatus.NON_COMPLIANT:
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getComplianceColor = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.COMPLIANT:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case ComplianceStatus.WARNING:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case ComplianceStatus.NON_COMPLIANT:
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="indigo" />
          <div>
            <h3 className="font-bold text-slate-900 mb-2">碳账户与资产管理说明</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>企业碳账户：</strong>为入园企业建立碳账户，实时监测企业用电、绿电使用、碳排放等数据，帮助企业实现碳资产的数字化管理。
              建立"园区—企业—项目"三级碳账户与碳核算体系，将园区减排量转化为可管理、可估值、可交易的碳资产。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              <strong>碳资产项目库：</strong>管理园区内各类碳资产项目（如光伏、储能、节能改造等），支持项目立项、审核、上链数证化等全流程管理。
              碳资产管理流程涵盖：①碳资产登记 → ②审核与确权 → ③通证化上链 → ④碳资产评估 → ⑤内部转移与交易 → ⑥碳资产清退与注销。
              已上链的碳资产可作为数字资产进行交易、抵押等金融操作。
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>碳积分与激励模块：</strong>管理园区内的碳普惠积分（如居民或员工通过绿色行为获得的碳积分）。
              支持碳积分的生成、累积和兑换激励，记录个人或企业的低碳行为减排量，将其转化为可兑换的碳资产。
              碳积分可在园区内部流通，用于兑换数字人民币红包、优惠券等奖励，激励各方参与绿色行为。
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'assets' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            碳资产项目库
          </button>
          <button 
            onClick={() => setActiveTab('enterprises')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'enterprises' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            企业碳账户
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {activeTab === 'enterprises' ? (
            <button 
              onClick={() => setIsAddEnterpriseModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus size={18} className="mr-2" />
              新增企业
            </button>
          ) : (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <Plus size={18} className="mr-2" />
            资产立项
          </button>
          )}
        </div>
      </div>

      {activeTab === 'enterprises' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredEnterprises.map((enterprise) => (
            <div key={enterprise.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
              {/* Header with Logo and Status */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-lg bg-white border-2 border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                      {enterprise.logo ? (
                        <img 
                          src={enterprise.logo} 
                          alt={enterprise.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${enterprise.logo ? 'hidden' : ''} ${
                        enterprise.complianceStatus === ComplianceStatus.COMPLIANT ? 'bg-emerald-100 text-emerald-700' :
                        enterprise.complianceStatus === ComplianceStatus.WARNING ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {enterprise.name.charAt(0)}
                      </div>
                    </div>
                    {/* Company Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2 leading-tight">{enterprise.name}</h3>
                      {enterprise.industry && (
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{enterprise.industry}</span>
                      )}
                    </div>
                  </div>
                  {/* Compliance Status */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${getComplianceColor(enterprise.complianceStatus)}`}>
                    {getComplianceIcon(enterprise.complianceStatus)}
                    <span>{enterprise.complianceStatus}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">总用电量</p>
                    <p className="text-lg font-bold text-slate-900">{enterprise.totalElectricityConsumption.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">KWH</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">持有限额度</p>
                    <p className="text-lg font-bold text-emerald-600">{enterprise.holdingQuota.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-0.5">配额</p>
                  </div>
                </div>

                {/* Green Electricity Ratio */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">绿电占比</span>
                    <span className="text-sm font-bold text-emerald-600">{enterprise.greenElectricityRatio}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 cursor-pointer hover:from-emerald-500 hover:to-emerald-700"
                      style={{ width: `${enterprise.greenElectricityRatio}%` }}
                      title={`绿电占比: ${enterprise.greenElectricityRatio}%`}
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {enterprise.address && (
                    <div className="flex items-start gap-2 text-xs text-slate-600">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                      <span className="line-clamp-1">{enterprise.address}</span>
                    </div>
                  )}
                  {enterprise.employeeCount && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Cpu size={14} className="text-slate-400" />
                      <span>员工: {enterprise.employeeCount}人</span>
                    </div>
                  )}
                  {(enterprise.carbonEmission || enterprise.carbonReduction) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {enterprise.carbonEmission && (
                        <div className="text-slate-600">
                          <span className="text-slate-400">碳排放: </span>
                          <span className="font-semibold text-red-600">{enterprise.carbonEmission.toLocaleString()} t</span>
                        </div>
                      )}
                      {enterprise.carbonReduction && (
                        <div className="text-slate-600">
                          <span className="text-slate-400">碳减排: </span>
                          <span className="font-semibold text-emerald-600">{enterprise.carbonReduction.toLocaleString()} t</span>
                        </div>
                      )}
                    </div>
                  )}
                  {enterprise.contactPerson && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-slate-400">联系人: </span>
                      <span>{enterprise.contactPerson}</span>
                      {enterprise.contactPhone && <span className="text-slate-400">•</span>}
                      {enterprise.contactPhone && <span>{enterprise.contactPhone}</span>}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => {
                    setSelectedEnterprise(enterprise);
                    setIsEnterpriseDetailModalOpen(true);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm group-hover:bg-emerald-600 group-hover:shadow-md"
                >
                  <span>查看详情</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
          {filteredEnterprises.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-400 text-lg">
                {searchQuery ? '未找到匹配的企业' : '暂无企业数据'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-400 text-lg">
                {searchQuery ? '未找到匹配的资产' : '暂无资产数据'}
              </p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-md uppercase bg-slate-100 text-slate-700`}>
                  {asset.category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border 
                  ${asset.status === AssetStatus.TOKENIZED ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                    asset.status === AssetStatus.AUDITED ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    asset.status === AssetStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {asset.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{asset.projectName}</h3>
              <div className="flex flex-col gap-1 mb-4 text-xs text-slate-500">
                 <div className="flex items-center gap-1"><MapPin size={12}/> {asset.location}</div>
                 <div className="flex items-center gap-1"><Cpu size={12}/> 设备ID: {asset.deviceId || '未绑定'}</div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">预计减排量</p>
                  <p className="text-xl font-bold text-emerald-600">{asset.amount} <span className="text-sm font-normal">tCO2e</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">基线排放</p>
                  <p className="text-sm font-medium text-slate-900">{asset.baselineEmission} t</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                 {asset.status === AssetStatus.AUDITED && (
                    <button 
                      onClick={() => handleOpenMintModal(asset)}
                      disabled={processingId === asset.id}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 text-sm rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center"
                    >
                      {processingId === asset.id ? (
                        <><Loader2 size={16} className="animate-spin mr-2" />上链中...</>
                      ) : (
                        <><Gem size={16} className="mr-2" />资产数证化</>
                      )}
                    </button>
                 )}
                 {(asset.status === AssetStatus.TOKENIZED || asset.status === AssetStatus.PLEDGED) && (
                    <button 
                      onClick={() => {
                        setSelectedAssetForDetail(asset);
                        setIsTokenDetailModalOpen(true);
                      }}
                      className="flex-1 bg-purple-50 text-purple-700 border border-purple-200 py-2 text-sm rounded-lg hover:bg-purple-100 flex items-center justify-center"
                    >
                      <ShieldCheck size={16} className="mr-2" />
                      查看凭证 {asset.tokenId}
                    </button>
                 )}
              </div>
            </div>
            ))
          )}
        </div>
      )}

      {/* Add Enterprise Modal */}
      {isAddEnterpriseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-indigo-900">新增企业</h3>
              <button onClick={() => setIsAddEnterpriseModalOpen(false)}>
                <X size={20} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleSubmitNewEnterprise} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">企业名称 *</label>
                <input 
                  required 
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="例如：某某制造有限公司" 
                  value={newEnterprise.name || ''}
                  onChange={e => setNewEnterprise({...newEnterprise, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">行业类型</label>
                  <input 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="例如：精密制造"
                    value={newEnterprise.industry || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, industry: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">企业Logo URL</label>
                  <input 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-xs" 
                    placeholder="图片链接（可选）"
                    value={newEnterprise.logo || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, logo: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">企业地址</label>
                <input 
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="例如：零碳园区A区1号"
                  value={newEnterprise.address || ''}
                  onChange={e => setNewEnterprise({...newEnterprise, address: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">总用电量 (KWH) *</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0"
                    value={newEnterprise.totalElectricityConsumption || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, totalElectricityConsumption: parseFloat(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">绿电占比 (%) *</label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    max="100"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0-100"
                    value={newEnterprise.greenElectricityRatio || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, greenElectricityRatio: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">持有限额度 *</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0"
                    value={newEnterprise.holdingQuota || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, holdingQuota: parseFloat(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">员工数量</label>
                  <input 
                    type="number" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0"
                    value={newEnterprise.employeeCount || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, employeeCount: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">碳排放量 (tCO2e)</label>
                  <input 
                    type="number" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0"
                    value={newEnterprise.carbonEmission || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, carbonEmission: parseFloat(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">碳减排量 (tCO2e)</label>
                  <input 
                    type="number" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="0"
                    value={newEnterprise.carbonReduction || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, carbonReduction: parseFloat(e.target.value)})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">合规状态 *</label>
                <select 
                  required
                  className="w-full border p-2 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newEnterprise.complianceStatus || ''}
                  onChange={e => setNewEnterprise({...newEnterprise, complianceStatus: e.target.value as ComplianceStatus})}
                >
                  <option value="">请选择...</option>
                  <option value={ComplianceStatus.COMPLIANT}>合规</option>
                  <option value={ComplianceStatus.WARNING}>预警</option>
                  <option value={ComplianceStatus.NON_COMPLIANT}>不合规</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">联系人</label>
                  <input 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="姓名"
                    value={newEnterprise.contactPerson || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, contactPerson: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                  <input 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="手机号"
                    value={newEnterprise.contactPhone || ''}
                    onChange={e => setNewEnterprise({...newEnterprise, contactPhone: e.target.value})} 
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold mt-2 hover:bg-indigo-700 transition-colors">
                保存到企业碳账户
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">新增碳资产立项</h3>
                <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
              </div>
              <form onSubmit={handleSubmitNewAsset} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">资产名称 *</label>
                    <input required className="w-full border p-2 rounded-lg" placeholder="例如：二期屋顶光伏电站" onChange={e => setNewAsset({...newAsset, projectName: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">资产类型</label>
                      <input className="w-full border p-2 rounded-lg" placeholder="光伏/储能..." onChange={e => setNewAsset({...newAsset, category: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">预计减排量 (t)</label>
                      <input type="number" className="w-full border p-2 rounded-lg" onChange={e => setNewAsset({...newAsset, amount: parseFloat(e.target.value)})} />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">设备/计量点 ID</label>
                    <input className="w-full border p-2 rounded-lg" placeholder="例如：PV-INV-002" onChange={e => setNewAsset({...newAsset, deviceId: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">位置</label>
                    <input className="w-full border p-2 rounded-lg" placeholder="园区位置..." onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold mt-2">保存到碳资产台账</button>
              </form>
           </div>
        </div>
      )}

      {/* Mint Modal */}
      {isMintModalOpen && selectedAssetForMint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                <h3 className="font-bold text-lg text-emerald-900 flex items-center">
                  <Gem size={20} className="mr-2" /> 资产上链数证化
                </h3>
              </div>
              <div className="p-6">
                 <p className="text-sm text-slate-600 mb-4">
                    正在为资产 <strong>{selectedAssetForMint.projectName}</strong> 铸造链上凭证。
                 </p>
                 <label className="block text-sm font-medium text-slate-700 mb-1">数证化数量 (tCO2e)</label>
                 <input 
                   type="number" 
                   value={mintVolume} 
                   onChange={e => setMintVolume(parseFloat(e.target.value))}
                   className="w-full border border-slate-300 rounded-lg p-3 text-lg font-mono mb-4 focus:ring-2 focus:ring-emerald-500 outline-none" 
                 />
                 <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 mb-6">
                    说明：点击确认后，将调用联盟链合约生成 NFT，并写入区块账本。
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setIsMintModalOpen(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
                    <button onClick={confirmMint} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">确认上链</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Token Detail Modal */}
      {isTokenDetailModalOpen && selectedAssetForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center">
                <ShieldCheck size={20} className="mr-2" /> 链上数字资产凭证详情
              </h3>
              <button onClick={() => setIsTokenDetailModalOpen(false)}>
                <X size={20} className="text-white/80 hover:text-white" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Asset Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                  <Gem size={18} className="mr-2 text-purple-600" />
                  资产基本信息
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">项目名称</span>
                    <p className="font-semibold text-slate-900">{selectedAssetForDetail.projectName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">资产类型</span>
                    <p className="font-semibold text-slate-900">{selectedAssetForDetail.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">减排量</span>
                    <p className="font-semibold text-emerald-600">{selectedAssetForDetail.amount} tCO2e</p>
                  </div>
                  <div>
                    <span className="text-slate-500">评估价值</span>
                    <p className="font-semibold text-slate-900">¥ {selectedAssetForDetail.estimatedValue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Blockchain Info */}
              <div className="bg-slate-900 rounded-xl p-4 text-white">
                <h4 className="font-bold mb-3 flex items-center">
                  <Link size={18} className="mr-2 text-emerald-400" />
                  区块链信息
                </h4>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">数证ID (Token ID)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{selectedAssetForDetail.tokenId || 'T-882910'}</span>
                      <button className="p-1 hover:bg-slate-800 rounded" onClick={() => navigator.clipboard.writeText(selectedAssetForDetail.tokenId || '')}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">合约地址</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">0x7f3a...3a2b</span>
                      <button className="p-1 hover:bg-slate-800 rounded" onClick={() => navigator.clipboard.writeText('0x7f3a...3a2b')}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">区块高度</span>
                    <span className="text-white">#12,054</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">区块哈希</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">0x7f3a...3a2b</span>
                      <button className="p-1 hover:bg-slate-800 rounded" onClick={() => navigator.clipboard.writeText('0x7f3a...3a2b')}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">数证标准</span>
                    <span className="text-white">ERC-721 (NFT)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">验证状态</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 size={14} />
                      已验证
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">元数据信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">元数据URI</span>
                    <span className="font-mono text-xs text-slate-700">ipfs://QmXx...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">审定报告</span>
                    <button className="text-emerald-600 hover:underline flex items-center gap-1">
                      查看报告 <ExternalLink size={12} />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">创建时间</span>
                    <span className="text-slate-700">{selectedAssetForDetail.creationDate}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center">
                  <QrCode size={18} className="mr-2" />
                  生成凭证二维码
                </button>
                <button className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 flex items-center justify-center">
                  <ExternalLink size={18} className="mr-2" />
                  在区块链浏览器查看
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Detail Modal */}
      {isEnterpriseDetailModalOpen && selectedEnterprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsEnterpriseDetailModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedEnterprise.logo ? (
                    <img src={selectedEnterprise.logo} alt={selectedEnterprise.name} className="w-16 h-16 rounded-lg bg-white/20 p-2 object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {selectedEnterprise.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selectedEnterprise.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-indigo-100">
                      {selectedEnterprise.industry && <span>{selectedEnterprise.industry}</span>}
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${getComplianceColor(selectedEnterprise.complianceStatus)} px-2 py-0.5 rounded-full bg-white/20`}>
                        {getComplianceIcon(selectedEnterprise.complianceStatus)}
                        {selectedEnterprise.complianceStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsEnterpriseDetailModalOpen(false)}>
                  <X size={24} className="text-white/80 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <InfoIcon color="indigo" />
                  <div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">企业碳账户说明：</strong>
                      企业碳账户是零碳园区为入园企业建立的碳排放与碳资产管理账户。通过实时监测企业用电、绿电使用、碳排放等数据，
                      帮助企业实现碳资产的数字化管理，支持碳交易、碳金融等业务场景。
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <Zap size={20} className="text-emerald-600" />
                    <span className="text-xs text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded">总用电量</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900">{selectedEnterprise.totalElectricityConsumption.toLocaleString()}</p>
                  <p className="text-xs text-emerald-700 mt-1">KWH</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    <span className="text-xs text-blue-700 bg-blue-200 px-2 py-0.5 rounded">绿电占比</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{selectedEnterprise.greenElectricityRatio}%</p>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedEnterprise.greenElectricityRatio}%` }}></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck size={20} className="text-purple-600" />
                    <span className="text-xs text-purple-700 bg-purple-200 px-2 py-0.5 rounded">持有限额度</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{selectedEnterprise.holdingQuota.toLocaleString()}</p>
                  <p className="text-xs text-purple-700 mt-1">配额单位</p>
                </div>
                {selectedEnterprise.employeeCount && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <Users size={20} className="text-amber-600" />
                      <span className="text-xs text-amber-700 bg-amber-200 px-2 py-0.5 rounded">员工数</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-900">{selectedEnterprise.employeeCount}</p>
                    <p className="text-xs text-amber-700 mt-1">人</p>
                  </div>
                )}
              </div>

              {/* Detailed Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                    <Building2 size={18} className="mr-2 text-indigo-600" />
                    基本信息
                  </h4>
                  <div className="space-y-3">
                    {selectedEnterprise.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">企业地址</p>
                          <p className="text-sm font-medium text-slate-900">{selectedEnterprise.address}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">注册日期</p>
                        <p className="text-sm font-medium text-slate-900">{selectedEnterprise.registrationDate}</p>
                      </div>
                    </div>
                    {selectedEnterprise.contactPerson && (
                      <div className="flex items-start gap-2">
                        <Users size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">联系人</p>
                          <p className="text-sm font-medium text-slate-900">{selectedEnterprise.contactPerson}</p>
                        </div>
                      </div>
                    )}
                    {selectedEnterprise.contactPhone && (
                      <div className="flex items-start gap-2">
                        <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">联系电话</p>
                          <p className="text-sm font-medium text-slate-900">{selectedEnterprise.contactPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carbon Data */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                    <BarChart3 size={18} className="mr-2 text-emerald-600" />
                    碳排放数据
                  </h4>
                  <div className="space-y-3">
                    {selectedEnterprise.carbonEmission !== undefined && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <p className="text-xs text-red-600 mb-1">碳排放量</p>
                        <p className="text-xl font-bold text-red-700">{selectedEnterprise.carbonEmission.toLocaleString()} <span className="text-sm font-normal">tCO2e</span></p>
                      </div>
                    )}
                    {selectedEnterprise.carbonReduction !== undefined && (
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                        <p className="text-xs text-emerald-600 mb-1">碳减排量</p>
                        <p className="text-xl font-bold text-emerald-700">{selectedEnterprise.carbonReduction.toLocaleString()} <span className="text-sm font-normal">tCO2e</span></p>
                      </div>
                    )}
                    {selectedEnterprise.carbonEmission !== undefined && selectedEnterprise.carbonReduction !== undefined && (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">净排放量</p>
                        <p className={`text-xl font-bold ${(selectedEnterprise.carbonEmission - selectedEnterprise.carbonReduction) > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                          {(selectedEnterprise.carbonEmission - selectedEnterprise.carbonReduction).toLocaleString()} <span className="text-sm font-normal">tCO2e</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Compliance Status Detail */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <ShieldCheck size={18} className="mr-2 text-indigo-600" />
                  合规状态说明
                </h4>
                <div className={`p-4 rounded-lg border ${getComplianceColor(selectedEnterprise.complianceStatus)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getComplianceIcon(selectedEnterprise.complianceStatus)}
                    <span className="font-semibold">{selectedEnterprise.complianceStatus}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedEnterprise.complianceStatus === ComplianceStatus.COMPLIANT && 
                      '该企业碳排放数据符合园区零碳标准，绿电使用率和减排措施达到要求。'}
                    {selectedEnterprise.complianceStatus === ComplianceStatus.WARNING && 
                      '该企业碳排放数据接近预警线，建议加强绿电使用或采取更多减排措施。'}
                    {selectedEnterprise.complianceStatus === ComplianceStatus.NON_COMPLIANT && 
                      '该企业碳排放数据超出园区标准，需要立即采取减排措施。'}
                  </p>
                </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CarbonAccounts;
