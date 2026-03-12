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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div
        role="status"
        aria-label={label ?? 'Cargando'}
        style={{
          width: px,
          height: px,
          border: `${size === 'sm' ? 2 : 3}px solid var(--border-subtle)`,
          borderTop: `${size === 'sm' ? 2 : 3}px solid var(--text-interactive)`,
          borderRadius: '50%',
          animation: 'uss-spin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>{label}</span>}
      <style>{`@keyframes uss-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
