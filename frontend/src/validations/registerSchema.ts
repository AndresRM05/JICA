import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Ingrese al menos 2 caracteres.'),
  lastName: z.string().min(2, 'Ingrese al menos 2 caracteres.'),
  email: z.string().email('Ingrese un correo electrónico válido.'),
  phone: z.string().optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
