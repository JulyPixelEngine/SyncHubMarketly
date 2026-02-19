import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { useTabContext } from './TabContext';

interface IndicatorStyle {
  left: number;
  width: number;
}

const CloseIcon = memo(function CloseIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
});

export function TabBar() {
  const { openTabs, activeId, setActiveTab, closeTab, clearAllTabs } = useTabContext();
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<IndicatorStyle>({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    if (!activeId) {
      setIndicator({ left: 0, width: 0 });
      return;
    }
    const el = tabRefs.current.get(activeId);
    const container = tabListRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerRect.left + container.scrollLeft,
        width: elRect.width,
      });
    }
  }, [activeId]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator, openTabs]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (openTabs.length === 0) return;
      const currentIdx = openTabs.findIndex((t) => t.id === activeId);
      let nextIdx = currentIdx;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % openTabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIdx = (currentIdx - 1 + openTabs.length) % openTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIdx = openTabs.length - 1;
      } else {
        return;
      }

      const nextTab = openTabs[nextIdx];
      setActiveTab(nextTab.id);
      tabRefs.current.get(nextTab.id)?.focus();
    },
    [openTabs, activeId, setActiveTab],
  );

  const handleClose = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      closeTab(id);
    },
    [closeTab],
  );

  const setTabRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(id, el);
    } else {
      tabRefs.current.delete(id);
    }
  }, []);

  if (openTabs.length === 0) return null;

  return (
    <div className="flex items-center border-b border-gray-200 bg-white">
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Content tabs"
        className="relative flex-1 flex items-center overflow-x-auto"
        onKeyDown={handleKeyDown}
      >
        {openTabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => setTabRef(tab.id, el)}
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={activeId === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors outline-none ${
              activeId === tab.id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.label}</span>
            <span
              role="button"
              aria-label={`Close ${tab.label}`}
              onClick={(e) => handleClose(e, tab.id)}
              className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity"
            >
              <CloseIcon />
            </span>
          </button>
        ))}

        {/* Animated underline indicator */}
        <span
          className="absolute bottom-0 h-0.5 bg-indigo-600 transition-all duration-200 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      </div>

      {/* Clear All */}
      {openTabs.length > 1 && (
        <button
          onClick={clearAllTabs}
          className="shrink-0 px-2.5 py-1.5 mr-2 text-[11px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          aria-label="Close all tabs"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
