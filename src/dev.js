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
import {getEthWallet, sendToEth} from './eth'
import chalk from "chalk";

(async () => {
  const { mnemonic } = wallets[0];
  // const stat = await getStat(mnemonic);
  // console.log(stat)
  // const ethWallet = await getEthWallet(mnemonic);
  sendToEth({
    mnemonic,
    from: networks.cosmos,
    amount: 10
  })
  // console.log('ethWallet', ethWallet)
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
