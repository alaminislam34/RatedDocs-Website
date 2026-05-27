import { BasicDetailsCard } from "../../../modules/dentist/profile/basic-details-card";
import { PricingPlaceholder } from "../../../modules/dentist/profile/pricing-placeholder";
import { ReviewsPlaceholder } from "../../../modules/dentist/profile/reviews-placeholder";
import { ProfileHeader } from "../../../modules/dentist/profile/profile-header";
import { VerificationSidebar } from "../../../modules/dentist/profile/verification-sidebar";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Section: Full Width Header */}
      <div className="w-full">
        <ProfileHeader />
      </div>

      {/* Main Content: Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Details, Pricing, and Reviews */}
        <div className="flex flex-col gap-6">
          <BasicDetailsCard />
          <PricingPlaceholder />
          <ReviewsPlaceholder />
        </div>

        {/* Right Column: Verification Sidebar */}
        <aside className="sticky top-6">
          <VerificationSidebar />
        </aside>
      </div>
    </div>
  );
}
