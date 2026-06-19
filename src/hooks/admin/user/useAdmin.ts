import { adminApi } from "@/lib/api";
import type { ListParams } from "@/lib/api/services";
import type { License } from "@/types/license";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface UseAdminOptions {
  licenseQueueParams?: ListParams;
}

export default function useAdmin(options: UseAdminOptions = {}) {
  const getLicenseQueue = useQuery({
    queryKey: ["admin", "licenseQueue", options.licenseQueueParams],
    queryFn: () => adminApi.listLicenseQueue<License>(options.licenseQueueParams),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    getLicenseQueue,
    isLicenseQueueLoading: getLicenseQueue.isLoading,
    isLicenseQueueError: getLicenseQueue.isError,
  };
}
