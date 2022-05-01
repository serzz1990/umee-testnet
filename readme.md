# Getting Started 
- Install deps: `npm install`
- create file `.env`. For example: `.env.example`
- create file `wallets.json`. For example: `wallets.example.json`

# Jobs

- transfer tokens to Umee `npm run job:transfer`
- transfer tokens to ETH `npm run job:transfer:eth`
- supply COSMOS tokens `npm run job:supply`
- borrow COSMOS tokens `npm run job:borrow`
- supply ERC20 tokens `npm run job:supply:eth`
- borrow ERC20 tokens`npm run job:borrow:eth`
- start all jobs `npm run job:all`

#ETH
- add ethPrivateKey or use the same mnemonic in `wallets.json`

# Telegram notify

- create tg bot [here](https://t.me/BotFather)
- add you tg token to `.env`
- write any message into bot
- get chat id `npm run tg:chatid`
- add chat id to `.env`
