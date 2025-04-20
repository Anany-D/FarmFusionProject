import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Marketplace from "@/pages/marketplace";
import Barter from "@/pages/barter";
import Microjobs from "@/pages/microjobs";
import Governance from "@/pages/governance";
import Education from "@/pages/education";
import Profile from "@/pages/profile";
import LiquidityHub from "@/pages/liquidity-hub";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { useState } from "react";
import MobileMenu from "@/components/layout/mobile-menu";
import { Web3Provider } from "./lib/web3-context";
import { UserProvider } from "./lib/user-context"; // Added import


function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/barter" component={Barter} />
      <Route path="/microjobs" component={Microjobs} />
      <Route path="/governance" component={Governance} />
      <Route path="/education" component={Education} />
      <Route path="/liquidity-hub" component={LiquidityHub} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider> {/* Added UserProvider */}
      <Web3Provider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar onMenuToggle={toggleMobileMenu} />

            <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

            <div className="flex flex-grow">
              {/* Only show sidebar on main pages, not on 404 */}
              {location !== "/not-found" && <Sidebar />}

              <main className="flex-1 flex flex-col">
                <div className="container mx-auto px-4 py-6 flex-grow">
                  <Router />
                </div>
                <Footer />
              </main>
            </div>

            <Toaster />
          </div>
        </TooltipProvider>
      </Web3Provider>
      </UserProvider> {/* Closed UserProvider */}
    </QueryClientProvider>
  );
}

export default App;