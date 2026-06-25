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

export const useGetDentistById = (id: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dentistId", id],
        queryFn: () => globalDentist().getById(id),
    })

    return { data, isLoading, error }
}