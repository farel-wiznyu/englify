import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAppStore } from '@/store/useAppStore';

/** Adds foreground seconds to today's activity while the calling screen is mounted. */
export function useSessionTimer() {
  const addSeconds = useAppStore((s) => s.addSeconds);
  useEffect(() => {
    let last = Date.now();
    const flush = () => {
      const now = Date.now();
      const secs = Math.min(Math.round((now - last) / 1000), 120);
      last = now;
      if (secs > 0) addSeconds(secs);
    };
    const id = setInterval(() => {
      if (AppState.currentState === 'active') flush();
      else last = Date.now();
    }, 15000);
    return () => {
      clearInterval(id);
      if (AppState.currentState === 'active') flush();
    };
  }, [addSeconds]);
}
