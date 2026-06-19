"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchProps {
  status: "match" | "no-match";
  doctorName?: string;
  specialty?: string;
  licenceInfo?: {
    country: string;
    city: string;
    authority: number;
    regNo: string;
  } | null;
  onConfirm?: () => void;
  onReject?: () => void;
  onFileSelect?: (file: File) => void;
  existingFileUrl?: string;
}

export function VerificationResult({
  status,
  doctorName,
  specialty,
  licenceInfo,
  onConfirm,
  onReject,
  onFileSelect,
  existingFileUrl,
}: MatchProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
      setIsUploading(true);
      setTimeout(() => setIsUploading(false), 800);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileNameFromUrl = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  if (status === "match") {
    return (
      <div className="mt-6 rounded-xl border border-success-100 bg-success-50/70 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-foreground">Match Found</p>
        </div>
        {licenceInfo && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Country", licenceInfo.country],
              ["City", licenceInfo.city],
              ["Authority", licenceInfo.authority],
              ["Reg No", licenceInfo.regNo],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-success-100 bg-card p-3">
                <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-success-100 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/doctor-placeholder.png" alt="Doctor" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground">{doctorName}</p>
              <p className="text-xs font-medium text-muted-foreground">{specialty}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="default" className="h-10 rounded-xl px-4 font-semibold" onClick={onConfirm}>
              Yes this is me
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-xl px-4 font-semibold" onClick={onReject}>
              Not me
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasExistingFile = !!existingFileUrl && !selectedFile;

  return (
    <>
      {!selectedFile && !existingFileUrl ? (
        <div className="mt-6 space-y-4 rounded-xl border border-destructive-100 bg-destructive-50/70 p-5 sm:p-6">
          <h4 className="text-lg font-semibold text-foreground">Match not Found</h4>
          <p className="text-sm text-muted-foreground">
            Upload your registration certificate manually to continue verification.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-8 transition-all hover:border-primary hover:bg-background sm:p-10"
          >
            <div className="mb-3 rounded-full bg-background p-3 shadow-sm transition-all group-hover:scale-110 group-hover:bg-card">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-foreground">
              Upload Registration Certificate
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
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
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning-50">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-warning-600" />
              ) : (
                <FileText className="h-6 w-6 text-warning-600" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="max-w-50 truncate text-sm font-semibold text-foreground md:max-w-xs">
                {selectedFile ? selectedFile.name : getFileNameFromUrl(existingFileUrl || "")}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {selectedFile
                  ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Uploaded Document"}
              </p>
            </div>
          </div>

          {!hasExistingFile && (
            <button
              type="button"
              onClick={removeFile}
              className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-destructive-50 hover:text-destructive-600"
            >
              <Trash size={20} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
