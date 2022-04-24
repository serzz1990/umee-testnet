import chalk from "chalk";
import { StargateClient } from "@cosmjs/stargate";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import registry from "./registry";

export async function getLastRevisionHeight(wssUrl) {
  console.log(chalk.blue('Wait lastRevisionHeight'))
  const $stargateClient = await StargateClient.connect(wssUrl)

  return new Promise((resolve) => {
    const streamTx = $stargateClient.tmClient.subscribeTx()
    const streamTxListener = {
      next(result) {
        const tx = decodeTxRaw(result.tx)
        if (result.result.code === 0 && tx.body.messages[0].typeUrl === '/ibc.applications.transfer.v1.MsgTransfer') {
          const message = registry.decode(tx.body.messages[0])
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
