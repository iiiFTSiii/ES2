import { expect, test } from '../../src/fixtures/test-base';
import {
  createVacancy,
  deleteVacancyIfExists,
  uniqueVacancyName,
} from '../../src/utils/vacancy';

let vacancyToCleanup: string | undefined;

test.describe('Recruitment - Adição de vacancies', () => {
  test.afterEach(async ({ page }) => {
    if (!vacancyToCleanup) return;
    const name = vacancyToCleanup;
    vacancyToCleanup = undefined;
    await deleteVacancyIfExists(page, name).catch(() => {});
  });

  test('CT-VAC-ADD-01 - Cadastrar vacancy com todos os campos', async ({
    page,
    vacanciesPage,
  }) => {
    vacancyToCleanup = uniqueVacancyName('add-full');
    const created = await createVacancy(page, vacancyToCleanup, {
      description: 'Descrição criada pela automação',
      positions: '2',
    });

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created.name);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created.name);
    expect(await vacanciesPage.getRowJobTitle(created.name)).toBe(created.jobTitle);
    expect(await vacanciesPage.getRowStatus(created.name)).toBe('Active');
    expect((await vacanciesPage.getRowHiringManager(created.name)).length).toBeGreaterThan(0);
  });

  test('CT-VAC-ADD-02 - Cadastrar vacancy apenas com campos obrigatórios', async ({
    page,
    vacanciesPage,
  }) => {
    vacancyToCleanup = uniqueVacancyName('add-min');
    const created = await createVacancy(page, vacancyToCleanup);

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created.name);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created.name);
    expect(await vacanciesPage.getRowStatus(created.name)).toBe('Active');
  });

  test('CT-VAC-ADD-03 - Impedir cadastro sem Vacancy Name', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.selectFirstJobTitle();
    await vacancyFormPage.selectFirstHiringManager();

    await vacancyFormPage.save();

    await vacancyFormPage.expectRequiredError('Vacancy Name');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-04 - Impedir cadastro sem Job Title', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(uniqueVacancyName('add-no-job'));
    await vacancyFormPage.selectFirstHiringManager();

    await vacancyFormPage.save();

    await vacancyFormPage.expectRequiredError('Job Title');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-05 - Impedir cadastro sem Hiring Manager', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(uniqueVacancyName('add-no-manager'));
    await vacancyFormPage.selectFirstJobTitle();

    await vacancyFormPage.save();

    await vacancyFormPage.expectRequiredError('Hiring Manager');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-06 - Impedir cadastro com todos os obrigatórios vazios', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();

    await vacancyFormPage.save();

    await vacancyFormPage.expectRequiredErrors(3);
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-07 - Impedir cadastro com nome duplicado', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = uniqueVacancyName('add-dup');
    await createVacancy(page, vacancyToCleanup);

    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(vacancyToCleanup);
    await vacancyFormPage.selectFirstJobTitle();
    await vacancyFormPage.selectFirstHiringManager();

    await vacancyFormPage.save();

    await vacancyFormPage.expectErrorMessage('Already exists');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-08 - Cadastrar vacancy inativa como Closed', async ({
    page,
    vacanciesPage,
  }) => {
    vacancyToCleanup = uniqueVacancyName('add-inactive');
    const created = await createVacancy(page, vacancyToCleanup, { active: false });

    await vacanciesPage.goto();
    await vacanciesPage.filterByVacancy(created.name);
    await vacanciesPage.search();

    await vacanciesPage.expectRow(created.name);
    expect(await vacanciesPage.getRowStatus(created.name)).toBe('Closed');
    await vacanciesPage.expectVacancyOption(created.name, true);
  });

  test('CT-VAC-ADD-09 - Rejeitar Number of Positions não numérico', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(uniqueVacancyName('add-non-numeric'));
    await vacancyFormPage.selectFirstJobTitle();
    await vacancyFormPage.selectFirstHiringManager();
    await vacancyFormPage.fillPositions('abc');

    await vacancyFormPage.save();

    await vacancyFormPage.expectErrorMessage('Should be a numeric value');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-10 - Rejeitar Number of Positions fora do intervalo 1-99', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    vacancyToCleanup = undefined;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(uniqueVacancyName('add-zero-positions'));
    await vacancyFormPage.selectFirstJobTitle();
    await vacancyFormPage.selectFirstHiringManager();
    await vacancyFormPage.fillPositions('0');

    await vacancyFormPage.save();

    await vacancyFormPage.expectErrorMessage('Should be a number between 1-99');
    await expect(page).toHaveURL(/addJobVacancy$/);
  });

  test('CT-VAC-ADD-11 - Cancelar cadastro sem criar vacancy', async ({
    page,
    vacanciesPage,
    vacancyFormPage,
  }) => {
    const name = uniqueVacancyName('add-cancel');
    vacancyToCleanup = name;
    await vacanciesPage.goto();
    await vacanciesPage.openAdd();
    await vacancyFormPage.expectLoaded();
    await vacancyFormPage.fillVacancyName(name);
    await vacancyFormPage.selectFirstJobTitle();
    await vacancyFormPage.selectFirstHiringManager();

    await vacancyFormPage.cancel();

    await expect(page).toHaveURL(/viewJobVacancy/);
    await vacanciesPage.expectVacancyOptionAbsent(name);
  });
});
