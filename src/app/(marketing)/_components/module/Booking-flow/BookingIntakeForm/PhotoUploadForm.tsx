"use client";
import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import GuidelinesModal from "./GuidelinesModal";
import {
  setFrontSmileFile,
  setWideSmileFile,
  setUpperArchFile,
  setLowerArchFile,
  setLeftSideFile,
  setRightSideFile,
  getFrontSmileFile,
  getWideSmileFile,
  getUpperArchFile,
  getLowerArchFile,
  getLeftSideFile,
  getRightSideFile,
} from "@/lib/storage/bookingService";

interface PhotoSlot {
  file: File | null;
  preview: string | null;
}

const REQUIRED_LABELS = [
  "Front smile — mouth wide open",
  "Wide smile — mouth wide open",
  "Lower arch — mouth wide open",
];

const RECOMMENDED_LABELS = [
  "Upper arch — mouth wide open",
  "Left side",
  "Right side",
];

function makeSlots(count: number): PhotoSlot[] {
  return Array.from({ length: count }, () => ({ file: null, preview: null }));
}

export default function PhotoUploadForm() {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [requiredSlots, setRequiredSlots] = useState<PhotoSlot[]>(() => {
    const front = getFrontSmileFile();
    const wide = getWideSmileFile();
    const lower = getLowerArchFile();
    return [
      { file: front, preview: front ? URL.createObjectURL(front) : null },
      { file: wide, preview: wide ? URL.createObjectURL(wide) : null },
      { file: lower, preview: lower ? URL.createObjectURL(lower) : null },
    ];
  });
  const [recommendedSlots, setRecommendedSlots] = useState<PhotoSlot[]>(() => {
    const upper = getUpperArchFile();
    const left = getLeftSideFile();
    const right = getRightSideFile();
    return [
      { file: upper, preview: upper ? URL.createObjectURL(upper) : null },
      { file: left, preview: left ? URL.createObjectURL(left) : null },
      { file: right, preview: right ? URL.createObjectURL(right) : null },
    ];
  });

  const setSlot = (
    setter: React.Dispatch<React.SetStateAction<PhotoSlot[]>>,
    index: number,
    file: File | null,
  ) => {
    setter((prev) => {
      const next = [...prev];
      if (prev[index].preview) {
        URL.revokeObjectURL(prev[index].preview!);
      }
      next[index] = {
        file,
        preview: file ? URL.createObjectURL(file) : null,
      };
      return next;
    });
  };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        Upload your dental photos
      </h2>

      {/* Tip banner */}
      <div className="flex items-start justify-between gap-4 p-5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl mb-8">
        <div>
          <p className="font-bold text-[#1A1A2E] text-[15px] mb-1">
            Tip for best results
          </p>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            Stand near a window in natural light. Use your phone&apos;s front
            camera. Avoid flash — it washes out detail doctors need for an
            accurate estimate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuidelines(true)}
          className="shrink-0 px-4 py-2.5 border border-[#113254] text-[#113254] font-semibold text-[13px] rounded-xl hover:bg-[#113254] hover:text-white transition-all whitespace-nowrap"
        >
          View Guidelines
        </button>
      </div>

      {/* Required photos */}
      <div className="mb-8">
        <p className="text-[14px] font-semibold text-[#4B5563] mb-4">
          Required photos <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REQUIRED_LABELS.map((label, i) => (
            <UploadCard
              key={i}
              label={label}
              slot={requiredSlots[i]}
              onFile={(file) => {
                setSlot(setRequiredSlots, i, file);
                if (i === 0) setFrontSmileFile(file);
                else if (i === 1) setWideSmileFile(file);
                else if (i === 2) setLowerArchFile(file);
              }}
            />
          ))}
        </div>
      </div>

      {/* Recommended photos */}
      <div>
        <p className="text-[14px] font-semibold text-[#4B5563] mb-4">
          Optional photos{" "}
          <span className="text-[#9CA3AF] font-normal">
            (recommended – improves estimate accuracy)
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECOMMENDED_LABELS.map((label, i) => (
            <UploadCard
              key={i}
              label={label}
              slot={recommendedSlots[i]}
              onFile={(file) => {
                setSlot(setRecommendedSlots, i, file);
                if (i === 0) setUpperArchFile(file);
                else if (i === 1) setLeftSideFile(file);
                else if (i === 2) setRightSideFile(file);
              }}
            />
          ))}
        </div>
      </div>

      <GuidelinesModal
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />
    </div>
  );
}

// ─── UploadCard ───────────────────────────────────────────────────────────────

interface UploadCardProps {
  label: string;
  slot: PhotoSlot;
  onFile: (file: File | null) => void;
}

function UploadCard({ label, slot, onFile }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="relative min-h-40 rounded-xl overflow-hidden border-2 border-dashed border-[#E5E7EB] hover:border-[#113254] transition-colors cursor-pointer group">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {slot.preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slot.preview}
            alt={label}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            aria-label={`Remove ${label}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-40 p-6 text-center"
        >
          <Upload className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#113254] transition-colors" />
          <span className="text-[13px] font-semibold text-[#1A1A2E] leading-snug">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
