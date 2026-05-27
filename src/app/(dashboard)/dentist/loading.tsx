import { VerificationBannerSkeleton } from "../../modules/dentist/overview/verification-banner-skeleton";
import { MetricsPlaceholderSkeleton } from "../../modules/dentist/overview/metrics-placeholder-skeleton";

export default function DentistOverviewLoading() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <VerificationBannerSkeleton />
      <MetricsPlaceholderSkeleton />
    </div>
  );
}