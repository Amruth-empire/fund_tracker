import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import UploadBox from "@/components/UploadBox";
import RiskBadge from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadInvoice = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOcrData(null);
    setRiskScore(null);
    
    // Simulate OCR extraction
    setTimeout(() => {
      setOcrData({
        invoiceNumber: "INV-2024-" + Math.floor(Math.random() * 1000),
        vendorName: "Sample Vendor Pvt. Ltd.",
        date: new Date().toISOString().split("T")[0],
        amount: "₹" + (Math.floor(Math.random() * 500000) + 50000).toLocaleString(),
        items: "Construction Materials, Labor Charges",
      });
      
      toast({
        title: "OCR Complete",
        description: "Invoice data extracted successfully",
      });
    }, 1500);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 100);
      setRiskScore(score);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Risk score: ${score}%`,
      });
    }, 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOcrData(null);
    setRiskScore(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <div className="flex-1">
        <Navbar isLoggedIn userRole="admin" />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-heading font-bold">
              Upload Invoice
            </h1>
            <p className="text-muted-foreground">
              Upload invoices for automatic OCR extraction and AI-powered fraud detection
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upload Section */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-heading font-semibold">
                  Upload Document
                </h3>
                <UploadBox
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleClear}
                />
              </Card>

              {selectedFile && (
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-heading font-semibold">
                    Preview
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Invoice preview would appear here
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedFile.name}
                    </p>
                  </div>
                </Card>
              )}
            </div>

            {/* OCR & Analysis Section */}
            <div className="space-y-6">
              {ocrData && (
                <Card className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-heading font-semibold">
                      Extracted Information
                    </h3>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Invoice Number</Label>
                      <Input value={ocrData.invoiceNumber} readOnly />
                    </div>
                    <div>
                      <Label>Vendor Name</Label>
                      <Input value={ocrData.vendorName} readOnly />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input value={ocrData.date} readOnly />
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input value={ocrData.amount} readOnly />
                    </div>
                    <div>
                      <Label>Items/Description</Label>
                      <Input value={ocrData.items} readOnly />
                    </div>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    className="mt-6 w-full"
                    disabled={isAnalyzing}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
                  </Button>
                </Card>
              )}

              {riskScore !== null && (
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-heading font-semibold">
                    AI Risk Assessment
                  </h3>

                  <div className="mb-6 text-center">
                    <div className="mb-2 text-5xl font-heading font-bold">
                      {riskScore}%
                    </div>
                    <RiskBadge score={riskScore} size="lg" />
                  </div>

                  <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-medium">Risk Factors Detected:</h4>
                    <ul className="space-y-2 text-sm">
                      {riskScore > 70 && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-danger">•</span>
                            <span>Duplicate invoice number found in database</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-danger">•</span>
                            <span>Amount exceeds project budget threshold</span>
                          </li>
                        </>
                      )}
                      {riskScore >= 40 && riskScore <= 70 && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-warning">•</span>
                            <span>Vendor not in approved list</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-warning">•</span>
                            <span>Invoice date inconsistency detected</span>
                          </li>
                        </>
                      )}
                      {riskScore < 40 && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-success">✓</span>
                            <span>All checks passed successfully</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-success">✓</span>
                            <span>Vendor verified and in good standing</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="default" className="flex-1">
                      Approve Invoice
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Flag for Review
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadInvoice;
