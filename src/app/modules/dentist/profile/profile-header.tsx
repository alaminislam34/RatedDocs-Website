import { Badge } from "@/components/ui/badge";

export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center justify-between rounded-2xl border border-gray-100 bg-white p-8 md:flex-row">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F1F8] text-2xl font-bold text-[#163E5C]">
          AH
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Dr. Alex Hemswoth
          </h1>
          <p className="text-gray-500">Orthodontist</p>
          <div className="flex gap-2 pt-2">
            <Badge
              variant="secondary"
              className="bg-red-50 text-red-500 border-none px-3 py-1"
            >
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              UNVERIFIED
            </Badge>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-600 border-none px-3 py-1"
            >
              Not Searchable
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 md:mt-0">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-gray-50">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-[#163E5C]">0%</span>
            <span className="text-[10px] uppercase text-gray-400">
              RDV Score
            </span>
          </div>
          {/* SVG Progress Circle would go here */}
        </div>
      </div>
    </div>
  );
}
