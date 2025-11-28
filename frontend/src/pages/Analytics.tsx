import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FolderOpen,
  Users,
  FileText,
} from "lucide-react";

const Analytics = () => {
  const [fundUtilization, setFundUtilization] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    const animateValue = (
      setter: (value: number) => void,
      start: number,
      end: number,
      duration: number
    ) => {
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setter(Math.floor(start + (end - start) * easeOut));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    animateValue(setFundUtilization, 0, 68, 1500);
    animateValue(setActiveProjects, 0, 156, 1500);
    animateValue(setTotalInvoices, 0, 892, 1500);
    animateValue(setFlaggedItems, 0, 24, 1500);
  }, []);

  const topMetrics = [
    {
      title: "Fund Utilization",
      value: `${fundUtilization}%`,
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      change: "+12",
      trend: "up",
      icon: FolderOpen,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Invoices",
      value: totalInvoices,
      change: "+48",
      trend: "up",
      icon: FileText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Flagged Items",
      value: flaggedItems,
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const projectStats = [
    {
      name: "Road Development Phase 2",
      budget: "₹1.2 Cr",
      utilized: "₹0.95 Cr",
      percentage: 79,
      status: "On Track",
      invoices: 45,
    },
    {
      name: "School Building Project",
      budget: "₹85 Lakh",
      utilized: "₹72 Lakh",
      percentage: 85,
      status: "On Track",
      invoices: 38,
    },
    {
      name: "Water Pipeline Extension",
      budget: "₹65 Lakh",
      utilized: "₹48 Lakh",
      percentage: 74,
      status: "On Track",
      invoices: 29,
    },
    {
      name: "Community Center Construction",
      budget: "₹45 Lakh",
      utilized: "₹22 Lakh",
      percentage: 49,
      status: "Behind",
      invoices: 18,
    },
    {
      name: "Street Light Installation",
      budget: "₹28 Lakh",
      utilized: "₹26 Lakh",
      percentage: 93,
      status: "Near Complete",
      invoices: 22,
    },
  ];

  const monthlyData = [
    { month: "Jan", allocated: 42, utilized: 38 },
    { month: "Feb", allocated: 48, utilized: 45 },
    { month: "Mar", allocated: 52, utilized: 48 },
    { month: "Apr", allocated: 45, utilized: 42 },
    { month: "May", allocated: 58, utilized: 52 },
    { month: "Jun", allocated: 62, utilized: 58 },
  ];

  const fraudStats = [
    { category: "Duplicate Invoice", count: 8, amount: "₹12.4 L", trend: "down" },
    { category: "Overbilling", count: 6, amount: "₹8.9 L", trend: "up" },
    { category: "Suspicious Vendor", count: 5, amount: "₹6.2 L", trend: "down" },
    { category: "Material Mismatch", count: 3, amount: "₹4.1 L", trend: "down" },
    { category: "Invalid Amount", count: 2, amount: "₹2.8 L", trend: "stable" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <div className="flex-1">
        <Navbar isLoggedIn userRole="admin" />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-heading font-bold">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive insights into fund utilization and project performance
            </p>
          </div>

          {/* Top Metrics */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topMetrics.map((metric, index) => (
              <Card
                key={index}
                className="p-6 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="mt-2 text-3xl font-heading font-bold">
                      {metric.value}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-success" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          metric.trend === "up" ? "text-success" : "text-success"
                        }`}
                      >
                        {metric.change}
                      </span>
                      <span className="text-sm text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Monthly Trend Chart */}
          <Card className="mb-8 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-semibold">
                  Monthly Fund Allocation vs Utilization
                </h3>
                <p className="text-sm text-muted-foreground">Last 6 months trend</p>
              </div>
              <Badge variant="outline">₹2.4 Crore Total</Badge>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      ₹{data.utilized}L / ₹{data.allocated}L
                    </span>
                  </div>
                  <div className="relative h-8 overflow-hidden rounded-lg bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/20"
                      style={{ width: `${(data.allocated / 70) * 100}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 bg-primary"
                      style={{ width: `${(data.utilized / 70) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                      <span className="text-primary-foreground">
                        {Math.round((data.utilized / data.allocated) * 100)}% Utilized
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Project Performance */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-heading font-semibold">
                  Top Projects by Budget
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fund utilization breakdown
                </p>
              </div>
              <div className="space-y-4">
                {projectStats.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.utilized} of {project.budget}
                        </p>
                      </div>
                      <Badge
                        variant={
                          project.status === "On Track"
                            ? "secondary"
                            : project.status === "Near Complete"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          project.percentage >= 90
                            ? "bg-success"
                            : project.percentage >= 70
                            ? "bg-primary"
                            : project.percentage >= 50
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                        style={{ width: `${project.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.percentage}% Completed</span>
                      <span>{project.invoices} Invoices</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fraud Detection Stats */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-heading font-semibold">
                  Fraud Detection Summary
                </h3>
                <p className="text-sm text-muted-foreground">
                  Suspicious activities by category
                </p>
              </div>
              <div className="space-y-4">
                {fraudStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-danger/10 p-2">
                        <AlertTriangle className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <p className="font-medium">{stat.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.count} cases detected
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{stat.amount}</p>
                      <div className="flex items-center gap-1">
                        {stat.trend === "down" ? (
                          <TrendingDown className="h-3 w-3 text-success" />
                        ) : stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-danger" />
                        ) : (
                          <div className="h-3 w-3" />
                        )}
                        <span
                          className={`text-xs ${
                            stat.trend === "down"
                              ? "text-success"
                              : stat.trend === "up"
                              ? "text-danger"
                              : "text-muted-foreground"
                          }`}
                        >
                          {stat.trend === "down" ? "Decreasing" : stat.trend === "up" ? "Increasing" : "Stable"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-success/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium text-success">AI Detection Accuracy</p>
                    <p className="text-sm text-muted-foreground">98.5% accuracy rate</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                  <p className="text-2xl font-heading font-bold">2.4 days</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                15% faster than last quarter
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-3">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Contractors</p>
                  <p className="text-2xl font-heading font-bold">47</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Across all active projects
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                  <p className="text-2xl font-heading font-bold">94.8%</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Meeting regulatory standards
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
