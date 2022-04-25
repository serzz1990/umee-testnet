import chalk from "chalk";
import Long from "long";
import { StargateClient, createProtobufRpcClient } from "@cosmjs/stargate";
import { ServiceClientImpl } from "cosmjs-types/cosmos/tx/v1beta1/service";

export async function getTxs(network, queries, pagination, orderBy = 2) {
  const $stargateClient = await StargateClient.connect(network.rpcNodeUrl)
  const $rpc = createProtobufRpcClient($stargateClient.queryClient)
  const $serviceClientImpl = new ServiceClientImpl($rpc)
  const result = await $serviceClientImpl.GetTxsEvent({
    events: queries,
    orderBy,
    pagination
  })
  return result
}
export async function getTx(network, hash) {
  const $stargateClient = await StargateClient.connect(network.rpcNodeUrl)
  const result = await $stargateClient.queryClient.tx.getTx(hash)
  return result
}
