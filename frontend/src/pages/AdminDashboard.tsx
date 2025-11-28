import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  FolderOpen,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RiskBadge from "@/components/RiskBadge";

const AdminDashboard = () => {
  const monthlyData = [
    { month: "Jan", amount: 20 },
    { month: "Feb", amount: 35 },
    { month: "Mar", amount: 28 },
    { month: "Apr", amount: 45 },
    { month: "May", amount: 38 },
    { month: "Jun", amount: 52 },
  ];

  const riskData = [
    { name: "Low Risk", value: 65, color: "hsl(145, 70%, 45%)" },
    { name: "Medium Risk", value: 25, color: "hsl(35, 95%, 55%)" },
    { name: "High Risk", value: 10, color: "hsl(0, 84%, 60%)" },
  ];

  const recentInvoices = [
    {
      id: "INV-2401",
      vendor: "ABC Constructions",
      project: "Road Development",
      amount: "₹2,50,000",
      risk: 15,
      date: "2024-01-15",
    },
    {
      id: "INV-2402",
      vendor: "XYZ Suppliers",
      project: "School Building",
      amount: "₹1,75,000",
      risk: 65,
      date: "2024-01-14",
    },
    {
      id: "INV-2403",
      vendor: "Shree Materials",
      project: "Water Pipeline",
      amount: "₹3,20,000",
      risk: 42,
      date: "2024-01-13",
    },
  ];

  const alerts = [
    {
      type: "Duplicate Invoice",
      project: "School Building",
      severity: "high",
      time: "2 hours ago",
    },
    {
      type: "Overbilling Detected",
      project: "Road Development",
      severity: "medium",
      time: "5 hours ago",
    },
    {
      type: "Suspicious Vendor",
      project: "Water Pipeline",
      severity: "high",
      time: "1 day ago",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <div className="flex-1">
        <Navbar isLoggedIn userRole="admin" />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-heading font-bold">
              District Command Center
            </h1>
            <p className="text-muted-foreground">
              Real-time overview of fund utilization and project status
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Funds Sanctioned"
              value="₹2.4 Cr"
              icon={IndianRupee}
              variant="default"
            />
            <StatsCard
              title="Funds Utilized"
              value="₹1.8 Cr"
              icon={TrendingUp}
              trend="+12.5% this month"
              trendUp
              variant="success"
            />
            <StatsCard
              title="Remaining Funds"
              value="₹60 L"
              icon={CheckCircle}
              variant="default"
            />
            <StatsCard
              title="Active Projects"
              value="156"
              icon={FolderOpen}
              variant="default"
            />
            <StatsCard
              title="High-Risk Alerts"
              value="8"
              icon={AlertTriangle}
              trend="⚠️ Requires attention"
              variant="warning"
            />
          </div>

          {/* Charts */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-heading font-semibold">
                Monthly Fund Usage (₹ Lakhs)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(210, 100%, 42%)"
                    strokeWidth={3}
                    name="Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-heading font-semibold">
                Project Risk Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-heading font-semibold">
                Recent Invoices
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.vendor}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <RiskBadge score={invoice.risk} size="sm" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-heading font-semibold">
                High-Risk Alerts
              </h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-5 w-5 ${
                        alert.severity === "high"
                          ? "text-danger"
                          : "text-warning"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{alert.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.project}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
