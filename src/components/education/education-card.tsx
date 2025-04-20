import { motion } from "framer-motion";
import { EducationResource } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react";

interface EducationCardProps {
  resource: EducationResource;
  onClick?: () => void;
}

export default function EducationCard({ resource, onClick }: EducationCardProps) {
  // Function to determine difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  // Function to get an appropriate icon for the category
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'web3':
        return '🌐';
      case 'defi':
        return '💰';
      case 'governance':
        return '🏛️';
      case 'insurance':
        return '🛡️';
      case 'farming techniques':
        return '🌱';
      case 'sustainability':
        return '♻️';
      case 'marketing':
        return '📊';
      default:
        return '📚';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card 
        className="overflow-hidden h-full flex flex-col border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {getCategoryIcon(resource.category)}
              </span>
              {resource.title}
            </CardTitle>
            <Badge className={getDifficultyColor(resource.difficulty)}>
              {resource.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{resource.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {resource.description}
          </p>
          
          <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium">Learning Outcomes</div>
              <p className="text-xs text-muted-foreground mt-1">
                Understanding key concepts, practical applications, and implementation strategies.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button className="w-full gap-1">
            <BookOpen className="h-4 w-4" />
            Read Article
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
