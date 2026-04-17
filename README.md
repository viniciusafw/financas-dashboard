# 💰 fin.track

> Um dashboard minimalista e moderno para controle financeiro pessoal, focado em usabilidade e design.

O **fin.track** permite que você acompanhe suas receitas e despesas de forma visual, com gráficos dinâmicos e um resumo claro do seu saldo atual. Todos os dados são salvos localmente no seu navegador.

## 🚀 Funcionalidades

* 📊 **Dashboard Visual:** Gráficos de linha para evolução mensal e gráfico de rosca para despesas por categoria.
* 🌗 **Dark/Light Mode:** Suporte nativo para tema claro e escuro.
* 💾 **Persistência de Dados:** Uso do `localStorage` para não perder os dados ao fechar a aba.
* 🔍 **Filtros:** Separação de transações por mês, tipo (receita/despesa) ou categoria.
* 📱 **Responsivo:** Layout que se adapta perfeitamente do celular ao desktop.

## 🛠️ Tecnologias Utilizadas

* **[React](https://react.dev/):** Biblioteca principal para construção da interface (JS/JSX).
* **[Tailwind CSS](https://tailwindcss.com/):** Estilização rápida, moderna e responsiva.
* **[Chart.js](https://www.chartjs.org/):** Para renderização dos gráficos dinâmicos.

## 📁 Estrutura do Projeto

O código foi organizado visando separar a lógica de negócio da interface de usuário:

```text
src/
 ┣ components/
 ┃ ┣ Charts.jsx          # Lógica e renderização dos gráficos
 ┃ ┣ TransactionForm.jsx # Formulário de adição de novas transações
 ┃ ┗ TransactionList.jsx # Lista de transações e barras de progresso
 ┣ utils/
 ┃ ┗ helpers.js          # Funções utilitárias (formatação de moeda, categorias, dados falsos)
 ┗ App.jsx               # Componente principal que gerencia o estado (transações e tema)
