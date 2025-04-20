import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Landmark, TrendingUp, ArrowRight, Info, PlusCircle, MinusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function LiquidityHub() {
  // Sample data for the liquidity pool
  const liquidityData = [
    { name: 'Agri-Token', value: 650000 },
    { name: 'Stablecoin', value: 550000 }
  ];

  const COLORS = ['#2E7D32', '#795548'];

  // Sample yield data
  const yieldFarms = [
    { 
      id: 1,
      name: "Seed Financing Pool", 
      apy: 12.5, 
      tvl: "$320,450",
      yourLiquidity: "$5,000",
      rewards: "$625" 
    },
    { 
      id: 2,
      name: "Equipment Loan Pool", 
      apy: 8.2, 
      tvl: "$450,780",
      yourLiquidity: "$0",
      rewards: "$0" 
    },
    { 
      id: 3,
      name: "Harvest Futures Pool", 
      apy: 15.1, 
      tvl: "$275,300",
      yourLiquidity: "$3,500",
      rewards: "$528" 
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Liquidity Hub
            </CardTitle>
            <CardDescription>
              Provide liquidity to agricultural financing pools and earn yield
            </CardDescription>
          </div>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            Connect Wallet
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1">
              <div className="bg-gray-50 rounded-lg p-5 h-full">
                <h3 className="font-medium text-lg mb-4">Total Liquidity</h3>
                <div className="flex items-center justify-center h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={liquidityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {liquidityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Value']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <div className="text-2xl font-bold">$1,200,000</div>
                  <div className="text-sm text-gray-500">Total Value Locked</div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="bg-gray-50 rounded-lg p-5 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Your Statistics</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Connected</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-md border">
                    <div className="text-sm text-gray-500 mb-1">Your Total Liquidity</div>
                    <div className="text-2xl font-bold">$8,500</div>
                    <div className="flex items-center text-green-600 text-sm mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5% past month
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border">
                    <div className="text-sm text-gray-500 mb-1">Accumulated Yield</div>
                    <div className="text-2xl font-bold">$1,153</div>
                    <div className="text-sm text-gray-500 mt-1">Since joining</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border">
                    <div className="text-sm text-gray-500 mb-1">Active Pools</div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-gray-500 mt-1">Out of 3 available</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Available Actions</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button className="bg-primary text-white hover:bg-primary-dark">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Liquidity
                  </Button>
                  <Button variant="outline">
                    <MinusCircle className="h-4 w-4 mr-2" /> Remove Liquidity
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="font-medium text-lg mb-4">Available Yield Farms</h3>
          <div className="space-y-4">
            {yieldFarms.map((farm) => (
              <motion.div 
                key={farm.id} 
                className="border rounded-lg p-4"
                whileHover={{ y: -3, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <h3 className="font-medium text-lg mb-2 md:mb-0">{farm.name}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 self-start md:self-auto">
                    {farm.apy}% APY
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Total Value Locked</div>
                    <div className="font-medium">{farm.tvl}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Your Liquidity</div>
                    <div className="font-medium">{farm.yourLiquidity}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Your Rewards</div>
                    <div className="font-medium">{farm.rewards}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary text-white hover:bg-primary-dark">
                    Stake
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              Learn More About DeFi on AgroChain
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
