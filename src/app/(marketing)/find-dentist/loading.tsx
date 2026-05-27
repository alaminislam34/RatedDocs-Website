import DentistCardSkeleton from "../_components/module/DentistAllComponents/DentistCardSkeleton";
import FilterSidebarSkeleton from "../_components/module/DentistAllComponents/SideBar/FilterSidebarSkeleton";
import { Skeleton } from "@/components/feedback/skeleton";

export default function FindDentistLoading() {
  return (
    <div className="max-w-360 mx-auto w-11/12 min-h-screen text-slate-900">
      {/* TopBar skeleton */}
      <div className="sticky top-0 z-40 mb-6 bg-white py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      <div className="flex gap-4 pb-16">
        {/* Sidebar skeleton — desktop only */}
        <aside className="hidden lg:block max-w-80 w-full">
          <FilterSidebarSkeleton />
        </aside>

        {/* Cards */}
        <section className="max-w-full w-full">
          {/* Result count bar */}
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <DentistCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
