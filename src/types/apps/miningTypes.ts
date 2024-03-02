// src/types/apps/miningTypes.ts

export interface MiningStats {
  userId: number;
  username: string;
  level: number;
  hourlyMiningRate: number;
  totalAmountMined: number;
  isMining: boolean;
}

export interface MiningTransaction {
  id: string;
  userId: string;
  amount: number;
  date: string; // Consider using Date type if you're manipulating dates
  status: 'pending' | 'completed' | 'failed';
  // Add other relevant fields here
}

export interface MiningTransactionsState {
  data: MiningTransaction[];
}


export interface MiningStatsProps {
  stats: MiningStats;
}
