import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.userDropdown).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/auth\/login/);
  }
}
