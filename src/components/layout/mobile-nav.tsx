import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, 
  X, 
  Home, 
  ShoppingCart, 
  Repeat, 
  VoteIcon, 
  Briefcase, 
  PiggyBank, 
  GraduationCap,
  PanelRightOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { title: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
  { title: "Marketplace", path: "/marketplace", icon: <ShoppingCart className="h-5 w-5" /> },
  { title: "Barter", path: "/barter", icon: <Repeat className="h-5 w-5" /> },
  { title: "Governance", path: "/governance", icon: <VoteIcon className="h-5 w-5" /> },
  { title: "Microjobs", path: "/microjobs", icon: <Briefcase className="h-5 w-5" /> },
  { title: "Liquidity Hub", path: "/liquidity-hub", icon: <PiggyBank className="h-5 w-5" /> },
  { title: "Education", path: "/education", icon: <GraduationCap className="h-5 w-5" /> },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuVariants = {
    closed: { 
      opacity: 0, 
      x: "100%",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      {/* Header for mobile */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <PanelRightOpen className="h-6 w-6" />
          <h1 className="text-xl font-bold">AgroConnect</h1>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleMenu}
          className="text-primary-foreground"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom nav for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-10">
        <nav className="flex justify-around">
          {MENU_ITEMS.slice(0, 5).map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex flex-col items-center py-2 px-1 text-xs",
                location === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}>
                {item.icon}
                <span className="mt-1">{item.title}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={closeMenu}
          >
            <motion.div 
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-3/4 bg-background border-l p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.role || 'User'}</p>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={closeMenu}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="space-y-2">
                {MENU_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.path}
                    variants={menuItemVariants}
                    onClick={closeMenu}
                  >
                    <Link href={item.path}>
                      <a className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md",
                        location === item.path 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-muted"
                      )}>
                        {item.icon}
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
