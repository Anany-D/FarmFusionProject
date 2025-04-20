import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Vote, 
  ThumbsUp, 
  ThumbsDown, 
  Users, 
  Clock, 
  Search, 
  Landmark,
  BarChart,
  PieChart,
  Shield,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { DaoProposal } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Governance() {
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalEndDate, setProposalEndDate] = useState("");

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['/api/dao/proposals'],
  });

  // Create proposal mutation
  const createProposal = useMutation({
    mutationFn: (newProposal: any) => {
      return apiRequest('POST', '/api/dao/proposals', newProposal);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] });
      // Reset form
      setProposalTitle("");
      setProposalDescription("");
      setProposalEndDate("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive",
      });
    },
  });

  // Vote on proposal mutation
  const voteOnProposal = useMutation({
    mutationFn: ({ id, vote }: { id: number, vote: "for" | "against" }) => {
      return apiRequest('POST', `/api/dao/proposals/${id}/vote`, { vote });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vote recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive",
      });
    },
  });

  // Handle new proposal submission
  const handleSubmitProposal = () => {
    if (!proposalTitle || !proposalDescription || !proposalEndDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const endDate = new Date(proposalEndDate);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      toast({
        title: "Error",
        description: "Please enter a valid future date",
        variant: "destructive",
      });
      return;
    }

    createProposal.mutate({
      userId: 1, // Assuming user id 1 for demo
      title: proposalTitle,
      description: proposalDescription,
      endsAt: endDate
    });
  };

  // Stats data for the governance overview
  const governanceStats = [
    { name: 'Active Proposals', value: 15 },
    { name: 'Completed Proposals', value: 68 },
  ];

  const COLORS = ['#2E7D32', '#424242'];

  // Get active and past proposals
  const activeProposals = proposals?.filter((p: DaoProposal) => p.status === "active") || [];
  const passedProposals = proposals?.filter((p: DaoProposal) => p.status === "passed") || [];
  const rejectedProposals = proposals?.filter((p: DaoProposal) => p.status === "rejected") || [];

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
          <h1 className="text-3xl font-heading font-bold mb-2">DAO Governance</h1>
          <p className="text-muted-foreground">Participate in decentralized decision-making for the AgroChain community</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
              <DialogDescription>
                Submit a proposal for the community to vote on.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proposalTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="proposalTitle"
                  placeholder="Enter proposal title"
                  className="col-span-3"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="proposalDescription" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="proposalDescription"
                  placeholder="Describe your proposal in detail"
                  className="col-span-3"
                  rows={5}
                  value={proposalDescription}
                  onChange={(e) => setProposalDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="proposalEndDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="proposalEndDate"
                  type="date"
                  className="col-span-3"
                  value={proposalEndDate}
                  onChange={(e) => setProposalEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark"
                onClick={handleSubmitProposal}
                disabled={createProposal.isPending}
              >
                {createProposal.isPending ? "Creating..." : "Create Proposal"}
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
                  <Landmark className="h-5 w-5 text-primary" />
                  Governance Overview
                </CardTitle>
                <CardDescription>
                  Community-led decision making through voting on proposals
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <div className="bg-gray-50 rounded-lg p-5 h-full">
                    <h3 className="font-medium text-lg mb-4 text-center">Proposals Summary</h3>
                    <div className="flex items-center justify-center h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsChart>
                          <Pie
                            data={[
                              { name: 'Active', value: activeProposals.length || 2 },
                              { name: 'Passed', value: passedProposals.length || 10 },
                              { name: 'Rejected', value: rejectedProposals.length || 5 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="#4CAF50" /> {/* Active - Green */}
                            <Cell fill="#2196F3" /> {/* Passed - Blue */}
                            <Cell fill="#F44336" /> {/* Rejected - Red */}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}`, 'Count']}
                          />
                        </RechartsChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-sm text-gray-500">Total Proposals</div>
                      <div className="text-2xl font-bold">{(activeProposals.length + passedProposals.length + rejectedProposals.length) || 17}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                        <Vote className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium text-center mb-2">What is DAO?</h3>
                      <p className="text-sm text-gray-600 text-center">
                        Decentralized Autonomous Organization - a community-governed entity where decisions are made through member voting.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-4 mx-auto">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium text-center mb-2">How It Works</h3>
                      <p className="text-sm text-gray-600 text-center">
                        Members can create proposals and vote. Proposals pass or fail based on majority consensus within voting period.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent-foreground mb-4 mx-auto">
                        <BarChart className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium text-center mb-2">Your Stats</h3>
                      <p className="text-sm text-gray-600 text-center">
                        <strong>Voting Power:</strong> 1 vote<br />
                        <strong>Proposals Created:</strong> 1<br />
                        <strong>Votes Cast:</strong> 5
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-5 bg-gray-50 rounded-lg p-5">
                    <h3 className="font-medium text-center mb-3">Your Voting Activity</h3>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>65% participation rate</span>
                      <span>5 out of 8 proposals voted on</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Active Proposals</CardTitle>
              <CardDescription>
                Cast your vote on current community proposals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search proposals..." className="pl-8" />
              </div>
              
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading proposals...</p>
                  </div>
                </div>
              ) : activeProposals.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <Vote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Proposals</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    There are currently no active proposals to vote on.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-white hover:bg-primary-dark">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>{/* Same dialog content as above */}</DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeProposals.map((proposal: DaoProposal) => (
                    <div 
                      key={proposal.id} 
                      className="border rounded-lg p-5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-lg">{proposal.title}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{proposal.description}</p>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-600">Proposed by: User #{proposal.userId}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Ends: {new Date(proposal.endsAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Vote distribution</span>
                          <span className="font-medium">
                            {proposal.votesFor + proposal.votesAgainst} total votes
                          </span>
                        </div>
                        <Progress 
                          value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between mt-4">
                        <div className="flex space-x-4 mb-3 sm:mb-0">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-primary" />
                            <span className="font-medium">{proposal.votesFor}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                            <span className="font-medium">{proposal.votesAgainst}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-200 text-green-600 hover:bg-green-50"
                            onClick={() => voteOnProposal.mutate({ id: proposal.id, vote: "for" })}
                            disabled={voteOnProposal.isPending}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Vote For
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => voteOnProposal.mutate({ id: proposal.id, vote: "against" })}
                            disabled={voteOnProposal.isPending}
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Vote Against
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && activeProposals.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">Past Proposals</h3>
                  <div className="space-y-4">
                    {[...passedProposals, ...rejectedProposals].slice(0, 2).map((proposal: DaoProposal) => (
                      <div key={proposal.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{proposal.title}</h4>
                          <Badge 
                            variant={proposal.status === "passed" ? "success" : "destructive"}
                            className={
                              proposal.status === "passed" 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {proposal.status === "passed" ? "Passed" : "Rejected"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Final vote: {proposal.votesFor} for, {proposal.votesAgainst} against
                        </div>
                        <Progress 
                          value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-primary">
                      View All Past Proposals
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
