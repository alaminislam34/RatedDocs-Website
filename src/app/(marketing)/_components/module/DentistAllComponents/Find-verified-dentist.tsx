"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";

import DentistCard from "./DentistCard";
import DentistCardSkeleton from "./DentistCardSkeleton";
import FilterSidebar from "./SideBar";
import FilterSheet from "./FilterSheet";
import TopBar from "./TopBar";
import CompareStickyBar from "./CompareStickyBar";

import {
  Dentist,
  dentists as mockDentists,
  cityOptions,
  countryOptions,
  procedureOptions,
} from "./types";
import { useDentistFilters } from "@/hooks/dentist/useDentistFilters";
import { getAccessToken } from "@/lib/auth/session";
import { useGlobalDentist } from "@/hooks/global/useGlobal";

const DentistMap = dynamic(() => import("./Map/DentistMap"), { ssr: false });

export default function FindDentist() {
  const { data, isLoading } = useGlobalDentist();
  console.log(data);
  const mapBackendDentistToFrontend = (d: any): Dentist => {
    let minPrice = 0;
    if (d.procedures && d.procedures.length > 0) {
      const prices = d.procedures
        .map((p: any) => parseFloat(p.price))
        .filter((p: number) => !isNaN(p) && p > 0);
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
    }

    const name =
      d.full_name ||
      (d.user ? `${d.user.first_name} ${d.user.last_name}` : "Dentist");

    return {
      id: String(d.id),
      backendId: d.id,
      name,
      slug: d.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      specialty: d.specialty || "DENTIST",
      imageSeed: String(d.id),
      rating: d.rating_avg !== undefined ? d.rating_avg : 0,
      reviewCount: d.total_reviews !== undefined ? d.total_reviews : 0,
      image: d.image || "/images/smile-1.png",
      location: d.dentist_address?.[0]
        ? `${d.dentist_address[0].city}, ${d.dentist_address[0].country}`
        : "Mexico City, Mexico",
      city: d.dentist_address?.[0]?.city || "Mexico City",
      country: d.dentist_address?.[0]?.country || "Mexico",
      price: minPrice || 950,
      rdvScore: d.rdv_score !== undefined ? d.rdv_score : 0,
      verified: d.is_verified || false,
      procedures: d.procedures
        ? d.procedures.map((p: any) => p.procedure_name)
        : [],
      tags: d.tags || [],
      languages: d.languages || ["English", "Spanish"],
      licenseNo: d.license_no || "",
      experience: d.experience_years || 0,
      coords: {
        lat: Number(d.dentist_address?.[0]?.latitude) || 19.4326,
        lng: Number(d.dentist_address?.[0]?.longitude) || -99.1332,
      },
    };
  };

  const mappedDentists = useMemo(() => {
    const payload = data as any;
    const rawList = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload?.data?.results)
            ? payload.data.results
            : [];

    const allDentists = rawList.map(mapBackendDentistToFrontend);

    return allDentists.length > 0 ? allDentists : mockDentists;
  }, [data]);

  const filters = useDentistFilters(mappedDentists);

  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // App global state context
  const { setShowSignupModal, setDentistsToCompare, setShowPersonalizeModal } =
    useStateContext();

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

  const removeSelectedDentist = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompareSubmit = () => {
    setDentistsToCompare(compareList);
    const token = getAccessToken();
    if (token) {
      setShowPersonalizeModal(true);
    } else {
      setShowSignupModal(true);
    }
  };

  const handleClearAllFilters = () => {
    filters.resetAll();
    setCompareList([]);
    setIsCompareMode(false);
  };

  return (
    <div className="min-h-screen text-slate-900">
      <TopBar
        query={filters.query}
        onQueryChange={filters.setQuery}
        viewMode={filters.viewMode}
        onViewModeChange={(mode) => {
          filters.setViewMode(mode);
          setShowMapFilters(false);
        }}
        showMapFilters={showMapFilters}
        onToggleMapFilters={() => setShowMapFilters((prev) => !prev)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
      />

      <FilterSheet
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        procedure={filters.procedure}
        onProcedureChange={filters.setProcedure}
        country={filters.country}
        onCountryChange={filters.setCountry}
        city={filters.city}
        onCityChange={filters.setCity}
        priceRange={filters.priceRange}
        onPriceRangeChange={filters.setPriceRange}
        selectedRatings={filters.selectedRatings}
        onRatingToggle={filters.toggleRating}
        selectedScoreRanges={filters.selectedScoreRanges}
        onScoreToggle={filters.toggleScore}
        selectedLanguages={filters.selectedLanguages}
        onLanguageToggle={filters.toggleLanguage}
        selectedAvailabilityDate={filters.selectedAvailabilityDate}
        onAvailabilityDateChange={filters.setSelectedAvailabilityDate}
        showVerifiedOnly={filters.showVerifiedOnly}
        onShowVerifiedOnlyChange={filters.setShowVerifiedOnly}
        onClear={handleClearAllFilters}
        availableProcedures={procedureOptions}
        availableCountries={countryOptions}
        availableCities={cityOptions}
      />

      <main className="pb-16">
        <div className="flex gap-4">
          <AnimatePresence initial={false}>
            {(filters.viewMode === "list" ||
              (filters.viewMode === "map" && showMapFilters)) && (
              <motion.aside
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="hidden lg:block max-w-80 w-full"
              >
                <FilterSidebar
                  procedure={filters.procedure}
                  onProcedureChange={filters.setProcedure}
                  country={filters.country}
                  onCountryChange={filters.setCountry}
                  city={filters.city}
                  onCityChange={filters.setCity}
                  priceRange={filters.priceRange}
                  onPriceRangeChange={filters.setPriceRange}
                  selectedRatings={filters.selectedRatings}
                  onRatingToggle={filters.toggleRating}
                  selectedScoreRanges={filters.selectedScoreRanges}
                  onScoreToggle={filters.toggleScore}
                  selectedLanguages={filters.selectedLanguages}
                  onLanguageToggle={filters.toggleLanguage}
                  selectedAvailabilityDate={filters.selectedAvailabilityDate}
                  onAvailabilityDateChange={filters.setSelectedAvailabilityDate}
                  showVerifiedOnly={filters.showVerifiedOnly}
                  onShowVerifiedOnlyChange={filters.setShowVerifiedOnly}
                  onClear={handleClearAllFilters}
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
                filters.viewMode === "list" || showMapFilters
                  ? "grid-cols-1"
                  : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
              )}
            >
              <div className={`min-w-0 ${showMapFilters ? "hidden" : "block"}`}>
                <div className="mb-4 flex flex-row gap-4 lg:items-center lg:justify-between">
                  <h2 className="text-xs font-medium leading-5 text-slate-500">
                    {filters.filteredDentists.length} Verified Dentists in
                    Mexico City | ${filters.priceRange[0]} - $
                    {filters.priceRange[1] >= 1800
                      ? "1,800"
                      : filters.priceRange[1].toLocaleString()}
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
                        if (!value) setCompareList([]);
                      }}
                      className="data-[state=checked]:bg-[#003366]"
                    />
                  </div>
                </div>

                {isCompareMode && (
                  <CompareStickyBar
                    compareList={compareList}
                    removeSelectedDentist={removeSelectedDentist}
                    onCompareSubmit={handleCompareSubmit}
                  />
                )}

                <div className="grid gap-4">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <DentistCardSkeleton key={i} />
                      ))
                    : filters.filteredDentists.map((dentist: Dentist) => (
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

              {filters.viewMode === "map" && (
                <div className="max-w-full w-full h-screen">
                  <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow">
                    <DentistMap
                      dentists={filters.filteredDentists}
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
