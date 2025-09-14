import { ValidationError } from '@/types';

// 验证必填字段
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (!value || value === '') {
    return {
      row: 0,
      field: fieldName,
      value,
      message: `${fieldName}不能为空`,
    };
  }
  return null;
}

// 验证日期格式
export function validateDate(value: string, fieldName: string): ValidationError | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return {
      row: 0,
      field: fieldName,
      value,
      message: `${fieldName}格式不正确，应为YYYY-MM-DD`,
    };
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      row: 0,
      field: fieldName,
      value,
      message: `${fieldName}不是有效的日期`,
    };
  }
  
  return null;
}

// 验证设备序列号格式
export function validateDeviceSn(value: string): ValidationError | null {
  const snRegex = /^PV-SD-\d{4}-\d{3}$/;
  if (!snRegex.test(value)) {
    return {
      row: 0,
      field: 'device_sn',
      value,
      message: '设备序列号格式不正确，应为PV-SD-YYYY-XXX',
    };
  }
  return null;
}

// 验证数值范围
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  if (value < min || value > max) {
    return {
      row: 0,
      field: fieldName,
      value,
      message: `${fieldName}应在${min}到${max}之间`,
    };
  }
  return null;
}

// 验证测试记录
export function validateTestRecord(record: any, rowIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 验证必填字段
  const requiredFields = ['test_date', 'device_sn', 'product_model', 'test_item', 'result'];
  for (const field of requiredFields) {
    const error = validateRequired(record[field], field);
    if (error) {
      error.row = rowIndex;
      errors.push(error);
    }
  }
  
  // 验证日期格式
  if (record.test_date) {
    const dateError = validateDate(record.test_date, 'test_date');
    if (dateError) {
      dateError.row = rowIndex;
      errors.push(dateError);
    }
  }
  
  // 验证设备序列号
  if (record.device_sn) {
    const snError = validateDeviceSn(record.device_sn);
    if (snError) {
      snError.row = rowIndex;
      errors.push(snError);
    }
  }
  
  // 验证测试结果
  if (record.result && !['PASS', 'FAIL'].includes(record.result.toUpperCase())) {
    errors.push({
      row: rowIndex,
      field: 'result',
      value: record.result,
      message: '测试结果必须是PASS或FAIL',
    });
  }
  
  return errors;
}

// 验证文件类型
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  const allowedExtensions = ['.xls', '.xlsx'];
  
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  return hasValidType || hasValidExtension;
}

// 验证文件大小（MB）
export function validateFileSize(file: File, maxSizeMB: number = 50): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}