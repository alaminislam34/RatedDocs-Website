// modules/dentist/profile/profile-header.tsx
import { Badge } from "@/components/ui/badge";
import { DentistProfile } from "@/hooks/dentist/dentist.interface";

interface ProfileHeaderProps {
  profile: DentistProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user, full_name, specialty, is_verified, rdv_score } = profile;
  console.log("Profile:", profile)
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();
  const formattedSpecialty = specialty 
    ? specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase() 
    : "Dentist";

  return (
    <div className="flex flex-col items-center justify-between rounded-xl border border-gray-100 bg-white p-8 md:flex-row">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F1F8] text-2xl font-bold text-[#163E5C]">
          {initials || "D"}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{full_name || "Dr. Unknown"}</h1>
          <p className="text-gray-500">{formattedSpecialty}</p>
          <div className="flex gap-2 pt-2">
            {!is_verified ? (
              <Badge variant="secondary" className="bg-red-50 text-red-500 border-none px-3 py-1">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" /> UNVERIFIED
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-50 text-green-500 border-none px-3 py-1">
                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" /> VERIFIED
              </Badge>
            )}
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none px-3 py-1">
              {is_verified ? "Searchable" : "Not Searchable"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 md:mt-0">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-gray-50">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-[#163E5C]">{rdv_score || 0}%</span>
            <span className="text-[10px] uppercase text-gray-400">RDV Score</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center justify-between rounded-xl border border-gray-100 bg-white p-8 md:flex-row animate-pulse">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-gray-200" />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="mt-6 md:mt-0">
        <div className="h-24 w-24 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}