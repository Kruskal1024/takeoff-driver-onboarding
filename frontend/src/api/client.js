const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

/**
 * Thrown when the backend responds with a non-2xx status.
 * Kept small and serializable so callers can branch on `status`
 * or show `message` directly in the UI.
 */
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Shared request wrapper for every backend call in the app.
 *
 * Centralizing this means every feature (auth, OTP, applications, ...)
 * gets the same base URL resolution, JSON handling, and error shape
 * for free — individual pages never need to know the request plumbing.
 */
async function request(path, { method = "GET", body, headers, signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkError) {
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
      networkError
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error)) ||
      `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};
