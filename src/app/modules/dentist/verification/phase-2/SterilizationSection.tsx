import { useFormContext } from "react-hook-form";
import { UploadCloud } from "lucide-react";
import PhaseStep from "../PhaseStep";

export const SterilizationSection = () => {
  const { register } = useFormContext();

  const methods = ["Autoclave", "Sealed Pouch", "Ultrasonic"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 py-10">
      <PhaseStep step={1} title="Sterilization" />
      <div className="space-y-8">
        {[
          {
            label: "Upload JCI Certificate",
            sub: "Click to upload or drag and drop",
          },
          { label: "Start Video Walkthrough", sub: "Upload Video" },
        ].map((item, idx) => (
          <div key={idx} className="space-y-3">
            <label className="text-xs font-medium text-[#414651] inline-block">
              {item.label}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex hover:border-[#0E3E65] transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#0E3E65]" />
                <span className="text-sm font-medium text-slate-600">
                  {item.sub}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 pt-4">
          {methods.map((method) => (
            <label
              key={method}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={method}
                {...register("sterilizationMethods")}
                style={{ accentColor: "#0E3E65" }}
                className="w-4 h-4 rounded-xl border-slate-300 text-[#0E3E65] focus:ring-[#0E3E65]"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                {method}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
