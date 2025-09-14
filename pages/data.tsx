import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getTestRecords } from '@/services/testRecords';
import { getProducts } from '@/services/products';
import { getTestItems } from '@/services/products';
import { formatDateTime, formatTestResult } from '@/utils/format';
import type { TestRecord, QueryFilters, SortParams } from '@/types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DataPage() {
  const [testRecords, setTestRecords] = useState<TestRecord[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [testItems, setTestItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  
  // 过滤器状态
  const [filters, setFilters] = useState<QueryFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 排序状态
  const [sort, setSort] = useState<SortParams>({
    field: 'test_date',
    order: 'desc',
  });

  useEffect(() => {
    loadData();
  }, [page, filters, sort]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getTestRecords(
      filters,
      sort,
      { page, limit }
    );
    
    if (result.success) {
      setTestRecords(result.data || []);
      setTotal(result.total);
    } else {
      toast.error('加载数据失败');
    }
    setLoading(false);
  };

  const loadOptions = async () => {
    const [productsResult, testItemsResult] = await Promise.all([
      getProducts(),
      getTestItems(),
    ]);

    if (productsResult.success) setProducts(productsResult.data || []);
    if (testItemsResult.success) setTestItems(testItemsResult.data || []);
  };

  const handleSearch = () => {
    if (searchTerm) {
      setFilters({ ...filters, deviceSn: searchTerm });
    } else {
      const { deviceSn, ...rest } = filters;
      setFilters(rest);
    }
    setPage(1);
  };

  const handleSort = (field: string) => {
    setSort({
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleExport = () => {
    // TODO: 实现导出功能
    toast.success('导出功能开发中...');
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout title="数据管理 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">数据管理</h1>
            <p className="text-muted mt-1">查看和管理所有测试记录</p>
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>导出数据</span>
          </button>
        </div>

        {/* 搜索和过滤 */}
        <div className="glass-card p-4">
          <div className="flex items-center space-x-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索设备序列号..."
                className="input-field w-full pl-10"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-muted" />
            </div>
            
            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              搜索
            </button>

            {/* 过滤器按钮 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>过滤器</span>
            </button>
          </div>

          {/* 过滤器面板 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">产品型号</label>
                <select
                  value={filters.productId || ''}
                  onChange={(e) => setFilters({ ...filters, productId: e.target.value || undefined })}
                  className="input-field w-full"
                >
                  <option value="">全部</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.model} - {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">测试项目</label>
                <select
                  value={filters.testItemId || ''}
                  onChange={(e) => setFilters({ ...filters, testItemId: e.target.value || undefined })}
                  className="input-field w-full"
                >
                  <option value="">全部</option>
                  {testItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">测试结果</label>
                <select
                  value={filters.result || ''}
                  onChange={(e) => setFilters({ ...filters, result: e.target.value as any || undefined })}
                  className="input-field w-full"
                >
                  <option value="">全部</option>
                  <option value="PASS">合格</option>
                  <option value="FAIL">不合格</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 数据表格 */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th 
                    className="cursor-pointer hover:bg-dark-200"
                    onClick={() => handleSort('test_date')}
                  >
                    测试时间
                    {sort.field === 'test_date' && (
                      <span className="ml-1">{sort.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="cursor-pointer hover:bg-dark-200"
                    onClick={() => handleSort('device_sn')}
                  >
                    设备序列号
                    {sort.field === 'device_sn' && (
                      <span className="ml-1">{sort.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th>产品型号</th>
                  <th>测试项目</th>
                  <th>测试值</th>
                  <th>测试结果</th>
                  <th>操作员</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <div className="loading-spinner mx-auto"></div>
                    </td>
                  </tr>
                ) : testRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  testRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{formatDateTime(record.test_date)}</td>
                      <td className="font-mono">{record.device_sn}</td>
                      <td>{record.product?.model || '-'}</td>
                      <td>{record.test_item?.name || '-'}</td>
                      <td>
                        <code className="text-xs">
                          {JSON.stringify(record.test_value, null, 2)}
                        </code>
                      </td>
                      <td>
                        <span className={`badge ${
                          record.result === 'PASS' ? 'badge-success' : 'badge-error'
                        }`}>
                          {formatTestResult(record.result)}
                        </span>
                      </td>
                      <td>{record.operator?.name || '-'}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button 
                            className="p-1 hover:bg-dark-200 rounded"
                            title="编辑"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1 hover:bg-dark-200 rounded text-error"
                            title="删除"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted">
                共 {total} 条记录，第 {page} / {totalPages} 页
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}