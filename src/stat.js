import { getExchangeRate } from "./exchange";
import { getBorrowed, getBorrowLimit, getTotalBorrowed } from "./borrow";
import { getCollateral, getTotalCollateral } from "./collateral";
import { getBalances } from "./bank";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { sendError } from "./telegram";
import networks from "./nerworks.json";

export async function getBorrowStat (mnemonic) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
    const [{ address }] = await wallet.getAccounts();
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
  } catch (e) {
    sendError([`Stat -> getBorrowStat`, e]);
    return Promise.reject(e);
  }
}

export async function getStat (mnemonic) {
  try {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'umee' });
    const [{ address }] = await wallet.getAccounts();
    const balances = await getBalances(address);
    const borrow = await getBorrowStat(mnemonic);

    const coins = {};
    const prices = {};
    const stat = { borrow, coins, prices };
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
    );
    return stat;
  } catch (e) {
    sendError([`Stat -> getStat`, e]);
    return Promise.reject(e);
  }
}
