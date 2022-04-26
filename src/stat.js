import networks from "./nerworks.json";
import { getExchangeRate, getExchangeRates } from "./exchange";
import { getBorrowed, getBorrowLimit, getTotalBorrowed } from "./borrow";
import { getCollateral, getTotalCollateral } from "./collateral";
import { getBalances } from "./bank";
import chalk from "chalk";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {fromBech32, toBech32} from "@cosmjs/encoding";

export async function getBorrowStat (mnemonic) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
  const [{address}] = await wallet.getAccounts();
  const [totalBorrowed, totalCollateral, borrowLimit] = await Promise.all([
    getTotalBorrowed(address),
    getTotalCollateral(address),
    getBorrowLimit(address)
  ]);

  return {
    totalBorrowed,
    totalCollateral,
    borrowLimit,
    borrowLimitPercent: totalBorrowed * 100 / borrowLimit
  }
}

export async function getStat (mnemonic) {
  console.log(chalk.cyan('Get stat'))
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
  const [{address}] = await wallet.getAccounts();
  const balances = await getBalances(address);
  const borrow = await getBorrowStat(mnemonic);

  const coins = {}
  const prices = {}
  const stat = { borrow, coins, prices }
  await Promise.all(
    Object.keys(networks).map((key) => Promise.all([
      getExchangeRate(networks[key].denom),
      getBorrowed(address, networks[key].denomInUmee),
      getCollateral(address, networks[key].denomInUmee)
    ]).then(([price, borrowed, collateral]) => {
      prices[key] = price;
      coins[key] = {
        balance: balances[key], borrowed, collateral
      }
    }))
  )

  return stat
}
