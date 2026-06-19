"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DocumentUpload } from "./DocumentUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useDentist, { useUpdateVerificationPhase } from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";

const PROCEDURE_OPTIONS = [
  { value: "5", label: "Implants" },
  { value: "6", label: "Veneers" },
  { value: "7", label: "Crowns" },
] as const;

const isFile = (file: unknown): file is File =>
  typeof File !== "undefined" && file instanceof File;
const fileSchema = (message: string) =>
  z.any().refine(isFile, message).transform((file) => file as File);
const getErrorMessage = (message: unknown) =>
  typeof message === "string" ? message : undefined;

const procedureSchema = z.object({
  ownProcedure: z.string().min(1, "Select a procedure"),
  brandName: z.string().min(1, "Brand name is required"),
  ceCertificate: fileSchema("CE Certificate is required"),
  materialBrands: fileSchema("Material brands file is required"),
  invoice: fileSchema("Invoice is required"),
  protocolPdf: fileSchema("Protocol PDF is required"),
  notes: z.string().optional(),
});

const phase3Schema = z.object({
  procedures: z.array(procedureSchema).min(1, "Add at least one procedure"),
});

type Phase3Values = z.infer<typeof phase3Schema>;
type Phase3InputValues = z.input<typeof phase3Schema>;

export default function Phase3() {
  const methods = useForm<Phase3InputValues, unknown, Phase3Values>({
    resolver: zodResolver(phase3Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      procedures: [
        {
          ownProcedure: "",
          brandName: "",
          ceCertificate: null,
          materialBrands: null,
          invoice: null,
          protocolPdf: null,
          notes: "",
        },
      ],
    },
  });

  const { setVerificationCompletedStep, setVerificationStep, setVerificationStepReady } = useVerificationStore();
  const { stepThreeMutation } = useDentist();
  const updatePhase = useUpdateVerificationPhase();

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const onSubmit = (data: Phase3Values) => {
    const materials = data.procedures.map((p) => ({
      own_procedure: Number(p.ownProcedure),
      brand_name: p.brandName,
      ce_certificate: p.ceCertificate,
      material_brands: p.materialBrands,
      invoice: p.invoice,
      protocol_pdf: p.protocolPdf,
      notes: p.notes || "",
    }));

    stepThreeMutation.mutate(
      { materials },
      {
        onSuccess: () => {
          // Transition phase to complete in the backend
          updatePhase.mutate(
            { verification_phase: "COMPLETE" },
            {
              onSuccess: () => {
                toast.success("Clinical Excellence verification completed!");
                setVerificationCompletedStep(3);
                setVerificationStep(3);
                setVerificationStepReady(3, true);
              },
              onError: (error: unknown) => {
                const errMsg =
                  typeof error === "object" && error !== null
                    ? (error as { response?: { data?: { message?: string } } })
                        .response?.data?.message ||
                      "Verification submitted but phase completion update failed."
                    : "Verification submitted but phase completion update failed.";
                toast.error(errMsg);
              },
            }
          );
        },
        onError: (error: unknown) => {
          const errMsg =
            typeof error === "object" && error !== null
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message ||
                "Clinical depth submission failed. Please try again."
              : "Clinical depth submission failed. Please try again.";
          toast.error(errMsg);
        },
      }
    );
  };

  // Keep the global "ready" flag in sync with the form validity so the footer submit enables
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setVerificationStepReady(3, methods.formState.isValid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [methods.formState.isValid, setVerificationStepReady]);

  const isPending = stepThreeMutation.isPending || updatePhase.isPending;

  return (
    <FormProvider {...methods}>
      <form id="phase-3-verification-form" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="divide-y divide-gray-100 bg-white rounded-3xl border border-gray-50 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 p-6 lg:p-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#163E5C]">STEP {index + 1}</p>
                  <h2 className="text-2xl font-bold text-[#0A2533]">Consultation Docs</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-[#0A2533] inline-block">Procedure</label>
                    <select
                      {...methods.register(`procedures.${index}.ownProcedure` as const)}
                      className="block w-full mt-2 rounded-md border border-gray-200 p-3"
                    >
                      <option value="">Select procedure</option>
                      {PROCEDURE_OPTIONS.map((procedure) => (
                        <option key={procedure.value} value={procedure.value}>
                          {procedure.label}
                        </option>
                      ))}
                    </select>
                    {methods.formState.errors?.procedures?.[index]?.ownProcedure && (
                      <p className="text-xs text-red-500 mt-1">
                        {methods.formState.errors.procedures[index]?.ownProcedure?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#0A2533] inline-block">
                      Brand Name
                    </label>
                    <input
                      {...methods.register(`procedures.${index}.brandName` as const)}
                      placeholder="Straumann"
                      className="block w-full mt-2 rounded-md border border-gray-200 p-3"
                    />
                    {methods.formState.errors?.procedures?.[index]?.brandName && (
                      <p className="text-xs text-red-500 mt-1">
                        {methods.formState.errors.procedures[index]?.brandName?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <DocumentUpload label="Upload CE certificate" name={`procedures.${index}.ceCertificate`} error={getErrorMessage(methods.formState.errors.procedures?.[index]?.ceCertificate?.message)} />
                    <DocumentUpload label="Upload Material brands" name={`procedures.${index}.materialBrands`} error={getErrorMessage(methods.formState.errors.procedures?.[index]?.materialBrands?.message)} />
                    <DocumentUpload label="Upload Invoice" name={`procedures.${index}.invoice`} error={getErrorMessage(methods.formState.errors.procedures?.[index]?.invoice?.message)} />
                    <DocumentUpload label="Upload protocol PDF" name={`procedures.${index}.protocolPdf`} error={getErrorMessage(methods.formState.errors.procedures?.[index]?.protocolPdf?.message)} />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#0A2533] inline-block">
                      Notes
                    </label>
                    <textarea
                      {...methods.register(`procedures.${index}.notes` as const)}
                      placeholder="Premium implant material"
                      className="block w-full mt-2 min-h-24 rounded-md border border-gray-200 p-3"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-end">
                <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline">
                  <Trash className="w-4 h-4" /> Remove procedure
                </button>
              </div>
            </div>
          ))}

          <div className="p-6">
            <button
              type="button"
              onClick={() => append({ ownProcedure: "", brandName: "", ceCertificate: null, materialBrands: null, invoice: null, protocolPdf: null, notes: "" })}
              className="w-full rounded-xl border-2 border-dashed border-gray-200 p-5 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-white"
            >
              <Plus className="w-4 h-4 text-gray-500" /> Add Procedure
            </button>
          </div>
        </div>
        {isPending && (
          <div className="flex justify-center items-center py-6 border-t bg-card">
            <Loader2 className="animate-spin h-6 w-6 text-[#0E3E65]" />
            <span className="ml-2 text-sm text-muted-foreground">Submitting Phase 3...</span>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
