import { getLastRevisionHeight } from './revision-height';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { toBech32, fromBech32 } from "@cosmjs/encoding";
import { coins, coin } from "@cosmjs/launchpad";
import registry from "./registry";
import chalk from "chalk";

module.exports = async function transfer(mnemonic, fromNetwork, toNetwork) {
  const lastRevisionHeight = await getLastRevisionHeight(fromNetwork.wss)
  // const lastRevisionHeight = "334343"
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: fromNetwork.addressName })
  const [{address}] = await wallet.getAccounts()
  const rawAddress = fromBech32(address).data

  const m = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: {
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      token: coin(5990000, fromNetwork.denom),
      sender: toBech32(fromNetwork.addressName, rawAddress),
      receiver: toBech32(toNetwork.addressName, rawAddress),
      timeoutHeight: {
        revisionNumber: "1",
        revisionHeight: lastRevisionHeight.toString()
      }
    }
  }

  const client = await SigningStargateClient.connectWithSigner(fromNetwork.rpcNodeUrl, wallet, {registry})
  const fee = {amount: coins(10000, fromNetwork.denom), gas: "1000000"}
  console.log(chalk.blue('Send tx'))
  const result = await client.signAndBroadcast(address, [m], fee, "")

  if (result.code === 0) {
    console.log(chalk.green('SUCCESS'), result.transactionHash)
  } else {
    console.log(chalk.green('FAIL'), result.transactionHash)
    console.log(result.rawLog)
  }

  client.disconnect()
  return result
}
