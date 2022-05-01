import { wallets } from './wallets'
import { promisify } from "util";

import networks from './nerworks.json';
import chalk from "chalk";
import {borrowFromEth, getEthStat} from "./eth";
import {sendError} from "./telegram";

const sleep = promisify(setTimeout);
const randomInArray = (array) => array[Math.floor(Math.random() * array.length)];

(async () => {
  console.log(`JOB BORROW ETH: started (${new Date()})`);

  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);

    try {
      const { mnemonic, ethPrivateKey } = wallet;
      const limitPercent = 80;
      const network = randomInArray([networks.cosmos]);
      const stat = await getEthStat({ mnemonic, ethPrivateKey, network })

      if (stat.borrowPercent < limitPercent && stat.supply) {
        const amountBorrow = stat.borrowLimit * (limitPercent / 100) - stat.borrow;
        if (amountBorrow > 0) {
          await borrowFromEth({
            mnemonic,
            privateKey: ethPrivateKey,
            from: network,
            amount: amountBorrow
          });
          continue;
        }
      }

      console.log(chalk.green(`Can't borrow anymore`));
    } catch (e) {
      sendError(e);
      console.log(e);
    }
    await sleep(1000);
  }
  console.log(`JOB BORROW ETH: ended (${new Date()})`);
})();
