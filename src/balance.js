import { StargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toBech32, fromBech32 } from "@cosmjs/encoding";
import chalk from "chalk";

export async function getBalance(mnemonic, network, denom) {
  const balances = this.getBalances(mnemonic, network)
  const balance = balances[denom]
  return balance || 0
}

export async function getBalances (mnemonic, network) {
  console.log(chalk.blue('Get balances'))
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [{ address }] = await wallet.getAccounts()
  const rawAddress = fromBech32(address).data
  const $stargateClient = await StargateClient.connect(network.rpcNodeUrl)
  const balances = await $stargateClient.getAllBalances(toBech32(network.addressName, rawAddress))
  $stargateClient.disconnect()
  return balances.reduce((res, item) => {
    res[item.denom] = item.amount ? +item.amount : 0
    return res
  }, {})
}
