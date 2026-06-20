"use client";

import { UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";

interface HeadshotUploadProps {
  onChange?: (file: File | null) => void;
  existingImageUrl?: string;
  disabled?: boolean;
}

export function HeadshotUpload({ onChange, existingImageUrl, disabled }: HeadshotUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (existingImageUrl) {
      setPreview("http://3.99.158.129:8004" + existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
      onChange?.(e.target.files[0]);
    }
  };

  if (preview) {
    return (
      <div className="flex items-center gap-6 py-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
          <img src={preview} alt="Headshot" className="w-full h-full object-cover" />
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChange?.(null);
            }}
            className="rounded-lg border border-primary px-6 py-2 font-semibold text-primary transition-all hover:bg-background"
          >
            Re-Upload
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-10 transition-all ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:bg-card"}`}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm transition-transform group-hover:scale-110">
        <UploadCloud className="h-6 w-6 text-primary" />
      </div>
      <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">High-resolution JPG or PNG, minimal background</p>
      <input type="file" disabled={disabled} className={`absolute inset-0 opacity-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`} onChange={handleFile} accept="image/*" />
    </div>
  );
}