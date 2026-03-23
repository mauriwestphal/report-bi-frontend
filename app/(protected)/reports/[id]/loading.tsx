import { PowerBiSkeleton } from '@/components/features/powerbi/PowerBiSkeleton'

export default function Loading() {
  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      <PowerBiSkeleton />
    </div>
  )
}
