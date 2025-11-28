import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onClear?: () => void;
}

const UploadBox = ({ onFileSelect, selectedFile, onClear }: UploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`relative cursor-pointer border-2 border-dashed p-12 transition-all hover:border-primary ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleFileChange}
      />

      {!selectedFile ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop your invoice here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default UploadBox;
