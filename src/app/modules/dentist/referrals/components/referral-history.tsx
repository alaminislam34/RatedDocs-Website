"use client";

import { Search } from "lucide-react";

export interface ReferralHistoryItem {
  id: number;
  name: string;
  email: string;
  amount: string;
  initials: string;
}

interface ReferralHistoryProps {
  items: ReferralHistoryItem[];
  query: string;
  onQueryChange: (value: string) => void;
}

export default function ReferralHistory({
  items,
  query,
  onQueryChange,
}: ReferralHistoryProps) {
  return (
    <section className="rounded-[18px] border border-[#E9EDEE] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(15,54,89,0.02)] sm:px-5 lg:px-6 lg:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[18px] font-semibold leading-7 text-[#1A1A2E] sm:text-[20px]">
          Referral History
        </h2>

        <label className="relative w-full sm:max-w-70">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, email"
            className="h-10 w-full rounded-md border border-[#E5E7EB] bg-white pl-9 pr-3 text-sm text-[#1A1A2E] placeholder:text-[#9CA3AF] outline-none transition focus:border-[#CEE0F4]"
          />
        </label>
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-[14px] border border-[#EEF2F7] md:block">
        <div className="grid grid-cols-[1.2fr_1.2fr_0.6fr] bg-[#F8FAFC] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#94A3B8]">
          <div>Referral Name</div>
          <div>Email</div>
          <div className="text-right">Referral Amount</div>
        </div>

        <div className="divide-y divide-[#EEF2F7] bg-white">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1.2fr_1.2fr_0.6fr] items-center px-4 py-4 text-[13px] text-[#1A1A2E]"
            >
              <div className="flex items-center gap-3 font-medium">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0F3659] text-[11px] font-semibold text-white">
                  {item.initials}
                </div>
                <span>{item.name}</span>
              </div>
              <div className="text-[#6B7280]">{item.email}</div>
              <div className="text-right font-medium">{item.amount}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EEF2F7] px-4 py-3 text-[12px] text-[#94A3B8]">
          Showing 1-{items.length} of {items.length} results
        </div>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[14px] border border-[#EEF2F7] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0F3659] text-[11px] font-semibold text-white">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[14px] font-semibold text-[#1A1A2E]">
                    {item.name}
                  </h3>
                  <p className="truncate text-[12px] text-[#6B7280]">{item.email}</p>
                </div>
              </div>

              <div className="shrink-0 text-[14px] font-semibold text-[#1A1A2E]">
                {item.amount}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}