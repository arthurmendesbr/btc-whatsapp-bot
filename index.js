const venom = require('venom-bot');
const axios = require('axios');

async function getBitcoinPrice() {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    return null;
  }
}

function gerarMensagem(price) {
  if (price <= 90000) {
    return `⚠️ ALERTA BITCOIN ⚠️\nPreço: $${price.toFixed(2)}\nAÇÃO: COMPRAR AGORA!`;
  } else if (price >= 110000) {
    return `⚠️ ALERTA BITCOIN ⚠️\nPreço: $${price.toFixed(2)}\nAÇÃO: VENDER AGORA!`;
  } else {
    return null;
  }
}

venom.create().then((client) => start(client));

function start(client) {
  console.log('Bot iniciado!');

  client.onMessage(async (message) => {
    if (message.body === '/id' && message.isGroupMsg) {
      await client.sendText(message.chatId, `ID do Grupo: ${message.chatId}`);
      console.log(`ID do grupo: ${message.chatId}`);
    }
  });

  setInterval(async () => {
    const price = await getBitcoinPrice();
    if (!price) return;

    const mensagem = gerarMensagem(price);
    if (!mensagem) return;

    const groupId = 'SEU_ID_DO_GRUPO@g.us';
    await client.sendText(groupId, mensagem);
    console.log(`Enviado: ${mensagem}`);
  }, 60000);
}
