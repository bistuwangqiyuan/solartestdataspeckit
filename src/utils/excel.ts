import * as XLSX from 'xlsx';
import { TestRecord } from '@/types';
import { validateTestRecord } from './validation';

// Excel列名映射
const COLUMN_MAPPING = {
  '测试日期': 'test_date',
  '设备序列号': 'device_sn',
  '产品型号': 'product_model',
  '测试项目': 'test_item',
  '测试值': 'test_value',
  '测试结果': 'result',
  '测试人员': 'operator',
  '备注': 'remarks',
};

// 解析Excel文件
export async function parseExcelFile(file: File): Promise<{
  data: any[];
  errors: any[];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false, // 格式化日期
          dateNF: 'yyyy-mm-dd',
        });
        
        // 处理数据
        const processedData = processDataRows(jsonData);
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsBinaryString(file);
  });
}

// 处理数据行
function processDataRows(rows: any[]): {
  data: any[];
  errors: any[];
} {
  const processedData: any[] = [];
  const errors: any[] = [];
  
  rows.forEach((row, index) => {
    // 映射列名
    const mappedRow: any = {};
    for (const [chineseKey, englishKey] of Object.entries(COLUMN_MAPPING)) {
      if (row[chineseKey] !== undefined) {
        mappedRow[englishKey] = row[chineseKey];
      }
    }
    
    // 处理测试值
    if (mappedRow.test_value) {
      try {
        // 尝试解析为JSON
        mappedRow.test_value = JSON.parse(mappedRow.test_value);
      } catch {
        // 如果不是JSON，保持原值
        mappedRow.test_value = { value: mappedRow.test_value };
      }
    }
    
    // 标准化测试结果
    if (mappedRow.result) {
      mappedRow.result = mappedRow.result.toUpperCase();
    }
    
    // 验证数据
    const validationErrors = validateTestRecord(mappedRow, index + 2); // +2 因为Excel从1开始，且有表头
    
    if (validationErrors.length === 0) {
      processedData.push(mappedRow);
    } else {
      errors.push(...validationErrors);
    }
  });
  
  return { data: processedData, errors };
}

// 导出数据到Excel
export function exportToExcel(data: any[], filename: string = 'export.xlsx') {
  // 准备数据
  const exportData = data.map(row => {
    const exportRow: any = {};
    
    // 反向映射列名
    for (const [chineseKey, englishKey] of Object.entries(COLUMN_MAPPING)) {
      if (row[englishKey] !== undefined) {
        let value = row[englishKey];
        
        // 特殊处理测试值
        if (englishKey === 'test_value' && typeof value === 'object') {
          value = JSON.stringify(value);
        }
        
        exportRow[chineseKey] = value;
      }
    }
    
    return exportRow;
  });
  
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // 设置列宽
  const columnWidths = [
    { wch: 12 }, // 测试日期
    { wch: 20 }, // 设备序列号
    { wch: 15 }, // 产品型号
    { wch: 15 }, // 测试项目
    { wch: 20 }, // 测试值
    { wch: 10 }, // 测试结果
    { wch: 12 }, // 测试人员
    { wch: 30 }, // 备注
  ];
  worksheet['!cols'] = columnWidths;
  
  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '测试数据');
  
  // 导出文件
  XLSX.writeFile(workbook, filename);
}

// 生成Excel模板
export function generateExcelTemplate() {
  const templateData = [
    {
      '测试日期': '2025-01-15',
      '设备序列号': 'PV-SD-2025-001',
      '产品型号': 'PV-1500',
      '测试项目': '耐压测试',
      '测试值': '{"voltage": 1500, "duration": 60}',
      '测试结果': 'PASS',
      '测试人员': '张三',
      '备注': '测试正常',
    },
    {
      '测试日期': '2025-01-15',
      '设备序列号': 'PV-SD-2025-002',
      '产品型号': 'PV-1500',
      '测试项目': '绝缘电阻测试',
      '测试值': '{"resistance": 1000}',
      '测试结果': 'PASS',
      '测试人员': '李四',
      '备注': '',
    },
  ];
  
  exportToExcel(templateData, '测试数据导入模板.xlsx');
}