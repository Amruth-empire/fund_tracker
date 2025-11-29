import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RiskBadge from "@/components/RiskBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Filter, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Invoice {
  id: number;
  invoice_number: string;
  vendor_name: string;
  project_id: number;
  amount: number;
  risk_score: number;
  risk_level: string;
  file_path: string;
  created_at: string;
}

const FraudDetection = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fraudCategories = [
    { label: "All Suspicious", value: "all", count: 24 },
    { label: "Duplicate Invoice", value: "duplicate", count: 8 },
    { label: "Overbilling", value: "overbilling", count: 6 },
    { label: "Suspicious Vendor", value: "vendor", count: 5 },
    { label: "Invalid Amount", value: "amount", count: 3 },
    { label: "Material Mismatch", value: "material", count: 2 },
  ];

  const suspiciousInvoices = [
    {
      id: "INV-2398",
      vendor: "Fake Constructions Ltd",
      project: "Road Development Phase 2",
      riskScore: 92,
      amount: "₹4,50,000",
      date: "2024-01-10",
      category: "Duplicate Invoice",
      status: "Under Review",
    },
    {
      id: "INV-2401",
      vendor: "ABC Suppliers",
      project: "School Building",
      riskScore: 78,
      amount: "₹3,20,000",
      date: "2024-01-12",
      category: "Overbilling",
      status: "Flagged",
    },
    {
      id: "INV-2389",
      vendor: "XYZ Materials",
      project: "Water Pipeline",
      riskScore: 85,
      amount: "₹2,75,000",
      date: "2024-01-08",
      category: "Suspicious Vendor",
      status: "Investigation",
    },
    {
      id: "INV-2376",
      vendor: "Quick Build Co",
      project: "Community Center",
      riskScore: 71,
      amount: "₹1,95,000",
      date: "2024-01-05",
      category: "Material Mismatch",
      status: "Pending Action",
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
              Fraud Detection Dashboard
            </h1>
            <p className="text-muted-foreground">
              AI-powered analysis identifies suspicious patterns and anomalies
            </p>
          </div>

          {/* Filter Categories */}
          <Card className="mb-6 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-heading font-semibold">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {fraudCategories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedFilter === category.value ? "default" : "outline"}
                  onClick={() => setSelectedFilter(category.value)}
                  className="gap-2"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </Card>

          {/* Fraud Cards Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suspiciousInvoices.slice(0, 3).map((invoice) => (
              <Card key={invoice.id} className="p-6 hover-lift">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice ID</p>
                    <p className="font-heading font-semibold">{invoice.id}</p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-danger" />
                </div>

                <div className="mb-4 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Vendor</p>
                    <p className="text-sm font-medium">{invoice.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project</p>
                    <p className="text-sm">{invoice.project}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-heading font-bold">{invoice.amount}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <RiskBadge score={invoice.riskScore} />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Flag
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Table */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-heading font-semibold">
              All Suspicious Invoices
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suspiciousInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.vendor}</TableCell>
                    <TableCell>{invoice.project}</TableCell>
                    <TableCell>
                      <RiskBadge score={invoice.riskScore} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.amount}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default FraudDetection;
