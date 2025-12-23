# Gestor Financeiro

![Status do Projeto](https://img.shields.io/badge/status-desenvolvimento-orange) ![Licença](https://img.shields.io/badge/license-MIT-green)

Uma aplicação web completa e moderna para gerenciamento de finanças pessoais, desenvolvida para ajudar você a controlar gastos, investimentos e atingir suas metas financeiras. 

## Funcionalidades

###  Dashboard e Visão Geral
- **Resumo Financeiro**: Visualize rapidamente saldo atual, receitas, despesas e projeções.
- **Gráficos Interativos**: Acompanhe a evolução do seu patrimônio e a distribuição de gastos por categoria.
- **Filtros Temporais**: Análise flexível por mês, trimestre, semestre ou ano.

###  Gestão de Transações
- **Controle Total**: Adicione receitas, despesas e transferências.
- **Categorização**: Organize seus lançamentos com categorias personalizáveis e ícones coloridos.
- **Recorrência**: Configure transações fixas ou parceladas automaticamente.

###  Investimentos
- **Renda Variável**: Acompanhe ações e ativos da B3 (Simulação de cotação em tempo real).
- **Criptomoedas**: Integração com API CoinGecko para cotações reais de Bitcoin, Ethereum, etc.
- **Carteira**: Visualize a performance e alocação dos seus ativos.

###  Metas e Orçamento
- **Metas Financeiras**: Defina objetivos (ex: Viagem, Reserva de Emergência) e acompanhe o progresso.
- **Orçamentos**: Estabeleça tetos de gastos por categoria e receba alertas visuais.

###  Gamificação
- **Conquistas**: Desbloqueie badges e níveis ao manter bons hábitos financeiros.

###  Outros Recursos
- **Modo Escuro**: Interface adaptável com tema Dark/Light.
- **Sincronização na Nuvem**: Salve seus dados com segurança usando Firebase (Firestore).
- **Responsividade**: Layout adaptado para desktop e dispositivos móveis.

##  Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias principais:

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore & Auth)

##  Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

##  Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/gestor-financeiro.git
   cd gestor-financeiro
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase (Opcional):**
   > O projeto possui um modo de demonstração que funciona sem backend, mas para persistência real, configure o Firebase.
   
   Crie um projeto no [Console do Firebase](https://console.firebase.google.com/), habilite o Firestore e Authentication (Google Provider). Em seguida, você pode configurar as variáveis de ambiente (se o suporte estiver implementado) ou injetar a configuração globalmente.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   Abra seu navegador e vá para `http://localhost:5173` (ou a porta indicada no terminal).

##  Scripts Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Gera a versão de produção na pasta `dist`.
- `npm run preview`: Visualiza a versão de produção localmente.

##  Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**OBRIGADO POR USAR, FAVOR REPORTA BUGS**
