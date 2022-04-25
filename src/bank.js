import { Get } from "./request";
import {fromBech32, toBech32} from "@cosmjs/encoding";
import networks from "./nerworks.json";

export async function getBalances (address, ) {
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
