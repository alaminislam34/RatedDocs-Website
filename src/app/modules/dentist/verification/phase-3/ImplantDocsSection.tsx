"use client";

import { useFormContext } from "react-hook-form";
import { DocumentUpload } from "./DocumentUpload";

export function ImplantDocsSection() {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 p-8 lg:p-12">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#163E5C]">
          Step 1
        </p>
        <h2 className="text-2xl font-bold text-[#0A2533]">
          Implant Consultation Docs
        </h2>
      </div>

      <div className="space-y-8">
        <DocumentUpload
          label="Upload CE certificate"
          name="ceCertificate"
          error={errors.ceCertificate?.message as string}
        />
        <DocumentUpload
          label="Upload Invoice"
          name="invoice"
          error={errors.invoice?.message as string}
        />
        <DocumentUpload
          label="Upload protocol PDF"
          name="protocolPdf"
          error={errors.protocolPdf?.message as string}
        />
      </div>
    </div>
  );
}
