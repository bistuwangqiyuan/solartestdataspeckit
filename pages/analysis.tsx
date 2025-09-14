import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { 
  getStatisticsByProduct, 
  getStatisticsByTestItem,
  getDailyStatistics,
} from '@/services/statistics';
import { formatPercent, formatNumber, formatDate } from '@/utils/format';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  ChartBarIcon,
  BeakerIcon,
  CubeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function AnalysisPage() {
  const [productStats, setProductStats] = useState<any[]>([]);
  const [testItemStats, setTestItemStats] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    const [productResult, testItemResult] = await Promise.all([
      getStatisticsByProduct(),
      getStatisticsByTestItem(),
    ]);

    if (productResult.success) setProductStats(productResult.data || []);
    if (testItemResult.success) setTestItemStats(testItemResult.data || []);
    
    setLoading(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
    },
  };

  // 产品合格率图表数据
  const productChartData = {
    labels: productStats.map(p => p.product_model),
    datasets: [
      {
        label: '合格率 (%)',
        data: productStats.map(p => p.pass_rate),
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00D4FF',
        borderWidth: 1,
      },
    ],
  };

  // 测试项目合格率图表数据
  const testItemChartData = {
    labels: testItemStats.map(t => t.test_item_name),
    datasets: [
      {
        label: '合格率 (%)',
        data: testItemStats.map(t => t.pass_rate),
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: '#7C3AED',
        borderWidth: 1,
      },
    ],
  };

  // 雷达图数据（按类别）
  const categoryStats = testItemStats.reduce((acc, item) => {
    const category = item.test_item_category;
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        pass: 0,
        items: 0,
      };
    }
    acc[category].total += item.total_tests;
    acc[category].pass += item.pass_count;
    acc[category].items += 1;
    return acc;
  }, {} as any);

  const radarData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: '合格率 (%)',
        data: Object.values(categoryStats).map((s: any) => 
          s.total > 0 ? (s.pass / s.total) * 100 : 0
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10B981',
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10B981',
      },
    ],
  };

  return (
    <Layout title="数据分析 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">数据分析</h1>
            <p className="text-muted mt-1">深度分析测试数据，发现质量趋势</p>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-muted" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="input-field"
            >
              <option value={7}>最近7天</option>
              <option value={30}>最近30天</option>
              <option value={90}>最近90天</option>
              <option value={365}>最近一年</option>
            </select>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 产品数量 */}
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <CubeIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">测试产品数</p>
              <p className="text-2xl font-bold">{productStats.length}</p>
            </div>
          </div>

          {/* 测试项目数 */}
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <BeakerIcon className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">测试项目数</p>
              <p className="text-2xl font-bold">{testItemStats.length}</p>
            </div>
          </div>

          {/* 平均合格率 */}
          <div className="glass-card p-6 flex items-center space-x-4">
            <div className="p-3 bg-success/20 rounded-lg">
              <ChartBarIcon className="w-8 h-8 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted">平均合格率</p>
              <p className="text-2xl font-bold">
                {formatPercent(
                  productStats.length > 0
                    ? productStats.reduce((sum, p) => sum + p.pass_rate, 0) / productStats.length
                    : 0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 产品合格率分析 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">产品合格率分析</h3>
          <div className="h-80">
            {productStats.length > 0 ? (
              <Bar data={productChartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted">
                暂无数据
              </div>
            )}
          </div>
        </div>

        {/* 测试项目分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 测试项目合格率 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">测试项目合格率</h3>
            <div className="h-80">
              {testItemStats.length > 0 ? (
                <Bar data={testItemChartData} options={{
                  ...chartOptions,
                  indexAxis: 'y' as const,
                }} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted">
                  暂无数据
                </div>
              )}
            </div>
          </div>

          {/* 分类合格率雷达图 */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">分类合格率对比</h3>
            <div className="h-80">
              {Object.keys(categoryStats).length > 0 ? (
                <Radar data={radarData} options={{
                  ...chartOptions,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: { color: '#9CA3AF' },
                      grid: { color: '#374151' },
                      pointLabels: { color: '#E5E7EB' },
                    },
                  },
                }} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted">
                  暂无数据
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 详细数据表格 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">产品测试详情</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>产品型号</th>
                  <th>产品名称</th>
                  <th>测试总数</th>
                  <th>合格数</th>
                  <th>不合格数</th>
                  <th>合格率</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="loading-spinner mx-auto"></div>
                    </td>
                  </tr>
                ) : productStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  productStats.map((stat) => (
                    <tr key={stat.product_id}>
                      <td>{stat.product_model}</td>
                      <td>{stat.product_name}</td>
                      <td className="text-center">{formatNumber(stat.total_tests)}</td>
                      <td className="text-center text-success">{formatNumber(stat.pass_count)}</td>
                      <td className="text-center text-error">{formatNumber(stat.fail_count)}</td>
                      <td className="text-center">
                        <span className={`font-medium ${
                          stat.pass_rate >= 95 ? 'text-success' : 
                          stat.pass_rate >= 90 ? 'text-warning' : 'text-error'
                        }`}>
                          {formatPercent(stat.pass_rate)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}