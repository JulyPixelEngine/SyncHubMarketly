import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

export interface TabConfig {
  id: string;
  label: string;
}

interface TabContextValue {
  openTabs: TabConfig[];
  activeId: string | null;
  openTab: (tab: TabConfig) => void;
  closeTab: (id: string) => void;
  clearAllTabs: () => void;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

interface TabProviderProps {
  defaultTab?: TabConfig;
  children: ReactNode;
}

export function TabProvider({ defaultTab, children }: TabProviderProps) {
  const [openTabs, setOpenTabs] = useState<TabConfig[]>(defaultTab ? [defaultTab] : []);
  const [activeId, setActiveId] = useState<string | null>(defaultTab?.id ?? null);

  const openTab = useCallback((tab: TabConfig) => {
    setOpenTabs((prev) => {
      if (prev.some((t) => t.id === tab.id)) return prev;
      return [...prev, tab];
    });
    setActiveId(tab.id);
  }, []);

  const closeTab = useCallback((id: string) => {
    setOpenTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const next = prev.filter((t) => t.id !== id);

      setActiveId((currentActive) => {
        if (currentActive !== id) return currentActive;
        if (next.length === 0) return null;
        const nearestIdx = Math.min(idx, next.length - 1);
        return next[nearestIdx].id;
      });

      return next;
    });
  }, []);

  const clearAllTabs = useCallback(() => {
    setOpenTabs([]);
    setActiveId(null);
  }, []);

  const setActiveTab = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const value = useMemo<TabContextValue>(
    () => ({ openTabs, activeId, openTab, closeTab, clearAllTabs, setActiveTab }),
    [openTabs, activeId, openTab, closeTab, clearAllTabs, setActiveTab],
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

export function useTabContext(): TabContextValue {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}
