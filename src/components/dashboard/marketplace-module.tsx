import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function MarketplaceModule() {
  // Sample data for demonstration
  const marketplaceItems = {
    seeds: [
      {
        id: 1,
        title: "Organic Tomato Seeds",
        price: 25.99,
        unit: "kg",
        quantity: 50,
        seller: "John Farmer",
        location: "Rural County, Midwest",
        image: "https://images.unsplash.com/photo-1589923188900-85dae523342b"
      },
      {
        id: 2,
        title: "Heirloom Corn Seeds",
        price: 18.50,
        unit: "kg",
        quantity: 30,
        seller: "Organic Farms Co-op",
        location: "Green Valley, West",
        image: "https://images.unsplash.com/photo-1589923188900-85dae523342b"
      }
    ],
    tools: [
      {
        id: 3,
        title: "Modern Irrigation System",
        price: 1299.99,
        unit: "piece",
        quantity: 10,
        seller: "AgriTech Industries",
        location: "Tech Valley, CA",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
      },
      {
        id: 4,
        title: "Solar Powered Pest Control",
        price: 349.99,
        unit: "unit",
        quantity: 25,
        seller: "GreenTech Solutions",
        location: "Innovation District, East",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
      }
    ],
    waste: [
      {
        id: 5,
        title: "Composted Farm Waste",
        price: 15.50,
        unit: "ton",
        quantity: 100,
        seller: "John Farmer",
        location: "Rural County, Midwest",
        image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8"
      },
      {
        id: 6,
        title: "Biomass for Energy Production",
        price: 85.75,
        unit: "ton",
        quantity: 50,
        seller: "EcoEnergy Cooperative",
        location: "Sustainable Valley, North",
        image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8"
      }
    ]
  };

  // Function to render items for each category
  const renderItems = (items: any[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            className="border rounded-lg overflow-hidden flex flex-col md:flex-row"
            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-36 md:w-1/3 md:h-auto bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:w-2/3 flex flex-col">
              <h3 className="font-medium text-lg mb-1">{item.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-lg font-bold text-primary">${item.price}</span>
                <span className="text-gray-500 text-sm">per {item.unit}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {item.quantity} {item.unit}s available • {item.location}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                Seller: {item.seller}
              </div>
              <div className="mt-auto">
                <Button size="sm" className="w-full bg-primary text-white hover:bg-primary-dark">
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Marketplace
            </CardTitle>
            <CardDescription>
              Buy and sell agricultural products, tools, and agri-waste
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="seeds">
            <TabsList className="mb-4">
              <TabsTrigger value="seeds">Seeds</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="waste">Agri-Waste</TabsTrigger>
            </TabsList>
            <TabsContent value="seeds">
              {renderItems(marketplaceItems.seeds)}
            </TabsContent>
            <TabsContent value="tools">
              {renderItems(marketplaceItems.tools)}
            </TabsContent>
            <TabsContent value="waste">
              {renderItems(marketplaceItems.waste)}
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              View All Marketplace Listings
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
