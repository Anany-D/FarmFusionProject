import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Repeat, 
  Briefcase, 
  Vote, 
  GraduationCap, 
  X,
  UserCircle,
  Wallet,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  // List of navigation items
  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
    { href: "/barter", label: "Barter System", icon: Repeat },
    { href: "/microjobs", label: "Microjobs", icon: Briefcase },
    { href: "/governance", label: "DAO Governance", icon: Vote },
    { href: "/education", label: "Web3 Education", icon: GraduationCap },
    { href: "/liquidity", label: "Liquidity Hub", icon: Landmark },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ];

  const handleNavigation = (href: string) => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 md:hidden bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="fixed right-0 top-0 h-full w-[280px] bg-white dark:bg-gray-800 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-heading font-bold text-lg">AgroChain</span>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <button 
                className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md text-white bg-primary hover:bg-primary-dark"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a 
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 text-base",
                          location === item.href 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        )}
                        onClick={() => handleNavigation(item.href)}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                &copy; 2023 AgroChain Network
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
