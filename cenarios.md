# Cenários de teste — OrangeHRM Demo

Este documento lista os cenários de teste de caixa preta para o site
<https://opensource-demo.orangehrmlive.com/> nas funcionalidades de **Login** e
**Recruitment > Vacancies** (adição, edição, pesquisa e deleção).

## Observações sobre o ambiente

- Credenciais do demo: usuário `Admin` e senha `admin123`.
- O demo é público e compartilhado. Por isso, os testes criam vacancies com nomes
  únicos (`ES2-...`) e removem os registros ao final.
- Os campos **Job Title** e **Hiring Manager** são preenchidos com valores
  disponíveis no momento da execução. O demo pode ser reiniciado e ter seus dados
  alterados, portanto os testes não dependem de nomes fixos de cargos ou pessoas.
- A vacancy inativa é exibida com status **Closed** na listagem e como
  `Nome (Closed)` no filtro de Vacancy.
- O botão `Add` e a tabela ficam em `/web/index.php/recruitment/viewJobVacancy`.
  O formulário de adição/edição fica em `/web/index.php/recruitment/addJobVacancy`
  (edição inclui o id na URL).

## Resumo dos cenários

| ID | Funcionalidade | Prioridade | Tipo |
|---|---|---|---|
| CT-LOG-01 | Login com credenciais válidas | Alta | Positivo |
| CT-LOG-02 | Login com senha inválida | Alta | Negativo |
| CT-LOG-03 | Login com usuário e senha vazios | Alta | Negativo |
| CT-LOG-04 | Login com senha vazia | Média | Negativo |
| CT-LOG-05 | Login com usuário vazio | Média | Negativo |
| CT-LOG-06 | Logout | Média | Positivo |
| CT-VAC-ADD-01 | Cadastrar vacancy com todos os campos | Alta | Positivo |
| CT-VAC-ADD-02 | Cadastrar vacancy apenas com obrigatórios | Alta | Positivo |
| CT-VAC-ADD-03 | Impedir cadastro sem Vacancy Name | Alta | Negativo |
| CT-VAC-ADD-04 | Impedir cadastro sem Job Title | Alta | Negativo |
| CT-VAC-ADD-05 | Impedir cadastro sem Hiring Manager | Alta | Negativo |
| CT-VAC-ADD-06 | Impedir cadastro com todos os obrigatórios vazios | Alta | Negativo |
| CT-VAC-ADD-07 | Impedir cadastro com nome duplicado | Alta | Negativo |
| CT-VAC-ADD-08 | Cadastrar vacancy inativa como Closed | Média | Positivo |
| CT-VAC-ADD-09 | Rejeitar Number of Positions não numérico | Média | Negativo |
| CT-VAC-ADD-10 | Rejeitar Number of Positions fora do intervalo 1-99 | Média | Negativo |
| CT-VAC-ADD-11 | Cancelar cadastro sem criar vacancy | Média | Positivo |
| CT-VAC-SRC-01 | Pesquisar por Vacancy | Alta | Positivo |
| CT-VAC-SRC-02 | Pesquisar por Job Title | Alta | Positivo |
| CT-VAC-SRC-03 | Pesquisar por Hiring Manager | Alta | Positivo |
| CT-VAC-SRC-04 | Pesquisar por Status | Média | Positivo |
| CT-VAC-SRC-05 | Pesquisar com filtros combinados | Alta | Positivo |
| CT-VAC-SRC-06 | Pesquisa sem resultados | Média | Negativo |
| CT-VAC-SRC-07 | Reset limpa os filtros | Média | Positivo |
| CT-VAC-EDT-01 | Editar nome, descrição e número de posições | Alta | Positivo |
| CT-VAC-EDT-02 | Editar status para Closed | Alta | Positivo |
| CT-VAC-EDT-03 | Cancelar edição sem persistir alterações | Média | Positivo |
| CT-VAC-EDT-04 | Impedir edição removendo campo obrigatório | Alta | Negativo |
| CT-VAC-EDT-05 | Impedir edição com nome duplicado | Alta | Negativo |
| CT-VAC-DEL-01 | Excluir vacancy confirmando a operação | Alta | Positivo |
| CT-VAC-DEL-02 | Cancelar exclusão mantendo a vacancy | Média | Positivo |

---

## Login

### CT-LOG-01 — Login com credenciais válidas

- **Prioridade:** Alta
- **Tipo:** Positivo
- **Pré-condição:** estar na página de login.
- **Dados:** usuário `Admin`, senha `admin123`.

**Cenário:**
Dado que estou na página de login
Quando preencho o usuário com "Admin"
E preencho a senha com "admin123"
E clico no botão "Login"
Então sou redirecionado para o Dashboard
E o menu do usuário está visível

### CT-LOG-02 — Login com senha inválida

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar na página de login.
- **Dados:** usuário `Admin`, senha `senha-invalida`.

**Cenário:**
Dado que estou na página de login
Quando preencho o usuário com "Admin"
E preencho a senha com "senha-invalida"
E clico no botão "Login"
Então é exibida a mensagem "Invalid credentials"
E permaneço na página de login

### CT-LOG-03 — Login com usuário e senha vazios

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar na página de login.

**Cenário:**
Dado que estou na página de login
Quando clico no botão "Login" sem preencher usuário e senha
Então é exibida a mensagem "Required" nos dois campos
E permaneço na página de login

### CT-LOG-04 — Login com senha vazia

- **Prioridade:** Média
- **Tipo:** Negativo
- **Pré-condição:** estar na página de login.
- **Dados:** usuário `Admin`.

**Cenário:**
Dado que estou na página de login
Quando preencho apenas o usuário com "Admin"
E clico no botão "Login"
Então é exibida a mensagem "Required" apenas no campo de senha
E permaneço na página de login

### CT-LOG-05 — Login com usuário vazio

- **Prioridade:** Média
- **Tipo:** Negativo
- **Pré-condição:** estar na página de login.
- **Dados:** senha `admin123`.

**Cenário:**
Dado que estou na página de login
Quando preencho apenas a senha com "admin123"
E clico no botão "Login"
Então é exibida a mensagem "Required" apenas no campo de usuário
E permaneço na página de login

### CT-LOG-06 — Logout após login válido

- **Prioridade:** Média
- **Tipo:** Positivo
- **Pré-condição:** estar autenticado no sistema.
- **Dados:** usuário `Admin`, senha `admin123`.

**Cenário:**
Dado que estou autenticado no sistema
Quando abro o menu do usuário
E clico em "Logout"
Então sou redirecionado para a página de login

---

## Recruitment — Adição de vacancies

### CT-VAC-ADD-01 — Cadastrar vacancy com todos os campos

- **Prioridade:** Alta
- **Tipo:** Positivo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.
- **Dados:** nome único, Job Title disponível, Hiring Manager disponível,
  descrição e 2 posições.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho todos os campos obrigatórios e opcionais
E clico em "Save"
Então sou redirecionado para a página da vacancy salva
E a vacancy aparece na pesquisa por nome
E o Job Title e o status "Active" são exibidos na linha

### CT-VAC-ADD-02 — Cadastrar vacancy apenas com campos obrigatórios

- **Prioridade:** Alta
- **Tipo:** Positivo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.
- **Dados:** nome único, Job Title disponível e Hiring Manager disponível.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho apenas Vacancy Name, Job Title e Hiring Manager
E clico em "Save"
Então a vacancy é salva com sucesso
E aparece na pesquisa por nome com status "Active"

### CT-VAC-ADD-03 — Impedir cadastro sem Vacancy Name

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho Job Title e Hiring Manager
E deixo Vacancy Name vazio
E clico em "Save"
Então é exibida a mensagem "Required" no campo Vacancy Name
E a vacancy não é criada

### CT-VAC-ADD-04 — Impedir cadastro sem Job Title

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho Vacancy Name e Hiring Manager
E deixo Job Title sem seleção
E clico em "Save"
Então é exibida a mensagem "Required" no campo Job Title
E a vacancy não é criada

### CT-VAC-ADD-05 — Impedir cadastro sem Hiring Manager

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho Vacancy Name e Job Title
E deixo Hiring Manager vazio
E clico em "Save"
Então é exibida a mensagem "Required" no campo Hiring Manager
E a vacancy não é criada

### CT-VAC-ADD-06 — Impedir cadastro com todos os obrigatórios vazios

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando deixo todos os campos obrigatórios vazios
E clico em "Save"
Então são exibidas três mensagens "Required"
E a vacancy não é criada

### CT-VAC-ADD-07 — Impedir cadastro com nome duplicado

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** existir uma vacancy cadastrada com o nome informado.
- **Dados:** nome de uma vacancy já existente.

**Cenário:**
Dado que já existe uma vacancy com o nome "X"
Quando cadastro uma nova vacancy utilizando o mesmo nome "X"
E preencho os demais campos obrigatórios
E clico em "Save"
Então é exibida a mensagem "Already exists"
E a nova vacancy não é criada

### CT-VAC-ADD-08 — Cadastrar vacancy inativa como Closed

- **Prioridade:** Média
- **Tipo:** Positivo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho os campos obrigatórios
E desativo o campo "Active"
E clico em "Save"
Então a vacancy é salva
E aparece na listagem com status "Closed"
E aparece no filtro de Vacancy como "Nome (Closed)"

### CT-VAC-ADD-09 — Rejeitar Number of Positions não numérico

- **Prioridade:** Média
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho os campos obrigatórios
E informo "abc" em Number of Positions
E clico em "Save"
Então é exibida a mensagem "Should be a numeric value"
E a vacancy não é criada

### CT-VAC-ADD-10 — Rejeitar Number of Positions fora do intervalo 1-99

- **Prioridade:** Média
- **Tipo:** Negativo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho os campos obrigatórios
E informo "0" em Number of Positions
E clico em "Save"
Então é exibida a mensagem "Should be a number between 1-99"
E a vacancy não é criada

### CT-VAC-ADD-11 — Cancelar cadastro sem criar vacancy

- **Prioridade:** Média
- **Tipo:** Positivo
- **Pré-condição:** estar autenticado e acessar Recruitment > Vacancies.

**Cenário:**
Dado que estou na tela de cadastro de vacancy
Quando preencho os campos obrigatórios
E clico em "Cancel"
Então retorno para a lista de vacancies
E a vacancy não aparece no filtro de Vacancy

---

## Recruitment — Pesquisa de vacancies

> Pré-condição comum: existir uma vacancy ativa criada pela automação.

### CT-VAC-SRC-01 — Pesquisar por Vacancy

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono a vacancy criada no filtro "Vacancy"
E clico em "Search"
Então a vacancy é exibida na tabela
E a linha exibe o Job Title utilizado no cadastro

### CT-VAC-SRC-02 — Pesquisar por Job Title

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono o Job Title utilizado no cadastro no filtro "Job Title"
E clico em "Search"
Então a vacancy criada é exibida
E todas as linhas retornadas possuem o Job Title selecionado

### CT-VAC-SRC-03 — Pesquisar por Hiring Manager

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono o Hiring Manager da vacancy criada no filtro "Hiring Manager"
E clico em "Search"
Então a vacancy criada é exibida na tabela

### CT-VAC-SRC-04 — Pesquisar por Status

- **Prioridade:** Média
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono o status "Active" no filtro "Status"
E clico em "Search"
Então são retornadas apenas vacancies com status "Active"

### CT-VAC-SRC-05 — Pesquisar com filtros combinados

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono a vacancy criada no filtro "Vacancy"
E seleciono o Job Title utilizado no cadastro
E clico em "Search"
Então apenas a vacancy criada é exibida

### CT-VAC-SRC-06 — Pesquisa sem resultados

- **Prioridade:** Média
- **Tipo:** Negativo

**Cenário:**
Dado que estou na lista de vacancies
Quando seleciono a vacancy ativa criada no filtro "Vacancy"
E seleciono o status "Closed" no filtro "Status"
E clico em "Search"
Então é exibida a mensagem "No Records Found"

### CT-VAC-SRC-07 — Reset limpa os filtros

- **Prioridade:** Média
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando aplico os filtros "Vacancy" e "Status"
E clico em "Reset"
Então todos os filtros voltam para "-- Select --"

---

## Recruitment — Edição de vacancies

> Pré-condição comum: existir uma vacancy criada pela automação.

### CT-VAC-EDT-01 — Editar nome, descrição e número de posições

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de edição da vacancy criada
E altero o Vacancy Name, a Description e o Number of Positions
E clico em "Save"
Então a vacancy passa a ser encontrada pelo novo nome
E os novos valores permanecem ao reabrir a edição
E o nome antigo deixa de existir no filtro de Vacancy

### CT-VAC-EDT-02 — Editar status para Closed

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de edição da vacancy ativa
E desativo o campo "Active"
E clico em "Save"
Então a vacancy é exibida com status "Closed"
E aparece no filtro de Vacancy como "Nome (Closed)"

### CT-VAC-EDT-03 — Cancelar edição sem persistir alterações

- **Prioridade:** Média
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de edição da vacancy criada
E altero o Vacancy Name
E clico em "Cancel"
Então retorno para a lista de vacancies
E o nome temporário não existe no filtro de Vacancy
E a vacancy original permanece disponível

### CT-VAC-EDT-04 — Impedir edição removendo campo obrigatório

- **Prioridade:** Alta
- **Tipo:** Negativo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de edição da vacancy criada
E apago o conteúdo de Vacancy Name
E clico em "Save"
Então é exibida a mensagem "Required" no campo Vacancy Name
E permaneço na página de edição

### CT-VAC-EDT-05 — Impedir edição com nome duplicado

- **Prioridade:** Alta
- **Tipo:** Negativo
- **Pré-condição:** existirem duas vacancies criadas pela automação.

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de edição da segunda vacancy
E altero o Vacancy Name para o nome da primeira vacancy
E clico em "Save"
Então é exibida a mensagem "Already exists"
E permaneço na página de edição

---

## Recruitment — Deleção de vacancies

> Pré-condição comum: existir uma vacancy criada pela automação.

### CT-VAC-DEL-01 — Excluir vacancy confirmando a operação

- **Prioridade:** Alta
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de exclusão da vacancy criada
Então é exibido o diálogo "Are you Sure?" informando que o registro será
permanentemente deletado
Quando clico em "Yes, Delete"
Então a vacancy deixa de existir no filtro de Vacancy

### CT-VAC-DEL-02 — Cancelar exclusão mantendo a vacancy

- **Prioridade:** Média
- **Tipo:** Positivo

**Cenário:**
Dado que estou na lista de vacancies
Quando clico no ícone de exclusão da vacancy criada
E clico em "No, Cancel"
Então o diálogo é fechado
E a vacancy continua disponível no filtro e na pesquisa por nome

---

## Rastreabilidade dos cenários

| Cenário | Arquivo de teste |
|---|---|
| CT-LOG-01 a CT-LOG-06 | `tests/login.spec.ts` |
| CT-VAC-ADD-01 a CT-VAC-ADD-11 | `tests/recruitment/vacancies-add.spec.ts` |
| CT-VAC-SRC-01 a CT-VAC-SRC-07 | `tests/recruitment/vacancies-search.spec.ts` |
| CT-VAC-EDT-01 a CT-VAC-EDT-05 | `tests/recruitment/vacancies-edit.spec.ts` |
| CT-VAC-DEL-01 e CT-VAC-DEL-02 | `tests/recruitment/vacancies-delete.spec.ts` |

## Estratégia de massa e limpeza

- Cada teste que cria uma vacancy usa um nome único com o prefixo `ES2-`.
- As vacancies criadas são removidas no `afterEach`, mesmo quando o teste falha.
- As pesquisas sempre usam o nome único criado pelo próprio teste, evitando
  dependência de registros deixados por outras pessoas no demo público.
- Os cenários não dependem de quantidade total de registros, pois o banco do demo
  pode mudar entre execuções.
