export function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg bg-card p-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2">
              <div className="h-4 w-3/5 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="h-3.5 w-full bg-muted rounded animate-pulse" />
            <div className="h-3.5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-9 w-32 bg-muted rounded animate-pulse mt-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
