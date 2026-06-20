// Example: How to use the new store hooks for better state management

// BEFORE (using StateProvider directly):
import { useStateContext } from "@/providers/StateProvider";
import { VerificationResult } from "../module/Match-found";

export default function Phase1() {
  const {
    verificationStatus,
    setVerificationStatus,
    verificationStepReady,
    setVerificationStepReady,
  } = useStateContext();
  
  // All verification states are mixed together with UI and data states
}

// AFTER (using specific store hooks):
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import { VerificationResult } from "../module/Match-found";

export default function Phase1() {
  const {
    verificationStatus,
    setVerificationStatus,
    verificationStepReady,
    setVerificationStepReady,
  } = useVerificationStore();
  
  // Only verification-related states - cleaner and type-safe
}

// USAGE EXAMPLES:

// 1. Verification UI Component (e.g., verification-steps.tsx)
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
export function VerificationSteps() {
  const { verificationStep } = useVerificationStore();
  // Only has access to verification step and step functions
}

// 2. Verification Data Component (e.g., Phase1.tsx)
import { useVerificationStore, useDataStoreForVerification } from "@/lib/hooks/verification-store-hooks";
export function Phase1() {
  const {
    verificationStatus,
    setVerificationStatus,
    verificationStepReady,
    setVerificationStepReady,
  } = useVerificationStore();
  
  const {
    selectedDentistId,
    setSelectedDentistId,
    schedule,
    setSchedule,
  } = useDataStoreForVerification();
  
  // Verification logic + data operations separately
}

// 3. Verification Modal Component
import { useUiStoreForVerification } from "@/lib/hooks/verification-store-hooks";
export function VerificationModal() {
  const {
    showSignupModal,
    showSigninModal,
    setActiveModal,
  } = useUiStoreForVerification();
  
  // Only modal-related state
}

// BENEFITS:
// 1. Type-safe: Each hook returns only the states and functions relevant to its purpose
// 2. Clearer intent: Component name clearly indicates what state it uses
// 3. Less coupling: Components don't depend on StateProvider context
// 4. Easier testing: Can test hooks independently
// 5. Better performance: Only relevant states are re-rendered when changed