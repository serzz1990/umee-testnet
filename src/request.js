import axios from "axios";
import { promisify } from 'util'

export async function Get (url, requestConfig) {
  const totalTryCount = 3
  let tryCount = totalTryCount
  let error = null
  while (tryCount) {
    try {
      const { data } = await axios.get(url, requestConfig)
      return data
    } catch (e) {
      const timout = 25000 * (totalTryCount - tryCount)
      tryCount--;
      error = e
      console.log(`Fail request (${totalTryCount - tryCount}/${totalTryCount + 1}) ${url}, next request in ${timout/1000}s`)
      await promisify(setTimeout)(timout)
    }
  }
  return Promise.reject(error)
}
