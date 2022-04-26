import { Get } from "./request";
import {fromBech32, toBech32} from "@cosmjs/encoding";
import networks from "./nerworks.json";

export async function getBalance (address, network) {
  const rawAddress = fromBech32(address).data;
  const data = await Get(`${networks[network.addressName].api}/bank/balances/${toBech32(network.addressName, rawAddress)}`)
  return data.result.reduce((res, item) => {
    res[item.denom] = item.amount / 1000000
    return res
  }, {});
}

export async function getBalances (address) {
  const rawAddress = fromBech32(address).data;
  const [cosmos, umee, juno, osmo] = await Promise.all(['cosmos', 'umee', 'juno', 'osmo'].map(async (name) => {
    const address = toBech32(name, rawAddress);
    const data = await Get(`${networks[name].api}/bank/balances/${address}`)
    return data.result.reduce((res, item) => {
      res[item.denom] = item.amount / 1000000
      return res
    }, {})
  }))
  return { cosmos, umee, juno, osmo }
}

export async function getPrices () {
  const data = await Get('https://api.poke.umeemania-1.network.umee.cc/umee/oracle/v1beta1/denoms/exchange_rates/')
  return data.exchange_rates.reduce((res, item) => {
    res['u'+item.denom.toLowerCase()] = item.amount;
    return res
  }, {})
}
