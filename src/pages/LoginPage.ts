import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly alertMessage: Locator;
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.alertMessage = page.locator('.oxd-alert-content-text');
    this.fieldErrors = page.locator('.oxd-input-field-error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.alertMessage).toHaveText(/Invalid credentials/i);
  }

  async expectRequiredErrors(count = 2): Promise<void> {
    await expect(this.fieldErrors).toHaveCount(count);
    for (const error of await this.fieldErrors.all()) {
      await expect(error).toHaveText('Required');
    }
  }
}
