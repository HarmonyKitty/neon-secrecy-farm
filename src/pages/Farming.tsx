import FarmingDashboard from "@/components/FarmingDashboard";
import Navbar from "@/components/Navbar";

const Farming = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <FarmingDashboard />
      </main>
    </div>
  );
};

export default Farming;