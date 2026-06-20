"use client";
import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function XRayUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-2">
          Do you have recent dental X-rays?
        </h2>
        <p className="text-[#6B7280] text-[16px]">
          X-rays taken within the past 18 months help doctors give you a more
          precise quote.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center w-full py-16 border-2 border-dashed rounded-3xl cursor-pointer transition-all
          ${isDragging ? "border-[#113254] bg-[#F0F9FF]" : "border-[#E5E7EB] hover:border-[#113254] bg-white"}
          ${file ? "border-solid border-[#113254] bg-[#F8FAFC]" : ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg,.png,.dicom,image/*"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        {file ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="relative p-4 bg-white rounded-xl shadow-sm mb-4">
              <FileText className="w-10 h-10 text-[#113254]" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[#1A1A2E] font-bold">{file.name}</span>
            <span className="text-[#6B7280] text-sm">Click to change file</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload className="w-8 h-8 text-[#9CA3AF] mb-4" />
            <p className="text-[#1A1A2E] font-bold text-[18px]">
              Drop files here or Tab to upload
            </p>
            <p className="text-[#9CA3AF] text-[15px] mt-1">
              JPG, PNG, DICOM accepted
            </p>
          </div>
        )}
      </div>

      {/* Warning Banner from image_e09336.png */}
      <div className="mt-10 p-6 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl">
        <p className="text-[#1A1A2E] text-[15px] leading-relaxed font-medium">
          Without X-rays, your estimate range may be wider. Your doctors may
          also request them during your video consultation before confirming a
          final price.
        </p>
      </div>
    </div>
  );
}
