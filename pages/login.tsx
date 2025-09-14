import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('请填写邮箱和密码');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('登录成功');
      router.push('/dashboard');
    } else {
      toast.error(result.error || '登录失败');
    }
  };

  return (
    <>
      <Head>
        <title>登录 - PV-SDM</title>
      </Head>

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
              <ChartBarIcon className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-primary">PV-SDM</h1>
            <p className="text-muted mt-2">光伏关断器实验数据管理系统</p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="请输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 p-4 bg-dark-200 rounded-lg">
            <p className="text-sm text-muted">测试账号：</p>
            <p className="text-sm mt-1">管理员：admin@example.com / admin123</p>
            <p className="text-sm">操作员：operator@example.com / operator123</p>
            <p className="text-sm">查看者：viewer@example.com / viewer123</p>
          </div>
        </div>
      </div>
    </>
  );
}