// /tests/e2e/simulation/simulate.spec.ts
import { test, expect } from '@playwright/test';
 
test.describe('Simulación de inversión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/correo electrónico/i).fill(process.env.PLAYWRIGHT_TEST_EMAIL!);
    await page.getByLabel(/contraseña/i).fill(process.env.PLAYWRIGHT_TEST_PASSWORD!);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await page.waitForURL('/dashboard');
  });
 
  test('debe calcular el retorno estimado al ingresar un monto válido', async ({ page }) => {
    await page.goto('/investments/1');
    await page.getByRole('button', { name: /simular inversión/i }).click();
 
    await page.getByLabel(/monto a invertir/i).fill('1000000');
 
    await expect(page.getByTestId('estimated-return')).toBeVisible();
    await expect(page.getByTestId('estimated-return')).not.toBeEmpty();
  });
 
  test('debe mostrar error si el monto ingresado es menor al mínimo permitido', async ({ page }) => {
    await page.goto('/investments/1');
    await page.getByRole('button', { name: /simular inversión/i }).click();
 
    await page.getByLabel(/monto a invertir/i).fill('100');
    await page.getByRole('button', { name: /calcular/i }).click();
 
    await expect(page.getByText(/monto mínimo/i)).toBeVisible();
  });
});