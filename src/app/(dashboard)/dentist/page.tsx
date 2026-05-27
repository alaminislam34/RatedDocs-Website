import { VerificationBanner } from "../../modules/dentist/overview/verification-banner";

export default function OverviewPage() {
  return (
    <div className="flex justify-center items-center animate-in fade-in duration-500 w-full h-full">
      <VerificationBanner />
    </div>
  );
}
