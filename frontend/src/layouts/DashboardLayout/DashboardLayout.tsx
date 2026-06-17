import { BarChart3, Home, LogOut, Menu, PieChart, UserRound, WalletCards, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import type { DashboardLayoutProps } from '@/layouts/DashboardLayout/DashboardLayout.types';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Oportunidades', href: '/dashboard', icon: WalletCards },
  { label: 'Simulaciones', href: '/dashboard', icon: PieChart },
  { label: 'Portafolio', href: '/dashboard', icon: BarChart3 },
  { label: 'Perfil', href: '/profile', icon: UserRound },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, clearSession } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUiStore();

  const handleLogout = () => {
    clearSession();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => navigate('/dashboard')}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-black text-white">
              J
            </span>
            <span>
              <span className="block text-xl font-black text-slate-950">JICA</span>
              <span className="block text-xs font-medium text-slate-500">Fintech Investment</span>
            </span>
          </button>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 lg:hidden"
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-950">{user?.fullName ?? 'Inversionista'}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{user?.email ?? 'Sesion local JICA'}</p>
          <Button type="button" variant="ghost" className="mt-3 w-full justify-start px-3" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {isSidebarOpen ? <button className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={closeSidebar} aria-label="Cerrar menú" /> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 lg:hidden"
              onClick={toggleSidebar}
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div>
              <p className="text-sm font-medium text-slate-500">MVP académico</p>
              <h1 className="text-lg font-bold text-slate-950">Información financiera confiable para invertir</h1>
            </div>
            <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:block">
              Conectado
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
