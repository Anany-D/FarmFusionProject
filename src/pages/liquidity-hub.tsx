import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, Variants } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { LiquidityPool } from "@shared/schema";
import { RISK_LEVELS } from "@/lib/mock-data";
import PoolVisualization from "@/components/liquidity/pool-visualization";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Filter, 
  TrendingUp, 
  ArrowDownUp,

  PiggyBank,
  CreditCard, 
  Landmark,
  BadgePercent,
  CircleDollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function LiquidityHub() {
  const [risk, setRisk] = useState<string>("any");

  const { data: pools, isLoading } = useQuery<LiquidityPool[]>({
    queryKey: ['/api/liquidity/pools', risk],
    queryFn: async () => {
      // Apply filters if they exist
      let url = '/api/liquidity/pools';
      const params = new URLSearchParams();
      
      if (risk && risk !== "any") {
        params.append('risk', risk);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch liquidity pools');
      }
      return response.json();
    },
  });

  const totalLiquidity = pools?.reduce((sum, pool) => sum + pool.totalLiquidity, 0) || 0;
  const averageAPY = pools?.length 
    ? (pools.reduce((sum, pool) => sum + pool.apy, 0) / pools.length).toFixed(2)
    : "0";
  const totalParticipants = pools?.reduce((sum, pool) => sum + pool.participants, 0) || 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Liquidity Hub</h1>
        <p className="text-muted-foreground">
          Access DeFi-powered financial services for your agricultural business
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Liquidity</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLiquidity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {pools?.length || 0} active pools
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average APY</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAPY}%</div>
            <p className="text-xs text-muted-foreground">
              Current average yield
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Farmers and investors
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <PiggyBank className="h-4 w-4" />
              All Pools
            </TabsTrigger>
            <TabsTrigger value="yield" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Yield Farming
            </TabsTrigger>
            <TabsTrigger value="lending" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Lending
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Risk Level:</span>
            </div>
            
            <Select value={risk} onValueChange={setRisk}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="any">Any</SelectItem>
                  {RISK_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <button 
              className="text-sm text-primary font-medium"
              onClick={() => setRisk("any")}
            >
              <ArrowDownUp className="h-4 w-4 inline mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-6 m-0">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : pools && pools.length > 0 ? (
            <motion.div 
              className="space-y-6"
              initial="initial"
              animate="animate"
              variants={staggerContainer.variants as Variants}
            >
              {pools.map((pool) => (
                <motion.div key={pool.id} variants={staggerItem}>
                  <PoolVisualization pool={pool} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No liquidity pools found</h3>
              <p className="mt-2 text-muted-foreground">
                There are no liquidity pools matching your current filters
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="yield" className="m-0">
          {/* This would contain yield-specific pools in a real app */}
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Yield Farming Pools</h3>
            <p className="mt-2 text-muted-foreground">
              Coming soon! Yield farming pools will be available in the next update.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="lending" className="m-0">
          {/* This would contain lending-specific pools in a real app */}
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Lending Pools</h3>
            <p className="mt-2 text-muted-foreground">
              Coming soon! Lending pools will be available in the next update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
