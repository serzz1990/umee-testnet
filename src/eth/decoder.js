// https://github.com/ConsenSys/abi-decoder
import abiDecoder from 'abi-decoder'

export const depositABI = {
  "name": "deposit",
  "constant": true,
  "payable": false,
  "type": "function",
  "inputs": [
    {"type": "address", "name": "asset"},
    {"type": "uint256", "name": "amount"},
    {"type": "address", "name": "onBehalfOf"},
    {"type": "uint16", "name": "referralCode"}
  ],
  "outputs": [
    {"type": "address", "name": "asset"},
    {"type": "uint256", "name": "amount"},
    {"type": "address", "name": "onBehalfOf"},
    {"type": "uint16", "name": "referralCode"}
  ]
}

export const approveABI = {
  "name": "approve",
  "constant": true,
  "payable": false,
  "type": "function",
  "inputs": [
    {"type": "address", "name": "spender"},
    {"type": "uint256", "name": "tokens"}
  ],
  "outputs": [
    {"type": "address", "name": "spender"},
    {"type": "uint256", "name": "tokens"}
  ]
}

export const borrowABI = {
  "name": "borrow",
  "constant": true,
  "payable": false,
  "type": "function",
  "inputs": [
    {"type": "address", "name": "asset"},
    {"type": "uint256", "name": "amount"},
    {"type": "uint256", "name": "interestRateMode"},
    {"type": "uint16", "name": "referralCode"},
    {"type": "address", "name": "onBehalfOf"}
  ],
  "outputs": [
    {"type": "address", "name": "asset"},
    {"type": "uint256", "name": "amount"},
    {"type": "uint256", "name": "interestRateMode"},
    {"type": "uint16", "name": "referralCode"},
    {"type": "address", "name": "onBehalfOf"}
  ]
}

abiDecoder.addABI([depositABI, approveABI, borrowABI]);

export const ethDecoder = abiDecoder;
