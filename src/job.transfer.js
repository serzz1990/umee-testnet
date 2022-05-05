import { wallets } from './wallets'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getBalance } from "./bank";
import { transfer } from './transfer';
import { promisify } from "util";
import { sendError } from "./telegram";
import { addLogMessage } from "./logs";
import networks from './nerworks.json';

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB TRANSFER: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);
    const { mnemonic } = wallet;
    for(const network of [networks.cosmos, networks.juno, networks.osmo]) {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.addressName });
      const [{ address }] = await wallet.getAccounts();

      try {
        const balances = await getBalance(address, network);
        const balance = balances[network.denom] || 0;
        await addLogMessage(mnemonic, `TRANSFER | to umee from ${address} | balance ${balance} ${network.denom}`);
        if (balance > 10) {
          await transfer({
            mnemonic,
            from: network,
            to: networks.umee,
            amount: balance
          })
        }
      } catch (e) {
        console.log(e);
        await sendError([`job.transfer`, `wallet: ${index + 1}`, e]);
        await addLogMessage(mnemonic, `TRANSFER | to umee from ${address} | FAIL | ${e.message}`);
      }
      await sleep(1000);
    }
  }
  console.log(`JOB TRANSFER: ended (${new Date()})`);
})();
