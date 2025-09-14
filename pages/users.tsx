import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { formatDate, formatRole } from '@/utils/format';
import type { User } from '@/types';
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '系统管理员',
    role: 'admin',
    department: '信息技术部',
    is_active: true,
    created_at: '2025-01-01',
  },
  {
    id: '2',
    email: 'zhangsan@example.com',
    name: '张三',
    role: 'operator',
    department: '质检部',
    is_active: true,
    created_at: '2025-01-05',
  },
  {
    id: '3',
    email: 'lisi@example.com',
    name: '李四',
    role: 'operator',
    department: '质检部',
    is_active: true,
    created_at: '2025-01-06',
  },
  {
    id: '4',
    email: 'wangwu@example.com',
    name: '王五',
    role: 'viewer',
    department: '生产部',
    is_active: true,
    created_at: '2025-01-10',
  },
  {
    id: '5',
    email: 'zhaoliu@example.com',
    name: '赵六',
    role: 'viewer',
    department: '管理部',
    is_active: false,
    created_at: '2025-01-08',
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该用户吗？')) {
      toast.success('用户删除成功');
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const handleToggleStatus = (user: User) => {
    toast.success(`用户已${user.is_active ? '停用' : '启用'}`);
  };

  return (
    <Layout title="用户管理 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">用户管理</h1>
            <p className="text-muted mt-1">管理系统用户和权限</p>
          </div>
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>添加用户</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <p className="text-sm text-muted">总用户数</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted">活跃用户</p>
            <p className="text-2xl font-bold text-success">
              {users.filter(u => u.is_active).length}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted">管理员</p>
            <p className="text-2xl font-bold text-primary">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted">操作员</p>
            <p className="text-2xl font-bold text-secondary">
              {users.filter(u => u.role === 'operator').length}
            </p>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="glass-card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>部门</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-error' :
                      user.role === 'operator' ? 'badge-warning' :
                      'badge-success'
                    }`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className="flex items-center space-x-1"
                    >
                      {user.is_active ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 text-success" />
                          <span className="text-success">启用</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-4 h-4 text-error" />
                          <span className="text-error">停用</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 hover:bg-dark-200 rounded"
                        title="编辑"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1 hover:bg-dark-200 rounded"
                        title="重置密码"
                      >
                        <KeyIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 hover:bg-dark-200 rounded text-error"
                        title="删除"
                        disabled={user.role === 'admin'}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 权限说明 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">角色权限说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-error mb-2">管理员 (Admin)</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• 完全系统访问权限</li>
                <li>• 用户管理</li>
                <li>• 系统配置</li>
                <li>• 数据删除权限</li>
                <li>• 所有功能模块访问</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-warning mb-2">操作员 (Operator)</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• 数据录入和编辑</li>
                <li>• 测试记录管理</li>
                <li>• 报表查看</li>
                <li>• 数据导入导出</li>
                <li>• 不能删除数据</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-success mb-2">查看者 (Viewer)</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• 只读访问权限</li>
                <li>• 查看测试数据</li>
                <li>• 查看报表</li>
                <li>• 查看仪表盘</li>
                <li>• 不能修改任何数据</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 用户编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {editingUser ? '编辑用户' : '添加用户'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="请输入姓名"
                  defaultValue={editingUser?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">邮箱</label>
                <input
                  type="email"
                  className="input-field w-full"
                  placeholder="请输入邮箱"
                  defaultValue={editingUser?.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">角色</label>
                <select
                  className="input-field w-full"
                  defaultValue={editingUser?.role || 'viewer'}
                >
                  <option value="admin">管理员</option>
                  <option value="operator">操作员</option>
                  <option value="viewer">查看者</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">部门</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="请输入部门"
                  defaultValue={editingUser?.department}
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-2">初始密码</label>
                  <input
                    type="password"
                    className="input-field w-full"
                    placeholder="请输入初始密码"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.success(editingUser ? '用户更新成功' : '用户添加成功');
                  setShowModal(false);
                }}
                className="btn-primary"
              >
                {editingUser ? '更新' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重置密码模态框 */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">重置密码</h3>
            <p className="text-sm text-muted mb-4">
              为用户 <span className="font-medium text-foreground">{selectedUser.name}</span> 重置密码
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">新密码</label>
                <input
                  type="password"
                  className="input-field w-full"
                  placeholder="请输入新密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">确认密码</label>
                <input
                  type="password"
                  className="input-field w-full"
                  placeholder="请再次输入密码"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => {
                  toast.success('密码重置成功');
                  setShowPasswordModal(false);
                }}
                className="btn-primary"
              >
                重置密码
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}