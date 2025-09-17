import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import farmBackground from "@/assets/neon-farm-bg.jpg";

const HeroSection = () => {
  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${farmBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80" />
      
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-bold">
          <span className="text-neon">Farm Yields</span>{" "}
          <span className="text-electric">Privately</span>
          <br />
          <span className="text-foreground">Harvest</span>{" "}
          <span className="text-neon">Publicly</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Revolutionary DeFi yield farming where your staking positions and APY choices 
          remain encrypted until harvest, preventing copycat strategies.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cosmic" size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/farming">
              <Shield className="h-5 w-5" />
              Start Private Farming
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <Zap className="h-5 w-5" />
            Learn How It Works
          </Button>
        </div>
        
        <div className="flex justify-center items-center gap-8 pt-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-neon">256-bit</p>
            <p className="text-sm text-muted-foreground">Encryption</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-electric">Zero</p>
            <p className="text-sm text-muted-foreground">Front-running</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">Private</p>
            <p className="text-sm text-muted-foreground">Strategies</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-primary" />
      </div>
    </section>
  );
};

export default HeroSection;