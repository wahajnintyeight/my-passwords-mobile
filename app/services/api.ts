/**
 * API service for communicating with the backend
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../config"
import { Credential } from "../models/credential"

/**
 * Configuring the apisauce instance.
 */
export const API_BASE_URL = "https://api.wahaj.codes:8443/v2/api"

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
})

/**
 * Helper function to set the auth token.
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.setHeader("Authorization", `Bearer ${token}`)
  } else {
    api.deleteHeader("Authorization")
  }
}

/**
 * Process the API response.
 */
const processResponse = async <T>(response: ApiResponse<any>) => {
  if (!response.ok) {
    const error = new Error(response.data?.message || "An unknown error occurred")
    throw error
  }

  return response.data as T
}

/**
 * API functions for credential management
 */
export const credentialApi = {
  /**
   * Fetch all credentials for the authenticated user.
   */
  async getCredentials(): Promise<Credential[]> {
    const response = await api.get("/credentials")
    return processResponse<Credential[]>(response)
  },

  /**
   * Create a new credential.
   */
  async createCredential(credential: Credential): Promise<Credential> {
    const response = await api.post("/credentials", credential)
    return processResponse<Credential>(response)
  },

  /**
   * Update an existing credential.
   */
  async updateCredential(id: string, credential: Partial<Credential>): Promise<Credential> {
    const response = await api.put(`/credentials/${id}`, credential)
    return processResponse<Credential>(response)
  },

  /**
   * Delete a credential.
   */
  async deleteCredential(id: string): Promise<boolean> {
    const response = await api.delete(`/credentials/${id}`)
    return processResponse<boolean>(response)
  },

  /**
   * Bulk import credentials.
   */
  async importCredentials(credentials: Credential[]): Promise<Credential[]> {
    const response = await api.post("/credentials/import", { credentials })
    return processResponse<Credential[]>(response)
  },
}

/**
 * API functions for authentication
 */
export const authApi = {
  /**
   * Authenticate with Google.
   */
  async googleAuth(idToken: string): Promise<{ token: string; user: any }> {
    const response = await api.post("/auth/google", { idToken })
    return processResponse<{ token: string; user: any }>(response)
  },

  /**
   * Refresh authentication token.
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post("/auth/refresh", { refreshToken })
    return processResponse<{ token: string }>(response)
  },

  /**
   * Verify the current token.
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    const response = await api.get("/auth/verify")
    return processResponse<{ valid: boolean }>(response)
  },
}

export default {
  api,
  setAuthToken,
  credentialApi,
  authApi,
}
