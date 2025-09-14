import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // 获取用户详细信息
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (error) throw error;
          
          setUser(userData);
        } else if (requireAuth) {
          // 未登录且需要认证，跳转到登录页
          router.push('/login');
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (requireAuth) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          if (requireAuth) {
            router.push('/login');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [requireAuth, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // 管理员拥有所有权限
    if (user.role === 'admin') return true;
    
    // 根据角色检查权限
    const rolePermissions = {
      operator: [
        'test_records:create',
        'test_records:read',
        'test_records:update',
        'reports:read',
      ],
      viewer: [
        'test_records:read',
        'reports:read',
        'dashboard:view',
      ],
    };
    
    return rolePermissions[user.role as keyof typeof rolePermissions]?.includes(permission) || false;
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
  };
}