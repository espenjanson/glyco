import React, { createContext, useContext } from 'react';
import { RootStore, rootStore } from './RootStore';

const StoreContext = createContext<RootStore>(rootStore);

interface StoreProviderProps {
  children: React.ReactNode;
  store?: RootStore;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children, 
  store = rootStore 
}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hooks for each store
export const useRootStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within a StoreProvider');
  }
  return store;
};

export const useGlucoseStore = () => {
  const rootStore = useRootStore();
  return rootStore.glucoseStore;
};

export const useInsulinStore = () => {
  const rootStore = useRootStore();
  return rootStore.insulinStore;
};

export const useFoodStore = () => {
  const rootStore = useRootStore();
  return rootStore.foodStore;
};

export const useSettingsStore = () => {
  const rootStore = useRootStore();
  return rootStore.settingsStore;
};

export const useHistoryStore = () => {
  const rootStore = useRootStore();
  return rootStore.historyStore;
};

export const useDashboardStats = () => {
  const rootStore = useRootStore();
  return rootStore.dashboardStats;
};