# 🤖 Source Bot Generation

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/) 
[![Status](https://img.shields.io/badge/status-beta-yellow)] 

Crie **bots automáticos para Discord** ou outros projetos usando a **API Gemini (IA do Google)**.  
O script gera a **estrutura de arquivos**, o **conteúdo de cada arquivo** e empacota tudo em um **.zip pronto para uso**.

---

## ⚙️ Como funciona

1. Defina um **pedido** no arquivo `config.json`, descrevendo o projeto que deseja gerar.  
2. Execute o `main.js`, que utiliza as funções do `util.js` para:
   - Solicitar à Gemini IA a estrutura de arquivos e o conteúdo de cada arquivo.  
   - Criar a estrutura localmente.  
   - Gerar um **arquivo .zip** com toda a source.  
3. O `.zip` será salvo na mesma pasta do projeto.

### Exemplo de `config.json`

```json
{
  "pedido": "Crie uma source de Ticket Basico.",
  "gemini_apikeys": []
}
````

* **pedido** → descrição do projeto que você quer criar.
* **gemini_apikeys** → lista de suas chaves da Gemini IA.

---

## 🧠 Como obter sua API Key da Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey) e faça login com sua conta Google.
2. Clique em **“Create API key”** e copie a chave gerada.
3. Cole a chave dentro do array `"gemini_apikeys"` do `config.json`:

```json
"gemini_apikeys": ["SUA_API_KEY_AQUI"]
```

> 💡 Recomenda-se adicionar mais de uma chave se for gerar vários bots para evitar limite de requisições.

---

## 💻 Requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* NPM (já vem com Node.js)

---

## 🚀 Como rodar

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:

```bash
npm install
```

3. Execute o script principal:

```bash
node main.js
```

4. O bot será gerado automaticamente e você receberá um arquivo `.zip` com a source completa na mesma pasta do projeto.

---

## 🗂️ Estrutura do projeto

```
📦 source-bot-generation
 ┣ 📜 main.js       # Script principal que chama o util.js
 ┣ 📜 util.js       # Funções para gerar bot, criar arquivos e zip
 ┣ 📜 config.json   # Configurações do projeto e Gemini API keys
 ┣ 📜 package.json  # Dependências do Node.js
 ┗ 📜 README.md
```

> O `.zip` gerado com a source ficará na mesma pasta do projeto.

---

## 🔗 Links importantes

* 🌐 **Portfólio:** [whitex-portfolio.netlify.app](https://whitex-portfolio.netlify.app/#inicio)
* 💬 **Servidor Hyper Apps:** [https://discord.gg/jxwK6ZVCDr](https://discord.gg/jxwK6ZVCDr)
* 👤 **Discord:** `whitex0424`

---

## ⚠️ Aviso

> **Não ofereço suporte direto** para este projeto.
> Use por sua conta e risco. Esta ferramenta é **educacional e demonstrativa**.

---

## 🧾 Licença

Este projeto é de uso **livre e educacional**.
Créditos devem ser mantidos ao autor original (**whitex0424**).
