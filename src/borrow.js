import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { umee } from "./nerworks.json";
import { SigningStargateClient } from "@cosmjs/stargate";
import { coins, coin } from "@cosmjs/launchpad";
import registry from "./registry";
import { Get } from "./request";

import chalk from "chalk";

export async function getBorrow ({ mnemonic, from, amount = 10 }) {
  const amountFee = 2000;
  const network = from;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' })
  const [{address}] = await wallet.getAccounts()
  const client = await SigningStargateClient.connectWithSigner(umee.rpcNodeUrl, wallet, { registry })
  console.log(chalk.blue(`Borrow for ${amount} ${network.addressName}`), address)

  const result = await client.signAndBroadcast(address,
    [{
      typeUrl: '/umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset',
      value: {
        borrower: address,
        amount: coin((amount * 1000000).toFixed(0), network.denomInUmee)
      }
    }],
    { amount: coins(amountFee, umee.denom), gas: '300000' },
    ''
  )

  if (result.code === 0) {
    console.log(chalk.green(`SUCCESS borrow ${amount} ${network.addressName}`), result.transactionHash);
  } else {
    console.log(chalk.red(`FAIL borrow ${amount} ${network.addressName}`), result.transactionHash);
    console.log(result.rawLog)
  }
  return result
}

export async function getBorrowed (address, denom) {
  const data = await Get('https://api.alley.umeemania-1.network.umee.cc/umee/leverage/v1beta1/borrowed', {
    params: { address, denom }
  })
  return data.borrowed[0] ? (+data.borrowed[0].amount / 1000000) : 0
}

export async function getBorrowLimit (address) {
  const data = await Get('https://api.alley.umeemania-1.network.umee.cc/umee/leverage/v1beta1/borrow_limit', {
    params: { address }
  })
  return data.borrow_limit ? +data.borrow_limit : 0
}

export async function getTotalBorrowed (address) {
  const data = await Get('https://api.alley.umeemania-1.network.umee.cc/umee/leverage/v1beta1/borrowed_value', {
    params: { address }
  })
  return data.borrowed_value ? +data.borrowed_value : 0
}
