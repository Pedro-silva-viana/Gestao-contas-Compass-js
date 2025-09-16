# 📌 banco-digital-compass-js

Este projeto foi desenvolvido no âmbito do programa de estagio da Compass UOL e tem como objetivo a criação de uma instituição financeira fictícia, oferecendo serviços básicos, tais como:

* Criar cliente

* Criar conta vinculada a um cliente

* Consultar saldo de uma conta

* Realizar transações

* Listar transações por conta

O projeto ainda encontra-se em desenvolvimento.

---

## 🚀 Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Banco de Dados: MongoDB
- Bibliotecas: mongoose e dotenv.

---

## 📂 Estrutura do Projeto
```bash
banco-digital-compass-js/
├── main.js # Servidor principal (HTTP nativo)
├── Customer.js # Modelo de cliente
├── Account.js # Modelo de conta
├── Transactions.js # Modelo de transações
└── .env.example # Exemplo de .env
```
## Como Rodar o Projeto
#### Clone este repositório
git clone https://github.com/Pedro-silva-viana/Gestao-contas-Compass-js

#### Acesse a pasta do projeto
cd banco-digital-compass-js

#### Instale as dependências
npm install

#### Configure as variáveis de ambiente
cp .env.example .env

#### Execute a aplicação em desenvolvimento
npm run dev

#### Execute a aplicação em produção
node .main.js