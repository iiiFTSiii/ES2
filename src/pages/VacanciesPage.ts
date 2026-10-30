import { expect, type Locator, type Page } from '@playwright/test';
import { VacancyFormPage } from './VacancyFormPage';

export type VacancyStatus = 'Active' | 'Closed';

export class VacanciesPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly tableHeader: Locator;
  readonly tableRows: Locator;
  readonly noRecordsMessage: Locator;
  readonly deleteDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.tableHeader = page.locator('.oxd-table-header');
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsMessage = page.locator('.orangehrm-paper-container').getByText('No Records Found');
    this.deleteDialog = page.locator('.oxd-dialog-sheet');
  }

  private filterGroup(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({ hasText: label }).first();
  }

  async goto(): Promise<void> {
    const url = '/web/index.php/recruitment/viewJobVacancy';
    for (let attempt = 1; attempt <= 3; attempt++) {
      const filtersLoaded = this.page
        .waitForResponse(
          (response) => response.url().includes('/api/v2/recruitment/vacancies?model=summary'),
          { timeout: 5_000 },
        )
        .catch(() => null);
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      const loaded = await this.tableHeader
        .waitFor({ state: 'visible', timeout: attempt < 3 ? 10_000 : 30_000 })
        .then(() => true)
        .catch(() => false);
      if (loaded) {
        await filtersLoaded;
        return;
      }
    }
    throw new Error('Não foi possível carregar a lista de vacancies');
  }

  async openAdd(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForURL(/addJobVacancy/);
  }

  private async openFilter(label: string): Promise<Locator> {
    await this.filterGroup(label).locator('.oxd-select-text').click();
    const dropdown = this.page.locator('.oxd-select-dropdown').last();
    await expect(dropdown).toBeVisible();
    return dropdown;
  }

  async selectFilter(label: string, value: string): Promise<void> {
    const dropdown = await this.openFilter(label);
    await dropdown.locator('.oxd-select-option').filter({ hasText: value }).first().click();
  }

  async filterByVacancy(name: string): Promise<void> {
    await this.selectFilter('Vacancy', name);
  }

  async filterByJobTitle(title: string): Promise<void> {
    await this.selectFilter('Job Title', title);
  }

  async filterByHiringManager(name: string): Promise<void> {
    await this.selectFilter('Hiring Manager', name);
  }

  async filterByStatus(status: VacancyStatus): Promise<void> {
    await this.selectFilter('Status', status);
  }

  async search(): Promise<void> {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await this.page.waitForTimeout(1_000);
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await this.page.waitForTimeout(1_500);
  }

  async filterOptions(label: string): Promise<string[]> {
    const dropdown = await this.openFilter(label);
    const options = (await dropdown.locator('.oxd-select-option').allTextContents()).map((option) => option.trim());
    await dropdown.locator('.oxd-select-option').filter({ hasText: '-- Select --' }).first().click();
    await expect(dropdown).toBeHidden();
    return options;
  }

  async filterValues(): Promise<string[]> {
    return (await this.page.locator('.oxd-select-text-input').allTextContents()).map((value) => value.trim());
  }

  async expectVacancyOption(name: string, closed = false): Promise<void> {
    const options = await this.filterOptions('Vacancy');
    const expected = closed ? `${name} (Closed)` : name;
    expect(options.some((option) => option.startsWith(expected))).toBeTruthy();
  }

  async expectVacancyOptionAbsent(name: string): Promise<void> {
    const options = await this.filterOptions('Vacancy');
    expect(options.some((option) => option.startsWith(name))).toBeFalsy();
  }

  rowByName(name: string): Locator {
    return this.tableRows.filter({ hasText: name }).first();
  }

  async expectRow(name: string): Promise<Locator> {
    const row = this.rowByName(name);
    await expect(row).toBeVisible();
    return row;
  }

  async expectNoRow(name: string): Promise<void> {
    await expect(this.tableRows.filter({ hasText: name })).toHaveCount(0);
  }

  async expectNoRecords(): Promise<void> {
    await expect(this.noRecordsMessage).toBeVisible();
  }

  async getColumnTexts(index: number): Promise<string[]> {
    const cells = this.tableRows.locator(`.oxd-table-cell:nth-child(${index + 1})`);
    return (await cells.allTextContents()).map((text) => text.trim());
  }

  async getRowJobTitle(name: string): Promise<string> {
    const row = await this.expectRow(name);
    return (await row.locator('.oxd-table-cell').nth(2).innerText()).trim();
  }

  async getRowHiringManager(name: string): Promise<string> {
    const row = await this.expectRow(name);
    return (await row.locator('.oxd-table-cell').nth(3).innerText()).trim();
  }

  async getRowStatus(name: string): Promise<string> {
    const row = await this.expectRow(name);
    return (await row.locator('.oxd-table-cell').nth(4).innerText()).trim();
  }

  async openEdit(name: string): Promise<void> {
    const row = await this.expectRow(name);
    const vacancyLoaded = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        /\/api\/v2\/recruitment\/vacancies\/\d+$/.test(response.url()),
      { timeout: 20_000 },
    );
    await row.locator('button:has(.bi-pencil-fill)').click();
    await this.page.waitForURL(/addJobVacancy\/\d+/);
    await vacancyLoaded;
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await new VacancyFormPage(this.page).expectName(name);
  }

  async openDeleteDialog(name: string): Promise<Locator> {
    const row = await this.expectRow(name);
    await row.locator('button:has(.bi-trash)').click();
    await expect(this.deleteDialog).toBeVisible();
    return this.deleteDialog;
  }

  async confirmDelete(name: string): Promise<void> {
    await this.openDeleteDialog(name);
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await this.page.waitForTimeout(1_500);
  }

  async cancelDelete(name: string): Promise<void> {
    await this.openDeleteDialog(name);
    await this.page.getByRole('button', { name: 'No, Cancel' }).click();
    await expect(this.deleteDialog).toBeHidden();
  }
}
