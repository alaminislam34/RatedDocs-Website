import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, getcurrentSession } from "@/lib/api";
import { LoginPayload, OtpPayload, RegisterPayload } from "./auth.interface";
import { ApiResponse, AuthResult } from "@/lib/api";
import { clearAuthSession, getRefreshToken, setAuthSession } from "@/lib/auth/session";

export const getAuthPayload = (response: ApiResponse<AuthResult> | AuthResult) => {
  return "data" in response ? response.data : response;
};


export const persistSession = (response: ApiResponse<AuthResult> | AuthResult) => {
  const payload = getAuthPayload(response);
  const accessToken = payload.access ?? payload.accessToken ?? payload.token;

  if (accessToken) {
    setAuthSession({
      accessToken,
      refreshToken: payload.refresh ?? payload.refreshToken,
      user: payload.user,
    });
  }

  return response;
};

export default function useAuth() {

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: persistSession,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) =>
      authApi.login(data),
    onSuccess: persistSession,
  });

  const otpVerifyMutation = useMutation({
    mutationFn: (data: OtpPayload) => authApi.verifyOtp(data),
    onSuccess: persistSession,
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
    logoutError: logoutMutation.error
  };
}