"use client";

import { Dentist, dentists as defaultDentists } from "@/app/(marketing)/_components/module/DentistAllComponents/types";
import { useState, useMemo } from "react";

export const defaultPriceRange: [number, number] = [0, 1800];

export function useDentistFilters(initialDentists: Dentist[] = defaultDentists) {
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

  const filteredDentists = useMemo(() => {
    return initialDentists.filter((dentist: Dentist) => {
      const matchesQuery =
        !query || dentist.name.toLowerCase().includes(query.toLowerCase());
      const matchesProcedure =
        procedure === "All Procedures" ||
        dentist.procedures.some((p: string) => p.toLowerCase().includes(procedure.toLowerCase()));
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
        selectedLanguages.every((lang) => dentist.languages.includes(lang));
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
    initialDentists,
    query,
    procedure,
    country,
    city,
    priceRange,
    selectedRatings,
    selectedScoreRanges,
    selectedLanguages,
    showVerifiedOnly,
  ]);

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((v) => v !== rating)
        : [...prev, rating],
    );
  };

  const toggleScore = (range: string) => {
    setSelectedScoreRanges((prev) =>
      prev.includes(range) ? prev.filter((v) => v !== range) : [...prev, range],
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((v) => v !== lang) : [...prev, lang],
    );
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
  };

  return {
    query,
    setQuery,
    viewMode,
    setViewMode,
    procedure,
    setProcedure,
    country,
    setCountry,
    city,
    setCity,
    priceRange,
    setPriceRange,
    selectedRatings,
    toggleRating,
    selectedScoreRanges,
    toggleScore,
    selectedLanguages,
    toggleLanguage,
    selectedAvailabilityDate,
    setSelectedAvailabilityDate,
    showVerifiedOnly,
    setShowVerifiedOnly,
    filteredDentists,
    resetAll,
  };
}
