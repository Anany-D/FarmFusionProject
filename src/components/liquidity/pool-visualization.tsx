import { useState } from "react";
import { motion } from "framer-motion";
import { LiquidityPool } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  PiggyBank, 
  ArrowRightLeft, 
  AlertTriangle, 
  Shield, 
  BarChart3 
} from "lucide-react";

interface PoolVisualizationProps {
  pool: LiquidityPool;
}

export default function PoolVisualization({ pool }: PoolVisualizationProps) {
  const [expanded, setExpanded] = useState(false);

  // Function to determine risk color
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate capacity utilization (randomly for visualization)
  const capacityUsed = Math.min(100, Math.floor(Math.random() * 30) + 65); // 65-95%

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ translateY: -5 }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{pool.asset}</Badge>
                <Badge className={getRiskColor(pool.risk)}>{pool.risk} risk</Badge>
                <Badge variant="default">
                  {pool.poolType}
                </Badge>
              </div>
              <h3 className="text-lg font-medium">{pool.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{pool.description}</p>
            </div>
            <div className="flex items-center bg-primary/10 rounded-full px-3 py-1.5 text-primary font-semibold">
              <TrendingUp className="h-4 w-4 mr-1.5" />
              {pool.apy}% APY
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Liquidity</div>
              <div className="text-lg font-semibold">${pool.totalLiquidity.toLocaleString()}</div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Participants</div>
              <div className="text-lg font-semibold flex items-center">
                <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
                {pool.participants}
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg md:col-span-1 col-span-2">
              <div className="text-sm text-muted-foreground">Capacity Used</div>
              <div className="mt-1.5">
                <Progress value={capacityUsed} className="h-2" />
                <div className="flex justify-between text-xs mt-1">
                  <span>{capacityUsed}%</span>
                  <span>{capacityUsed >= 95 ? 'Full' : 'Available'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium flex items-center gap-1.5 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Risk Assessment
                  </h4>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                      pool.risk === 'high' ? 'text-red-500' :
                      pool.risk === 'medium' ? 'text-amber-500' : 'text-green-500'
                    }`} />
                    <p className="text-sm text-muted-foreground">
                      {pool.risk === 'high' 
                        ? 'High potential returns but significant volatility and risk of loss. For experienced investors only.'
                        : pool.risk === 'medium'
                        ? 'Moderate volatility with balanced risk and reward. Suitable for most investors.'
                        : 'Lower returns but more stable and secure. Recommended for conservative investors.'}
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium flex items-center gap-1.5 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Past 30 days</span>
                      <span className={pool.apy > 5 ? 'text-green-600' : 'text-red-600'}>
                        {pool.apy > 5 ? '+' : ''}{(pool.apy - 1).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Past 90 days</span>
                      <span className="text-green-600">+{(pool.apy * 0.9).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Since inception</span>
                      <span className="text-green-600">+{(pool.apy * 1.2).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-wrap justify-between items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show Less' : 'Show More'}
            </Button>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <ArrowRightLeft className="h-4 w-4" />
                Swap
              </Button>
              <Button size="sm" className="gap-1">
                <PiggyBank className="h-4 w-4" />
                Provide Liquidity
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
