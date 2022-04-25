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
  const amountFee = 2000;
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

  console.log(chalk.blue(`send supply from ${network.addressName} amount: ${amount}`), address)

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

  const client = await SigningStargateClient.connectWithSigner(umee.rpcNodeUrl, wallet, { registry })
  const result = await client.signAndBroadcast(address,
    messages,
    { amount: coins(amountFee, umee.denom), gas: '200000' },
    ""
  )

  if (result.code === 0) {
    console.log(chalk.green(`SUCCESS supply ${amount} from ${network.addressName}`), result.transactionHash);
  } else {
    console.log(chalk.red(`FAIL supply from ${network.addressName}`), result.transactionHash)
    console.log(result.rawLog)
  }

  client.disconnect()
}

export async function checkCollateral (mnemonic, network) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' })
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
