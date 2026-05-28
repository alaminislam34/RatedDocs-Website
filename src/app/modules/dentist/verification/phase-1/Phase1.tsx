"use client";

import { useEffect, useMemo, useState } from "react";
import LicenceForm from "./licence-form";
import { VerificationResult } from "./match-found";
import { useStateContext } from "@/providers/StateProvider";
import { HeadshotUpload } from "./headshot-upload";
import { cn } from "@/lib/utils";
import PhaseStep from "../PhaseStep";

type SubmittedLicence = {
  country: string;
  city: string;
  authority: string;
  regNo: string;
};

export default function Phase1() {
  const {
    verificationStatus,
    setVerificationStatus,
    setVerificationStepReady,
  } = useStateContext();
  const [submittedLicence, setSubmittedLicence] =
    useState<SubmittedLicence | null>(null);
  const [isProfileConfirmed, setIsProfileConfirmed] = useState(false);
  const [isLicenceImported, setIsLicenceImported] = useState(false);
  const [hasHeadshot, setHasHeadshot] = useState(false);

  const handleVerify = (data: SubmittedLicence) => {
    setSubmittedLicence(data);
    setIsProfileConfirmed(false);
    setIsLicenceImported(false);

    if (data.regNo === "CA-123456") {
      setVerificationStatus("match");
      return;
    }

    setVerificationStatus("no-match");
  };

  const isStepReady = useMemo(() => {
    if (verificationStatus === "match") {
      return isProfileConfirmed && hasHeadshot;
    }

    if (verificationStatus === "no-match") {
      return isLicenceImported && hasHeadshot;
    }

    return false;
  }, [hasHeadshot, isLicenceImported, isProfileConfirmed, verificationStatus]);

  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady, setVerificationStepReady]);

  const handleConfirmProfile = () => {
    setIsProfileConfirmed(true);
  };

  const handleRejectProfile = () => {
    setVerificationStatus("no-match");
    setIsProfileConfirmed(false);
    setIsLicenceImported(false);
  };

  const licenceSummary = submittedLicence
    ? [
        { label: "Country", value: submittedLicence.country },
        { label: "City", value: submittedLicence.city },
        { label: "Authority", value: submittedLicence.authority },
        { label: "Reg No", value: submittedLicence.regNo },
      ]
    : [];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
          <PhaseStep step={1} title="Verify your dental licence" />

          <div className="space-y-5">
            <LicenceForm onVerify={handleVerify} />

            {verificationStatus !== "idle" && (
              <VerificationResult
                status={verificationStatus}
                doctorName="Dr. Alex Hemsworth"
                specialty="Orthodontist"
                licenceInfo={submittedLicence}
                onConfirm={handleConfirmProfile}
                onReject={handleRejectProfile}
                onFileSelect={() => setIsLicenceImported(true)}
              />
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
            <PhaseStep step={2} title="Upload your professional headshot" />

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Professional headshot
              </p>
              <HeadshotUpload
                onChange={(file) => setHasHeadshot(Boolean(file))}
              />
              <p
                className={cn(
                  "text-xs",
                  isStepReady ? "text-success-700" : "text-muted-foreground",
                )}
              >
                {isStepReady
                  ? "Phase 1 is ready to complete."
                  : "Complete the verification or upload flow and add your headshot to continue."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
