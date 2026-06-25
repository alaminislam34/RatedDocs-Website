"use client";

import SearchBar from "../Hero/search-bar";
import SearchTags from "./search-tags";

export default function CtaSearchSection() {
  return (
    <section
      style={{
        backgroundImage: `url('/images/cta.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="relative w-full py-24 "
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-400 w-11/12 mx-auto flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E3A32A]/50 bg-black/20 backdrop-blur-md mb-8">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <span className="text-[10px] text-white italic">✓</span>
          </div>
          <span className="text-white text-sm font-medium">
            {/* todo: get total dentists */}
            Over <span className="text-[#E3A32A] font-bold">0</span> Verified
            Dentists Worldwide
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight">
          Find Verified Dentist
        </h2>

        <div className="w-full max-w-3xl mx-auto">
          <SearchBar />
        </div>

        <SearchTags />
      </div>
    </section>
  );
}
