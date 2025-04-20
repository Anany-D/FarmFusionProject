import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Repeat, ArrowRightLeft, Plus, Search, Filter, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BarterOffer, MarketplaceItem } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";

export default function Barter() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [offerItemId, setOfferItemId] = useState<string>("");
  const [requestItemId, setRequestItemId] = useState<string>("");

  const { data: barterOffers, isLoading: isLoadingOffers } = useQuery({
    queryKey: ['/api/barter'],
  });

  const { data: myItems, isLoading: isLoadingMyItems } = useQuery({
    queryKey: ['/api/marketplace', 1], // Assuming user id 1 for demo
  });

  const { data: allItems, isLoading: isLoadingAllItems } = useQuery({
    queryKey: ['/api/marketplace'],
  });

  // Create barter offer mutation
  const createBarterOffer = useMutation({
    mutationFn: (newOffer: any) => {
      return apiRequest('POST', '/api/barter', newOffer);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Barter offer created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/barter'] });
      setOfferItemId("");
      setRequestItemId("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create barter offer",
        variant: "destructive",
      });
    },
  });

  // Update barter offer status mutation
  const updateBarterStatus = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => {
      return apiRequest('PATCH', `/api/barter/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Barter offer status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/barter'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update barter status",
        variant: "destructive",
      });
    },
  });

  // Handle new barter offer submission
  const handleSubmitOffer = () => {
    if (!offerItemId || !requestItemId) {
      toast({
        title: "Error",
        description: "Please select both offer and request items",
        variant: "destructive",
      });
      return;
    }

    createBarterOffer.mutate({
      offerUserId: 1, // Assuming user id 1 for demo
      receiveUserId: 2, // This would normally be the owner of the requested item
      offerItemId: parseInt(offerItemId),
      requestItemId: parseInt(requestItemId)
    });
  };

  // Define columns for incoming offers
  const incomingColumns: ColumnDef<BarterOffer>[] = [
    {
      accessorKey: "offerUserId",
      header: "From",
      cell: ({ row }) => <div>User #{row.getValue("offerUserId")}</div>,
    },
    {
      accessorKey: "offerItemId",
      header: "Offering",
      cell: ({ row }) => {
        const itemId = row.getValue("offerItemId") as number;
        const item = allItems?.find((i: MarketplaceItem) => i.id === itemId);
        return <div>{item?.title || `Item #${itemId}`}</div>;
      },
    },
    {
      accessorKey: "requestItemId",
      header: "Requesting",
      cell: ({ row }) => {
        const itemId = row.getValue("requestItemId") as number;
        const item = allItems?.find((i: MarketplaceItem) => i.id === itemId);
        return <div>{item?.title || `Item #${itemId}`}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === "accepted" ? "success" : status === "rejected" ? "destructive" : "outline"}
            className={
              status === "accepted" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : status === "rejected"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const status = row.original.status;
        const id = row.original.id;
        
        return (
          <div className="flex space-x-2">
            {status === "pending" && (
              <>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateBarterStatus.mutate({ id, status: "accepted" })}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => updateBarterStatus.mutate({ id, status: "rejected" })}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        );
      },
    },
  ];

  // Define columns for outgoing offers
  const outgoingColumns: ColumnDef<BarterOffer>[] = [
    {
      accessorKey: "receiveUserId",
      header: "To",
      cell: ({ row }) => <div>User #{row.getValue("receiveUserId")}</div>,
    },
    {
      accessorKey: "offerItemId",
      header: "Offering",
      cell: ({ row }) => {
        const itemId = row.getValue("offerItemId") as number;
        const item = allItems?.find((i: MarketplaceItem) => i.id === itemId);
        return <div>{item?.title || `Item #${itemId}`}</div>;
      },
    },
    {
      accessorKey: "requestItemId",
      header: "Requesting",
      cell: ({ row }) => {
        const itemId = row.getValue("requestItemId") as number;
        const item = allItems?.find((i: MarketplaceItem) => i.id === itemId);
        return <div>{item?.title || `Item #${itemId}`}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === "accepted" ? "success" : status === "rejected" ? "destructive" : "outline"}
            className={
              status === "accepted" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : status === "rejected"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button size="sm" variant="outline">View Details</Button>
        );
      },
    },
  ];

  // Filter offers for respective tabs
  const incomingOffers = barterOffers?.filter((offer: BarterOffer) => offer.receiveUserId === 1) || [];
  const outgoingOffers = barterOffers?.filter((offer: BarterOffer) => offer.offerUserId === 1) || [];

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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Barter System</h1>
          <p className="text-muted-foreground">Exchange seeds, tools, and labor directly with other users</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Barter Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Barter Offer</DialogTitle>
              <DialogDescription>
                Select what you want to offer and what you'd like in exchange.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="offerItem" className="text-right">
                  You Offer
                </Label>
                <Select value={offerItemId} onValueChange={setOfferItemId}>
                  <SelectTrigger id="offerItem" className="col-span-3">
                    <SelectValue placeholder="Select an item to offer" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingMyItems ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      myItems?.map((item: MarketplaceItem) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.title} ({item.quantity} {item.unit}s)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requestItem" className="text-right">
                  You Request
                </Label>
                <Select value={requestItemId} onValueChange={setRequestItemId}>
                  <SelectTrigger id="requestItem" className="col-span-3">
                    <SelectValue placeholder="Select an item to request" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAllItems ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                      allItems?.filter((item: MarketplaceItem) => item.userId !== 1).map((item: MarketplaceItem) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.title} ({item.quantity} {item.unit}s) - User #{item.userId}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
                onClick={handleSubmitOffer}
                disabled={createBarterOffer.isPending}
              >
                {createBarterOffer.isPending ? "Creating..." : "Create Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div>
                <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
                  <Repeat className="h-5 w-5 text-primary" />
                  Barter System Overview
                </CardTitle>
                <CardDescription>
                  Create and manage your barter offers with other platform users
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                    <Repeat className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">What is Bartering?</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Bartering is the direct exchange of goods or services without using money. It enables farmers to trade seeds, tools, and labor directly with each other.
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-4 mx-auto">
                    <ArrowRightLeft className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">How It Works</h3>
                  <p className="text-sm text-gray-600 text-center">
                    1. Create a barter offer listing what you have and what you need.<br />
                    2. Connect with potential trading partners.<br />
                    3. Agree on terms and complete the exchange.
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent-foreground mb-4 mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">Benefits</h3>
                  <p className="text-sm text-gray-600 text-center">
                    • Save money by trading excess resources<br />
                    • Build community relationships<br />
                    • Reduce waste and promote sustainability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Your Barter Offers</CardTitle>
              <CardDescription>
                Manage your incoming and outgoing barter offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search offers..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" onValueChange={setSelectedTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Offers</TabsTrigger>
                  <TabsTrigger value="incoming">Incoming Offers</TabsTrigger>
                  <TabsTrigger value="outgoing">Outgoing Offers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {isLoadingOffers ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading barter offers...</p>
                      </div>
                    </div>
                  ) : barterOffers?.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <Repeat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Barter Offers Yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Start bartering by creating your first offer.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-primary text-white hover:bg-primary-dark">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>{/* Same dialog content as above */}</DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <DataTable columns={incomingColumns} data={barterOffers || []} />
                  )}
                </TabsContent>
                
                <TabsContent value="incoming">
                  {isLoadingOffers ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading incoming offers...</p>
                      </div>
                    </div>
                  ) : incomingOffers.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <Repeat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Incoming Offers</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You don't have any incoming barter offers yet.
                      </p>
                    </div>
                  ) : (
                    <DataTable columns={incomingColumns} data={incomingOffers} />
                  )}
                </TabsContent>
                
                <TabsContent value="outgoing">
                  {isLoadingOffers ? (
                    <div className="h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading outgoing offers...</p>
                      </div>
                    </div>
                  ) : outgoingOffers.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg">
                      <Repeat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Outgoing Offers</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You haven't created any barter offers yet.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-primary text-white hover:bg-primary-dark">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Offer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>{/* Same dialog content as above */}</DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <DataTable columns={outgoingColumns} data={outgoingOffers} />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
