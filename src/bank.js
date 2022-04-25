import { Get } from "./request";

export async function getBalances (address) {
  const data = await Get(`https://api.alley.umeemania-1.network.umee.cc/bank/balances/${address}`)
  return data.result.reduce((res, item) => {
    res[item.denom] = item.amount / 1000000
    return res
  })
}
