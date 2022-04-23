const getLastRevisionHeight = require('./revision-height')
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const { toBech32, fromBech32 } = require("@cosmjs/encoding");
const { coins, coin } = require('@cosmjs/launchpad');
const chalk = require('chalk');
const { MsgTransfer } = require('cosmjs-types/ibc/applications/transfer/v1/tx');
const { SigningStargateClient, defaultRegistryTypes } = require("@cosmjs/stargate");

module.exports = async function transfer(mnemonic, fromNetwork, toNetwork) {
  const lastRevisionHeight = await getLastRevisionHeight(fromNetwork.wss)
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [{address}] = await wallet.getAccounts()
  const rawAddress = fromBech32(address).data
  const registry = new Registry(defaultRegistryTypes)
  registry.register('/ibc.applications.transfer.v1.MsgTransfer', MsgTransfer)

  const m = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      token: coin(5990000, fromNetwork.denom),
      sender: toBech32(fromNetwork.addressName, rawAddress),
      receiver: toBech32(toNetwork.addressName, rawAddress),
      timeoutHeight: {
        revisionNumber: "1",
        revisionHeight: lastRevisionHeight.toString()
      }
    })
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
