// components/ProcedureSelectionSkeleton.tsx
const SkeletonShimmer = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-md bg-[#F3F4F6] ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export default function ProcedureSelectionSkeleton() {
  const cardCount = 6;

  return (
    <div className="w-full bg-white" aria-busy="true" aria-live="polite">
      <SkeletonShimmer className="mb-6 h-[26px] w-[340px] max-w-full" />

      <div className="space-y-4">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <div
            key={idx}
            className="relative flex items-center justify-between rounded-xl border-2 border-[#F3F4F6] bg-white p-5"
          >
            <div className="flex flex-1 flex-col gap-2.5 pr-4">
              <SkeletonShimmer className="h-[20px] w-[55%]" />
              <SkeletonShimmer className="h-[16px] w-[75%]" />
            </div>

            <div className="shrink-0">
              <SkeletonShimmer className="h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
