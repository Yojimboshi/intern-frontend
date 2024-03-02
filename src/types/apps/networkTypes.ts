// src\types\apps\networkTypes.ts

export interface Network {
  code: '' | 'ERC20' | 'TRC20' | 'BEP20' | 'Goerli' | 'Solana';
  name: string;
}

export interface NetworksState {
  data: Network[];
}
