import axios, { type AxiosError } from "axios";

type ErrorPayload = {
  message?: string;
  error?: string;
  errors?: Record<string, string[] | string> | string[];
  detail?:
    | string
    | {
        message?: string;
        error?: string;
        non_field_errors?: string[] | string;
      };
  non_field_errors?: string[] | string;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: ErrorPayload["errors"];

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: ErrorPayload["errors"],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const getPayloadMessage = (payload?: ErrorPayload | string) => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;

  const detail = payload.detail;
  const errors = payload.errors;
  const nonFieldErrors =
    payload.non_field_errors ??
    (typeof detail === "object" ? detail.non_field_errors : undefined);

  if (Array.isArray(nonFieldErrors)) return nonFieldErrors.join(" ");
  if (typeof nonFieldErrors === "string") return nonFieldErrors;
  if (typeof detail === "string") return detail;
  if (Array.isArray(errors)) return errors.join(" ");
  if (errors && typeof errors === "object") {
    const firstError = Object.entries(errors)[0];
    if (firstError) {
      const [field, value] = firstError;
      const message = Array.isArray(value) ? value.join(" ") : value;
      return `${field}: ${message}`;
    }
  }

  return (
    payload.message ??
    payload.error ??
    detail?.message ??
    detail?.error ??
    null
  );
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorPayload | string>;
    const status = axiosError.response?.status;
    const payload = axiosError.response?.data;
    const message =
      getPayloadMessage(payload) ??
      (status
        ? `Request failed with status ${status}`
        : "Network request failed");

    return new ApiError(
      message,
      status,
      axiosError.code,
      typeof payload === "object" ? payload?.errors : undefined,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Something went wrong. Please try again.");
}

export function getApiErrorMessage(error: unknown) {
  return normalizeApiError(error).message;
}
