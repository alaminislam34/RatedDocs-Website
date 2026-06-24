"use client";

import { useEffect, useMemo, useState } from "react";
import LicenceForm from "./licence-form";
import { HeadshotUpload } from "./headshot-upload";
import { cn } from "@/lib/utils";
import PhaseStep from "../PhaseStep";
import useDentist from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
/*
Type 'SubmittedLicence | null | undefined' is not assignable to type 'Partial<{ country: string; city: string; authority: number; regNo: string; }> | undefined'.
  Type 'null' is not assignable to type 'Partial<{ country: string; city: string; authority: number; regNo: string; }> | undefined'.
*/
type SubmittedLicence = {
  country: string;
  city: string;
  authority: number;
  regNo: string;
};

type LicenseProgressData = {
  country: string;
  city: string;
  registration_authority: number;
  registration_no: string;
  professional_headshot?: string;
};

export default function Phase1() {
  const {
    setVerificationStepReady,
    setVerificationCompletedStep,
    setVerificationStep,
  } = useVerificationStore();

  const [submittedLicence, setSubmittedLicence] =
    useState<SubmittedLicence | null>(null);

  const { checkLicenseVerifyProgress } = useVerificationProgress();
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);

  const { stepOneMutation } = useDentist();

  const progressData = checkLicenseVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const serverSubmittedLicence = useMemo<SubmittedLicence | null>(() => {
    if (progressData?.submitted !== true || !progressData.data) {
      return null;
    }

    const serverData = progressData.data as LicenseProgressData;
    return {
      country: serverData.country,
      city: serverData.city,
      authority: serverData.registration_authority,
      regNo: serverData.registration_no,
    };
  }, [progressData]);

  const handleVerify = (data: SubmittedLicence) => {
    setSubmittedLicence(data);
  };

  const hasHeadshot = Boolean(
    headshotFile ||
    (progressData?.data as LicenseProgressData | undefined)
      ?.professional_headshot,
  );

  const isStepReady = useMemo(() => {
    if (isAlreadySubmitted) return true;

    return Boolean(submittedLicence && hasHeadshot);
  }, [hasHeadshot, isAlreadySubmitted, submittedLicence]);

  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady, setVerificationStepReady]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAlreadySubmitted) {
      setVerificationStep(2);
      setVerificationCompletedStep(1);
      return;
    }

    if (!isStepReady || !submittedLicence || !headshotFile) {
      toast.error("Please complete all verification steps first.");
      return;
    }

    const fileToUpload = new File(["verified match"], "licence.pdf", {
      type: "application/pdf",
    });

    stepOneMutation.mutate(
      {
        country: submittedLicence.country,
        city: submittedLicence.city,
        registration_authority: submittedLicence.authority,
        registration_no: submittedLicence.regNo,
        professional_headshot: headshotFile,
        file: fileToUpload,
      },
      {
        onSuccess: () => {
          setVerificationCompletedStep(1);
        },
        onError: (error: unknown) => {
          const backendError =
            typeof error === "object" && error !== null
              ? ((
                  error as {
                    response?: { data?: { detail?: { error?: string } } };
                    message?: string;
                  }
                ).response?.data?.detail?.error ??
                (error as { message?: string }).message)
              : undefined;
          toast.error(
            backendError || "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
          <PhaseStep step={1} title="Verify your dental licence" />

          <div className="space-y-5">
            <LicenceForm
              onVerify={handleVerify}
              defaultValues={
                isAlreadySubmitted
                  ? (serverSubmittedLicence ?? submittedLicence)
                  : undefined
              }
              isAlreadySubmitted={isAlreadySubmitted}
            />
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
                disabled={isAlreadySubmitted}
                onChange={(file) => {
                  setHeadshotFile(file);
                }}
                existingImageUrl={
                  (progressData?.data as LicenseProgressData | undefined)
                    ?.professional_headshot
                }
              />
              <p
                className={cn(
                  "text-xs",
                  isStepReady ? "text-green-600" : "text-muted-foreground",
                )}
              >
                {isAlreadySubmitted
                  ? "This phase has been successfully submitted and is under review."
                  : isStepReady
                    ? "Phase 1 is ready to complete."
                    : "Complete the verification or upload flow and add your headshot to continue."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        id="phase-1-verification-form"
        onSubmit={onSubmit}
        className="hidden"
      />
    </div>
  );
}
