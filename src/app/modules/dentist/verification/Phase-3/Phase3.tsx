"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImplantDocsSection } from "./ImplantDocsSection";
import { DocumentUpload } from "./DocumentUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";

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

  const { setVerificationCompletedStep, setVerificationStep, setVerificationStepReady } = useStateContext();

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const onSubmit = (data: Phase3Values) => {
    console.log("Phase 3 Data Submitted:", data);
    // mark phase 3 completed in global state — this will open the confirmation modal
    setVerificationCompletedStep(3);
    setVerificationStep(3);
    setVerificationStepReady(3, true);
    // TODO: upload files to backend and handle errors/progress
  };

  // Keep the global "ready" flag in sync with the form validity so the footer submit enables
  React.useEffect(() => {
    setVerificationStepReady(3, methods.formState.isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.formState.isValid]);

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
      </form>
    </FormProvider>
  );
}
