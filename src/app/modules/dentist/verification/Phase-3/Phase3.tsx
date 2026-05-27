"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImplantDocsSection } from "./ImplantDocsSection";

// Define the schema for Phase 3
const phase3Schema = z.object({
  ceCertificate: z
    .any()
    .refine((file) => file instanceof File, "CE Certificate is required"),
  invoice: z
    .any()
    .refine((file) => file instanceof File, "Invoice is required"),
  protocolPdf: z
    .any()
    .refine((file) => file instanceof File, "Protocol PDF is required"),
});

type Phase3Values = z.infer<typeof phase3Schema>;

export default function Phase3() {
  const methods = useForm<Phase3Values>({
    resolver: zodResolver(phase3Schema),
  });

  const onSubmit = (data: Phase3Values) => {
    console.log("Phase 3 Data Submitted:", data);
    // Proceed to final registration API call
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="divide-y divide-gray-100 bg-white rounded-3xl border border-gray-50 shadow-sm">
          {/* Section: Implant Consultation Docs */}
          <ImplantDocsSection />
        </div>
      </form>
    </FormProvider>
  );
}
