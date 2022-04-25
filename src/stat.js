import networks from "./nerworks.json";
import { getExchangeRate, getExchangeRates } from "./exchange";
import { getBorrowed, getBorrowLimit, getTotalBorrowed } from "./borrow";
import { getCollateral, getTotalCollateral } from "./collateral";
import { getBalances } from "./bank";
import chalk from "chalk";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

export async function getStat (mnemonic) {
  console.log(chalk.cyan('Get stat'))
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
  const [{address}] = await wallet.getAccounts();

  const balances = await getBalances(address);
  const [totalBorrowed, totalCollateral, borrowLimit] = await Promise.all([
    getTotalBorrowed(address),
    getTotalCollateral(address),
    getBorrowLimit(address)
  ])
  const coins = {}
  const stat = { totalBorrowed, totalCollateral, borrowLimit, coins }
  await Promise.all(
    Object.keys(networks).map((key) => Promise.all([
      getExchangeRate(networks[key].denom),
      getBorrowed(address, networks[key].denomInUmee),
      getCollateral(address, networks[key].denomInUmee)
    ]).then(([price, borrowed, collateral]) => {
      coins[key] = {
        balance: (balances[networks[key].denomInUmee] || 0), price, borrowed, collateral
      }
    }))
  )

  stat.borrowLimitPercent = stat.totalBorrowed * 100 / stat.borrowLimit

  return stat
}
