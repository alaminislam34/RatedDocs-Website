"use client";

import { Copy, Wallet } from "lucide-react";

interface ReferralStatsProps {
  referralCode: string;
  availableBalance: string;
  onCopyCode: () => void;
  onWithdraw: () => void;
}

export default function ReferralStats({
  referralCode,
  availableBalance,
  onCopyCode,
  onWithdraw,
}: ReferralStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="rounded-[18px] border border-[#CEE0F4] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(15,54,89,0.02)] sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-[12px] font-medium leading-5 text-[#6B7280] sm:text-[13px]">
            Your Referral Code
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#1A1A2E] sm:text-[34px] lg:text-[40px]">
              {referralCode}
            </span>

            <button
              type="button"
              onClick={onCopyCode}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#DCE5F2] bg-white px-4 text-[12px] font-semibold text-[#0F3659] transition hover:bg-[#F8FBFF]"
            >
              <Copy className="size-3.5" />
              Copy code
            </button>
          </div>

          <p className="mt-2 max-w-sm text-[11px] leading-5 text-[#6B7280] sm:text-[12px]">
            Earn $150 for every colleague who joins and goes live.
          </p>
        </div>
      </section>

      <section className="flex min-h-47 flex-col justify-between rounded-[18px] border border-[#CEE0F4] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(15,54,89,0.02)] sm:px-6 lg:px-5 lg:py-8">
        <div>
          <p className="text-[12px] font-medium leading-5 text-[#6B7280] sm:text-[13px]">
            Available Balance
          </p>
          <p className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.04em] text-[#1A1A2E] sm:text-[32px]">
            {availableBalance}
          </p>
        </div>

        <button
          type="button"
          onClick={onWithdraw}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#DCE5F2] bg-white px-4 text-[12px] font-semibold text-[#1A1A2E] transition hover:bg-[#F8FBFF]"
        >
          <Wallet className="size-3.5" />
          Withdrawal Amount
        </button>
      </section>
    </div>
  );
}