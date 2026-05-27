"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";

export function HeadshotUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  if (preview) {
    return (
      <div className="flex items-center gap-6 py-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
          <img src={preview} alt="Headshot" className="w-full h-full object-cover" />
        </div>
        <button 
          onClick={() => setPreview(null)}
          className="px-6 py-2 rounded-lg border border-[#0A3D62] text-[#0A3D62] font-bold hover:bg-gray-50 transition-all"
        >
          Re-Upload
        </button>
      </div>
    );
  }

  return (
    <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 transition-all hover:border-[#163E5C] hover:bg-white">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
        <UploadCloud className="h-6 w-6 text-[#163E5C]" />
      </div>
      <p className="text-sm font-semibold text-gray-900">Click to upload or drag and drop</p>
      <p className="mt-1 text-xs text-gray-400 font-medium">High-resolution JPG or PNG, minimal background</p>
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} />
    </div>
  );
}