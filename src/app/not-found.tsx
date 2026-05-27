import Link from "next/link";
import Image from "next/image";
import { Search, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
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
        {/* 404 illustration area */}
        <div className="relative mb-8 flex flex-col items-center">
          {/* Large 404 */}
          <div className="relative">
            <span className="text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none text-[#EEF8FF] select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#003366]/10">
                  <Search className="size-8 sm:size-10 text-[#003366]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="max-w-lg space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A2E]">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
            We couldn&apos;t find the page you&apos;re looking for. It may have
            been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Suggestions */}
        <div className="mt-8 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-left space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Try one of these instead
          </p>
          {[
            { label: "Find a Dentist", href: "/find-dentist", desc: "Browse verified dental professionals" },
            { label: "Home", href: "/", desc: "Back to the main page" },
            { label: "Join as a Doctor", href: "/register-doctor", desc: "List your dental practice" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 hover:border-[#003366]/30 hover:bg-[#EEF8FF] transition-all group"
            >
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-[#003366]">
                  {item.label}
                </p>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
              <ArrowLeft className="size-4 text-slate-300 rotate-180 group-hover:text-[#003366] transition-colors" />
            </Link>
          ))}
        </div>

        {/* RDV branding pill */}
        <div className="mt-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-[#6B7280] shadow-sm">
          <span className="size-2 rounded-full bg-[#4CA30D]" />
          RatedDocs — Find Verified Dental Professionals
        </div>
      </main>
    </div>
  );
}
