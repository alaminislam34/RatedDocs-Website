import { Skeleton } from "@/components/feedback/skeleton";

export function VerificationBannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-[0_24px_60px_rgba(15,35,61,0.08)] sm:p-8 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-12">
      <div className="space-y-6">
        <Skeleton className="h-6 w-44 rounded-full bg-muted" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-[min(100%,22rem)] rounded-xl bg-muted sm:h-14" />
          <Skeleton className="h-5 w-[min(100%,34rem)] rounded-xl bg-muted" />
          <Skeleton className="h-5 w-[min(100%,30rem)] rounded-xl bg-muted" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-2xl border border-border bg-background p-4">
              <Skeleton className="size-5 rounded-md bg-muted" />
              <Skeleton className="mt-3 h-4 w-24 rounded-full bg-muted" />
              <Skeleton className="mt-2 h-4 w-full rounded-full bg-muted" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-full bg-muted" />
            </div>
          ))}
        </div>

        <Skeleton className="h-12 w-44 rounded-xl bg-muted" />
      </div>

      <div className="mt-8 flex items-center justify-center lg:mt-0 lg:justify-end">
        <div className="w-full max-w-[24rem] rounded-[32px] border border-border bg-background p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="size-28 rounded-full bg-muted sm:size-32" />
            <Skeleton className="mt-6 h-8 w-44 rounded-xl bg-muted" />
            <Skeleton className="mt-2 h-5 w-56 rounded-xl bg-muted" />

            <div className="mt-6 w-full space-y-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="rounded-2xl border border-border bg-card p-4">
                  <Skeleton className="h-5 w-32 rounded-full bg-muted" />
                  <Skeleton className="mt-2 h-4 w-24 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}