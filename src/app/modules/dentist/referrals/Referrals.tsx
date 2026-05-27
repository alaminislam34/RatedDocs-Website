
"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReferralStats from "./components/referral-stats";
import ReferralHistory, { type ReferralHistoryItem } from "./components/referral-history";

const referralCode = "RD-JW4729";

const referralHistory: ReferralHistoryItem[] = [
  { id: 1, name: "Dr. Maya Patel", email: "maya@gmail.com", amount: "$70", initials: "DM" },
  { id: 2, name: "Dr. Brian Lee", email: "brian@gmail.com", amount: "$70", initials: "DB" },
  { id: 3, name: "Dr. Amelia Garcia", email: "amelia@gmail.com", amount: "$70", initials: "DA" },
  { id: 4, name: "Dr. Noah Kim", email: "noah@gmail.com", amount: "$70", initials: "DN" },
  { id: 5, name: "Dr. Priya Shah", email: "priya@gmail.com", amount: "$70", initials: "DP" },
  { id: 6, name: "Dr. Liam O'Connor", email: "liam@gmail.com", amount: "$70", initials: "DL" },
  { id: 7, name: "Dr. Sara Chen", email: "sara@gmail.com", amount: "$70", initials: "DS" },
  { id: 8, name: "Dr. Marcus Hall", email: "marcus@gmail.com", amount: "$70", initials: "DM" },
];

export default function Referrals() {
  const [query, setQuery] = useState("");

  const filteredHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return referralHistory;
    }

    return referralHistory.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied");
    } catch {
      toast.error("Unable to copy referral code");
    }
  };

  return (
    <section className="space-y-6 lg:space-y-7">
      <header className="space-y-1.5">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1A1A2E] sm:text-[30px]">
          Referrals
        </h1>
      </header>

      <ReferralStats
        referralCode={referralCode}
        availableBalance="$150"
        onCopyCode={handleCopyCode}
        onWithdraw={() => toast.success("Withdrawal request started")}
      />

      <ReferralHistory
        items={filteredHistory}
        query={query}
        onQueryChange={setQuery}
      />
    </section>
  );
}
