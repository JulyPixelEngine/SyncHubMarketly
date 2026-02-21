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

// -- TabContext.tsx: Manages the state of open tabs, active tab, and provides functions to open, close, and switch tabs. It uses React Context to share this state across the application.
// -- 전역 상태 공유용, props drilling 방지, 탭 관련 상태와 함수 제공
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

  // -- useMemo로 TabContextValue 객체를 메모이제이션하여 불필요한 리렌더링 방지
  const value = useMemo<TabContextValue>(
    () => ({ openTabs, activeId, openTab, closeTab, clearAllTabs, setActiveTab }),
    [openTabs, activeId, openTab, closeTab, clearAllTabs, setActiveTab],
  );

  // -- TabProvider로 감싸진 컴포넌트들은 TabContext의 상태와 함수를 사용할 수 있음
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

// -- useTabContext 훅을 통해 TabContext의 값을 쉽게 사용할 수 있도록 함. TabProvider로 감싸지 않은 곳에서 사용 시 에러 발생
export function useTabContext(): TabContextValue {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}

// -- TabContext는 탭의 상태와 관련된 모든 로직을 중앙 집중화하여 관리하며, 이를 통해 컴포넌트 간의 상태 공유와 유지보수가 용이해짐.
// -- 탭 열기, 닫기, 활성화 등의 기능을 제공하며, 이를 사용하는 컴포넌트들은 TabContext를 통해 필요한 상태와 함수를 쉽게 접근할 수 있음.
// ** 이 컴포넌트가 속한 트리에서 가장 가까운 컴포넌트가 속한 트리에서 TabProvider로 감싸져 있어야 함. 그렇지 않으면 useTabContext 훅에서 에러가 발생함. 따라서 TabProvider는 일반적으로 애플리케이션의 루트 또는 탭 관련 컴포넌트 트리의 상위에 위치해야 함.
// ** 가장 가까운 TabContext.Provider를 찾기 때문에, TabProvider가 여러 개 존재할 경우 각 TabProvider는 독립적인 탭 상태를 관리할 수 있음. 이는 예를 들어 서로 다른 섹션에서 별도의 탭 인터페이스가 필요한 경우 유용할 수 있음.

