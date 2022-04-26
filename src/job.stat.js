import { wallets } from './wallets'
import { getBorrowStat } from "./stat";
import { promisify } from "util";
import { sendBorrowStat } from "./telegram";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB STAT: started (${new Date()})`);
  const stats = [];

  for (const [index, wallet] of wallets.entries()) {
    try {
      const { mnemonic } = wallet;
      const borrowStat = await getBorrowStat(mnemonic);
      stats.push(borrowStat);
    } catch (e) {
      console.log(e);
      stats.push(null);
    }
    await sleep(3000);
  }
  await sendBorrowStat(stats);
  console.log(`JOB STAT: ended (${new Date()})`);
})();
