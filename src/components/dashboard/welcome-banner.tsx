import { Button } from "@/components/ui/button";
import { Sparkles, Leaf, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 md:p-8 text-white">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-3">Welcome to AgroChain</h1>
            <p className="text-lg opacity-90 mb-6">
              A Web3 platform connecting farmers, industries and government bodies
              through blockchain technology and DeFi-powered features.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-3">
              <Button 
                className="bg-white text-primary hover:bg-accent hover:text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explore Marketplace</span>
              </Button>
              <Button 
                variant="outline"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Leaf className="h-4 w-4" />
                <span>Learn About Web3</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
            <motion.div 
              className="w-48 h-48 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Decorative elements */}
              <motion.div 
                className="absolute w-20 h-20 bg-white rounded-lg shadow-lg opacity-80 left-0 top-0"
                initial={{ rotate: 0, x: -20, y: -20 }}
                animate={{ rotate: 12, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              />
              <motion.div 
                className="absolute w-20 h-20 bg-accent rounded-lg shadow-lg opacity-80 right-0 top-5"
                initial={{ rotate: 0, x: 20, y: -20 }}
                animate={{ rotate: -6, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              />
              <motion.div 
                className="absolute w-20 h-20 bg-secondary rounded-lg shadow-lg opacity-80 bottom-0 left-4"
                initial={{ rotate: 0, x: -20, y: 20 }}
                animate={{ rotate: 45, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
              <motion.div 
                className="absolute w-24 h-24 rounded-full bg-primary-light shadow-lg opacity-70 bottom-4 right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
