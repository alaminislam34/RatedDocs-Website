import { dentistApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Shape of each step-check API response body
export interface StepCheckResponse {
    submitted: boolean;
    status: string | null;
    data?: Record<string, unknown>;
}

export type VerificationPhaseStep = 1 | 2 | 3;

const RDV_SCORE_BY_STEP: Record<VerificationPhaseStep, number> = {
    1: 30,
    2: 40,
    3: 30,
};

function isSubmitted(response?: StepCheckResponse) {
    return response?.submitted === true;
}

export default function useVerificationProgress() {
    const checkLicenseVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["licenseVerifyProgress"],
        queryFn: () =>
            dentistApi.stepOneCheck().then((res) => res?.data as StepCheckResponse),
        staleTime: 60_000,
        retry: false,
    });

    const checkPhotoVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["photoVerifyProgress"],
        queryFn: () =>
            dentistApi.stepTwoCheck().then((res) => res?.data as StepCheckResponse),
        staleTime: 60_000,
        retry: false,
    });

    const checkIdVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["idVerifyProgress"],
        queryFn: () =>
            dentistApi.stepThreeCheck().then((res) => res?.data as StepCheckResponse),
        staleTime: 60_000,
        retry: false,
    });

    const step1Submitted = isSubmitted(checkLicenseVerifyProgress.data);
    const step2Submitted = isSubmitted(checkPhotoVerifyProgress.data);
    const step3Submitted = isSubmitted(checkIdVerifyProgress.data);

    const submittedByStep: Record<VerificationPhaseStep, boolean> = {
        1: step1Submitted,
        2: step2Submitted,
        3: step3Submitted,
    };

    const nextIncompleteStep: VerificationPhaseStep = !step1Submitted
        ? 1
        : !step2Submitted
            ? 2
            : !step3Submitted
                ? 3
                : 3;

    const rdvScore = (Object.entries(submittedByStep) as [string, boolean][])
        .reduce((score, [step, submitted]) => {
            if (!submitted) return score;
            return score + RDV_SCORE_BY_STEP[Number(step) as VerificationPhaseStep];
        }, 0);

    const canAccessStep = (step: VerificationPhaseStep) => {
        if (step === 1) return true;
        if (step === 2) return step1Submitted;
        return step1Submitted && step2Submitted;
    };

    return {
        checkLicenseVerifyProgress,
        checkPhotoVerifyProgress,
        checkIdVerifyProgress,
        submittedByStep,
        nextIncompleteStep,
        rdvScore,
        canAccessStep,
        isProgressLoading:
            checkLicenseVerifyProgress.isLoading ||
            checkPhotoVerifyProgress.isLoading ||
            checkIdVerifyProgress.isLoading,
        isProgressError:
            checkLicenseVerifyProgress.isError ||
            checkPhotoVerifyProgress.isError ||
            checkIdVerifyProgress.isError,
    };
}
