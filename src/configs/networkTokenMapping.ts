// src/configs/networkTokenMapping.ts

const NETWORK_TOKEN_MAPPING = {
  ERC20: ['ETH', 'USDT'],
  TRC20: ['TRX', 'USDT'],
  BEP20: ['BTC', 'ETH', 'BNB', 'USDT'],
  Solana: ['SOL', 'USDT'],
  Goerli: ['ETH', 'USDT'], // Assuming Goerli as an Ethereum testnet, so using ETH
};

export default NETWORK_TOKEN_MAPPING;
