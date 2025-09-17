import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface StakePosition {
  poolId: number;
  stakeId: number;
  amount: string;
  token: string;
  timestamp: number;
  lastHarvestTime: number;
}

interface PoolInfo {
  poolId: number;
  name: string;
  token: string;
  isStaked: boolean;
  stakedAmount?: string;
  stakeId?: number;
}

export const useFarmingState = () => {
  const { address } = useAccount();
  const [stakePositions, setStakePositions] = useState<StakePosition[]>([]);
  const [pools, setPools] = useState<PoolInfo[]>([
    { 
      poolId: 1,
      name: "ETH Vault", 
      token: "ETH", 
      isStaked: true, 
      stakedAmount: "2.5 ETH",
      stakeId: 1
    },
    { 
      poolId: 2,
      name: "USDC Stable", 
      token: "USDC", 
      isStaked: false
    },
    { 
      poolId: 3,
      name: "BTC Reserve", 
      token: "WBTC", 
      isStaked: true, 
      stakedAmount: "0.1 BTC",
      stakeId: 2
    },
    { 
      poolId: 4,
      name: "DeFi Basket", 
      token: "DEFI", 
      isStaked: false
    },
  ]);

  const addStakePosition = useCallback((position: Omit<StakePosition, 'timestamp' | 'lastHarvestTime'>) => {
    const newPosition: StakePosition = {
      ...position,
      timestamp: Date.now(),
      lastHarvestTime: Date.now(),
    };
    
    setStakePositions(prev => [...prev, newPosition]);
    
    // Update pool status
    setPools(prev => prev.map(pool => 
      pool.poolId === position.poolId 
        ? { 
            ...pool, 
            isStaked: true, 
            stakedAmount: position.amount,
            stakeId: position.stakeId
          }
        : pool
    ));
  }, []);

  const updateStakePosition = useCallback((stakeId: number, updates: Partial<StakePosition>) => {
    setStakePositions(prev => prev.map(position => 
      position.stakeId === stakeId 
        ? { ...position, ...updates }
        : position
    ));
  }, []);

  const harvestRewards = useCallback((stakeId: number) => {
    setStakePositions(prev => prev.map(position => 
      position.stakeId === stakeId 
        ? { ...position, lastHarvestTime: Date.now() }
        : position
    ));
  }, []);

  const getStakePosition = useCallback((stakeId: number) => {
    return stakePositions.find(position => position.stakeId === stakeId);
  }, [stakePositions]);

  const getPoolByStakeId = useCallback((stakeId: number) => {
    const position = getStakePosition(stakeId);
    if (!position) return null;
    return pools.find(pool => pool.poolId === position.poolId);
  }, [pools, getStakePosition]);

  const getTotalStakedValue = useCallback(() => {
    return stakePositions.reduce((total, position) => {
      // Mock calculation - in real app would use actual token prices
      const mockPrice = position.token === 'ETH' ? 2000 : 
                       position.token === 'BTC' ? 45000 : 
                       position.token === 'USDC' ? 1 : 100;
      return total + (parseFloat(position.amount) * mockPrice);
    }, 0);
  }, [stakePositions]);

  const getTotalRewards = useCallback(() => {
    // Mock calculation - in real app would calculate actual rewards
    return stakePositions.reduce((total, position) => {
      const daysSinceHarvest = (Date.now() - position.lastHarvestTime) / (1000 * 60 * 60 * 24);
      const dailyRewardRate = 0.001; // 0.1% daily
      const mockPrice = position.token === 'ETH' ? 2000 : 
                       position.token === 'BTC' ? 45000 : 
                       position.token === 'USDC' ? 1 : 100;
      return total + (parseFloat(position.amount) * dailyRewardRate * daysSinceHarvest * mockPrice);
    }, 0);
  }, [stakePositions]);

  const getPrivacyScore = useCallback(() => {
    // Calculate privacy score based on various factors
    const baseScore = 85;
    const stakeBonus = stakePositions.length * 3;
    const timeBonus = Math.min(10, stakePositions.length > 0 ? 10 : 0);
    return Math.min(100, baseScore + stakeBonus + timeBonus);
  }, [stakePositions]);

  return {
    // State
    pools,
    stakePositions,
    address,
    
    // Computed values
    totalStakedValue: getTotalStakedValue(),
    totalRewards: getTotalRewards(),
    privacyScore: getPrivacyScore(),
    
    // Actions
    addStakePosition,
    updateStakePosition,
    harvestRewards,
    getStakePosition,
    getPoolByStakeId,
  };
};
