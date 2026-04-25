# Frontend & DevOps

## Objetivo
Desenvolver uma aplicação frontend integrada a um fluxo de DevOps, utilizando versionamento, integração contínua (CI) e entrega contínua (CD).

---

## Membros do Grupo
* Membro 1 - RA: XXXXXX
* Membro 2 - RA: XXXXXX
* Membro 3 - RA: XXXXXX
* Membro 4 - RA: XXXXXX
* Eduardo Martins Barbosa - RA: XXXXXX

---

## Tecnologias Obrigatórias
* **Linguagens:** HTML5, CSS3, JavaScript (opcional)
* **Framework CSS:** (ex: Bootstrap, Materialize, Foundation ou similares)
* **Testes E2E:** Cypress
* **Versionamento:** Git & GitHub
* **CI/CD:** GitHub Actions

---

## Padrão de Versionamento

### 1. Mensagens de Commit
Utilizaremos um padrão simplificado de tags para identificar o que foi feito em cada alteração:

* **`[NOVO]`**: Inclusão de novas funcionalidades, páginas ou elementos.
    * *Ex: `git commit -m "[NOVO] Adiciona seção de contato no rodapé"`*
  * **`[BUG]`**: Correcao de erros no código, layout ou testes.
    * *Ex: `git commit -m "[BUG] Corrige alinhamento do menu no mobile"`*
* **`[AJUSTE]`**: Mudanças de estilo (CSS), textos, atualizações no README ou ajustes nos testes Cypress.
    * *Ex: `git commit -m "[AJUSTE] Atualiza cores dos botões para azul marinho"`*

### 2. Estratégia de Branches
Ninguém deve trabalhar diretamente na branch `main`. Para desenvolver determinada funcionalidade crie uma nova branch e comece a codar em cima dela, para isso siga o passo a passo:

* **Padrão de nome:** `nome-do-aluno/breve-descricao`
* **Exemplos:**
    * `eduardo/setup-cypress`
    * `nome/pagina-hobbies`

### 3. Workflow do ambiente:
1.  **Sincronize sua máquina:** Antes de começar, vá para a main e dê um `git pull`.
2.  **Crie sua branch:** `git checkout -b seu-nome/sua-tarefa`.
3.  **Coding e Commit:** Faça commits frequentes para manter sempre atualizada a branch
4.  **Suba para o GitHub:** `git push origin seu-nome/sua-tarefa`.
5.  **Abra um Pull Request (PR):** No GitHub, solicite a integração com a branch `main`.
6.  **Revisão e Merge:** Outro membro do grupo deve revisar o código e, se os testes do CI passarem, realizar o Merge na main

---

## DevOps — Pipeline CI/CD

O projeto utiliza **GitHub Actions** para automação. O fluxo consiste em:

1.  **Integração Contínua (CI):** Ao abrir um Pull Request, o GitHub Actions dispara automaticamente a instalação das dependências e executa os testes do **Cypress**. O merge só será permitido se todos os testes passarem.
2.  **Entrega Contínua (CD):** Após o merge com a branch `main`, o pipeline realiza o deploy automático do site para o ambiente de produção ([Inserir link aqui, ex: GitHub Pages ou Vercel]).

---

## Roteiro para a Apresentação ao Vivo

Durante a apresentacao, seguiremos este procedimento para demonstrar o pipeline:
1.  Realizar a alteração que o professor solicitar
2.  Faremos o `push` para uma branch de teste e abriremos um **Pull Request**.
3.  Mostraremos o **Cypress** validando a alteração no ambiente de CI.
4.  Aprovaremos o PR e mostraremos o site sendo atualizado em tempo real através do **CD**.

---

## Documentação de Testes
  Os testes E2E (End-to-End) vao estar localizados na pasta `/cypress/e2e`. Eles validam os fluxos criticos do site, como navegação entre páginas e submissao de formularios.
