import * as z from 'zod'

export const monitorSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  identifier: z.string().uuid('El identificador debe ser un UUID válido'),
  reportPageId: z.number().min(1, 'La página de reporte es requerida'),
  description: z.string().optional().nullable(),
  enabled: z.boolean().default(true).optional(),
  // Campo opcional para URL de Power BI (si se agrega en el futuro)
  powerBiUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type MonitorFormValues = z.infer<typeof monitorSchema>

// Función para validar URL de Power BI
export const validatePowerBiUrl = (url: string): {isValid: boolean, message: string} => {
  if (!url) return {isValid: true, message: ''}
  
  try {
    const urlObj = new URL(url)
    
    // Verificar que sea una URL de Power BI
    if (!urlObj.hostname.includes('powerbi.com') && !urlObj.hostname.includes('app.powerbi.com')) {
      return {isValid: false, message: 'La URL debe ser de Power BI'}
    }
    
    // Verificar que sea una URL segura (HTTPS)
    if (urlObj.protocol !== 'https:') {
      return {isValid: false, message: 'La URL debe usar HTTPS'}
    }
    
    return {isValid: true, message: ''}
  } catch (error) {
    return {isValid: false, message: 'URL inválida'}
  }
}