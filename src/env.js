import dotenv from 'dotenv'
import fs from 'fs'

const envPath = process.cwd() + '/.env'
const envPathExample = process.cwd() + '/.env.example'

dotenv.config({
  path: fs.existsSync(envPath) ? envPath : envPathExample
})
