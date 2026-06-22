import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button"; // shadcn/ui or custom
import PhaseStep from "../PhaseStep";
import { useState } from "react";
import useDentist from "@/hooks/dentist/useDentist";

interface GlobalProcedure {
  id: number;
  name: string;
}

export const ProcedurePricingSection = () => {
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const { globalProcedureListData } = useDentist();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const proceduresList: GlobalProcedure[] = Array.isArray(
    globalProcedureListData?.data,
  )
    ? globalProcedureListData.data
    : Array.isArray(globalProcedureListData)
      ? globalProcedureListData
      : [];

  const watchProcedures = watch("procedures") || [];

  return (
    <section className="grid grid-cols-1 gap-8 border-t border-border px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={2} title="Procedure pricing" />

      <div className="space-y-4 sm:space-y-5">
        {fields.map((field, index) => {
          const typedName = watchProcedures[index]?.name || "";
          const suggestions = proceduresList.filter((p) =>
            p.name.toLowerCase().includes(typedName.toLowerCase()),
          );

          return (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_2fr_auto] md:items-end"
            >
              <div className="space-y-2 relative">
                <label className="inline-block text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <input
                  {...register(`procedures.${index}.name`, {
                    onChange: () => {
                      setValue(`procedures.${index}.id`, undefined);
                    },
                  })}
                  placeholder="Implant consultation"
                  onFocus={() => setOpenIndex(index)}
                  onBlur={() => {
                    setTimeout(() => setOpenIndex(null), 200);
                  }}
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
                  autoComplete="off"
                />

                {openIndex === index && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onMouseDown={() => {
                          setValue(`procedures.${index}.name`, suggestion.name);
                          setValue(`procedures.${index}.id`, suggestion.id);
                          setOpenIndex(null);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-block text-xs font-medium text-muted-foreground">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    {...register(`procedures.${index}.price`)}
                    className="h-11 w-full rounded-lg border border-border bg-card pl-8 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="inline-block text-xs font-medium text-muted-foreground">
                  Option Notes
                </label>
                <input
                  {...register(`procedures.${index}.notes`)}
                  placeholder="Includes treatment plan review"
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <button
                type="button"
                aria-label="Remove procedure"
                onClick={() => remove(index)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive-100 text-destructive-600 transition hover:bg-destructive-50"
              >
                ×
              </button>
            </div>
          );
        })}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => append({ name: "", price: 0, notes: "" })}
            className="h-11 rounded-lg px-4 text-sm font-semibold"
          >
            Add Procedure
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-lg px-4 text-sm font-semibold"
          >
            Upload CSV price list
          </Button>
        </div>
      </div>
    </section>
  );
};
