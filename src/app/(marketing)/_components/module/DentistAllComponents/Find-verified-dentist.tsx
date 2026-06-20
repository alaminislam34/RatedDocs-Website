"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Switch } from "@/components/ui/switch";
import { useStateContext } from "@/providers/StateProvider";

import DentistCard from "./DentistCard";
import FilterSidebar from "./SideBar";
import FilterSheet from "./FilterSheet";
import TopBar from "./TopBar";
import CompareStickyBar from "./CompareStickyBar";

import {
  Dentist,
  cityOptions,
  countryOptions,
  procedureOptions,
} from "./types";
import { getAccessToken } from "@/lib/auth/session";
import { useDentistFilters } from "@/hooks/dentist/useDentistFilters";

const DentistMap = dynamic(() => import("./Map/DentistMap"), { ssr: false });

export default function FindDentist() {
  const filters = useDentistFilters();

  // Next.js navigation hooks
  // Local component state
  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // App global state context
  const { setDentistsToCompare, setShowPersonalizeModal, openSignupFlow } =
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
      openSignupFlow("compare");
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
          <aside className="hidden lg:block max-w-80 w-full">
            {(filters.viewMode !== "map" || showMapFilters) && (
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
            )}
          </aside>

          <section className="max-w-full w-full">
            <div className="hidden lg:grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
              <div className="min-w-0">
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
                  {filters.filteredDentists.map((dentist: Dentist) => (
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

              <div className="max-w-full w-full h-screen">
                <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow">
                  <DentistMap
                    dentists={filters.filteredDentists}
                    activeDentistId={activeDentistId}
                    visible={filters.viewMode === "map"}
                    onMarkerClick={(dentist) => setActiveDentistId(dentist.id)}
                    onCloseCard={() => setActiveDentistId(null)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:hidden space-y-6">
              <div className="min-w-0">
                <div className="mb-4 flex flex-row gap-4 items-center justify-between">
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
                  {filters.filteredDentists.map((dentist: Dentist) => (
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

              <div className="min-h-[65vh] overflow-hidden rounded-2xl border border-slate-100 shadow">
                <DentistMap
                  dentists={filters.filteredDentists}
                  activeDentistId={activeDentistId}
                  visible={filters.viewMode === "map"}
                  onMarkerClick={(dentist) => setActiveDentistId(dentist.id)}
                  onCloseCard={() => setActiveDentistId(null)}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
