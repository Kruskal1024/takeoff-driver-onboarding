import { apiClient } from "./client";

export const applicationsApi = {
  createApplication: (userId) =>
    apiClient.post("/api/applications", { userId }),

  updatePersonalInfo: (applicationId, payload) =>
    apiClient.put(
      `/api/applications/${applicationId}/personal-info`,
      payload
    ),

  createIdentityDocument: (applicationId, payload) =>
    apiClient.post(
      `/api/applications/${applicationId}/identity-document`,
      payload
    ),

  createVehicle: (applicationId, payload) =>
    apiClient.post(
      `/api/applications/${applicationId}/vehicle`,
      payload
    ),

  createVehicleDocument: (applicationId, payload) =>
    apiClient.post(
      `/api/applications/${applicationId}/vehicle-documents`,
      payload
    ),

  getReview: (applicationId) =>
    apiClient.get(`/api/applications/${applicationId}/review`),

  submitApplication: (applicationId) =>
    apiClient.post(`/api/applications/${applicationId}/submit`),
};