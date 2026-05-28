import { Skeleton } from "@/components/feedback/skeleton";

function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white py-5 shadow-sm">
      <div className="mx-auto flex max-w-360 w-11/12 items-center justify-between gap-4">
        <Skeleton className="h-8 w-36 rounded-md" />
        <div className="hidden lg:flex items-center gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-20 rounded" />
          ))}
        </div>
        <Skeleton className="hidden md:block h-10 flex-1 max-w-md rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section className="bg-white pt-16 pb-20 px-6">
      <div className="mx-auto max-w-360 w-11/12">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <Skeleton className="h-4 w-32 rounded-full mx-auto" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-4/5 rounded-xl mx-auto" />
          <Skeleton className="h-6 w-3/4 rounded mx-auto" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function DentistCardRowSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full rounded-lg border border-slate-200 bg-white p-5 flex gap-4"
        >
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-52" />
            <div className="flex gap-2 mt-1">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTitleSkeleton() {
  return (
    <div className="space-y-2 mb-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  );
}

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NavbarSkeleton />

      {/* Hero */}
      <HeroSkeleton />

      {/* Section: Featured dentists */}
      <section className="py-16 px-6 bg-[#F8FAFC]">
        <div className="mx-auto max-w-360 w-11/12">
          <SectionTitleSkeleton />
          <DentistCardRowSkeleton />
          <div className="flex justify-center mt-8">
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Section: Why Trust */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-360 w-11/12">
          <SectionTitleSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 space-y-3"
              >
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-6 bg-[#003366]">
        <div className="mx-auto max-w-360 w-11/12 flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-8 w-72 rounded-xl bg-white/20" />
          <Skeleton className="h-4 w-96 max-w-full rounded bg-white/10" />
          <Skeleton className="h-12 w-40 rounded-xl bg-white/20 mt-2" />
        </div>
      </section>
    </div>
  );
}
