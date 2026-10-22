import { useSyncExternalStore } from 'react';
import { getSnapshot, subscribe, type StoreState } from './store';

/**
 * Subscribe to a slice of the store.
 * The selector must return a primitive or a stable reference (not a fresh object each call).
 */
export function useGame<T>(selector: (s: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}
