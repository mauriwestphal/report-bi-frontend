import * as z from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  keyName: z.string().min(1, 'El keyName es requerido'),
  description: z.string().optional().nullable(),
  isActive: z.boolean(),
  permissionIds: z.array(z.number()), 
  reportPageIds: z.array(z.number()),
})

export type RoleFormValues = z.infer<typeof roleSchema>