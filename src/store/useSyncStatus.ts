import { create } from 'zustand';

export type SyncState = 'off' | 'idle' | 'syncing' | 'synced' | 'error';

interface SyncStatus {
  state: SyncState;
  message: string | null;
  set: (state: SyncState, message?: string | null) => void;
}

/** Not persisted: describes the current session only. */
export const useSyncStatus = create<SyncStatus>((set) => ({
  state: 'off',
  message: null,
  set: (state, message = null) => set({ state, message }),
}));
