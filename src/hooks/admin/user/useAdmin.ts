import { persistSession } from "@/hooks/authentication/useAuth";
import { adminApi } from "@/lib/api";
import { LoginPayload } from "@/hooks/authentication/auth.interface";
import { useMutation } from "@tanstack/react-query";

export function useAdminLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      adminApi.login({ ...data, role: "ADMIN" }),
    onSuccess: persistSession,
  });
}
