import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import {
  formSchema,
  FormValues,
} from "@/validation/Verification-doctor-phase/phase-form";

export default function MultiStepForm() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
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
  };
  return (
    <div className=" divide-y divide-gray-100">
      <div className="">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="divide-y divide-slate-100"
          >
            <SterilizationSection />
            <ProcedurePricingSection />
            <GuaranteeSection />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
