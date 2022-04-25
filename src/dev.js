console.log('RUN DEV');

import networks from './nerworks.json';
import wallets from '../wallets.json';
import { getBalance, getBalances } from './balance';
import { transfer } from './transfer';
import { getTx, getTxs } from "./transactions";
import { getCollateral, sendCollateral } from "./collateral";
import { getBorrow, getBorrowed } from "./borrow";
import { getExchangeRates } from "./exchange";
import { getStat } from "./stat";
import chalk from "chalk";

(async () => {
  const { mnemonic } = wallets[0];
  const stat = await getStat(mnemonic);
  // console.log(stat)

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
  // await transfer({
  //   mnemonic,
  //   from: networks.juno,
  //   to: networks.umee,
  //   amount: 10
  // })
  // await sendCollateral({
  //   mnemonic,
  //   from: networks.osmo,
  //   amount: 10
  // });
  // await getBorrow({
  //   mnemonic,
  //   from: networks.cosmos,
  //   amount: 10
  // });
})()
