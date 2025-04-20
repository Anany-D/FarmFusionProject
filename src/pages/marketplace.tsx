import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart, Search, Filter, ArrowUpDown, Tag, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { MarketplaceItem } from "@shared/schema";

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: marketplaceItems, isLoading } = useQuery({
    queryKey: ['/api/marketplace'],
  });

  // Define table columns
  const columns: ColumnDef<MarketplaceItem>[] = [
    {
      accessorKey: "title",
      header: "Item",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        let color = "";
        
        switch(category) {
          case "seed":
            color = "green";
            break;
          case "tool":
            color = "blue";
            break;
          case "agri-waste":
            color = "amber";
            break;
          case "produce":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        
        return (
          <Badge className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const unit = row.original.unit;
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        
        return <div className="font-medium">{formatted}/{unit}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = parseFloat(row.getValue("quantity"));
        const unit = row.original.unit;
        
        return <div>{quantity} {unit}s</div>;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {row.getValue("location")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button size="sm">View</Button>
            <Button size="sm" variant="outline">Contact</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Agricultural Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell agricultural products, tools, and agri-waste</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary-dark">
          <ShoppingCart className="h-4 w-4 mr-2" />
          List New Item
        </Button>
      </div>
      
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Marketplace Listings</CardTitle>
            <CardDescription>Browse all available items on the AgroChain marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search listings..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline">
                  <Tag className="h-4 w-4 mr-2" />
                  Price Range
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="seed">Seeds</TabsTrigger>
                <TabsTrigger value="tool">Tools</TabsTrigger>
                <TabsTrigger value="agri-waste">Agri-Waste</TabsTrigger>
                <TabsTrigger value="produce">Produce</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading marketplace items...</p>
                    </div>
                  </div>
                ) : (
                  <DataTable columns={columns} data={marketplaceItems || []} />
                )}
              </TabsContent>
              
              {["seed", "tool", "agri-waste", "produce"].map((category) => (
                <TabsContent key={category} value={category}>
                  {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading {category} items...</p>
                      </div>
                    </div>
                  ) : (
                    <DataTable 
                      columns={columns} 
                      data={(marketplaceItems || []).filter(item => item.category === category)} 
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
