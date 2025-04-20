import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DAOProposal } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Calendar, Users, Award } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface DAOVisualizationProps {
  proposal: DAOProposal;
}

export default function DAOVisualization({ proposal }: DAOVisualizationProps) {
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();
  
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
  const againstPercentage = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0;
  
  const endDate = new Date(proposal.endDate);
  const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const handleVote = async (vote: 'for' | 'against') => {
    if (isVoting) return;
    
    try {
      setIsVoting(true);
      await apiRequest('POST', `/api/proposals/${proposal.id}/vote`, { vote });
      
      toast({
        title: "Vote registered!",
        description: `You have voted ${vote === 'for' ? 'in favor of' : 'against'} this proposal.`,
      });
      
      // Invalidate the proposals cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
    } catch (error) {
      toast({
        title: "Failed to vote",
        description: "There was an error registering your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{proposal.category}</Badge>
                <Badge 
                  variant={
                    proposal.status === 'active' ? 'default' : 
                    proposal.status === 'passed' ? 'success' : 'destructive'
                  }
                >
                  {proposal.status}
                </Badge>
              </div>
              <h3 className="text-lg font-medium">{proposal.title}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {daysLeft > 0 ? `${daysLeft} days left` : 'Voting ended'}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">{proposal.description}</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span>In Favor</span>
                </div>
                <span className="font-medium">{proposal.votesFor} votes ({forPercentage}%)</span>
              </div>
              <Progress value={forPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  <span>Against</span>
                </div>
                <span className="font-medium">{proposal.votesAgainst} votes ({againstPercentage}%)</span>
              </div>
              <Progress value={againstPercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{totalVotes} total votes</span>
            </div>
            
            {proposal.status === 'active' ? (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => handleVote('against')}
                  disabled={isVoting}
                >
                  <ThumbsDown className="h-4 w-4" />
                  Vote Against
                </Button>
                <Button 
                  size="sm" 
                  className="gap-1"
                  onClick={() => handleVote('for')}
                  disabled={isVoting}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Vote For
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm font-medium">
                <Award className="h-4 w-4 text-primary" />
                {proposal.status === 'passed' ? 'Proposal passed' : 'Proposal rejected'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
