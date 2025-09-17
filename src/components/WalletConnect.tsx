import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Zap } from "lucide-react";

const WalletConnect = () => {
  return (
    <Card className="float glow-hover border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-neon">Connect Your Wallet</CardTitle>
        <CardDescription>
          Access confidential yield farming with wallet authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Wallet className="h-5 w-5" />
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-2 w-full">
                        <Card className="float glow-cyan">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-primary/20">
                                <Wallet className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Connected</p>
                                <p className="text-xs text-muted-foreground">
                                  {account.displayName}
                                </p>
                              </div>
                              <Zap className="h-4 w-4 text-secondary ml-auto farm-glow" />
                            </div>
                          </CardContent>
                        </Card>
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="w-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-4 py-2 rounded-lg font-medium hover:from-primary/30 hover:to-secondary/30 transition-all duration-200 border border-primary/20"
                        >
                          Account Details
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;