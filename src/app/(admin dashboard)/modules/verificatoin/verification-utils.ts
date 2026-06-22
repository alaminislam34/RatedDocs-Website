import type { License } from "@/types/license";
import type { QueueStatus, VerificationDentist, VerificationStats } from "./types";

interface QueueResponseObject {
  results?: License[];
  data?: License[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } & Partial<VerificationStats>;
  counts?: Partial<VerificationStats>;
  status_counts?: Partial<VerificationStats>;
}

export const PAGE_SIZE = 50;

export const API_STATUS_BY_QUEUE_STATUS: Record<QueueStatus, string> = {
  pending: "SUBMITTED",
  approved: "APPROVED",
  rejected: "REJECTED",
};

export const mapApiStatus = (status: string): QueueStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === "APPROVED" || normalized === "VERIFIED") return "approved";
  if (normalized === "REJECTED") return "rejected";
  return "pending";
};

export function getRelativeTime(dateString: string | null | undefined) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays > 30) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0)
    return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

  return "just now";
}

function isQueueResponseObject(response: unknown): response is QueueResponseObject {
  return Boolean(response && typeof response === "object");
}

export function normalizeLicenseQueue(response: unknown) {
  const licenses = Array.isArray(response)
    ? response
    : isQueueResponseObject(response)
      ? response.data ?? response.results ?? []
      : [];

  const mappedLicenses = licenses.map<VerificationDentist>((license) => ({
    ...license,
    queue_status: mapApiStatus(license.status),
  }));

  const pageCounts = mappedLicenses.reduce(
    (acc, license) => {
      acc.total_dentists += 1;
      if (license.queue_status === "pending") acc.pending_review += 1;
      if (license.queue_status === "approved") acc.fully_approved += 1;
      if (license.queue_status === "rejected") acc.rejected += 1;
      return acc;
    },
    {
      total_dentists: 0,
      pending_review: 0,
      fully_approved: 0,
      rejected: 0,
    } satisfies VerificationStats,
  );

  const serverMeta = isQueueResponseObject(response) ? response.meta : undefined;
  const serverCounts = isQueueResponseObject(response)
    ? response.status_counts ?? response.counts
    : undefined;

  const meta: VerificationStats = {
    total_dentists: serverMeta?.total ?? serverMeta?.total_dentists ?? pageCounts.total_dentists,
    pending_review: serverCounts?.pending_review ?? serverMeta?.pending_review ?? pageCounts.pending_review,
    fully_approved: serverCounts?.fully_approved ?? serverMeta?.fully_approved ?? pageCounts.fully_approved,
    rejected: serverCounts?.rejected ?? serverMeta?.rejected ?? pageCounts.rejected,
  };

  return {
    mappedLicenses,
    meta,
    pagination: {
      page: serverMeta?.page ?? 1,
      limit: serverMeta?.limit ?? PAGE_SIZE,
      total: serverMeta?.total ?? mappedLicenses.length,
      totalPages: serverMeta?.totalPages ?? 1,
    },
  };
}
