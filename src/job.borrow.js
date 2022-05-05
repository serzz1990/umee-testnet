import { wallets } from './wallets'
import { getBorrowStat } from "./stat";
import { getBorrow } from "./borrow";
import { promisify } from "util";
import { getPrices } from "./bank";
import { sendError } from "./telegram";
import { addLogMessage } from "./logs";

import networks from './nerworks.json';
import chalk from "chalk";

const sleep = promisify(setTimeout);
const randomInArray = (array) => array[Math.floor(Math.random() * array.length)];

(async () => {
  console.log(`JOB BORROW: started (${new Date()})`);

  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);

    try {
      const { mnemonic } = wallet;
      const limitPercent = 80;
      const network = randomInArray([networks.cosmos, networks.juno, networks.osmo]);
      const borrowStat = await getBorrowStat(mnemonic);
      const prices = await getPrices();

      if (borrowStat.borrowLimitPercent < limitPercent) {
        const amountBorrowUSD = borrowStat.borrowLimit * (limitPercent/100) - borrowStat.totalBorrowed;
        if (amountBorrowUSD > 0) {
          const tokenPrice = prices[network.denom];
          const amountBorrowTokens = amountBorrowUSD / tokenPrice;
          await getBorrow({
            mnemonic,
            from: network,
            amount: amountBorrowTokens
          });
          continue;
        }
      }
    } catch (e) {
      await addLogMessage(mnemonic, `BORRROW | FAIL | ${e}`);
      console.log(e);
    }
    await sleep(1000);
  }
  console.log(`JOB BORROW: ended (${new Date()})`);
})();
