import * as z from 'zod'

export const monitorSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  identifier: z.string().uuid('El identificador debe ser un UUID válido'),
  reportPageId: z.number().min(1, 'La página de reporte es requerida'),
  description: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
})

export type MonitorFormValues = z.infer<typeof monitorSchema>