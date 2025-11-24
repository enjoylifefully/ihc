# 🤖 Projeto IHC - Chatbot com Integração Gemini

Este documento contém o passo a passo para configurar e rodar os repositórios do projeto de Interação Humano-Computador (Front-end e Back-end).

## 📋 Pré-requisitos

* **Node.js** e **npm** instalados.
* **Git** instalado.

---

## 🚀 Passo 1: Configuração do Backend (API)

O backend gerencia a comunicação com a inteligência artificial.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/enjoylifefully/chatbot-ihc
    ```

2.  **Acesse a pasta e instale as dependências:**
    ```bash
    cd chatbot-ihc
    npm install
    ```

3.  **Configure a API Key do Google Gemini:**
    * Acesse o [Google AI Studio](https://aistudio.google.com/app/api-keys?hl=pt-br).
    * Clique em **Create API key**.
    * Copie a chave gerada.

4.  **Crie as variáveis de ambiente:**
    * Dentro da pasta `backend`, crie um arquivo chamado `.env`.
    * Cole o conteúdo abaixo, substituindo `(sua key gerada)` pela chave que você copiou:

    ```env
    PORT=3000
    GEMINI_API_KEY=(sua key gerada)
    ```

5.  **Inicie o servidor:**
    ```bash
    npm start
    ```
    > Mantenha este terminal aberto.

---

## 💻 Passo 2: Configuração do Frontend (Interface)

Abra um **novo terminal** para rodar a interface visual.

1.  **Clone o repositório:**
    * Volte para a pasta raiz onde você guarda seus projetos antes de rodar o comando abaixo.
    ```bash
    git clone https://github.com/enjoylifefully/ihc
    ```

2.  **Acesse a pasta e instale as dependências:**
    ```bash
    cd ihc
    npm install
    ```

3.  **Rode o projeto:**
    ```bash
    npm run dev
    ```

4.  **Acesse no navegador:**
    * O terminal exibirá um link (geralmente `http://localhost:5173` ou similar). Clique nele para usar o sistema.

---

## 🛠 Resumo de Comandos

| Ação | Backend (`chatbot-ihc`) | Frontend (`ihc`) |
| :--- | :--- | :--- |
| **Instalar** | `npm install` | `npm install` |
| **Rodar** | `npm start` | `npm run dev` |
