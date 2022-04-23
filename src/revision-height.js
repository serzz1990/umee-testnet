const chalk = require('chalk');
const Stargate = require("@cosmjs/stargate");
const { MsgTransfer } = require('cosmjs-types/ibc/applications/transfer/v1/tx');
const { decodeTxRaw } = require("@cosmjs/proto-signing");

module.exports = async function getLastRevisionHeight(wssUrl) {
  console.log(chalk.blue('Wait lastRevisionHeight'))
  const $stargateClient = await Stargate.StargateClient.connect(wssUrl)

  return new Promise((resolve) => {
    const streamTx = $stargateClient.tmClient.subscribeTx()
    const streamTxListener = {
      next(result) {
        const tx = decodeTxRaw(result.tx)
        if (result.result.code === 0 && tx.body.messages[0].typeUrl === '/ibc.applications.transfer.v1.MsgTransfer') {
          const message = MsgTransfer.decode(tx.body.messages[0].value)
          const revisionHeight = message.timeoutHeight.revisionHeight.toNumber()
          // console.log(result.height, revisionHeight, result.height - revisionHeight)
          streamTx.removeListener(streamTxListener)
          $stargateClient.disconnect()
          resolve(revisionHeight)
        }
      }
    }
    streamTx.addListener(streamTxListener)
  })
}
