import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNeonSecrecyFarm } from "@/hooks/useContract";
import { parseEther, formatEther } from "viem";
import { Coins, Shield, Zap, AlertCircle, CheckCircle } from "lucide-react";

interface StakeDialogProps {
  poolName: string;
  token: string;
  poolId: number;
  isStaked: boolean;
  onSuccess?: () => void;
}

const StakeDialog = ({ poolName, token, poolId, isStaked, onSuccess }: StakeDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm' | 'processing' | 'success' | 'error'>('input');
  const [error, setError] = useState<string | null>(null);
  
  const { 
    stakeTokens, 
    isPending, 
    isConfirming, 
    isConfirmed,
    error: contractError 
  } = useNeonSecrecyFarm();

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
    setError(null);
  };

  const validateAmount = (): boolean => {
    if (!amount || amount === "0" || amount === "0.") {
      setError("Please enter a valid amount");
      return false;
    }
    
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }
    
    if (numAmount < 0.001) {
      setError("Minimum stake amount is 0.001");
      return false;
    }
    
    return true;
  };

  const handleStake = async () => {
    if (!validateAmount()) return;
    
    setStep('confirm');
  };

  const handleConfirmStake = async () => {
    setStep('processing');
    setError(null);
    
    try {
      const stakeAmount = parseEther(amount);
      
      // Simulate FHE encryption process
      const encryptedAmount = "0x" + "0".repeat(64); // Placeholder for encrypted amount
      const inputProof = "0x" + "0".repeat(64); // Placeholder for FHE proof
      
      await stakeTokens(
        BigInt(poolId),
        stakeAmount,
        encryptedAmount as `0x${string}`,
        inputProof as `0x${string}`
      );
      
      if (isConfirmed) {
        setStep('success');
        setTimeout(() => {
          setIsOpen(false);
          setStep('input');
          setAmount("");
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      console.error('Staking failed:', err);
      setError(err instanceof Error ? err.message : 'Staking failed');
      setStep('error');
    }
  };

  const resetDialog = () => {
    setStep('input');
    setAmount("");
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'input':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount to {isStaked ? 'Add' : 'Stake'}
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Badge variant="secondary" className="text-xs">
                      {token}
                    </Badge>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                  </p>
                )}
              </div>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pool</span>
                      <span className="font-medium">{poolName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Token</span>
                      <span className="font-medium">{token}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">APY</span>
                      <span className="font-medium text-green-500">12.5%</span>
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
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStake}
                className="flex-1"
                disabled={!amount || !!error}
              >
                {isStaked ? 'Add More' : 'Stake'}
              </Button>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Confirm {isStaked ? 'Additional' : ''} Stake</h3>
              <p className="text-muted-foreground text-sm">
                You are about to {isStaked ? 'add' : 'stake'} {amount} {token} to {poolName}
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">{amount} {token}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pool</span>
                    <span className="font-medium">{poolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Privacy Level</span>
                    <span className="font-medium text-green-500">Maximum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fee</span>
                    <span className="font-medium">~$2.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('input')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmStake}
                className="flex-1"
              >
                Confirm & Stake
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Transaction</h3>
              <p className="text-muted-foreground text-sm">
                {isPending ? 'Waiting for confirmation...' : 'Confirming on blockchain...'}
              </p>
            </div>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Encrypting stake amount with FHE</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-blue-500" />
                    <span>Submitting to smart contract</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Waiting for confirmation</span>
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
              <h3 className="text-lg font-semibold mb-2 text-green-500">Stake Successful!</h3>
              <p className="text-muted-foreground text-sm">
                Your {amount} {token} has been successfully staked in {poolName}
              </p>
            </div>
            
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Amount encrypted with FHE</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Coins className="h-4 w-4" />
                    <span>Position added to pool</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Zap className="h-4 w-4" />
                    <span>Rewards accumulating</span>
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
              <h3 className="text-lg font-semibold mb-2 text-red-500">Transaction Failed</h3>
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
          variant="cyber" 
          className="flex-1"
          disabled={isPending || isConfirming}
        >
          {isStaked ? "Add More" : "Stake"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isStaked ? 'Add More to Pool' : 'Stake in Pool'}
          </DialogTitle>
          <DialogDescription>
            {isStaked 
              ? 'Add more tokens to your existing position' 
              : 'Stake tokens to start earning rewards'
            }
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default StakeDialog;
