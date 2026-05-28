"use client";

import { FileText, Download } from "lucide-react";

type Document = {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
};

interface PatientDocumentsTabProps {
  documents: Document[];
}

export function PatientDocumentsTab({ documents }: PatientDocumentsTabProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-base font-semibold text-[#1A1A2E]">
          Document vault
        </h3>
        <button className="flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
          <Download className="h-4 w-4" />
          Download all document
        </button>
      </div>

      {/* Document list */}
      <div className="divide-y divide-gray-50 p-2">
        {documents.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No documents found
          </div>
        )}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg px-3 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50">
                <FileText className="h-4.5 w-4.5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-400">
                  {doc.category} · {doc.size} ·{" "}
                  {new Date(doc.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <Download className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
