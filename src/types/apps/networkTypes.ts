// src/types/apps/networkTypes.ts

export interface Network {
  code: '' | 'ERC20' | 'TRC20' | 'BEP20' | 'BEP20Testnet' | 'Sepolia' | 'Solana';
  name: string;
}

export interface NetworksState {
  data: Network[];
}
