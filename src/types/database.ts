export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      test_records: {
        Row: {
          id: string
          test_date: string
          device_sn: string
          product_id: string
          test_item_id: string
          test_value: Json
          result: 'PASS' | 'FAIL'
          operator_id: string
          batch_id: string | null
          remarks: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_date: string
          device_sn: string
          product_id: string
          test_item_id: string
          test_value: Json
          result: 'PASS' | 'FAIL'
          operator_id: string
          batch_id?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          test_date?: string
          device_sn?: string
          product_id?: string
          test_item_id?: string
          test_value?: Json
          result?: 'PASS' | 'FAIL'
          operator_id?: string
          batch_id?: string | null
          remarks?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_items: {
        Row: {
          id: string
          code: string
          name: string
          category: string
          standard_ref: string | null
          pass_criteria: Json
          parameters: Json | null
          unit: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          category: string
          standard_ref?: string | null
          pass_criteria: Json
          parameters?: Json | null
          unit?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          category?: string
          standard_ref?: string | null
          pass_criteria?: Json
          parameters?: Json | null
          unit?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          model: string
          name: string
          specifications: Json | null
          manufacturer: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          model: string
          name: string
          specifications?: Json | null
          manufacturer?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          model?: string
          name?: string
          specifications?: Json | null
          manufacturer?: string | null
          category?: string | null
          created_at?: string
        }
      }
      test_batches: {
        Row: {
          id: string
          batch_no: string
          product_id: string
          total_count: number
          pass_count: number
          fail_count: number
          status: string
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          batch_no: string
          product_id: string
          total_count?: number
          pass_count?: number
          fail_count?: number
          status?: string
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          batch_no?: string
          product_id?: string
          total_count?: number
          pass_count?: number
          fail_count?: number
          status?: string
          started_at?: string
          completed_at?: string | null
        }
      }
      anomalies: {
        Row: {
          id: string
          test_record_id: string
          anomaly_type: string
          severity: 'low' | 'medium' | 'high'
          description: string | null
          detected_at: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          id?: string
          test_record_id: string
          anomaly_type: string
          severity: 'low' | 'medium' | 'high'
          description?: string | null
          detected_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          id?: string
          test_record_id?: string
          anomaly_type?: string
          severity?: 'low' | 'medium' | 'high'
          description?: string | null
          detected_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
      }
    }
    Views: {
      daily_statistics: {
        Row: {
          date: string
          product_id: string
          total_tests: number
          pass_count: number
          fail_count: number
          pass_rate: number
        }
      }
    }
    Functions: {
      // Define functions here
    }
    Enums: {
      // Define enums here
    }
  }
}