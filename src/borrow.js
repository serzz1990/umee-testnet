import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { umee } from "./nerworks.json";
import { SigningStargateClient } from "@cosmjs/stargate";
import { coins, coin } from "@cosmjs/launchpad";
import registry from "./registry";

import chalk from "chalk";

export async function getBorrow (mnemonic, network, value = 1024488) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' })
  const [{address}] = await wallet.getAccounts()
  const client = await SigningStargateClient.connectWithSigner(umee.rpcNodeUrl, wallet, { registry })
  console.log(chalk.blue('get Borrow'), address)
  const result = await client.signAndBroadcast(address,
    [{
      typeUrl: '/umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset',
      value: {
        borrower: address,
        amount: coin(value, network.denomInUmee)
      }
    }],
    { amount: coins(2000, umee.denom), gas: '300000' },
    ''
  )

  if (result.code === 0) {
    console.log(chalk.green('SUCCESS'), result.transactionHash)
  } else {
    console.log(chalk.green('FAIL'), result.transactionHash)
    console.log(result.rawLog)
  }
  return result
}
