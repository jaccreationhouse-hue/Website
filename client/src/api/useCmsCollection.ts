import { useEffect, useState } from 'react';
import { fetchCmsCollection } from './cmsClient';

export function useCmsCollection<T>(collectionKey: string, fallback: T[]): T[] {
  return useCmsCollectionState(collectionKey, fallback).items;
}

export function useCmsCollectionState<T>(collectionKey: string, fallback: T[]) {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
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
    return () => {
      active = false;
    };
  }, [collectionKey, fallback]);

  return { items, loading, error };
}
