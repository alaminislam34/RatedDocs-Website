"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import {
  getBookingData,
  updateTreatmentDetails,
} from "@/lib/storage/bookingService";
import { getApiErrorMessage, procedureApi } from "@/lib/api";
import toast from "react-hot-toast";

const procedures = [
  {
    id: 2,
    title: "Porcelain Veneers",
    desc: "Improve shape, colour, and symmetry",
  },
  {
    id: 1,
    title: "Dental Implants",
    desc: "Replace one or more missing teeth permanently",
  },
  {
    id: 4,
    title: "Teeth Whitening",
    desc: "Brighten and even your smile",
  },
  {
    id: 3,
    title: "Dental Crowns",
    desc: "Restore damaged, worn, or cracked teeth",
  },
  {
    id: 5,
    title: "Full Smile Makeover",
    desc: "Comprehensive cosmetic treatment plan",
  },
  {
    id: 6,
    title: "Dental Bridges",
    desc: "Replace missing teeth with a natural look",
  },
];

type ProcedureOption = {
  id: number;
  title: string;
  desc: string;
};

function unwrapProcedureOptions(response: unknown): ProcedureOption[] {
  const payload = response as {
    data?: unknown;
    results?: unknown;
  };
  const maybeList = Array.isArray(response)
    ? response
    : Array.isArray(payload.data)
      ? payload.data
      : typeof payload.data === "object" &&
          payload.data !== null &&
          Array.isArray((payload.data as { results?: unknown }).results)
        ? (payload.data as { results: unknown[] }).results
        : Array.isArray(payload.results)
          ? payload.results
          : [];

  return maybeList
    .map((item) => {
      const row = item as {
        id?: string | number;
        name?: string;
        title?: string;
        label?: string;
        description?: string;
      };
      const id = Number(row.id);
      const title = row.name ?? row.title ?? row.label;

      if (!Number.isFinite(id) || !title) return null;

      return {
        id,
        title,
        desc: row.description ?? "Select this procedure",
      };
    })
    .filter((item): item is ProcedureOption => Boolean(item));
}

export default function ProcedureSelectionForm() {
  const [procedureOptions, setProcedureOptions] =
    useState<ProcedureOption[]>(procedures);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    () => getBookingData().procedureIds,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProcedures() {
      try {
        setIsLoading(true);
        const response = await procedureApi.list();
        const options = unwrapProcedureOptions(response);
        if (mounted && options.length > 0) {
          setProcedureOptions(options);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadProcedures();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectProcedure = (id: number) => {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(nextIds);
    const selectedTitles = procedureOptions
      .filter((procedure) => nextIds.includes(procedure.id))
      .map((procedure) => procedure.title);

    updateTreatmentDetails({
      procedure: selectedTitles.join(", "),
      procedureIds: nextIds,
    });
  };

  return (
    <div className="w-full bg-white">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        What procedure are you interested in?
      </h2>

      {isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6B7280]">
          <Loader2 className="size-4 animate-spin" />
          Loading procedures...
        </div>
      )}

      <div className="space-y-4">
        {procedureOptions.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleSelectProcedure(item.id)}
              className={`
                group cursor-pointer relative flex items-center justify-between 
                p-5 rounded-xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-[#113254] bg-[#F8FAFC]"
                    : "border-[#F3F4F6] hover:border-[#E5E7EB] bg-white"
                }
              `}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[17px] font-bold ${isSelected ? "text-[#113254]" : "text-[#1A1A2E]"}`}
                >
                  {item.title}
                </span>
                <span className="text-[14px] font-normal text-[#6B7280]">
                  {item.desc}
                </span>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-[#113254] fill-[#113254]" />
                ) : (
                  <Circle className="w-6 h-6 text-[#D1D5DB]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
