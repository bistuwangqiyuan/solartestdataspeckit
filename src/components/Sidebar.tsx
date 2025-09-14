import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  HomeIcon,
  TableIcon,
  ArrowUpTrayIcon,
  ChartPieIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: '仪表盘',
    href: '/dashboard',
    icon: HomeIcon,
    permission: 'dashboard:view',
  },
  {
    name: '数据管理',
    href: '/data',
    icon: TableIcon,
    permission: 'test_records:read',
  },
  {
    name: '数据导入',
    href: '/import',
    icon: ArrowUpTrayIcon,
    permission: 'test_records:create',
  },
  {
    name: '数据分析',
    href: '/analysis',
    icon: ChartPieIcon,
    permission: 'reports:read',
  },
  {
    name: '报表中心',
    href: '/reports',
    icon: DocumentTextIcon,
    permission: 'reports:read',
  },
  {
    name: '产品管理',
    href: '/products',
    icon: CogIcon,
    permission: 'test_records:read',
  },
  {
    name: '用户管理',
    href: '/users',
    icon: UserGroupIcon,
    permission: 'admin',
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useStore();
  const { hasPermission } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <aside className={`fixed left-0 top-0 h-full bg-dark-300 border-r border-border transition-all duration-300 z-20 ${
      sidebarOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-black" />
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-primary">PV-SDM</span>
          )}
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-dark-200 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-black font-medium'
                      : 'hover:bg-dark-200 text-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Version Info */}
      {sidebarOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-center text-xs text-muted">
            <p>v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}