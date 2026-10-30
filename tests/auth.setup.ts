import { mkdirSync } from 'node:fs';
import { expect, test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('Autenticar no OrangeHRM demo', async ({ page }) => {
  mkdirSync('playwright/.auth', { recursive: true });

  const loginPage = new LoginPage(page);
  const username = process.env.OHRM_USERNAME ?? 'Admin';
  const password = process.env.OHRM_PASSWORD ?? 'admin123';

  for (let attempt = 1; attempt <= 5; attempt++) {
    await loginPage.goto();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });

    const response = await page.request.get('/web/index.php/api/v2/recruitment/vacancies?limit=1');
    if (response.ok()) {
      await page.context().storageState({ path: authFile });
      return;
    }

    await page.context().clearCookies();
    await page.waitForTimeout(3_000);
  }

  throw new Error('O demo não liberou o módulo Recruitment após 5 tentativas de login');
});
