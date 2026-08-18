/**
 * Hook that polls /api/health every 30 seconds and returns live system status.
 * Components can use this to show a real backend status indicator.
 */
import { useState, useEffect, useCallback } from 'react';
import { api, type HealthResponse } from '../services/api';

export type SystemStatus = 'checking' | 'online' | 'degraded' | 'offline';

export interface UseSystemStatusReturn {
  status: SystemStatus;
  health: HealthResponse | null;
  lastChecked: Date | null;
  refresh: () => void;
}

const POLL_INTERVAL_MS = 30_000;

export function useSystemStatus(): UseSystemStatusReturn {
  const [status, setStatus] = useState<SystemStatus>('checking');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = useCallback(async () => {
    try {
      const data = await api.health();
      setHealth(data);
      setLastChecked(new Date());

      if (data.status === 'ok' && data.database === 'connected') {
        setStatus('online');
      } else {
        setStatus('degraded');
      }
    } catch {
      setStatus('offline');
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    check();
    const timer = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [check]);

  return { status, health, lastChecked, refresh: check };
}
