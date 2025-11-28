import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import RiskBadge from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Upload,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

const ContractorPortal = () => {
  const recentInvoices = [
    {
      id: "INV-2401",
      project: "Road Development Phase 2",
      amount: "₹2,50,000",
      status: "approved",
      date: "2024-01-15",
      risk: 18,
    },
    {
      id: "INV-2398",
      project: "School Building",
      amount: "₹1,75,000",
      status: "pending",
      date: "2024-01-14",
      risk: 25,
    },
    {
      id: "INV-2395",
      project: "Water Pipeline",
      amount: "₹3,20,000",
      status: "rejected",
      date: "2024-01-12",
      risk: 85,
    },
    {
      id: "INV-2390",
      project: "Community Center",
      amount: "₹1,95,000",
      status: "flagged",
      date: "2024-01-10",
      risk: 72,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2 py-1 text-xs font-medium text-success">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-light px-2 py-1 text-xs font-medium text-warning">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-light px-2 py-1 text-xs font-medium text-danger">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case "flagged":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-light px-2 py-1 text-xs font-medium text-danger">
            <AlertTriangle className="h-3 w-3" />
            Flagged
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn userRole="contractor" />

      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-heading font-bold">
            Contractor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your invoices and track approval status
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Bills Submitted"
            value="45"
            icon={FileText}
            variant="default"
          />
          <StatsCard
            title="Approved Bills"
            value="32"
            icon={CheckCircle}
            trend="+8 this month"
            trendUp
            variant="success"
          />
          <StatsCard
            title="Pending Bills"
            value="8"
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Rejected Bills"
            value="3"
            icon={XCircle}
            variant="danger"
          />
          <StatsCard
            title="Flagged Bills"
            value="2"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Credibility Score */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 text-lg font-heading font-semibold">
                Contractor Credibility Score
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on invoice history, compliance, and project performance
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center gap-2">
                <Award className="h-8 w-8 text-success" />
                <span className="text-5xl font-heading font-bold text-success">
                  8.5
                </span>
                <span className="text-2xl text-muted-foreground">/10</span>
              </div>
              <p className="text-sm font-medium text-success">Excellent Standing</p>
            </div>
          </div>
        </Card>

        {/* Upload Button */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-heading font-semibold">
                Submit New Invoice
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload your invoice for AI-powered verification
              </p>
            </div>
            <Button asChild size="lg" className="shadow-primary">
              <Link to="/upload-invoice">
                <Upload className="mr-2 h-4 w-4" />
                Upload Invoice
              </Link>
            </Button>
          </div>
        </Card>

        {/* Recent Invoices Table */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-heading font-semibold">
            Recent Invoices
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.project}</TableCell>
                  <TableCell className="font-medium">{invoice.amount}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <RiskBadge score={invoice.risk} size="sm" />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.date}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default ContractorPortal;
