export function PowerBiSkeleton() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        backgroundColor: 'var(--surface-subtle)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(90deg, var(--surface-subtle) 25%, var(--surface-default) 50%, var(--surface-subtle) 75%)',
          backgroundSize: '200% 100%',
          animation: 'uss-skeleton-shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes uss-skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <p
        style={{
          position: 'relative',
          margin: 0,
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'var(--text-subtle)',
          zIndex: 1,
        }}
      >
        Cargando reporte...
      </p>
    </div>
  )
}
