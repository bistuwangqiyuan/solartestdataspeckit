import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatDeviceSn,
  formatTestResult,
  formatSeverity,
  formatStatus,
  formatRole,
} from '@/utils/format';

describe('Format Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('2025-01-15');
    });

    it('should format date string correctly', () => {
      expect(formatDate('2025-01-15T10:30:00')).toBe('2025-01-15');
    });

    it('should use custom format', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date, 'MM/dd/yyyy')).toBe('01/15/2025');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = new Date('2025-01-15T10:30:45');
      expect(formatDateTime(date)).toMatch(/2025-01-15 \d{2}:30:45/);
    });
  });

  describe('formatNumber', () => {
    it('should format number without decimals', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should format number with decimals', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with one decimal', () => {
      expect(formatPercent(95.678)).toBe('95.7%');
    });

    it('should format percentage with custom decimals', () => {
      expect(formatPercent(95.678, 2)).toBe('95.68%');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(100)).toBe('100 Bytes');
    });

    it('should format KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('should format MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });

    it('should format GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('formatDeviceSn', () => {
    it('should convert to uppercase', () => {
      expect(formatDeviceSn('pv-sd-2025-001')).toBe('PV-SD-2025-001');
    });
  });

  describe('formatTestResult', () => {
    it('should format PASS correctly', () => {
      expect(formatTestResult('PASS')).toBe('合格');
    });

    it('should format FAIL correctly', () => {
      expect(formatTestResult('FAIL')).toBe('不合格');
    });
  });

  describe('formatSeverity', () => {
    it('should format severity levels correctly', () => {
      expect(formatSeverity('low')).toBe('低');
      expect(formatSeverity('medium')).toBe('中');
      expect(formatSeverity('high')).toBe('高');
    });
  });

  describe('formatStatus', () => {
    it('should format status correctly', () => {
      expect(formatStatus('in_progress')).toBe('进行中');
      expect(formatStatus('completed')).toBe('已完成');
      expect(formatStatus('pending')).toBe('待处理');
      expect(formatStatus('cancelled')).toBe('已取消');
    });

    it('should return original value for unknown status', () => {
      expect(formatStatus('unknown')).toBe('unknown');
    });
  });

  describe('formatRole', () => {
    it('should format roles correctly', () => {
      expect(formatRole('admin')).toBe('管理员');
      expect(formatRole('operator')).toBe('操作员');
      expect(formatRole('viewer')).toBe('查看者');
    });

    it('should return original value for unknown role', () => {
      expect(formatRole('unknown')).toBe('unknown');
    });
  });
});