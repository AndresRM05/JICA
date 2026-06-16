import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Página no encontrada</h1>
        <p className="mt-3 text-sm text-slate-500">La ruta solicitada no forma parte del MVP de JICA.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button type="button">Volver al dashboard</Button>
        </Link>
      </section>
    </main>
  );
}
