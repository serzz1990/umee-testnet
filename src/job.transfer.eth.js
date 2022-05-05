import { wallets } from './wallets'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getBalance } from "./bank";
import { promisify } from "util";
import { sendToEth } from "./eth";
import { sendError } from "./telegram";
import { addLogMessage } from "./logs";
import networks from './nerworks.json';
import chalk from "chalk";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB TRANSFER to ETH: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    const { mnemonic, ethPrivateKey } = wallet;
    console.log(`Wallet ${index + 1}`);

    for(const network of [networks.cosmos]) {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.addressName });
      const [{ address }] = await wallet.getAccounts();
      try {
        const balances = await getBalance(address, networks.umee);
        const balance = balances[network.denomInUmee] || 0;
        if (balance > 10) {
          await sendToEth({
            mnemonic,
            privateKey: ethPrivateKey,
            from: network,
            amount: balance
          })
        }
      } catch (e) {
        await addLogMessage(mnemonic, `TRANSFER ETH | FAIL | from ${address} | ${e.message}`);
        sendError([`job.transfer.eth`, `wallet: ${index + 1}`, e]);
        console.log(e);
        console.log(chalk.red(`FAIL in ${network.addressName}`));
      }
      await sleep(1000);
    }
  }
  console.log(`JOB TRANSFER to ETH: ended (${new Date()})`);
})();
