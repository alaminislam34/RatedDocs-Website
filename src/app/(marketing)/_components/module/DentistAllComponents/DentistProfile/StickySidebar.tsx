import Image from "next/image";
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  Star,
  Edit3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StickySidebar({ dentist }: { dentist: any }) {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-xl">
      <div className="flex items-start gap-5">
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-slate-50">
          <Image
            src={dentist.image}
            alt={dentist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#003366] tracking-tight">
            {dentist.name}
          </h1>
          <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">
            {dentist.specialty}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-black text-[#003366]">5.0</span>
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-[#003366] underline decoration-2 underline-offset-4 ml-2">
              <Edit3 className="size-3" /> Write a review
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-50 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1 text-[#4CA30D] text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="size-4" /> Verified
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-1">
            <span className="text-lg font-black text-[#003366]">100</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
              RDV
              <br />
              Score
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <MapPin className="size-5" />
            <span className="text-sm">Mexico City, Mexico</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <CreditCard className="size-5" />
            <span className="text-sm">
              License No.{" "}
              <span className="font-bold text-slate-900">
                {dentist.licenseNo || "MX-2847361"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-bold text-[#003366] flex items-center gap-2">
            <ShieldCheck className="size-4" /> No Surprise Guarantee
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-bold text-[#003366] flex items-center gap-2">
            <Globe className="size-4" /> EN · ES
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            Starting at
          </p>
          <p className="text-4xl font-black text-[#003366]">$1,500</p>
        </div>
        <Button className="h-16 flex-1 rounded-2xl bg-[#003366] text-lg font-black text-white hover:bg-[#002850]">
          Book consultation
        </Button>
      </div>
    </div>
  );
}
