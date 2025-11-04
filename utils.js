const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { gemini_apikeys } = require("./config.json");

function getRandomApiKey() {
  return gemini_apikeys[Math.floor(Math.random() * gemini_apikeys.length)];
}

function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

async function generateBot(tema) {
  function PegarCod(text) {
    console.log(text);
    const match = text.match(/```(?:[\w]*)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  }

  function pegarEstrutura(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed.files)) {
      return parsed.files.map(f => f.path);
    }
    throw new Error('Formato inválido: esperado { files: [{ path }] }');
  }

const context = `Você é um desenvolvedor sênior especializado em criar projetos completos com base em descrições fornecidas. Sua tarefa é identificar automaticamente o tipo de projeto e escolher a linguagem e estrutura mais apropriadas.

🧠 Comportamento esperado:

1. Identifique o tipo de projeto com base na descrição (ex: site, bot, ferramenta).
   - Dê prioridade ao tipo mencionado diretamente (por exemplo, se a palavra "site" aparece, é um site — mesmo que "Discord" também esteja).
2. Linguagens padrão por tipo:
   - Bot de Discord → Node.js com discord.js v14 **(somente se a palavra "bot" estiver presente)**
   - Site ou página → HTML + CSS (e JS se necessário)
   - Ferramentas que interagem com a memória → C++
   - Caso a pessoa mencione a linguagem → Faça da linguagem que ele pediu
   - Outros casos → Você mesmo identifique
3. Gere apenas o conteúdo solicitado, dentro de blocos de código markdown (\`\`\`). Nada fora dos blocos.
4. Nunca gere estruturas completas nem arquivos múltiplos, a menos que seja explicitamente solicitado.
5. Para bots:
   - Use eventos desacoplados e comandos em arquivos separados
   - Use wio.db como banco de dados padrão
6. Para sites:
   - Use HTML5 semântico, CSS limpo, responsividade e organização
   - Separe HTML, CSS e JS se necessário
7. Para ferramentas em C++:
   - Código modular, eficiente e bem comentado

🛠️ Baseie sua resposta na seguinte descrição: "${tema}"
`;



  async function askGemini(prompt) {
    const apik = getRandomApiKey();
    const genAI = new GoogleGenerativeAI(apik);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: context,
    });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }

  try {
    const id = generateId();
    const baseDir = path.join(__dirname, id);
    fs.mkdirSync(baseDir, { recursive: true });

    console.log('🔧 Criando estrutura...');
    const structurePrompt = `Crie a estrutura de arquivos em JSON plano para um projeto baseado na descrição: "${tema}". \nA extensão de cada arquivo deve refletir a linguagem apropriada ao projeto:\n- Para sites, use arquivos .html, .css, .js\n- Para bots de Discord, use .js com Node.js\n- Para ferramentas nativas, use .cpp (ou linguagem adequada)\nFormato: { "files": [{ "path": "src/index.html", "type": "html" }] }`;
    const structureRaw = await askGemini(structurePrompt);
    const structureJson = PegarCod(structureRaw);

    const structurePath = path.join(baseDir, 'estrutura.json');
    fs.writeFileSync(structurePath, structureJson, 'utf8');

    const files = pegarEstrutura(structureJson);
    console.log(`📁 Total de arquivos: ${files.length}`);

    for (const file of files) {
      try {
        const contentPrompt = `Gere o conteúdo completo para o arquivo \`${file}\` de um projeto descrito como: "${tema}". Responda apenas com o código dentro de um bloco de código markdown.`;

        const contentRaw = await askGemini(contentPrompt);
        const content = PegarCod(contentRaw);

        const fullPath = path.join(baseDir, file);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, 'utf8');

        console.log(`✅ Gerado: ${file}`);
      } catch (err) {
        console.error(`❌ Erro ao gerar ${file}:`, err.message);
      }
    }

    const zipPath = path.join(__dirname, `${id}.zip`);
    console.log('📦 Criando arquivo zip...');
    await zipDirectory(baseDir, zipPath);

    await fsPromises.rm(baseDir, { recursive: true, force: true });

    return zipPath;
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    throw error;
  }
}

module.exports = { generateBot, getRandomApiKey, generateId };
