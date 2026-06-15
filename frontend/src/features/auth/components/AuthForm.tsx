import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthMutations } from '../hooks/useAuthMutations';
import { loginSchema, registerSchema } from '../validations/authSchema';
import type { AuthFormProps } from './AuthForm.types';
import type { LoginFormData, RegisterFormData } from '../types/auth.types';


export function AuthForm({ activeTab }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { registerMutation, loginMutation } = useAuthMutations();

  const schema = useMemo(() => (activeTab === 'login' ? loginSchema : registerSchema), [activeTab]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const isLoading = registerMutation.isLoading || loginMutation.isLoading;

  const onSubmit = (data: LoginFormData | RegisterFormData) => {
    if (activeTab === 'login') {
      loginMutation.mutate(data as LoginFormData);
      return;
    }

    registerMutation.mutate(data as RegisterFormData);
  };

  return (
    <form className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      {activeTab === 'register' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Nombre</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
              {...register('firstName')}
            />
            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName.message}</span>}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Apellido</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
              {...register('lastName')}
            />
            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName.message}</span>}
          </label>
        </div>
      )}

      <div className="space-y-4">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Correo electrónico</span>
          <input
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
            {...register('email')}
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Contraseña</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
        </label>
      </div>

      {(loginMutation.error || registerMutation.error) && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {loginMutation.error?.message ?? registerMutation.error?.message}
        </div>
      )}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        {activeTab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Al continuar aceptas los términos de uso de JICA.
      </p>
    </form>
  );
}
