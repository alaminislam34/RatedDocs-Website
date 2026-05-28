"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VerificationNextStepModalProps {
  open: boolean;
  step: number;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

type ModalContent = {
  title: string;
  description: string;
  actionLabel: string;
};

const MODAL_CONTENT: Record<1 | 2 | 3, ModalContent> = {
  1: {
    title: "License verified",
    description:
      "You’ve completed Phase 1. Continue to Phase 2 to submit operations details and keep moving through verification.",
    actionLabel: "Continue Phase 2",
  },
  2: {
    title: "Operations submitted for review",
    description:
      "You’ve completed Phase 2. Continue to Phase 3 to upload your clinical documents and finish the verification flow.",
    actionLabel: "Continue Phase 3",
  },
  3: {
    title: "Verification complete",
    description:
      "Your verification is finished. You can return to the dashboard to manage your account.",
    actionLabel: "Go to dashboard",
  },
};

export function VerificationNextStepModal({
  open,
  step,
  onOpenChange,
  onContinue,
}: VerificationNextStepModalProps) {
  const modalContent =
    MODAL_CONTENT[Math.min(Math.max(step, 1), 3) as 1 | 2 | 3];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-136 rounded-2xl border border-border bg-card p-0 shadow-2xl">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <DialogHeader className="items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <span className="text-2xl font-semibold">✓</span>
            </div>
            <DialogTitle className="mt-5 text-center text-2xl font-semibold text-foreground">
              {modalContent.title}
            </DialogTitle>
            <DialogDescription className="max-w-md text-center text-sm leading-6 text-muted-foreground">
              {modalContent.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex items-center justify-center border-0 bg-transparent p-0">
            <div className="flex items-center justify-center mx-auto">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-lg px-6 font-semibold"
                onClick={onContinue}
              >
                {modalContent.actionLabel}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
