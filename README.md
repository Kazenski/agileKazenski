# Radar de Maturidade Ágil - v3.0

O **Radar de Maturidade Ágil** é uma aplicação web interativa projetada para Agile Coaches, Scrum Masters e facilitadores. Ele permite avaliar, visualizar e acompanhar a maturidade ágil de equipes e clientes ao longo do tempo, combinando gráficos dinâmicos com análise de dados auxiliada por Inteligência Artificial.

## Funcionalidades Principais

O sistema é dividido em três módulos principais:

1. **Questionário Dinâmico:**
   * Crie e edite estruturas personalizadas de avaliação divididas por **Eixos**, **Subgrupos** e **Perguntas**.
   * Atribua perguntas a "Papéis" específicos (ex: PM, Agilista, Time).
   * Escala de avaliação de 0 a 5, onde 0 (N/A) não penaliza a média geral.

2. **Resultados e Métricas (Radar):**
   * Visualização automática de gráficos de radar segmentados por eixo e comparativo de papéis.
   * **Comparador Histórico:** Permite colocar lado a lado a avaliação atual com avaliações anteriores de um mesmo cliente.
   * Explorador de respostas com controle deslizante (slider) para filtrar rapidamente o que recebeu cada nota.

3. **Planos de Ação e Integração com IA:**
   * Criação de regras condicionais personalizadas (ex: Se média de DevOps for < 3, gerar alerta).
   * Separação automática de **Pontos Fortes** (>3) e **Oportunidades de Melhoria** (<=3).
   * **Gerador de Prompt:** Botão que compila todo o contexto, métricas e alertas da avaliação em um prompt pronto para ser colado no ChatGPT ou Gemini, visando a geração de um plano de ação executivo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído focado em agilidade e não requer *build* complexo, rodando inteiramente no front-end com integrações externas via CDN:

* **Interface:** React 18 (renderizado via Babel Standalone) e Tailwind CSS.
* **Gráficos:** Chart.js.
* **Banco de Dados / Cloud:** Firebase Firestore (Compat 9.22) para persistência em tempo real das configurações e avaliações dos clientes.
* **Ícones & Fontes:** FontAwesome 6.5.2, Google Fonts (Inter e Cinzel).

## Estrutura do Projeto

Abaixo está o detalhamento de como as pastas e arquivos estão organizados para garantir a separação de responsabilidades:

```text
/
├── index.html          # Ponto de entrada da aplicação. Carrega as bibliotecas via CDN e instancia o React no id="root".
├── style.css           # Estilos globais personalizados, esquema de cores (variáveis CSS dark mode) e animações base.
│
├── /core
│   ├── firebase.js     # Arquivo de configuração e inicialização do projeto AgileKazenski no Firebase Firestore.
│   └── util.js         # Constantes de negócios (ex: Mapa de notas, níveis de maturidade de "Incipiente" a "Excelência") e funções puras (gerador de IDs, matemática de arrays).
│
└── /js
    └── app.js          # Coração do projeto. Contém todos os componentes React, incluindo Modais (Importação, Ajuda), wrapper do Chart.js e as lógicas de negócio das abas do painel.
```

## ☁️ Configuração de Banco de Dados

Para uso individual ou em novos ambientes, atualize o arquivo `core/firebase.js` com as suas próprias credenciais geradas pelo console do Firebase:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

### Coleções no Firestore

O sistema utiliza as seguintes coleções principais no Firestore:

* **`radar_v3_config`**: Guarda a estrutura global de perguntas e regras de IA.
* **`radar_v3_respostas`**: Armazena todas as submissões de avaliações dos clientes.
* **`radar_v3_clientes`**: Índices dos clientes para fácil importação e busca.
