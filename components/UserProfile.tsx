import React from 'react';
import { UserCircle, Mail, Phone, Building2, Calendar, ShieldCheck, CreditCard, FileText, Settings, LogOut, Edit2, CheckCircle2 } from 'lucide-react';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  // Mock user data
  const userData = {
    name: '管理员',
    role: '园区运营部',
    email: 'admin@zerocarbon.cn',
    phone: '138****8888',
    department: '零碳园区运营管理部',
    joinDate: '2023-01-15',
    permissions: ['资产管理', '企业审核', '交易审批', '数据查看'],
    walletBalance: 1240500.00,
    totalAssets: 3420,
    activeLoans: 1
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center">
              <UserCircle size={28} className="mr-3" />
              个人中心
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <LogOut size={20} className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserCircle size={48} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{userData.name}</h3>
                    <p className="text-slate-600 flex items-center gap-2">
                      <Building2 size={16} />
                      {userData.role}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Edit2 size={16} />
                    编辑资料
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 size={16} className="text-slate-400" />
                    <span>{userData.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    <span>加入时间: {userData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">数字人民币余额</p>
                <CreditCard size={20} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">¥ {userData.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">碳资产总数</p>
                <FileText size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{userData.totalAssets.toLocaleString()}</h3>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">活跃贷款</p>
                <CreditCard size={20} className="text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{userData.activeLoans}</h3>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center">
              <ShieldCheck size={20} className="mr-2 text-indigo-600" />
              权限范围
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {userData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-900">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2">
              <Settings size={18} />
              系统设置
            </button>
            <button className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
              <FileText size={18} />
              操作日志
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

