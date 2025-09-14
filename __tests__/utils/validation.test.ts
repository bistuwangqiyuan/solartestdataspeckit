import {
  validateRequired,
  validateDate,
  validateDeviceSn,
  validateNumberRange,
  validateTestRecord,
  validateFileType,
  validateFileSize,
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateRequired', () => {
    it('should return error for empty value', () => {
      const error = validateRequired('', 'field');
      expect(error).not.toBeNull();
      expect(error?.message).toBe('field不能为空');
    });

    it('should return error for null value', () => {
      const error = validateRequired(null, 'field');
      expect(error).not.toBeNull();
    });

    it('should return null for valid value', () => {
      const error = validateRequired('value', 'field');
      expect(error).toBeNull();
    });
  });

  describe('validateDate', () => {
    it('should validate correct date format', () => {
      const error = validateDate('2025-01-15', 'date');
      expect(error).toBeNull();
    });

    it('should return error for incorrect format', () => {
      const error = validateDate('2025/01/15', 'date');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('格式不正确');
    });

    it('should return error for invalid date', () => {
      const error = validateDate('2025-13-01', 'date');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('不是有效的日期');
    });
  });

  describe('validateDeviceSn', () => {
    it('should validate correct device SN', () => {
      const error = validateDeviceSn('PV-SD-2025-001');
      expect(error).toBeNull();
    });

    it('should return error for incorrect format', () => {
      const error = validateDeviceSn('PV-2025-001');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('格式不正确');
    });
  });

  describe('validateNumberRange', () => {
    it('should validate number within range', () => {
      const error = validateNumberRange(50, 0, 100, 'value');
      expect(error).toBeNull();
    });

    it('should return error for number below range', () => {
      const error = validateNumberRange(-10, 0, 100, 'value');
      expect(error).not.toBeNull();
      expect(error?.message).toContain('应在0到100之间');
    });

    it('should return error for number above range', () => {
      const error = validateNumberRange(150, 0, 100, 'value');
      expect(error).not.toBeNull();
    });
  });

  describe('validateTestRecord', () => {
    it('should validate valid test record', () => {
      const record = {
        test_date: '2025-01-15',
        device_sn: 'PV-SD-2025-001',
        product_model: 'PV-1500',
        test_item: '耐压测试',
        result: 'PASS',
      };
      const errors = validateTestRecord(record, 1);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid record', () => {
      const record = {
        test_date: '2025-13-01',
        device_sn: 'INVALID',
        product_model: '',
        test_item: null,
        result: 'INVALID',
      };
      const errors = validateTestRecord(record, 1);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateFileType', () => {
    it('should validate Excel files', () => {
      const xlsFile = new File([''], 'test.xls', { type: 'application/vnd.ms-excel' });
      expect(validateFileType(xlsFile)).toBe(true);

      const xlsxFile = new File([''], 'test.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      expect(validateFileType(xlsxFile)).toBe(true);
    });

    it('should reject non-Excel files', () => {
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(validateFileType(pdfFile)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should validate file within size limit', () => {
      const file = new File(['x'.repeat(1024 * 1024)], 'test.xlsx');
      expect(validateFileSize(file, 10)).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const file = new File(['x'.repeat(60 * 1024 * 1024)], 'test.xlsx');
      expect(validateFileSize(file, 50)).toBe(false);
    });
  });
});