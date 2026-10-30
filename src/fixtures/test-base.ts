import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { VacanciesPage } from '../pages/VacanciesPage';
import { VacancyFormPage } from '../pages/VacancyFormPage';

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  vacanciesPage: VacanciesPage;
  vacancyFormPage: VacancyFormPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  vacanciesPage: async ({ page }, use) => {
    await use(new VacanciesPage(page));
  },
  vacancyFormPage: async ({ page }, use) => {
    await use(new VacancyFormPage(page));
  },
});

export { expect } from '@playwright/test';
