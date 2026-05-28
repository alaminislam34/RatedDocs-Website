import { Skeleton } from "@/components/feedback/skeleton";

export function OverviewPageSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 rounded-xl bg-muted" />
        <Skeleton className="mt-2 h-4 w-72 rounded-full bg-muted" />
      </div>

      {/* 4 stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-32 rounded-full bg-muted" />
              <Skeleton className="size-10 shrink-0 rounded-xl bg-muted" />
            </div>
            <Skeleton className="mt-4 h-8 w-24 rounded-xl bg-muted" />
            <Skeleton className="mt-2 h-4 w-36 rounded-full bg-muted" />
          </div>
        ))}
      </div>

      {/* Performance + Alerts */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Performance card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <Skeleton className="size-44 shrink-0 rounded-full bg-muted" />
            <div className="flex-1 space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2">
                  <Skeleton className="h-4 flex-1 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-10 rounded-full bg-muted" />
                  <Skeleton className="h-5 w-16 rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="mt-6 h-4 w-[min(100%,28rem)] rounded-full bg-muted" />
        </div>

        {/* Alerts card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <Skeleton className="h-6 w-16 rounded-xl bg-muted" />
          <div className="mt-5 space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-start gap-4 py-3">
                <Skeleton className="size-10 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36 rounded-full bg-muted" />
                  <Skeleton className="h-3 w-[min(100%,18rem)] rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active bookings */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-xl bg-muted" />
          <Skeleton className="h-4 w-14 rounded-full bg-muted" />
        </div>
        <div className="mt-5 space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_1.1fr_0.9fr_1.4fr_auto] items-center gap-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded-full bg-muted" />
                  <Skeleton className="h-3 w-20 rounded-full bg-muted" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 rounded-full bg-muted" />
                <Skeleton className="h-4 w-24 rounded-full bg-muted" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full bg-muted" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-14 rounded-full bg-muted" />
                <Skeleton className="h-3 w-32 rounded-full bg-muted" />
              </div>
              <Skeleton className="h-9 w-16 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Referral code */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <Skeleton className="h-4 w-32 rounded-full bg-muted" />
        <div className="mt-3 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-56 rounded-xl bg-muted" />
          <Skeleton className="h-10 w-28 rounded-xl bg-muted" />
        </div>
        <Skeleton className="mt-3 h-4 w-72 rounded-full bg-muted" />
      </div>
    </div>
  );
}
