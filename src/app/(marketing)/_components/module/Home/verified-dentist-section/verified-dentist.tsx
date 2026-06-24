"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import DentistCard from "./dentist-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/session";
import { useGlobalDentist } from "@/hooks/global/useGlobal";

export default function VerifiedDentists() {
  const [procedure, setProcedure] = useState("Orthodontist");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dentists, setDentists] = useState<any[]>([]);
  const {
    setShowSignupModal,
    setShowPersonalizeModal,
    setDentistsToCompare,
    setShowCompareModal,
  } = useStateContext();

  const { data, error, isLoading } = useGlobalDentist();

  const mapBackendDentistToFrontend = (d: any): any => {
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

  useEffect(() => {
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

    if (allDentists.length === 0) {
      const fallback = getDentistsFromStorage();
      const filtered = fallback.filter((d) => d.specialty.includes(procedure));
      setDentists(filtered.length > 0 ? filtered : fallback.slice(0, 4));
      return;
    }

    const filtered = allDentists.filter((d: any) => {
      const specialtyMatch = d.specialty
        ?.toLowerCase()
        .includes(procedure.toLowerCase());
      const procedureMatch = d.procedures?.some((p: string) =>
        p.toLowerCase().includes(procedure.toLowerCase()),
      );
      return specialtyMatch || procedureMatch;
    });

    setDentists(filtered.length > 0 ? filtered : allDentists.slice(0, 4));
  }, [procedure, data]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const removeSelectedDentist = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const selectedDentists = dentists.filter((doc) =>
    selectedIds.includes(doc.id),
  );

  return (
    <section className="py-20">
      <div className="max-w-400 w-11/12 mx-auto mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-black text-[#10436B]">
          Verified Dentists
        </h2>
        <p className="text-gray-400 mt-2 text-lg">
          Every dentist is trusted. Every review is from a real patient.
        </p>
      </div>

      <div className="max-w-400 w-11/12 mx-auto border border-[#E9EDEE] rounded-md flex flex-col lg:flex-row">
        <Sidebar active={procedure} onChange={setProcedure} />

        <div className="flex-1 p-6 md:p-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-[#6B7280]">
              Showing 24 dentist for{" "}
              <span className="text-[#10436B] font-bold">"{procedure}"</span>
            </p>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-[#10436B] font-bold uppercase leading-none">
                  Compare
                </p>
                <p className="text-[10px] text-gray-400">up to 3</p>
              </div>
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedIds([]);
                }}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative flex items-center px-1",
                  compareMode ? "bg-[#10436B]" : "bg-gray-300",
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                    compareMode ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </header>
          {selectedDentists.length > 0 && (
            <div className="w-full mb-6 flex flex-row gap-4 items-center justify-center">
              <div className="flex flex-row gap-4 items-center justify-center">
                {selectedDentists.map((dentist, i) => (
                  <div key={i} className=" relative group">
                    <span
                      onClick={() => removeSelectedDentist(dentist.id)}
                      className="absolute hidden group-hover:flex cursor-pointer w-full h-full items-center justify-center"
                    >
                      <X className="text-red-500" />
                    </span>
                    <Image
                      src={dentist.image || "/images/smile-1.png"}
                      alt={dentist.name}
                      width={200}
                      height={200}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <Button
                  onClick={() => {
                    setDentistsToCompare(selectedDentists);
                    const token = getAccessToken();
                    if (token) {
                      setShowPersonalizeModal(true);
                    } else {
                      setShowSignupModal(true);
                    }
                  }}
                  className="bg-[#0E3E65] text-white h-12 px-6 rounded-lg cursor-pointer"
                >
                  Compare
                </Button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {dentists.map((doc) => (
              <DentistCard
                key={doc.id}
                dentist={doc}
                isCompareMode={compareMode}
                isSelected={selectedIds.includes(doc.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={"/find-dentist"}
              className="text-[#10436B] font-bold text-sm hover:underline decoration-2 underline-offset-4"
            >
              View all specialties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
