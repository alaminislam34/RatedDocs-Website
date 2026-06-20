"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dentist, dentists } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

export const defaultPriceRange: [number, number] = [900, 1800];

type ViewMode = "list" | "map" | "filter";

function parseList(value: string | null) {
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function parsePrice(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getInitialState(searchParams: URLSearchParams): {
  query: string;
  viewMode: ViewMode;
  procedure: string;
  country: string;
  city: string;
  priceRange: [number, number];
  selectedRatings: number[];
  selectedScoreRanges: string[];
  selectedLanguages: string[];
  selectedAvailabilityDate: string | null;
  showVerifiedOnly: boolean;
} {
  const view = searchParams.get("view");

  return {
    query: searchParams.get("q") ?? "",
    viewMode: view === "map" || view === "filter" ? view : "list",
    procedure: searchParams.get("procedure") ?? "All Procedures",
    country: searchParams.get("country") ?? "All Countries",
    city: searchParams.get("city") ?? "All Cities",
    priceRange: [
      parsePrice(searchParams.get("minPrice"), defaultPriceRange[0]),
      parsePrice(searchParams.get("maxPrice"), defaultPriceRange[1]),
    ] as [number, number],
    selectedRatings: parseList(searchParams.get("ratings")).map(Number).filter((n) => Number.isFinite(n)),
    selectedScoreRanges: parseList(searchParams.get("scores")),
    selectedLanguages: parseList(searchParams.get("languages")),
    selectedAvailabilityDate: searchParams.get("availability") || null,
    showVerifiedOnly: searchParams.get("verified") !== "0",
  };
}

function buildSearchParams(
  current: URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>,
) {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  return params;
}

export function useDentistFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamsString = searchParams.toString();
  const initial = useMemo(
    () => getInitialState(new URLSearchParams(searchParamsString)),
    [searchParamsString],
  );

  const [query, setQueryState] = useState(initial.query);
  const [viewMode, setViewModeState] = useState<ViewMode>(initial.viewMode);
  const [procedure, setProcedureState] = useState(initial.procedure);
  const [country, setCountryState] = useState(initial.country);
  const [city, setCityState] = useState(initial.city);
  const [priceRange, setPriceRangeState] = useState<[number, number]>(
    initial.priceRange,
  );
  const [selectedRatings, setSelectedRatingsState] = useState<number[]>(
    initial.selectedRatings,
  );
  const [selectedScoreRanges, setSelectedScoreRangesState] = useState<string[]>(
    initial.selectedScoreRanges,
  );
  const [selectedLanguages, setSelectedLanguagesState] = useState<string[]>(
    initial.selectedLanguages,
  );
  const [selectedAvailabilityDate, setSelectedAvailabilityDateState] =
    useState<string | null>(initial.selectedAvailabilityDate);
  const [showVerifiedOnly, setShowVerifiedOnlyState] = useState(
    initial.showVerifiedOnly,
  );

  useEffect(() => {
    setQueryState(initial.query);
    setViewModeState(initial.viewMode);
    setProcedureState(initial.procedure);
    setCountryState(initial.country);
    setCityState(initial.city);
    setPriceRangeState(initial.priceRange);
    setSelectedRatingsState(initial.selectedRatings);
    setSelectedScoreRangesState(initial.selectedScoreRanges);
    setSelectedLanguagesState(initial.selectedLanguages);
    setSelectedAvailabilityDateState(initial.selectedAvailabilityDate);
    setShowVerifiedOnlyState(initial.showVerifiedOnly);
  }, [initial]);

  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist: Dentist) => {
      const matchesQuery =
        !query || dentist.name.toLowerCase().includes(query.toLowerCase());
      const matchesProcedure =
        procedure === "All Procedures" || dentist.procedures.includes(procedure);
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
          if (range === "0-25") return dentist.rdvScore >= 0 && dentist.rdvScore <= 25;
          if (range === "25-50") return dentist.rdvScore > 25 && dentist.rdvScore <= 50;
          if (range === "50-75") return dentist.rdvScore > 50 && dentist.rdvScore <= 75;
          if (range === "75-100") return dentist.rdvScore > 75 && dentist.rdvScore <= 100;
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

  const setUrlState = (
    updates: Record<string, string | number | boolean | null | undefined>,
    method: "replace" | "push" = "replace",
  ) => {
    const params = buildSearchParams(new URLSearchParams(searchParams.toString()), updates);
    const next = params.toString();
    const url = next ? `${pathname}?${next}` : pathname;
    if (method === "push") {
      router.push(url);
    } else {
      router.replace(url);
    }
  };

  const setQuery = (value: string) => {
    setQueryState(value);
    setUrlState({ q: value || null });
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    setUrlState({ view: mode }, "push");
  };

  const setProcedure = (value: string) => {
    setProcedureState(value);
    setUrlState({ procedure: value === "All Procedures" ? null : value });
  };

  const setCountry = (value: string) => {
    setCountryState(value);
    setUrlState({ country: value === "All Countries" ? null : value });
  };

  const setCity = (value: string) => {
    setCityState(value);
    setUrlState({ city: value === "All Cities" ? null : value });
  };

  const setPriceRange = (range: [number, number]) => {
    setPriceRangeState(range);
    setUrlState({ minPrice: range[0], maxPrice: range[1] });
  };

  const toggleRating = (rating: number) => {
    const next = selectedRatings.includes(rating)
      ? selectedRatings.filter((v) => v !== rating)
      : [...selectedRatings, rating];
    setSelectedRatingsState(next);
    setUrlState({ ratings: next.length ? next.join(",") : null });
  };

  const toggleScore = (range: string) => {
    const next = selectedScoreRanges.includes(range)
      ? selectedScoreRanges.filter((v) => v !== range)
      : [...selectedScoreRanges, range];
    setSelectedScoreRangesState(next);
    setUrlState({ scores: next.length ? next.join(",") : null });
  };

  const toggleLanguage = (lang: string) => {
    const next = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((v) => v !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguagesState(next);
    setUrlState({ languages: next.length ? next.join(",") : null });
  };

  const setSelectedAvailabilityDate = (value: string | null) => {
    setSelectedAvailabilityDateState(value);
    setUrlState({ availability: value });
  };

  const setShowVerifiedOnly = (value: boolean) => {
    setShowVerifiedOnlyState(value);
    setUrlState({ verified: value ? null : "0" });
  };

  const resetAll = () => {
    setQueryState("");
    setViewModeState("list");
    setProcedureState("All Procedures");
    setCountryState("All Countries");
    setCityState("All Cities");
    setPriceRangeState(defaultPriceRange);
    setSelectedRatingsState([]);
    setSelectedScoreRangesState([]);
    setSelectedLanguagesState([]);
    setSelectedAvailabilityDateState(null);
    setShowVerifiedOnlyState(true);
    router.replace(pathname);
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
