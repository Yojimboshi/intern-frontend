// src\types\apps\transactionTypes.ts

export interface EwalletTransactionType {
  userId: number;
  coinId: number;
  type: 'deposit' | 'reward' | 'withdrawal' | 'transfer' | 'conversion';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  amount: string; // Using string to handle big decimal values
  description?: string;
  date: string; // ISO Date string
}

export interface CryptoTransactionType {
  userId: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'internalTransfer';
  currency: string;
  amount: string; // Using string for decimal values
  toAddress?: string;
  toUsername?: string;
  fromAddress?: string;
  fromUsername?: string;
  transactionHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface v2PoolTransactionType {
  userId: number;
  tokenA: string;
  tokenB: string;
  type: 'add' | 'remove' | 'swap' | 'adjustK' | 'mint' | 'burn';
  tokenASpent: string;
  tokenBSpent: string;
  tokenAReceived: string;
  tokenBReceived: string;
  lpTokensMinted?: string;
  lpTokensBurned?: string;
  date: string; // ISO Date string
}

export interface UpgradeHistoryType {
  oldPackageId: number;
  newPackageId: number;
  upgradeDate: string; // ISO Date string
}

export interface ActiveBonusTransactionType {
  userId: number;
  bonusType: 'sponsor' | 'matching' | 'hierarchy';
  amount: number;
  matchedValue?: number; // Optional as per your model
  date: string; // ISO Date string
  relatedUserId?: number;
  transactionType: 'registration' | 'upgrade';
}

export interface PassiveBonusTransactionType {
  userId: number;
  packageName: string;
  bonusPercentage: number;
  amount: number;
  previousAmount?: number; // Optional as per your model
  date: string; // ISO Date string
  transactionType: 'daily-dividend' | 'registration' | 'upgrade';
  relatedPackageId?: number; // Optional as per your model
}

export interface RegisteredUserTransactionType {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}
