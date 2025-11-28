import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  variant = "default",
}: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card text-card-foreground",
    success: "bg-success-light text-success-foreground",
    warning: "bg-warning-light text-warning-foreground",
    danger: "bg-danger-light text-danger-foreground",
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-secondary",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <Card className={`p-6 hover-lift ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-heading font-bold">{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trendUp ? "text-success" : "text-danger"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={`rounded-xl bg-background/50 p-3 ${iconStyles[variant]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
