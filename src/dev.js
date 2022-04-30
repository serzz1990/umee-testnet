import networks from './nerworks.json';
import wallets from '../wallets.json';
import { getBalance, getBalances } from "./bank";
import { transfer } from './transfer';
import { getTx, getTxs } from "./transactions";
import { getCollateral, sendCollateral } from "./collateral";
import { getBorrow, getBorrowed } from "./borrow";
import { getExchangeRates } from "./exchange";
import { getStat } from "./stat";
import {
  getEthAccount,
  sendToEth,
  supplyFromEth,
  getEthBalance,
  borrowFromEth,
  getEthStat,
  getApproveTokens, approveTokens
} from './eth'
import chalk from "chalk";
import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";

(async () => {
  console.log('RUN DEV');

  const { mnemonic, ethPrivateKey } = wallets[1];

  // const stat = await getStat(mnemonic);
  // console.log(stat)

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'cosmos' });
  const [{address}] = await wallet.getAccounts();

  // console.log(
  //   'getBalances',
  //   await getBalances(address)
  // )

  // console.log(
  //   'getEthBalance cosmos',
  //   await getEthBalance({ mnemonic, ethPrivateKey, tokenAddress: networks.cosmos.eth.token })
  // )

  // console.log(
  //   'getEthStat',
  //   await getEthStat({ mnemonic, ethPrivateKey, network: networks.cosmos })
  // )

  // console.log(
  //   'getApproveTokens',
  //   await getApproveTokens({ mnemonic, ethPrivateKey, tokenAddress: networks.cosmos.eth.token })
  // )

  // approveTokens({
  //   mnemonic,
  //   privateKey: ethPrivateKey,
  //   from: networks.cosmos
  // })

  // borrowFromEth({
  //   mnemonic,
  //   amount: 100000
  // })

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
  //   amount: 500
  // })

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
