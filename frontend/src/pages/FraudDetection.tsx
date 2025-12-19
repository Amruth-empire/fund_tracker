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
  fraud_category: string | null;
  amount_mismatch_percentage: number | null;
  file_path: string;
  created_at: string;
}

const FraudDetection = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]); // Store all invoices for counting
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fraudCategories = [
    { label: "All Suspicious", value: "all", count: allInvoices.length },
    { label: "Duplicate Invoice", value: "duplicate", count: allInvoices.filter(i => i.fraud_category === "duplicate").length },
    { label: "Overbilling", value: "overbilling", count: allInvoices.filter(i => i.fraud_category === "overbilling").length },
    { label: "Suspicious Vendor", value: "vendor", count: allInvoices.filter(i => i.fraud_category === "vendor_mismatch").length },
    { label: "Invalid Amount", value: "amount", count: allInvoices.filter(i => i.fraud_category === "amount_mismatch").length },
    { label: "Invoice Mismatch", value: "invoice", count: allInvoices.filter(i => i.fraud_category === "invoice_mismatch").length },
  ];

  // Fetch all invoices for counts on mount
  useEffect(() => {
    fetchAllInvoices();
  }, []);

  // Fetch filtered invoices when filter changes
  useEffect(() => {
    fetchInvoices();
  }, [selectedFilter]);

  const fetchAllInvoices = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/fraud/high-risk?min_risk=40", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching all invoices:", error);
    }
  };

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
        // Also update allInvoices when fetching "all" to keep counts fresh
        if (selectedFilter === "all") {
          setAllInvoices(data);
        }
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
        fetchAllInvoices(); // Refresh counts
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to flag invoice",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string | null, score: number) => {
    if (!category) {
      // Fallback to score-based categorization
      if (score >= 80) return "High Risk";
      if (score >= 50) return "Medium Risk";
      return "Low Risk";
    }
    
    const categoryLabels: { [key: string]: string } = {
      duplicate: "Duplicate Invoice",
      overbilling: "Overbilling",
      vendor_mismatch: "Suspicious Vendor",
      amount_mismatch: "Amount Mismatch",
      invoice_mismatch: "Invoice Mismatch",
    };
    
    return categoryLabels[category] || "Unknown";
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
                        <Badge variant="outline">
                          {getCategoryLabel(invoice.fraud_category, invoice.risk_score)}
                          {invoice.amount_mismatch_percentage !== null && invoice.amount_mismatch_percentage > 0 && (
                            <span className="ml-1 text-xs">
                              ({invoice.amount_mismatch_percentage.toFixed(1)}% off)
                            </span>
                          )}
                        </Badge>
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
                      <Label className="text-sm text-muted-foreground">Fraud Category</Label>
                      <div className="mt-1">
                        <Badge variant="outline">
                          {getCategoryLabel(selectedInvoice.fraud_category, selectedInvoice.risk_score)}
                        </Badge>
                        {selectedInvoice.amount_mismatch_percentage !== null && selectedInvoice.amount_mismatch_percentage > 0 && (
                          <p className="mt-2 text-sm text-danger">
                            Amount Mismatch: {selectedInvoice.amount_mismatch_percentage.toFixed(2)}%
                          </p>
                        )}
                      </div>
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
