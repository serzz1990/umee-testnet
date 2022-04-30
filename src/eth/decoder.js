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

export const ERC20TokenABI = [{
  "name": "allowance",
  "type": "function",
  "constant": true,
  "inputs": [{"name":"owner","type":"address"}, {"name":"spender","type":"address"}],
  "outputs": [{"name":"tokens","type":"uint256"}]
},{
  "name": "approve",
  "type": "function",
  "constant": true,
  "inputs": [{"name":"spender","type":"address"}, {"name":"tokens","type":"uint256"}],
  "outputs": [{"name":"spender","type":"address"}, {"name":"tokens","type":"uint256"}]
},{
  "name": "balanceOf",
  "type": "function",
  "constant": true,
  "inputs": [{"name":"_owner","type":"address"}],
  "outputs": [{"name":"balance","type":"uint256"}]
}]


abiDecoder.addABI([depositABI, borrowABI]);

export const ethDecoder = abiDecoder;
