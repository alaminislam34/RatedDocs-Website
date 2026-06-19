"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, FileText, AlertCircle, Trash } from "lucide-react";

interface Props {
  label: string;
  name: string;
  error?: string;
}

export function DocumentUpload({ label, name, error }: Props) {
  const { setValue, watch } = useFormContext();
  const file = watch(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(name, selectedFile, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setValue(name, null, { shouldValidate: true });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#0A2533] inline-block">{label}</label>

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex transition-all cursor-pointer group ${
            error
              ? "border-red-200 bg-red-50/30"
              : "border-gray-200 bg-gray-50/50 hover:bg-white"
          }`}
        >
          <div className="flex gap-3">
            <UploadCloud
              className={`h-5 w-5 ${error ? "text-red-400" : "text-gray-400 group-hover:text-[#163E5C]"}`}
            />
            <span
              className={`text-sm font-semibold ${error ? "text-red-500" : "text-gray-600"}`}
            >
              Click to upload or drag and drop
            </span>
          </div>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm animate-in fade-in slide-in-from-bottom-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="text-orange-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0A2533] truncate max-w-37.5 md:max-w-75">
                {file.name}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-gray-400 hover:text-red-500 p-2 transition-colors hover:bg-red-50 rounded-lg"
          >
            <Trash size={18} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-bold flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
