import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repeat, ArrowRightLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function BarterModule() {
  // Sample data for demonstration
  const barterItems = [
    {
      id: 1,
      userOffering: "John Farmer",
      offerItem: "Organic Tomato Seeds",
      offerQuantity: "5 kg",
      requestItem: "Irrigation Pipes",
      requestQuantity: "200 meters",
      status: "pending"
    },
    {
      id: 2,
      userOffering: "AgriTech Industries",
      offerItem: "Tractor Rental",
      offerQuantity: "3 days",
      requestItem: "Fresh Produce",
      requestQuantity: "500 kg",
      status: "accepted"
    },
    {
      id: 3,
      userOffering: "Farm Cooperative",
      offerItem: "Labor (5 workers)",
      offerQuantity: "2 days",
      requestItem: "Wheat Seeds",
      requestQuantity: "100 kg",
      status: "pending"
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <Repeat className="h-5 w-5 text-primary" />
              Barter System
            </CardTitle>
            <CardDescription>
              Exchange seeds, tools, and labor directly with other farmers and businesses
            </CardDescription>
          </div>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4 mr-2" />
            New Offer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {barterItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border ${
                  item.status === "accepted" ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                  <span className="font-medium text-gray-800">{item.userOffering}</span>
                  <Badge variant={item.status === "accepted" ? "success" : "secondary"}>
                    {item.status === "accepted" ? "Accepted" : "Pending"}
                  </Badge>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 space-y-1">
                    <div className="text-sm text-gray-500">Offering:</div>
                    <div className="font-medium">{item.offerItem}</div>
                    <div className="text-sm">{item.offerQuantity}</div>
                  </div>
                  
                  <div className="hidden md:block">
                    <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="text-sm text-gray-500">Requesting:</div>
                    <div className="font-medium">{item.requestItem}</div>
                    <div className="text-sm">{item.requestQuantity}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    {item.status === "pending" && (
                      <Button variant="default" size="sm">Accept</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              View All Barter Offers
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
