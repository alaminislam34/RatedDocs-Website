"use client";

import { useEffect, useState } from "react";
import { XCircle, X, Loader2 } from "lucide-react";

interface RejectPhaseModalProps {
  open: boolean;
  phaseLabel: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
}

export function RejectPhaseModal({
  open,
  phaseLabel,
  onClose,
  onConfirm,
  isPending,
}: RejectPhaseModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setReason("");
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-500">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A2E]">
                  Reject {phaseLabel}?
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  The dentist will be notified with your reason and asked to resubmit.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Reason input */}
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Rejection reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={!reason.trim() || isPending}
              onClick={() => onConfirm(reason.trim())}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
