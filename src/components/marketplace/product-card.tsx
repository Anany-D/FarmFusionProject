import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Leaf, Info, MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
              {product.isOrganic && (
                <Leaf className="h-4 w-4 text-green-600" />
              )}
              {product.name}
            </CardTitle>
            <Badge variant={product.type === 'product' ? 'default' : 'secondary'}>
              {product.type === 'product' ? 'Product' : 'Agri-waste'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{product.category}</Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {product.location}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Price</div>
              <div className="font-medium">${product.price}/{product.unit}</div>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <div className="text-muted-foreground">Quantity</div>
              <div className="font-medium">{product.quantity} {product.unit}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between gap-2">
          <Link href={`/marketplace/${product.id}`}>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Info className="h-4 w-4" />
              Details
            </Button>
          </Link>
          <Button size="sm" className="w-full gap-1">
            <ShoppingCart className="h-4 w-4" />
            Purchase
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
