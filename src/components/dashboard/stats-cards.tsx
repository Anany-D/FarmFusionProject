import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, BarChart, Activity } from "lucide-react";
import { motion } from "framer-motion";
import StatisticCard from "@/components/ui/statistic-card";

export default function StatsCards() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.section 
      className="mb-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item}>
          <StatisticCard
            title="Total Users"
            value="3,427"
            trend="+12%"
            trendDirection="up"
            description="Across all user types"
            icon={<Users className="h-5 w-5 text-accent" />}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatisticCard
            title="Marketplace Volume"
            value="$547,893"
            trend="+8.2%"
            trendDirection="up"
            description="Over last 30 days"
            icon={<TrendingUp className="h-5 w-5 text-accent" />}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatisticCard
            title="Active Proposals"
            value="23"
            trend="+5"
            trendDirection="up"
            description="In DAO governance"
            icon={<BarChart className="h-5 w-5 text-accent" />}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatisticCard
            title="Liquidity Pool"
            value="$1.2M"
            trend="+3.7%"
            trendDirection="up"
            description="Total locked value"
            icon={<Activity className="h-5 w-5 text-accent" />}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
