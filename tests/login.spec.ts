import { expect, test } from '../src/fixtures/test-base';

test.use({ storageState: { cookies: [], origins: [] } });

const username = process.env.OHRM_USERNAME ?? 'Admin';
const password = process.env.OHRM_PASSWORD ?? 'admin123';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-LOG-01 - Login com credenciais válidas', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });
    await dashboardPage.expectLoaded();
  });

  test('CT-LOG-02 - Login com senha inválida', async ({ loginPage, page }) => {
    await loginPage.login(username, 'senha-invalida');

    await loginPage.expectInvalidCredentials();
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('CT-LOG-03 - Login com usuário e senha vazios', async ({ loginPage, page }) => {
    await loginPage.loginButton.click();

    await loginPage.expectRequiredErrors(2);
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('CT-LOG-04 - Login com senha vazia', async ({ loginPage, page }) => {
    await loginPage.usernameInput.fill(username);
    await loginPage.loginButton.click();

    await loginPage.expectRequiredErrors(1);
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('CT-LOG-05 - Login com usuário vazio', async ({ loginPage, page }) => {
    await loginPage.passwordInput.fill(password);
    await loginPage.loginButton.click();

    await loginPage.expectRequiredErrors(1);
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('CT-LOG-06 - Logout após login válido', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/dashboard/, { timeout: 30_000 });

    await dashboardPage.logout();

    await expect(page).toHaveURL(/auth\/login/);
  });
});
