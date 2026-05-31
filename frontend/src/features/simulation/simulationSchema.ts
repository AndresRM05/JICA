import { z } from 'zod';

export const simulationSchema = z.object({
  investmentId: z.string().min(1, 'Debe seleccionar una inversión.'),
  amount: z.number().positive('El monto debe ser mayor a cero.'),
});

export type SimulationFormData = z.infer<typeof simulationSchema>;