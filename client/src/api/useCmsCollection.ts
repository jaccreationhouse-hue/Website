import { useEffect, useState } from 'react';
import { fetchCmsCollection } from './cmsClient';

type UseCmsCollectionOptions = {
  deferUntilIdle?: boolean;
  deferDelayMs?: number;
};


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
            if (Array.isArray(records)) {
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

    // Fetch immediately to prevent stale UI state
    loadCollection();

    return () => {
      active = false;
    };
  }, [collectionKey, fallback, options.deferDelayMs, options.deferUntilIdle]);

  return { items, loading, error };
}
