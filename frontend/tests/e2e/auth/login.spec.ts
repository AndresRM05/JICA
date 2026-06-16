import { expect, test } from '@playwright/test';
import { demoOpportunity, mockMvpApi } from '../mvp-fixtures';

test('login lets an investor access the dashboard', async ({ page }) => {
  await mockMvpApi(page);

  await page.goto('/login');
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD;

  if (email) {
    await page.getByLabel(/correo electrónico/i).fill(email);
  }

  if (password) {
    await page.getByLabel(/contraseña/i).fill(password);
  }
  await page.getByRole('button', { name: /^entrar$/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: /oportunidades gastronómicas/i })).toBeVisible();
  await expect(page.getByText(demoOpportunity.businessName)).toBeVisible();
});
