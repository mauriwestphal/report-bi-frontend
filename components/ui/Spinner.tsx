interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
}

export function Spinner({ size = 'md', label }: SpinnerProps) {
  const px = sizeMap[size]
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="status"
        aria-label={label ?? 'Cargando'}
        className={`rounded-full border-t-primary animate-spin`}
        style={{
          width: px,
          height: px,
          borderWidth: size === 'sm' ? '2px' : '3px',
          borderColor: 'hsl(var(--border))',
          borderTopColor: 'hsl(var(--primary))',
        }}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}
