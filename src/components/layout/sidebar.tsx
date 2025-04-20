import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Repeat, 
  Briefcase, 
  Vote, 
  GraduationCap, 
  Wallet, 
  HelpCircle, 
  Settings,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/lib/web3-context";
import WalletConnect from "@/components/web3/wallet-connect";

export default function Sidebar() {
  const [location] = useLocation();
  const { account, connectWallet, isConnecting } = useWeb3();

  // List of navigation items
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
    { href: "/barter", label: "Barter System", icon: Repeat },
    { href: "/microjobs", label: "Microjobs", icon: Briefcase },
    { href: "/governance", label: "DAO Governance", icon: Vote },
    { href: "/education", label: "Web3 Education", icon: GraduationCap },
    { href: "/liquidity-hub", label: "Liquidity Hub", icon: Landmark },
  ];

  return (
    <aside className="hidden md:block bg-white dark:bg-gray-800 w-64 border-r shrink-0">
      <div className="h-full flex flex-col py-6">
        <div className="px-4 mb-6">
          <WalletConnect />
        </div>

        <div className="space-y-1 px-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer",
                  location === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="border-t py-4 px-2">
          <div className="space-y-1">
            <Link href="/help">
              <span className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </span>
            </Link>
            <Link href="/settings">
              <span className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
