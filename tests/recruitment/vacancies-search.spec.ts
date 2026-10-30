import { expect, test } from '../../src/fixtures/test-base';
import {
  createVacancy,
  deleteVacancyIfExists,
  uniqueVacancyName,
  type CreatedVacancy,
} from '../../src/utils/vacancy';

let created: CreatedVacancy | undefined;

test.describe('Recruitment - Pesquisa de vacancies', () => {
  test.beforeEach(async ({ page }) => {
    created = await createVacancy(page, uniqueVacancyName('search'), { positions: '3' });
  });

  test.afterEach(async ({ page }) => {
    if (!created) return;
    const name = created.name;
    created = undefined;
    await deleteVacancyIfExists(page, name).catch(() => {});
  });

  test('CT-VAC-SRC-01 - Pesquisar por Vacancy', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created!.name);
    await expect(vacanciesPage.tableRows).toHaveCount(1);
    expect(await vacanciesPage.getRowJobTitle(created!.name)).toBe(created!.jobTitle);
  });

  test('CT-VAC-SRC-02 - Pesquisar por Job Title', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByJobTitle(created!.jobTitle);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created!.name);
    const jobTitles = await vacanciesPage.getColumnTexts(2);
    expect(jobTitles.length).toBeGreaterThan(0);
    expect(jobTitles.every((jobTitle) => jobTitle === created!.jobTitle)).toBeTruthy();
  });

  test('CT-VAC-SRC-03 - Pesquisar por Hiring Manager', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    const hiringManager = await vacanciesPage.getRowHiringManager(created!.name);

    await vacanciesPage.reset();
    await vacanciesPage.filterByHiringManager(hiringManager);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created!.name);
    expect(hiringManager.length).toBeGreaterThan(0);
  });

  test('CT-VAC-SRC-04 - Pesquisar por Status', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByStatus('Active');
    await vacanciesPage.search();

    const statuses = await vacanciesPage.getColumnTexts(4);
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses.every((status) => status === 'Active')).toBeTruthy();
  });

  test('CT-VAC-SRC-05 - Pesquisar com filtros combinados', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.filterByJobTitle(created!.jobTitle);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created!.name);
    await expect(vacanciesPage.tableRows).toHaveCount(1);
  });

  test('CT-VAC-SRC-06 - Pesquisa sem resultados', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.filterByStatus('Closed');
    await vacanciesPage.search();

    await vacanciesPage.expectNoRecords();
  });

  test('CT-VAC-SRC-07 - Reset limpa os filtros', async ({ vacanciesPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.filterByStatus('Active');
    await vacanciesPage.search();
    await vacanciesPage.expectRow(created!.name);

    await vacanciesPage.reset();

    await expect.poll(() => vacanciesPage.filterValues()).toEqual([
      '-- Select --',
      '-- Select --',
      '-- Select --',
      '-- Select --',
    ]);
  });
});
