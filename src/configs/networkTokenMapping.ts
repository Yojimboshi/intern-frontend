// src/configs/networkTokenMapping.ts

const NETWORK_TOKEN_MAPPING = {
  ERC20: ['ETH', 'USDT'],
  TRC20: ['TRX', 'USDT'],
  BEP20: ['BTC', 'ETH', 'BNB', 'USDT'],
  BEP20Testnet: ['BNB', 'USDT', 'GGog'], // Added BEP20Testnet with GGog token
  Solana: ['SOL', 'USDT'],
  Sepolia: ['ETH', 'USDT'], // Added Sepolia as it was listed in the backend config
};

export default NETWORK_TOKEN_MAPPING;
