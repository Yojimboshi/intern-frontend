// src\types\apps\v2PoolsTypes.ts

export interface PoolDetails {
  id: number;
  tokenA: string;
  tokenB: string;
  tokenAReserve: number;
  tokenBReserve: number;
  totalLPTokenSupply: number;
}

export interface PoolsState {
  data: PoolDetails[];
}
