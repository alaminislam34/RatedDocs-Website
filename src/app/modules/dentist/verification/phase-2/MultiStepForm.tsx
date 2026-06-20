"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import {
  formSchema,
  FormInputValues,
  FormValues,
} from "@/validation/Verification-doctor-phase/phase-form";
import useDentist from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

const mapProcedureNameToId = (name: string): number => {
  const n = name.toLowerCase();
  if (n.includes("implant")) return 1;
  if (n.includes("veneer")) return 2;
  if (n.includes("crown")) return 3;
  return 1;
};

export default function MultiStepForm() {
  const { setVerificationStepReady, setVerificationCompletedStep } =
    useVerificationStore();
  const { stepTwoMutation } = useDentist();
  const { checkPhotoVerifyProgress } = useVerificationProgress();

  const isAlreadySubmitted = checkPhotoVerifyProgress?.data?.submitted === true;

  const methods = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      sterilizationMethods: [],
      procedures: [
        { name: "Implant consultation", pricing: 250, notes: "Plan review" },
      ],
      signerFullName: "",
      typedSignature: "",
      agreeToGuarantee: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (isAlreadySubmitted) {
      toast.error(
        "Operations verification is already submitted and pending review.",
      );
      return;
    }

    const sterilization = {
      has_jci_certificate: Boolean(data.jciCertificate),
      jci_certificate: data.jciCertificate || null,
      certificate_number: "N/A",
      expiry_date: new Date().toISOString().split("T")[0],
      issuing_authority: "N/A",
      issue_date: new Date().toISOString().split("T")[0],
      walkthrough_video: data.videoWalkthrough || null,
      autoclave_brand: data.sterilizationMethods.includes("Autoclave"),
      sealed_pouch_visible: data.sterilizationMethods.includes("Sealed Pouch"),
      ultrasonic_cleaner_available:
        data.sterilizationMethods.includes("Ultrasonic"),
    };

    const procedures = data.procedures.map((p) => ({
      procedure: mapProcedureNameToId(p.name),
      price: Number(p.pricing),
      currency: "USD",
      option_notes: p.notes || "",
    }));

    const guarantee = {
      signer_name: data.signerFullName,
      typed_signature: data.typedSignature,
      accepted_terms: data.agreeToGuarantee,
    };
    console.log({
      sterilization,
      procedures,
      guarantee,
    });
    stepTwoMutation.mutate(
      {
        sterilization,
        procedures,
        guarantee,
      },
      {
        onSuccess: () => {
          toast.success("Operations verification details submitted!");
          setVerificationCompletedStep(2);
        },
        onError: (error: unknown) => {
          const errMsg =
            typeof error === "object" && error !== null
              ? (error as { response?: { data?: { message?: string } } })
                  .response?.data?.message ||
                "Operations verification submission failed. Please try again."
              : "Operations verification submission failed. Please try again.";
          toast.error(errMsg);
        },
      },
    );
  };

  useEffect(() => {
    if (isAlreadySubmitted) {
      setVerificationStepReady(2, true);
    } else {
      setVerificationStepReady(2, methods.formState.isValid);
    }
  }, [methods.formState.isValid, isAlreadySubmitted, setVerificationStepReady]);

  return (
    <FormProvider {...methods}>
      <form
        id="phase-2-verification-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <SterilizationSection />
        <ProcedurePricingSection />
        <GuaranteeSection />
        {stepTwoMutation.isPending && (
          <div className="flex justify-center items-center py-6 border-t bg-card">
            <Loader2 className="animate-spin h-6 w-6 text-[#0E3E65]" />
            <span className="ml-2 text-sm text-muted-foreground">
              Submitting Phase 2...
            </span>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
