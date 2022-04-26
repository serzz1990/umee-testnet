import { Reader, Writer } from "protobufjs/minimal";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import * as $protobuf from "protobufjs";

export const MsgSendToEth = {
  encode: function encode(message, writer = Writer.create()) {
    if (message.sender != null && Object.hasOwnProperty.call(message, "sender")) {
      writer.uint32(/* id 1, wireType 2 =*/10).string(message.sender);
    }
    if (message.ethDest != null && Object.hasOwnProperty.call(message, "ethDest")) {
      writer.uint32(/* id 2, wireType 2 =*/18).string(message.ethDest);
    }
    if (message.amount != null && Object.hasOwnProperty.call(message, "amount")) {
      Coin.encode(message.amount, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
    }
    if (message.bridgeFee != null && Object.hasOwnProperty.call(message, "bridgeFee")) {
      Coin.encode(message.bridgeFee, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode: function decode(input, length) {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.assign({});

    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.ethDest = reader.string();
          break;
        case 3:
          // message.amount = $root.cosmos.base.v1beta1.Coin.decode(reader, reader.uint32());
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.bridgeFee = Coin.decode(reader, reader.uint32());
          // message.bridgeFee = $root.cosmos.base.v1beta1.Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial (object = {}) {
    return object;
  }
}
