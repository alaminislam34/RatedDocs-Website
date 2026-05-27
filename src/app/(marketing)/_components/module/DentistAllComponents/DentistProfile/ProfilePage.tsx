"use client";

import { useState } from "react";
import ProfileTabs, { type ProfileTab } from "./ProfileTabs";
import AboutSection from "./AboutSection";
import ReviewSection from "./ReviewSection";
import ProtocolSection from "./ProtocolSection";
import PricingSection from "./PricingSection";
import MaterialsSection from "./MaterialsSection";
import ResultsSection from "./ResultsSection";
import BookingSidebar from "./BookingSidebar";

export default function DentistProfilePage({ dentist }: { dentist: any }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-360 w-11/12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Left Column */}
          <div className="w-full lg:flex-1 min-w-0 space-y-5">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "overview" && (
              <AboutSection name={dentist.name} bio={dentist.bio} />
            )}
            {activeTab === "pricing" && <PricingSection />}
            {activeTab === "reviews" && <ReviewSection />}
            {activeTab === "protocols" && <ProtocolSection />}
            {activeTab === "materials" && <MaterialsSection />}
            {activeTab === "results" && <ResultsSection />}
          </div>

          {/* Right Column — sticky sidebar */}
          <div className="w-full lg:w-110 lg:shrink-0">
            <BookingSidebar dentist={dentist} />
          </div>
        </div>
      </div>
    </main>
  );
}
