"use client";

import { motion } from "motion/react";
import { ShieldCheck, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function Guarantee() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-slate-900 px-4">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center"
      >
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium tracking-wide mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>COMING SOON</span>
        </div>

        {/* Main Content */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
          Our Guarantee
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We are actively crafting a comprehensive protection policy to ensure
          your complete peace of mind. Check back shortly to see our full
          commitment to your security and satisfaction.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium transition-all hover:bg-slate-800 focus:ring-4 focus:ring-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
