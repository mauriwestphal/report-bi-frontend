'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { models } from 'powerbi-client'
import type { MonitorEmbed } from '@/lib/types/monitors'
import { PowerBiSkeleton } from './PowerBiSkeleton'

const PowerBIEmbed = dynamic(
  () => import('powerbi-client-react').then((m) => m.PowerBIEmbed),
  { ssr: false }
)

interface Props {
  monitor: MonitorEmbed
  isPublic?: boolean
}

const IS_DEV = process.env.NODE_ENV === 'development'
const SKELETON_TIMEOUT_MS = 10_000
const REFRESH_INTERVAL_MS = 30 * 60 * 1000

export function PowerBiViewer({ monitor, isPublic }: Props) {
  const { accessToken, embedUrl } = monitor.report
  const reportId = new URL(embedUrl).searchParams.get('reportId') ?? ''

  const [embedKey, setEmbedKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-refresh every 30 minutes to pick up a fresh token
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true)
      setEmbedKey((prev) => prev + 1)
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  // In dev mode the token is invalid so 'loaded' will never fire — hide skeleton after timeout
  useEffect(() => {
    if (!IS_DEV) return
    const timeout = setTimeout(() => setIsLoading(false), SKELETON_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [embedKey])

  const embedConfig = {
    type: 'report' as const,
    id: reportId,
    embedUrl,
    accessToken,
    tokenType: models.TokenType.Aad,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: false },
      },
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth,
      },
    },
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
    >
      {!isPublic && (
        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid var(--border-default)',
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-strong)',
            }}
          >
            {monitor.name}
          </h1>
        </div>
      )}

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {isLoading && <PowerBiSkeleton />}

        <div style={{ width: '100%', height: '100%', visibility: isLoading ? 'hidden' : 'visible' }}>
          <PowerBIEmbed
            key={embedKey}
            embedConfig={embedConfig}
            cssClassName="powerbi-embed"
            eventHandlers={
              new Map([
                ['loaded', () => setIsLoading(false)],
                ['error', (event: unknown) => console.error('PowerBI error:', event)],
              ])
            }
          />
        </div>
      </div>

      <style>{`
        .powerbi-embed,
        .powerbi-embed iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
      `}</style>
    </div>
  )
}
