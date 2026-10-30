import { expect, type Page } from '@playwright/test';
import { VacanciesPage } from '../pages/VacanciesPage';
import { VacancyFormPage } from '../pages/VacancyFormPage';

export interface CreatedVacancy {
  name: string;
  jobTitle: string;
  hiringManager: string;
}

export interface CreateVacancyOptions {
  active?: boolean;
  positions?: string;
  description?: string;
}

export function uniqueVacancyName(prefix: string): string {
  const worker = process.env.TEST_WORKER_INDEX ?? '0';
  const sanitized = prefix
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  return `ES2-${sanitized}-${Date.now()}-${worker}`;
}

export async function createVacancy(
  page: Page,
  name: string,
  options: CreateVacancyOptions = {},
): Promise<CreatedVacancy> {
  const vacancies = new VacanciesPage(page);
  const form = new VacancyFormPage(page);

  await vacancies.goto();
  await vacancies.openAdd();
  await form.expectLoaded();

  await form.fillVacancyName(name);
  const jobTitle = await form.selectFirstJobTitle();
  const hiringManager = await form.selectFirstHiringManager();

  if (options.description) await form.fillDescription(options.description);
  if (options.positions) await form.fillPositions(options.positions);
  await form.setActive(options.active ?? true);
  await form.save();

  await expect(page).toHaveURL(/addJobVacancy\/\d+/, { timeout: 20_000 });
  return { name, jobTitle, hiringManager };
}

export async function deleteVacancyIfExists(page: Page, name: string): Promise<void> {
  const vacancies = new VacanciesPage(page);

  await vacancies.goto();
  const options = await vacancies.filterOptions('Vacancy');
  if (!options.some((option) => option.startsWith(name))) return;

  await vacancies.filterByVacancy(name);
  await vacancies.search();
  await vacancies.confirmDelete(name);
}
