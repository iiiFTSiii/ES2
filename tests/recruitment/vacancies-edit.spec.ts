import { expect, test } from '../../src/fixtures/test-base';
import {
  createVacancy,
  deleteVacancyIfExists,
  uniqueVacancyName,
  type CreatedVacancy,
} from '../../src/utils/vacancy';

let created: CreatedVacancy | undefined;
const namesToCleanup = new Set<string>();

test.describe('Recruitment - Edição de vacancies', () => {
  test.beforeEach(async ({ page }) => {
    const name = uniqueVacancyName('edit');
    namesToCleanup.add(name);
    created = await createVacancy(page, name, { positions: '2' });
  });

  test.afterEach(async ({ page }) => {
    for (const name of namesToCleanup) {
      await deleteVacancyIfExists(page, name).catch(() => {});
    }
    namesToCleanup.clear();
    created = undefined;
  });

  test('CT-VAC-EDT-01 - Editar nome, descrição e número de posições', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    const newName = uniqueVacancyName('edit-renamed');
    namesToCleanup.add(newName);

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.openEdit(created!.name);
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.fillVacancyName(newName);
    await vacancyFormPage.fillDescription('Descrição atualizada pela automação');
    await vacancyFormPage.fillPositions('7');
    await vacancyFormPage.save();

    await expect(page).toHaveURL(/addJobVacancy\/\d+/);
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(newName);
    await vacanciesPage.search();
    await vacanciesPage.expectRow(newName);

    await vacanciesPage.openEdit(newName);
    expect(await vacancyFormPage.getVacancyName()).toBe(newName);
    expect(await vacancyFormPage.getDescription()).toBe('Descrição atualizada pela automação');
    expect(await vacancyFormPage.getPositions()).toBe('7');

    await vacanciesPage.goto();
    await vacanciesPage.expectVacancyOptionAbsent(created!.name);
  });

  test('CT-VAC-EDT-02 - Editar status para Closed', async ({ vacanciesPage, vacancyFormPage }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.openEdit(created!.name);
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.setActive(false);
    await vacancyFormPage.save();

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    expect(await vacanciesPage.getRowStatus(created!.name)).toBe('Closed');
    await vacanciesPage.expectVacancyOption(created!.name, true);
  });

  test('CT-VAC-EDT-03 - Cancelar edição sem persistir alterações', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    const temporaryName = uniqueVacancyName('edit-cancelled');
    namesToCleanup.add(temporaryName);

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.openEdit(created!.name);
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.fillVacancyName(temporaryName);
    await vacancyFormPage.cancel();

    await expect(page).toHaveURL(/viewJobVacancy/);
    await vacanciesPage.expectVacancyOptionAbsent(temporaryName);
    await vacanciesPage.expectVacancyOption(created!.name);
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.expectRow(created!.name);
  });

  test('CT-VAC-EDT-04 - Impedir edição removendo campo obrigatório', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created!.name);
    await vacanciesPage.search();
    await vacanciesPage.openEdit(created!.name);
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.fillVacancyName('');
    await vacancyFormPage.save();

    await vacancyFormPage.expectRequiredError('Vacancy Name');
    await expect(page).toHaveURL(/addJobVacancy\/\d+/);

    await vacancyFormPage.cancel();
  });

  test('CT-VAC-EDT-05 - Impedir edição com nome duplicado', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    const secondName = uniqueVacancyName('edit-dup');
    namesToCleanup.add(secondName);
    await createVacancy(page, secondName);

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(secondName);
    await vacanciesPage.search();
    await vacanciesPage.openEdit(secondName);
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.fillVacancyName(created!.name);
    await vacancyFormPage.save();

    await vacancyFormPage.expectErrorMessage('Already exists');
    await expect(page).toHaveURL(/addJobVacancy\/\d+/);
    await vacancyFormPage.cancel();
  });
});
