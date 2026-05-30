// /tests/unit/features/investments/hooks/useInvestments.test.ts
import { vi } from 'vitest';
import * as investmentService from '@/services/investmentService';
 
vi.spyOn(investmentService, 'getAvailableInvestments').mockResolvedValue([
  { id: '1', name: 'Restaurante El Sabor', roi: 12, riskLevel: 'low', minAmount: 500000 },
]);