"use client";

import Image from "next/image";
import { BadgeCheck, Globe2, MapPin, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { Dentist } from "./types";
import { redirect } from "next/navigation";

type DentistCardProps = {
  dentist: Dentist;
  floating?: boolean;
  isCompareMode?: boolean;
  isSelectedForCompare?: boolean;
  onCompareToggle?: () => void;
  onPrimaryAction?: () => void;
};

export default function DentistCard({
  dentist,
  floating = false,
  isCompareMode = false,
  isSelectedForCompare = false,
  onCompareToggle,
  onPrimaryAction,
}: DentistCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-[#B3C6DC] bg-white transition-all duration-300",
        "rounded-lg ",
        floating && "w-[min(100%,34rem)] shadow-lg",
        isSelectedForCompare && "border-[#003366] bg-slate-50/20",
      )}
    >
      {isCompareMode && (
        <div className="absolute left-3 top-3 z-20">
          <Checkbox
            checked={isSelectedForCompare}
            onCheckedChange={onCompareToggle}
            className="size-5 rounded border-slate-300 data-[state=checked]:border-[#5f7e9c] data-[state=checked]:bg-[#003366]"
          />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 p-4 xl:flex-row xl:gap-5 xl:p-6">
        <div className="flex flex-row gap-4 max-w-180 w-full">
          <div className="flex shrink-0 flex-col items-center gap-3 xl:w-35">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={dentist.image || "/placeholder-avatar.png"}
                alt={dentist.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
                <ShieldCheck className="size-4 text-[#4CA30D]" />
                VERIFIED
              </div>

              <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-center">
                <div className="font-extrabold text-[#0E3E65]">
                  {dentist.rdvScore}
                </div>
                <div className="text-xs font-medium text-[#1A1A2E]">
                  RDV Score
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-[20px] font-bold tracking-[-0.03em] text-slate-900">
                  {dentist.name}
                </h3>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">
                  {dentist.specialty}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold text-[#003366]">
                  {dentist.rating}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.floor(dentist.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-slate-400">
                  ({dentist.reviewCount} Ratings)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-4 shrink-0" />
                <span className="block truncate text-[14px] text-[#6B7280]">
                  {dentist.location}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-[12px] font-medium text-[#0E3E65] hover:bg-sky-50">
                <BadgeCheck className="size-4" />
                No Surprise Guarantee
              </Badge>

              <Badge className="whitespace-nowrap border-none bg-[#EEF8FF] px-3 py-1 text-[12px] font-medium text-[#0E3E65] hover:bg-sky-50">
                <Globe2 className="size-3.5" />
                EN - ES
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-end justify-between gap-3 xl:min-w-42.5">
          <div className="text-right">
            <div className="text-[12px] text-[#6B7280]">Starting at</div>
            <div className="text-[16px] font-bold text-[#0E3E65]">
              ${dentist.price.toLocaleString()}
            </div>
          </div>

          <div
            className={cn(
              "flex flex-wrap items-end justify-end gap-2 sm:w-auto",
            )}
          >
            <Button
              variant="outline"
              className="h-11 rounded-lg border-[#003366] px-6 font-bold text-[#003366] hover:bg-slate-50 "
              onClick={() => redirect(`/find-dentist/${dentist.slug}`)}
            >
              View Profile
            </Button>
            <Button
              className="h-11 rounded-lg bg-[#003366] px-6 font-bold text-white shadow-sm hover:bg-[#002850] "
              onClick={onPrimaryAction}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
