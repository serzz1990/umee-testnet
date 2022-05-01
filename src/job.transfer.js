import { wallets } from './wallets'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getBalance } from "./bank";
import { transfer } from './transfer';
import { promisify } from "util";

import networks from './nerworks.json';
import chalk from "chalk";
import {sendError} from "./telegram";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB TRANSFER: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);

    try {
      const { mnemonic } = wallet;
      for(const network of [networks.cosmos, networks.juno, networks.osmo]) {
        try {
          const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.addressName });
          const [{address}] = await wallet.getAccounts();
          const balances = await getBalance(address, network);
          const balance = balances[network.denom] || 0;
          console.log(network.addressName, 'balance', network.denom, balance)
          if (balance > 10) {
            await transfer({
              mnemonic,
              from: network,
              to: networks.umee,
              amount: balance
            })
          } else {
            console.log(chalk.green(`Token ${network.addressName} already transferred`));
          }
        } catch (e) {
          sendError(e);
          console.log(chalk.red(`FAIL in ${network.addressName}`));
        }
        await sleep(1000);
      }
    } catch (e) {
      console.log(e);
      sendError(e);
    }
  }
  console.log(`JOB TRANSFER: ended (${new Date()})`);
})();
