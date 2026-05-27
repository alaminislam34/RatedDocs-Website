"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Copy, CheckCheck } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log to error reporting service
    console.error("[GlobalError]", error);
  }, [error]);

  const errorMessage = error?.message || "An unexpected error occurred.";
  const digest = error?.digest;

  const copyError = () => {
    const text = `Error: ${errorMessage}${digest ? `\nDigest: ${digest}` : ""}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white py-5 shadow-sm">
        <div className="mx-auto flex max-w-360 w-11/12 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/mainlogo.png"
              alt="RatedDocs"
              height={200}
              width={400}
              className="w-36 h-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-[#10436B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0d3558] transition-colors"
          >
            <Home className="size-4" />
            Go Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
          <AlertTriangle className="size-10 text-red-500" />
        </div>

        <div className="max-w-lg space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A2E]">
            Something went wrong
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            We ran into an unexpected problem. This has been noted. You can try
            again or return to the home page.
          </p>
        </div>

        {/* Error detail card */}
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          {/* Error summary */}
          <div className="flex items-start gap-3 px-5 py-4 bg-red-50/60 border-b border-red-100">
            <div className="mt-0.5 shrink-0 size-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm font-semibold text-red-700 text-left leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Digest */}
          {digest && (
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-400 font-medium">
                Error ID:{" "}
                <span className="font-mono text-slate-600">{digest}</span>
              </span>
              <button
                onClick={copyError}
                className="flex items-center gap-1.5 text-xs font-medium text-[#003366] hover:text-[#002850] transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCheck className="size-3.5 text-[#4CA30D]" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          {/* Toggle stack trace */}
          {error?.stack && (
            <>
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-3 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <span>Technical details</span>
                {showDetails ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
              {showDetails && (
                <pre className="px-5 py-4 text-[11px] leading-relaxed text-slate-500 bg-slate-950 text-left overflow-x-auto whitespace-pre-wrap break-all">
                  {error.stack}
                </pre>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003366] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#002850] active:scale-[0.98] transition-all"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#003366] px-6 py-3.5 text-sm font-bold text-[#003366] hover:bg-[#EEF8FF] transition-all"
          >
            <Home className="size-4" />
            Go Home
          </Link>
        </div>

        {/* Branding */}
        <div className="mt-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-[#6B7280] shadow-sm">
          <span className="size-2 rounded-full bg-[#4CA30D]" />
          RatedDocs — Find Verified Dental Professionals
        </div>
      </main>
    </div>
  );
}
