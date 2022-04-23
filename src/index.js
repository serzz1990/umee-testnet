const networks = require('./nerworks.json')
const getBalance = require('./balance')
const wallets = require('../wallets.json');

(async () => {
  for (let walletIndex = wallets.length; walletIndex--;) {
    const wallet = wallets[walletIndex];
    const balance = await getBalance(wallet.mnemonic, networks.cosmos)
  }
})()
