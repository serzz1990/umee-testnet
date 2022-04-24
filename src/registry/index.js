const { Registry } = require("@cosmjs/proto-signing");
const { MsgTransfer } = require('cosmjs-types/ibc/applications/transfer/v1/tx');
const { defaultRegistryTypes } = require("@cosmjs/stargate");
const UmeeBundle = require('../umee.bundle')
const index = new Registry(defaultRegistryTypes)

index.register('/ibc.applications.transfer.v1.MsgTransfer', MsgTransfer)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgLendAsset', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgLendAsset)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgSetCollateral', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgSetCollateral)
index.register('/umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset', UmeeBundle.umeenetwork.umee.leverage.v1beta1.MsgBorrowAsset)

module.exports = index
