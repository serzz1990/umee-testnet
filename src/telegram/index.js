import '../env'
import Telegram from 'node-telegram-bot-api'
import axios from "axios";

export const bot = new Telegram(process.env.TELEGRAM_TOKEN, { polling: false });

export async function getLastMessage () {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getupdates?limit=1&offset=-1`;
    const { data } = await axios.get(url);
    if (data.result.length) {
      return data.result[0].message;
    }
  } catch (e) {}
  return null;
}

export async function sendMessage (text) {
  if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  const options = {};
  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, text, options);
  } catch (e) {}
}
