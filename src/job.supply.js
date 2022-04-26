import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { sendCollateral } from "./collateral";
import { wallets } from './wallets'
import { getBalance } from "./bank";
import { promisify } from "util";

import chalk from "chalk";
import networks from './nerworks.json';

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB SUPPLY: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);
    try {
      const { mnemonic } = wallet;
      const walletUmee = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: networks.umee.addressName });
      const [{ address: addressUmee }] = await walletUmee.getAccounts();
      const balances = await getBalance(addressUmee, networks.umee);

      for(const network of [networks.juno, networks.osmo]) {
        try {
          const balance = balances[network.denomInUmee] || 0;
          console.log('balance', balance, network.addressName);
          if (balance > 10) {
            await sendCollateral({
              mnemonic,
              from: network,
              amount: balance
            });
          } else {
            console.log(chalk.green(`Token ${network.addressName} already supplied`));
          }
        } catch (e) {
          console.log(chalk.red(`FAIL in ${network.addressName}`, e));
        }
        await sleep(1000);
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log(`JOB SUPPLY: ended (${new Date()})`);
})();
