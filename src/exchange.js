import { Get } from "./request";
import chalk from "chalk";

export async function getExchangeRate (denom) {
  const currency = denom.slice(1)
  const data = await Get(`https://api.alley.umeemania-1.network.umee.cc/umee/oracle/v1beta1/denoms/exchange_rates/${currency}`)
  return data.exchange_rates[0] ? +data.exchange_rates[0].amount : 0
}

export async function getExchangeRates () {
  // const currency = network.denom.slice(1)
  // const data = await Get(`https://api.alley.umeemania-1.network.umee.cc/umee/oracle/v1beta1/denoms/exchange_rates/`)
  // return data.exchange_rates[0] ? +data.exchange_rates[0].amount : 0
}
