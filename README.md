# ES2 — Automação de testes web com Playwright e Page Object

[![Playwright Tests](https://github.com/iiiFTSiii/ES2/actions/workflows/playwright.yml/badge.svg)](https://github.com/iiiFTSiii/ES2/actions/workflows/playwright.yml)

Projeto do desafio da disciplina de Engenharia de Software 2: automação de testes
E2E do site público [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)
para as funcionalidades de **Login** e **Recruitment > Vacancies** (adição,
edição, pesquisa e deleção).

## Tecnologias

- [Playwright](https://playwright.dev/) com TypeScript
- Padrão Page Object
- GitHub Actions para execução em CI

## Cenários

A lista completa de cenários, com critérios de caixa preta, passos em BDD
(Dado/Quando/Então) e rastreabilidade para os testes está em
[`cenarios.md`](./cenarios.md).

## Estrutura

```text
.
├── cenarios.md
├── playwright.config.ts
├── src/
│   ├── fixtures/test-base.ts
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── VacanciesPage.ts
│   │   └── VacancyFormPage.ts
│   └── utils/vacancy.ts
└── tests/
    ├── auth.setup.ts
    ├── login.spec.ts
    └── recruitment/
        ├── vacancies-add.spec.ts
        ├── vacancies-edit.spec.ts
        ├── vacancies-search.spec.ts
        └── vacancies-delete.spec.ts
```

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm ci
npx playwright install chromium
```

## Execução

```bash
npm test
```

Outros comandos:

```bash
npm run test:headed   # executa com navegador visível
npm run test:ui       # abre o modo UI do Playwright
npm run test:login    # executa apenas os testes de login
npm run typecheck     # verifica os tipos TypeScript
npm run report        # abre o relatório HTML da última execução
```

O relatório HTML é gerado em `playwright-report/`. Em caso de falha, trace,
screenshot e vídeo ficam disponíveis em `test-results/`.

## Credenciais do demo

- Usuário: `Admin`
- Senha: `admin123`

As credenciais podem ser sobrescritas pelas variáveis de ambiente
`OHRM_USERNAME` e `OHRM_PASSWORD`.

## Estratégia dos testes

- O projeto `setup` realiza o login uma única vez e salva o estado em
  `playwright/.auth/user.json`; os testes que exigem autenticação reutilizam esse
  estado.
- Os testes de login limpam o estado e exercitam a tela de login real.
- Como o demo é público e compartilhado, cada teste cria dados com nomes únicos
  (`ES2-...`) e remove os registros no `afterEach`.
- Job Title e Hiring Manager são selecionados dinamicamente entre as opções
  disponíveis no demo, evitando dependência de dados fixos.
- A suíte roda com um worker para reduzir interferência entre testes em um
  ambiente compartilhado.

## CI

O workflow `.github/workflows/playwright.yml` executa o typecheck e a suíte no
Chromium a cada push ou pull request nas branches `main`/`master`, publicando o
relatório como artefato.
