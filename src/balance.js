const Stargate = require("@cosmjs/stargate");
const { DirectSecp256k1HdWallet, Registry } = require("@cosmjs/proto-signing");
const { toBech32, fromBech32 } = require("@cosmjs/encoding");
const chalk = require('chalk');

module.exports = async function getBalance(mnemonic, network) {
  console.log(chalk.blue('Get balance'))
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic)
  const [{ address }] = await wallet.getAccounts()
  const rawAddress = fromBech32(address).data
  const $stargateClient = await Stargate.StargateClient.connect(network.rpcNodeUrl)
  const balance = await $stargateClient.getBalance(toBech32(network.addressName, rawAddress), network.denom)
  $stargateClient.disconnect()
  console.log(chalk.blue('balance'), balance.amount)
  return balance.amount
}
