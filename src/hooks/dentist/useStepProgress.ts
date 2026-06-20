import { dentistApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Shape of each step-check API response body
export interface StepCheckResponse {
    submitted: boolean;
    status: string | null;
    data?: Record<string, unknown>;
}

export default function useVerificationProgress() {
    const checkLicenseVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["licenseVerifyProgress"],
        queryFn: () =>
            dentistApi.stepOneCheck().then((res) => res?.data as StepCheckResponse),
    });

    const checkPhotoVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["photoVerifyProgress"],
        queryFn: () =>
            dentistApi.stepTwoCheck().then((res) => res?.data as StepCheckResponse),
    });

    const checkIdVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["idVerifyProgress"],
        queryFn: () =>
            dentistApi.stepThreeCheck().then((res) => res?.data as StepCheckResponse),
    });

    return { checkLicenseVerifyProgress, checkPhotoVerifyProgress, checkIdVerifyProgress };
}