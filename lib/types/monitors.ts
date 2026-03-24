export interface MonitorEmbed {
  id: number
  identifier: string
  name: string
  alias: string
  description: string
  isActive: boolean
  report: {
    accessToken: string
    embedUrl: string
    pageName: string
  }
}
