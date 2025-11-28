import { Badge } from "@/components/ui/badge";

interface RiskBadgeProps {
  score: number;
  size?: "sm" | "default" | "lg";
}

const RiskBadge = ({ score, size = "default" }: RiskBadgeProps) => {
  const getRiskLevel = (score: number) => {
    if (score >= 75) return { label: "High Risk", variant: "danger" };
    if (score >= 40) return { label: "Medium Risk", variant: "warning" };
    return { label: "Low Risk", variant: "success" };
  };

  const risk = getRiskLevel(score);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const variantClasses = {
    success: "bg-success-light text-success border-success/20",
    warning: "bg-warning-light text-warning border-warning/20",
    danger: "bg-danger-light text-danger border-danger/20",
  };

  return (
    <Badge
      className={`${sizeClasses[size]} ${
        variantClasses[risk.variant as keyof typeof variantClasses]
      } border font-medium`}
    >
      {risk.label} ({score}%)
    </Badge>
  );
};

export default RiskBadge;
