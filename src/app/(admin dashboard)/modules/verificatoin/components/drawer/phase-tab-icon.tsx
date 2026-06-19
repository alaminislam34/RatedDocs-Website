import { CheckCircle2, Clock, Lock, XCircle } from "lucide-react";
import type { PhaseStatus } from "../../types";

export function PhaseTabIcon({ status }: { status: PhaseStatus }) {
  if (status === "approved") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }

  if (status === "pending") {
    return <Clock className="h-4 w-4 text-amber-500" />;
  }

  if (status === "rejected") {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }

  return <Lock className="h-4 w-4 text-gray-300" />;
}
