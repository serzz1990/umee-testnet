import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {SigningStargateClient} from "@cosmjs/stargate";
import registry from "./registry";
import {coin, coins} from "@cosmjs/launchpad";
import chalk from "chalk";
import {umee} from "./nerworks.json";

export async function sendToEth ({ mnemonic, from, to, amount = 10 }) {
  const fromNetwork = from;
  const toNetwork = to;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: fromNetwork.addressName })
  const [{address}] = await wallet.getAccounts()
  const client = await SigningStargateClient.connectWithSigner(fromNetwork.rpcNodeUrl, wallet, {registry})

  console.log(chalk.blue('Send to eth'))
  const result = await client.signAndBroadcast(address, [{
    typeUrl: '/gravity.v1.MsgSendToEth',
    value: {
      sender: address,
      eth_dest: "eth_address",
      amount: coin(35278776, 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'),
      bridge_fee: coin(100000000, 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2')
    }
  }], {
    amount: coins(2000, fromNetwork.denom),
    gas: "200000"
  }, "")

  if (result.code === 0) {
    console.log(chalk.green('SUCCESS'), result.transactionHash)
  } else {
    console.log(chalk.green('FAIL'), result.transactionHash)
    console.log(result.rawLog)
  }

  client.disconnect()
  return result
}

// {
//   "chain_id": "umeemania-1",
//   "account_number": "71745",
//   "sequence": "18",
//   "fee": {
//   "gas": "200000",
//     "amount": [
//     {
//       "denom": "uumee",
//       "amount": "2000"
//     }
//   ]
// },
//   "msgs": [
//   {
//     "type": "gravity/MsgSendToEth",
//     "value": {
//       "sender": "umee1c9mavwtpw94kqep90a2qfzfyg0amp26k7r8leg",
//       "eth_dest": "eth_address",
//       "amount": {
//         "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
//         "amount": "35278776"
//       },
//       "bridge_fee": {
//         "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
//         "amount": "100000000"
//       }
//     }
//   }
// ],
//   "memo": "lama"
// }
