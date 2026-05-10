# 📚 Sistema de Biblioteca Municipal

Sistema web para gerenciamento do acervo e empréstimos de livros em uma biblioteca. O projeto substitui o controle manual em
registros físicos por uma plataforma digital completa, com autenticação, controle de empréstimos, cálculo de multas e relatórios.

## ✨ Funcionalidades

- **Autenticação** — cadastro de bibliotecários com senha criptografada, login,
  recuperação de senha por e-mail e redefinição obrigatória no primeiro acesso
- **Acervo** — cadastro e gerenciamento de livros por categoria, com controle de
  status (disponível / emprestado)
- **Usuários** — cadastro de usuários da biblioteca com geração automática de
  senha de empréstimo enviada por e-mail
- **Empréstimos** — fluxo completo de empréstimo com verificação de disponibilidade,
  confirmação por senha do usuário e cálculo automático de prazo (15 dias úteis)
- **Relatório de livros em atraso**
- **Histórico de empréstimos por usuário**
- **Cálculo automático de multas por atraso**

## 🛠️ Tecnologias

- **Backend:** Ruby on Rails 8, PostgreSQL
- **Frontend:** Next.js, React

## 🚀 Requisitos

- **Backend:** Ruby (versão no `.ruby-version`), Rails 8+, Bundler
- **Frontend:** Node.js 18+, npm ou yarn

## ▶️ Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema_biblioteca.git
cd sistema_biblioteca
```

### 2. Backend (Rails)

```bash
cd backend
bundle install
rails db:create db:migrate
rails server
```

Disponível em **http://localhost:3000**

### 3. Frontend (Next.js)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Disponível em **http://localhost:3001**
