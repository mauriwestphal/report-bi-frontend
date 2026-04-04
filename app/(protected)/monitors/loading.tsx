import MonitorsSkeleton from '@/components/features/monitors/MonitorsSkeleton'

export default function MonitorsLoading() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MonitorsSkeleton />
      </div>
    </div>
  )
}