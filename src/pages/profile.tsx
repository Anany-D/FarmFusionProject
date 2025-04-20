import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Settings, 
  Edit, 
  Wallet, 
  CheckCircle, 
  ShieldCheck, 
  Tractor, 
  FileSpreadsheet,
  BarChart,
  Upload,
  Clock,
  Leaf
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BarterOffer, MarketplaceItem, Microjob, User as UserType } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  // Get user data - Using a demo ID of 1
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users/1'],
    onSuccess: (data: UserType) => {
      setFullName(data.fullName);
      setUsername(data.username);
      setLocation(data.location);
      setBio(data.bio || "");
      setWalletAddress(data.walletAddress || "");
    }
  });

  // Get user's marketplace items
  const { data: userListings, isLoading: isLoadingListings } = useQuery({
    queryKey: ['/api/marketplace', 1],
  });

  // Get user's barter offers
  const { data: barterOffers, isLoading: isLoadingBarter } = useQuery({
    queryKey: ['/api/barter', 1],
  });

  // Get user's microjobs
  const { data: microjobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['/api/microjobs', 1],
  });

  // Mutation for updating user profile
  const updateProfile = useMutation({
    mutationFn: (userData: Partial<UserType>) => {
      return apiRequest('PATCH', `/api/users/1`, userData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditMode(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Handle profile update
  const handleUpdateProfile = () => {
    updateProfile.mutate({
      fullName,
      username,
      location,
      bio,
      walletAddress
    });
  };

  // Calculate activity stats for the farmer
  const activityStats = {
    totalListings: userListings?.length || 0,
    activeListings: userListings?.filter((item: MarketplaceItem) => item.isAvailable).length || 0,
    barterOffers: barterOffers?.length || 0,
    microjobs: microjobs?.length || 0
  };

  // Recent activities (mock data for illustration)
  const recentActivities = [
    { type: "listing", action: "Posted a new item", item: "Organic Tomato Seeds", time: "2 days ago" },
    { type: "barter", action: "Received a barter offer", item: "Wheat Harvest for Irrigation System", time: "3 days ago" },
    { type: "microjob", action: "Completed a job", item: "Seasonal Harvest Help", time: "1 week ago" },
    { type: "transaction", action: "Received payment", item: "Sale of Composted Farm Waste", time: "1 week ago" }
  ];

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
          <h1 className="text-3xl font-heading font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">View and manage your AgroChain profile and activities</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </Button>
          {editMode && (
            <Button 
              className="bg-primary text-white hover:bg-primary-dark"
              onClick={handleUpdateProfile}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item}>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={user?.profileImage || "https://randomuser.me/api/portraits/men/1.jpg"} alt="User avatar" />
                    <AvatarFallback className="text-2xl">
                      {isLoadingUser ? "..." : user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!editMode && user?.verified && (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1 mb-2">
                      <CheckCircle className="h-3 w-3" />
                      Verified Farmer
                    </Badge>
                  )}
                  {editMode && (
                    <Button variant="outline" size="sm" className="mb-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  {!editMode ? (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold">{isLoadingUser ? "Loading..." : user?.fullName}</h2>
                      <div className="flex items-center text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        {isLoadingUser ? "Loading..." : user?.username}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Tractor className="h-4 w-4 mr-2" />
                        {isLoadingUser ? "Loading..." : user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {isLoadingUser ? "Loading..." : user?.location}
                      </div>
                      {user?.walletAddress && (
                        <div className="flex items-center text-gray-500">
                          <Wallet className="h-4 w-4 mr-2" />
                          <span className="font-mono text-sm">{user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}</span>
                        </div>
                      )}
                      {user?.bio && (
                        <div className="pt-3 mt-3 border-t">
                          <h3 className="text-sm font-medium mb-1">About</h3>
                          <p className="text-gray-600">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)} 
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="walletAddress">Wallet Address (Optional)</Label>
                        <Input 
                          id="walletAddress" 
                          value={walletAddress} 
                          onChange={(e) => setWalletAddress(e.target.value)} 
                          className="mt-1 font-mono"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/3 bg-gray-50 rounded-lg p-5 space-y-4">
                  <h3 className="font-medium">Activity Summary</h3>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Marketplace Listings</span>
                      <span>{activityStats.activeListings} active / {activityStats.totalListings} total</span>
                    </div>
                    <Progress value={(activityStats.activeListings / Math.max(activityStats.totalListings, 1)) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Barter Offers</span>
                      <span>{activityStats.barterOffers}</span>
                    </div>
                    <Progress value={Math.min((activityStats.barterOffers / 10) * 100, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Microjobs</span>
                      <span>{activityStats.microjobs}</span>
                    </div>
                    <Progress value={Math.min((activityStats.microjobs / 5) * 100, 100)} className="h-2" />
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-sm">Trust Score</h4>
                      <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-5 w-5 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="activity">
            <TabsList className="mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="listings">Marketplace Listings</TabsTrigger>
              <TabsTrigger value="barter">Barter Offers</TabsTrigger>
              <TabsTrigger value="microjobs">Microjobs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest actions and transactions on AgroChain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {activity.type === "listing" && <FileSpreadsheet className="h-5 w-5 text-primary" />}
                          {activity.type === "barter" && <Repeat className="h-5 w-5 text-primary" />}
                          {activity.type === "microjob" && <Briefcase className="h-5 w-5 text-primary" />}
                          {activity.type === "transaction" && <BarChart className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.action}</h4>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="listings">
              <Card>
                <CardHeader>
                  <CardTitle>Your Marketplace Listings</CardTitle>
                  <CardDescription>
                    Items you have listed for sale on the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingListings ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading your listings...</p>
                      </div>
                    </div>
                  ) : !userListings || userListings.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Listings Yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You haven't listed any items in the marketplace.
                      </p>
                      <Button className="bg-primary text-white hover:bg-primary-dark">
                        Create Your First Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userListings.map((item: MarketplaceItem) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden flex">
                          <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                            {item.category === "seed" && <Leaf className="h-8 w-8 text-primary" />}
                            {item.category === "tool" && <Tool className="h-8 w-8 text-blue-500" />}
                            {item.category === "agri-waste" && <Recycle className="h-8 w-8 text-amber-500" />}
                            {item.category === "produce" && <Apple className="h-8 w-8 text-red-500" />}
                          </div>
                          <div className="p-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                {item.isAvailable ? "Available" : "Sold"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                            <div className="flex justify-between mt-2">
                              <span className="text-sm font-bold">${item.price}/{item.unit}</span>
                              <span className="text-xs text-gray-500">{item.quantity} {item.unit}s available</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="barter">
              <Card>
                <CardHeader>
                  <CardTitle>Your Barter Offers</CardTitle>
                  <CardDescription>
                    Barter exchanges you've proposed or received
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingBarter ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading your barter offers...</p>
                      </div>
                    </div>
                  ) : !barterOffers || barterOffers.length === 0 ? (
                    <div className="text-center py-12">
                      <Repeat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Barter Offers Yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You haven't created or received any barter offers.
                      </p>
                      <Button className="bg-primary text-white hover:bg-primary-dark">
                        Create a Barter Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {barterOffers.map((offer: BarterOffer) => (
                        <div key={offer.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-500">
                              {offer.offerUserId === 1 ? "Offered to User #" + offer.receiveUserId : "Received from User #" + offer.offerUserId}
                            </span>
                            <Badge 
                              variant={
                                offer.status === "accepted" ? "success" : 
                                offer.status === "rejected" ? "destructive" : 
                                "outline"
                              }
                              className={
                                offer.status === "accepted" ? "bg-green-100 text-green-800 border-green-200" : 
                                offer.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" :
                                "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }
                            >
                              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-center sm:text-left">
                              <div className="text-xs text-gray-500 mb-1">Offering</div>
                              <div className="font-medium">Item #{offer.offerItemId}</div>
                            </div>
                            
                            <div className="hidden sm:block">
                              <ArrowRightLeft className="h-5 w-5 text-gray-400" />
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left">
                              <div className="text-xs text-gray-500 mb-1">Requesting</div>
                              <div className="font-medium">Item #{offer.requestItemId}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="microjobs">
              <Card>
                <CardHeader>
                  <CardTitle>Your Microjobs</CardTitle>
                  <CardDescription>
                    Jobs you've posted or applied for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingJobs ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading your microjobs...</p>
                      </div>
                    </div>
                  ) : !microjobs || microjobs.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Microjobs Yet</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You haven't posted or applied for any microjobs.
                      </p>
                      <Button className="bg-primary text-white hover:bg-primary-dark">
                        Post a Microjob
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {microjobs.map((job: Microjob) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{job.title}</h4>
                            <Badge 
                              variant={
                                job.status === "open" ? "success" : 
                                job.status === "assigned" ? "outline" : 
                                "secondary"
                              }
                              className={
                                job.status === "open" ? "bg-green-100 text-green-800 border-green-200" : 
                                job.status === "assigned" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                "bg-purple-100 text-purple-800 border-purple-200"
                              }
                            >
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {job.duration}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Coin className="h-4 w-4 mr-1 text-gray-400" />
                              ${job.compensation}/hour
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Posted: <span className="text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Password</div>
                            <div className="text-sm text-gray-500">Last changed 3 months ago</div>
                          </div>
                          <Button variant="outline">Change Password</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-500">Enhance your account security</div>
                          </div>
                          <Button variant="default">Enable</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-gray-500">Receive updates about your activity</div>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Privacy Settings</div>
                            <div className="text-sm text-gray-500">Manage your profile visibility</div>
                          </div>
                          <Button variant="outline">Configure</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Delete Account</div>
                            <div className="text-sm text-gray-500">Permanently delete your account and all data</div>
                          </div>
                          <Button variant="destructive">Delete Account</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}

// These components are needed but might not be imported elsewhere
function MapPin(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}

function Repeat(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
}

function Briefcase(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
}

function Star(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

function Tool(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
}

function Recycle(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>
}

function Apple(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
}

function Coin(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="8"/><path d="M9.16 9a4 4 0 0 0 6.15 4.45"/><path d="M8.59 13.51A4 4 0 0 0 15.3 12"/></svg>
}
