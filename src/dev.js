import networks from './nerworks.json';
import wallets from '../wallets.json';
import { getBalance, getBalances } from './balance';
import { transfer } from './transfer';
import { getTx, getTxs } from "./transactions";
import { getCollateral, sendCollateral } from "./collateral";
import { getBorrow, getBorrowed } from "./borrow";
import { getExchangeRates } from "./exchange";
import { getStat } from "./stat";
import {getEthAccount, sendToEth, supplyFromEth, getEthBalance, borrowFromEth} from './eth'
import chalk from "chalk";

(async () => {
  console.log('RUN DEV');

  const { mnemonic, ethPrivateKey } = wallets[0];
  // const stat = await getStat(mnemonic);
  // console.log(stat)
  // const ethWallet = await getEthWallet(mnemonic);
  // console.log(await getEthBalance({ mnemonic }));

  borrowFromEth({
    mnemonic,
    privateKey: ethPrivateKey,
    from: networks.cosmos,
    amount: 100000
  })
  // supplyFromEth({
  //   mnemonic,
  //   privateKey: ethPrivateKey,
  //   from: networks.cosmos,
  //   amount: 100000
  // })

  // sendToEth({
  //   mnemonic,
  //   privateKey: ethPrivateKey,
  //   from: networks.cosmos,
  //   amount: 10
  // })

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
