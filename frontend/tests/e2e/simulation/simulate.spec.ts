import { expect, test } from '@playwright/test';
import { demoOpportunity, mockMvpApi } from '../mvp-fixtures';

test('investor can review details, simulate and confirm an investment intent', async ({ page }) => {
  await mockMvpApi(page);

  await page.goto('/login');
  await page.getByRole('button', { name: /^entrar$/i }).click();
  await page.getByRole('button', { name: /ver detalles/i }).click();

  await expect(page.getByRole('heading', { name: demoOpportunity.businessName })).toBeVisible();
  await expect(page.getByText(/análisis de riesgo/i)).toBeVisible();

  await page.getByRole('button', { name: /simular inversión/i }).click();
  await page.getByLabel(/monto de inversión/i).fill('1000');
  await page.getByRole('button', { name: /confirmar simulación/i }).click();

  await expect(page).toHaveURL(/\/simulations\/sim-costa-verde\/confirmation$/);
  await expect(page.getByText(/revise y confirme su intención/i)).toBeVisible();

  await page.getByRole('button', { name: /confirmar intención de inversión/i }).click();

  await expect(page.getByText(/intención de inversión registrada/i)).toBeVisible();
  await expect(page.getByText(/Costa Verde Café se pondrá en contacto contigo/i)).toBeVisible();
  await expect(page.getByText(/INT-8F31A2C4/i)).toBeVisible();
  await expect(page.getByText(/no representa todavía una transferencia de dinero/i)).toBeVisible();
});
