"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, XCircle } from "lucide-react";

const procedureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pricing: z.string().min(1, "Price is required"),
  notes: z.string(),
});

const formSchema = z.object({
  jciCertificate: z.any().optional(),
  videoWalkthrough: z.any().optional(),
  procedures: z.array(procedureSchema).min(1, "Add at least one procedure"),
  signerFullName: z.string().min(1, "Signer name is required"),
  typedSignature: z.string().min(1, "Typed signature is required"),
  agreeToGuarantee: z.boolean().refine((v) => v === true, {
    message: "You must agree to the No Surprise Guarantee",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const sterilizationItems = [
  {
    title: "Autoclave",
    description: "Film the brand name clearly for at least 3 seconds.",
  },
  {
    title: "Sealed Pouch",
    description:
      "Show a sealed pouch with the chemical indicator clearly visible.",
  },
  {
    title: "Ultrasonic Cleaner",
    description: "Show the ultrasonic cleaner and your instrument trays.",
  },
  {
    title: "Cycle Frequency",
    description:
      'Narrate or display how often you run cycles  e.g. "twice daily"',
  },
];

export default function AddPricing() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedures: [
        {
          name: "Implant consultation",
          pricing: "250",
          notes: "Includes treatment plan review",
        },
        {
          name: "Implant consultation",
          pricing: "250",
          notes: "Includes treatment plan review",
        },
      ],
      agreeToGuarantee: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Pricing Protocol:", data);
    router.push("/dentist/pricing-protocols");
  };

  const today = new Date().toLocaleDateString("en-GB");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      {/* Page Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dentist/pricing-protocols")}
          className="mb-2 flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          Pricing Protocols
        </h1>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        {/* ─── Sterilization ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              Sterilization
            </h2>
          </div>

          <div className="space-y-5 lg:col-span-8">
            {/* JCI Certificate */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Upload JCI Certificate
              </p>
              <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border px-5 py-5 transition-colors hover:bg-muted/40">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  {...register("jciCertificate")}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </span>
              </label>
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                OR
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Video Walkthrough */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Start Video Walkthrough
              </p>
              <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border px-5 py-5 transition-colors hover:bg-muted/40">
                <input
                  type="file"
                  accept="video/*"
                  {...register("videoWalkthrough")}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Upload Video
                </span>
              </label>
            </div>

            {/* Instruction items */}
            <div className="space-y-4 pt-1">
              {sterilizationItems.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* ─── Procedure Pricing ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              Procedure pricing
            </h2>
          </div>

          <div className="space-y-3 lg:col-span-8">
            {/* Column headers */}
            <div className="flex items-center gap-3">
              <div className="grid flex-1 grid-cols-12 gap-3">
                <span className="col-span-5 text-xs font-medium text-muted-foreground">
                  Name
                </span>
                <span className="col-span-3 text-xs font-medium text-muted-foreground">
                  Pricing
                </span>
                <span className="col-span-4 text-xs font-medium text-muted-foreground">
                  Option Notes
                </span>
              </div>
              <div className="w-5 shrink-0" />
            </div>

            {/* Rows */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="grid flex-1 grid-cols-12 gap-3">
                  {/* Name */}
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Procedure name"
                      {...register(`procedures.${index}.name` as const)}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                    />
                    {errors.procedures?.[index]?.name && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.procedures[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="col-span-3">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        {...register(`procedures.${index}.pricing` as const)}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-7 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                    {errors.procedures?.[index]?.pricing && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.procedures[index]?.pricing?.message}
                      </p>
                    )}
                  </div>

                  {/* Option Notes */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Optional note"
                      {...register(`procedures.${index}.notes` as const)}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="shrink-0 text-red-400 transition-colors hover:text-red-500"
                  aria-label="Remove procedure"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => append({ name: "", pricing: "", notes: "" })}
                className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                Add Procedure
              </button>
              <button
                type="button"
                className="h-10 rounded-lg border border-primary bg-card px-5 text-sm font-semibold text-primary transition-colors hover:bg-muted/40"
              >
                Upload CSV price list
              </button>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* ─── No Surprise Guarantee ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              No Surprise Guarantee
            </h2>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs font-medium leading-relaxed text-blue-700">
              The 15% rule means patients should not receive surprise increases
              beyond the disclosed starting price unless clearly explained and
              approved before treatment.
            </div>
          </div>

          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register("signerFullName")}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                />
                {errors.signerFullName && (
                  <p className="text-xs text-destructive">
                    {errors.signerFullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Typed Signature
                </label>
                <input
                  type="text"
                  placeholder="Type your signature"
                  {...register("typedSignature")}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                />
                {errors.typedSignature && (
                  <p className="text-xs text-destructive">
                    {errors.typedSignature.message}
                  </p>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-start gap-3 pt-1">
              <input
                type="checkbox"
                {...register("agreeToGuarantee")}
                className="mt-0.5 h-4 w-4 rounded border-border accent-sidebar"
              />
              <span className="text-sm text-foreground">
                I agree to the No Surprise Guarantee and understand today&apos;s
                date is {today}.
              </span>
            </label>
            {errors.agreeToGuarantee && (
              <p className="text-xs text-destructive">
                {errors.agreeToGuarantee.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Sticky Save Bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-6 py-4">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-lg bg-primary px-8 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
