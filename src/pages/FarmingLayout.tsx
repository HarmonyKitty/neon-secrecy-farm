import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const FarmingLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default FarmingLayout;