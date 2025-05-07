/**
 * Service to handle authentication with Google
 */
import * as Google from "expo-auth-session/providers/google"
import { authApi, setAuthToken } from "./api"
import { storage } from "./storage-service"

const AUTH_TOKEN_KEY = "auth_token"
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token"
const USER_PROFILE_KEY = "user_profile"

/**
 * Class to handle authentication-related functionality
 */
export class AuthService {
  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<{
    token: string
    user: any
  }> {
    try {
      // Use expo-auth-session to authenticate with Google
      const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "YOUR_EXPO_CLIENT_ID", // Replace with actual client ID from environment
        iosClientId: "YOUR_IOS_CLIENT_ID", // Replace with actual client ID from environment
        androidClientId: "YOUR_ANDROID_CLIENT_ID", // Replace with actual client ID from environment
        webClientId: "YOUR_WEB_CLIENT_ID", // Replace with actual client ID from environment
      })

      if (response?.type === "success") {
        const { id_token } = response.params
        
        // Exchange the Google ID token for our app's token
        const authResponse = await authApi.googleAuth(id_token)
        
        // Save authentication data
        await this.saveAuthData(authResponse.token, authResponse.user)
        
        // Set the auth token for API calls
        setAuthToken(authResponse.token)
        
        return authResponse
      } else {
        throw new Error("Google authentication failed or was cancelled")
      }
    } catch (error) {
      console.error("Google authentication error:", error)
      throw error
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Clear auth token from API
      setAuthToken(null)
      
      // Remove saved auth data
      await storage.remove(AUTH_TOKEN_KEY)
      await storage.remove(AUTH_REFRESH_TOKEN_KEY)
      await storage.remove(USER_PROFILE_KEY)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storage.load(AUTH_TOKEN_KEY)
      
      if (!token) {
        return false
      }
      
      // Set token for API calls
      setAuthToken(token)
      
      // Verify token validity with the server
      const { valid } = await authApi.verifyToken()
      return valid
    } catch (error) {
      console.error("Authentication check error:", error)
      return false
    }
  }

  /**
   * Save authentication data to storage
   */
  private async saveAuthData(token: string, user: any): Promise<void> {
    await storage.save(AUTH_TOKEN_KEY, token)
    await storage.save(USER_PROFILE_KEY, JSON.stringify(user))
  }

  /**
   * Get the stored user profile
   */
  async getUserProfile(): Promise<any | null> {
    try {
      const userProfileStr = await storage.load(USER_PROFILE_KEY)
      
      if (userProfileStr) {
        return JSON.parse(userProfileStr)
      }
      
      return null
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await storage.load(AUTH_REFRESH_TOKEN_KEY)
      
      if (!refreshToken) {
        return null
      }
      
      const { token } = await authApi.refreshToken(refreshToken)
      
      if (token) {
        await storage.save(AUTH_TOKEN_KEY, token)
        setAuthToken(token)
        return token
      }
      
      return null
    } catch (error) {
      console.error("Token refresh error:", error)
      return null
    }
  }
}

export const authService = new AuthService()
