// src/types/apps/miningTypes.ts

export interface MiningStats {
  userId: number;
  username: string;
  level: number;
  hourlyMiningCount: number;
  totalMined: number;
  totalClaimedRewards: number;
  lastMiningTime: string;
  penaltyApplied: boolean;
  dateRecorded: string;
}

export interface MiningTransaction {
  id: number;
  userId: number;
  username: string;
  amount: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface MiningTransactionsState {
  data: MiningTransaction[];
}


export interface MiningStatsProps {
  stats: MiningStats;
}
