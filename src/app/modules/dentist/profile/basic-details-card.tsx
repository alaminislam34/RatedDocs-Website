// modules/dentist/profile/basic-details-card.tsx
import { Mail, Phone, MapPin, Briefcase, PencilLine } from "lucide-react";
import { DentistProfile } from "@/hooks/dentist/dentist.interface";

interface BasicDetailsCardProps {
  profile: DentistProfile;
}

export function BasicDetailsCard({ profile }: BasicDetailsCardProps) {
  const { user, phone, experience_years, dentist_address } = profile;
  const location = dentist_address?.[0];

  // Simple capitalization for city/country
  const formatStr = (str: string) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const locationStr = location
    ? `${formatStr(location.city)}, ${formatStr(location.country)}`
    : "N/A";

  const details = [
    { icon: Mail, label: "Email", value: user?.email || "N/A" },
    {
      icon: Phone,
      label: "Phone Number",
      value: user?.phone || phone || "N/A",
    },
    { icon: MapPin, label: "Location", value: locationStr },
    {
      icon: Briefcase,
      label: "Experience",
      value: experience_years ? `${experience_years} Years` : "N/A",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
        <button className="text-gray-400 hover:text-[#163E5C] transition-colors">
          <PencilLine className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {details.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-400">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BasicDetailsCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
