import { wallets } from './wallets'
import networks from './nerworks.json'
import { getBorrowStat } from "./stat";
import { promisify } from "util";
import { sendBorrowStat } from "./telegram";
import { getEthStat } from "./eth";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB STAT: started (${new Date()})`);
  const stats = [];

  for (const [index, wallet] of wallets.entries()) {
    try {
      const { mnemonic, ethPrivateKey } = wallet;
      const borrowStat = await getBorrowStat(mnemonic);
      borrowStat.eth = await getEthStat({ mnemonic, privateKey: ethPrivateKey, network: networks.cosmos });
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
