import { ReactNode } from "react";
import { motion } from "framer-motion";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";

const pageVariants = {
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative bg-background">
      <Sidebar />
      <MobileNav />
      
      <motion.main 
        className="md:pl-64 pt-14 md:pt-0 pb-16 md:pb-0 min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
