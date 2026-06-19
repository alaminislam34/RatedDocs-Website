import { CheckCircle2, MapPin, XCircle } from "lucide-react";
import type { VerificationDentist } from "../../types";
import { FileRow } from "./file-row";
import { SpecialtySection } from "./specialty-section";

export function Ph1Content({
  data,
  licenseFile,
}: {
  data: NonNullable<VerificationDentist["ph1_data"]>;
  licenseFile?: string;
}) {
  return (
    <div className="space-y-4">
      {data.auto_approved && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold text-emerald-700">
              Auto-approved by system
            </p>
            <p className="mt-0.5 text-xs text-emerald-600">
              {data.auto_approved_message}
            </p>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          License Verification
        </h4>
        <div className="space-y-2.5">
          {[
            { label: "License number", value: data.license?.number },
            { label: "Issuing state", value: data.license?.issuing_state },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-sm text-gray-400">{row.label}</span>
              <span className="break-all text-right text-sm font-medium text-[#1A1A2E]">
                {row.value || "N/A"}
              </span>
            </div>
          ))}
        </div>
        {licenseFile && (
          <div className="mt-4">
            <FileRow fileName="License document" fileSize="" href={licenseFile} />
          </div>
        )}
      </div>
      {data.government_id && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
            Government ID
          </h4>
          <FileRow
            fileName={data.government_id.file_name}
            fileSize={data.government_id.file_size}
          />
          <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />{" "}
            {data.government_id.verified_note}
          </p>
        </div>
      )}
    </div>
  );
}

export function Ph2Content({
  data,
  isRejected,
}: {
  data: NonNullable<VerificationDentist["ph2_data"]>;
  isRejected?: boolean;
}) {
  return (
    <div className="space-y-4">
      {isRejected && data.rejection_reason && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">
              Rejection reason sent to dentist
            </p>
            <p className="mt-0.5 text-xs text-red-500">
              {data.rejection_reason}
            </p>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Sterilization Evidence
        </h4>
        {data.sterilization_evidence?.video_walkthrough && (
          <FileRow
            fileName={data.sterilization_evidence.video_walkthrough.file_name}
            fileSize={data.sterilization_evidence.video_walkthrough.file_size}
          />
        )}
      </div>
      {data.procedure_pricing && data.procedure_pricing.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
            Procedure Pricing
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["PROCEDURE", "PRICE", "NOTES"].map((heading) => (
                    <th
                      key={heading}
                      className="pb-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400 last:pr-0"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.procedure_pricing.map((row, index) => (
                  <tr key={`${row.procedure}-${index}`}>
                    <td className="py-2.5 pr-4 text-sm text-gray-600">
                      {row.procedure}
                    </td>
                    <td className="py-2.5 pr-4 text-sm font-semibold text-blue-600">
                      ${row.price}
                    </td>
                    <td className="py-2.5 text-xs text-gray-400">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function Ph3Content({
  data,
  isRejected,
}: {
  data: NonNullable<VerificationDentist["ph3_data"]>;
  isRejected?: boolean;
}) {
  return (
    <div className="space-y-4">
      {isRejected && data.rejection_reason && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">
              Rejection reason sent to dentist
            </p>
            <p className="mt-0.5 text-xs text-red-500">
              {data.rejection_reason}
            </p>
          </div>
        </div>
      )}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#1A1A2E]">
          Clinic Location
        </h4>
        <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />{" "}
          {data.clinic_location}
        </div>
      </div>
      {data.specialties?.map((specialty, index) => (
        <SpecialtySection
          key={`${specialty.name}-${index}`}
          specialty={specialty}
        />
      ))}
    </div>
  );
}
