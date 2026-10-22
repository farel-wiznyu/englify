import type { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'expo-crypto';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAppAuth } from '@/lib/auth';
import { createSupabaseClient, supabaseConfigured } from '@/lib/supabase';
import {
  deleteRemoteData,
  ensureProfile,
  pullSnapshot,
  pushChanges,
  resetRemoteProgress,
} from '@/lib/sync';
import { useAppStore } from '@/store/useAppStore';
import { useSyncStatus } from '@/store/useSyncStatus';

const DEBOUNCE_MS = 8000;

let activeClient: SupabaseClient | null = null;
/** Serialises pushes so two flushes never overlap. */
let queue: Promise<void> = Promise.resolve();

async function doPush(sb: SupabaseClient) {
  const status = useSyncStatus.getState();
  const store = useAppStore.getState();
  if (!store.child) return;
  if (!store.childId) store.setChildId(randomUUID());
  status.set('syncing');
  try {
    await pushChanges(sb);
    status.set('synced');
  } catch (e) {
    status.set('error', e instanceof Error ? e.message : 'Sinkronisasi gagal');
  }
}

const runPush = (sb: SupabaseClient) => (queue = queue.then(() => doPush(sb)));

/** Push right now (used before logout so nothing is lost). Resolves even if offline. */
export async function flushNow() {
  if (activeClient) await runPush(activeClient);
}

export async function deleteAllRemoteData() {
  if (!activeClient) return;
  await queue;
  await deleteRemoteData(activeClient);
}

export async function resetAllRemoteProgress() {
  const childId = useAppStore.getState().childId;
  if (!activeClient || !childId) return;
  await queue;
  await resetRemoteProgress(activeClient, childId);
}

async function bootstrap(sb: SupabaseClient) {
  const status = useSyncStatus.getState();
  status.set('syncing');
  try {
    await ensureProfile(sb);
    const store = useAppStore.getState();
    if (!store.childId) {
      const remote = await pullSnapshot(sb);
      if (remote) {
        if (!store.child) store.hydrateFromRemote(remote);
        else store.setChildId(remote.childId); // local profile adopts the existing server child
      }
    }
  } catch (e) {
    status.set('error', e instanceof Error ? e.message : 'Sinkronisasi gagal');
    return;
  }
  await runPush(sb);
}

/** Local-first sync: the UI reads the zustand store; this keeps Supabase in step in the background. */
export function useSync() {
  const { ready, signedIn, devMode, userId, getToken } = useAppAuth();
  const tokenRef = useRef(getToken);
  tokenRef.current = getToken;

  useEffect(() => {
    const { set } = useSyncStatus.getState();
    if (!ready || !signedIn || devMode || !supabaseConfigured) {
      activeClient = null;
      set('off');
      return;
    }
    const sb = createSupabaseClient(() => tokenRef.current());
    if (!sb) {
      set('off');
      return;
    }
    activeClient = sb;
    void bootstrap(sb);

    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = useAppStore.subscribe((s, prev) => {
      const changed =
        s.vocab !== prev.vocab ||
        s.lessonStars !== prev.lessonStars ||
        s.activity !== prev.activity ||
        s.child !== prev.child ||
        s.games.length !== prev.games.length;
      if (!changed) return; // ignore our own markSynced writes
      clearTimeout(timer);
      timer = setTimeout(() => void runPush(sb), DEBOUNCE_MS);
    });
    const appState = AppState.addEventListener('change', (next) => {
      if (next === 'active') return;
      clearTimeout(timer);
      void runPush(sb);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
      appState.remove();
      if (activeClient === sb) activeClient = null;
    };
  }, [ready, signedIn, devMode, userId]);
}
