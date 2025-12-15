
import React, { useState } from 'react';
import { Blocks, Link, ShieldCheck, Database, Server, Search, Copy, CheckCircle2, AlertCircle, Clock, Users, FileText, Eye, Sparkles } from 'lucide-react';

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
import { BlockData } from '../types';

interface BlockchainViewProps {
  blocks: BlockData[];
}

const BlockchainView: React.FC<BlockchainViewProps> = ({ blocks }) => {
  const [searchHash, setSearchHash] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <InfoIcon color="indigo" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">什么是区块链底账？</h3>
            <p className="text-slate-700 text-sm leading-relaxed mb-3">
              区块链底账是零碳园区碳资产数字化管理平台的核心基础设施。它采用联盟链技术，将碳资产的创建、流转、交易等关键信息永久记录在链上，确保数据的<strong className="text-indigo-700">不可篡改、可追溯、可审计</strong>。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">不可篡改</span>
                </div>
                <p className="text-xs text-slate-600">数据一旦上链，无法被修改或删除</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Link size={16} className="text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">可追溯</span>
                </div>
                <p className="text-xs text-slate-600">完整记录资产从创建到流转的全过程</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={16} className="text-purple-600" />
                  <span className="text-xs font-semibold text-slate-700">可审计</span>
                </div>
                <p className="text-xs text-slate-600">监管部门和审计机构可随时查看</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">业务链状态 (BaaS)</p>
            <h3 className="text-2xl font-bold flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              正常运行
            </h3>
            <p className="text-xs text-slate-500 mt-2">共识算法: PBFT • 节点数: 4</p>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400">联盟节点：园区运营、金融机构、监管机构、第三方核证</p>
            </div>
          </div>
          <Server className="absolute right-4 bottom-4 text-slate-800 opacity-50" size={64} />
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
               <Blocks size={20} />
             </div>
             <p className="text-slate-500 text-sm font-medium">最新区块高度</p>
           </div>
           <h3 className="text-3xl font-bold text-slate-900">#{blocks[0].height.toLocaleString()}</h3>
           <p className="text-xs text-slate-400 mt-2">区块高度反映了链上数据的总量，数值越大表示记录越多</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
               <Database size={20} />
             </div>
             <p className="text-slate-500 text-sm font-medium">累计交易笔数</p>
           </div>
           <h3 className="text-3xl font-bold text-slate-900">84,291</h3>
           <p className="text-xs text-slate-400 mt-2">包含资产上链、交易、抵押等所有链上操作</p>
        </div>
      </div>

      {/* Search Block */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索区块哈希值或区块高度..."
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchHash) {
                const found = blocks.find(b => 
                  b.hash.toLowerCase().includes(searchHash.toLowerCase()) || 
                  b.height.toString().includes(searchHash)
                );
                if (found) {
                  setSelectedBlock(found);
                  setSearchHash('');
                }
              }
            }}
            className="flex-1 border-0 focus:ring-0 focus:outline-none text-sm"
          />
          {searchHash && (
            <>
              <button
                onClick={() => {
                  const found = blocks.find(b => 
                    b.hash.toLowerCase().includes(searchHash.toLowerCase()) || 
                    b.height.toString().includes(searchHash)
                  );
                  if (found) {
                    setSelectedBlock(found);
                    setSearchHash('');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
              >
                搜索
              </button>
              <button
                onClick={() => setSearchHash('')}
                className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm"
              >
                清除
              </button>
            </>
          )}
        </div>
      </div>

      {/* Visual Chain Representation */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Link className="mr-2 text-indigo-600" size={20} />
            最新区块与上链记录
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={16} />
            <span>实时同步 • 平均出块时间: 3秒</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">区块说明：</strong>每个区块包含一段时间内发生的所有链上操作（如资产上链、交易、抵押等）。
            区块按时间顺序连接，形成不可篡改的链式结构。点击区块可查看详细信息。
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-300 to-slate-200"></div>

          <div className="space-y-6 relative">
            {blocks.map((block, index) => (
              <div 
                key={block.height} 
                className="flex gap-6 group animate-fade-in-up cursor-pointer" 
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedBlock(block)}
              >
                {/* Node Visual */}
                <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center relative z-10 shadow-sm group-hover:border-indigo-500 group-hover:shadow-md transition-all">
                  <div className="text-xs font-bold text-indigo-900">#{block.height}</div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group-hover:border-indigo-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="font-mono text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded flex items-center gap-2 group-hover:bg-indigo-50 transition-colors">
                      哈希值: <span className="text-indigo-600">{block.hash}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(block.hash);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy size={12} className="text-slate-400 hover:text-indigo-600" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-400 mt-2 sm:mt-0 flex items-center">
                      <ShieldCheck size={14} className="mr-1 text-emerald-500" />
                      验证节点: {block.validator}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-sm text-slate-600">
                        包含 <span className="font-semibold text-slate-900">{block.transactions}</span> 笔交易
                      </p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {index === 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 animate-pulse">最新区块</span>
                        )}
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">点击查看详情</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} />
                      {block.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBlock(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center">
                <Blocks size={20} className="mr-2" />
                区块详情 #{selectedBlock.height}
              </h3>
              <button onClick={() => setSelectedBlock(null)}>
                <AlertCircle size={20} className="text-white/80 hover:text-white" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">区块高度</p>
                  <p className="text-lg font-bold text-slate-900">#{selectedBlock.height.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">交易数量</p>
                  <p className="text-lg font-bold text-slate-900">{selectedBlock.transactions} 笔</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">区块哈希值</p>
                <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-emerald-400 text-sm font-mono">{selectedBlock.hash}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedBlock.hash)}
                    className="p-2 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Copy size={16} className="text-slate-400 hover:text-emerald-400" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">验证节点</p>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-slate-900">{selectedBlock.validator}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">时间戳</p>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Clock size={16} className="text-slate-400" />
                  <span>{selectedBlock.timestamp}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">区块说明</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  此区块记录了 {selectedBlock.transactions} 笔链上操作，包括碳资产上链、交易、抵押等关键业务数据。
                  所有数据经过共识验证，确保真实性和完整性。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainView;
