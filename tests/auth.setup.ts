import { mkdirSync } from 'node:fs';
import { expect, test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('Autenticar no OrangeHRM demo', async ({ page }) => {
  mkdirSync('playwright/.auth', { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.OHRM_USERNAME ?? 'Admin', process.env.OHRM_PASSWORD ?? 'admin123');

  await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
  await page.context().storageState({ path: authFile });
});
