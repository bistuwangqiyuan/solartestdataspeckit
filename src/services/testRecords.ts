import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { TestRecord, QueryFilters, SortParams, PaginationParams } from '@/types';

// 获取测试记录列表
export async function getTestRecords(
  filters?: QueryFilters,
  sort?: SortParams,
  pagination?: PaginationParams
) {
  try {
    let query = supabase
      .from('test_records')
      .select(`
        *,
        product:products(*),
        test_item:test_items(*),
        operator:users(*)
      `, { count: 'exact' });

    // 应用过滤器
    if (filters) {
      if (filters.dateFrom) {
        query = query.gte('test_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('test_date', filters.dateTo);
      }
      if (filters.deviceSn) {
        query = query.ilike('device_sn', `%${filters.deviceSn}%`);
      }
      if (filters.productId) {
        query = query.eq('product_id', filters.productId);
      }
      if (filters.testItemId) {
        query = query.eq('test_item_id', filters.testItemId);
      }
      if (filters.result) {
        query = query.eq('result', filters.result);
      }
      if (filters.batchId) {
        query = query.eq('batch_id', filters.batchId);
      }
    }

    // 应用排序
    if (sort) {
      query = query.order(sort.field, { ascending: sort.order === 'asc' });
    } else {
      query = query.order('test_date', { ascending: false });
    }

    // 应用分页
    if (pagination) {
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
      total: count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
      total: 0,
    };
  }
}

// 获取单个测试记录
export async function getTestRecord(id: string) {
  try {
    const { data, error } = await supabase
      .from('test_records')
      .select(`
        *,
        product:products(*),
        test_item:test_items(*),
        operator:users(*)
      `)
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

// 创建测试记录
export async function createTestRecord(record: Partial<TestRecord>) {
  try {
    const { data, error } = await supabase
      .from('test_records')
      .insert(record)
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

// 批量创建测试记录
export async function batchCreateTestRecords(records: Partial<TestRecord>[]) {
  try {
    const BATCH_SIZE = 1000;
    const results = [];

    // 分批插入
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from('test_records')
        .insert(batch)
        .select();

      if (error) throw error;
      results.push(...(data || []));
    }

    return {
      success: true,
      data: results,
      count: results.length,
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
      count: 0,
    };
  }
}

// 更新测试记录
export async function updateTestRecord(id: string, updates: Partial<TestRecord>) {
  try {
    const { data, error } = await supabase
      .from('test_records')
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

// 删除测试记录
export async function deleteTestRecord(id: string) {
  try {
    const { error } = await supabase
      .from('test_records')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    };
  }
}

// 获取测试记录统计
export async function getTestRecordsStatistics(filters?: QueryFilters) {
  try {
    let query = supabase
      .from('test_records')
      .select('result', { count: 'exact', head: false });

    // 应用过滤器
    if (filters) {
      if (filters.dateFrom) {
        query = query.gte('test_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('test_date', filters.dateTo);
      }
      if (filters.productId) {
        query = query.eq('product_id', filters.productId);
      }
      if (filters.testItemId) {
        query = query.eq('test_item_id', filters.testItemId);
      }
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // 计算统计数据
    const totalTests = count || 0;
    const passCount = data?.filter(r => r.result === 'PASS').length || 0;
    const failCount = data?.filter(r => r.result === 'FAIL').length || 0;
    const passRate = totalTests > 0 ? (passCount / totalTests) * 100 : 0;

    return {
      success: true,
      data: {
        total_tests: totalTests,
        pass_count: passCount,
        fail_count: failCount,
        pass_rate: Math.round(passRate * 10) / 10,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: null,
    };
  }
}