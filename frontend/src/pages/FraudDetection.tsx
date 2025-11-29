import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RiskBadge from "@/components/RiskBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    { label: "All Suspicious", value: "all", count: invoices.length },
    { label: "Duplicate Invoice", value: "duplicate", count: invoices.filter(i => i.risk_score >= 80).length },
    { label: "Overbilling", value: "overbilling", count: invoices.filter(i => i.risk_score >= 70 && i.risk_score < 80).length },
    { label: "Suspicious Vendor", value: "vendor", count: invoices.filter(i => i.risk_score >= 60 && i.risk_score < 70).length },
    { label: "Invalid Amount", value: "amount", count: invoices.filter(i => i.risk_score >= 50 && i.risk_score < 60).length },
    { label: "Material Mismatch", value: "material", count: invoices.filter(i => i.risk_score >= 40 && i.risk_score < 50).length },
  ];

  // Fetch invoices from backend
  useEffect(() => {
    fetchInvoices();
  }, [selectedFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const url = selectedFilter === "all" 
        ? "http://localhost:8000/fraud/high-risk?min_risk=40"
        : `http://localhost:8000/fraud/filter?category=${selectedFilter}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleFlagInvoice = async (invoiceId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/fraud/flag/${invoiceId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Invoice Flagged",
          description: "Invoice has been flagged for manual review",
          variant: "destructive",
        });
        fetchInvoices(); // Refresh the list
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag invoice",
        variant: "destructive",
      });
    }
  };

  const getCategoryByScore = (score: number) => {
    if (score >= 80) return "Duplicate Invoice";
    if (score >= 70) return "Overbilling";
    if (score >= 60) return "Suspicious Vendor";
    if (score >= 50) return "Invalid Amount";
    return "Material Mismatch";
  };

  const getStatusByScore = (score: number) => {
    if (score >= 80) return "Critical";
    if (score >= 70) return "High Priority";
    if (score >= 50) return "Under Review";
    return "Flagged";
  };

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
          {loading ? (
            <div className="mb-8 flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {invoices.slice(0, 3).map((invoice) => (
                <Card key={invoice.id} className="p-6 hover-lift">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Invoice ID</p>
                      <p className="font-heading font-semibold">{invoice.invoice_number}</p>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-danger" />
                  </div>

                  <div className="mb-4 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendor</p>
                      <p className="text-sm font-medium">{invoice.vendor_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Project</p>
                      <p className="text-sm">Project #{invoice.project_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-lg font-heading font-bold">₹{invoice.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <RiskBadge score={invoice.risk_score} />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleFlagInvoice(invoice.id)}
                    >
                      Flag
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Detailed Table */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-heading font-semibold">
              All Suspicious Invoices
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No suspicious invoices found
              </div>
            ) : (
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
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.vendor_name}</TableCell>
                      <TableCell>Project #{invoice.project_id}</TableCell>
                      <TableCell>
                        <RiskBadge score={invoice.risk_score} size="sm" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryByScore(invoice.risk_score)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getStatusByScore(invoice.risk_score)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleFlagInvoice(invoice.id)}
                          >
                            Flag
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* View Invoice Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the selected invoice
                </DialogDescription>
              </DialogHeader>
              {selectedInvoice && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Invoice Number</Label>
                      <p className="font-semibold">{selectedInvoice.invoice_number}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Vendor</Label>
                      <p className="font-semibold">{selectedInvoice.vendor_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Amount</Label>
                      <p className="text-lg font-bold">₹{selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Risk Score</Label>
                      <div className="mt-1">
                        <RiskBadge score={selectedInvoice.risk_score} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Project ID</Label>
                      <p>Project #{selectedInvoice.project_id}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Date</Label>
                      <p>{new Date(selectedInvoice.created_at).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">Category</Label>
                      <Badge variant="outline" className="mt-1">
                        {getCategoryByScore(selectedInvoice.risk_score)}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">File Path</Label>
                      <p className="text-xs text-muted-foreground">{selectedInvoice.file_path}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => setViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => {
                        handleFlagInvoice(selectedInvoice.id);
                        setViewDialogOpen(false);
                      }}
                    >
                      Flag Invoice
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default FraudDetection;
