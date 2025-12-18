/**
 * API 使用示例
 * 这个文件展示了如何在 React 组件中使用 API
 */

import { api } from './index';
import type { CarbonAsset, Enterprise } from '../types';

// ==================== 示例 1: 在组件中使用认证 API ====================
export const loginExample = async (username: string, password: string) => {
  try {
    const response = await api.auth.login({ username, password });
    if (response.code === 200) {
      console.log('登录成功', response.data.user);
      return response.data;
    }
  } catch (error: any) {
    console.error('登录失败:', error.message);
    throw error;
  }
};

// ==================== 示例 2: 获取碳资产列表 ====================
export const getCarbonAssetsExample = async () => {
  try {
    const response = await api.carbonAssets.getAll({
      page: 1,
      limit: 10,
    });
    
    if (response.code === 200) {
      const assets: CarbonAsset[] = response.data.items;
      console.log('获取到', assets.length, '个资产');
      return assets;
    }
  } catch (error: any) {
    console.error('获取资产失败:', error.message);
    throw error;
  }
};

// ==================== 示例 3: 创建新资产 ====================
export const createAssetExample = async () => {
  try {
    const newAsset = await api.carbonAssets.create({
      projectName: '新光伏电站',
      category: '光伏发电',
      location: '园区A区',
      deviceId: 'PV-001',
      baselineEmission: 10000,
      amount: 8000,
      unit: 'tCO2e/年',
      owner: '园区运营主体',
      estimatedValue: 480000,
    });
    
    console.log('资产创建成功:', newAsset.data);
    return newAsset.data;
  } catch (error: any) {
    console.error('创建资产失败:', error.message);
    throw error;
  }
};

// ==================== 示例 4: 在 React 组件中使用 ====================
/*
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import type { CarbonAsset } from '../types';

const CarbonAssetsList: React.FC = () => {
  const [assets, setAssets] = useState<CarbonAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.carbonAssets.getAll();
      if (response.code === 200) {
        setAssets(response.data.items);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async () => {
    try {
      const response = await api.carbonAssets.create({
        projectName: '新项目',
        category: '光伏发电',
        location: '园区',
        deviceId: 'DEV-001',
        baselineEmission: 10000,
        amount: 8000,
        unit: 'tCO2e/年',
        owner: '园区运营主体',
      });
      
      if (response.code === 200) {
        // 刷新列表
        loadAssets();
      }
    } catch (err: any) {
      console.error('创建失败:', err);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateAsset}>创建新资产</button>
      <ul>
        {assets.map(asset => (
          <li key={asset.id}>{asset.projectName}</li>
        ))}
      </ul>
    </div>
  );
};
*/

// ==================== 示例 5: 错误处理 ====================
export const errorHandlingExample = async () => {
  try {
    const response = await api.carbonAssets.getById('non-existent-id');
    return response.data;
  } catch (error: any) {
    // 根据错误码处理不同情况
    if (error.code === 404) {
      console.error('资产不存在');
    } else if (error.code === 401) {
      console.error('未授权，请重新登录');
      // 可以在这里触发重新登录流程
    } else if (error.code === 500) {
      console.error('服务器错误');
    } else {
      console.error('未知错误:', error.message);
    }
    throw error;
  }
};

// ==================== 示例 6: 批量操作 ====================
export const batchOperationsExample = async () => {
  try {
    // 并行获取多个数据
    const [assetsResponse, enterprisesResponse, statsResponse] = await Promise.all([
      api.carbonAssets.getAll(),
      api.enterprises.getAll(),
      api.dashboard.getStats(),
    ]);

    return {
      assets: assetsResponse.data.items,
      enterprises: enterprisesResponse.data.items,
      stats: statsResponse.data,
    };
  } catch (error: any) {
    console.error('批量操作失败:', error);
    throw error;
  }
};

