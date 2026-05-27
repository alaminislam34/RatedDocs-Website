
"use client";

import ChangePassword from "./components/change-password";
import PaymentInfo from "./components/payment-info";

export default function ProfileAndSettings() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <h1 className="text-[28px] font-semibold text-[#1A1A2E]">Settings</h1>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="order-2 lg:order-1">
          <ChangePassword />
        </div>

        <div className="order-1 lg:order-2">
          <PaymentInfo connected={true} card={{ brand: 'Mastercard', last4: '3800', expiry: '12/12/2026' }} />
        </div>
      </div>
    </div>
  );
}

