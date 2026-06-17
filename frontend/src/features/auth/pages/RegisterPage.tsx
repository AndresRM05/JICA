import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useAuthMutations } from '@/features/auth/hooks';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { registerSchema, type RegisterFormData } from '@/validations/registerSchema';

type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerMutation } = useAuthMutations();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    try {
      const parsedData = registerSchema.parse(formData);
      await registerMutation.mutateAsync(parsedData);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors({
          firstName: fieldErrors.firstName?.[0],
          lastName: fieldErrors.lastName?.[0],
          email: fieldErrors.email?.[0],
          phone: fieldErrors.phone?.[0],
          password: fieldErrors.password?.[0],
        });
      } else {
        setGeneralError(getUserFriendlyErrorMessage(error));
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-2xl font-black text-white">J</span>
          <div>
            <p className="text-sm font-semibold text-emerald-700">Registro de inversionista</p>
            <h1 className="text-2xl font-black text-slate-950">Crear cuenta en JICA</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Esta pantalla inicia el flujo principal validado del MVP: registro, dashboard, detalle, simulacion y confirmacion.
        </p>

        {generalError ? <div className="mt-6"><StatusMessage title="No se pudo registrar" message={generalError} variant="error" /></div> : null}

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Nombre" name="firstName" value={formData.firstName} error={errors.firstName} onChange={(event) => handleChange('firstName', event.target.value)} />
          <Input label="Apellido" name="lastName" value={formData.lastName} error={errors.lastName} onChange={(event) => handleChange('lastName', event.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Correo electronico" name="email" type="email" value={formData.email} error={errors.email} onChange={(event) => handleChange('email', event.target.value)} />
          </div>
          <Input label="Telefono" name="phone" value={formData.phone ?? ''} error={errors.phone} onChange={(event) => handleChange('phone', event.target.value)} />
          <Input label="Contrasena" name="password" type="password" value={formData.password} error={errors.password} onChange={(event) => handleChange('password', event.target.value)} />
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>Crear cuenta y entrar</Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ya tienes cuenta?{' '}
          <Link className="font-semibold text-emerald-700 hover:text-emerald-800" to="/auth">
            Iniciar sesion
          </Link>
        </p>
      </section>
    </main>
  );
}
