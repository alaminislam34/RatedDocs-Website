import { Skeleton } from "@/components/feedback/skeleton";

function ReferralStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="rounded-[18px] border border-[#CEE0F4] bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-10 w-56 rounded-full" />
          <Skeleton className="h-4 w-72 max-w-full rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </section>

      <section className="rounded-[18px] border border-[#CEE0F4] bg-white px-4 py-6 sm:px-6 lg:px-5 lg:py-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-8 h-10 w-full rounded-full" />
      </section>
    </div>
  );
}

function ReferralHistorySkeleton() {
  return (
    <section className="rounded-[18px] border border-[#E9EDEE] bg-white px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-10 w-full max-w-70 rounded-md" />
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-[14px] border border-[#EEF2F7] md:block">
        <div className="grid grid-cols-[1.2fr_1.2fr_0.6fr] bg-[#F8FAFC] px-4 py-3">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
          <div className="flex justify-end">
            <Skeleton className="h-3 w-28 rounded-full" />
          </div>
        </div>

        <div className="divide-y divide-[#EEF2F7] bg-white">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1.2fr_1.2fr_0.6fr] items-center px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-36 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40 rounded-full" />
              <div className="flex justify-end">
                <Skeleton className="h-4 w-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EEF2F7] px-4 py-3">
          <Skeleton className="h-3 w-44 rounded-full" />
        </div>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#EEF2F7] bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-40 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ReferralsSkeleton() {
  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-500">
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>

      <ReferralStatsSkeleton />
      <ReferralHistorySkeleton />
    </div>
  );
}
