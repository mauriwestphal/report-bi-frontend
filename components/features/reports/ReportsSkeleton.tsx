export function ReportsSkeleton() {
  return (
    <>
      <style>{`
        @keyframes uss-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .uss-skeleton {
          background-color: var(--surface-subtle);
          border-radius: var(--border-radius, 0.375rem);
          animation: uss-skeleton-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="uss-card">
            <div
              className="uss-card__body"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div className="uss-skeleton" style={{ height: '1.1rem', width: '60%' }} />
                <div className="uss-skeleton" style={{ height: '1.1rem', width: '4rem', borderRadius: '999px' }} />
              </div>
              <div className="uss-skeleton" style={{ height: '0.875rem', width: '100%' }} />
              <div className="uss-skeleton" style={{ height: '0.875rem', width: '75%' }} />
              <div className="uss-skeleton" style={{ height: '2.25rem', width: '8rem', marginTop: '0.25rem' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
