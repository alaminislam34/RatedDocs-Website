import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import { useStateContext } from "@/providers/StateProvider";
import {
  formSchema,
  FormValues,
} from "@/validation/Verification-doctor-phase/phase-form";

export default function MultiStepForm() {
  const { setVerificationStepReady, setVerificationCompletedStep } = useStateContext();
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
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
    console.log(data);
    setVerificationCompletedStep(2);
  };

  useEffect(() => {
    setVerificationStepReady(2, methods.formState.isValid);
  }, [methods.formState.isValid, setVerificationStepReady]);

  return (
    <FormProvider {...methods}>
      <form
        id="phase-2-verification-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <SterilizationSection />
        <ProcedurePricingSection />
        <GuaranteeSection />
      </form>
    </FormProvider>
  );
}
