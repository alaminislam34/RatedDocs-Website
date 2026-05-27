import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button"; // shadcn/ui or custom
import PhaseStep from "../PhaseStep";

export const ProcedurePricingSection = () => {
  const { control, register } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "procedures",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 py-10 border-t border-slate-100">
      <PhaseStep step={2} title="Procedure pricing" />

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_2fr] gap-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#414651] inline-block">
                Name
              </label>
              <input
                {...register(`procedures.${index}.name`)}
                placeholder="Implant consultation"
                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-900 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#414651] inline-block">
                Pricing
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  {...register(`procedures.${index}.pricing`)}
                  className="w-full h-11 pl-8 pr-4 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-900 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#414651] inline-block">
                Option Notes
              </label>
              <input
                {...register(`procedures.${index}.notes`)}
                placeholder="Includes treatment plan review"
                className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-900 outline-none"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: "", pricing: 0, notes: "" })}
          className="mt-2 px-6 h-11 bg-[#0A2540] text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
        >
          Add Procedure
        </button>
      </div>
    </div>
  );
};
