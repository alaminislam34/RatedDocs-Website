"use client";

import { useState } from "react";
import { CreditCard, Link } from "lucide-react";

interface CardInfo {
  brand: string;
  last4: string;
  expiry: string;
}

interface PaymentInfoProps {
  connected?: boolean;
  card?: CardInfo | null;
}

export default function PaymentInfo({ connected = true, card = null }: PaymentInfoProps) {
  const [isConnected, setIsConnected] = useState(connected);

  return (
    <section className="rounded-xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-[#0E3E65]">Payment Information</h2>
        <div className="text-sm text-[#475569]">Stripe Connect</div>
      </div>

      <div className="mt-4 space-y-4">
        {!isConnected ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-[#6B7280]">No payment method connected.</p>
            <button
              onClick={() => setIsConnected(true)}
              className="ml-auto rounded-md bg-[#0F3659] px-4 py-2 text-sm font-semibold text-white"
            >
              Connect Stripe
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-100 p-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded-md bg-linear-to-r from-[#FF8A65] to-[#F44336] flex items-center justify-center text-white">
                <CreditCard className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{card ? `${card.brand} **** ${card.last4}` : 'Mastercard **** 3800'}</div>
                <div className="text-xs text-[#6B7280] mt-1">Expiry: {card ? card.expiry : '12/12/2026'}</div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm">Replace</button>
              <button className="rounded-md bg-[#0F3659] px-3 py-2 text-sm font-semibold text-white">Manage</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
