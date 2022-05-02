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
import {ethDecoder, depositABI, borrowABI, ERC20TokenABI} from "./decoder";

const contractCosmosAddress = '0x75d5e88adf8f3597c7c3e4a930544fb48089c779';

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

  const bridgeFee = 3953776;
  const _amount = Math.floor((amount - 1) * 1000000 - bridgeFee);
  if (_amount > 0) {
    console.log(chalk.blue(`Send to ETH ${amount} from ${fromNetwork.addressName}/umee`));
    const result = await client.signAndBroadcast(address, [{
      typeUrl: '/gravity.v1.MsgSendToEth',
      value: {
        sender: address,
        ethDest: accountEth.address,
        amount: coin(_amount, from.denomInUmee),
        bridgeFee: coin(bridgeFee, from.denomInUmee)
      }
    }], {
      amount: coins(2000, networks.umee.denom),
      gas: "200000"
    }, "memo")

    if (result.code === 0) {
      console.log(chalk.green(`SUCCESS send ${amount} from ${fromNetwork.addressName}/umee to ETH`), result.transactionHash);
    } else {
      console.log(chalk.red(`FAIL send ${amount} from ${fromNetwork.addressName}/umee to ETH`), result.transactionHash);
      console.log(result.rawLog)
    }
    client.disconnect();
    return result;
  } else {
    console.log(chalk.red(`Send to ETH ${amount} from ${fromNetwork.addressName}/umee insufficient funds`));
  }
}

export async function getEthBalance ({ mnemonic, privateKey, tokenAddress }) {
  const web3 = new Web3(RPCUrl);
  const account = await getEthAccount({ mnemonic, privateKey });

  if (tokenAddress) {
    try {
      let contract = new web3.eth.Contract(ERC20TokenABI, tokenAddress);
      const count = await contract.methods.balanceOf(account.address).call();
      return count ? count / 1000000 : 0;
    } catch (e) {
      return 0;
    }
  } else {
    return web3.eth.getBalance(account.address);
  }
}

export async function supplyFromEth ({ mnemonic, privateKey, from, amount = 100000 }) {
  const web3 = new Web3(RPCUrl);
  const account = await getEthAccount({ mnemonic, privateKey });
  const txCount = await web3.eth.getTransactionCount(account.address);
  const _amount = Math.floor(amount * 1000000);
  const txConfig = {
    from: account.address,
    to: contractCosmosAddress,
    nonce: txCount,
    value: '0',
    type: 2,
    data: web3.eth.abi.encodeFunctionCall(depositABI, [from.eth.token, _amount, account.address, '0'])
  }
  txConfig.gas = await web3.eth.estimateGas(txConfig) * 2;
  const txSign = await account.signTransaction(txConfig);
  console.log(chalk.blue(`Supply ${amount} ${from.addressName}/umee from ETH`));

  try {
    await web3.eth.sendSignedTransaction(txSign.rawTransaction);
    console.log(chalk.green(`SUCCESS supply ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
  } catch (e) {
    console.log(chalk.red(`FAIL supply ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
  }
}

export async function borrowFromEth ({ mnemonic, privateKey, from, amount = 100000 }) {
  // https://web3js.readthedocs.io/en/v1.7.3/web3-eth-contract.html#id27
  const web3 = new Web3(RPCUrl);
  const account = await getEthAccount({ mnemonic, privateKey });
  const txCount = await web3.eth.getTransactionCount(account.address);
  const _amount = Math.floor(amount * 1000000);
  const txConfig = {
    from: account.address,
    to: contractCosmosAddress,
    nonce: txCount,
    value: '0',
    type: 2,
    data: web3.eth.abi.encodeFunctionCall(borrowABI, [from.eth.token, _amount, '2', '0', account.address])
  }
  txConfig.gas = await web3.eth.estimateGas(txConfig) * 2;
  const txSign = await account.signTransaction(txConfig);
  console.log(chalk.blue(`Borrow ${amount} ${from.addressName}/umee from ETH`));

  try {
    await web3.eth.sendSignedTransaction(txSign.rawTransaction)
    console.log(chalk.green(`SUCCESS Borrow ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
  } catch (e) {
    console.log(chalk.red(`FAIL Borrow ${amount} ${from.addressName}/umee from ETH`), txSign.transactionHash);
  }
}

export async function approveTokens ({ mnemonic, privateKey, from }) {
  const web3 = new Web3(RPCUrl);
  const contract = new web3.eth.Contract(ERC20TokenABI, from.eth.token);
  const account = await getEthAccount({ mnemonic, privateKey });
  const txCount = await web3.eth.getTransactionCount(account.address);
  const txConfig = {
    from: account.address,
    to: from.eth.token,
    nonce: txCount,
    value: '0',
    type: 2,
    data: contract.methods.approve(contractCosmosAddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935').encodeABI()
  }
  console.log(chalk.blue(`approve tokens ${from.addressName}/umee in ETH`));
  txConfig.gas = await web3.eth.estimateGas(txConfig) * 2;
  const txSign = await account.signTransaction(txConfig);

  try {
    await web3.eth.sendSignedTransaction(txSign.rawTransaction)
    console.log(chalk.green(`SUCCESS approve tokens ${from.addressName}/umee in ETH`), txSign.transactionHash);
  } catch (e) {
    console.log(chalk.red(`FAIL approve tokens ${from.addressName}/umee in ETH`), txSign.transactionHash);
  }
}

export async function getEthStat ({ mnemonic, privateKey, network }) {
  const [balance, borrow, supply] = await Promise.all([
    getEthBalance({ mnemonic, privateKey, tokenAddress: network.eth.token }),
    getEthBalance({ mnemonic, privateKey, tokenAddress: network.eth.borrow }),
    getEthBalance({ mnemonic, privateKey, tokenAddress: network.eth.supply })
  ])
  const borrowLimit = supply * 0.8;
  const borrowPercent = borrowLimit ? borrow * 100 / borrowLimit : 0;
  return { balance, borrow, supply, borrowLimit, borrowPercent }
}

export async function getApproveTokens ({ mnemonic, privateKey, tokenAddress }) {
  const web3 = new Web3(RPCUrl);
  const account = await getEthAccount({ mnemonic, privateKey });
  try {
    const contract = new web3.eth.Contract(ERC20TokenABI, tokenAddress);
    const result = await contract.methods.allowance(account.address, contractCosmosAddress).call();
    return result || 0
  } catch (e) {
    console.log('Fail in getApproveTokens', tokenAddress, e);
    return 0;
  }
}
