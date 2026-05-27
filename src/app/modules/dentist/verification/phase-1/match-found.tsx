"use client";

import { useState, useRef } from "react";
import { UploadCloud, Check, Trash2, FileText, Loader2, X, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MatchProps {
  status: "match" | "no-match";
  doctorName?: string;
  specialty?: string;
  onConfirm?: () => void;
  onReject?: () => void;
  onFileSelect?: (file: File) => void;
}

export function VerificationResult({
  status,
  doctorName,
  specialty,
  onConfirm,
  onReject,
  onFileSelect,
}: MatchProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
      // Optional: Simulate a brief upload state
      setIsUploading(true);
      setTimeout(() => setIsUploading(false), 800);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- MATCH FOUND STATE ---
  if (status === "match") {
    return (
      <div className="mt-6 p-6 rounded-2xl bg-[#56A87F07] border border-[#E0EFED]">
        <div className="flex items-center gap-4 mb-4">
          <p className="text-[#1A1A2E] font-semibold text-sm">Match Found</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="relative h-16 w-16 shrink-0 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src="/doctor-placeholder.png"
                alt="Doctor"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <p className="text-[#1A1A2E] font-semibold text-sm">
                {doctorName}
              </p>
              <p className="text-[#1A1A2E] text-xs font-medium">{specialty}</p>
            </div>
          </div>
          <div>
            <button
              onClick={onConfirm}
              className="flex-1 text-[#414651] md:flex-none rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              <X size={25} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MATCH NOT FOUND / UPLOAD STATE ---
  return (
    <>
      {!selectedFile ? (
        <div className="mt-6 p-6 rounded-2xl bg-[#FFF5F5] space-y-4 border border-[#FEE2E2]">
          <h4 className="text-lg font-bold text-[#0A2533]">Match not Found</h4>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-gray-200 bg-white rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#0A3D62] hover:bg-slate-50/50 transition-all"
          >
            <div className="mb-3 p-3 rounded-full bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
              <UploadCloud className="text-[#0A3D62] h-6 w-6" />
            </div>
            <p className="font-bold text-[#0A2533]">
              Upload Registration Certificate
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, PNG or JPG (Max 5MB)
            </p>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 mt-6 border border-slate-200 rounded-xl bg-white animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
              {isUploading ? (
                <Loader2 className="text-orange-500 w-6 h-6 animate-spin" />
              ) : (
                <FileText className="text-orange-500 w-6 h-6" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-slate-800 font-bold text-sm truncate max-w-50 md:max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-slate-400 text-xs font-medium">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-lg"
          >
            <Trash size={20} />
          </button>
        </div>
      )}
    </>
  );
}
