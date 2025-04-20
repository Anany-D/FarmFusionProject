import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, PiggyBank, Landmark, TrendingUp } from "lucide-react";
import { LiquidityPool } from "@shared/schema";

export default function LiquidityPreview() {
  const { data: pools, isLoading } = useQuery<LiquidityPool[]>({
    queryKey: ['/api/liquidity-pools'],
    queryFn: async () => {
      const response = await fetch('/api/liquidity-pools?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch liquidity pools');
      }
      return response.json();
    }
  });

  const getPoolColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div {...fadeInUp} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Liquidity Opportunities</h2>
        <Link href="/liquidity-hub">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          {...staggerContainer}
        >
          {pools?.map((pool) => (
            <motion.div key={pool.id} variants={staggerItem}>
              <Link href={`/liquidity-hub/${pool.id}`}>
                <DataCard
                  title={pool.name}
                  icon={<PiggyBank className="h-4 w-4" />}
                  footer={<div className="flex justify-between w-full">
                    <span>{pool.participants} participants</span>
                    <span className="font-medium text-primary">{pool.assetPair}</span>
                  </div>}
                  onClick={() => {}}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className={getPoolColor(pool.risk)}>{pool.risk} risk</Badge>
                        <Badge variant="outline">{pool.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <TrendingUp className="h-4 w-4" />
                        {pool.apy}% APY
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pool.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <Landmark className="h-4 w-4 text-primary" />
                      <span className="font-medium">Total liquidity:</span>
                      <span className="text-muted-foreground">${pool.totalLiquidity.toLocaleString()}</span>
                    </div>
                  </div>
                </DataCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
