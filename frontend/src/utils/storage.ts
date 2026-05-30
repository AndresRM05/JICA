// /src/utils/storage.ts
const STORAGE_KEYS = {
  THEME: 'jica:theme',
  DASHBOARD_FILTERS: 'jica:dashboard_filters',
  SIMULATION_STEP: 'jica:simulation_step',
} as const;
 
export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
 
export function getTheme(): 'light' | 'dark' {
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') ?? 'light';
}
 
export function setDashboardFilters(filters: DashboardFilters): void {
  sessionStorage.setItem(STORAGE_KEYS.DASHBOARD_FILTERS, JSON.stringify(filters));
}
 
export function getDashboardFilters(): DashboardFilters | null {
  const raw = sessionStorage.getItem(STORAGE_KEYS.DASHBOARD_FILTERS);
  return raw ? JSON.parse(raw) : null;
}