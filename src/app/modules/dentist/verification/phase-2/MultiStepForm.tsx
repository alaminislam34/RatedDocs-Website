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

export default function MultiStepForm() {
  const { setVerificationStepReady, setVerificationCompletedStep } =
    useVerificationStore();
  const { stepTwoMutation } = useDentist();
  const { checkPhotoVerifyProgress } = useVerificationProgress();

  const progressData = checkPhotoVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const methods = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      jciCertificate: null,
      videoWalkthrough: null,
      procedures: [{ name: "Implant consultation", price: 250, notes: "" }],
      signerFullName: "",
      typedSignature: "",
      agreeToGuarantee: false,
    },
  });

  useEffect(() => {
    if (isAlreadySubmitted && progressData?.data) {
      const serverData = progressData.data as any;

      let procedures = [];
      try {
        procedures =
          typeof serverData.procedures === "string"
            ? JSON.parse(serverData.procedures)
            : serverData.procedures || [];
      } catch (e) {
        procedures = serverData.procedures || [];
      }

      let guarantee = {} as any;
      try {
        guarantee =
          typeof serverData.guarantee === "string"
            ? JSON.parse(serverData.guarantee)
            : serverData.guarantee || {};
      } catch (e) {
        guarantee = serverData.guarantee || {};
      }

      methods.reset({
        jciCertificate: serverData.jci_certificate
          ? new File([], "JCI Certificate")
          : null,
        videoWalkthrough: serverData.walkthrough_video
          ? new File([], "Video Walkthrough")
          : null,
        procedures: procedures.map((p: any) => ({
          id: p.procedure_id,
          name: p.procedure_name || p.name,
          price: p.price,
          notes: p.option_notes || p.notes || "",
        })),
        signerFullName: guarantee.signer_name || "",
        typedSignature: guarantee.typed_signature || "",
        agreeToGuarantee: guarantee.accepted_terms || false,
      });
    }
  }, [isAlreadySubmitted, progressData, methods]);

  const onSubmit = (data: FormValues) => {
    if (isAlreadySubmitted) {
      toast.error(
        "Operations verification is already submitted and pending review.",
      );
      return;
    }

    const procedures = data.procedures.map((p) => ({
      procedure_id: p.id,
      procedure_name: p.name,
      price: p.price,
      currency: "USD",
      option_notes: p.notes || "",
    }));

    const guarantee = {
      signer_name: data.signerFullName,
      typed_signature: data.typedSignature,
      accepted_terms: data.agreeToGuarantee,
    };

    const payload = {
      jci_certificate: data.jciCertificate || null,
      walkthrough_video: data.videoWalkthrough || null,
      procedures,
      guarantee,
    };
    console.log(payload);
    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        setVerificationCompletedStep(2);
      },
      onError: (error: unknown) => {
        const errMsg =
          typeof error === "object" && error !== null
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message ||
              "Operations verification submission failed. Please try again."
            : "Operations verification submission failed. Please try again.";
        toast.error(errMsg);
      },
    });
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
        className="space-y-0"
      >
        <SterilizationSection disabled={isAlreadySubmitted} />
        <ProcedurePricingSection disabled={isAlreadySubmitted} />
        <GuaranteeSection disabled={isAlreadySubmitted} />
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
