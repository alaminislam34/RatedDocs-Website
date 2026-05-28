"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import DentistCard from "./DentistCard";
import FilterSidebar from "./SideBar";
import FilterSheet from "./FilterSheet";
import TopBar from "./TopBar";
import {
  Dentist,
  cityOptions,
  countryOptions,
  dentists,
  procedureOptions,
} from "./types";
import Image from "next/image";
import { useStateContext } from "@/providers/StateProvider";

const DentistMap = dynamic(() => import("./Map/DentistMap"), { ssr: false });

const defaultPriceRange: [number, number] = [900, 1800];

export default function FindDentist() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map" | "filter">("list");
  const [procedure, setProcedure] = useState("All Procedures");
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<
    string | null
  >(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);
  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Simulated auth state — replace with real session check when backend is ready
  const user = true;
  const { setShowSignupModal, setShowPersonalizeModal, setDentistsToCompare } = useStateContext();

  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist) => {
      const matchesQuery =
        !query || dentist.name.toLowerCase().includes(query.toLowerCase());
      const matchesProcedure =
        procedure === "All Procedures" ||
        dentist.procedures.includes(procedure);
      const matchesCountry =
        country === "All Countries" || dentist.country === country;
      const matchesCity = city === "All Cities" || dentist.city === city;
      const matchesPrice =
        dentist.price >= priceRange[0] && dentist.price <= priceRange[1];
      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.includes(Math.round(dentist.rating));
      const matchesScore =
        selectedScoreRanges.length === 0 ||
        selectedScoreRanges.some((range) => {
          if (range === "0-25")
            return dentist.rdvScore >= 0 && dentist.rdvScore <= 25;
          if (range === "25-50")
            return dentist.rdvScore > 25 && dentist.rdvScore <= 50;
          if (range === "50-75")
            return dentist.rdvScore > 50 && dentist.rdvScore <= 75;
          if (range === "75-100")
            return dentist.rdvScore > 75 && dentist.rdvScore <= 100;
          return true;
        });
      const matchesLanguages =
        selectedLanguages.length === 0 ||
        selectedLanguages.every((language) =>
          dentist.languages.includes(language),
        );
      const matchesVerified = !showVerifiedOnly || dentist.verified;
      return (
        matchesQuery &&
        matchesProcedure &&
        matchesCountry &&
        matchesCity &&
        matchesPrice &&
        matchesRating &&
        matchesScore &&
        matchesLanguages &&
        matchesVerified
      );
    });
  }, [
    city,
    country,
    priceRange,
    procedure,
    query,
    selectedLanguages,
    selectedRatings,
    selectedScoreRanges,
    showVerifiedOnly,
  ]);

  const handleCompareToggle = (dentist: Dentist) => {
    const exists = compareList.some((item) => item.id === dentist.id);

    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== dentist.id));
      return;
    }

    if (compareList.length < 3) {
      setCompareList((prev) => [...prev, dentist]);
    }
  };

  const resetAll = () => {
    setQuery("");
    setProcedure("All Procedures");
    setCountry("All Countries");
    setCity("All Cities");
    setPriceRange(defaultPriceRange);
    setSelectedRatings([]);
    setSelectedScoreRanges([]);
    setSelectedLanguages([]);
    setSelectedAvailabilityDate(null);
    setShowVerifiedOnly(true);
    setCompareList([]);
    setIsCompareMode(false);
  };
  const removeSelectedDentist = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen text-slate-900">
      <TopBar
        query={query}
        onQueryChange={setQuery}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          setShowMapFilters(false);
        }}
        showMapFilters={showMapFilters}
        onToggleMapFilters={() => setShowMapFilters((prev) => !prev)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
      />

      {/* Mobile filter sheet — shown below lg */}
      <FilterSheet
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        procedure={procedure}
        onProcedureChange={setProcedure}
        country={country}
        onCountryChange={setCountry}
        city={city}
        onCityChange={setCity}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        selectedRatings={selectedRatings}
        onRatingToggle={(rating: number) =>
          setSelectedRatings((prev) =>
            prev.includes(rating)
              ? prev.filter((v) => v !== rating)
              : [...prev, rating],
          )
        }
        selectedScoreRanges={selectedScoreRanges}
        onScoreToggle={(range: string) =>
          setSelectedScoreRanges((prev) =>
            prev.includes(range)
              ? prev.filter((v) => v !== range)
              : [...prev, range],
          )
        }
        selectedLanguages={selectedLanguages}
        onLanguageToggle={(language: string) =>
          setSelectedLanguages((prev) =>
            prev.includes(language)
              ? prev.filter((v) => v !== language)
              : [...prev, language],
          )
        }
        selectedAvailabilityDate={selectedAvailabilityDate}
        onAvailabilityDateChange={setSelectedAvailabilityDate}
        showVerifiedOnly={showVerifiedOnly}
        onShowVerifiedOnlyChange={setShowVerifiedOnly}
        onClear={resetAll}
        availableProcedures={procedureOptions}
        availableCountries={countryOptions}
        availableCities={cityOptions}
      />

      <main className="pb-16">
        <div className=" flex gap-4">
          <AnimatePresence initial={false}>
            {(viewMode === "list" ||
              (viewMode === "map" && showMapFilters)) && (
              <motion.aside
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="hidden lg:block max-w-80 w-full"
              >
                <FilterSidebar
                  procedure={procedure}
                  onProcedureChange={setProcedure}
                  country={country}
                  onCountryChange={setCountry}
                  city={city}
                  onCityChange={setCity}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedRatings={selectedRatings}
                  onRatingToggle={(rating: number) =>
                    setSelectedRatings((prev) =>
                      prev.includes(rating)
                        ? prev.filter((value) => value !== rating)
                        : [...prev, rating],
                    )
                  }
                  selectedScoreRanges={selectedScoreRanges}
                  onScoreToggle={(range: string) =>
                    setSelectedScoreRanges((prev) =>
                      prev.includes(range)
                        ? prev.filter((value) => value !== range)
                        : [...prev, range],
                    )
                  }
                  selectedLanguages={selectedLanguages}
                  onLanguageToggle={(language: string) =>
                    setSelectedLanguages((prev) =>
                      prev.includes(language)
                        ? prev.filter((value) => value !== language)
                        : [...prev, language],
                    )
                  }
                  selectedAvailabilityDate={selectedAvailabilityDate}
                  onAvailabilityDateChange={setSelectedAvailabilityDate}
                  showVerifiedOnly={showVerifiedOnly}
                  onShowVerifiedOnlyChange={setShowVerifiedOnly}
                  onClear={resetAll}
                  availableProcedures={procedureOptions}
                  availableCountries={countryOptions}
                  availableCities={cityOptions}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          <section className="max-w-full w-full">
            <div
              className={cn(
                "grid gap-6",
                viewMode === "list" || showMapFilters
                  ? "grid-cols-1"
                  : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
              )}
            >
              <div className={`min-w-0 ${showMapFilters ? "hidden" : "block"}`}>
                <div className="mb-4 flex flex-row gap-4 lg:items-center lg:justify-between">
                  <h2 className="text-xs font-medium leading-5 text-slate-500">
                    {filteredDentists.length} Verified Dentists in Mexico City |{" "}
                    ${priceRange[0]} - $
                    {priceRange[1] >= 1800
                      ? "1,800"
                      : priceRange[1].toLocaleString()}
                  </h2>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[12px] font-bold text-[#003366]">
                        Compare
                      </span>
                      <span className="block text-[10px] font-medium uppercase text-slate-400">
                        up to 3
                      </span>
                    </div>
                    <Switch
                      checked={isCompareMode}
                      onCheckedChange={(value) => {
                        setIsCompareMode(value);
                        if (!value) {
                          setCompareList([]);
                        }
                      }}
                      className="data-[state=checked]:bg-[#003366]"
                    />
                  </div>
                </div>
                {isCompareMode && compareList.length > 0 && (
                  <div className="w-full mb-6 flex flex-row gap-4 items-center justify-center">
                    <div className="flex flex-row gap-4 items-center justify-center">
                      {compareList.map((dentist, i) => (
                        <div key={i} className=" relative group">
                          <span
                            onClick={() => removeSelectedDentist(dentist.id)}
                            className="absolute hidden group-hover:flex cursor-pointer w-full h-full items-center justify-center"
                          >
                            <X className="text-red-500" />
                          </span>
                          <Image
                            src={dentist.image || "/images/dentist.png"}
                            alt={`Selected Dentist ${i + 1}`}
                            width={200}
                            height={200}
                            className="rounded-full w-12 h-12"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          if (user) {
                            setDentistsToCompare(compareList);
                            setShowPersonalizeModal(true);
                          } else {
                            setShowSignupModal(true);
                          }
                        }}
                        className="bg-[#0E3E65] text-white h-12 px-6 rounded-lg"
                      >
                        Compare
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {filteredDentists.map((dentist) => (
                    <DentistCard
                      key={dentist.id}
                      dentist={dentist}
                      isCompareMode={isCompareMode}
                      isSelectedForCompare={compareList.some(
                        (item) => item.id === dentist.id,
                      )}
                      onCompareToggle={() => handleCompareToggle(dentist)}
                      onPrimaryAction={() => setActiveDentistId(dentist.id)}
                    />
                  ))}
                </div>
              </div>

              {viewMode === "map" && (
                <div className={`max-w-full w-full h-screen`}>
                  <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow-xl">
                    <DentistMap
                      dentists={filteredDentists}
                      activeDentistId={activeDentistId}
                      onMarkerClick={(dentist) =>
                        setActiveDentistId(dentist.id)
                      }
                      onCloseCard={() => setActiveDentistId(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
