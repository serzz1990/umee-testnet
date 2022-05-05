import {createPollingBot, sendMessage} from "./telegram";
import { exec } from 'child_process';
import { wallets } from './wallets'
import {getPathnameByMnemonic} from "./logs";
import {templateBorrowStat} from "./telegram/templates";
import {getBorrowStat} from "./stat";
import {getEthStat} from "./eth";
import networks from "./nerworks.json";

const bot = createPollingBot();

bot.onText(/\/stat/, function onEditableText(msg) {
  const walletsMenu = [];
  for (const [index, wallet] of wallets.entries()) {
    walletsMenu.push({
      text: index + 1,
      callback_data: `wallet_stat_index${index}`
    });
  }
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'All',
          callback_data: `wallet_stat_indexall`
        }]
      ].concat(walletsMenu.reduce((res, item, index) => {
        const rowIndex = Math.floor((index/8));
        res[rowIndex] = res[rowIndex] || [];
        res[rowIndex][index%8] = item;
        return res;
      }, []))
    }
  };
  bot.sendMessage(msg.from.id, 'Choice wallet for stat', opts);
});

bot.onText(/\/logs/, function onEditableText(msg) {
  const walletsMenu = [];
  for (const [index, wallet] of wallets.entries()) {
    walletsMenu.push({
      text: index + 1,
      callback_data: `wallet_log_index${index}`
    });
  }
  const opts = {
    reply_markup: {
      inline_keyboard: walletsMenu.reduce((res, item, index) => {
        const rowIndex = Math.floor((index/8));
        res[rowIndex] = res[rowIndex] || [];
        res[rowIndex][index%8] = item;
        return res;
      }, [])
    }
  };
  bot.sendMessage(msg.from.id, 'Choice wallet for logs', opts);
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };

  if (action.search('wallet_log_index') > -1) {
    const index = action.replace('wallet_log_index', '');
    const filepath = await getPathnameByMnemonic(wallets[index].mnemonic);
    const text = `Wallet logs (${+index + 1}):`;
    await bot.editMessageText(text, opts);
    await bot.sendDocument(msg.chat.id, filepath);
  }

  if (action.search('wallet_stat_index') > -1) {
    const index = action.replace('wallet_stat_index', '');

    if (index === 'all') {
      await bot.editMessageText(`⌛️ Getting stat for ${index} wallets. Pls wait...`, opts);
      exec('npm run job:stat');
    } else {
      await bot.editMessageText(`⌛️ Getting stat for ${+index + 1} wallet. Pls wait...`, opts);
      const { mnemonic, ethPrivateKey } = wallets[index];
      const borrowStat = await getBorrowStat(mnemonic);
      borrowStat.eth = await getEthStat({ mnemonic, privateKey: ethPrivateKey, network: networks.cosmos });
      const message = templateBorrowStat(borrowStat);
      await bot.sendDocument(msg.chat.id, message);
    }
  }
});
