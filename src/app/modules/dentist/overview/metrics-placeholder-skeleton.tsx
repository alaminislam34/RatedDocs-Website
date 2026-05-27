import { Skeleton } from "@/components/feedback/skeleton";

export function MetricsPlaceholderSkeleton() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_18px_40px_rgba(15,35,61,0.06)] sm:p-8">
        <Skeleton className="h-6 w-52 rounded-full bg-muted" />
        <Skeleton className="mt-4 h-9 w-[min(100%,22rem)] rounded-xl bg-muted" />
        <Skeleton className="mt-3 h-5 w-[min(100%,34rem)] rounded-xl bg-muted" />
        <Skeleton className="mt-2 h-5 w-[min(100%,30rem)] rounded-xl bg-muted" />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-2xl border border-border bg-background p-4">
              <Skeleton className="h-4 w-20 rounded-full bg-muted" />
              <Skeleton className="mt-2 h-8 w-14 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_18px_40px_rgba(15,35,61,0.06)] sm:p-8">
        <Skeleton className="h-7 w-40 rounded-full bg-muted" />
        <Skeleton className="mt-2 h-4 w-56 rounded-full bg-muted" />

        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-2xl border border-border bg-background p-4">
              <Skeleton className="h-4 w-[min(100%,18rem)] rounded-full bg-muted" />
              <Skeleton className="mt-2 h-4 w-[min(100%,14rem)] rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}