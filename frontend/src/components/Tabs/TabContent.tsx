import { Suspense, memo, type ComponentType } from 'react';
import { useTabContext } from './TabContext';

export interface TabPanel {
  code: string;
  component: ComponentType;
}

interface TabContentProps {
  panels: TabPanel[];
}

const PanelFallback = memo(function PanelFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
});

const MemoizedPanel = memo(function MemoizedPanel({ Component }: { Component: ComponentType }) {
  return (
    <Suspense fallback={<PanelFallback />}>
      <Component />
    </Suspense>
  );
});

export function TabContent({ panels }: TabContentProps) {
  const { openTabs, activeId } = useTabContext();

  if (openTabs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
        Select a menu from the sidebar to get started.
      </div>
    );
  }

  return (
    <>
      {openTabs.map((tab) => {
        const panel = panels.find((p) => p.code === tab.id);
        if (!panel) return null;
        return (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            style={{ display: activeId === tab.id ? 'block' : 'none' }}
          >
            <MemoizedPanel Component={panel.component} />
          </div>
        );
      })}
    </>
  );
}
