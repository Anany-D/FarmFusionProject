import { motion } from "framer-motion";
import { BarterItem } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Repeat, Info, MapPin } from "lucide-react";

interface BarterCardProps {
  item: BarterItem;
}

export default function BarterCard({ item }: BarterCardProps) {
  // Determine the icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'seeds':
        return "🌱";
      case 'tools':
        return "🛠️";
      case 'labor':
        return "👨‍🌾";
      case 'equipment':
        return "🚜";
      case 'knowledge':
        return "📚";
      default:
        return "📦";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden h-full flex flex-col border-border/50 hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {getCategoryIcon(item.category)}
              </span>
              {item.name}
            </CardTitle>
            <Badge>{item.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{item.status}</Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {item.location}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex flex-col gap-2">
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Offering</div>
              <div className="font-medium">{item.quantity} {item.unit}</div>
            </div>
            <div className="bg-secondary/10 p-2 rounded flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-secondary" />
              <div>
                <div className="text-muted-foreground text-xs">Looking for</div>
                <div className="font-medium text-sm">{item.lookingFor}</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Link href={`/barter/${item.id}`}>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Info className="h-4 w-4" />
              Details
            </Button>
          </Link>
          <Button size="sm" className="w-full gap-1">
            <Repeat className="h-4 w-4" />
            Offer Trade
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
