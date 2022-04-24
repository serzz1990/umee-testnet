import networks from './nerworks.json';
import { getBalance, getBalances } from './balance';
import wallets from '../wallets.json';
import transfer from './transfer';
import { getTx, getTxs } from "./transactions";
import { sendLendAsset } from "./collateral";
import { getBorrow } from "./borrow";

(async () => {
  for (let walletIndex = wallets.length; walletIndex--;) {
    const wallet = wallets[walletIndex];
    // await transfer(wallet.mnemonic, networks.osmo, networks.umee)
    // await sendLendAsset(wallet.mnemonic, networks.osmo);
    await getBorrow(wallet.mnemonic, networks.cosmos);

    // const balances = await getBalances(wallet.mnemonic, networks.umee)
    // console.log(balances)
  }
})()
