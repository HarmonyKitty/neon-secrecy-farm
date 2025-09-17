import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link, useLocation } from "react-router-dom";
import farmingLogo from "@/assets/farming-logo.png";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={farmingLogo} alt="Neon Secrecy Farm Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">
            <span className="text-neon">Neon</span>
            <span className="text-electric">Secrecy</span>
            <span className="text-neon">Farm</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/farming" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === "/farming" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Farming
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;