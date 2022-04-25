console.log('RUN JOB SUPPLY');

import networks from './nerworks.json';
import wallets from '../wallets.json';
import { getStat } from "./stat";
import {sendCollateral} from "./collateral";
import chalk from "chalk";

(async () => {
  for (const wallet of wallets) {
    try {
      const { mnemonic } = wallet;
      const stat = await getStat(mnemonic);

      [networks.cosmos, networks.juno, networks.osmo].map(async (network) => {
        try {
          const balance = stat.coins.umee.balance[network.denomInUmee]
          if (balance > 10) {
            await sendCollateral({
              mnemonic,
              from: network,
              amount: balance
            });
          }
        } catch (e) {
          console.log(chalk.red(`FAIL in ${network.addressName}`));
        }
      })
    } catch (e) {}
  }
})();
