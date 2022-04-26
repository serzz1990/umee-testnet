import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {SigningStargateClient} from "@cosmjs/stargate";
import registry from "./registry";
import { gravity } from "./registry/gravity";
import {coin, coins} from "@cosmjs/launchpad";
import networks from './nerworks.json';
import chalk from "chalk";
import { umee } from "./nerworks.json";
import { ethers } from "ethers";
import {fromBech32, toBech32} from "@cosmjs/encoding";
import {add} from "nodemon/lib/rules";
const RPC = 'https://goerli.infura.io/v3/';
const provider = new ethers.providers.JsonRpcProvider(RPC);

export async function getEthWallet (mnemonic) {
  const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
  // wallet.connect(provider);
  // console.log('wallet', wallet.address)
  // console.log(
    // await provider.getBalance('ricmoo.eth')
  // );
  return wallet
}

export async function sendToEth ({ mnemonic, from, amount = 10 }) {
  const fromNetwork = from;
  const walletEth = await ethers.Wallet.fromMnemonic(mnemonic);
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: networks.umee.addressName })
  const [{ address }] = await wallet.getAccounts()
  const client = await SigningStargateClient.connectWithSigner(networks.umee.rpcNodeUrl, wallet, { registry })

  console.log(chalk.blue(`Send to ETH ${amount} from ${fromNetwork.addressName}/umee`));
  // console.log(
  //   "MsgSendToEth",
  //   gravity.v1.MsgSendToEth.encode({
  //     sender: umeeAddress,
  //     ethDest: walletEth.address,
  //     amount: coin(amount * 1000000, from.denomInUmee),
  //     bridgeFee: coin(100000, from.denomInUmee)
  //   }).finish()
  // )

  const result = await client.signAndBroadcast(address, [{
    typeUrl: '/gravity.v1.MsgSendToEth',
    value: {
      sender: address,
      ethDest: walletEth.address,
      amount: coin(amount * 1000000, from.denomInUmee),
      bridgeFee: coin(100000, from.denomInUmee)
    }
  }], {
    amount: coins(2000, networks.umee.denom),
    gas: "200000"
  }, "")

  if (result.code === 0) {
    console.log(chalk.green(`SUCCESS send ${amount} from ${fromNetwork.addressName}/umee to ETH`), result.transactionHash);
  } else {
    console.log(chalk.red(`FAIL send ${amount} from ${fromNetwork.addressName}/umee to ETH`), result.transactionHash);
    console.log(result.rawLog)
  }

  client.disconnect()
  return result
}
