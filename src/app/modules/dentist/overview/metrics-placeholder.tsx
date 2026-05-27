import { BarChart3, Clock3, Info } from "lucide-react";

export function MetricsPlaceholder() {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_18px_40px_rgba(15,35,61,0.06)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--sidebar-primary)/15 bg-(--sidebar-primary)/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-primary">
              <BarChart3 className="size-3.5" />
              Behavioural metrics
            </span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Live once your profile is active
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              These insights start tracking after verification. They help you
              understand profile performance, patient interest, and booking
              readiness.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-border bg-background px-4 py-3 text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">Pending activation</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Profile views", "—"],
            ["Booking clicks", "—"],
            ["Conversion rate", "—"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_18px_40px_rgba(15,35,61,0.06)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="size-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">
              What happens next
            </h4>
            <p className="text-sm text-muted-foreground">
              A quick overview of the activation flow.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            "Verification review is completed by the admin team.",
            "Your profile becomes visible in search and listings.",
            "Behavioural metrics start collecting live performance data.",
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-2xl border border-border bg-background p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
