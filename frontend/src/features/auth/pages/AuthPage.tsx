import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useAuthMutations } from '@/features/auth/hooks';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { loginSchema, type LoginFormData } from '@/validations/loginSchema';

type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

export function AuthPage() {
  const navigate = useNavigate();
  const { loginMutation } = useAuthMutations();
  const [formData, setFormData] = useState<LoginFormData>({ email: 'inversionista1@jica.local', password: 'Password123!' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    try {
      const parsedData = loginSchema.parse(formData);
      await loginMutation.mutateAsync(parsedData);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
      } else {
        setGeneralError(getUserFriendlyErrorMessage(error));
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-emerald-900 p-8 text-white lg:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-black text-emerald-800">J</div>
          <h1 className="mt-8 text-4xl font-black tracking-tight">JICA</h1>
          <p className="mt-4 max-w-md text-lg text-emerald-50">
            Marketplace financiero para analizar pymes gastronómicas y registrar inversiones con datos claros.
          </p>
          <div className="mt-10 rounded-2xl bg-white/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">Credenciales locales</p>
            <p className="mt-3 text-sm text-emerald-50">Correo: inversionista1@jica.local</p>
            <p className="mt-1 text-sm text-emerald-50">Contrasena: Password123!</p>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <p className="text-sm font-semibold text-emerald-700">Iniciar sesion</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Accede al dashboard</h2>
          <p className="mt-3 text-sm text-slate-500">El flujo MVP permite entrar con el usuario local o con una cuenta registrada.</p>

          {generalError ? <div className="mt-6"><StatusMessage title="No se pudo iniciar sesion" message={generalError} variant="error" /></div> : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Correo electronico"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={(event) => handleChange('email', event.target.value)}
            />
            <Input
              label="Contrasena"
              name="password"
              type="password"
              value={formData.password}
              error={errors.password}
              onChange={(event) => handleChange('password', event.target.value)}
            />
            <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>Entrar</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No tienes cuenta?{' '}
            <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/register">
              Crear cuenta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
