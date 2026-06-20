// modules/dentist/profile/reviews-placeholder.tsx
interface ReviewsPlaceholderProps {
  totalReviews?: number;
  ratingAvg?: number;
}

export function ReviewsPlaceholder({ totalReviews = 0, ratingAvg = 0 }: ReviewsPlaceholderProps) {
  const hasReviews = totalReviews > 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        {hasReviews ? (
          <>
            <h4 className="mb-2 text-base font-bold text-gray-900">Average Rating: {ratingAvg.toFixed(1)} / 5</h4>
            <p className="max-w-85 text-sm leading-relaxed text-gray-400">
              Based on {totalReviews} consultation{totalReviews > 1 ? "s" : ""}.
            </p>
          </>
        ) : (
          <>
            <h4 className="mb-2 text-base font-bold text-gray-900">Reviews Will be here after Consultation</h4>
            <p className="max-w-85 text-sm leading-relaxed text-gray-400">
              Currently your profile is not visible and you cant consultant the profile
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function ReviewsPlaceholderSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="border-b border-gray-50 px-6 py-4">
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-2 h-5 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
}