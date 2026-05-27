"use client";

import LicenceForm from "./licence-form";
import { VerificationResult } from "./match-found";
import { useStateContext } from "@/providers/StateProvider";
import { HeadshotUpload } from "./headshot-upload";

export default function Phase1() {
  const { verificationStatus, setVerificationStatus } = useStateContext();
  const handleVerify = (data: any) => {
    // Logic: If regNo is "123", simulate match found. Otherwise, not found.
    if (data.regNo === "CA-123456") {
      setVerificationStatus("match");
    } else {
      setVerificationStatus("no-match");
    }
  };

  return (
    <div>
      <div className=" divide-y divide-gray-100">
        {/* STEP 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#163E5C]">
              Step 1
            </p>
            <h2 className="text-3xl font-bold text-[#0A2533]">
              Verify your dental licence
            </h2>
          </div>
          <div>
            <LicenceForm onVerify={handleVerify} />
            {verificationStatus !== "idle" && (
              <VerificationResult
                status={verificationStatus}
                doctorName="Dr. Alex Hemsworth"
                specialty="Orthodontist"
              />
            )}
          </div>
        </div>

        {/* STEP 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 p-8 lg:p-12">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#163E5C]">
              Step 2
            </p>
            <h2 className="text-3xl font-bold text-[#0A2533]">
              Upload your professional headshot
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#0A2533]">
              Professional Headshot
            </p>
            <HeadshotUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
