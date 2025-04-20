import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Briefcase, MapPin, Clock, Coins, CheckCircle, Search, Filter, Plus, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Microjob } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";

export default function Microjobs() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobCompensation, setJobCompensation] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [selectedTab, setSelectedTab] = useState("browse");

  const { data: microjobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['/api/microjobs'],
  });

  const { data: myJobs, isLoading: isLoadingMyJobs } = useQuery({
    queryKey: ['/api/microjobs', 1], // Assuming user id 1 for demo
  });

  // Create microjob mutation
  const createMicrojob = useMutation({
    mutationFn: (newJob: any) => {
      return apiRequest('POST', '/api/microjobs', newJob);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Microjob created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/microjobs'] });
      // Reset form
      setJobTitle("");
      setJobDescription("");
      setJobSkills("");
      setJobCompensation("");
      setJobLocation("");
      setJobDuration("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create microjob",
        variant: "destructive",
      });
    },
  });

  // Update microjob status mutation
  const updateJobStatus = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => {
      return apiRequest('PATCH', `/api/microjobs/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Microjob status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/microjobs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    },
  });

  // Handle new microjob submission
  const handleSubmitJob = () => {
    if (!jobTitle || !jobDescription || !jobSkills || !jobCompensation || !jobLocation || !jobDuration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createMicrojob.mutate({
      userId: 1, // Assuming user id 1 for demo
      title: jobTitle,
      description: jobDescription,
      skillsRequired: jobSkills,
      compensation: parseFloat(jobCompensation),
      location: jobLocation,
      duration: jobDuration
    });
  };

  // Define columns for job listings
  const jobColumns: ColumnDef<Microjob>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "compensation",
      header: "Pay",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("compensation"));
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        
        return (
          <div className="flex items-center">
            <Coins className="h-4 w-4 mr-1 text-gray-400" />
            {formatted}/hour
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {row.getValue("duration")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let color = "";
        
        switch(status) {
          case "open":
            color = "green";
            break;
          case "assigned":
            color = "blue";
            break;
          case "completed":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        
        return (
          <Badge className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button size="sm" className="bg-primary text-white hover:bg-primary-dark">
            Apply Now
          </Button>
        );
      },
    },
  ];

  // Define columns for my jobs
  const myJobColumns: ColumnDef<Microjob>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "compensation",
      header: "Pay",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("compensation"));
        
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        
        return (
          <div className="flex items-center">
            <Coins className="h-4 w-4 mr-1 text-gray-400" />
            {formatted}/hour
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let color = "";
        
        switch(status) {
          case "open":
            color = "green";
            break;
          case "assigned":
            color = "blue";
            break;
          case "completed":
            color = "purple";
            break;
          default:
            color = "gray";
        }
        
        return (
          <Badge className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
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
            {status === "open" && (
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => updateJobStatus.mutate({ id, status: "assigned" })}
              >
                Mark Assigned
              </Button>
            )}
            {status === "assigned" && (
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => updateJobStatus.mutate({ id, status: "completed" })}
              >
                Mark Completed
              </Button>
            )}
            <Button size="sm" variant="outline">View</Button>
          </div>
        );
      },
    },
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
          <h1 className="text-3xl font-heading font-bold mb-2">Microjobs Platform</h1>
          <p className="text-muted-foreground">Find short-term agricultural work or hire skilled labor</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Post a New Microjob</DialogTitle>
              <DialogDescription>
                Fill in the details about the job you need help with.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter job title"
                  className="col-span-3"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="jobDescription" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Describe the job in detail"
                  className="col-span-3"
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobSkills" className="text-right">
                  Skills Required
                </Label>
                <Input
                  id="jobSkills"
                  placeholder="List required skills (comma separated)"
                  className="col-span-3"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobCompensation" className="text-right">
                  Hourly Rate ($)
                </Label>
                <Input
                  id="jobCompensation"
                  type="number"
                  placeholder="Enter hourly rate"
                  className="col-span-3"
                  value={jobCompensation}
                  onChange={(e) => setJobCompensation(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobLocation" className="text-right">
                  Location
                </Label>
                <Input
                  id="jobLocation"
                  placeholder="Enter location or 'Remote'"
                  className="col-span-3"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jobDuration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="jobDuration"
                  placeholder="e.g., '2 days', '1 week'"
                  className="col-span-3"
                  value={jobDuration}
                  onChange={(e) => setJobDuration(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
                onClick={handleSubmitJob}
                disabled={createMicrojob.isPending}
              >
                {createMicrojob.isPending ? "Posting..." : "Post Job"}
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
                  <Briefcase className="h-5 w-5 text-primary" />
                  Microjobs Marketplace
                </CardTitle>
                <CardDescription>
                  Connect with local farmers and agricultural businesses for short-term work
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">For Job Seekers</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Find flexible, short-term agricultural work opportunities that match your skills and availability.
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-4 mx-auto">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">For Employers</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Post jobs to quickly find qualified workers for your farm or agricultural business needs.
                  </p>
                </div>
                
                <div className="border rounded-lg p-5 bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent-foreground mb-4 mx-auto">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">Why Microjobs?</h3>
                  <p className="text-sm text-gray-600 text-center">
                    • Flexibility for seasonal work<br />
                    • Skill-based matching<br />
                    • Community-powered marketplace
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <Tabs defaultValue="browse" onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
                  <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search jobs..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="midwest">Midwest</SelectItem>
                      <SelectItem value="east">Eastern Region</SelectItem>
                      <SelectItem value="west">Western Region</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
              
              {selectedTab === "browse" ? (
                isLoadingJobs ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading available jobs...</p>
                    </div>
                  </div>
                ) : microjobs?.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Jobs Available</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      There are currently no microjobs posted.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Post a Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent>{/* Same dialog content as above */}</DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <DataTable columns={jobColumns} data={microjobs || []} />
                )
              ) : (
                isLoadingMyJobs ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading your jobs...</p>
                    </div>
                  </div>
                ) : myJobs?.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Jobs Posted</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      You haven't posted any microjobs yet.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-white hover:bg-primary-dark">
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent>{/* Same dialog content as above */}</DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <DataTable columns={myJobColumns} data={myJobs || []} />
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
