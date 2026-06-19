export function ReviewsPlaceholder() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h4 className="mb-2 text-base font-bold text-gray-900">
          Reviews Will be here after Consultation
        </h4>
        <p className="max-w-85 text-sm leading-relaxed text-gray-400">
          Currently your profile is not visible and you cant consultant the
          profile
        </p>
      </div>
    </div>
  );
}
