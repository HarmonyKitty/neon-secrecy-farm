import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Lock, Eye, EyeOff, Shield, Zap } from "lucide-react";
import { useState } from "react";
import StakeDialog from "./StakeDialog";
import HarvestDialog from "./HarvestDialog";

interface FarmingPoolProps {
  name: string;
  token: string;
  confidentialAPY: boolean;
  isStaked: boolean;
  stakedAmount?: string;
  poolId?: number;
  stakeId?: number;
}

const FarmingPool = ({ 
  name, 
  token, 
  confidentialAPY, 
  isStaked, 
  stakedAmount, 
  poolId = 0,
  stakeId = 0 
}: FarmingPoolProps) => {
  const [showAPY, setShowAPY] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getStatusIcon = () => {
    if (isStaked) {
      return <Coins className="h-5 w-5 text-green-500" />;
    }
    return <TrendingUp className="h-5 w-5 text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (isStaked) {
      return (
        <Badge variant="default" className="glow-green bg-green-500/20 text-green-400 border-green-500/30">
          <Shield className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="glow-blue bg-blue-500/20 text-blue-400 border-blue-500/30">
        <Zap className="h-3 w-3 mr-1" />
        Available
      </Badge>
    );
  };

  return (
    <Card className="float glow-hover border-primary/10 hover:border-primary/20 transition-all duration-300">
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
          <div className="flex flex-col gap-2">
            <Badge variant="secondary" className="glow-green">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
            {getStatusBadge()}
          </div>
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
                  <button
                    onClick={() => setShowAPY(true)}
                    className="p-1 h-6 w-6 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-electric">12.5%</p>
                  {confidentialAPY && (
                    <button
                      onClick={() => setShowAPY(false)}
                      className="p-1 h-6 w-6 rounded hover:bg-muted/50 transition-colors"
                    >
                      <EyeOff className="h-3 w-3" />
                    </button>
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
        
        {/* Pool Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Total Staked</p>
            <p className="text-sm font-medium">•••• {token}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Participants</p>
            <p className="text-sm font-medium">••••</p>
          </div>
        </div>
        
        {/* Privacy Features */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <Shield className="h-4 w-4 text-blue-500" />
          <div className="flex-1">
            <p className="text-xs font-medium text-blue-400">FHE Protected</p>
            <p className="text-xs text-muted-foreground">Amounts encrypted on-chain</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <StakeDialog
            poolName={name}
            token={token}
            poolId={poolId}
            isStaked={isStaked}
            onSuccess={handleSuccess}
          />
          {isStaked && (
            <HarvestDialog
              poolName={name}
              token={token}
              poolId={poolId}
              stakeId={stakeId}
              onSuccess={handleSuccess}
            />
          )}
        </div>
        
        {/* Additional Info for Staked Pools */}
        {isStaked && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Estimated Rewards</span>
              <span className="text-green-400 font-medium">+0.024 {token}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
              <span>Next Harvest</span>
              <span>Available now</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarmingPool;