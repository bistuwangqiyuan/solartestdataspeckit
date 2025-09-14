import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  requireAuth?: boolean;
}

export default function Layout({ 
  children, 
  title = 'PV-SDM - 光伏关断器实验数据管理系统',
  requireAuth = true 
}: LayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuth(requireAuth);
  const { sidebarOpen } = useStore();

  // 登录页面不需要布局
  if (router.pathname === '/login') {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="光伏关断器实验数据管理系统" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="光伏关断器实验数据管理系统" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen bg-background text-foreground">
        {/* 侧边栏 */}
        <Sidebar />

        {/* 主内容区 */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}>
          {/* 顶部导航 */}
          <Header />

          {/* 页面内容 */}
          <main className="flex-1 overflow-y-auto bg-dark-400 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}