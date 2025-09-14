import { supabase, handleSupabaseError } from '@/lib/supabase';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import type { Statistics, DailyStatistics, ChartData } from '@/types';

// 获取今日统计
export async function getTodayStatistics() {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  return getStatisticsByDateRange(start, end);
}

// 获取本周统计
export async function getWeekStatistics() {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });

  return getStatisticsByDateRange(start, end);
}

// 获取本月统计
export async function getMonthStatistics() {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  return getStatisticsByDateRange(start, end);
}

// 按日期范围获取统计
async function getStatisticsByDateRange(startDate: Date, endDate: Date) {
  try {
    const { data, error, count } = await supabase
      .from('test_records')
      .select('result', { count: 'exact', head: false })
      .gte('test_date', format(startDate, 'yyyy-MM-dd'))
      .lte('test_date', format(endDate, 'yyyy-MM-dd'));

    if (error) throw error;

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

// 获取日统计数据（用于趋势图）
export async function getDailyStatistics(days: number = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const { data, error } = await supabase
      .from('daily_statistics')
      .select('*')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

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

// 获取合格率趋势数据
export async function getPassRateTrend(days: number = 30): Promise<ChartData> {
  try {
    const dailyStats = await getDailyStatistics(days);
    
    if (!dailyStats.success || !dailyStats.data) {
      throw new Error('Failed to get daily statistics');
    }

    const labels = dailyStats.data.map(stat => 
      format(new Date(stat.date), 'MM-dd')
    );
    
    const passRates = dailyStats.data.map(stat => stat.pass_rate);

    return {
      labels,
      datasets: [
        {
          label: '合格率 (%)',
          data: passRates,
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
        },
      ],
    };
  } catch (error) {
    console.error('Error getting pass rate trend:', error);
    return {
      labels: [],
      datasets: [],
    };
  }
}

// 获取按产品分类的统计
export async function getStatisticsByProduct() {
  try {
    const { data, error } = await supabase
      .from('test_records')
      .select(`
        product_id,
        products!inner(model, name),
        result
      `);

    if (error) throw error;

    // 按产品分组统计
    const productStats = new Map<string, any>();

    data?.forEach(record => {
      const productId = record.product_id;
      const product = (record as any).products;
      
      if (!productStats.has(productId)) {
        productStats.set(productId, {
          product_id: productId,
          product_model: product.model,
          product_name: product.name,
          total_tests: 0,
          pass_count: 0,
          fail_count: 0,
        });
      }

      const stats = productStats.get(productId);
      stats.total_tests += 1;
      if (record.result === 'PASS') {
        stats.pass_count += 1;
      } else {
        stats.fail_count += 1;
      }
    });

    // 计算合格率
    const results = Array.from(productStats.values()).map(stats => ({
      ...stats,
      pass_rate: stats.total_tests > 0 
        ? Math.round((stats.pass_count / stats.total_tests) * 1000) / 10 
        : 0,
    }));

    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
    };
  }
}

// 获取按测试项目分类的统计
export async function getStatisticsByTestItem() {
  try {
    const { data, error } = await supabase
      .from('test_records')
      .select(`
        test_item_id,
        test_items!inner(name, category),
        result
      `);

    if (error) throw error;

    // 按测试项目分组统计
    const testItemStats = new Map<string, any>();

    data?.forEach(record => {
      const testItemId = record.test_item_id;
      const testItem = (record as any).test_items;
      
      if (!testItemStats.has(testItemId)) {
        testItemStats.set(testItemId, {
          test_item_id: testItemId,
          test_item_name: testItem.name,
          test_item_category: testItem.category,
          total_tests: 0,
          pass_count: 0,
          fail_count: 0,
        });
      }

      const stats = testItemStats.get(testItemId);
      stats.total_tests += 1;
      if (record.result === 'PASS') {
        stats.pass_count += 1;
      } else {
        stats.fail_count += 1;
      }
    });

    // 计算合格率
    const results = Array.from(testItemStats.values()).map(stats => ({
      ...stats,
      pass_rate: stats.total_tests > 0 
        ? Math.round((stats.pass_count / stats.total_tests) * 1000) / 10 
        : 0,
    }));

    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
      data: [],
    };
  }
}

// 获取分类分布数据（用于饼图）
export async function getCategoryDistribution(): Promise<ChartData> {
  try {
    const stats = await getStatisticsByTestItem();
    
    if (!stats.success || !stats.data) {
      throw new Error('Failed to get test item statistics');
    }

    // 按类别汇总
    const categoryMap = new Map<string, number>();
    
    stats.data.forEach(item => {
      const category = item.test_item_category;
      const count = item.total_tests;
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + count);
      } else {
        categoryMap.set(category, count);
      }
    });

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());

    return {
      labels,
      datasets: [
        {
          label: '测试数量',
          data,
          backgroundColor: [
            '#00D4FF',
            '#7C3AED',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#6366F1',
          ],
          borderWidth: 0,
        },
      ],
    };
  } catch (error) {
    console.error('Error getting category distribution:', error);
    return {
      labels: [],
      datasets: [],
    };
  }
}