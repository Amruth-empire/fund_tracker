import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import UploadBox from "@/components/UploadBox";
import RiskBadge from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, CheckCircle, AlertTriangle, X, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  invoice_number_match: boolean;
  vendor_match: boolean;
  amount_match: boolean;
}

interface OCRFields {
  invoice_number_ocr: string;
  vendor_name_ocr: string;
  amount_ocr: string;
}

const UploadInvoice = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form inputs
  const [projectId, setProjectId] = useState("1");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [amount, setAmount] = useState("");
  
  // Results
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [ocrFields, setOcrFields] = useState<OCRFields | null>(null);
  const [ocrTable, setOcrTable] = useState<string[][] | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [fraudScore, setFraudScore] = useState<number | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setVerificationResult(null);
    setOcrFields(null);
    setOcrTable(null);
    setRiskScore(null);
    setRiskLevel(null);
    setFraudScore(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !invoiceNumber || !vendorName || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("project_id", projectId);
      formData.append("invoice_number", invoiceNumber);
      formData.append("vendor_name", vendorName);
      formData.append("amount", amount);

      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/invoices/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      setVerificationResult(result.verification);
      setOcrFields(result.ocr_fields);
      setOcrTable(result.ocr_table);
      setRiskScore(result.ai_risk.score);
      setRiskLevel(result.ai_risk.level);
      setFraudScore(result.ai_risk.fraud_score);

      toast({
        title: "Invoice Uploaded Successfully",
        description: `Risk Level: ${result.ai_risk.level.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload invoice",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setVerificationResult(null);
    setOcrFields(null);
    setOcrTable(null);
    setRiskScore(null);
    setRiskLevel(null);
    setFraudScore(null);
    setInvoiceNumber("");
    setVendorName("");
    setAmount("");
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
                  Invoice Details
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <Label>Project</Label>
                    <Select value={projectId} onValueChange={setProjectId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Road Development Phase 2</SelectItem>
                        <SelectItem value="2">School Building</SelectItem>
                        <SelectItem value="3">Water Pipeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="INV-2024-001"
                    />
                  </div>
                  
                  <div>
                    <Label>Vendor Name</Label>
                    <Input
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="ABC Constructions Ltd"
                    />
                  </div>
                  
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <h3 className="mb-4 text-lg font-heading font-semibold">
                  Upload Document
                </h3>
                <UploadBox
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onClear={handleClear}
                />
                
                <Button
                  onClick={handleUpload}
                  className="mt-6 w-full"
                  disabled={isUploading || !selectedFile}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
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
              {verificationResult && ocrFields && (
                <Card className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-heading font-semibold">
                      OCR Verification Results
                    </h3>
                    {verificationResult.invoice_number_match && 
                     verificationResult.vendor_match && 
                     verificationResult.amount_match ? (
                      <Badge variant="default" className="bg-success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Discrepancies Found
                      </Badge>
                    )}
                  </div>

                  {(!verificationResult.invoice_number_match || 
                    !verificationResult.vendor_match || 
                    !verificationResult.amount_match) && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Some fields don't match OCR extraction - Fraud Score: {fraudScore}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {/* Invoice Number Comparison */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-semibold">Invoice Number</Label>
                        {verificationResult.invoice_number_match ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-danger" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Your Input</p>
                          <Input value={invoiceNumber} readOnly className="h-8 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">OCR Extracted</p>
                          <Input 
                            value={ocrFields.invoice_number_ocr || "Not found"} 
                            readOnly 
                            className={`h-8 text-sm ${!verificationResult.invoice_number_match ? 'border-danger bg-danger/5' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vendor Name Comparison */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-semibold">Vendor Name</Label>
                        {verificationResult.vendor_match ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-danger" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Your Input</p>
                          <Input value={vendorName} readOnly className="h-8 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">OCR Extracted</p>
                          <Input 
                            value={ocrFields.vendor_name_ocr || "Not found"} 
                            readOnly 
                            className={`h-8 text-sm ${!verificationResult.vendor_match ? 'border-danger bg-danger/5' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amount Comparison */}
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Label className="text-sm font-semibold">Amount</Label>
                        {verificationResult.amount_match ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <X className="h-4 w-4 text-danger" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Your Input</p>
                          <Input value={`₹${amount}`} readOnly className="h-8 text-sm" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">OCR Extracted</p>
                          <Input 
                            value={ocrFields.amount_ocr ? `₹${ocrFields.amount_ocr}` : "Not found"} 
                            readOnly 
                            className={`h-8 text-sm ${!verificationResult.amount_match ? 'border-danger bg-danger/5' : ''}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* OCR Table Extraction */}
              {ocrTable && ocrTable.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-heading font-semibold">
                    Extracted Invoice Items
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          {ocrTable[0].map((header, idx) => (
                            <th key={idx} className="p-3 text-left text-sm font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ocrTable.slice(1).map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b hover:bg-muted/20">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="p-3 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {ocrTable.length === 1 && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      No line items detected in the invoice
                    </p>
                  )}
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
                    <h4 className="font-medium">Analysis Summary:</h4>
                    <ul className="space-y-2 text-sm">
                      {fraudScore !== null && fraudScore > 0 && (
                        <li className="flex items-start gap-2">
                          <span className="text-danger">•</span>
                          <span>OCR Fraud Score: {fraudScore} - Manual review required</span>
                        </li>
                      )}
                      {verificationResult && !verificationResult.invoice_number_match && (
                        <li className="flex items-start gap-2">
                          <span className="text-danger">•</span>
                          <span>Invoice number mismatch detected</span>
                        </li>
                      )}
                      {verificationResult && !verificationResult.vendor_match && (
                        <li className="flex items-start gap-2">
                          <span className="text-danger">•</span>
                          <span>Vendor name doesn't match OCR extraction</span>
                        </li>
                      )}
                      {verificationResult && !verificationResult.amount_match && (
                        <li className="flex items-start gap-2">
                          <span className="text-danger">•</span>
                          <span>Amount discrepancy found</span>
                        </li>
                      )}
                      {riskScore > 70 && (
                        <li className="flex items-start gap-2">
                          <span className="text-danger">•</span>
                          <span>High risk detected - immediate attention needed</span>
                        </li>
                      )}
                      {riskScore >= 40 && riskScore <= 70 && (
                        <li className="flex items-start gap-2">
                          <span className="text-warning">•</span>
                          <span>Medium risk - additional verification recommended</span>
                        </li>
                      )}
                      {riskScore < 40 && verificationResult && 
                       verificationResult.invoice_number_match && 
                       verificationResult.vendor_match && 
                       verificationResult.amount_match && (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-success">✓</span>
                            <span>Low risk - invoice appears legitimate</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-success">✓</span>
                            <span>All fields verified with OCR</span>
                          </li>
                        </>
                      )}
                      {ocrTable && ocrTable.length > 1 && (
                        <li className="flex items-start gap-2">
                          <span className="text-success">✓</span>
                          <span>{ocrTable.length - 1} line items extracted from invoice</span>
                        </li>
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
