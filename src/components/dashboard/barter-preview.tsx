import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Repeat, ArrowLeftRight } from "lucide-react";
import { BarterItem } from "@shared/schema";

export default function BarterPreview() {
  const { data: barterItems, isLoading } = useQuery<BarterItem[]>({
    queryKey: ['/api/barter'],
    queryFn: async () => {
      const response = await fetch('/api/barter?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch barter items');
      }
      return response.json();
    }
  });

  return (
    <motion.div {...fadeInUp} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Barter Offerings</h2>
        <Link href="/barter">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-60 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          {...staggerContainer}
        >
          {barterItems?.map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <Link href={`/barter/${item.id}`}>
                <DataCard
                  title={item.name}
                  icon={<Repeat className="h-4 w-4" />}
                  footer={<div className="flex justify-between w-full">
                    <span>{item.quantity} {item.unit}</span>
                    <span>{item.location}</span>
                  </div>}
                  onClick={() => {}}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{item.category}</Badge>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <ArrowLeftRight className="h-4 w-4 text-primary" />
                      <span className="font-medium">Looking for:</span>
                      <span className="text-muted-foreground">{item.lookingFor}</span>
                    </div>
                  </div>
                </DataCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
