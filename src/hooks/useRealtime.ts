import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtime({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // 创建频道
    const channelName = `realtime:${table}:${event}${filter ? `:${filter}` : ''}`;
    const newChannel = supabase.channel(channelName);

    // 配置订阅
    const subscription = newChannel.on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table,
        filter,
      },
      (payload) => {
        // 根据事件类型调用相应的回调
        switch (payload.eventType) {
          case 'INSERT':
            onInsert?.(payload);
            break;
          case 'UPDATE':
            onUpdate?.(payload);
            break;
          case 'DELETE':
            onDelete?.(payload);
            break;
        }
      }
    );

    // 订阅频道
    subscription.subscribe((status) => {
      setIsSubscribed(status === 'SUBSCRIBED');
    });

    setChannel(newChannel);

    // 清理函数
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [table, event, filter]);

  return {
    channel,
    isSubscribed,
  };
}

// 专门用于测试记录的实时订阅
export function useTestRecordsRealtime(
  onUpdate: (data: any) => void
) {
  return useRealtime({
    table: 'test_records',
    event: '*',
    onInsert: (payload) => {
      console.log('New test record:', payload.new);
      onUpdate(payload.new);
    },
    onUpdate: (payload) => {
      console.log('Updated test record:', payload.new);
      onUpdate(payload.new);
    },
    onDelete: (payload) => {
      console.log('Deleted test record:', payload.old);
      onUpdate(payload.old);
    },
  });
}

// 用于异常检测的实时订阅
export function useAnomaliesRealtime(
  onNewAnomaly: (anomaly: any) => void
) {
  return useRealtime({
    table: 'anomalies',
    event: 'INSERT',
    onInsert: (payload) => {
      console.log('New anomaly detected:', payload.new);
      onNewAnomaly(payload.new);
    },
  });
}