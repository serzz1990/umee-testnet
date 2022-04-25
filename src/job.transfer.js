console.log('RUN TASK TRANSFER');

import networks from './nerworks.json';
import wallets from '../wallets.json';
import { transfer } from './transfer';
import { getStat } from "./stat";
import chalk from "chalk";

(async () => {
  const { mnemonic } = wallets[0];
  const stat = await getStat(mnemonic);

  [networks.cosmos, networks.juno, networks.osmo].map((network) => {
    try {
      const balance = stat.coins[network.addressName].balance[network.denom]
      if (balance > 10) {
        return transfer({
          mnemonic,
          from: network,
          to: networks.umee,
          amount: balance
        })
      }
    } catch (e) {
      console.log(chalk.red(`FAIL in ${network.addressName}`));
    }
  })
})()
