import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/animations";

interface DataCardProps {
  title: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function DataCard({ 
  title, 
  icon, 
  footer, 
  className, 
  isLoading = false,
  onClick,
  children 
}: DataCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -5 } : undefined}
      whileTap={onClick ? { y: 0 } : undefined}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all",
          onClick && "cursor-pointer hover:border-primary/50",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            </div>
          ) : (
            children
          )}
        </CardContent>
        {footer && (
          <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <p className={cn(
                "text-xs mt-1 flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </p>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
