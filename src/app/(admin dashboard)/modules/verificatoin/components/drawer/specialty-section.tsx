"use client";

import { memo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { VerificationDentist } from "../../types";
import { FileRow, MissingFileRow } from "./file-row";

interface SpecialtySectionProps {
  specialty: NonNullable<
    NonNullable<VerificationDentist["ph3_data"]>["specialties"]
  >[number];
}

function SpecialtySectionComponent({ specialty }: SpecialtySectionProps) {
  const [open, setOpen] = useState(specialty.status !== "complete");
  const isComplete = specialty.status === "complete";
  const hasMissing = specialty.status === "missing";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between bg-white px-4 py-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#1A1A2E]">
            {specialty.name}
          </span>
          <span className="text-xs text-gray-400">
            {specialty.doc_count} docs
          </span>
          {isComplete && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
              Complete
            </span>
          )}
          {hasMissing && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
              {specialty.missing_count} missing
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="space-y-2 border-t border-gray-100 bg-gray-50/40 px-4 py-3">
          {specialty.documents.map((doc, index) => (
            <div key={`${doc.label}-${index}`}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {doc.label}
              </p>
              {doc.missing ? (
                <MissingFileRow
                  label={doc.missing_label ?? "Not uploaded"}
                  note={doc.missing_note ?? ""}
                />
              ) : (
                <FileRow
                  fileName={doc.file_name ?? "Document"}
                  fileSize={doc.file_size ?? ""}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const SpecialtySection = memo(SpecialtySectionComponent);
