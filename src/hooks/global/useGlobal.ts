// here is create dentist list get hook

import { globalDentist } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useGlobalDentist = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["globalDentist"],
        queryFn: () => globalDentist().list(),
    })

    return { data, isLoading, error }
}