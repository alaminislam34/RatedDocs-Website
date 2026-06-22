import { useFormContext } from "react-hook-form";

export const GuaranteeSection = () => {
  const { register } = useFormContext();

  return (
    <section className="grid grid-cols-1 gap-8 border-t border-border px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Step 3
          </span>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            No Surprise Guarantee
          </h2>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
          <p className="text-sm leading-6 font-medium text-primary">
            You agree that final treatment prices will remain within 15% of your quoted estimate unless approved by the patient.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="inline-block text-sm font-medium text-foreground">
              Signer Full Name
            </label>
            <input
              {...register("signerFullName")}
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <label className="inline-block text-sm font-medium text-foreground">
              Typed Signature
            </label>
            <input
              {...register("typedSignature")}
              className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm italic text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-background">
          <input
            type="checkbox"
            {...register("agreeToGuarantee")}
            className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/40"
          />
          <span className="text-sm leading-6 text-muted-foreground">
            I agree to keep final prices within 15% unless approved by the patient.
          </span>
        </label>
      </div>
    </section>
  );
};