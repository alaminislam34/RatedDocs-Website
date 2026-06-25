import SearchBar from "./search-bar";

export default function HeroContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl md:text-3xl pr-5 leading-[150%] lg:text-[44px] font-extrabold tracking-tight text-[#1A1A2E]">
          Compare Verified Dentists. Know the Cost.
        </h1>
        <p className="max-w-120 text-lg leading-relaxed text-gray-500">
          Find top rated dentists with transparent pricing. Book confidently today
        </p>
      </div>

      <div className="w-full lg:max-w-4/5 pt-4">
        <SearchBar />
      </div>

      <p className="text-sm font-medium text-gray-400">
        Trusted by <span className="font-bold text-[#10436B]">0</span> Dentists Worldwide
      </p>
    </div>
  );
}