"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import {
  getBookingData,
  getBookingDraft,
  getFrontSmileFile,
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
import { Loader2 } from "lucide-react";

const TOTAL_STEPS = 6;

export default function IntakeModal() {
  const [step, setStep] = useState(() => getBookingDraft().currentStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    showBookingModal,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    setSchedule,
  } = useStateContext();

  const progress = (step / TOTAL_STEPS) * 100;

  const syncStep = (nextStep: number) => {
    setStep(nextStep);
    setBookingCurrentStep(nextStep);
  };

  const validateStep = (): boolean => {
    const data = getBookingData();

    switch (step) {
      case 1: {
        const { firstName, lastName, dateOfBirth, country } =
          data.personalInfo;
        if (!firstName || !lastName || !dateOfBirth || !country) {
          toast.error("Please fill in all required personal information fields");
          return false;
        }
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
      throw new Error("Please complete the previous booking step first.");
    }
    return consultationId;
  };

  const getResultConsultationId = (response: unknown) => {
    const payload = response as {
      data?: {
        id?: string | number;
        consultation_id?: string | number;
        data?: {
          id?: string | number;
          consultation_id?: string | number;
        };
      };
      id?: string | number;
      consultation_id?: string | number;
    };

    return (
      payload.data?.consultation_id ??
      payload.data?.id ??
      payload.data?.data?.consultation_id ??
      payload.data?.data?.id ??
      payload.consultation_id ??
      payload.id ??
      null
    );
  };

  const submitCurrentStep = async () => {
    const data = getBookingData();

    if (step === 1) {
      const response = await consultationBookingApi.stepOne({
        first_name: data.personalInfo.firstName,
        last_name: data.personalInfo.lastName,
        country: data.personalInfo.country,
        date_of_birth: data.personalInfo.dateOfBirth,
      });
      const consultationId = getResultConsultationId(response);
      if (consultationId) setConsultationId(consultationId);
      return;
    }

    if (step === 2) {
      await consultationBookingApi.stepTwo({
        procedures: data.procedureIds,
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
      if (!frontSmile) throw new Error("Please upload your front smile photo");
      await consultationBookingApi.stepFive({
        consultation_id: getRequiredConsultationId(),
        front_smile: frontSmile,
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
      toast.error("Please complete the first step before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitCurrentStep();
      markBookingStepComplete(step);

      if (step < TOTAL_STEPS) {
        syncStep(step + 1);
        return;
      }

      updateBookingData({ currentStep: TOTAL_STEPS });
      toast.success("Your consultation details are saved.");
      setShowBookingModal(null);
      setCompareModalPurpose("postBooking");
      setSchedule(true);
      setShowCompareModal(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
      <DialogContent className="sm:max-w-212 max-h-[90vh] overflow-y-auto w-full p-0 border-none rounded-xl bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consultation
          </DialogTitle>
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
