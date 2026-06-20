"use client";

import {
  BasicDetailsCard,
  BasicDetailsCardSkeleton,
} from "../../../modules/dentist/profile/basic-details-card";
import {
  PricingPlaceholder,
  PricingPlaceholderSkeleton,
} from "../../../modules/dentist/profile/pricing-placeholder";
import {
  ReviewsPlaceholder,
  ReviewsPlaceholderSkeleton,
} from "../../../modules/dentist/profile/reviews-placeholder";
import {
  ProfileHeader,
  ProfileHeaderSkeleton,
} from "../../../modules/dentist/profile/profile-header";
import {
  VerificationSidebar,
  VerificationSidebarSkeleton,
} from "../../../modules/dentist/profile/verification-sidebar";
import useDentist from "@/hooks/dentist/useDentist";

export default function ProfilePage() {
  const {
    dentistProfileQuery,
    isDentistProfileGetLoading,
    isDentistProfileError,
    dentistProfileError,
  } = useDentist();

  // Unified Loading State with Skeletons
  if (isDentistProfileGetLoading) {
    return (
      <div className="flex flex-col gap-6">
        <ProfileHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            <BasicDetailsCardSkeleton />
            <PricingPlaceholderSkeleton />
            <ReviewsPlaceholderSkeleton />
          </div>
          <aside className="sticky top-6">
            <VerificationSidebarSkeleton />
          </aside>
        </div>
      </div>
    );
  }

  if (isDentistProfileError) {
    return (
      <div className="p-4 text-red-500">
        Error:{" "}
        {dentistProfileError instanceof Error
          ? dentistProfileError.message
          : "Unknown error"}
      </div>
    );
  }

  const profileData = dentistProfileQuery?.data?.data;

  if (!profileData) {
    return <div className="p-4 text-gray-500">No profile data available.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section */}
      <div className="w-full">
        <ProfileHeader profile={profileData} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <BasicDetailsCard profile={profileData} />
          <PricingPlaceholder
            verificationPhase={profileData.verification_phase}
          />
          <ReviewsPlaceholder
            totalReviews={profileData.total_reviews}
            ratingAvg={profileData.rating_avg}
          />
        </div>

        <aside className="sticky top-6">
          <VerificationSidebar
            verificationPhase={profileData.verification_phase}
            isVerified={profileData.is_verified}
          />
        </aside>
      </div>
    </div>
  );
}
