"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import {
  getBookingData,
  getBookingDraft,
  getFrontSmileFile,
  getWideSmileFile,
  getUpperArchFile,
  getLowerArchFile,
  getLeftSideFile,
  getRightSideFile,
  getXrayFile,
  markBookingStepComplete,
  setBookingCurrentStep,
  setConsultationId,
  updateBookingData,
} from "@/lib/storage/bookingService";
import toast from "react-hot-toast";
import PersonalInfoForm from "./BookingIntakeForm/PersonalInfoForm";
import ProcedureSelectionForm from "./BookingIntakeForm/ProcedureSelectionForm";
import TreatmentDetailsForm from "./BookingIntakeForm/TreatmentDetailsForm";
import DentalHistoryForm from "./BookingIntakeForm/DentalHistoryForm";
import PhotoUploadForm from "./BookingIntakeForm/PhotoUploadForm";
import XRayUploadForm from "./BookingIntakeForm/XRayUploadForm";
import { consultationBookingApi, getApiErrorMessage } from "@/lib/api";
import { Loader2, X } from "lucide-react";

import {
  useConsultationStepOne,
  useConsultationStepTwo,
  useGetConsultationId,
} from "@/hooks/patient/useConsultationBooking";

const TOTAL_STEPS = 6;

export default function IntakeModal() {
  const [step, setStep] = useState(() => getBookingDraft().currentStep);
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);
  const stepOneMutation = useConsultationStepOne();
  const stepTwoMutation = useConsultationStepTwo();
  const getConsultationIdMutation = useGetConsultationId();
  const isSubmitting =
    stepOneMutation.isPending ||
    stepTwoMutation.isPending ||
    getConsultationIdMutation.isPending ||
    isLocalSubmitting;

  const {
    showBookingModal,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    setSchedule,
  } = useStateContext();

  useEffect(() => {
    if (showBookingModal === "book" && !getBookingDraft().consultationId) {
      console.log(
        "[DEBUG] Booking modal opened & consultation ID missing. Fetching from backend...",
      );
      getConsultationIdMutation.mutate();
    }
  }, [showBookingModal]);

  const progress = (step / TOTAL_STEPS) * 100;

  const syncStep = (nextStep: number) => {
    setStep(nextStep);
    setBookingCurrentStep(nextStep);
  };

  const validateStep = (): boolean => {
    const data = getBookingData();

    switch (step) {
      case 1: {
        return true;
      }
      case 2:
        if (data.procedureIds.length === 0) {
          toast.error("Please select at least one procedure");
          return false;
        }
        return true;
      case 3:
        if (!data.budget || !data.travelFrom || !data.travelTo) {
          toast.error("Please fill in your budget and travel dates");
          return false;
        }
        return true;
      case 4:
        if (!data.dentalHistory.lastVisit) {
          toast.error("Please select when you last visited a dentist");
          return false;
        }
        return true;
      case 5:
        if (!getFrontSmileFile()) {
          toast.error("Please upload your front smile photo");
          return false;
        }
        if (!getWideSmileFile()) {
          toast.error("Please upload your wide smile photo");
          return false;
        }
        if (!getLowerArchFile()) {
          toast.error("Please upload your lower arch photo");
          return false;
        }
        return true;
      case 6:
        if (!getXrayFile()) {
          toast.error("Please upload your X-ray file");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const getRequiredConsultationId = () => {
    const consultationId = getBookingDraft().consultationId;
    if (!consultationId) {
      toast.error("Consultation session not found. Please complete step 1.");
      throw new Error("Missing consultation ID");
    }
    const id = Number(consultationId);
    if (!Number.isFinite(id)) {
      toast.error("Invalid consultation session. Please restart.");
      throw new Error("Invalid consultation ID");
    }
    return id;
  };

  const getResultConsultationId = (response: unknown) => {
    const payload = response as any;
    if (!payload) return null;

    if (typeof payload === "number" || typeof payload === "string") {
      return payload;
    }

    if (payload.data !== undefined && payload.data !== null) {
      if (
        typeof payload.data === "number" ||
        typeof payload.data === "string"
      ) {
        return payload.data;
      }
    }

    return (
      payload.consultation?.id ??
      payload.data?.consultation?.id ??
      payload.data?.consultation_id ??
      payload.data?.id ??
      payload.data?.data?.consultation_id ??
      payload.data?.data?.id ??
      payload.consultation_id ??
      payload.id ??
      (typeof payload.consultation === "number" ||
      typeof payload.consultation === "string"
        ? payload.consultation
        : null) ??
      (typeof payload.data?.consultation === "number" ||
      typeof payload.data?.consultation === "string"
        ? payload.data.consultation
        : null) ??
      null
    );
  };

  const submitCurrentStep = async () => {
    const data = getBookingData();

    if (step === 1) {
      const response = await stepOneMutation.mutateAsync({
        first_name: data.personalInfo.firstName,
        last_name: data.personalInfo.lastName,
        country: data.personalInfo.country,
        date_of_birth: data.personalInfo.dateOfBirth,
      });
      const consultationId = getResultConsultationId(response);
      console.log(
        "[DEBUG] submitCurrentStep: Extracted Consultation ID:",
        consultationId,
      );
      if (consultationId) {
        setConsultationId(consultationId);
      } else {
        console.warn(
          "[DEBUG] submitCurrentStep: No consultation ID found in response:",
          response,
        );
      }
      return;
    }

    if (step === 2) {
      const consultationId = getBookingDraft().consultationId;
      if (!consultationId) {
        toast.error("Consultation session not found. Please complete step 1.");
        throw new Error("Missing consultation ID");
      }
      await stepTwoMutation.mutateAsync({
        procedures: data.procedureIds,
        consultation_id: Number(consultationId),
      });
      return;
    }

    if (step === 3) {
      await consultationBookingApi.stepThree({
        consultation_id: getRequiredConsultationId(),
        approximate_budget: Number(String(data.budget).replace(/[^0-9.]/g, "")),
        travel_start_date: data.travelFrom,
        travel_end_date: data.travelTo,
      });
      return;
    }

    if (step === 4) {
      await consultationBookingApi.stepFour({
        consultation_id: getRequiredConsultationId(),
        last_dentist_visit: data.dentalHistory.lastVisit,
        conditions: data.dentalHistory.conditions.filter(
          (condition) => condition !== "None of them",
        ),
        notes: data.dentalHistory.additionalInfo,
      });
      return;
    }

    if (step === 5) {
      const frontSmile = getFrontSmileFile();
      const wideSmile = getWideSmileFile();
      const lowerArch = getLowerArchFile();
      if (!frontSmile) throw new Error("Please upload your front smile photo");
      if (!wideSmile) throw new Error("Please upload your wide smile photo");
      if (!lowerArch) throw new Error("Please upload your lower arch photo");

      await consultationBookingApi.stepFive({
        consultation_id: getRequiredConsultationId(),
        front_smile: frontSmile,
        wide_smile: wideSmile,
        upper_arch: getUpperArchFile(),
        lower_arch: lowerArch,
        left_side: getLeftSideFile(),
        right_side: getRightSideFile(),
      });
      return;
    }

    if (step === 6) {
      const file = getXrayFile();
      if (!file) throw new Error("Please upload your X-ray file");
      await consultationBookingApi.stepSix({
        consultation_id: getRequiredConsultationId(),
        file,
        notes: data.xrayNotes,
      });
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    const draft = getBookingDraft();
    if (step > 1 && !draft.consultationId) {
      toast.error(
        "Consultation session not found. Please complete step 1 first.",
      );
      return;
    }

    try {
      setIsLocalSubmitting(true);
      await submitCurrentStep();
      markBookingStepComplete(step);

      if (step < TOTAL_STEPS) {
        syncStep(step + 1);
        return;
      }

      updateBookingData({ currentStep: TOTAL_STEPS });
      setShowBookingModal(null);
      setCompareModalPurpose("postBooking");
      setSchedule(true);
      setShowCompareModal(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLocalSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) syncStep(step - 1);
  };

  const handleClose = () => {
    setShowBookingModal(null);
  };

  return (
    <Dialog open={showBookingModal === "book"} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-212 max-h-[90vh] overflow-y-auto w-11/12 mx-auto p-0 border-none rounded-xl bg-white"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-8 py-6 border-b border-[#F3F4F6] flex items-center justify-between">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consultation
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-[#6B7280] hover:text-[#1A1A2E] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Progress bar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#113254] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[#6B7280] font-medium text-[14px] whitespace-nowrap">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Step content */}
          <div>
            {step === 1 && <PersonalInfoForm />}
            {step === 2 && <ProcedureSelectionForm />}
            {step === 3 && <TreatmentDetailsForm />}
            {step === 4 && <DentalHistoryForm />}
            {step === 5 && <PhotoUploadForm />}
            {step === 6 && <XRayUploadForm />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-[#F3F4F6]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3.5 bg-white border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-[16px] rounded-xl hover:bg-[#F9FAFB] active:scale-95 transition-all"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-12 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[16px] rounded-xl active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="size-5 animate-spin" />}
              {step === TOTAL_STEPS ? "Submit and Get Estimates" : "Continue"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
