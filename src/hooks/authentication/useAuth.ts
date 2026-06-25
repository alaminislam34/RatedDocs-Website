"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { LoginPayload, OtpPayload, RegisterPayload, userLoginPayload } from "./auth.interface";
import { ApiResponse, AuthResult } from "@/lib/api";
import { clearAuthSession, getRefreshToken, setAuthSession } from "@/lib/auth/session";

export const getAuthPayload = (response: ApiResponse<AuthResult> | AuthResult) => {
  return "data" in response ? response.data : response;
};

const getSessionUser = (payload: AuthResult, fallbackRole?: LoginPayload["role"]) => {
  const role =
    payload.user?.role ??
    payload.user?.type ??
    payload.role ??
    payload.type ??
    fallbackRole;

  if (!payload.user?.email && !payload.email && !role) return undefined;

  return {
    id: payload.user?.id ?? payload.user?.user_id ?? payload.user_id,
    email: payload.user?.email ?? payload.email,
    role,
    type: payload.user?.type ?? payload.type ?? role,
  };
};

export const persistSession = (
  response: ApiResponse<AuthResult> | AuthResult,
  fallbackRole?: LoginPayload["role"],
) => {
  const payload = getAuthPayload(response);
  const accessToken =
    payload.access ?? payload.accessToken ?? payload.access_token ?? payload.token;
  const refreshToken =
    payload.refresh ?? payload.refreshToken ?? payload.refresh_token;

  if (accessToken) {
    setAuthSession({
      accessToken,
      refreshToken,
      user: getSessionUser(payload, fallbackRole),
    });
  }

  return response;
};

export default function useAuth() {

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (response, variables) => persistSession(response, variables.role),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) =>
      authApi.login(data),
    onSuccess: (response, variables) => persistSession(response, variables.role),
  });

  const userLoginMutation = useMutation({
    mutationFn: (data: userLoginPayload) =>
      authApi.userLogin(data),
    onSuccess: (response) => persistSession(response),
  });

  const otpVerifyMutation = useMutation({
    mutationFn: (data: OtpPayload) => authApi.verifyOtp(data),
    onSuccess: (response) => persistSession(response),
  })

  const resendOtpMutation = useMutation({
    mutationFn: (data: { email: string }) => authApi.resendOtp(data),
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(getRefreshToken() as string),
    onSuccess: () => {
      clearAuthSession()
    },
  });

  return {
    registerMutation,
    loginMutation,
    otpVerifyMutation,
    resendOtpMutation,
    logoutMutation,
    isRegisterLoading: registerMutation.isPending,
    isLoginLoading: loginMutation.isPending,
    FisOtpVerifyLoading: otpVerifyMutation.isPending,
    isResendOtpLoading: resendOtpMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegisterError: registerMutation.isError,
    isLoginError: loginMutation.isError,
    isOtpVerifyError: otpVerifyMutation.isError,
    isResendOtpError: resendOtpMutation.isError,
    isLogoutError: logoutMutation.isError,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
    otpVerifyError: otpVerifyMutation.error,
    resendOtpError: resendOtpMutation.error,
    logoutError: logoutMutation.error,

    userLoginMutation,
    isUserLoginLoading: userLoginMutation.isPending,
    isUserLoginError: userLoginMutation.isError,
    userLoginError: userLoginMutation.error,
  };
}
