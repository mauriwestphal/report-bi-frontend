export function PowerBiSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted z-10">
      <div className="absolute inset-0 bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer" />
      <p className="relative m-0 text-sm font-medium text-muted-foreground z-10">
        Cargando reporte...
      </p>
    </div>
  )
}
