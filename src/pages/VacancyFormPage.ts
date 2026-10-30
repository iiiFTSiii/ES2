import { expect, type Locator, type Page } from '@playwright/test';

export class VacancyFormPage {
  readonly page: Page;
  readonly vacancyNameInput: Locator;
  readonly jobTitleSelect: Locator;
  readonly descriptionInput: Locator;
  readonly hiringManagerInput: Locator;
  readonly positionsInput: Locator;
  readonly activeSwitch: Locator;
  readonly publishSwitch: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly fieldErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vacancyNameInput = this.group('Vacancy Name').locator('input');
    this.jobTitleSelect = this.group('Job Title').locator('.oxd-select-text');
    this.descriptionInput = this.group('Description').locator('textarea');
    this.hiringManagerInput = this.group('Hiring Manager').locator('input[placeholder="Type for hints..."]');
    this.positionsInput = this.group('Number of Positions').locator('input');
    this.activeSwitch = page.locator('.oxd-switch-wrapper .oxd-switch-input').first();
    this.publishSwitch = page.locator('.oxd-switch-wrapper .oxd-switch-input').nth(1);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.fieldErrors = page.locator('.oxd-input-field-error-message');
  }

  private group(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({ hasText: label }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.vacancyNameInput).toBeVisible();
    await expect(this.hiringManagerInput).toBeVisible();
  }

  async fillVacancyName(name: string): Promise<void> {
    await this.vacancyNameInput.fill(name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async fillPositions(positions: string): Promise<void> {
    await this.positionsInput.fill(positions);
  }

  async selectFirstJobTitle(): Promise<string> {
    await this.jobTitleSelect.click();
    const dropdown = this.page.locator('.oxd-select-dropdown').last();
    await expect(dropdown).toBeVisible();
    const options = dropdown.locator('.oxd-select-option');

    for (let attempt = 0; attempt < 30; attempt++) {
      const texts = (await options.allTextContents().catch(() => [])).map((text) => text.trim());
      const title = texts.find(
        (text) => text && text !== '-- Select --' && !/No Records Found|Searching/i.test(text),
      );
      if (title) {
        await options.filter({ hasText: title }).first().click();
        return title;
      }
      await this.page.waitForTimeout(500);
    }

    throw new Error('Nenhum Job Title disponível no demo');
  }

  async selectJobTitle(title: string): Promise<void> {
    await this.jobTitleSelect.click();
    const dropdown = this.page.locator('.oxd-select-dropdown').last();
    await expect(dropdown).toBeVisible();
    await dropdown.locator('.oxd-select-option').filter({ hasText: title }).first().click();
  }

  async selectFirstHiringManager(): Promise<string> {
    for (const hint of ['a', 'e', 'i', 'o', 'u']) {
      await this.hiringManagerInput.fill(hint);
      for (let attempt = 0; attempt < 20; attempt++) {
        const options = this.page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
        const texts = (await options.allTextContents().catch(() => [])).map((text) => text.trim());
        const name = texts.find((text) => text && !/No Records Found|Searching/i.test(text));
        if (name) {
          await options.filter({ hasText: name }).first().click();
          return name;
        }
        await this.page.waitForTimeout(500);
      }
    }
    throw new Error('Nenhum Hiring Manager disponível no demo');
  }

  async setActive(active: boolean): Promise<void> {
    const classes = (await this.activeSwitch.getAttribute('class')) ?? '';
    const isActive = classes.includes('oxd-switch-input--active');
    if (isActive !== active) {
      await this.activeSwitch.click();
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForTimeout(1_500);
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL(/viewJobVacancy/);
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  }

  async expectName(name: string): Promise<void> {
    await expect(this.vacancyNameInput).toHaveValue(name, { timeout: 20_000 });
  }

  async getVacancyName(): Promise<string> {
    return this.vacancyNameInput.inputValue();
  }

  async getDescription(): Promise<string> {
    return this.descriptionInput.inputValue();
  }

  async getPositions(): Promise<string> {
    return this.positionsInput.inputValue();
  }

  async expectRequiredError(field: string): Promise<void> {
    await expect(this.group(field).locator('.oxd-input-field-error-message')).toHaveText('Required');
  }

  async expectRequiredErrors(count: number): Promise<void> {
    await expect(this.fieldErrors).toHaveCount(count);
    for (const error of await this.fieldErrors.all()) {
      await expect(error).toHaveText('Required');
    }
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.fieldErrors.filter({ hasText: message }).first()).toBeVisible();
  }
}
