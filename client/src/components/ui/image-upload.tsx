import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Image, Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, placeholder = "Upload image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For now, use a simple URL input approach
      // In a real implementation, this would upload to cloud storage
      const url = URL.createObjectURL(file);
      onChange(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button type="button" variant="outline" disabled={isUploading}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        {value && (
          <Button type="button" variant="outline" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {value && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => {
              // Handle broken image
              console.error("Failed to load image:", value);
            }}
          />
        </div>
      )}
    </div>
  );
}