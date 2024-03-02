// src\types\apps\walletTypes.ts

export interface CryptoBalance {
  id: number;
  userId: number;
  tokenSymbol: string;
  totalBalance: string; // Assuming balance is a string to handle large numbers or precision
}

export interface EwalletCoin {
  name: string;
  symbol: string;
}

export interface EwalletBalance {
  id: number;
  userId: number;
  coinId: number;
  balance: string;
  ewalletCoin: EwalletCoin;
}

export interface WalletData {
  cryptoBalances: CryptoBalance[];
  ewalletBalances: EwalletBalance[];
}


export type walletBalanceType = {
  id: number
  name: string
  total: number
  avatar: string
  service: string
  address: string
  avatarColor?: string
  balance: string | number
  isCrypto: boolean
}
