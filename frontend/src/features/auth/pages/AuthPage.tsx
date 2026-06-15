import { useState } from 'react';
import { UserIcon, KeyIcon } from 'lucide-react';
import { AuthForm } from '../components/AuthForm';
import type { AuthTab } from '../types/auth.types';

const tabs: { key: AuthTab; label: string }[] = [
  { key: 'login', label: 'Iniciar sesión' },
  { key: 'register', label: 'Registro' },
];

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
        <div className="mb-6 flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <KeyIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Bienvenido a JICA</h1>
            <p className="mt-2 text-sm text-slate-600">
              Accede con tu cuenta de inversionista para explorar oportunidades y gestionar tus inversiones.
            </p>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-2 rounded-3xl bg-slate-100 p-1 sm:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-3xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">{activeTab === 'login' ? 'Accede a tu cuenta' : 'Crea tu cuenta'}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {activeTab === 'login'
                  ? 'Introduce tus credenciales para iniciar sesión.'
                  : 'Regístrate como inversionista para comenzar a invertir.'}
              </p>
            </div>

            <AuthForm activeTab={activeTab} />
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-slate-400/10">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100">
                  <UserIcon className="h-4 w-4" />
                  Inversionistas
                </span>
                <h3 className="text-2xl font-semibold">Accede rápidamente</h3>
                <p className="text-sm text-slate-100/90">
                  Gestiona tus inversiones y descubre oportunidades locales de forma segura.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-slate-100/90">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-medium">Sin costos ocultos</p>
                  <p>Regístrate como inversionista y comienza a invertir en pymes gastronómicas.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="font-medium">Protegido</p>
                  <p>Los datos se envían de forma segura al backend de JICA.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
