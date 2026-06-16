import { z } from 'zod';

export const simulationSchema = z.object({
  amount: z.coerce.number().min(1, 'El monto debe ser mayor a 0.'),
});

export type SimulationFormData = z.infer<typeof simulationSchema>;
