import { Get } from "./request";

const { getTxs } = require("./transactions");
import { umee } from "./nerworks.json";
import { coins, coin } from "@cosmjs/launchpad";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import registry from "./registry";
import chalk from "chalk";

export async function sendCollateral ({ mnemonic, from, amount = 10 }) {
  const network = from;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' })
  const [{address}] = await wallet.getAccounts()
  const collateralized = await checkCollateral(mnemonic, network)
  const messages = [{
    typeUrl: '/umeenetwork.umee.leverage.v1beta1.MsgLendAsset',
    value: {
      lender: address,
      amount: coin(amount * 1000000, network.denomInUmee)
    }
  }]

  if (!collateralized) {
    messages.push({
      typeUrl: '/umeenetwork.umee.leverage.v1beta1.MsgSetCollateral',
      value: {
        borrower: address,
        denom: `u/${network.denomInUmee}`,
        enable: true
      }
    })
  }

  console.log(chalk.blue('send LendAsset'), address, messages.length)
  const client = await SigningStargateClient.connectWithSigner(umee.rpcNodeUrl, wallet, { registry })
  const result = await client.signAndBroadcast(address,
    messages,
    { amount: coins(2000, umee.denom), gas: '200000' },
    ""
  )

  if (result.code === 0) {
    console.log(chalk.green('SUCCESS'), result.transactionHash)
  } else {
    console.log(chalk.green('FAIL'), result.transactionHash)
    console.log(result.rawLog)
  }

  client.disconnect()
}

export async function checkCollateral (mnemonic, network) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: umee })
  const [{ address }] = await wallet.getAccounts()
  const result = await getTxs(umee, [
    `message.action='/umeenetwork.umee.leverage.v1beta1.MsgSetCollateral'`,
    `message.sender='${address}'`,
    `set_collateral_setting.denom='u/${network.denomInUmee}'`
  ])
  return !!result.pagination.total.toNumber()
}

export async function getCollateral (address, denom) {
  const data = await Get('https://api.alley.umeemania-1.network.umee.cc/umee/leverage/v1beta1/collateral', {
    params: { address, denom: 'u/' + denom }
  })
  return data.collateral[0] ? (+data.collateral[0].amount / 1000000) : 0
}

export async function getTotalCollateral (address) {
  const data = await Get('https://api.alley.umeemania-1.network.umee.cc/umee/leverage/v1beta1/collateral_value', {
    params: { address }
  })
  return data.collateral_value ? +data.collateral_value : 0
}
