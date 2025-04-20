import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatisticCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  description?: string;
  icon?: React.ReactNode;
}

export default function StatisticCard({
  title,
  value,
  trend,
  trendDirection = "up",
  description,
  icon
}: StatisticCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-heading font-semibold text-neutral-dark">{title}</h3>
          {icon}
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-bold text-primary">{value}</span>
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-medium",
              trendDirection === "up" ? "text-green-600" : "text-red-600"
            )}>
              {trendDirection === "up" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {trend}
            </div>
          )}
        </div>
        {description && (
          <div className="text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
