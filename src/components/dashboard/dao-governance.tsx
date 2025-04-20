import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, ThumbsUp, ThumbsDown, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function DAOGovernance() {
  // Sample data
  const proposals = [
    {
      id: 1,
      title: "Community Seed Bank Creation",
      description: "Establish a community-owned seed bank to preserve heirloom varieties.",
      proposedBy: "John Farmer",
      votesFor: 67,
      votesAgainst: 12,
      status: "active",
      endTime: "2 days",
      participation: 79
    },
    {
      id: 2,
      title: "Sustainable Farming Incentive Program",
      description: "Create a token-based incentive system to reward farmers who adopt sustainable practices.",
      proposedBy: "Department of Agriculture",
      votesFor: 91,
      votesAgainst: 8,
      status: "active",
      endTime: "3 days",
      participation: 99
    }
  ];

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              DAO Governance
            </CardTitle>
            <CardDescription>
              Participate in decentralized decision-making for the AgroChain community
            </CardDescription>
          </div>
          <Button className="bg-primary text-white hover:bg-primary-dark">
            New Proposal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {proposals.map((proposal) => (
              <div 
                key={proposal.id} 
                className="border rounded-lg p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-lg">{proposal.title}</h3>
                  <Badge variant={proposal.status === "active" ? "outline" : "secondary"} className={
                    proposal.status === "active" 
                      ? "bg-blue-50 text-blue-600 border-blue-200" 
                      : "bg-gray-100 text-gray-600"
                  }>
                    {proposal.status === "active" ? "Active" : "Closed"}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">{proposal.description}</p>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">Proposed by: {proposal.proposedBy}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">Ends in: {proposal.endTime}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vote distribution</span>
                    <span className="font-medium">{proposal.participation}% participation</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                    ></div>
                  </div>
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
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Vote For
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Vote Against
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="link" className="text-primary">
              View All Proposals
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
