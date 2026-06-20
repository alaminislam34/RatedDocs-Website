"use client";

import React, { useEffect, useState } from "react";

interface TabOption {
  id: string;
  label: string;
}

interface CustomTabsProps {
  tabs: TabOption[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;

  // NEW
  storageKey?: string;
}

export default function CustomTabs({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  storageKey,
}: CustomTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("");

  // Load saved tab from localStorage
  useEffect(() => {
    if (!storageKey) {
      setInternalActiveTab(defaultTab || tabs[0]?.id || "");
      return;
    }

    const savedTab = localStorage.getItem(storageKey);

    if (savedTab) {
      setInternalActiveTab(savedTab);
    } else {
      setInternalActiveTab(defaultTab || tabs[0]?.id || "");
    }
  }, [storageKey, defaultTab, tabs]);

  const currentActiveTab =
    activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }

    // Save tab to localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, tabId);
    }

    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className="w-full border-b border-gray-100">
      <div className="flex items-center justify-start gap-8 px-2">
        {tabs.map((tab) => {
          const isActive = currentActiveTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`relative pb-3 pt-2 text-[15px] font-semibold transition-all duration-150 outline-none select-none ${
                isActive
                  ? "text-[#163E5C]"
                  : "text-[#64748B] hover:text-slate-600"
              }`}
            >
              <span>{tab.label}</span>

              {isActive && (
                <div className="absolute bottom-0 left-0 h-0.75 w-full rounded-full bg-[#163E5C]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
