import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import fs from 'fs';

const logsDir = process.cwd() + '/logs/';

export async function getPathnameByMnemonic (mnemonic) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
  const [{ address }] = await wallet.getAccounts()
  const filepath = logsDir + address + '.txt';
  fs.mkdirSync(logsDir, { recursive: true });
  if (!fs.existsSync(filepath)) {
    await fs.promises.writeFile(filepath, 'start');
  }
  return filepath;
}

export async function addLogMessage (mnemonic, message) {
  try {
    const filepath = await getPathnameByMnemonic(mnemonic);
    const content = await fs.promises.readFile(filepath);
    const now = new Date();
    console.log(message);
    await fs.promises.writeFile(filepath, `${now}: ${message}\n${content}`);
  } catch (e) {}
}

