import { getLastRevisionHeight } from './revision-height';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { toBech32, fromBech32 } from "@cosmjs/encoding";
import { coins, coin } from "@cosmjs/launchpad";
import { addLogMessage } from "./logs";
import { umee } from "./nerworks.json";
import registry from "./registry";

export async function transfer({ mnemonic, from, to = umee, amount = 10 }) {
  const feeAmount = 10000;
  const toNetwork = to;
  const fromNetwork = from;
  const lastRevisionHeight = await getLastRevisionHeight(fromNetwork);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: fromNetwork.addressName });
  const [{address}] = await wallet.getAccounts();
  const rawAddress = fromBech32(address).data;
  const client = await SigningStargateClient.connectWithSigner(fromNetwork.rpcNodeUrl, wallet, {registry});
  const m = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: {
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      token: coin(amount * 1000000 - feeAmount, fromNetwork.denom),
      sender: toBech32(fromNetwork.addressName, rawAddress),
      receiver: toBech32(toNetwork.addressName, rawAddress),
      timeoutHeight: {
        revisionNumber: "1",
        revisionHeight: lastRevisionHeight
      }
    }
  }
  const fee = {amount: coins(feeAmount, fromNetwork.denom), gas: "1000000"};
  await addLogMessage(mnemonic, `TRANSFER | to umee from ${address} | Send ${amount} ${fromNetwork.denom}`);
  const result = await client.signAndBroadcast(address, [m], fee, "");

  if (result.code === 0) {
    await addLogMessage(mnemonic, `TRANSFER | to umee from ${address} | SUCCESS Send ${amount} ${fromNetwork.denom} | TX HASH: ${result.transactionHash}`);
  } else {
    await addLogMessage(mnemonic, `TRANSFER | to umee from ${address} | FAIL Send ${amount} ${fromNetwork.denom} | TX HASH: ${result.transactionHash}`);
    console.log(result.rawLog);
  }

  client.disconnect();
  return result;
}
