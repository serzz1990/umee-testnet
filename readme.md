# Getting Started 
- Install deps: `npm install`
- create file `.env`. For example: `.env.example`
- create file `wallets.json`. For example: `wallets.example.json`

# Jobs

- transfer tokens to Umee `npm run job:transfer`
- supply tokens `npm run job:supply`
- borrow tokens `npm run job:borrow`
- start all jobs `npm run job:all`

# Telegram notify

- create tg bot [here](https://t.me/BotFather)
- add you tg token to `.env`
- write any message into bot
- get chat id `npm run tg:chatid`
- add chat id to `.env`
