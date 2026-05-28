"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeDentistData } from "@/lib/storage/dentistData";
import { initializeBookingData } from "@/lib/storage/bookingService";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

export type kolSteps =
  | "Basic Info"
  | "Bio & Languages"
  | "Contact"
  | "Media & Notes";

interface StateContextType {
  verificationStatus: "idle" | "match" | "no-match";
  setVerificationStatus: React.Dispatch<
    React.SetStateAction<"idle" | "match" | "no-match">
  >;
  verificationStep: number;
  setVerificationStep: React.Dispatch<React.SetStateAction<number>>;
  verificationStepReady: Record<number, boolean>;
  setVerificationStepReady: (
    step: number,
    ready: boolean,
  ) => void;
  verificationCompletedStep: number | null;
  setVerificationCompletedStep: React.Dispatch<React.SetStateAction<number | null>>;
  showSignupModal: boolean;
  setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPersonalizeModal: boolean;
  setShowPersonalizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCompareModal: boolean;
  setShowCompareModal: React.Dispatch<React.SetStateAction<boolean>>;
  compareModalPurpose: "compare" | "postBooking" | null;
  setCompareModalPurpose: React.Dispatch<
    React.SetStateAction<"compare" | "postBooking" | null>
  >;
  showBookingModal: string | null;
  setShowBookingModal: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDentistId: string | null;
  setSelectedDentistId: React.Dispatch<React.SetStateAction<string | null>>;
  setSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  schedule: boolean;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  dentistsToCompare: Dentist[];
  setDentistsToCompare: React.Dispatch<React.SetStateAction<Dentist[]>>;
  kolModalOpen: boolean;
  setKolModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addKolStep: kolSteps;
  setAddKolStep: React.Dispatch<React.SetStateAction<kolSteps>>;

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isNewestFirst: boolean;
  setIsNewestFirst: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

export type dentistBookingTabs = "In Progress" | "Completed" | "Rejected";

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "match" | "no-match"
  >("idle");
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [verificationStepReady, setVerificationStepReadyState] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const [verificationCompletedStep, setVerificationCompletedStep] = useState<number | null>(null);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showPersonalizeModal, setShowPersonalizeModal] =
    useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [compareModalPurpose, setCompareModalPurpose] = useState<
    "compare" | "postBooking" | null
  >("compare");
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null,
  );
  const [schedule, setSchedule] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("");
  const [dentistsToCompare, setDentistsToCompare] = useState<Dentist[]>([]);
  const [kolModalOpen, setKolModalOpen] = useState(false);
  const [addKolStep, setAddKolStep] = useState<kolSteps>("Basic Info");

  // tabbar state for dentist booking manage page

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewestFirst, setIsNewestFirst] = useState(true);

  // Initialize storage data on mount
  useEffect(() => {
    initializeDentistData();
    initializeBookingData();
  }, []);

  const setVerificationStepReady = useCallback(
    (step: number, ready: boolean) => {
      setVerificationStepReadyState((current) => {
        if (current[step] === ready) {
          return current;
        }

        return {
          ...current,
          [step]: ready,
        };
      });
    },
    [],
  );

  const value = {
    verificationStatus,
    setVerificationStatus,
    verificationStep,
    setVerificationStep,
    verificationStepReady,
    setVerificationStepReady,
    verificationCompletedStep,
    setVerificationCompletedStep,
    showSignupModal,
    setShowSignupModal,
    showPersonalizeModal,
    setShowPersonalizeModal,
    showCompareModal,
    setShowCompareModal,
    compareModalPurpose,
    setCompareModalPurpose,
    showBookingModal,
    setShowBookingModal,
    selectedDentistId,
    setSelectedDentistId,
    schedule,
    setSchedule,
    activeTab,
    setActiveTab,
    dentistsToCompare,
    setDentistsToCompare,
    kolModalOpen,
    setKolModalOpen,
    addKolStep,
    setAddKolStep,
    searchQuery,
    setSearchQuery,
    isNewestFirst,
    setIsNewestFirst,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
