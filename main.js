const { generateBot } = require('./utils');
const { pedido } = require("./config.json");

generateBot(`${pedido}`).then(path => {
  console.log('Projeto criado em:', path);
}).catch(err => console.log(err));
