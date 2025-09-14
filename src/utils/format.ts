import { format, parseISO } from 'date-fns';

// 日期格式化
export function formatDate(date: string | Date, formatStr: string = 'yyyy-MM-dd') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
}

// 数字格式化
export function formatNumber(num: number, decimals: number = 0) {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(num: number, decimals: number = 1) {
  return `${formatNumber(num, decimals)}%`;
}

// 文件大小格式化
export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 设备序列号格式化
export function formatDeviceSn(sn: string) {
  // 格式：PV-SD-2025-001
  return sn.toUpperCase();
}

// 测试结果格式化
export function formatTestResult(result: 'PASS' | 'FAIL') {
  return result === 'PASS' ? '合格' : '不合格';
}

// 严重程度格式化
export function formatSeverity(severity: 'low' | 'medium' | 'high') {
  const severityMap = {
    low: '低',
    medium: '中',
    high: '高',
  };
  return severityMap[severity] || severity;
}

// 状态格式化
export function formatStatus(status: string) {
  const statusMap = {
    in_progress: '进行中',
    completed: '已完成',
    pending: '待处理',
    cancelled: '已取消',
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

// 角色格式化
export function formatRole(role: string) {
  const roleMap = {
    admin: '管理员',
    operator: '操作员',
    viewer: '查看者',
  };
  return roleMap[role as keyof typeof roleMap] || role;
}