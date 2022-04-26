const { Registry } = require("@cosmjs/proto-signing");
const { MsgTransfer } = require('cosmjs-types/ibc/applications/transfer/v1/tx');
const { defaultRegistryTypes } = require("@cosmjs/stargate");
const UmeeBundle = require('./umee.bundle')
const { gravity } = require('./gravity')
const index = new Registry(defaultRegistryTypes)

index.register('/gravity.v1.MsgSendToEth', {
  fromPartial: gravity.v1.MsgSendToEth.create,
  encode: gravity.v1.MsgSendToEth.encode,
  decode: gravity.v1.MsgSendToEth.decode,
  fromJSON: gravity.v1.MsgSendToEth.fromObject,
  toJSON: gravity.v1.MsgSendToEth.toObject
})
index.register('/ibc.applications.transfer.v1.MsgTransfer', MsgTransfer)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgLendAsset', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgLendAsset)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgSetCollateral', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgSetCollateral)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset)

// console.log('MsgSendToEth', gravity.v1.MsgSendToEth)
// console.log('MsgTransfer', MsgTransfer)

module.exports = index
