import { apiClient } from "./client";

/**
 * Wraps the auth endpoints that exist on the backend:
 *   POST /api/auth/register
 *   POST /api/auth/otp/generate
 *   POST /api/auth/otp/verify
 *
 * Pages call these functions rather than `apiClient` directly, so the
 * request/response shape for each endpoint only has to be known here.
 */
export const authApi = {
  register: (phone) => apiClient.post("/api/auth/register", { phone }),
  generateOtp: (phone) => apiClient.post("/api/auth/otp/generate", { phone }),

  verifyOtp: (phone, otp) =>
    apiClient.post("/api/auth/otp/verify", {
      phone,
      otp,
    }),
};