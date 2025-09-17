import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sprout, Lock, Eye, EyeOff, Coins, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNeonSecrecyFarm } from "@/hooks/useContract";
import { parseEther } from "viem";

interface FarmingPoolProps {
  name: string;
  token: string;
  confidentialAPY: boolean;
  isStaked: boolean;
  stakedAmount?: string;
  poolId?: number;
}

const FarmingPool = ({ name, token, confidentialAPY, isStaked, stakedAmount, poolId = 0 }: FarmingPoolProps) => {
  const [showAPY, setShowAPY] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  
  const { 
    stakeTokens, 
    claimRewards, 
    isPending, 
    isConfirming, 
    isConfirmed,
    error 
  } = useNeonSecrecyFarm();

  const handleStake = async () => {
    if (!poolId) return;
    
    setIsStaking(true);
    try {
      // Example stake amount (1 ETH)
      const stakeAmount = parseEther("1.0");
      
      // In a real implementation, you would:
      // 1. Encrypt the amount using FHE
      // 2. Generate proof for the encrypted amount
      // 3. Call the contract with encrypted data
      
      // For demo purposes, we'll use placeholder values
      const encryptedAmount = "0x" + "0".repeat(64); // Placeholder encrypted amount
      const inputProof = "0x" + "0".repeat(64); // Placeholder proof
      
      await stakeTokens(
        BigInt(poolId),
        stakeAmount,
        encryptedAmount as `0x${string}`,
        inputProof as `0x${string}`
      );
    } catch (err) {
      console.error('Staking failed:', err);
    } finally {
      setIsStaking(false);
    }
  };

  const handleHarvest = async () => {
    if (!poolId) return;
    
    setIsHarvesting(true);
    try {
      // In a real implementation, you would:
      // 1. Calculate encrypted reward amount
      // 2. Generate proof for the reward
      // 3. Call the contract to claim rewards
      
      // For demo purposes, we'll use placeholder values
      const rewardAmount = "0x" + "0".repeat(64); // Placeholder encrypted reward
      const inputProof = "0x" + "0".repeat(64); // Placeholder proof
      
      await claimRewards(
        BigInt(0), // Stake ID - would be tracked in real implementation
        rewardAmount as `0x${string}`,
        inputProof as `0x${string}`
      );
    } catch (err) {
      console.error('Harvesting failed:', err);
    } finally {
      setIsHarvesting(false);
    }
  };

  const getStatusIcon = () => {
    if (isStaked) {
      return <Coins className="h-5 w-5 text-green-500" />;
    }
    return <TrendingUp className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Card className="float glow-hover border-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-secondary/20">
              {getStatusIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{token} Pool</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="glow-green">
            <Lock className="h-3 w-3 mr-1" />
            Private
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">APY</p>
            <div className="flex items-center gap-2">
              {confidentialAPY && !showAPY ? (
                <>
                  <p className="text-lg font-bold text-neon">••••%</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAPY(true)}
                    className="p-1 h-6 w-6"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-electric">12.5%</p>
                  {confidentialAPY && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAPY(false)}
                      className="p-1 h-6 w-6"
                    >
                      <EyeOff className="h-3 w-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Position</p>
            <p className="text-lg font-bold">
              {isStaked ? stakedAmount : "Not Staked"}
            </p>
          </div>
        </div>
        
        {/* Transaction Status */}
        {(isPending || isConfirming) && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              {isPending ? "Transaction pending..." : "Confirming transaction..."}
            </p>
          </div>
        )}
        
        {isConfirmed && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-400">Transaction confirmed!</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">Transaction failed: {error.message}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="cyber" 
            className="flex-1"
            onClick={handleStake}
            disabled={isPending || isConfirming || isStaking}
          >
            {isStaking ? "Staking..." : (isStaked ? "Add More" : "Stake")}
          </Button>
          {isStaked && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleHarvest}
              disabled={isPending || isConfirming || isHarvesting}
            >
              {isHarvesting ? "Harvesting..." : "Harvest"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmingPool;