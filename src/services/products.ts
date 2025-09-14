import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Product, TestItem } from '@/types';

// 获取产品列表
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
    };
  }
}

// 获取单个产品
export async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 创建产品
export async function createProduct(product: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 更新产品
export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 获取测试项目列表
export async function getTestItems(category?: string) {
  try {
    let query = supabase
      .from('test_items')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
    };
  }
}

// 获取单个测试项目
export async function getTestItem(id: string) {
  try {
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 创建测试项目
export async function createTestItem(testItem: Partial<TestItem>) {
  try {
    const { data, error } = await supabase
      .from('test_items')
      .insert(testItem)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 更新测试项目
export async function updateTestItem(id: string, updates: Partial<TestItem>) {
  try {
    const { data, error } = await supabase
      .from('test_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}

// 获取测试项目分类
export async function getTestItemCategories() {
  try {
    const { data, error } = await supabase
      .from('test_items')
      .select('category')
      .eq('is_active', true);

    if (error) throw error;

    // 去重
    const categories = [...new Set(data?.map(item => item.category) || [])];

    return { success: true, data: categories };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
    };
  }
}