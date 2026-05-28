"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const GUIDELINES = [
  {
    num: 1,
    title: "Front Smile",
    hint: "Teeth together, lips relaxed",
    bg: "bg-rose-100",
  },
  {
    num: 2,
    title: "Wide Smile",
    hint: "Smile as wide as possible",
    bg: "bg-amber-100",
  },
  {
    num: 3,
    title: "Upper Arch",
    hint: "Tilt head back, mouth wide open",
    bg: "bg-sky-100",
  },
  {
    num: 1,
    title: "Lower Arch",
    hint: "Chin down, mouth wide open",
    bg: "bg-emerald-100",
  },
  {
    num: 2,
    title: "Left Side",
    hint: "Turn head right, show left teeth",
    bg: "bg-violet-100",
  },
  {
    num: 3,
    title: "Right Side",
    hint: "Turn head left, show right teeth",
    bg: "bg-orange-100",
  },
];

export default function GuidelinesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
        <div className="px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consultation
          </DialogTitle>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6 bg-white">
          {GUIDELINES.map((item, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div
                className={`relative aspect-square rounded-2xl overflow-hidden ${item.bg} flex items-center justify-center`}
              >
                <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#113254] font-bold text-sm">
                    {item.num}
                  </span>
                </div>
                <p className="text-[#374151] text-xs font-medium text-center px-4 opacity-60">
                  {item.hint}
                </p>
              </div>
              <span className="text-[#113254] font-bold text-[15px]">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
