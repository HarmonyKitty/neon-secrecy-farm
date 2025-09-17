import { useState } from "react";
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmingPool from "./FarmingPool";
import WalletConnect from "./WalletConnect";
import { TrendingUp, Shield, Coins, BarChart3, Users, Lock } from "lucide-react";

const FarmingDashboard = () => {
  const { address, isConnected } = useAccount();

  const pools = [
    { 
      name: "ETH Vault", 
      token: "ETH", 
      confidentialAPY: true, 
      isStaked: true, 
      stakedAmount: "2.5 ETH",
      poolId: 1,
      stakeId: 1
    },
    { 
      name: "USDC Stable", 
      token: "USDC", 
      confidentialAPY: true, 
      isStaked: false,
      poolId: 2,
      stakeId: 0
    },
    { 
      name: "BTC Reserve", 
      token: "WBTC", 
      confidentialAPY: true, 
      isStaked: true, 
      stakedAmount: "0.1 BTC",
      poolId: 3,
      stakeId: 2
    },
    { 
      name: "DeFi Basket", 
      token: "DEFI", 
      confidentialAPY: true, 
      isStaked: false,
      poolId: 4,
      stakeId: 0
    },
  ];

  const stakedPools = pools.filter(pool => pool.isStaked);

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">
            <span className="text-neon">Confidential</span>{" "}
            <span className="text-electric">Yield Farming</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Protect your farming strategies with encrypted positions and private APY discovery
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <WalletConnect />
        </div>

        {isConnected ? (
          <Tabs defaultValue="pools" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pools">Active Pools</TabsTrigger>
              <TabsTrigger value="positions">My Positions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pools.map((pool, index) => (
                  <FarmingPool key={index} {...pool} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="positions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glow-cyan">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Total Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-neon">$12,450</p>
                    <p className="text-sm text-muted-foreground">+5.2% this week</p>
                  </CardContent>
                </Card>
                
                <Card className="glow-green">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-secondary" />
                      Rewards Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-electric">$524</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                
                <Card className="glow-purple">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Privacy Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">98%</p>
                    <p className="text-sm text-muted-foreground">Maximum privacy</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stakedPools.map((pool, index) => (
                  <FarmingPool key={index} {...pool} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glow-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Privacy Analytics
                    </CardTitle>
                    <CardDescription>
                      Your farming strategy protection metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Strategy Encryption</span>
                        <span className="text-neon font-bold flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Front-running Protection</span>
                        <span className="text-electric font-bold">100%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>MEV Protection</span>
                        <span className="text-accent font-bold">Enabled</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Connected Address</span>
                        <span className="text-muted-foreground font-mono text-sm">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glow-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Pool Statistics
                    </CardTitle>
                    <CardDescription>
                      Anonymous pool performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Pools</span>
                        <span className="font-bold">4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Active Positions</span>
                        <span className="font-bold text-green-400">{stakedPools.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average APY</span>
                        <span className="font-bold text-electric">12.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Privacy Level</span>
                        <span className="font-bold text-blue-400">Maximum</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Wallet Required</h3>
            <p className="text-muted-foreground">
              Connect your wallet to access confidential yield farming pools
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FarmingDashboard;