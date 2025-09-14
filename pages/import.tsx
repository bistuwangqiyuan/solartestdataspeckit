import React, { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useDropzone } from 'react-dropzone';
import { parseExcelFile, generateExcelTemplate } from '@/utils/excel';
import { validateFileType, validateFileSize } from '@/utils/validation';
import { batchCreateTestRecords } from '@/services/testRecords';
import { formatFileSize } from '@/utils/format';
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface UploadResult {
  fileName: string;
  fileSize: number;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: any[];
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 验证文件类型
    if (!validateFileType(file)) {
      toast.error('请上传Excel文件（.xls或.xlsx）');
      return;
    }

    // 验证文件大小
    if (!validateFileSize(file, 50)) {
      toast.error('文件大小不能超过50MB');
      return;
    }

    setFile(file);
    setParsing(true);
    setErrors([]);
    setParsedData([]);
    setUploadResult(null);

    try {
      const result = await parseExcelFile(file);
      setParsedData(result.data);
      setErrors(result.errors);

      // 显示解析结果
      if (result.errors.length > 0) {
        toast.error(`发现 ${result.errors.length} 个数据错误`);
      } else {
        toast.success(`成功解析 ${result.data.length} 条数据`);
      }
    } catch (error) {
      toast.error('文件解析失败');
      console.error('Parse error:', error);
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('没有可导入的数据');
      return;
    }

    setImporting(true);
    try {
      // TODO: 需要先匹配产品ID、测试项目ID和操作员ID
      // 这里暂时使用模拟数据
      const recordsToImport = parsedData.map(row => ({
        test_date: row.test_date,
        device_sn: row.device_sn,
        product_id: 'mock-product-id', // 需要根据product_model查找
        test_item_id: 'mock-test-item-id', // 需要根据test_item查找
        test_value: row.test_value,
        result: row.result,
        operator_id: 'mock-operator-id', // 需要根据operator查找
        remarks: row.remarks,
      }));

      const result = await batchCreateTestRecords(recordsToImport);

      if (result.success) {
        setUploadResult({
          fileName: file!.name,
          fileSize: file!.size,
          totalRows: parsedData.length,
          validRows: result.count,
          invalidRows: parsedData.length - result.count,
          errors: [],
        });
        toast.success(`成功导入 ${result.count} 条数据`);
        
        // 清理状态
        setFile(null);
        setParsedData([]);
        setErrors([]);
      } else {
        toast.error('数据导入失败');
      }
    } catch (error) {
      toast.error('导入过程中发生错误');
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
    toast.success('模板下载成功');
  };

  return (
    <Layout title="数据导入 - PV-SDM">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">数据导入</h1>
            <p className="text-muted mt-1">批量导入Excel测试数据</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="btn-secondary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>下载模板</span>
          </button>
        </div>

        {/* 上传区域 */}
        <div className="glass-card p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-muted" />
            {isDragActive ? (
              <p className="text-lg">释放文件以上传...</p>
            ) : (
              <>
                <p className="text-lg mb-2">拖拽Excel文件到此处，或点击选择文件</p>
                <p className="text-sm text-muted">支持 .xls 和 .xlsx 格式，最大 50MB</p>
              </>
            )}
          </div>

          {/* 文件信息 */}
          {file && (
            <div className="mt-6 p-4 bg-dark-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentArrowDownIcon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {parsing && <div className="loading-spinner"></div>}
              </div>
            </div>
          )}
        </div>

        {/* 解析结果 */}
        {(parsedData.length > 0 || errors.length > 0) && !uploadResult && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">解析结果</h3>
            
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{parsedData.length + errors.length}</p>
                <p className="text-sm text-muted">总行数</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{parsedData.length}</p>
                <p className="text-sm text-muted">有效数据</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-error">{errors.length}</p>
                <p className="text-sm text-muted">错误数据</p>
              </div>
            </div>

            {/* 错误列表 */}
            {errors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-warning" />
                  数据错误详情
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="p-2 bg-dark-200 rounded text-sm">
                      <span className="text-error">第{error.row}行：</span>
                      <span className="ml-2">{error.message}</span>
                    </div>
                  ))}
                  {errors.length > 10 && (
                    <p className="text-sm text-muted text-center">
                      还有 {errors.length - 10} 个错误...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setFile(null);
                  setParsedData([]);
                  setErrors([]);
                }}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                disabled={parsedData.length === 0 || importing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? '导入中...' : `导入 ${parsedData.length} 条数据`}
              </button>
            </div>
          </div>
        )}

        {/* 导入结果 */}
        {uploadResult && (
          <div className="glass-card p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-8 h-8 text-success mr-3" />
              <h3 className="text-lg font-medium">导入完成</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>文件名：{uploadResult.fileName}</p>
              <p>文件大小：{formatFileSize(uploadResult.fileSize)}</p>
              <p>成功导入：<span className="text-success font-medium">{uploadResult.validRows}</span> 条</p>
              {uploadResult.invalidRows > 0 && (
                <p>失败：<span className="text-error font-medium">{uploadResult.invalidRows}</span> 条</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setUploadResult(null)}
                className="btn-primary"
              >
                继续导入
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">使用说明</h3>
          <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
            <li>下载Excel模板，按照模板格式准备数据</li>
            <li>确保必填字段完整：测试日期、设备序列号、产品型号、测试项目、测试结果</li>
            <li>设备序列号格式：PV-SD-YYYY-XXX（如：PV-SD-2025-001）</li>
            <li>测试结果只能是 PASS 或 FAIL</li>
            <li>测试值如果是JSON格式，请确保格式正确</li>
            <li>单个文件最大支持10,000条记录</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}