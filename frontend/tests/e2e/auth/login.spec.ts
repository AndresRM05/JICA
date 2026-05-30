// /tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';
 
test.describe('Login', () => {
  test('debe redirigir al dashboard después de login exitoso como investor', async ({ page }) => {
    await page.goto('/login');
 
    await page.getByLabel(/correo electrónico/i).fill(process.env.PLAYWRIGHT_TEST_EMAIL!);
    await page.getByLabel(/contraseña/i).fill(process.env.PLAYWRIGHT_TEST_PASSWORD!);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
 
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/bienvenido/i)).toBeVisible();
  });
 
  test('debe mostrar mensaje de error con credenciales incorrectas', async ({ page }) => {
    await page.goto('/login');
 
    await page.getByLabel(/correo electrónico/i).fill('noexiste@jica.com');
    await page.getByLabel(/contraseña/i).fill('incorrecta');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
 
    await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});