import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { sendCollateral } from "./collateral";
import { wallets } from './wallets'
import { getBalance } from "./bank";
import { promisify } from "util";

import chalk from "chalk";
import networks from './nerworks.json';
import {approveTokens, getApproveTokens, getEthStat, supplyFromEth} from "./eth";
import {sendError} from "./telegram";

const sleep = promisify(setTimeout);

(async () => {
  console.log(`JOB SUPPLY ETH: started (${new Date()})`);
  for (const [index, wallet] of wallets.entries()) {
    console.log(`Wallet ${index + 1}`);
    try {
      const { mnemonic, ethPrivateKey } = wallet;

      for(const network of [networks.cosmos]) {
        try {
          const stat = await getEthStat({ mnemonic, ethPrivateKey, network });
          const approveTokensCount = await getApproveTokens({ mnemonic, privateKey: ethPrivateKey, tokenAddress: network.eth.token })
          console.log('stat', approveTokensCount)
          if (!approveTokensCount) {
            await approveTokens({ mnemonic, privateKey: ethPrivateKey, from: network });
          } else if (stat.balance > 0) {
            await supplyFromEth({
              mnemonic,
              privateKey: ethPrivateKey,
              from: network,
              amount: stat.balance
            });
          } else {
            console.log(chalk.green(`Token ${network.addressName} already supplied`));
          }
        } catch (e) {
          sendError([`job.supply.eth`, `wallet: ${index + 1}`, e]);
          console.log(chalk.red(`FAIL in ${network.addressName}`, e));
        }
        await sleep(1000);
      }
    } catch (e) {
      sendError([`job.supply.eth`, `wallet: ${index + 1}`, e]);
      console.log(e);
    }
  }
  console.log(`JOB SUPPLY ETH: ended (${new Date()})`);
})();
