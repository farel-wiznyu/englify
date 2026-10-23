import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = 'englify-auth-flow-log';
const MAX_LINES = 14;

const stamp = () =>
  [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');

let chain: Promise<void> = Promise.resolve();

async function append(step: string) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const lines: string[] = raw ? JSON.parse(raw) : [];
    lines.push(`${stamp()} ${step}`);
    await AsyncStorage.setItem(KEY, JSON.stringify(lines.slice(-MAX_LINES)));
  } catch {
    // diagnostics only; never break sign-in
  }
}

/** Appends a step to a small on-device log that survives the screen (or the app) being recreated. Never log tokens. */
export const logFlow = (step: string) => (chain = chain.then(() => append(step)));

export async function readFlowLog(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export const clearFlowLog = () => (chain = chain.then(() => AsyncStorage.removeItem(KEY).catch(() => {})));

interface FlowState {
  /** Last user-facing problem, kept outside the screen so a re-mount cannot lose it. */
  message: string | null;
  failed: boolean;
  setFailed: (message: string) => void;
  reset: () => void;
}

export const useAuthFlow = create<FlowState>((set) => ({
  message: null,
  failed: false,
  setFailed: (message) => set({ message, failed: true }),
  reset: () => set({ message: null, failed: false }),
}));
