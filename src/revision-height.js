import { Get } from "./request";

export async function getLastRevisionHeight(network) {
  const data = await Get(`https://api.alley.umeemania-1.network.umee.cc/blocks/latest`)
  return (+data.block.last_commit.height + 150).toString()
}
