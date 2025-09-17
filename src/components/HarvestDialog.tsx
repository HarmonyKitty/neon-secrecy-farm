import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNeonSecrecyFarm } from "@/hooks/useContract";
import { formatEther } from "viem";
import { Coins, Shield, Zap, AlertCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";

interface HarvestDialogProps {
  poolName: string;
  token: string;
  poolId: number;
  stakeId: number;
  onSuccess?: () => void;
}

const HarvestDialog = ({ poolName, token, poolId, stakeId, onSuccess }: HarvestDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [error, setError] = useState<string | null>(null);
  const [estimatedRewards, setEstimatedRewards] = useState("0.0");
  const [lastHarvestTime, setLastHarvestTime] = useState<Date | null>(null);
  
  const { 
    claimRewards, 
    isPending, 
    isConfirming, 
    isConfirmed,
    error: contractError 
  } = useNeonSecrecyFarm();

  // Simulate calculating estimated rewards
  useEffect(() => {
    if (isOpen) {
      // In a real implementation, this would query the contract for actual rewards
      const mockRewards = (Math.random() * 0.5 + 0.1).toFixed(4);
      setEstimatedRewards(mockRewards);
      
      // Mock last harvest time (7 days ago)
      const mockLastHarvest = new Date();
      mockLastHarvest.setDate(mockLastHarvest.getDate() - 7);
      setLastHarvestTime(mockLastHarvest);
    }
  }, [isOpen]);

  const handleHarvest = async () => {
    setStep('processing');
    setError(null);
    
    try {
      // Simulate FHE reward calculation
      const rewardAmount = "0x" + "0".repeat(64); // Placeholder for encrypted reward amount
      const inputProof = "0x" + "0".repeat(64); // Placeholder for FHE proof
      
      await claimRewards(
        BigInt(stakeId),
        rewardAmount as `0x${string}`,
        inputProof as `0x${string}`
      );
      
      if (isConfirmed) {
        setStep('success');
        setTimeout(() => {
          setIsOpen(false);
          setStep('confirm');
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      console.error('Harvesting failed:', err);
      setError(err instanceof Error ? err.message : 'Harvesting failed');
      setStep('error');
    }
  };

  const resetDialog = () => {
    setStep('confirm');
    setError(null);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Harvest Rewards</h3>
              <p className="text-muted-foreground text-sm">
                Claim your accumulated rewards from {poolName}
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available Rewards</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-500">
                        {estimatedRewards} {token}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ${(parseFloat(estimatedRewards) * 2000).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool</span>
                    <span className="font-medium">{poolName}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Harvest</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lastHarvestTime ? formatTimeAgo(lastHarvestTime) : 'Never'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Privacy</span>
                    <span className="font-medium text-blue-500 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      FHE Encrypted
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Rewards are automatically calculated</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Amount remains private during claim</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Zap className="h-4 w-4" />
                    <span>No additional staking required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleHarvest}
                className="flex-1"
                disabled={parseFloat(estimatedRewards) <= 0}
              >
                Harvest Rewards
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Harvest</h3>
              <p className="text-muted-foreground text-sm">
                {isPending ? 'Waiting for confirmation...' : 'Confirming on blockchain...'}
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Decrypting reward amount with FHE</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-blue-500" />
                    <span>Validating reward calculation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Transferring rewards to wallet</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-500">Harvest Successful!</h3>
              <p className="text-muted-foreground text-sm">
                {estimatedRewards} {token} has been added to your wallet
              </p>
            </div>
            
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Coins className="h-4 w-4" />
                    <span>Rewards transferred to wallet</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Transaction remains private</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Continue earning rewards</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-500">Harvest Failed</h3>
              <p className="text-muted-foreground text-sm">
                {error || contractError?.message || 'Something went wrong'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={resetDialog}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1"
          disabled={isPending || isConfirming}
        >
          Harvest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Harvest Rewards</DialogTitle>
          <DialogDescription>
            Claim your accumulated rewards from {poolName}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default HarvestDialog;
