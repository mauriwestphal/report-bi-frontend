export default function RolesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border bg-card p-6">
        {/* Search bar skeleton */}
        <div className="mb-6">
          <div className="h-10 w-full max-w-md bg-gray-200 rounded-md uss-skeleton-pulse"></div>
        </div>

        {/* Table header skeleton */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3 h-6 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="col-span-2 h-6 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="col-span-2 h-6 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="col-span-2 h-6 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="col-span-3 h-6 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 py-4 border-t">
            <div className="col-span-3 h-5 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="col-span-2 h-5 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="col-span-2 h-5 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="col-span-2 h-5 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="col-span-3 h-5 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <div className="h-4 w-32 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-md uss-skeleton-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}