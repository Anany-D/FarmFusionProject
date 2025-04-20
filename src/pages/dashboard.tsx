import WelcomeBanner from "@/components/dashboard/welcome-banner";
import StatsCards from "@/components/dashboard/stats-cards";
import BarterModule from "@/components/dashboard/barter-module";
import MarketplaceModule from "@/components/dashboard/marketplace-module";
import MicrojobModule from "@/components/dashboard/microjob-module";
import DAOGovernance from "@/components/dashboard/dao-governance";
import LiquidityHub from "@/components/dashboard/liquidity-hub";
import EducationModule from "@/components/dashboard/education-module";

export default function Dashboard() {
  return (
    <div>
      <WelcomeBanner />
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarterModule />
        <MarketplaceModule />
      </div>
      <MicrojobModule />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DAOGovernance />
        <EducationModule />
      </div>
      <LiquidityHub />
    </div>
  );
}
