import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchStorageInfo, StorageInfoResponse } from '../api/api';

interface StorageContextType {
  storageInfo: StorageInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | null>(null);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageInfo, setStorageInfo] = useState<StorageInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStorageInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const info = await fetchStorageInfo();
      setStorageInfo(info);
    } catch (err) {
      console.error('Failed to fetch storage info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch storage info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStorageInfo();
  }, [loadStorageInfo]);

  const refresh = useCallback(async () => {
    await loadStorageInfo();
  }, [loadStorageInfo]);

  return (
    <StorageContext.Provider value={{ storageInfo, isLoading, error, refresh }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
