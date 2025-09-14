import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatRole } from '@/utils/format';
import {
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 bg-dark-300 border-b border-border flex items-center justify-between px-6">
      {/* 页面标题区域 */}
      <div>
        <h1 className="text-xl font-semibold">光伏关断器实验数据管理系统</h1>
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center space-x-4">
        {/* 通知按钮 */}
        <button className="p-2 rounded-lg hover:bg-dark-200 transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* 用户信息 */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || '用户'}</p>
            <p className="text-xs text-muted">{formatRole(user?.role || 'viewer')}</p>
          </div>
          <UserCircleIcon className="w-8 h-8 text-muted" />
        </div>

        {/* 退出按钮 */}
        <button
          onClick={signOut}
          className="p-2 rounded-lg hover:bg-dark-200 transition-colors"
          title="退出登录"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}