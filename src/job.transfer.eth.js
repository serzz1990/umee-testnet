import { wallets } from './wallets'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getBalance } from "./bank";
import { transfer } from './transfer';
import { promisify } from "util";

import networks from './nerworks.json';
import chalk from "chalk";
import {sendToEth} from "./eth";
import {sendError} from "./telegram";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB TRANSFER to ETH: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);

    try {
      const { mnemonic, ethPrivateKey } = wallet;
      for(const network of [networks.cosmos]) {
        try {
          const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.addressName });
          const [{address}] = await wallet.getAccounts();
          const balances = await getBalance(address, networks.umee);
          const balance = balances[network.denomInUmee] || 0;
          if (balance > 10) {
            await sendToEth({
              mnemonic,
              privateKey: ethPrivateKey,
              from: network,
              amount: balance
            })
          } else {
            console.log(chalk.green(`Token ${network.addressName} already transferred`));
          }
        } catch (e) {
          sendError([`job.transfer.eth`, `wallet: ${index + 1}`, e]);
          console.log(e);
          console.log(chalk.red(`FAIL in ${network.addressName}`));
        }
        await sleep(1000);
      }
    } catch (e) {
      sendError(e);
      console.log(e);
    }
  }
  console.log(`JOB TRANSFER to ETH: ended (${new Date()})`);
})();
