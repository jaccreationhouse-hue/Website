import { useEffect, useState } from 'react';
import { fetchCmsCollection } from './cmsClient';

type UseCmsCollectionOptions = {
  deferUntilIdle?: boolean;
  deferDelayMs?: number;
};

function scheduleIdleWork(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    callback();
    return () => {};
  }

  if ('requestIdleCallback' in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = globalThis.setTimeout(callback, 1200);
  return () => globalThis.clearTimeout(timeoutId);
}

function scheduleDeferredWork(callback: () => void, delayMs = 0): () => void {
  if (typeof window === 'undefined' || delayMs <= 0) {
    return scheduleIdleWork(callback);
  }

  let cancelIdleWork: (() => void) | undefined;
  const timeoutId = window.setTimeout(() => {
    cancelIdleWork = scheduleIdleWork(callback);
  }, delayMs);

  return () => {
    window.clearTimeout(timeoutId);
    cancelIdleWork?.();
  };
}

export function useCmsCollection<T>(
  collectionKey: string,
  fallback: T[],
  options: UseCmsCollectionOptions = {}
): T[] {
  return useCmsCollectionState(collectionKey, fallback, options).items;
}

export function useCmsCollectionState<T>(
  collectionKey: string,
  fallback: T[],
  options: UseCmsCollectionOptions = {}
) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadCollection = () => {
      void fetchCmsCollection<T>(collectionKey)
        .then((records) => {
          if (active) {
            // If backend returns an empty array but we have fallback data,
            // it likely means the backend route is missing or DB is empty. Use fallback.
            if (Array.isArray(records) && records.length === 0 && fallback.length > 0) {
              setItems(fallback);
            } else {
              setItems(records);
            }
            setError('');
          }
        })
        .catch(() => {
          if (active) {
            setItems(fallback);
            setError('Live careers content is temporarily unavailable.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    const cancelIdleWork = options.deferUntilIdle
      ? scheduleDeferredWork(loadCollection, options.deferDelayMs)
      : undefined;
    if (!options.deferUntilIdle) {
      loadCollection();
    }

    return () => {
      active = false;
      cancelIdleWork?.();
    };
  }, [collectionKey, fallback, options.deferDelayMs, options.deferUntilIdle]);

  return { items, loading, error };
}
