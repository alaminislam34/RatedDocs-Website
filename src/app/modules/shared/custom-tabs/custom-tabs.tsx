"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  queryKey?: string;
}

export default function CustomTabs({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  storageKey,
  queryKey = "tab",
}: CustomTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const getDefaultTab = () => defaultTab || tabs[0]?.id || "";
  const getInitialTab = () => {
    const urlTab = searchParams.get(queryKey);
    if (urlTab && tabs.some((tab) => tab.id === urlTab)) return urlTab;

    if (storageKey && typeof window !== "undefined") {
      const savedTab = localStorage.getItem(storageKey);
      if (savedTab && tabs.some((tab) => tab.id === savedTab)) {
        return savedTab;
      }
    }

    return getDefaultTab();
  };
  const [internalActiveTab, setInternalActiveTab] = useState(getInitialTab);
  const lastSyncedUrlTab = useRef<string | null>(null);

  useEffect(() => {
    const urlTab = searchParams.get(queryKey);
    if (!urlTab || !tabs.some((tab) => tab.id === urlTab)) return;
    if (lastSyncedUrlTab.current === urlTab) return;

    const timeoutId = window.setTimeout(() => {
      lastSyncedUrlTab.current = urlTab;
      if (activeTab === undefined) {
        setInternalActiveTab(urlTab);
      }
      onTabChange?.(urlTab);
      if (storageKey) localStorage.setItem(storageKey, urlTab);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [activeTab, onTabChange, queryKey, searchParams, storageKey, tabs]);

  const currentActiveTab =
    activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    lastSyncedUrlTab.current = tabId;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(queryKey, tabId);
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });

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
