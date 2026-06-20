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

const mapProcedureNameToId = (name: string): number => {
  const n = name.toLowerCase();
  if (n.includes("implant")) return 1;
  if (n.includes("veneer")) return 2;
  if (n.includes("crown")) return 3;
  return 1;
};

// Define the schema for Phase 3 (repeatable procedures)
const procedureSchema = z.object({
  procedure: z.string().min(1, "Select a procedure"),
  ceCertificate: z.any().refine((file) => file instanceof File, "CE Certificate is required"),
  materialBrands: z.any().optional(),
  invoice: z.any().refine((file) => file instanceof File, "Invoice is required"),
  protocolPdf: z.any().refine((file) => file instanceof File, "Protocol PDF is required"),
});

const phase3Schema = z.object({
  procedures: z.array(procedureSchema).min(1, "Add at least one procedure"),
});

type Phase3Values = z.infer<typeof phase3Schema>;

export default function Phase3() {
  const methods = useForm<Phase3Values>({
    resolver: zodResolver(phase3Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      procedures: [
        {
          procedure: "",
          ceCertificate: null,
          materialBrands: null,
          invoice: null,
          protocolPdf: null,
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
    // Map data to StepThreeI signature
    const materials = data.procedures.map((p) => ({
      own_procedure: mapProcedureNameToId(p.procedure),
      brand_name: "Standard",
      ce_certificate: p.ceCertificate,
      material_brands: p.materialBrands || null,
      invoice: p.invoice,
      protocol_pdf: p.protocolPdf,
      notes: "",
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
              onError: (error: any) => {
                const errMsg = error?.response?.data?.message || "Verification submitted but phase completion update failed.";
                toast.error(errMsg);
              },
            }
          );
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message || "Clinical depth submission failed. Please try again.";
          toast.error(errMsg);
        },
      }
    );
  };

  // Keep the global "ready" flag in sync with the form validity so the footer submit enables
  React.useEffect(() => {
    setVerificationStepReady(3, methods.formState.isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.formState.isValid]);

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
                      {...methods.register(`procedures.${index}.procedure` as const)}
                      className="block w-full mt-2 rounded-md border border-gray-200 p-3"
                    >
                      <option value="">Select procedure</option>
                      <option value="implants">Implants</option>
                      <option value="veneers">Veneers</option>
                      <option value="crowns">Crowns</option>
                    </select>
                    {methods.formState.errors?.procedures?.[index]?.procedure && (
                      <p className="text-xs text-red-500 mt-1">{(methods.formState.errors.procedures as any)[index].procedure.message}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <DocumentUpload label="Upload CE certificate" name={`procedures.${index}.ceCertificate`} error={(methods.formState.errors as any).procedures?.[index]?.ceCertificate?.message} />
                    <DocumentUpload label="Upload Material brands" name={`procedures.${index}.materialBrands`} error={(methods.formState.errors as any).procedures?.[index]?.materialBrands?.message} />
                    <DocumentUpload label="Upload Invoice" name={`procedures.${index}.invoice`} error={(methods.formState.errors as any).procedures?.[index]?.invoice?.message} />
                    <DocumentUpload label="Upload protocol PDF" name={`procedures.${index}.protocolPdf`} error={(methods.formState.errors as any).procedures?.[index]?.protocolPdf?.message} />
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
              onClick={() => append({ procedure: "", ceCertificate: null, materialBrands: null, invoice: null, protocolPdf: null })}
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
