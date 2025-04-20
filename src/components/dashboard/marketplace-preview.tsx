import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Leaf, ShoppingCart } from "lucide-react";
import { Product } from "@shared/schema";

export default function MarketplacePreview() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  return (
    <motion.div {...fadeInUp} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <Link href="/marketplace">
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
          {products?.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Link href={`/marketplace/${product.id}`}>
                <DataCard
                  title={product.name}
                  icon={product.isOrganic ? <Leaf className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  footer={<div className="flex justify-between w-full">
                    <span>${product.price}/{product.unit}</span>
                    <span>{product.location}</span>
                  </div>}
                  onClick={() => {}}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={product.type === 'product' ? 'default' : 'secondary'}>
                        {product.type === 'product' ? 'Product' : 'Agri-waste'}
                      </Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="mt-2 font-medium">{product.quantity} {product.unit} available</p>
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
