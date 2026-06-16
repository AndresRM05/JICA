import { UserRound } from 'lucide-react';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useAuthStore } from '@/store/authStore';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="jica-card p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <UserRound className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Perfil</p>
            <h2 className="mt-1 text-3xl font-black text-slate-950">{user?.fullName ?? 'Usuario demo'}</h2>
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-sm font-semibold text-slate-700">Correo</dt>
            <dd className="mt-1 text-sm text-slate-500">{user?.email ?? 'demo@jica.local'}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-sm font-semibold text-slate-700">Rol</dt>
            <dd className="mt-1 text-sm text-slate-500">{user?.role ?? 'investor'}</dd>
          </div>
        </dl>
      </section>

      <StatusMessage
        title="Alcance MVP"
        message="El perfil se mantiene simple para la presentación. El flujo central del MVP es analizar oportunidades, simular y confirmar una inversión."
      />
    </div>
  );
}
