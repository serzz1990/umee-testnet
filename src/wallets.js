import './env'
import path from 'path'

const walletsPath = process.env.WALLETS_PATH;
export const wallets = require(path.resolve(process.cwd(), walletsPath));
