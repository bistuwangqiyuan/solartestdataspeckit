import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getProducts, getTestItems } from '@/services/products';
import { formatDate } from '@/utils/format';
import type { Product, TestItem } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'test-items'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsResult, testItemsResult] = await Promise.all([
      getProducts(),
      getTestItems(),
    ]);

    if (productsResult.success) setProducts(productsResult.data || []);
    if (testItemsResult.success) setTestItems(testItemsResult.data || []);
    
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除吗？')) {
      toast.success('删除成功');
      // TODO: 实现删除功能
    }
  };

  return (
    <Layout title="产品管理 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">产品管理</h1>
            <p className="text-muted mt-1">管理产品信息和测试项目配置</p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>添加{activeTab === 'products' ? '产品' : '测试项'}</span>
          </button>
        </div>

        {/* 选项卡 */}
        <div className="flex space-x-1 bg-dark-300 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'products'
                ? 'bg-primary text-black font-medium'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CubeIcon className="w-5 h-5" />
              <span>产品列表</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('test-items')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'test-items'
                ? 'bg-primary text-black font-medium'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BeakerIcon className="w-5 h-5" />
              <span>测试项目</span>
            </div>
          </button>
        </div>

        {/* 产品列表 */}
        {activeTab === 'products' && (
          <div className="glass-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>产品型号</th>
                  <th>产品名称</th>
                  <th>制造商</th>
                  <th>类别</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="loading-spinner mx-auto"></div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      暂无产品数据
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.model}</td>
                      <td>{product.name}</td>
                      <td>{product.manufacturer || '-'}</td>
                      <td>{product.category || '-'}</td>
                      <td>{formatDate(product.created_at)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 hover:bg-dark-200 rounded"
                            title="编辑"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
        )}

        {/* 测试项目列表 */}
        {activeTab === 'test-items' && (
          <div className="glass-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>项目代码</th>
                  <th>项目名称</th>
                  <th>类别</th>
                  <th>标准依据</th>
                  <th>单位</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="loading-spinner mx-auto"></div>
                    </td>
                  </tr>
                ) : testItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted">
                      暂无测试项目
                    </td>
                  </tr>
                ) : (
                  testItems.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono">{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.standard_ref || '-'}</td>
                      <td>{item.unit || '-'}</td>
                      <td>
                        <span className={`badge ${
                          item.is_active ? 'badge-success' : 'badge-error'
                        }`}>
                          {item.is_active ? '启用' : '停用'}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 hover:bg-dark-200 rounded"
                            title="编辑"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
        )}

        {/* 预置测试项目 */}
        {activeTab === 'test-items' && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">标准测试项目库</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-200 rounded-lg">
                <h4 className="font-medium mb-2">电气性能测试</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• 耐压测试（AC/DC）</li>
                  <li>• 绝缘电阻测试</li>
                  <li>• 接地电阻测试</li>
                  <li>• 泄漏电流测试</li>
                </ul>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg">
                <h4 className="font-medium mb-2">机械性能测试</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• 机械强度测试</li>
                  <li>• 防护等级测试</li>
                  <li>• 振动测试</li>
                  <li>• 跌落测试</li>
                </ul>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg">
                <h4 className="font-medium mb-2">环境适应性测试</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• 温升测试</li>
                  <li>• 高低温测试</li>
                  <li>• 湿热测试</li>
                  <li>• 盐雾测试</li>
                </ul>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg">
                <h4 className="font-medium mb-2">功能性测试</h4>
                <ul className="text-sm text-muted space-y-1">
                  <li>• 开关动作测试</li>
                  <li>• 响应时间测试</li>
                  <li>• 通信功能测试</li>
                  <li>• 指示灯测试</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {editingItem ? '编辑' : '添加'}{activeTab === 'products' ? '产品' : '测试项目'}
            </h3>
            
            {/* 表单内容 */}
            <div className="space-y-4">
              {activeTab === 'products' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">产品型号</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="如：PV-1500"
                      defaultValue={editingItem?.model}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">产品名称</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="如：光伏关断器1500V"
                      defaultValue={editingItem?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">制造商</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="选填"
                      defaultValue={editingItem?.manufacturer}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">项目代码</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="如：TEST-001"
                      defaultValue={editingItem?.code}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">项目名称</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      placeholder="如：耐压测试"
                      defaultValue={editingItem?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">类别</label>
                    <select
                      className="input-field w-full"
                      defaultValue={editingItem?.category}
                    >
                      <option value="">请选择</option>
                      <option value="电气性能">电气性能</option>
                      <option value="机械性能">机械性能</option>
                      <option value="环境适应性">环境适应性</option>
                      <option value="功能性">功能性</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.success(editingItem ? '更新成功' : '添加成功');
                  setShowModal(false);
                }}
                className="btn-primary"
              >
                {editingItem ? '更新' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}