import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {SigningStargateClient} from "@cosmjs/stargate";
import registry from "../registry";
import {coin, coins} from "@cosmjs/launchpad";
import networks from '../nerworks.json';
import chalk from "chalk";
import { umee } from "../nerworks.json";
import { ethers } from "ethers";
const RPCUrl = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
import Web3 from 'web3';
import {ethDecoder, depositABI, borrowABI} from "./decoder";

// https://web3js.readthedocs.io/en/v1.7.3/web3-eth-abi.html#eth-abi

export async function getEthAccount ({ mnemonic, privateKey }) {
  const web3 = new Web3(RPCUrl);
  if (privateKey) {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  } else if (mnemonic) {
    const account = await ethers.Wallet.fromMnemonic(mnemonic);
    return web3.eth.accounts.privateKeyToAccount(account.privateKey);
  } else {
    return null;
  }
}

export async function sendToEth ({ mnemonic, privateKey, from, amount = 10 }) {
  const fromNetwork = from;
  const accountEth = await getEthAccount({ mnemonic, privateKey });
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: networks.umee.addressName })
  const [{ address }] = await wallet.getAccounts()
  const client = await SigningStargateClient.connectWithSigner(networks.umee.rpcNodeUrl, wallet, { registry })

  console.log(chalk.blue(`Send to ETH ${amount} from ${fromNetwork.addressName}/umee`));

  const result = await client.signAndBroadcast(address, [{
    typeUrl: '/gravity.v1.MsgSendToEth',
    value: {
      sender: address,
      ethDest: accountEth.address,
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

export async function getEthBalance ({ mnemonic, privateKey }) {
  const web3 = new Web3(RPCUrl);
  const account = await getEthAccount({ mnemonic, privateKey });
  return web3.eth.getBalance(account.address);
}

export async function supplyFromEth ({ mnemonic, privateKey, from, amount = 500000 }) {
  const web3 = new Web3(RPCUrl);
  const contractAddress = '0x75d5e88adf8f3597c7c3e4a930544fb48089c779';
  const account = await getEthAccount({ mnemonic, privateKey });
  const txCount = await web3.eth.getTransactionCount(account.address);

  const txConfig = {
    from: account.address,
    to: contractAddress,
    nonce: txCount,
    value: '0',
    type: 2,
    data: web3.eth.abi.encodeFunctionCall(depositABI, [from.ethToken, amount, account.address, '0'])
  }
  txConfig.gas = await web3.eth.estimateGas(txConfig) * 2;
  console.log('gas', txConfig.gas)
  const txSign = await account.signTransaction(txConfig);
  console.log(chalk.blue(`Supply ${amount} ${from.addressName}/umee from ETH`));

  return new Promise((resolve) => {
    web3.eth.sendSignedTransaction(txSign.rawTransaction)
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 5) {
          console.log(chalk.green(`SUCCESS supply ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
          resolve()
        }
      })
      .on('error', (err) => {
        console.log(chalk.red(`FAIL supply ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
        console.log(err)
        resolve()
      });
  })
}


export async function borrowFromEth ({ mnemonic, privateKey, from, amount = 500000 }) {
  const web3 = new Web3(RPCUrl);
  const contractAddress = '0x75d5e88adf8f3597c7c3e4a930544fb48089c779';
  const account = await getEthAccount({ mnemonic, privateKey });
  const txCount = await web3.eth.getTransactionCount(account.address);
  const txConfig = {
    from: account.address,
    to: contractAddress,
    nonce: txCount,
    value: '0',
    type: 2,
    data: web3.eth.abi.encodeFunctionCall(borrowABI, [from.ethToken, amount, '2', '0', account.address])
  }
  // txConfig.gas = 804820
  txConfig.gas = await web3.eth.estimateGas(txConfig) * 2;
  console.log('gas', txConfig.gas);
  const txSign = await account.signTransaction(txConfig);
  console.log(chalk.blue(`Borrow ${amount} ${from.addressName}/umee from ETH`));

  return new Promise((resolve) => {
    web3.eth.sendSignedTransaction(txSign.rawTransaction)
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 5) {
          console.log(chalk.green(`SUCCESS Borrow ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
          resolve()
        }
      })
      .on('error', (err) => {
        console.log(chalk.red(`FAIL Borrow ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
        console.log(err)
        resolve()
      });
  })
}

// const tx = await web3.eth.getTransaction('0x5fb2240752c1135b419933b69f4dc9b6ebd0ff5d87217e55923df2c483cd7532')
// console.log(ethDecoder.decodeMethod(tx.input));
// const decodedData =
// console.log(tx)

// 0x05fdc86C4209aa60f1D374eea0c8247093a060aD
// 0x110bE24B5515DD08c0918B63660AE4eE5cEd3c9c
// 0x095ea7b300000000000000000000000075d5e88adf8f3597c7c3e4a930544fb48089c779ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
// atom
// https://goerli.etherscan.io/tx/0x4c7530023781891447162f9f52915ff2ce0eea5118b74e7d27a1fe5d09fcfc26


// suppy
// https://goerli.etherscan.io/tx/0x5fb2240752c1135b419933b69f4dc9b6ebd0ff5d87217e55923df2c483cd7532
// atom
// asset 0x110be24b5515dd08c0918b63660ae4ee5ced3c9c



// umee
// contract 0x9939d1E8eF193008F902bFCc5c7d7278332C58Bf
