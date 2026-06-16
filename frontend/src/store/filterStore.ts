import { create } from 'zustand';
import type { RiskLevel } from '@/features/investments/types/investment.types';

export interface DashboardFilters {
  riskLevel?: RiskLevel | 'all';
  search?: string;
}

interface FilterState {
  dashboardFilters: DashboardFilters;
  setDashboardFilters: (filters: DashboardFilters) => void;
  resetDashboardFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  dashboardFilters: { riskLevel: 'all', search: '' },
  setDashboardFilters: (dashboardFilters) => set({ dashboardFilters }),
  resetDashboardFilters: () => set({ dashboardFilters: { riskLevel: 'all', search: '' } }),
}));
