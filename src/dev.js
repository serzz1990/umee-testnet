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


(async () => {
  for (let walletIndex = wallets.length; walletIndex--;) {
    const { mnemonic } = wallets[walletIndex];
    const stat = await getStat(mnemonic);
    console.log(stat)

    // await transfer({
    //   mnemonic,
    //   from: networks.juno,
    //   to: networks.umee,
    //   amount: 10
    // })
    // await sendCollateral({
    //   mnemonic,
    //   from: networks.osmo ,
    //   amount: 10
    // });
    // await getBorrow({
    //   mnemonic,
    //   from: networks.cosmos,
    //   amount: 10
    // });
  }
})()
