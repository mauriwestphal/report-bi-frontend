export interface MonitorList {
  id: number
  identifier: string
  name: string
  alias: string
  description: string
  isActive: boolean
}

export interface MonitorEmbed extends MonitorList {
  report: {
    accessToken: string
    embedUrl: string
    pageName: string
  }
}
