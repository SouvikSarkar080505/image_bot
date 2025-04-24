
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (image: File) => void;
  className?: string;
}

const ImageUpload = ({ onImageSelect, className }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass image to parent component
    onImageSelect(file);
  };

  const resetImage = () => {
    setPreview(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {!preview ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            dragActive 
              ? "border-indigo-400 bg-indigo-50" 
              : "border-gray-300 hover:border-gray-400"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              Drag and drop or click to upload image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG and GIF
            </p>
          </label>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-64 object-contain"
          />
          <Button
            onClick={resetImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
