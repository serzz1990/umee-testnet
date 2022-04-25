console.log('RUN JOB BORROW');

import networks from './nerworks.json';
import wallets from '../wallets.json';
import { getStat } from "./stat";
import { getBorrow } from "./borrow";
import chalk from "chalk";

const randomInArray = (array) => array[Math.floor(Math.random() * array.length)];

(async () => {
  for (const wallet of wallets) {
    try {
      const { mnemonic } = wallet;
      const stat = await getStat(mnemonic);
      const limitPercent = 80
      if (stat.borrowLimitPercent < limitPercent) {
        const network = randomInArray([networks.cosmos, networks.juno, networks.osmo]);
        const amountBorrowUSD = stat.borrowLimit * (limitPercent/100) - stat.totalBorrowed;
        if (amountBorrowUSD > 0) {
          const tokenPrice = stat.prices[network.addressName];
          const amountBorrowTokens = amountBorrowUSD / tokenPrice;

          // console.log('network', network.addressName);
          // console.log('borrowLimitPercent', stat.borrowLimitPercent);
          // console.log('borrowLimit', stat.borrowLimit);
          // console.log('totalBorrowed', stat.totalBorrowed);
          // console.log('tokenPrice', tokenPrice);
          //
          // console.log('amountBorrowUSD', amountBorrowUSD);
          // console.log('amountBorrowTokens', amountBorrowTokens);

          await getBorrow({
            mnemonic,
            from: network,
            amount: amountBorrowTokens
          });

          continue;
        }
      }

      console.log(chalk.green(`Can't borrow anymore`));
    } catch (e) {
      console.log(e)
    }
  }
})();

