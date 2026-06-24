// Komponen ini merupakan bagian dari antarmuka pengguna
import React, { useRef, useCallback } from "react";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      if (nextIndex !== null) {
        onTabChange(tabs[nextIndex].key);
        tabRefs.current[nextIndex]?.focus();
      }
    },
    [tabs, onTabChange]
  );

  return (
    <div
      role="tablist"
      aria-label="Filter tabs"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[index] = el; }}
            id={`tab-${tab.key}`}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              px-4 py-1.5 text-sm font-medium rounded-full border transition-colors
              ${
                isActive
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
