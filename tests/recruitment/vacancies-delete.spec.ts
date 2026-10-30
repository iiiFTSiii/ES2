import { expect, test } from '../../src/fixtures/test-base';
import {
  createVacancy,
  deleteVacancyIfExists,
  uniqueVacancyName,
  type CreatedVacancy,
} from '../../src/utils/vacancy';

let created: CreatedVacancy | undefined;

test.describe('Recruitment - Deleção de vacancies', () => {
  test.beforeEach(async ({ page }) => {
    created = await createVacancy(page, uniqueVacancyName('delete'));
  });

  test.afterEach(async ({ page }) => {
    if (!created) return;
    const name = created.name;
    created = undefined;
    await deleteVacancyIfExists(page, name).catch(() => {});
  });

  test('CT-VAC-DEL-01 - Excluir vacancy confirmando a operação', async ({
    page,
    vacanciesPage,
  }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();

    const dialog = await vacanciesPage.openDeleteDialog(created!.name);
    await expect(dialog).toContainText(/Are you Sure/i);
    await expect(dialog).toContainText(/permanently deleted/i);
    await page.getByRole('button', { name: 'Yes, Delete' }).click();
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1_500);

    await vacanciesPage.goto();
    await vacanciesPage.expectVacancyOptionAbsent(created!.name);
  });

  test('CT-VAC-DEL-02 - Cancelar exclusão mantendo a vacancy', async ({
    page,
    vacanciesPage,
  }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();

    const dialog = await vacanciesPage.openDeleteDialog(created!.name);
    await expect(dialog).toContainText(/Are you Sure/i);
    await page.getByRole('button', { name: 'No, Cancel' }).click();
    await expect(dialog).toBeHidden();

    await vacanciesPage.goto();
    await vacanciesPage.expectVacancyOption(created!.name);
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.expectRow(created!.name);
  });
});
