export default function MonitorsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 uss-skeleton-pulse rounded"></div>
        <div className="h-10 w-32 uss-skeleton-pulse rounded"></div>
      </div>

      {/* Search bar skeleton */}
      <div className="h-12 w-full uss-skeleton-pulse rounded"></div>

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 w-24 uss-skeleton-pulse rounded"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 w-24 uss-skeleton-pulse rounded"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 w-24 uss-skeleton-pulse rounded"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 w-24 uss-skeleton-pulse rounded"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 w-32 uss-skeleton-pulse rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 w-32 uss-skeleton-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 w-24 uss-skeleton-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-5 w-20 uss-skeleton-pulse rounded"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 w-16 uss-skeleton-pulse rounded-full"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 uss-skeleton-pulse rounded"></div>
                    <div className="h-8 w-16 uss-skeleton-pulse rounded"></div>
                    <div className="h-8 w-16 uss-skeleton-pulse rounded"></div>
                    <div className="h-8 w-16 uss-skeleton-pulse rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-32 uss-skeleton-pulse rounded"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 uss-skeleton-pulse rounded"></div>
          <div className="h-8 w-8 uss-skeleton-pulse rounded"></div>
          <div className="h-8 w-8 uss-skeleton-pulse rounded"></div>
        </div>
      </div>
    </div>
  )
}